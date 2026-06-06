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
import { createEvent, deleteEvent } from "@/lib/google/calendar";
import { getTechniciensBusy, isTechAvailable } from "@/lib/google/availability";
import {
  envoyerEmailConfirmationClient,
  envoyerEmailAnnulationClient,
  envoyerEmailAnnulationEquipe,
  envoyerEmailNotificationEquipe,
} from "@/lib/brevo/emails";
import type { AnnulationData } from "@/lib/brevo/templates/annulation-client";
import type { NotificationEquipeData } from "@/lib/brevo/templates/notification-equipe";

type ServiceBase = Database["public"]["Tables"]["rdv_services"]["Row"];
export type Service = ServiceBase & {
  prix_min_centimes: number | null;
};
type Ville = Database["public"]["Tables"]["rdv_villes"]["Row"];
type Marque = Database["public"]["Tables"]["rdv_marques_chaudiere"]["Row"];

const SERVICE_ENTRETIEN_BALLON_ID = '18cc2ca6-0183-43c0-a170-51a10abcadf4';
const VILLES_LILLE_BALLON_IDS = [
  '4aeec05d-9361-41c2-ac77-7ed677df6498', // Lille (59000)
  '1961b8b8-d823-4136-9f6f-7dc5f3a92586', // Euralille (59777)
  'bdd8c4b2-362c-43f0-8a22-8eb5f210a002', // Lille centre (59800)
];
const DUREE_BALLON_LILLE_MIN = 30;

/**
 * Récupère tous les services actifs, triés par ordre,
 * enrichis avec le prix minimum (toutes villes confondues).
 */
