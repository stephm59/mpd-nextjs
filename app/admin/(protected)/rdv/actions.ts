"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { createEvent, deleteEvent, updateEventTime } from "@/lib/google/calendar";
import {
  envoyerEmailAnnulationClient,
  envoyerEmailAnnulationEquipe,
  envoyerEmailDeplacementClient,
  envoyerEmailDeplacementEquipe,
} from "@/lib/brevo/emails";
import type { AnnulationData } from "@/lib/brevo/templates/annulation-client";
import type { DeplacementData } from "@/lib/brevo/templates/deplacement-client";
import {
  deplacementAdminSchema,
  type DeplacementAdminInput,
} from "@/lib/rdv/schema-deplacement";

type ActionResult = { success: true } | { success: false; error: string };

/**
 * Déplacement d'un RDV par l'équipe.
 *
 * Règles relâchées par rapport au client : pas de délai de 48h, pas de limite
 * de nombre de déplacements, et le blocage `date_premiere_reservation` ne
 * s'applique pas (l'admin choisit ses créneaux via getCreneauxDisponiblesAdmin).
 *
 * Comme pour l'annulation admin : agenda Google mis à jour, emails client + équipe.
 */
export async function deplacerRdvAdminAction(
  input: DeplacementAdminInput
): Promise<ActionResult> {
  await checkAuth();

  const validation = deplacementAdminSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: "Données de déplacement invalides." };
  }
  const { reservation_id, date_debut, date_fin, technicien_id } = validation.data;

  const supabase = createAdminClient();

  const { data: reservation, error: fetchError } = await supabase
    .from("rdv_reservations")
    .select(`
      id, reference, statut,
      creneau_debut, creneau_fin, creneau_debut_initial,
      annule_at, technicien_id,
      client_prenom, client_nom, client_email,
      client_telephone, client_adresse, client_complement,
      prix_centimes, service_nom_personnalise, tiers_email,
      google_event_id, google_event_calendar_id,
      service:rdv_services(nom),
      ville:rdv_villes(nom, code_postal),
      marque:rdv_marques_chaudiere(nom)
    `)
    .eq("id", reservation_id)
    .maybeSingle();

  if (fetchError || !reservation) {
    console.error("[deplacerRdvAdminAction] Résa introuvable:", fetchError);
    return { success: false, error: "Réservation introuvable." };
  }

  if (reservation.statut === "annule" || reservation.annule_at) {
    return { success: false, error: "Cette réservation est annulée, elle ne peut pas être déplacée." };
  }

  if (new Date(date_fin) <= new Date(date_debut)) {
    return { success: false, error: "Le créneau de fin doit être après le créneau de début." };
  }

  const { data: nouveauTech } = await supabase
    .from("rdv_techniciens")
    .select("prenom, email_workspace, email_google")
    .eq("id", technicien_id)
    .maybeSingle();

  const { error: updateError } = await supabase
    .from("rdv_reservations")
    .update({
      creneau_debut: date_debut,
      creneau_fin: date_fin,
      technicien_id: technicien_id,
      deplace_at: new Date().toISOString(),
      deplace_par: "equipe",
      creneau_debut_initial: reservation.creneau_debut_initial ?? reservation.creneau_debut,
    })
    .eq("id", reservation_id);

  if (updateError) {
    console.error("[deplacerRdvAdminAction] Erreur update:", updateError);
    return { success: false, error: "Erreur lors du déplacement." };
  }

  const technicienChange = technicien_id !== reservation.technicien_id;
  const serviceNom =
    reservation.service_nom_personnalise ?? reservation.service?.nom ?? "Intervention";

  // Google Calendar : décalage ou changement d'agenda (graceful degradation)
  try {
    if (!technicienChange && reservation.google_event_id && reservation.google_event_calendar_id) {
      await updateEventTime(
        reservation.google_event_calendar_id,
        reservation.google_event_id,
        date_debut,
        date_fin
      );
    } else {
      if (reservation.google_event_id && reservation.google_event_calendar_id) {
        await deleteEvent(reservation.google_event_calendar_id, reservation.google_event_id);
      }
      if (nouveauTech?.email_google) {
        const event = await createEvent(nouveauTech.email_google, {
          summary: `RDV ${reservation.reference} — ${reservation.client_prenom} ${reservation.client_nom}`,
          description: [
            `Service : ${serviceNom}${reservation.marque?.nom ? ` (${reservation.marque.nom})` : ""}`,
            `Référence : ${reservation.reference}`,
            `Téléphone : ${reservation.client_telephone}`,
            `Email : ${reservation.client_email}`,
            "",
            "RDV déplacé par l'équipe.",
          ].join("\n"),
          location: `${reservation.client_adresse}, ${reservation.ville?.code_postal ?? ""} ${reservation.ville?.nom ?? ""}`.trim(),
          startDateTime: date_debut,
          endDateTime: date_fin,
        });
        await supabase
          .from("rdv_reservations")
          .update({
            google_event_id: event.eventId,
            google_event_calendar_id: event.calendarId,
            google_event_created_at: new Date().toISOString(),
          })
          .eq("id", reservation_id);
      } else {
        await supabase
          .from("rdv_reservations")
          .update({ google_event_id: null, google_event_calendar_id: null })
          .eq("id", reservation_id);
      }
    }
  } catch (err) {
    console.error("[deplacerRdvAdminAction] Erreur Google Calendar:", err);
    // Pas de throw : le déplacement reste effectif en base
  }

  const emailData: DeplacementData = {
    reference: reservation.reference ?? "",
    client_prenom: reservation.client_prenom ?? "",
    client_nom: reservation.client_nom,
    client_email: reservation.client_email,
    client_adresse: reservation.client_adresse,
    client_complement: reservation.client_complement,
    service_nom: serviceNom,
    marque_nom: reservation.marque?.nom ?? null,
    ancienne_date_debut: reservation.creneau_debut,
    ancienne_date_fin: reservation.creneau_fin,
    date_debut,
    date_fin,
    technicien_prenom: nouveauTech?.prenom ?? "Notre technicien",
    ville_nom: reservation.ville?.nom ?? "",
    ville_cp: reservation.ville?.code_postal ?? "",
    prix_centimes: reservation.prix_centimes,
    deplace_par: "equipe",
  };

  const cc = reservation.tiers_email ? [reservation.tiers_email] : undefined;

  await Promise.allSettled([
    envoyerEmailDeplacementClient(emailData, cc),
    envoyerEmailDeplacementEquipe(emailData, nouveauTech?.email_workspace ?? null),
  ]);

  revalidatePath("/admin/rdv");
  revalidatePath(`/admin/rdv/${reservation_id}`);
  return { success: true };
}

