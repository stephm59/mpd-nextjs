import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock, Phone, AlertTriangle } from "lucide-react";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatInTimeZone } from "date-fns-tz";
import { DELAI_DEPLACEMENT_HEURES, MAX_DEPLACEMENTS_CLIENT } from "@/lib/rdv/schema-deplacement";
import { DeplacerRdvClient } from "@/components/rdv/DeplacerRdvClient";
import HeaderSimple from "@/components/layout/HeaderSimple";

export const metadata: Metadata = {
  title: "Déplacer mon rendez-vous | Mon p'tit Dépanneur",
  description: "Choisir un nouveau créneau pour votre rendez-vous Mon p'tit Dépanneur.",
  robots: { index: false, follow: false },
};

type Params = Promise<{ token: string }>;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function DeplacerPage({ params }: { params: Params }) {
  const { token } = await params;

  if (!UUID_REGEX.test(token)) {
    notFound();
  }

  const supabase = createAdminClient();

  const { data: reservation, error } = await supabase
    .from("rdv_reservations")
    .select(`
      id, reference, statut,
      creneau_debut, creneau_fin,
      annule_at, nb_deplacements_client,
      service_id, ville_id, marque_id,
      client_prenom,
      service:rdv_services(nom),
      ville:rdv_villes(nom, code_postal),
      marque:rdv_marques_chaudiere(nom),
      technicien:rdv_techniciens(prenom)
    `)
    .eq("annulation_token", token)
    .maybeSingle();

  if (error || !reservation) {
    notFound();
  }

  const dateDebut = new Date(reservation.creneau_debut);
  const dateFin = new Date(reservation.creneau_fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");
  const dateLong = `${formatJourLong(dateDebut)} ${dateDebut.getFullYear()}`;

  const maintenant = new Date();
  const heuresAvantRdv = (dateDebut.getTime() - maintenant.getTime()) / (1000 * 60 * 60);

  // Mêmes garde-fous que la Server Action : la page ne doit pas laisser entrevoir
  // un formulaire que l'action refusera derrière.
  if (reservation.statut === "annule" || reservation.annule_at) {
    return (
      <EtatMessage
        title="Ce rendez-vous a été annulé"
        message="Il n'est plus possible de le déplacer, mais vous pouvez en reprendre un quand vous voulez."
        reference={reservation.reference}
        montrerTelephone={false}
      />
    );
  }

  if (dateDebut < maintenant) {
    return (
      <EtatMessage
        title="Ce rendez-vous est déjà passé"
        message={`Le rendez-vous était prévu le ${dateLong}.`}
        reference={reservation.reference}
        montrerTelephone={false}
      />
    );
  }

  if (heuresAvantRdv < DELAI_DEPLACEMENT_HEURES) {
    return (
      <EtatMessage
        title="Déplacement en ligne impossible"
        message={`Il reste moins de ${DELAI_DEPLACEMENT_HEURES}h avant votre rendez-vous. Pour le décaler, appelez-nous.`}
        reference={reservation.reference}
        montrerTelephone
      />
    );
  }

  if ((reservation.nb_deplacements_client ?? 0) >= MAX_DEPLACEMENTS_CLIENT) {
    return (
      <EtatMessage
        title="Ce rendez-vous a déjà été déplacé"
        message="Un rendez-vous ne peut être déplacé qu'une seule fois en ligne. Pour le décaler à nouveau, appelez-nous."
        reference={reservation.reference}
        montrerTelephone
      />
    );
  }

  if (!reservation.service_id) {
    return (
      <EtatMessage
        title="Déplacement en ligne indisponible"
        message="Ce rendez-vous a été créé sur mesure par notre équipe. Appelez-nous pour le décaler."
        reference={reservation.reference}
        montrerTelephone
      />
    );
  }

  return (
    <>
      <HeaderSimple />
      <main className="container mx-auto max-w-4xl px-4 py-8 lg:py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CalendarClock className="w-9 h-9 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Déplacer votre rendez-vous</h1>
          <p className="mt-2 text-muted-foreground">
            Bonjour {reservation.client_prenom}, choisissez le créneau qui vous arrange.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Rendez-vous actuel
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {dateLong} · {heureDebut} - {heureFin}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {reservation.service?.nom}
                  {reservation.marque && ` · ${reservation.marque.nom}`}
                  {reservation.technicien && ` · ${reservation.technicien.prenom}`}
                  {reservation.ville && ` · ${reservation.ville.code_postal} ${reservation.ville.nom}`}
                </p>
              </div>
              <p className="font-mono text-sm font-bold tracking-wider text-foreground">
                {reservation.reference}
              </p>
            </div>
          </CardContent>
        </Card>

        <DeplacerRdvClient
          token={token}
          serviceId={reservation.service_id}
          villeId={reservation.ville_id}
          marqueId={reservation.marque_id}
          ancienDebut={reservation.creneau_debut}
          ancienFin={reservation.creneau_fin}
        />

        <div className="mt-10 text-center">
          <Link
            href={`/rdv/annuler/${token}`}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Je préfère annuler mon rendez-vous
          </Link>
        </div>
      </main>
    </>
  );
}

function EtatMessage({
  title,
  message,
  reference,
  montrerTelephone,
}: {
  title: string;
  message: string;
  reference: string | null;
  montrerTelephone: boolean;
}) {
  return (
    <>
      <HeaderSimple />
      <main className="container mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
            <AlertTriangle className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">{message}</p>
          {reference && (
            <p className="text-sm text-muted-foreground mb-6">
              Référence : <strong className="text-foreground">{reference}</strong>
            </p>
          )}
        </div>

        {montrerTelephone && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Contactez-nous directement</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <a href="tel:+33328534868" className="font-semibold text-primary hover:underline">
                      03 28 53 48 68
                    </a>{" "}
                    du lundi au vendredi de 8h à 17h.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
          <Button asChild>
            <Link href="/rdv">Réserver un rendez-vous</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
