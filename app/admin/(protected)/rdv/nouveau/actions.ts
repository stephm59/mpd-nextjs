"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { reservationAdminSchema, type ReservationAdminInput } from "@/lib/admin/rdv-schema";
import {
  getDateDernierJourReservable,
  getJourSemaine,
  genererCreneauxJour,
} from "@/lib/rdv/dates";
import { getParametres, getTarifByVilleId } from "@/app/rdv/actions";
import { getTechniciensBusy, isTechAvailable } from "@/lib/google/availability";
import { createEvent } from "@/lib/google/calendar";
import { envoyerEmailConfirmationClient } from "@/lib/brevo/emails";
import { startOfDay } from "date-fns";

export type CreneauAdmin = {
  debut: string;
  fin: string;
  techniciens_libres: Array<{ id: string; prenom: string }>;
};

/** Tous les techs actifs, sans filtre compétence (Ophélie outrepasse). */
export async function getTechniciensActifs() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rdv_techniciens")
    .select("id, prenom, ordre")
    .eq("est_actif", true)
    .order("ordre", { ascending: true });
  if (error) {
    console.error("[getTechniciensActifs] Erreur:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Variante admin : pas de filtre compétence, pas de délai mini,
 * multi-techs candidats (au moins UN libre), créneaux passés exclus.
 *
 * Modes :
 * - Standard : serviceId fourni → durée déduite du service (avec règle 10100c → 120 min)
 * - Perso : dureeMinutes fourni (priorité sur serviceId si les deux présents)
 * - Aucun → retourne []
 */
export async function getCreneauxDisponiblesAdmin(params: {
  serviceId: string | null;
  dureeMinutes: number | null;
  villeId: string;
  technicienIds: string[];
}): Promise<CreneauAdmin[]> {
  const { serviceId, dureeMinutes: dureeManuelle, villeId, technicienIds } = params;
  if (technicienIds.length === 0) return [];

  const supabase = createServerClient();

  const [parametres, serviceRes, techsRes, prixCentimes] = await Promise.all([
    getParametres(),
    serviceId
      ? supabase.from("rdv_services").select("duree_minutes").eq("id", serviceId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("rdv_techniciens")
      .select("id, prenom, ordre")
      .in("id", technicienIds)
      .eq("est_actif", true),
    serviceId ? getTarifByVilleId(serviceId, villeId) : Promise.resolve(0),
  ]);

  // Détermination de la durée (priorité au mode perso si présent)
  let dureeMinutes: number;
  if (dureeManuelle !== null) {
    dureeMinutes = dureeManuelle;
  } else if (serviceRes.data) {
    const dureeService = serviceRes.data.duree_minutes;
    dureeMinutes = prixCentimes === 10100 ? 120 : dureeService;
  } else {
    return [];
  }

  const techsDispos = techsRes.data ?? [];
  if (techsDispos.length === 0) return [];

  const joursVisibles = parseInt(parametres["jours_visibles_futur"] ?? "30", 10);
  const joursOuvres = (parametres["jours_ouvres"] ?? "lundi,mardi,mercredi,jeudi,vendredi")
    .split(",").map((s) => s.trim().toLowerCase());
  const horairesLundiJeudi = (parametres["horaires_lundi_jeudi"] ?? "08:00-12:00,13:00-17:00")
    .split(",").map((s) => s.trim());
  const horairesVendredi = (parametres["horaires_vendredi"] ?? "08:00-12:00,13:00-16:00")
    .split(",").map((s) => s.trim());

  // Pas de délai mini : on part d'aujourd'hui
  const datePremier = startOfDay(new Date());
  const dateDernier = getDateDernierJourReservable(0, joursVisibles);
  const maintenant = new Date();

  const techIds = techsDispos.map((t) => t.id);
  const techsBusy = await getTechniciensBusy(techIds, datePremier, dateDernier);
  const busyByTech = new Map(techsBusy.map((t) => [t.technicienId, t.busySlots]));

  const creneaux: CreneauAdmin[] = [];
  let jour = new Date(datePremier);

  while (jour <= dateDernier) {
    const nomJour = getJourSemaine(jour);
    if (joursOuvres.includes(nomJour)) {
      const plages = nomJour === "vendredi" ? horairesVendredi : horairesLundiJeudi;
      const creneauxJour = genererCreneauxJour(jour, plages, dureeMinutes);

      for (const c of creneauxJour) {
        // Exclure les créneaux passés (utile pour aujourd'hui)
        if (c.debut < maintenant) continue;

        const techsLibres = techsDispos.filter((tech) => {
          const busySlots = busyByTech.get(tech.id);
          if (!busySlots) return true;
          return isTechAvailable(busySlots, c.debut, c.fin);
        });

        if (techsLibres.length > 0) {
          creneaux.push({
            debut: c.debut.toISOString(),
            fin: c.fin.toISOString(),
            techniciens_libres: techsLibres.map((t) => ({ id: t.id, prenom: t.prenom })),
          });
        }
      }
    }
    jour = new Date(jour);
    jour.setDate(jour.getDate() + 1);
  }

  return creneaux;
}

export type CreerReservationAdminResult =
  | { success: true; reservation_id: string; reference: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/** Crée une réservation admin (règles relâchées, email client optionnel, mode perso supporté). */
export async function creerReservationAdmin(
  input: ReservationAdminInput
): Promise<CreerReservationAdminResult> {
  const result = reservationAdminSchema.safeParse(input);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { success: false, error: "Validation échouée", fieldErrors };
  }
  const data = result.data;
  const modePerso = data.service_id === null;
  const reference = `RDV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const supabase = createAdminClient();

  const [serviceRes, villeRes, technicienRes, marqueRes] = await Promise.all([
    data.service_id
      ? supabase.from("rdv_services").select("nom").eq("id", data.service_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase.from("rdv_villes").select("nom, code_postal").eq("id", data.ville_id).maybeSingle(),
    supabase.from("rdv_techniciens").select("prenom, email_workspace, email_google").eq("id", data.technicien_id).maybeSingle(),
    data.marque_id
      ? supabase.from("rdv_marques_chaudiere").select("nom").eq("id", data.marque_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const serviceNom =
    data.service_nom_personnalise ?? serviceRes.data?.nom ?? "Intervention";
  const villeNom = villeRes.data?.nom ?? "";
  const villeCP = villeRes.data?.code_postal ?? "";
  const technicienPrenom = technicienRes.data?.prenom ?? "Notre technicien";
  const technicienGoogleEmail = technicienRes.data?.email_google ?? null;
  const marqueNom = marqueRes.data?.nom ?? null;

  const { data: reservation, error: insertError } = await supabase
    .from("rdv_reservations")
    .insert({
      service_id: data.service_id,
      service_nom_personnalise: data.service_nom_personnalise,
      duree_personnalisee_minutes: data.duree_personnalisee_minutes,
      description_intervention: data.description_intervention,
      prix_libre: data.prix_libre,
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
      reference,
      statut: "confirme",
    })
    .select("id, reference, annulation_token")
    .single();

  if (insertError || !reservation) {
    console.error("[creerReservationAdmin] Erreur insertion:", insertError);
    return { success: false, error: "Impossible de créer la réservation." };
  }

  // Google Calendar (graceful degradation, comme le public)
  if (technicienGoogleEmail) {
    try {
      const event = await createEvent(technicienGoogleEmail, {
        summary: `RDV ${reference} — ${data.client_prenom} ${data.client_nom}`,
        description: [
          `Service : ${serviceNom}${marqueNom ? ` (${marqueNom})` : ""}`,
          `Référence : ${reference}`,
          `Téléphone : ${data.client_telephone}`,
          `Email : ${data.client_email}`,
          data.client_complement ? `Complément : ${data.client_complement}` : "",
          data.description_intervention ? `\nDétails :\n${data.description_intervention}` : "",
          data.notes ? `\nNotes :\n${data.notes}` : "",
          modePerso ? "\n(Créée depuis l'admin — mode personnalisé)" : "\n(Créée depuis l'admin)",
        ].filter(Boolean).join("\n"),
        location: `${data.client_adresse}, ${villeCP} ${villeNom}`.trim(),
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
      console.error("[creerReservationAdmin] Erreur Google Calendar:", err);
    }
  }

  // Email confirmation client (sauf si Ophélie a décoché la case)
  if (data.envoyer_email_client) {
    try {
      await envoyerEmailConfirmationClient(
        { email: data.client_email, prenom: data.client_prenom, nom: data.client_nom },
        {
          reference,
          client_prenom: data.client_prenom,
          service_nom: serviceNom,
          marque_nom: marqueNom,
          date_debut: data.date_debut,
          date_fin: data.date_fin,
          technicien_prenom: technicienPrenom,
          ville_nom: villeNom,
          ville_cp: villeCP,
          client_adresse: data.client_adresse,
          client_complement: data.client_complement ?? null,
          prix_centimes: data.prix_centimes,
          prix_libre: data.prix_libre,
          description_intervention: data.description_intervention,
          annulation_token: reservation.annulation_token,
        }
      );
    } catch (err) {
      console.error("[creerReservationAdmin] Erreur email client:", err);
    }
  }

  // PAS d'email équipe (Ophélie l'a créée, elle sait)

  return { success: true, reservation_id: reservation.id, reference };
}