export async function getServices(): Promise<Service[]> {
  const supabase = createServerClient();

  const [servicesRes, tarifsRes] = await Promise.all([
    supabase.from("rdv_services").select("*").eq("est_actif", true).order("ordre", { ascending: true }),
    supabase.from("rdv_tarifs_ville").select("service_id, prix_centimes"),
  ]);

  if (servicesRes.error) {
    console.error("[getServices] Erreur Supabase services:", servicesRes.error);
    return [];
  }
  if (tarifsRes.error) {
    console.error("[getServices] Erreur Supabase tarifs:", tarifsRes.error);
    // on continue quand même, prix_min_centimes sera null
  }

  // Calculer le MIN par service côté JS
  const prixMinByService = new Map<string, number>();
  for (const t of tarifsRes.data ?? []) {
    const current = prixMinByService.get(t.service_id);
    if (current === undefined || t.prix_centimes < current) {
      prixMinByService.set(t.service_id, t.prix_centimes);
    }
  }

  return (servicesRes.data ?? []).map((s) => ({
    ...s,
    prix_min_centimes: prixMinByService.get(s.id) ?? null,
  }));
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

export async function getTarifByVilleId(
  serviceId: string,
  villeId: string
): Promise<number | null> {
  const supabase = createServerClient();
  const { data: tarif, error } = await supabase
    .from("rdv_tarifs_ville")
    .select("prix_centimes")
    .eq("service_id", serviceId)
    .eq("ville_id", villeId)
    .maybeSingle();
  if (error) {
    console.error("[getTarifByVilleId] Erreur:", error);
    return null;
  }
  return tarif?.prix_centimes ?? null;
}

/** Durée d'un créneau en minutes selon la règle métier (101 € → 2h, ballon Lille → 30 min). */
const DUREE_ENTRETIEN_101_MIN = 120;
function dureeCreneauMinutes(
  dureeServiceParDefaut: number,
  prixCentimes: number | null,
  serviceId: string | null,
  villeId: string | null
): number {
  // TODO dette technique : ces règles métier en dur seront à factoriser un jour
  // (cf. mémoire projet) - duplique aussi dans app/admin/(protected)/rdv/nouveau/actions.ts
  if (prixCentimes === 10100) return DUREE_ENTRETIEN_101_MIN;
  if (
    serviceId === SERVICE_ENTRETIEN_BALLON_ID &&
    villeId !== null &&
    VILLES_LILLE_BALLON_IDS.includes(villeId)
  ) {
    return DUREE_BALLON_LILLE_MIN;
  }
  return dureeServiceParDefaut;
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
  villeId: string;
  marqueId?: string | null;
  technicienIdPrefere?: string | null;
}): Promise<CreneauDisponible[]> {
  const { serviceId, villeId, marqueId, technicienIdPrefere } = params;
  const supabase = createServerClient();

  const [parametres, serviceRes, techniciens, prixCentimes] = await Promise.all([
    getParametres(),
    supabase
      .from("rdv_services")
      .select("duree_minutes")
      .eq("id", serviceId)
      .maybeSingle(),
    getTechniciensPourService(serviceId),
    getTarifByVilleId(serviceId, villeId),
  ]);

  if (!serviceRes.data) return [];
  const dureeMinutes = dureeCreneauMinutes(
    serviceRes.data.duree_minutes,
    prixCentimes,
    serviceId,
    villeId
  );

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

  // Récupère les périodes d'occupation Google Calendar pour les techs compatibles.
  // Si OAuth pas connecté ou tech sans email_google : busyByTech ne contiendra pas ce tech
  // → considéré comme libre (fallback safe).
  const techIds = techsDispos.map((t) => t.id);
  const techsBusy = await getTechniciensBusy(techIds, datePremier, dateDernier);
  const busyByTech = new Map(techsBusy.map((t) => [t.technicienId, t.busySlots]));

  const creneaux: CreneauDisponible[] = [];
  let jour = new Date(datePremier);

  while (jour <= dateDernier) {
    const nomJour = getJourSemaine(jour);

    if (joursOuvres.includes(nomJour)) {
      const plages = nomJour === "vendredi" ? horairesVendredi : horairesLundiJeudi;
      const creneauxJour = genererCreneauxJour(jour, plages, dureeMinutes);

      for (const c of creneauxJour) {
        const techsLibres = techsDispos.filter((tech) => {
          const busySlots = busyByTech.get(tech.id);
          // Pas de data Google pour ce tech → considéré comme libre
          if (!busySlots) return true;
          return isTechAvailable(busySlots, c.debut, c.fin);
        });

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
    supabase.from("rdv_techniciens").select("prenom, email_workspace, email_google").eq("id", data.technicien_id).maybeSingle(),
    data.marque_id
      ? supabase.from("rdv_marques_chaudiere").select("nom").eq("id", data.marque_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  const serviceNom = serviceRes.data?.nom ?? null;
  const villeNom = villeRes.data?.nom ?? null;
  const villeCP = villeRes.data?.code_postal ?? null;
  const technicienPrenom = technicienRes.data?.prenom ?? null;
  const technicienEmail = technicienRes.data?.email_workspace ?? null;
  const technicienGoogleEmail = technicienRes.data?.email_google ?? null;
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

  // Google Calendar : crée l'event dans le cal du tech (si email_google présent + OAuth connecté).
  // Graceful degradation : un échec ici ne fait PAS échouer la réservation.
  if (technicienGoogleEmail) {
    try {
      const event = await createEvent(technicienGoogleEmail, {
        summary: `RDV ${reference} — ${data.client_prenom} ${data.client_nom}`,
        description: [
          `Service : ${serviceNom ?? "Intervention"}${marqueNom ? ` (${marqueNom})` : ""}`,
          `Référence : ${reference}`,
          `Téléphone : ${data.client_telephone}`,
          `Email : ${data.client_email}`,
          data.client_complement ? `Complément : ${data.client_complement}` : "",
          data.notes ? `\nNotes :\n${data.notes}` : "",
        ].filter(Boolean).join("\n"),
        location: `${data.client_adresse}, ${villeCP ?? ""} ${villeNom ?? ""}`.trim(),
        startDateTime: data.date_debut,
        endDateTime: data.date_fin,
      });

      await supabase
        .from("rdv_reservations")
        .update({
          google_event_id: event.eventId,
          google_event_calendar_id: event.calendarId,
          google_event_created_at: new Date().toISOString(),
        })
        .eq("id", reservation.id);
    } catch (err) {
      console.error("[creerReservation] Erreur Google Calendar:", err);
      // Pas de throw : la résa reste créée en base, l'équipe pourra ajouter l'event manuellement
    }
  }

  const notificationData: NotificationEquipeData = {
    reference: reference,
    client_prenom: data.client_prenom,
    client_nom: data.client_nom,
    client_email: data.client_email,
    client_telephone: data.client_telephone,
    client_adresse: data.client_adresse,
    client_complement: data.client_complement ?? null,
    notes: data.notes ?? null,
    service_nom: serviceNom ?? "Intervention",
    marque_nom: marqueNom,
    date_debut: data.date_debut,
    date_fin: data.date_fin,
    technicien_prenom: technicienPrenom ?? "Notre technicien",
    ville_nom: villeNom ?? "",
    ville_cp: villeCP ?? "",
    prix_centimes: data.prix_centimes,
  };

  await Promise.allSettled([
    envoyerEmailConfirmationClient(
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
    ),
    envoyerEmailNotificationEquipe(notificationData, technicienEmail),
  ]);

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
      service_nom_personnalise,
annule_at,
      google_event_id, google_event_calendar_id,
      service:rdv_services(nom),
      ville:rdv_villes(nom, code_postal),
      marque:rdv_marques_chaudiere(nom),
      technicien:rdv_techniciens(prenom, email_workspace)
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

  // Google Calendar : supprime l'event (si lié). Graceful degradation.
  if (reservation.google_event_id && reservation.google_event_calendar_id) {
    try {
      await deleteEvent(reservation.google_event_calendar_id, reservation.google_event_id);
    } catch (err) {
      console.error("[annulerReservation] Erreur Google Calendar:", err);
      // Pas de throw : l'annulation reste effective en base
    }
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
    service_nom: reservation.service_nom_personnalise ?? reservation.service?.nom ?? "Intervention",
    marque_nom: reservation.marque?.nom ?? null,
    date_debut: reservation.creneau_debut,
    date_fin: reservation.creneau_fin,
    technicien_prenom: reservation.technicien?.prenom ?? "Notre technicien",
    ville_nom: reservation.ville?.nom ?? "",
    ville_cp: reservation.ville?.code_postal ?? "",
    prix_centimes: reservation.prix_centimes,
  };

  const techEmail = reservation.technicien?.email_workspace ?? null;

  await Promise.allSettled([
    envoyerEmailAnnulationClient(emailData),
    envoyerEmailAnnulationEquipe(emailData, techEmail),
  ]);

  return { success: true, reference: reservation.reference };
}
