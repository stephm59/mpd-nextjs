import type { Metadata } from "next";
import { KpiCard } from "@/components/admin/KpiCard";
import { RdvParMoisChart } from "@/components/admin/charts/RdvParMoisChart";
import { RdvParTechChart } from "@/components/admin/charts/RdvParTechChart";
import { RdvParServiceChart } from "@/components/admin/charts/RdvParServiceChart";
import {
  getKpis,
  getStatsParMois,
  getStatsParTech,
  getStatsParService,
} from "@/lib/admin/stats";
import { formatPrice } from "@/lib/rdv/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolvePeriod } from "@/lib/admin/period";
import { PeriodSelector } from "@/components/admin/PeriodSelector";

export const metadata: Metadata = {
  title: "Vue d'ensemble - Admin MPD",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const period = resolvePeriod(params);

  const supabase = createAdminClient();

  const [
    kpis,
    statsParMois,
    statsParTech,
    statsParService,
    { count: nbMessagesMois },
    { count: nbMessagesTotal },
  ] = await Promise.all([
    getKpis(period.from, period.to),
    getStatsParMois(period.from, period.to),
    getStatsParTech(period.from, period.to),
    getStatsParService(period.from, period.to),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .gte("created_at", period.from.toISOString())
      .lte("created_at", period.to.toISOString()),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Vue d&apos;ensemble</h1>
      <p className="text-slate-500 mb-4">{period.label}</p>

      <PeriodSelector
        currentPreset={period.preset}
        currentFrom={period.from}
        currentTo={period.to}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard
          label="RDV ce mois"
          value={kpis.rdvMois}
          sublabel={kpis.rdvMois > 0 ? `dont ${kpis.annulationsMois} annulés` : "Aucune réservation"}
        />
        <KpiCard
          label="Taux d'annulation"
          value={`${kpis.tauxAnnulation}%`}
          sublabel={`${kpis.annulationsMois} sur ${kpis.rdvMois} RDV`}
          accent={kpis.tauxAnnulation > 20 ? "warning" : "default"}
        />
        <KpiCard
          label="CA réel ce mois"
          value={formatPrice(kpis.caReelMois)}
          sublabel={kpis.caPotentielMois > kpis.caReelMois ? `Potentiel : ${formatPrice(kpis.caPotentielMois)}` : "—"}
          accent="success"
        />
        <KpiCard
          label="RDV à venir"
          value={kpis.rdvAVenir}
          sublabel="Confirmés, futurs"
        />
        <KpiCard
          label="Messages contact"
          value={nbMessagesMois ?? 0}
          sublabel={`${nbMessagesTotal ?? 0} au total`}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <h2 className="text-base font-semibold text-slate-900 mb-1">
          Réservations par mois
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          12 derniers mois - confirmés vs annulés
        </p>
        <RdvParMoisChart data={statsParMois} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Réservations par technicien
          </h2>
          <p className="text-sm text-slate-500 mb-4">12 derniers mois</p>
          <RdvParTechChart data={statsParTech} />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Réservations par service
          </h2>
          <p className="text-sm text-slate-500 mb-4">12 derniers mois</p>
          <RdvParServiceChart data={statsParService} />
        </div>
      </div>
    </div>
  );
}
