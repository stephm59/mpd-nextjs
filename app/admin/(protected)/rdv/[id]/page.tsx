import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRdvDetail } from "@/lib/admin/rdv";
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

  return (
    <div>
      <Link href="/admin/rdv" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Retour à la liste
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        RDV {rdv.reference ?? "(sans référence)"}
      </h1>

      <RdvDetailClient rdv={rdv} />
    </div>
  );
}