async function checkAuth() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Non autorisé");
  }
}

/**
 * Annulation admin d'un RDV (par Ophélie ou un autre membre de l'équipe).
 * Comportement systématique :
 * - Met statut='annule', annule_at=now, annule_par='equipe'
 * - Supprime l'event Google Calendar (si lié)
 * - Envoie l'email d'annulation au client
 * - Envoie l'email d'annulation à l'équipe
 *
 * Pas de vérification de délai (règles admin relâchées).
 * Pas de motif libre (pas de colonne dédiée dans le schéma actuel).
 */
export async function annulerRdvAdminAction(id: string): Promise<ActionResult> {
  await checkAuth();

  if (!id || typeof id !== "string") {
    return { success: false, error: "ID invalide" };
  }

  const supabase = createAdminClient();

  // Charger la résa complète AVANT update, pour avoir les données nécessaires
  // (notamment google_event_*, et toutes les jointures pour l'email)
  const { data: reservation, error: fetchError } = await supabase
    .from("rdv_reservations")
    .select(`
      id,
      reference,
      client_prenom,
      client_nom,
      client_email,
      client_adresse,
      client_complement,
      creneau_debut,
      creneau_fin,
      prix_centimes,
      service_nom_personnalise,
      tiers_email,
      statut,
      google_event_id,
      google_event_calendar_id,
      service:rdv_services(nom),
      marque:rdv_marques_chaudiere(nom),
      ville:rdv_villes(nom, code_postal),
      technicien:rdv_techniciens(prenom, email_workspace)
    `)
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !reservation) {
    console.error("[annulerRdvAdminAction] Résa introuvable:", fetchError);
    return { success: false, error: "Réservation introuvable." };
  }

  if (reservation.statut === "annule") {
    return { success: false, error: "Cette réservation est déjà annulée." };
  }

  // Update statut
  const { error: updateError } = await supabase
    .from("rdv_reservations")
    .update({
      statut: "annule",
      annule_at: new Date().toISOString(),
      annule_par: "equipe",
    })
    .eq("id", id);

  if (updateError) {
    console.error("[annulerRdvAdminAction] Erreur update:", updateError);
    return { success: false, error: "Erreur lors de l'annulation." };
  }

  // Google Calendar : supprime l'event lié (graceful degradation)
  if (reservation.google_event_id && reservation.google_event_calendar_id) {
    try {
      await deleteEvent(reservation.google_event_calendar_id, reservation.google_event_id);
    } catch (err) {
      console.error("[annulerRdvAdminAction] Erreur suppression event Google:", err);
      // Pas de throw : l'annulation reste effective en base, l'event sera à supprimer à la main
    }
  }

  // Garde-fou : si données manquantes pour les emails, on log mais on ne plante pas
  if (!reservation.reference || !reservation.client_prenom) {
    console.error("[annulerRdvAdminAction] Données manquantes pour envoi email:", id);
    revalidatePath("/admin/rdv");
    revalidatePath(`/admin/rdv/${id}`);
    return { success: true };
  }

  // Prépare les données pour les emails (même format que côté public)
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

  const ccAnnulation = reservation.tiers_email ? [reservation.tiers_email] : undefined;

  // Envoi des 2 emails en parallèle (graceful degradation : un échec n'arrête pas l'autre)
  await Promise.allSettled([
    envoyerEmailAnnulationClient(emailData, ccAnnulation),
    envoyerEmailAnnulationEquipe(emailData, techEmail),
  ]);

  revalidatePath("/admin/rdv");
  revalidatePath(`/admin/rdv/${id}`);
  return { success: true };
}
