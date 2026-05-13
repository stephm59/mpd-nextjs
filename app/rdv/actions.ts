"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import {
  getDatePremierJourReservable,
  getDateDernierJourReservable,
  getJourSemaine,
  genererCreneauxJour,
} from "@/lib/rdv/dates";

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
