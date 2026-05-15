"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin/session";

const villeAddSchema = z.object({
  code_postal: z.string().regex(/^[0-9]{5}$/, "Code postal invalide (5 chiffres)"),
  nom: z.string().min(2, "Nom trop court").max(100, "Nom trop long"),
});

const villeUpdateSchema = z.object({
  id: z.string().uuid(),
  nom: z.string().min(2).max(100),
});

const villeToggleSchema = z.object({
  id: z.string().uuid(),
  est_active: z.boolean(),
});

type ActionResult = { success: true } | { success: false; error: string };

async function checkAuth() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Non autorisé");
  }
}

export async function ajouterVilleAction(formData: FormData): Promise<ActionResult> {
  await checkAuth();

  const parsed = villeAddSchema.safeParse({
    code_postal: formData.get("code_postal"),
    nom: formData.get("nom"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = createAdminClient();

  const { data: existante } = await supabase
    .from("rdv_villes")
    .select("id")
    .eq("code_postal", parsed.data.code_postal)
    .eq("nom", parsed.data.nom)
    .maybeSingle();

  if (existante) {
    return { success: false, error: "Cette ville existe déjà avec ce CP." };
  }

  const { error } = await supabase
    .from("rdv_villes")
    .insert({
      code_postal: parsed.data.code_postal,
      nom: parsed.data.nom,
      est_active: true,
    });

  if (error) {
    console.error("[ajouterVilleAction] Erreur:", error);
    return { success: false, error: "Erreur lors de l'ajout." };
  }

  revalidatePath("/admin/villes");
  return { success: true };
}

export async function modifierVilleAction(formData: FormData): Promise<ActionResult> {
  await checkAuth();

  const parsed = villeUpdateSchema.safeParse({
    id: formData.get("id"),
    nom: formData.get("nom"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("rdv_villes")
    .update({ nom: parsed.data.nom })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[modifierVilleAction] Erreur:", error);
    return { success: false, error: "Erreur lors de la modification." };
  }

  revalidatePath("/admin/villes");
  return { success: true };
}

export async function toggleVilleActiveAction(id: string, estActive: boolean): Promise<ActionResult> {
  await checkAuth();

  const parsed = villeToggleSchema.safeParse({ id, est_active: estActive });

  if (!parsed.success) {
    return { success: false, error: "Paramètres invalides" };
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("rdv_villes")
    .update({ est_active: parsed.data.est_active })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[toggleVilleActiveAction] Erreur:", error);
    return { success: false, error: "Erreur lors de la modification." };
  }

  revalidatePath("/admin/villes");
  return { success: true };
}
