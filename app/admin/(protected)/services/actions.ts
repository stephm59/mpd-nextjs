"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin/session";

type ActionResult = { success: true } | { success: false; error: string };

async function checkAuth() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Non autorisé");
  }
}

const nomSchema = z.object({
  id: z.string().uuid(),
  nom: z.string().min(2).max(100),
});

export async function modifierServiceNomAction(id: string, nom: string): Promise<ActionResult> {
  await checkAuth();
  const parsed = nomSchema.safeParse({ id, nom });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("rdv_services")
    .update({ nom: parsed.data.nom })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[modifierServiceNomAction]", error);
    return { success: false, error: "Erreur lors de la modification." };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

const dureeSchema = z.object({
  id: z.string().uuid(),
  duree_minutes: z.number().int().min(5).max(480),
});

export async function modifierServiceDureeAction(id: string, dureeStr: string): Promise<ActionResult> {
  await checkAuth();

  const duree = parseInt(dureeStr, 10);
  if (Number.isNaN(duree)) {
    return { success: false, error: "Durée invalide" };
  }

  const parsed = dureeSchema.safeParse({ id, duree_minutes: duree });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Durée invalide (entre 5 et 480 min)" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("rdv_services")
    .update({ duree_minutes: parsed.data.duree_minutes })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[modifierServiceDureeAction]", error);
    return { success: false, error: "Erreur lors de la modification." };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function modifierServiceOrdreAction(id: string, nouvelOrdre: number): Promise<ActionResult> {
  await checkAuth();

  if (!Number.isInteger(nouvelOrdre) || nouvelOrdre < 0) {
    return { success: false, error: "Ordre invalide" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("rdv_services")
    .update({ ordre: nouvelOrdre })
    .eq("id", id);

  if (error) {
    console.error("[modifierServiceOrdreAction]", error);
    return { success: false, error: "Erreur lors du changement d'ordre." };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function toggleServiceDevisAction(id: string, estDevis: boolean): Promise<ActionResult> {
  await checkAuth();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("rdv_services")
    .update({ est_devis: estDevis })
    .eq("id", id);

  if (error) {
    console.error("[toggleServiceDevisAction]", error);
    return { success: false, error: "Erreur lors du changement de type." };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function toggleServiceActifAction(id: string, estActif: boolean): Promise<ActionResult> {
  await checkAuth();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("rdv_services")
    .update({ est_actif: estActif })
    .eq("id", id);

  if (error) {
    console.error("[toggleServiceActifAction]", error);
    return { success: false, error: "Erreur lors du changement d'état." };
  }

  revalidatePath("/admin/services");
  return { success: true };
}
