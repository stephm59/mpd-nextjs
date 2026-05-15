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

export const metadata: Metadata = {
  title: "Vue d'ensemble - Admin MPD",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [kpis, statsParMois, statsParTech, statsParService] = await Promise.all([
    getKpis(),
    getStatsParMois(),
    getStatsParTech(),
    getStatsParService(),
  ]);

  const moisActuelLabel = new Date().toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Vue d&apos;ensemble</h1>
      <p className="text-slate-500 mb-8 capitalize">{moisActuelLabel}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
