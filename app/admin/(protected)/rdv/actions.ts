"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { deleteEvent } from "@/lib/google/calendar";
import {
  envoyerEmailAnnulationClient,
  envoyerEmailAnnulationEquipe,
} from "@/lib/brevo/emails";
import type { AnnulationData } from "@/lib/brevo/templates/annulation-client";

type ActionResult = { success: true } | { success: false; error: string };

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

  // Envoi des 2 emails en parallèle (graceful degradation : un échec n'arrête pas l'autre)
  await Promise.allSettled([
    envoyerEmailAnnulationClient(emailData),
    envoyerEmailAnnulationEquipe(emailData, techEmail),
  ]);

  revalidatePath("/admin/rdv");
  revalidatePath(`/admin/rdv/${id}`);
  return { success: true };
}
