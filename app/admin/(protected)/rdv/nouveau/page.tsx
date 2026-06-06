import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServices } from "@/app/rdv/actions";
import { getTechniciensActifs } from "./actions";
import { AdminReservationForm } from "./AdminReservationForm";

export const metadata: Metadata = {
  title: "Nouvelle réservation - Admin MPD",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NouveauRdvPage() {
  const supabase = createAdminClient();
  const [services, villesRes, marquesRes, techniciens] = await Promise.all([
    getServices(),
    supabase.from("rdv_villes").select("*").eq("est_active", true).order("nom"),
    supabase.from("rdv_marques_chaudiere").select("*").eq("est_active", true).order("ordre"),
    getTechniciensActifs(),
  ]);

  return (
    <div>
      <Link
        href="/admin/rdv"
        className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux réservations
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Nouvelle réservation</h1>
      <p className="text-slate-500 mb-8">
        Créez une réservation pour un client. Toutes les règles du tunnel public sont relâchées.
      </p>
      <AdminReservationForm
        services={services}
        villes={villesRes.data ?? []}
        marques={marquesRes.data ?? []}
        techniciens={techniciens}
      />
    </div>
  );
}
