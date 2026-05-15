"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/session";

type ActionResult = { success: true } | { success: false; error: string };

async function checkAuth() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Non autorisé");
  }
}

/**
 * Annulation admin d'un RDV.
 * Met statut='annule', annule_at=now, annule_par='equipe'.
 * Pas de motif libre (pas de colonne dédiée dans le schéma actuel).
 */
export async function annulerRdvAdminAction(id: string): Promise<ActionResult> {
  await checkAuth();

  if (!id || typeof id !== "string") {
    return { success: false, error: "ID invalide" };
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("rdv_reservations")
    .update({
      statut: "annule",
      annule_at: new Date().toISOString(),
      annule_par: "equipe",
    })
    .eq("id", id);

  if (error) {
    console.error("[annulerRdvAdminAction]", error);
    return { success: false, error: "Erreur lors de l'annulation." };
  }

  revalidatePath("/admin/rdv");
  revalidatePath(`/admin/rdv/${id}`);
  return { success: true };
}
