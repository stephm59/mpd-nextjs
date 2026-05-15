import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rendez-vous annulé | Mon p'tit Dépanneur",
  description: "Votre rendez-vous a bien été annulé.",
  robots: { index: false, follow: false },
};

type Params = Promise<{ token: string }>;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SuccesAnnulationPage({ params }: { params: Params }) {
  const { token } = await params;

  if (!UUID_REGEX.test(token)) {
    notFound();
  }

  const supabase = createAdminClient();

  const { data: reservation } = await supabase
    .from("rdv_reservations")
    .select("reference, statut")
    .eq("annulation_token", token)
    .maybeSingle();

  if (!reservation || reservation.statut !== "annule") {
    notFound();
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
        <CheckCircle2 className="w-10 h-10 text-slate-500" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-2">
        Votre rendez-vous a bien été annulé
      </h1>

      {reservation.reference && (
        <p className="text-muted-foreground mb-2">
          Référence : <strong className="text-foreground">{reservation.reference}</strong>
        </p>
      )}

      <p className="text-muted-foreground mb-8">
        Un email de confirmation vient de vous être envoyé.
      </p>

      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 text-left">
            <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Pour toute question</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Appelez-nous au{" "}
                <a href="tel:+33328534868" className="font-semibold text-primary hover:underline">
                  03 28 53 48 68
                </a>
                {" "}du lundi au vendredi de 8h à 17h.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
        <Button asChild>
          <Link href="/rdv">Réserver un nouveau rendez-vous</Link>
        </Button>
      </div>
    </main>
  );
}
