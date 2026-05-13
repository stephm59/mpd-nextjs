import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Calendar, Clock, MapPin, User, Tag, Phone, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/rdv/format";
import { formatJourLong } from "@/lib/rdv/dates";
import { formatInTimeZone } from "date-fns-tz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirmation de réservation | Mon p'tit Dépanneur",
  description: "Votre réservation a été confirmée avec succès.",
  robots: { index: false, follow: false },
};

type Params = Promise<{ reference: string }>;

export default async function ConfirmationPage({ params }: { params: Params }) {
  const { reference } = await params;

  if (!/^RDV-[A-Z0-9]{6}$/.test(reference)) {
    notFound();
  }

  const supabase = createAdminClient();

  const { data: reservation, error } = await supabase
    .from("rdv_reservations")
    .select(`
      id,
      reference,
      client_prenom,
      client_nom,
      client_email,
      client_telephone,
      client_adresse,
      client_complement,
      notes,
      creneau_debut,
      creneau_fin,
      prix_centimes,
      statut,
      created_at,
      service:rdv_services(id, nom, slug),
      ville:rdv_villes(id, nom, code_postal),
      marque:rdv_marques_chaudiere(id, nom),
      technicien:rdv_techniciens(id, prenom)
    `)
    .eq("reference", reference)
    .maybeSingle();

  if (error || !reservation) {
    notFound();
  }

  const dateDebut = new Date(reservation.creneau_debut);
  const dateFin = new Date(reservation.creneau_fin);
  const heureDebut = formatInTimeZone(dateDebut, "Europe/Paris", "HH:mm");
  const heureFin = formatInTimeZone(dateFin, "Europe/Paris", "HH:mm");

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 lg:py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Réservation confirmée !
        </h1>
        <p className="mt-2 text-muted-foreground">
          Merci {reservation.client_prenom}, votre rendez-vous est bien enregistré.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Référence de votre réservation
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground tracking-wider">
            {reservation.reference}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Conservez cette référence pour toute correspondance.
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
                <dd className="font-medium text-foreground">
                  {formatJourLong(dateDebut)} {dateDebut.getFullYear()}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Créneau</dt>
                <dd className="font-medium text-foreground">
                  {heureDebut} - {heureFin}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Technicien</dt>
                <dd className="font-medium text-foreground">
                  {reservation.technicien?.prenom}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Adresse d&apos;intervention</dt>
                <dd className="font-medium text-foreground">
                  {reservation.client_adresse}
                  {reservation.client_complement && (
                    <>, {reservation.client_complement}</>
                  )}
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

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Et maintenant ?
          </h2>
          <ul className="space-y-3 text-sm text-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">→</span>
              <span>
                Un email de confirmation a été envoyé à{" "}
                <strong>{reservation.client_email}</strong>
                <span className="text-xs text-muted-foreground"> (vérifiez vos spams)</span>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">→</span>
              <span>
                <strong>{reservation.technicien?.prenom}</strong> vous appellera environ 30 minutes
                avant son arrivée pour confirmer le rendez-vous.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">→</span>
              <span>
                Vous recevrez un rappel par SMS la veille du rendez-vous.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Besoin de nous joindre ?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Appelez-nous au{" "}
                <a
                  href="tel:+33328534868"
                  className="font-semibold text-primary hover:underline"
                >
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
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
        <Button asChild>
          <Link href="/rdv">
            Réserver un autre rendez-vous
          </Link>
        </Button>
      </div>
    </main>
  );
}
