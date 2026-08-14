import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Phone } from "lucide-react";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatInTimeZone } from "date-fns-tz";
import type { Metadata } from "next";
import HeaderSimple from "@/components/layout/HeaderSimple";

export const metadata: Metadata = {
  title: "Rendez-vous déplacé | Mon p'tit Dépanneur",
  description: "Votre rendez-vous a bien été déplacé.",
  robots: { index: false, follow: false },
};

type Params = Promise<{ token: string }>;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SuccesDeplacementPage({ params }: { params: Params }) {
  const { token } = await params;

  if (!UUID_REGEX.test(token)) {
    notFound();
  }

  const supabase = createAdminClient();

  const { data: reservation } = await supabase
    .from("rdv_reservations")
    .select(`
      reference, statut, creneau_debut, creneau_fin, deplace_at,
      technicien:rdv_techniciens(prenom)
    `)
    .eq("annulation_token", token)
    .maybeSingle();

  if (!reservation || !reservation.deplace_at || reservation.statut === "annule") {
    notFound();
  }

  const dateDebut = new Date(reservation.creneau_debut);
  const dateFin = new Date(reservation.creneau_fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");

  return (
    <>
      <HeaderSimple />
      <main className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Votre rendez-vous a bien été déplacé
        </h1>

        {reservation.reference && (
          <p className="text-muted-foreground mb-6">
            Référence : <strong className="text-foreground">{reservation.reference}</strong>
          </p>
        )}

        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Nouveau rendez-vous
            </p>
            <p className="mt-2 text-xl font-bold text-foreground">
              {formatJourLong(dateDebut)} {dateDebut.getFullYear()}
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {heureDebut} - {heureFin}
            </p>
            {reservation.technicien && (
              <p className="mt-2 text-sm text-muted-foreground">
                Technicien : {reservation.technicien.prenom}
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-muted-foreground mb-8">
          Un email de confirmation vient de vous être envoyé.
        </p>

        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 text-left">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Un imprévu ?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Un rendez-vous ne peut être déplacé qu&apos;une fois en ligne. Pour tout
                  changement, appelez-nous au{" "}
                  <a href="tel:+33328534868" className="font-semibold text-primary hover:underline">
                    03 28 53 48 68
                  </a>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </main>
    </>
  );
}
