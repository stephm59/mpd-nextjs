import type { Metadata } from "next";
import { getServices, getVilles, getMarques } from "./actions";
import { TunnelReservation } from "@/components/rdv/TunnelReservation";
import HeaderSimple from "@/components/layout/HeaderSimple";

export const metadata: Metadata = {
  title: "Prendre rendez-vous en ligne | Mon p'tit Dépanneur",
  description: "Réservez en ligne votre entretien chaudière ou votre devis (chaudière, salle de bains, pompe à chaleur, climatisation) à Lille et dans la métropole lilloise.",
  openGraph: {
    title: "Prendre rendez-vous en ligne | Mon p'tit Dépanneur",
    description: "Réservez en ligne votre entretien ou devis à Lille et alentours.",
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
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 lg:py-20">
        <div className="container max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Prendre rendez-vous en ligne
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Réservez votre intervention en quelques clics, 24h/24
            </p>
          </div>

          <TunnelReservation services={services} villes={villes} marques={marques} />

          <div className="mt-8 rounded-lg border border-urgent/30 bg-urgent/5 p-4 text-sm text-foreground">
            <p>
              <strong>Important :</strong> si votre chaudière est en panne, ne réservez pas en ligne.{" "}
              <a href="tel:0328534868" className="text-urgent font-semibold underline">
                Contactez-nous directement par téléphone
              </a>{" "}
              pour un dépannage rapide.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
