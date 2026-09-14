"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { formatJourLong, parseDatePlancher, SEUIL_BANDEAU_DELAI_JOURS } from "@/lib/rdv/dates";
import { formatInTimeZone } from "date-fns-tz";
import {
  getParametres,
  getCreneauxDisponibles,
  deplacerReservation,
  type CreneauDisponible,
} from "@/app/rdv/actions";

interface Props {
  token: string;
  serviceId: string;
  villeId: string;
  marqueId: string | null;
  ancienDebut: string;
  ancienFin: string;
}

export function DeplacerRdvClient({
  token,
  serviceId,
  villeId,
  marqueId,
  ancienDebut,
  ancienFin,
}: Props) {
  const router = useRouter();

  const [parametres, setParametres] = React.useState<{
    delaiMinimumJours: number;
    joursVisiblesFutur: number;
    joursOuvres: string[];
    datePlancher: string | null;
  } | null>(null);
  const [creneauxParJour, setCreneauxParJour] = React.useState<Map<string, CreneauDisponible[]> | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [creneauChoisi, setCreneauChoisi] = React.useState<CreneauDisponible | null>(null);
  const [enCours, setEnCours] = React.useState(false);
  const [erreur, setErreur] = React.useState<string | null>(null);

  React.useEffect(() => {
    getParametres().then((params) => {
      setParametres({
        delaiMinimumJours: parseInt(params["delai_minimum_jours"] ?? "1", 10),
        joursVisiblesFutur: parseInt(params["jours_visibles_futur"] ?? "30", 10),
        joursOuvres: (params["jours_ouvres"] ?? "lundi,mardi,mercredi,jeudi,vendredi")
          .split(",").map((s) => s.trim().toLowerCase()),
        datePlancher: params["date_premiere_reservation"] ?? null,
      });
    });
  }, []);

  React.useEffect(() => {
    getCreneauxDisponibles({
      serviceId,
      villeId,
      marqueId,
      technicienIdPrefere: null,
    }).then((tousLesCreneaux) => {
      // Un même horaire peut revenir pour plusieurs techs : on n'en garde qu'un,
      // le client n'a pas à choisir son technicien pour un simple décalage.
      const seen = new Set<string>();
      const parJour = new Map<string, CreneauDisponible[]>();
      for (const c of tousLesCreneaux) {
        const cle = `${c.debut}-${c.fin}`;
        if (seen.has(cle)) continue;
        seen.add(cle);
        const date = new Date(c.debut);
        const cleJour = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const liste = parJour.get(cleJour) ?? [];
        liste.push(c);
        parJour.set(cleJour, liste);
      }
      parJour.forEach((liste) => liste.sort((a, b) => a.debut.localeCompare(b.debut)));
      setCreneauxParJour(parJour);

      const joursAvecDispos = Array.from(parJour.keys()).sort();
      if (joursAvecDispos.length > 0) {
        const [year, month, day] = joursAvecDispos[0].split("-").map(Number);
        setSelectedDate(new Date(year, month - 1, day));
      }
    });
  }, [serviceId, villeId, marqueId]);

  if (!parametres || creneauxParJour === null) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
        Chargement des disponibilités...
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateParDelai = new Date(today);
  dateParDelai.setDate(dateParDelai.getDate() + parametres.delaiMinimumJours);
  const plancher = parseDatePlancher(parametres.datePlancher);
  const plancherActif = plancher !== null && plancher > dateParDelai;
  const dateMin = plancherActif ? plancher! : dateParDelai;
  const dateMax = new Date(dateMin);
  dateMax.setDate(dateMax.getDate() + parametres.joursVisiblesFutur);
  const afficherBandeau = plancherActif || parametres.delaiMinimumJours >= SEUIL_BANDEAU_DELAI_JOURS;

  const NOM_JOUR_JS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  function dateToKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  const disabledDays = (date: Date) => {
    if (date < dateMin || date > dateMax) return true;
    if (!parametres.joursOuvres.includes(NOM_JOUR_JS[date.getDay()])) return true;
    return (creneauxParJour?.get(dateToKey(date))?.length ?? 0) === 0;
  };

  const creneauxJour = selectedDate ? (creneauxParJour.get(dateToKey(selectedDate)) ?? []) : [];
  const creneauxMatin = creneauxJour.filter((c) => new Date(c.debut).getHours() < 12);
  const creneauxAprem = creneauxJour.filter((c) => new Date(c.debut).getHours() >= 12);

  const aucuneDispo = creneauxParJour.size === 0;

  async function confirmer() {
    if (!creneauChoisi) return;
    setEnCours(true);
    setErreur(null);

    const result = await deplacerReservation({
      token,
      date_debut: creneauChoisi.debut,
      date_fin: creneauChoisi.fin,
      technicien_id: creneauChoisi.technicien_id,
    });

    if (result.success) {
      router.push(`/rdv/deplacer/${token}/succes`);
      return;
    }

    setEnCours(false);
    setErreur(result.error);

    // Le créneau a été pris entre-temps : on recharge les disponibilités
    if (result.raison === "creneau_indisponible") {
      setCreneauChoisi(null);
      setCreneauxParJour(null);
      getCreneauxDisponibles({ serviceId, villeId, marqueId, technicienIdPrefere: null }).then(
        (tous) => {
          const seen = new Set<string>();
          const parJour = new Map<string, CreneauDisponible[]>();
          for (const c of tous) {
            const cle = `${c.debut}-${c.fin}`;
            if (seen.has(cle)) continue;
            seen.add(cle);
            const date = new Date(c.debut);
            const cleJour = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            const liste = parJour.get(cleJour) ?? [];
            liste.push(c);
            parJour.set(cleJour, liste);
          }
          parJour.forEach((l) => l.sort((a, b) => a.debut.localeCompare(b.debut)));
          setCreneauxParJour(parJour);
        }
      );
    }
  }

  if (aucuneDispo) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6 text-center">
          <p className="font-medium text-foreground">Aucun créneau disponible actuellement</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Appelez-nous au{" "}
            <a href="tel:+33328534868" className="font-semibold text-primary hover:underline">
              03 28 53 48 68
            </a>{" "}
            et nous trouverons une solution ensemble.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {afficherBandeau && (
        <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 p-3">
          <p className="text-sm text-muted-foreground">
            Nos prochaines disponibilités commencent le{" "}
            <strong className="text-foreground">
              {formatJourLong(dateMin)} {dateMin.getFullYear()}
            </strong>
            .
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[auto,1fr]">
        <div className="flex justify-center lg:justify-start">
          <Calendar
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                setCreneauChoisi(null);
              }
            }}
            disabled={disabledDays}
            defaultMonth={selectedDate ?? dateMin}
            fromDate={dateMin}
            toDate={dateMax}
            className="rounded-md border border-border"
          />
        </div>

        <div className="min-h-0">
          {!selectedDate && (
            <div className="rounded-md bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              Sélectionnez un jour dans le calendrier
            </div>
          )}

          {selectedDate && creneauxJour.length === 0 && (
            <div className="rounded-md bg-muted/50 p-6 text-center">
              <p className="text-sm font-medium text-foreground">Aucun créneau ce jour</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Choisissez un autre jour dans le calendrier.
              </p>
            </div>
          )}

          {selectedDate && creneauxJour.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-foreground">
                {formatJourLong(selectedDate)} {selectedDate.getFullYear()}
              </p>

              {creneauxMatin.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Matin
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {creneauxMatin.map((c) => (
                      <CreneauChoix
                        key={c.debut}
                        creneau={c}
                        actif={creneauChoisi?.debut === c.debut}
                        onSelect={setCreneauChoisi}
                      />
                    ))}
                  </div>
                </div>
              )}

              {creneauxAprem.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Après-midi
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {creneauxAprem.map((c) => (
                      <CreneauChoix
                        key={c.debut}
                        creneau={c}
                        actif={creneauChoisi?.debut === c.debut}
                        onSelect={setCreneauChoisi}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {erreur && (
        <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {erreur}
        </div>
      )}

      {creneauChoisi && (
        <div className="mt-6 rounded-md border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Votre nouveau créneau
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground line-through">
              {formatJourLong(new Date(ancienDebut))} {formatInTimeZone(new Date(ancienDebut), "Europe/Paris", "HH:mm")}
              {" - "}
              {formatInTimeZone(new Date(ancienFin), "Europe/Paris", "HH:mm")}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">
              {formatJourLong(new Date(creneauChoisi.debut))}{" "}
              {formatInTimeZone(new Date(creneauChoisi.debut), "Europe/Paris", "HH:mm")}
              {" - "}
              {formatInTimeZone(new Date(creneauChoisi.fin), "Europe/Paris", "HH:mm")}
            </span>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Button
          size="lg"
          className="w-full sm:w-auto"
          disabled={!creneauChoisi || enCours}
          onClick={confirmer}
        >
          {enCours ? "Déplacement en cours..." : "Confirmer le nouveau créneau"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Un rendez-vous ne peut être déplacé qu&apos;une seule fois en ligne.
        </p>
      </div>
    </div>
  );
}

function CreneauChoix({
  creneau,
  actif,
  onSelect,
}: {
  creneau: CreneauDisponible;
  actif: boolean;
  onSelect: (c: CreneauDisponible) => void;
}) {
  const heure = formatInTimeZone(new Date(creneau.debut), "Europe/Paris", "HH:mm");
  return (
    <button
      type="button"
      onClick={() => onSelect(creneau)}
      className={`rounded-md border p-2 text-sm font-medium transition-colors ${
        actif
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary"
      }`}
    >
      {heure}
    </button>
  );
}
