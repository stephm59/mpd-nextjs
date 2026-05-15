import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { VillesClient } from "./VillesClient";

export const metadata: Metadata = {
  title: "Villes & codes postaux - Admin MPD",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VillesPage() {
  const supabase = createAdminClient();

  const { data: villes } = await supabase
    .from("rdv_villes")
    .select("id, code_postal, nom, est_active")
    .order("code_postal", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Villes &amp; codes postaux</h1>
      <p className="text-slate-500 mb-8">
        {villes?.length ?? 0} villes en base — gérez ici la zone d&apos;intervention de MPD
      </p>

      <VillesClient villes={villes ?? []} />
    </div>
  );
}
