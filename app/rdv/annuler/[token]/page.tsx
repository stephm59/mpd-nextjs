import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Calendar, Clock, MapPin, User, Tag, Phone } from "lucide-react";
import { formatPrice } from "@/lib/rdv/format";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatInTimeZone } from "date-fns-tz";
import { AnnulerButton } from "./AnnulerButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Annuler mon rendez-vous | Mon p'tit Dépanneur",
  description: "Annuler votre rendez-vous Mon p'tit Dépanneur.",
  robots: { index: false, follow: false },
};

type Params = Promise<{ token: string }>;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AnnulerPage({ params }: { params: Params }) {
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
      client_prenom, client_nom,
      client_adresse, client_complement,
      prix_centimes,
      annule_at,
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
  const dejaAnnule = reservation.statut === "annule" || reservation.annule_at !== null;
  const rdvPasse = dateDebut < maintenant;
  const heuresAvantRdv = (dateDebut.getTime() - maintenant.getTime()) / (1000 * 60 * 60);
  const deadlineDepassee = !rdvPasse && heuresAvantRdv < 48;

  if (dejaAnnule) {
    const annuleDate = reservation.annule_at
      ? formatInTimeZone(new Date(reservation.annule_at), "Europe/Paris", "dd/MM/yyyy 'à' HH:mm")
      : null;
    return (
      <EtatMessage
        type="info"
        title="Ce rendez-vous a déjà été annulé"
        message={annuleDate ? `Annulation enregistrée le ${annuleDate}.` : "Cette réservation est déjà annulée."}
        reference={reservation.reference}
      />
    );
  }

  if (rdvPasse) {
    return (
      <EtatMessage
        type="info"
        title="Ce rendez-vous est déjà passé"
        message={`Le rendez-vous était prévu le ${dateLong}. L'annulation n'est plus possible.`}
        reference={reservation.reference}
      />
    );
  }

  if (deadlineDepassee) {
    return (
      <EtatMessage
        type="warning"
        title="Annulation en ligne impossible"
        message="Il reste moins de 48h avant votre rendez-vous. Pour annuler, merci d'appeler le 03 28 53 48 68."
        reference={reservation.reference}
      />
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 lg:py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
          <AlertTriangle className="w-10 h-10 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Annuler votre rendez-vous ?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Bonjour {reservation.client_prenom}, voici le récapitulatif du rendez-vous que vous êtes sur le point d&apos;annuler.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Référence
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground tracking-wider">
            {reservation.reference}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Détails du rendez-vous
          </h2>
          <dl className="space-y-3">
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Service</dt>
                <dd className="font-medium text-foreground">
                  {reservation.service?.nom}
                  {reservation.marque && (
                    <span className="text-muted-foreground"> · {reservation.marque.nom}</span>
                  )}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Date</dt>
                <dd className="font-medium text-foreground">{dateLong}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Créneau</dt>
                <dd className="font-medium text-foreground">{heureDebut} - {heureFin}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Technicien</dt>
                <dd className="font-medium text-foreground">{reservation.technicien?.prenom}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Adresse</dt>
                <dd className="font-medium text-foreground">
                  {reservation.client_adresse}
                  {reservation.client_complement && <>, {reservation.client_complement}</>}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {reservation.ville?.code_postal} {reservation.ville?.nom}
                  </span>
                </dd>
              </div>
            </div>
            <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
              <dt className="font-semibold text-foreground">Tarif TTC</dt>
              <dd className="text-xl font-bold text-foreground">
                {formatPrice(reservation.prix_centimes)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 mb-6 text-sm text-amber-900">
        <p>
          <strong>Attention :</strong> cette action est définitive. Le créneau sera libéré et un email de confirmation d&apos;annulation vous sera envoyé.
        </p>
      </div>

      {reservation.reference && (
        <AnnulerButton token={token} reference={reservation.reference} />
      )}
    </main>
  );
}

function EtatMessage({
  type,
  title,
  message,
  reference,
}: {
  type: "info" | "warning";
  title: string;
  message: string;
  reference: string | null;
}) {
  const isWarning = type === "warning";
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isWarning ? "bg-amber-100" : "bg-slate-100"}`}>
          <AlertTriangle className={`w-10 h-10 ${isWarning ? "text-amber-600" : "text-slate-500"}`} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        {reference && (
          <p className="text-sm text-muted-foreground mb-6">
            Référence : <strong className="text-foreground">{reference}</strong>
          </p>
        )}
      </div>

      {isWarning && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Contactez-nous directement</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <a href="tel:+33328534868" className="font-semibold text-primary hover:underline">
                    03 28 53 48 68
                  </a>
                  {" "}du lundi au vendredi de 8h à 17h.
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
  );
}
