import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRdvDetail } from "@/lib/admin/rdv";
import { createAdminClient } from "@/lib/supabase/admin";
import { RdvDetailClient } from "./RdvDetailClient";

export const metadata: Metadata = {
  title: "Détail RDV - Admin MPD",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RdvDetailPage({ params }: PageProps) {
  const { id } = await params;
  const rdv = await getRdvDetail(id);

  if (!rdv) notFound();

  // Identifiants bruts nécessaires au déplacement (getRdvDetail ne renvoie que
  // les libellés). Requête à part pour ne pas modifier le type partagé RdvDetail.
  const supabase = createAdminClient();
  const { data: ids } = await supabase
    .from("rdv_reservations")
    .select("service_id, ville_id, technicien_id, duree_personnalisee_minutes, deplace_at, deplace_par, creneau_debut_initial")
    .eq("id", id)
    .maybeSingle();

  return (
    <div>
      <Link href="/admin/rdv" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Retour à la liste
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        RDV {rdv.reference ?? "(sans référence)"}
      </h1>

      <RdvDetailClient
        rdv={rdv}
        deplacement={
          ids
            ? {
                serviceId: ids.service_id,
                villeId: ids.ville_id,
                technicienId: ids.technicien_id,
                dureePersoMinutes: ids.duree_personnalisee_minutes,
                deplaceAt: ids.deplace_at,
                deplacePar: ids.deplace_par,
                creneauDebutInitial: ids.creneau_debut_initial,
              }
            : null
        }
      />
    </div>
  );
}
