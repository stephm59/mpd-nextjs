import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { differenceInCalendarMonths, startOfMonth } from "date-fns";

export interface KpiData {
  rdvMois: number;
  annulationsMois: number;
  tauxAnnulation: number;
  caPotentielMois: number;
  caReelMois: number;
  rdvAVenir: number;
}

export interface MoisData {
  mois: string;
  moisKey: string;
  confirmes: number;
  annules: number;
}

export interface TechData {
  technicien_prenom: string;
  count: number;
}

export interface ServiceData {
  service_nom: string;
  count: number;
}

function defaultPeriode(from?: Date, to?: Date): { debut: Date; fin: Date } {
  const now = new Date();
  return {
    debut: from ?? new Date(now.getFullYear(), now.getMonth(), 1),
    fin: to ?? new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
}

function default12Months(from?: Date, to?: Date): { debut: Date; fin: Date } {
  const now = new Date();
  return {
    debut: from ?? new Date(now.getFullYear(), now.getMonth() - 11, 1),
    fin: to ?? now,
  };
}

export async function getKpis(from?: Date, to?: Date): Promise<KpiData> {
  const supabase = createAdminClient();
  const { debut, fin } = defaultPeriode(from, to);

  const { data: rdvsPeriode } = await supabase
    .from("rdv_reservations")
    .select("statut, prix_centimes")
    .gte("creneau_debut", debut.toISOString())
    .lte("creneau_debut", fin.toISOString());

  const total = rdvsPeriode?.length ?? 0;
  const annulees = rdvsPeriode?.filter((r) => r.statut === "annule").length ?? 0;
  const tauxAnnulation = total > 0 ? Math.round((annulees / total) * 100) : 0;

  const caPotentiel = rdvsPeriode?.reduce((sum, r) => sum + r.prix_centimes, 0) ?? 0;
  const caReel =
    rdvsPeriode
      ?.filter((r) => r.statut !== "annule")
      .reduce((sum, r) => sum + r.prix_centimes, 0) ?? 0;

  // RDV à venir : toujours basé sur "maintenant" (futur), indépendant de la période
  const now = new Date();
  const { count: rdvAVenir } = await supabase
    .from("rdv_reservations")
    .select("id", { count: "exact", head: true })
    .gt("creneau_debut", now.toISOString())
    .neq("statut", "annule");

  return {
    rdvMois: total,
    annulationsMois: annulees,
    tauxAnnulation,
    caPotentielMois: caPotentiel,
    caReelMois: caReel,
    rdvAVenir: rdvAVenir ?? 0,
  };
}

export async function getStatsParMois(from?: Date, to?: Date): Promise<MoisData[]> {
  const supabase = createAdminClient();
  const { debut, fin } = default12Months(from, to);

  const { data: rdvs } = await supabase
    .from("rdv_reservations")
    .select("creneau_debut, statut")
    .gte("creneau_debut", debut.toISOString())
    .lte("creneau_debut", fin.toISOString())
    .order("creneau_debut", { ascending: true });

  // Nombre de mois à afficher (au moins 1)
  const nbMois = Math.max(1, differenceInCalendarMonths(fin, debut) + 1);
  const debutMois = startOfMonth(debut);

  const moisMap = new Map<string, { confirmes: number; annules: number; mois: string }>();
  for (let i = 0; i < nbMois; i++) {
    const d = new Date(debutMois.getFullYear(), debutMois.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
    moisMap.set(key, { confirmes: 0, annules: 0, mois: label });
  }

  for (const rdv of rdvs ?? []) {
    const d = new Date(rdv.creneau_debut);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = moisMap.get(key);
    if (!entry) continue;
    if (rdv.statut === "annule") entry.annules++;
    else entry.confirmes++;
  }

  return Array.from(moisMap.entries()).map(([moisKey, v]) => ({
    moisKey,
    mois: v.mois,
    confirmes: v.confirmes,
    annules: v.annules,
  }));
}

export async function getStatsParTech(from?: Date, to?: Date): Promise<TechData[]> {
  const supabase = createAdminClient();
  const { debut, fin } = default12Months(from, to);

  const { data } = await supabase
    .from("rdv_reservations")
    .select(`
      technicien:rdv_techniciens(prenom)
    `)
    .gte("creneau_debut", debut.toISOString())
    .lte("creneau_debut", fin.toISOString())
    .neq("statut", "annule");

  const map = new Map<string, number>();
  for (const r of data ?? []) {
    const prenom = (r.technicien as { prenom?: string } | null)?.prenom ?? "Inconnu";
    map.set(prenom, (map.get(prenom) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([technicien_prenom, count]) => ({ technicien_prenom, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getStatsParService(from?: Date, to?: Date): Promise<ServiceData[]> {
  const supabase = createAdminClient();
  const { debut, fin } = default12Months(from, to);

  const { data } = await supabase
    .from("rdv_reservations")
    .select(`
      service:rdv_services(nom)
    `)
    .gte("creneau_debut", debut.toISOString())
    .lte("creneau_debut", fin.toISOString())
    .neq("statut", "annule");

  const map = new Map<string, number>();
  for (const r of data ?? []) {
    const nom = (r.service as { nom?: string } | null)?.nom ?? "Inconnu";
    map.set(nom, (map.get(nom) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([service_nom, count]) => ({ service_nom, count }))
    .sort((a, b) => b.count - a.count);
}
