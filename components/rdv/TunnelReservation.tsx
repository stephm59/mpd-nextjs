"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { ConsentementCheckbox } from "@/components/ui/ConsentementCheckbox";
import { ChevronRight, ArrowLeft, MapPin, Phone, Flame, Sparkles } from "lucide-react";
import { formatDuration, formatPrice } from "@/lib/rdv/format";
import { formatJourLong } from "@/lib/rdv/dates";
import type { CreneauDisponible, Service } from "@/app/rdv/actions";
import {
  getTarifByVilleId,
  getParametres,
  getCreneauxDisponibles,
  getTechniciensPourService,
  creerReservation,
} from "@/app/rdv/actions";
import type { ReservationInput } from "@/lib/rdv/schema";

type Ville = Database["public"]["Tables"]["rdv_villes"]["Row"];
type Marque = Database["public"]["Tables"]["rdv_marques_chaudiere"]["Row"];

interface TunnelReservationProps {
  services: Service[];
  villes: Ville[];
  marques: Marque[];
}

type EtapeNum = 1 | 2 | 3 | 4 | 5;

interface EtatTunnel {
  etape: EtapeNum;
  service: Service | null;
  ville: Ville | null;
  prixCentimes: number | null;
  marque: Marque | null;
  date: Date | null;
  creneau: CreneauDisponible | null;
  technicienIdPrefere: string | null;
}

const SERVICES_AVEC_MARQUE = ["entretien-chaudiere", "devis-remplacement-chaudiere"];

