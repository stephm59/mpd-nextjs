"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin/session";

const tarifUpsertSchema = z.object({
  service_id: z.string().uuid(),
  ville_id: z.string().uuid(),
  prix_centimes: z.number().int().min(0).max(1000000),
});

type ActionResult = { success: true } | { success: false; error: string };

async function checkAuth() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Non autorisé");
  }
}

/**
 * Upsert d'un tarif (création ou modification).
 * Le prix d'entrée est en EUROS (string ou number), converti en centimes.
 */
export async function upsertTarifAction(
  serviceId: string,
  villeId: string,
  prixEurosInput: string | number
): Promise<ActionResult> {
  await checkAuth();

  let prixEuros: number;
  if (typeof prixEurosInput === "string") {
    const cleaned = prixEurosInput.replace(/[€\s]/g, "").replace(",", ".");
    prixEuros = parseFloat(cleaned);
    if (Number.isNaN(prixEuros)) {
      return { success: false, error: "Prix invalide" };
    }
  } else {
    prixEuros = prixEurosInput;
  }

  const prixCentimes = Math.round(prixEuros * 100);

  const parsed = tarifUpsertSchema.safeParse({
    service_id: serviceId,
    ville_id: villeId,
    prix_centimes: prixCentimes,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("rdv_tarifs_ville")
    .select("id")
    .eq("service_id", parsed.data.service_id)
    .eq("ville_id", parsed.data.ville_id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("rdv_tarifs_ville")
      .update({ prix_centimes: parsed.data.prix_centimes })
      .eq("id", existing.id);

    if (error) {
      console.error("[upsertTarifAction] Erreur update:", error);
      return { success: false, error: "Erreur lors de la modification." };
    }
  } else {
    const { error } = await supabase
      .from("rdv_tarifs_ville")
      .insert({
        service_id: parsed.data.service_id,
        ville_id: parsed.data.ville_id,
        prix_centimes: parsed.data.prix_centimes,
      });

    if (error) {
      console.error("[upsertTarifAction] Erreur insert:", error);
      return { success: false, error: "Erreur lors de la création." };
    }
  }

  revalidatePath("/admin/tarifs");
  return { success: true };
}
