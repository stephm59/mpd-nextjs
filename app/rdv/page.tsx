import type { Metadata } from "next";
import { Suspense } from "react";
import { getServices, getVilles, getMarques } from "./actions";
import { RdvContactTabs } from "@/components/rdv/RdvContactTabs";
import HeaderSimple from "@/components/layout/HeaderSimple";

export const metadata: Metadata = {
  title: "Prendre rdv ou écrire à Mon p'tit Dépanneur",
  description: "Un entretien de chaudière ? Une demande de devis ? Prenez rdv en ligne avec Mon p'tit Dépanneur en 3 clics.",
  openGraph: {
    title: "Prendre rdv ou écrire à Mon p'tit Dépanneur",
    description: "Un entretien de chaudière ? Une demande de devis ? Prenez rdv en ligne avec Mon p'tit Dépanneur en 3 clics.",
    type: "website",
  },
};

export default async function RdvPage() {
  const [services, villes, marques] = await Promise.all([
    getServices(),
    getVilles(),
    getMarques(),
  ]);

  return (
    <>
      <HeaderSimple />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 lg:py-12">
        <div className="container max-w-4xl px-4">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Comment souhaitez-vous être aidé ?
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Réservez un créneau en ligne ou contactez-nous directement
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Chargement...</div>}>
            <RdvContactTabs services={services} villes={villes} marques={marques} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