export function TunnelReservation({
  services,
  villes,
  marques,
}: TunnelReservationProps) {
  const [etat, setEtat] = useState<EtatTunnel>({
    etape: 1,
    service: null,
    ville: null,
    prixCentimes: null,
    marque: null,
    date: null,
    creneau: null,
    technicienIdPrefere: null,
  });

  const serviceAvecMarque = etat.service && SERVICES_AVEC_MARQUE.includes(etat.service.slug);
  const totalEtapes = serviceAvecMarque ? 5 : 4;

  function selectService(service: Service) {
    setEtat({ ...etat, service, etape: 2, marque: null });
  }

  function retourEtape(etape: EtapeNum) {
    setEtat({ ...etat, etape });
  }

  function selectVille(ville: Ville, prixCentimes: number) {
    setEtat({ ...etat, ville, prixCentimes, etape: 3 });
  }

  function selectMarque(marque: Marque) {
    setEtat({ ...etat, marque, etape: 4 });
  }

  function selectDateEtCreneau(date: Date, creneau: CreneauDisponible) {
    setEtat({ ...etat, date, creneau, etape: 5 });
  }

  function retourDepuisDateCreneau() {
    setEtat({ ...etat, etape: serviceAvecMarque ? 3 : 2 });
  }

  return (
    <Card className="shadow-card">
      <CardContent className="p-6 lg:p-8">
        <ProgressBar etape={etat.etape} total={totalEtapes} />

        {etat.etape === 1 && (
          <Etape1ChoixService services={services} onSelect={selectService} />
        )}

        {etat.etape === 2 && etat.service && (
          <Etape2ChoixVille
            service={etat.service}
            villes={villes}
            onBack={() => retourEtape(1)}
            onSelect={selectVille}
          />
        )}

        {etat.etape === 3 && serviceAvecMarque && etat.service && etat.ville && (
          <Etape3ChoixMarque
            service={etat.service}
            ville={etat.ville}
            marques={marques}
            onBack={() => retourEtape(2)}
            onSelect={selectMarque}
          />
        )}

        {((etat.etape === 3 && !serviceAvecMarque) || etat.etape === 4) &&
          etat.service && etat.ville && (
          <Etape4ChoixDateCreneau
            service={etat.service}
            ville={etat.ville}
            marque={etat.marque}
            technicienIdPrefere={etat.technicienIdPrefere}
            onChangePreferenceTech={(id) => setEtat({ ...etat, technicienIdPrefere: id })}
            onBack={retourDepuisDateCreneau}
            onSelect={selectDateEtCreneau}
          />
        )}

        {etat.etape === 5 && etat.service && etat.ville && etat.date && etat.creneau && etat.prixCentimes !== null && (
          <Etape5Coordonnees
            service={etat.service}
            ville={etat.ville}
            marque={etat.marque}
            date={etat.date}
            creneau={etat.creneau}
            prixCentimes={etat.prixCentimes}
            onBack={() => setEtat({ ...etat, etape: serviceAvecMarque ? 4 : 3 })}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ProgressBar({ etape, total }: { etape: EtapeNum; total: number }) {
  return (
    <div className="mb-6 flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i < etape ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function Etape1ChoixService({
  services,
  onSelect,
}: {
  services: Service[];
  onSelect: (s: Service) => void;
}) {
  const router = useRouter();

  function handleAutreDemande() {
    router.push("/rdv?tab=contact&from=panne", { scroll: false });
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Étape 1
      </p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">
        Quel service souhaitez-vous ?
      </h2>

      <div className="mt-6 space-y-2.5">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className="group flex w-full items-center justify-between rounded-lg border border-border bg-background p-4 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <div className="flex-1">
              <p className="font-semibold text-foreground">{service.nom}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatDuration(service.duree_minutes)} sur place
                {service.est_devis ? " · visite gratuite" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {service.est_devis ? (
                <span className="rounded-md bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                  Gratuit
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {service.prix_min_centimes !== null && service.prix_min_centimes !== undefined
                    ? `à partir de ${formatPrice(service.prix_min_centimes)}`
                    : "Tarif sur demande"}
                </span>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
          </button>
        ))}

        <button
          onClick={handleAutreDemande}
          className="group flex w-full items-center justify-between rounded-lg border border-border bg-background p-4 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="flex-1">
            <p className="font-semibold text-foreground">Autre demande</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Panne ou question
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              Nous écrire
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </button>
      </div>
    </div>
  );
}

function Etape2ChoixVille({
  service,
  villes,
  onBack,
  onSelect,
}: {
  service: Service;
  villes: Ville[];
  onBack: () => void;
  onSelect: (v: Ville, prixCentimes: number) => void;
}) {
  const [recherche, setRecherche] = useState("");
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  const villesFiltrees = recherche.length >= 2
    ? villes.filter((v) => v.code_postal.startsWith(recherche))
    : [];

  const horsZone = recherche.length === 5 && villesFiltrees.length === 0;

  function handleVilleClick(ville: Ville) {
    setErreur(null);
    startTransition(async () => {
      const prix = await getTarifByVilleId(service.id, ville.id);
      if (prix === null) {
        setErreur("Impossible de récupérer le tarif. Veuillez réessayer.");
        return;
      }
      onSelect(ville, prix);
    });
  }

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Button>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Étape 2
      </p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">
        Dans quelle commune ?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Service sélectionné : <strong className="text-foreground">{service.nom}</strong>
      </p>

      <div className="mt-6">
        <label htmlFor="code-postal" className="text-sm font-medium text-foreground">
          Votre code postal
        </label>
        <div className="relative mt-1.5">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="code-postal"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder="ex: 59000"
            value={recherche}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setRecherche(val);
              setErreur(null);
            }}
            className="pl-9"
            disabled={isPending}
          />
        </div>
      </div>

      {villesFiltrees.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground">
            {villesFiltrees.length} commune{villesFiltrees.length > 1 ? "s" : ""} trouvée{villesFiltrees.length > 1 ? "s" : ""}
          </p>
          <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
            {villesFiltrees.map((ville) => (
              <button
                key={ville.id}
                onClick={() => handleVilleClick(ville)}
                disabled={isPending}
                className="group flex w-full items-center justify-between rounded-lg border border-border bg-background p-3 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium text-muted-foreground">
                    {ville.code_postal}
                  </span>
                  <span className="font-medium text-foreground">{ville.nom}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </div>
      )}

      {horsZone && (
        <div className="mt-4 rounded-lg border border-urgent/30 bg-urgent/5 p-4">
          <p className="text-sm font-medium text-foreground">
            Votre commune n&apos;est pas encore couverte par la prise de rendez-vous en ligne.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Mais nous intervenons peut-être quand même chez vous ! Contactez-nous directement :
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <a
              href="tel:0328534868"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-urgent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-urgent-hover"
            >
              <Phone className="h-4 w-4" />
              03 28 53 48 68
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Formulaire de contact
            </Link>
          </div>
        </div>
      )}

      {erreur && (
        <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {erreur}
        </p>
      )}

      {recherche.length > 0 && recherche.length < 2 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Continuez à taper votre code postal...
        </p>
      )}

      {isPending && (
        <p className="mt-4 text-sm text-muted-foreground">
          Récupération du tarif...
        </p>
      )}
    </div>
  );
}

function Etape3ChoixMarque({
  service,
  ville,
  marques,
  onBack,
  onSelect,
}: {
  service: Service;
  ville: Ville;
  marques: Marque[];
  onBack: () => void;
  onSelect: (m: Marque) => void;
}) {
  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Button>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Étape 3
      </p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">
        Quelle est la marque de votre chaudière ?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {service.nom} · {ville.nom} ({ville.code_postal})
      </p>

      <div className="mt-6 space-y-2">
        {marques.map((marque) => (
          <button
            key={marque.id}
            onClick={() => onSelect(marque)}
            className="group flex w-full items-center justify-between rounded-lg border border-border bg-background p-3.5 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <div className="flex items-center gap-3">
              {marque.exclusif ? (
                <Sparkles className="h-4 w-4 text-primary" />
              ) : (
                <Flame className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium text-foreground">{marque.nom}</span>
              {marque.exclusif && (
                <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Spécialiste dédié
                </span>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Vous ne connaissez pas la marque ? Choisissez «&nbsp;Autre / je ne sais pas&nbsp;», notre technicien identifiera sur place.
      </p>
    </div>
  );
}

function Etape4ChoixDateCreneau({
  service,
  ville,
  marque,
  technicienIdPrefere,
  onChangePreferenceTech,
  onBack,
  onSelect,
}: {
  service: Service;
  ville: Ville;
  marque: Marque | null;
  technicienIdPrefere: string | null;
  onChangePreferenceTech: (id: string | null) => void;
  onBack: () => void;
  onSelect: (date: Date, creneau: CreneauDisponible) => void;
}) {
  const [parametres, setParametres] = React.useState<{
    delaiMinimumJours: number;
    joursVisiblesFutur: number;
    joursOuvres: string[];
  } | null>(null);
  const [creneauxParJour, setCreneauxParJour] = React.useState<Map<string, CreneauDisponible[]> | null>(null);
  const [techniciens, setTechniciens] = React.useState<Array<{ id: string; prenom: string }>>([]);
  const [showTechSelector, setShowTechSelector] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    getParametres().then((params) => {
      setParametres({
        delaiMinimumJours: parseInt(params["delai_minimum_jours"] ?? "1", 10),
        joursVisiblesFutur: parseInt(params["jours_visibles_futur"] ?? "30", 10),
        joursOuvres: (params["jours_ouvres"] ?? "lundi,mardi,mercredi,jeudi,vendredi")
          .split(",").map(s => s.trim().toLowerCase()),
      });
    });
  }, []);

  React.useEffect(() => {
    getTechniciensPourService(service.id).then((data) => {
      setTechniciens(data.map(t => ({ id: t.id, prenom: t.prenom })));
    });
  }, [service.id]);

  React.useEffect(() => {
    setCreneauxParJour(null);
    setSelectedDate(null);
    getCreneauxDisponibles({
      serviceId: service.id,
      villeId: ville.id,
      marqueId: marque?.id ?? null,
      technicienIdPrefere: technicienIdPrefere,
    }).then((tousLesCreneaux) => {
      const seen = new Set<string>();
      const dedupes: CreneauDisponible[] = [];
      for (const c of tousLesCreneaux) {
        const key = `${c.debut}-${c.fin}`;
        if (!seen.has(key)) { seen.add(key); dedupes.push(c); }
      }
      const parJour = new Map<string, CreneauDisponible[]>();
      for (const c of dedupes) {
        const date = new Date(c.debut);
        const cle = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const liste = parJour.get(cle) ?? [];
        liste.push(c);
        parJour.set(cle, liste);
      }
      parJour.forEach((liste) => liste.sort((a, b) => a.debut.localeCompare(b.debut)));
      setCreneauxParJour(parJour);
      const joursAvecDispos = Array.from(parJour.keys()).sort();
      if (joursAvecDispos.length > 0) {
        const [year, month, day] = joursAvecDispos[0].split("-").map(Number);
        setSelectedDate(new Date(year, month - 1, day));
      }
    });
  }, [service.id, ville.id, marque?.id, technicienIdPrefere]);

  if (!parametres || creneauxParJour === null) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Chargement des disponibilités...
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateMin = new Date(today);
  dateMin.setDate(dateMin.getDate() + parametres.delaiMinimumJours);
  const dateMax = new Date(dateMin);
  dateMax.setDate(dateMax.getDate() + parametres.joursVisiblesFutur);

  const NOM_JOUR_JS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  function dateToKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  function jourADesCreneaux(date: Date): boolean {
    return (creneauxParJour?.get(dateToKey(date))?.length ?? 0) > 0;
  }

  const disabledDays = (date: Date) => {
    if (date < dateMin) return true;
    if (date > dateMax) return true;
    const nomJour = NOM_JOUR_JS[date.getDay()];
    if (!parametres.joursOuvres.includes(nomJour)) return true;
    if (!jourADesCreneaux(date)) return true;
    return false;
  };

  const creneauxJourSelectionne = selectedDate
    ? (creneauxParJour.get(dateToKey(selectedDate)) ?? [])
    : [];
  const creneauxMatin = creneauxJourSelectionne.filter(c => new Date(c.debut).getHours() < 12);
  const creneauxAprem = creneauxJourSelectionne.filter(c => new Date(c.debut).getHours() >= 12);
  const techPrefereData = technicienIdPrefere ? techniciens.find(t => t.id === technicienIdPrefere) : null;

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Button>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Date et créneau
      </p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">
        Choisissez votre rendez-vous
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {service.nom} · {ville.nom} ({ville.code_postal})
        {marque && ` · ${marque.nom}`}
      </p>

      <div className="mt-4 rounded-md border border-border bg-muted/30 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              {techPrefereData ? `Technicien : ${techPrefereData.prenom}` : "Auto-attribution du technicien"}
            </p>
            <p className="text-xs text-muted-foreground">
              {techPrefereData
                ? "Vous avez choisi un technicien spécifique"
                : "Nous vous attribuons le technicien le mieux placé"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowTechSelector(!showTechSelector)}>
            {showTechSelector ? "Fermer" : techPrefereData ? "Changer" : "Choisir"}
          </Button>
        </div>
        {showTechSelector && (
          <div className="mt-3 space-y-1.5 border-t border-border pt-3">
            <button
              onClick={() => { onChangePreferenceTech(null); setShowTechSelector(false); }}
              className={`w-full rounded-md border p-2 text-left text-sm transition-colors ${
                technicienIdPrefere === null
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-background text-foreground hover:border-primary"
              }`}
            >
              <span className="font-medium">Auto-attribution</span>
              <span className="ml-2 text-xs text-muted-foreground">(recommandé)</span>
            </button>
            {techniciens.map(t => (
              <button
                key={t.id}
                onClick={() => { onChangePreferenceTech(t.id); setShowTechSelector(false); }}
                className={`w-full rounded-md border p-2 text-left text-sm transition-colors ${
                  technicienIdPrefere === t.id
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-background text-foreground hover:border-primary"
                }`}
              >
                <span className="font-medium">{t.prenom}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[auto,1fr]">
        <div className="flex justify-center lg:justify-start">
          <Calendar
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={disabledDays}
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
          {selectedDate && creneauxJourSelectionne.length === 0 && (
            <div className="rounded-md bg-muted/50 p-6 text-center">
              <p className="text-sm font-medium text-foreground">
                Aucun créneau ce jour
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Choisissez un autre jour dans le calendrier.
              </p>
            </div>
          )}
          {selectedDate && creneauxJourSelectionne.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-medium text-foreground">
                {formatJourLong(selectedDate)} {selectedDate.getFullYear()}
              </p>
              {creneauxMatin.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Matin
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                    {creneauxMatin.map(c => (
                      <CreneauButton key={`${c.debut}-${c.technicien_id}`} creneau={c} onSelect={(c) => onSelect(selectedDate, c)} />
                    ))}
                  </div>
                </div>
              )}
              {creneauxAprem.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Après-midi
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                    {creneauxAprem.map(c => (
                      <CreneauButton key={`${c.debut}-${c.technicien_id}`} creneau={c} onSelect={(c) => onSelect(selectedDate, c)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreneauButton({
  creneau,
  onSelect,
}: {
  creneau: CreneauDisponible;
  onSelect: (c: CreneauDisponible) => void;
}) {
  const heure = new Date(creneau.debut).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <button
      onClick={() => onSelect(creneau)}
      className="rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {heure}
    </button>
  );
}

function Etape5Coordonnees({
  service,
  ville,
  marque,
  date,
  creneau,
  prixCentimes,
  onBack,
}: {
  service: Service;
  ville: Ville;
  marque: Marque | null;
  date: Date;
  creneau: CreneauDisponible;
  prixCentimes: number;
  onBack: () => void;
}) {
  const router = useRouter();
  const [prenom, setPrenom] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const [adresse, setAdresse] = React.useState("");
  const [complement, setComplement] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [cgvAcceptees, setCgvAcceptees] = React.useState(false);

  const [isSubmitting, startSubmit] = React.useTransition();
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = React.useState<string | null>(null);

  const isValid =
    prenom.trim().length >= 2 &&
    nom.trim().length >= 2 &&
    email.trim().length > 0 &&
    telephone.trim().length > 0 &&
    adresse.trim().length >= 5 &&
    cgvAcceptees;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    startSubmit(async () => {
      const input: ReservationInput = {
        service_id: service.id,
        ville_id: ville.id,
        marque_id: marque?.id ?? null,
        technicien_id: creneau.technicien_id,
        date_debut: creneau.debut,
        date_fin: creneau.fin,
        prix_centimes: prixCentimes,
        client_prenom: prenom.trim(),
        client_nom: nom.trim(),
        client_email: email.trim(),
        client_telephone: telephone.trim(),
        client_adresse: adresse.trim(),
        client_complement: complement.trim() || null,
        notes: notes.trim() || null,
        cgv_acceptees: cgvAcceptees,
      };

      const result = await creerReservation(input);

      if (result.success) {
        router.push(`/rdv/confirmation/${result.reference}`);
        return;
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setGlobalError(result.error);
      }
    });
  }

  const heureDebut = new Date(creneau.debut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const heureFin = new Date(creneau.fin).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4" disabled={isSubmitting}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Button>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Vos coordonnées
      </p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">
        Confirmation de la réservation
      </h2>

      <div className="mt-4 rounded-md border border-border bg-muted/30 p-4">
        <p className="text-sm font-semibold text-foreground">Récapitulatif</p>
        <dl className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Service</dt>
            <dd className="font-medium text-foreground">{service.nom}</dd>
          </div>
          {marque && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Marque</dt>
              <dd className="font-medium text-foreground">{marque.nom}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Adresse</dt>
            <dd className="font-medium text-foreground">{ville.nom} ({ville.code_postal})</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Date</dt>
            <dd className="font-medium text-foreground">{formatJourLong(date)} {date.getFullYear()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Créneau</dt>
            <dd className="font-medium text-foreground">{heureDebut} - {heureFin}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Technicien</dt>
            <dd className="font-medium text-foreground">{creneau.technicien_prenom}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 mt-2">
            <dt className="font-semibold text-foreground">Tarif</dt>
            <dd className="font-bold text-foreground">{formatPrice(prixCentimes)}</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="prenom" className="text-sm font-medium text-foreground">
              Prénom <span className="text-destructive">*</span>
            </label>
            <Input
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Jean"
              required
              maxLength={50}
              className="mt-1.5"
              disabled={isSubmitting}
            />
            {fieldErrors.client_prenom && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.client_prenom[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="nom" className="text-sm font-medium text-foreground">
              Nom <span className="text-destructive">*</span>
            </label>
            <Input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Dupont"
              required
              maxLength={50}
              className="mt-1.5"
              disabled={isSubmitting}
            />
            {fieldErrors.client_nom && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.client_nom[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jean.dupont@email.com"
            required
            maxLength={100}
            className="mt-1.5"
            disabled={isSubmitting}
          />
          {fieldErrors.client_email && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.client_email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="telephone" className="text-sm font-medium text-foreground">
            Téléphone <span className="text-destructive">*</span>
          </label>
          <Input
            id="telephone"
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="06 12 34 56 78"
            required
            className="mt-1.5"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-muted-foreground">Format : 06 12 34 56 78</p>
          {fieldErrors.client_telephone && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.client_telephone[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="adresse" className="text-sm font-medium text-foreground">
            Adresse complète <span className="text-destructive">*</span>
          </label>
          <Input
            id="adresse"
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="12 rue de la République"
            required
            maxLength={200}
            className="mt-1.5"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            À {ville.nom} ({ville.code_postal})
          </p>
          {fieldErrors.client_adresse && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.client_adresse[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="complement" className="text-sm font-medium text-foreground">
            Complément <span className="text-muted-foreground font-normal">(optionnel)</span>
          </label>
          <Input
            id="complement"
            type="text"
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
            placeholder="Bâtiment A, 3e étage, code 1234"
            maxLength={100}
            className="mt-1.5"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="notes" className="text-sm font-medium text-foreground">
            Précisions <span className="text-muted-foreground font-normal">(optionnel)</span>
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Difficultés d'accès, parking, étage, etc."
            maxLength={500}
            rows={3}
            className="mt-1.5"
            disabled={isSubmitting}
          />
        </div>

        <div className="rounded-md border border-border bg-muted/20 p-3">
          <ConsentementCheckbox
            id="cgv"
            checked={cgvAcceptees}
            onChange={setCgvAcceptees}
            error={fieldErrors.cgv_acceptees?.[0]}
            disabled={isSubmitting}
          />
        </div>

        {globalError && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{globalError}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : "Confirmer ma réservation"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Vous recevrez un email de confirmation après validation.
        </p>
      </form>
    </div>
  );
}
