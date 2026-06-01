import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { listerRdvs } from "@/lib/admin/rdv";
import { RdvListClient } from "./RdvListClient";

export const metadata: Metadata = {
  title: "Réservations - Admin MPD",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    statut?: string;
    tech?: string;
    service?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function RdvListPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const supabase = createAdminClient();
  const [techsRes, servicesRes, listeRes] = await Promise.all([
    supabase.from("rdv_techniciens").select("id, prenom").order("prenom"),
    supabase.from("rdv_services").select("id, nom").order("ordre"),
    listerRdvs({
      statut: (params.statut as "tous" | "confirme" | "annule" | "a_venir" | "passe" | undefined) ?? "tous",
      technicienId: params.tech,
      serviceId: params.service,
      recherche: params.q,
      page: params.page ? parseInt(params.page, 10) : 1,
    }),
  ]);

  return (
    <div>
      <div className="flex items-start justify-between mb-2 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Réservations</h1>
        <Link
          href="/admin/rdv/nouveau"
          className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 whitespace-nowrap"
        >
          + Nouvelle réservation
        </Link>
      </div>
      <p className="text-slate-500 mb-6">
        {listeRes.total} RDV au total — page {listeRes.page} sur {listeRes.totalPages}
      </p>

      <RdvListClient
        rdvs={listeRes.rdvs}
        total={listeRes.total}
        page={listeRes.page}
        totalPages={listeRes.totalPages}
        techniciens={techsRes.data ?? []}
        services={servicesRes.data ?? []}
        filtresInit={{
          statut: params.statut ?? "tous",
          tech: params.tech ?? "",
          service: params.service ?? "",
          q: params.q ?? "",
        }}
      />
    </div>
  );
}
