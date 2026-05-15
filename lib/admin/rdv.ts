import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RdvListe {
  id: string;
  reference: string | null;
  creneau_debut: string;
  creneau_fin: string;
  statut: string;
  prix_centimes: number;
  client_prenom: string | null;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  service_nom: string | null;
  technicien_prenom: string | null;
  ville_nom: string | null;
  ville_cp: string | null;
  marque_nom: string | null;
}

export interface RdvFiltres {
  statut?: "tous" | "confirme" | "annule" | "a_venir" | "passe";
  technicienId?: string;
  serviceId?: string;
  recherche?: string;
  page?: number;
}

export interface RdvListePaginee {
  rdvs: RdvListe[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 20;

function buildBaseQuery(supabase: ReturnType<typeof createAdminClient>) {
  return supabase
    .from("rdv_reservations")
    .select(
      `
      id,
      reference,
      creneau_debut,
      creneau_fin,
      statut,
      prix_centimes,
      client_prenom,
      client_nom,
      client_email,
      client_telephone,
      service:rdv_services(nom),
      technicien:rdv_techniciens(prenom),
      ville:rdv_villes(nom, code_postal),
      marque:rdv_marques_chaudiere(nom)
    `,
      { count: "exact" }
    )
    .order("creneau_debut", { ascending: false });
}

function applyFilters<Q extends ReturnType<typeof buildBaseQuery>>(
  query: Q,
  filtres: RdvFiltres
): Q {
  let q = query;

  if (filtres.statut === "confirme") {
    q = q.neq("statut", "annule") as Q;
  } else if (filtres.statut === "annule") {
    q = q.eq("statut", "annule") as Q;
  } else if (filtres.statut === "a_venir") {
    q = q.gte("creneau_debut", new Date().toISOString()).neq("statut", "annule") as Q;
  } else if (filtres.statut === "passe") {
    q = q.lt("creneau_debut", new Date().toISOString()) as Q;
  }

  if (filtres.technicienId) {
    q = q.eq("technicien_id", filtres.technicienId) as Q;
  }

  if (filtres.serviceId) {
    q = q.eq("service_id", filtres.serviceId) as Q;
  }

  if (filtres.recherche) {
    // Sanitize : retirer , ( ) qui cassent la syntaxe .or() de PostgREST
    const sanitized = filtres.recherche.replace(/[,()]/g, " ").trim();
    if (sanitized) {
      const pattern = `%${sanitized}%`;
      q = q.or(
        `client_prenom.ilike.${pattern},client_nom.ilike.${pattern},client_email.ilike.${pattern},client_telephone.ilike.${pattern},reference.ilike.${pattern}`
      ) as Q;
    }
  }

  return q;
}

type RawRow = {
  id: string;
  reference: string | null;
  creneau_debut: string;
  creneau_fin: string;
  statut: string;
  prix_centimes: number;
  client_prenom: string | null;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  service: { nom?: string } | null;
  technicien: { prenom?: string } | null;
  ville: { nom?: string; code_postal?: string } | null;
  marque: { nom?: string } | null;
};

function flatten(r: RawRow): RdvListe {
  return {
    id: r.id,
    reference: r.reference,
    creneau_debut: r.creneau_debut,
    creneau_fin: r.creneau_fin,
    statut: r.statut,
    prix_centimes: r.prix_centimes,
    client_prenom: r.client_prenom,
    client_nom: r.client_nom,
    client_email: r.client_email,
    client_telephone: r.client_telephone,
    service_nom: r.service?.nom ?? null,
    technicien_prenom: r.technicien?.prenom ?? null,
    ville_nom: r.ville?.nom ?? null,
    ville_cp: r.ville?.code_postal ?? null,
    marque_nom: r.marque?.nom ?? null,
  };
}

export async function listerRdvs(filtres: RdvFiltres): Promise<RdvListePaginee> {
  const supabase = createAdminClient();

  const page = Math.max(1, filtres.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = applyFilters(buildBaseQuery(supabase), filtres);
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("[listerRdvs] Erreur:", error);
    return { rdvs: [], total: 0, page: 1, totalPages: 1 };
  }

  const rdvs = ((data as unknown as RawRow[] | null) ?? []).map(flatten);
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return { rdvs, total, page, totalPages };
}

export interface RdvDetail extends RdvListe {
  client_adresse: string;
  client_complement: string | null;
  notes: string | null;
  annule_at: string | null;
  annule_par: string | null;
  created_at: string;
}

export async function getRdvDetail(id: string): Promise<RdvDetail | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("rdv_reservations")
    .select(
      `
      id,
      reference,
      creneau_debut,
      creneau_fin,
      statut,
      prix_centimes,
      client_prenom,
      client_nom,
      client_email,
      client_telephone,
      client_adresse,
      client_complement,
      notes,
      annule_at,
      annule_par,
      created_at,
      service:rdv_services(nom),
      technicien:rdv_techniciens(prenom),
      ville:rdv_villes(nom, code_postal),
      marque:rdv_marques_chaudiere(nom)
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const raw = data as unknown as RawRow & {
    client_adresse: string;
    client_complement: string | null;
    notes: string | null;
    annule_at: string | null;
    annule_par: string | null;
    created_at: string;
  };

  return {
    ...flatten(raw),
    client_adresse: raw.client_adresse,
    client_complement: raw.client_complement,
    notes: raw.notes,
    annule_at: raw.annule_at,
    annule_par: raw.annule_par,
    created_at: raw.created_at,
  };
}

function escapeCSV(val: string | null | number): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export CSV : récupère TOUS les RDV correspondant aux filtres (ignore pagination).
 * Limite : Supabase JS retourne par défaut 1000 lignes max sans .range().
 */
export async function exporterRdvsCSV(filtres: Omit<RdvFiltres, "page">): Promise<string> {
  const supabase = createAdminClient();
  const query = applyFilters(buildBaseQuery(supabase), filtres);
  const { data, error } = await query;

  if (error) {
    console.error("[exporterRdvsCSV] Erreur:", error);
    return "";
  }

  const rdvs = ((data as unknown as RawRow[] | null) ?? []).map(flatten);

  const headers = [
    "Référence",
    "Date",
    "Heure début",
    "Heure fin",
    "Statut",
    "Client prénom",
    "Client nom",
    "Email",
    "Téléphone",
    "Service",
    "Marque",
    "Technicien",
    "Ville",
    "CP",
    "Prix (€)",
  ];

  const rows = rdvs.map((r) => {
    const debut = new Date(r.creneau_debut);
    const fin = new Date(r.creneau_fin);
    return [
      escapeCSV(r.reference),
      escapeCSV(debut.toLocaleDateString("fr-FR")),
      escapeCSV(debut.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })),
      escapeCSV(fin.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })),
      escapeCSV(r.statut),
      escapeCSV(r.client_prenom),
      escapeCSV(r.client_nom),
      escapeCSV(r.client_email),
      escapeCSV(r.client_telephone),
      escapeCSV(r.service_nom),
      escapeCSV(r.marque_nom),
      escapeCSV(r.technicien_prenom),
      escapeCSV(r.ville_nom),
      escapeCSV(r.ville_cp),
      escapeCSV((r.prix_centimes / 100).toFixed(2)),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
