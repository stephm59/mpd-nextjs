"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

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
