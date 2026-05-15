import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { TarifsClient } from "./TarifsClient";

export const metadata: Metadata = {
  title: "Tarifs - Admin MPD",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TarifsPage() {
  const supabase = createAdminClient();

  const [servicesRes, villesRes, tarifsRes] = await Promise.all([
    supabase.from("rdv_services").select("id, nom, slug").order("ordre", { ascending: true }),
    supabase.from("rdv_villes").select("id, code_postal, nom").order("code_postal", { ascending: true }),
    supabase.from("rdv_tarifs_ville").select("id, service_id, ville_id, prix_centimes"),
  ]);

  const services = servicesRes.data ?? [];
  const villes = villesRes.data ?? [];
  const tarifs = tarifsRes.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Tarifs</h1>
      <p className="text-slate-500 mb-8">
        Définissez les prix par service et par ville. Cliquez sur un prix pour le modifier.
      </p>

      <TarifsClient services={services} villes={villes} tarifs={tarifs} />
    </div>
  );
}
