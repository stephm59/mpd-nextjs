import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { ServicesClient } from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services - Admin MPD",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const supabase = createAdminClient();

  const { data: services } = await supabase
    .from("rdv_services")
    .select("id, nom, slug, duree_minutes, ordre, est_devis, est_actif, description")
    .order("ordre", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Services</h1>
      <p className="text-slate-500 mb-8">
        {services?.length ?? 0} services configurés — gérez les durées, ordres et types
      </p>

      <ServicesClient services={services ?? []} />
    </div>
  );
}
