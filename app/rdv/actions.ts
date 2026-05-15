"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";
import {
  getDatePremierJourReservable,
  getDateDernierJourReservable,
  getJourSemaine,
  genererCreneauxJour,
} from "@/lib/rdv/dates";
import { reservationSchema, type ReservationInput } from "@/lib/rdv/schema";
import { annulationSchema } from "@/lib/rdv/schema-annulation";
import {
  envoyerEmailConfirmationClient,
  envoyerEmailAnnulationClient,
  envoyerEmailAnnulationEquipe,
} from "@/lib/brevo/emails";
import type { AnnulationData } from "@/lib/brevo/templates/annulation-client";

type Service = Database["public"]["Tables"]["rdv_services"]["Row"];
type Ville = Database["public"]["Tables"]["rdv_villes"]["Row"];
type Marque = Database["public"]["Tables"]["rdv_marques_chaudiere"]["Row"];

/**
 * Récupère tous les services actifs, triés par ordre.
 */
export async function getServices(): Promise<Service[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rdv_services")
    .select("*")
    .eq("est_actif", true)
    .order("ordre", { ascending: true });

  if (error) {
    console.error("[getServices] Erreur Supabase:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Récupère toutes les villes actives, triées par nom.
 * Utilisé pour l'autocomplétion par code postal.
 */
export async function getVilles(): Promise<Ville[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rdv_villes")
    .select("*")
    .eq("est_active", true)
    .order("nom", { ascending: true });

  if (error) {
    console.error("[getVilles] Erreur Supabase:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Récupère le prix pour un service donné dans une ville donnée (par code postal).
 * Retourne null si aucun tarif trouvé.
 */
export async function getTarif(
  serviceSlug: string,
  codePostal: string
): Promise<number | null> {
  const supabase = createServerClient();

  const { data: service } = await supabase
    .from("rdv_services")
    .select("id")
    .eq("slug", serviceSlug)
    .single();

  if (!service) return null;

  const { data: ville } = await supabase
    .from("rdv_villes")
    .select("id")
    .eq("code_postal", codePostal)
    .single();

  if (!ville) return null;

  const { data: tarif } = await supabase
    .from("rdv_tarifs_ville")
    .select("prix_centimes")
    .eq("service_id", service.id)
    .eq("ville_id", ville.id)
    .single();

  return tarif?.prix_centimes ?? null;
}

/**
 * Récupère toutes les marques de chaudière actives.
 */
export async function getMarques(): Promise<Marque[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rdv_marques_chaudiere")
    .select("*")
    .eq("est_active", true)
    .order("ordre", { ascending: true });

  if (error) {
    console.error("[getMarques] Erreur Supabase:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Récupère le prix pour un service (par UUID) dans une ville (par code postal).
 * Utilise 2 requêtes simples plutôt qu'une jointure pour plus de fiabilité.
 * Retourne null si aucun tarif trouvé pour cette combinaison.
 */
export async function getTarifByCodePostal(
  serviceId: string,
  codePostal: string
): Promise<{ prix_centimes: number; ville_id: string; ville_nom: string } | null> {
  const supabase = createServerClient();

  const { data: ville, error: villeError } = await supabase
    .from("rdv_villes")
    .select("id, nom")
    .eq("code_postal", codePostal)
    .eq("est_active", true)
    .maybeSingle();

  if (villeError || !ville) {
    console.error("[getTarifByCodePostal] Ville non trouvée pour CP:", codePostal, villeError);
    return null;
  }

  const { data: tarif, error: tarifError } = await supabase
    .from("rdv_tarifs_ville")
    .select("prix_centimes")
    .eq("service_id", serviceId)
    .eq("ville_id", ville.id)
    .maybeSingle();

  if (tarifError || !tarif) {
    console.error("[getTarifByCodePostal] Tarif non trouvé pour service:", serviceId, "ville:", ville.id, tarifError);
    return null;
  }

  return {
    prix_centimes: tarif.prix_centimes,
    ville_id: ville.id,
    ville_nom: ville.nom,
  };
}

export async function getParametres(): Promise<Record<string, string>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rdv_parametres")
    .select("cle, valeur");

  if (error || !data) {
    console.error("[getParametres] Erreur:", error);
    return {};
  }
  return data.reduce((acc, p) => {
    acc[p.cle] = p.valeur;
    return acc;
  }, {} as Record<string, string>);
}

export async function getTechniciensPourService(
  serviceId: string
): Promise<Array<{ id: string; prenom: string; ordre: number }>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rdv_competences")
    .select("rdv_techniciens(id, prenom, ordre, est_actif)")
    .eq("service_id", serviceId);

  if (error || !data) {
    console.error("[getTechniciensPourService] Erreur:", error);
    return [];
  }

  type Row = {
    rdv_techniciens: {
      id: string;
      prenom: string;
      ordre: number;
      est_actif: boolean;
    } | null;
  };
  const rows = data as unknown as Row[];
  return rows
    .map((r) => r.rdv_techniciens)
    .filter((t): t is NonNullable<typeof t> => t !== null && t.est_actif)
    .map((t) => ({ id: t.id, prenom: t.prenom, ordre: t.ordre }))
    .sort((a, b) => a.ordre - b.ordre);
}

export type CreneauDisponible = {
  debut: string;
  fin: string;
  technicien_id: string;
  technicien_prenom: string;
};

/**
 * MOCK : à remplacer par la vraie logique Google Calendar à l'étape 3.7.
 */
export async function getCreneauxDisponibles(params: {
  serviceId: string;
  marqueId?: string | null;
  technicienIdPrefere?: string | null;
}): Promise<CreneauDisponible[]> {
  const { serviceId, marqueId, technicienIdPrefere } = params;
  const supabase = createServerClient();

  const [parametres, serviceRes, techniciens] = await Promise.all([
    getParametres(),
    supabase
      .from("rdv_services")
      .select("duree_minutes")
      .eq("id", serviceId)
      .maybeSingle(),
    getTechniciensPourService(serviceId),
  ]);

  if (!serviceRes.data) return [];
  const dureeMinutes = serviceRes.data.duree_minutes;

  const delaiMin = parseInt(parametres["delai_minimum_jours"] ?? "1", 10);
  const joursVisibles = parseInt(parametres["jours_visibles_futur"] ?? "30", 10);
  const joursOuvres = (parametres["jours_ouvres"] ?? "lundi,mardi,mercredi,jeudi,vendredi")
    .split(",")
    .map((s) => s.trim().toLowerCase());
  const horairesLundiJeudi = (parametres["horaires_lundi_jeudi"] ?? "08:00-12:00,13:00-17:00")
    .split(",")
    .map((s) => s.trim());
  const horairesVendredi = (parametres["horaires_vendredi"] ?? "08:00-12:00,13:00-16:00")
    .split(",")
    .map((s) => s.trim());

  let techsDispos = techniciens;
  if (marqueId) {
    const { data: marque } = await supabase
      .from("rdv_marques_chaudiere")
      .select("exclusif, technicien_specialiste_id")
      .eq("id", marqueId)
      .maybeSingle();
    if (marque?.exclusif && marque.technicien_specialiste_id) {
      techsDispos = techsDispos.filter((t) => t.id === marque.technicien_specialiste_id);
    }
  }
  if (technicienIdPrefere) {
    techsDispos = techsDispos.filter((t) => t.id === technicienIdPrefere);
  }
  if (techsDispos.length === 0) return [];

  const datePremier = getDatePremierJourReservable(delaiMin);
  const dateDernier = getDateDernierJourReservable(delaiMin, joursVisibles);

  const creneaux: CreneauDisponible[] = [];
  let jour = new Date(datePremier);

  while (jour <= dateDernier) {
    const nomJour = getJourSemaine(jour);

    if (joursOuvres.includes(nomJour)) {
      const plages = nomJour === "vendredi" ? horairesVendredi : horairesLundiJeudi;
      const creneauxJour = genererCreneauxJour(jour, plages, dureeMinutes);

      for (const c of creneauxJour) {
        const techsLibres = techsDispos.filter(() => Math.random() > 0.3);

        for (const tech of techsLibres) {
          creneaux.push({
            debut: c.debut.toISOString(),
            fin: c.fin.toISOString(),
            technicien_id: tech.id,
            technicien_prenom: tech.prenom,
          });
        }
      }
    }

    jour = new Date(jour);
    jour.setDate(jour.getDate() + 1);
  }

  return creneaux;
}

export type CreerReservationResult =
  | { success: true; reservation_id: string; reference: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Server Action : crée une réservation dans Supabase.
 * - Valide les données avec Zod
 * - Insère dans rdv_reservations (mapping date_debut→creneau_debut, date_fin→creneau_fin)
 * - Retourne le résultat (succès avec ID + référence, ou erreurs de validation)
 *
 * NOTE : à l'étape 3.7, on ajoutera ici la création de l'event Google Calendar.
 * NOTE : à l'étape 3.8, on ajoutera l'envoi d'email de confirmation via Resend.
 */
export async function creerReservation(
  input: ReservationInput
): Promise<CreerReservationResult> {
  const result = reservationSchema.safeParse(input);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return {
      success: false,
      error: "Validation échouée",
      fieldErrors,
    };
  }
  const data = result.data;

  const reference = `RDV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const supabase = createAdminClient();

  const [serviceRes, villeRes, technicienRes, marqueRes] = await Promise.all([
    supabase.from("rdv_services").select("nom").eq("id", data.service_id).maybeSingle(),
    supabase.from("rdv_villes").select("nom, code_postal").eq("id", data.ville_id).maybeSingle(),
    supabase.from("rdv_techniciens").select("prenom").eq("id", data.technicien_id).maybeSingle(),
    data.marque_id
      ? supabase.from("rdv_marques_chaudiere").select("nom").eq("id", data.marque_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  const serviceNom = serviceRes.data?.nom ?? null;
  const villeNom = villeRes.data?.nom ?? null;
  const villeCP = villeRes.data?.code_postal ?? null;
  const technicienPrenom = technicienRes.data?.prenom ?? null;
  const marqueNom = marqueRes.data?.nom ?? null;

  const { data: reservation, error: insertError } = await supabase
    .from("rdv_reservations")
    .insert({
      service_id: data.service_id,
      ville_id: data.ville_id,
      marque_id: data.marque_id,
      technicien_id: data.technicien_id,
      creneau_debut: data.date_debut,
      creneau_fin: data.date_fin,
      prix_centimes: data.prix_centimes,
      client_prenom: data.client_prenom,
      client_nom: data.client_nom,
      client_email: data.client_email,
      client_telephone: data.client_telephone,
      client_adresse: data.client_adresse,
      client_complement: data.client_complement,
      notes: data.notes,
      reference: reference,
      statut: "confirme",
    })
    .select("id, reference, annulation_token")
    .single();

  if (insertError || !reservation) {
    console.error("[creerReservation] Erreur insertion:", insertError);
    return {
      success: false,
      error: "Impossible de créer la réservation. Veuillez réessayer.",
    };
  }

  const emailResult = await envoyerEmailConfirmationClient(
    {
      email: data.client_email,
      prenom: data.client_prenom,
      nom: data.client_nom,
    },
    {
      reference: reference,
      client_prenom: data.client_prenom,
      service_nom: serviceNom ?? "Intervention",
      marque_nom: marqueNom,
      date_debut: data.date_debut,
      date_fin: data.date_fin,
      technicien_prenom: technicienPrenom ?? "Notre technicien",
      ville_nom: villeNom ?? "",
      ville_cp: villeCP ?? "",
      client_adresse: data.client_adresse,
      client_complement: data.client_complement ?? null,
      prix_centimes: data.prix_centimes,
      annulation_token: reservation.annulation_token,
    }
  );

  if (!emailResult.success) {
    console.warn(
      "[creerReservation] Email échoué mais réservation OK:",
      reference,
      emailResult.error
    );
  }

  return {
    success: true,
    reservation_id: reservation.id,
    reference: reference,
  };
}

export type AnnulerReservationResult =
  | { success: true; reference: string }
  | {
      success: false;
      error: string;
      raison?: "deja_annule" | "deadline_depassee" | "introuvable" | "rdv_passe";
    };

/**
 * Server Action : annule une réservation via son token d'annulation.
 * Vérifie : token valide, résa existe, pas déjà annulée, RDV pas passé, deadline 48h.
 */
export async function annulerReservation(
  token: string
): Promise<AnnulerReservationResult> {
  const validation = annulationSchema.safeParse({ token });
  if (!validation.success) {
    return { success: false, error: "Token invalide.", raison: "introuvable" };
  }

  const supabase = createAdminClient();

  const { data: reservation, error: fetchError } = await supabase
    .from("rdv_reservations")
    .select(`
      id, reference, statut,
      creneau_debut, creneau_fin,
      client_prenom, client_nom, client_email,
      client_telephone, client_adresse, client_complement,
      prix_centimes,
      annule_at,
      service:rdv_services(nom),
      ville:rdv_villes(nom, code_postal),
      marque:rdv_marques_chaudiere(nom),
      technicien:rdv_techniciens(prenom)
    `)
    .eq("annulation_token", token)
    .maybeSingle();

  if (fetchError || !reservation) {
    return {
      success: false,
      error: "Réservation introuvable. Le lien est peut-être invalide.",
      raison: "introuvable",
    };
  }

  if (reservation.statut === "annule" || reservation.annule_at) {
    return {
      success: false,
      error: "Cette réservation a déjà été annulée.",
      raison: "deja_annule",
    };
  }

  const maintenant = new Date();
  const debutRdv = new Date(reservation.creneau_debut);

  if (debutRdv < maintenant) {
    return {
      success: false,
      error: "Ce rendez-vous est déjà passé.",
      raison: "rdv_passe",
    };
  }

  const heuresAvantRdv = (debutRdv.getTime() - maintenant.getTime()) / (1000 * 60 * 60);
  if (heuresAvantRdv < 48) {
    return {
      success: false,
      error: "L'annulation en ligne n'est plus possible (moins de 48h avant le rendez-vous). Merci d'appeler le 03 28 53 48 68.",
      raison: "deadline_depassee",
    };
  }

  const { error: updateError } = await supabase
    .from("rdv_reservations")
    .update({
      statut: "annule",
      annule_at: maintenant.toISOString(),
      annule_par: "client",
    })
    .eq("id", reservation.id);

  if (updateError) {
    console.error("[annulerReservation] Erreur update:", updateError);
    return { success: false, error: "Erreur lors de l'annulation. Réessayez ou appelez-nous." };
  }

  if (!reservation.reference || !reservation.client_prenom) {
    console.error("[annulerReservation] Données manquantes pour envoi email:", reservation.id);
    return { success: true, reference: reservation.reference ?? "" };
  }

  const emailData: AnnulationData = {
    reference: reservation.reference,
    client_prenom: reservation.client_prenom,
    client_nom: reservation.client_nom,
    client_email: reservation.client_email,
    client_adresse: reservation.client_adresse,
    client_complement: reservation.client_complement,
    service_nom: reservation.service?.nom ?? "Intervention",
    marque_nom: reservation.marque?.nom ?? null,
    date_debut: reservation.creneau_debut,
    date_fin: reservation.creneau_fin,
    technicien_prenom: reservation.technicien?.prenom ?? "Notre technicien",
    ville_nom: reservation.ville?.nom ?? "",
    ville_cp: reservation.ville?.code_postal ?? "",
    prix_centimes: reservation.prix_centimes,
  };

  await Promise.allSettled([
    envoyerEmailAnnulationClient(emailData),
    envoyerEmailAnnulationEquipe(emailData),
  ]);

  return { success: true, reference: reservation.reference };
}
