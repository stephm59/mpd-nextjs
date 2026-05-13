"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ChevronRight, ArrowLeft, MapPin, Phone, Flame, Sparkles } from "lucide-react";
import { formatDuration, formatPrice } from "@/lib/rdv/format";
import { formatJourLong } from "@/lib/rdv/dates";
import type { CreneauDisponible } from "@/app/rdv/actions";
import {
  getTarifByCodePostal,
  getParametres,
  getCreneauxDisponibles,
  getTechniciensPourService,
} from "@/app/rdv/actions";

type Service = Database["public"]["Tables"]["rdv_services"]["Row"];
type Ville = Database["public"]["Tables"]["rdv_villes"]["Row"];
type Marque = Database["public"]["Tables"]["rdv_marques_chaudiere"]["Row"];

interface TunnelReservationProps {
  services: Service[];
  villes: Ville[];
  marques: Marque[];
}

type EtapeNum = 1 | 2 | 3 | 4 | 5 | 6;

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
  const totalEtapes = etat.service?.est_devis
    ? (serviceAvecMarque ? 6 : 5)
    : 6;

  function selectService(service: Service) {
    setEtat({ ...etat, service, etape: 2, marque: null });
  }

  function retourEtape(etape: EtapeNum) {
    setEtat({ ...etat, etape });
  }

  function selectVille(ville: Ville, prixCentimes: number) {
    const prochaineEtape: EtapeNum = serviceAvecMarque ? 3 : 4;
    setEtat({ ...etat, ville, prixCentimes, etape: prochaineEtape });
  }

  function selectMarque(marque: Marque) {
    setEtat({ ...etat, marque, etape: 4 });
  }

  function selectDate(date: Date) {
    setEtat({ ...etat, date, etape: 5 });
  }

  function selectCreneau(creneau: CreneauDisponible) {
    setEtat({ ...etat, creneau, etape: 6 });
  }

  function retourDepuisEtape4() {
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

        {etat.etape === 3 && etat.service && etat.ville && (
          <Etape3ChoixMarque
            service={etat.service}
            ville={etat.ville}
            marques={marques}
            onBack={() => retourEtape(2)}
            onSelect={selectMarque}
          />
        )}

        {etat.etape === 4 && etat.service && etat.ville && (
          <Etape4ChoixDate
            service={etat.service}
            ville={etat.ville}
            marque={etat.marque}
            onBack={retourDepuisEtape4}
            onSelect={selectDate}
          />
        )}

        {etat.etape === 5 && etat.service && etat.ville && etat.date && (
          <Etape5ChoixCreneau
            service={etat.service}
            ville={etat.ville}
            marque={etat.marque}
            date={etat.date}
            technicienIdPrefere={etat.technicienIdPrefere}
            onChangePreferenceTech={(id) => setEtat({ ...etat, technicienIdPrefere: id })}
            onBack={() => retourEtape(4)}
            onSelect={selectCreneau}
          />
        )}

        {etat.etape === 6 && (
          <div className="mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => retourEtape(5)}
              className="mb-4"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour
            </Button>
            <div className="rounded-md border border-dashed border-muted-foreground/30 p-8 text-center text-muted-foreground">
              <p className="font-medium">Étape 6 en construction</p>
              <p className="mt-2 text-sm">
                Service : <strong>{etat.service?.nom}</strong>
              </p>
              <p className="mt-1 text-sm">
                Ville : <strong>{etat.ville?.nom}</strong> ({etat.ville?.code_postal})
              </p>
              {etat.marque && (
                <p className="mt-1 text-sm">
                  Marque : <strong>{etat.marque.nom}</strong>
                </p>
              )}
              {etat.date && (
                <p className="mt-1 text-sm">
                  Date : <strong>{formatJourLong(etat.date)} {etat.date.getFullYear()}</strong>
                </p>
              )}
              {etat.creneau && (
                <p className="mt-1 text-sm">
                  Créneau : <strong>{new Date(etat.creneau.debut).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})} - {new Date(etat.creneau.fin).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</strong> avec <strong>{etat.creneau.technicien_prenom}</strong>
                </p>
              )}
              {etat.prixCentimes !== null && (
                <p className="mt-1 text-sm">
                  Tarif : <strong>{formatPrice(etat.prixCentimes)}</strong>
                </p>
              )}
            </div>
          </div>
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
                <span className="text-sm text-muted-foreground">à partir de 91 €</span>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
          </button>
        ))}
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
      const tarif = await getTarifByCodePostal(service.id, ville.code_postal);
      if (!tarif) {
        setErreur("Impossible de récupérer le tarif. Veuillez réessayer.");
        return;
      }
      onSelect(ville, tarif.prix_centimes);
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

function Etape4ChoixDate({
  service,
  ville,
  marque,
  onBack,
  onSelect,
}: {
  service: Service;
  ville: Ville;
  marque: Marque | null;
  onBack: () => void;
  onSelect: (d: Date) => void;
}) {
  const [parametres, setParametres] = React.useState<{
    delaiMinimumJours: number;
    joursVisiblesFutur: number;
    joursOuvres: string[];
  } | null>(null);

  React.useEffect(() => {
    getParametres().then((params) => {
      setParametres({
        delaiMinimumJours: parseInt(params["delai_minimum_jours"] ?? "1", 10),
        joursVisiblesFutur: parseInt(params["jours_visibles_futur"] ?? "30", 10),
        joursOuvres: (params["jours_ouvres"] ?? "lundi,mardi,mercredi,jeudi,vendredi")
          .split(",")
          .map((s) => s.trim().toLowerCase()),
      });
    });
  }, []);

  if (!parametres) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Chargement du calendrier...
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateMin = new Date(today);
  dateMin.setDate(dateMin.getDate() + parametres.delaiMinimumJours);
  const dateMax = new Date(dateMin);
  dateMax.setDate(dateMax.getDate() + parametres.joursVisiblesFutur);

  const NOM_JOUR_JS = [
    "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi",
  ];

  const disabledDays = (date: Date) => {
    if (date < dateMin) return true;
    if (date > dateMax) return true;
    const nomJour = NOM_JOUR_JS[date.getDay()];
    if (!parametres.joursOuvres.includes(nomJour)) return true;
    return false;
  };

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Button>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Étape 4
      </p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">
        Choisissez une date
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {service.nom} · {ville.nom} ({ville.code_postal})
        {marque && ` · ${marque.nom}`}
      </p>

      <div className="mt-6 flex justify-center">
        <Calendar
          mode="single"
          onSelect={(date) => date && onSelect(date)}
          disabled={disabledDays}
          fromDate={dateMin}
          toDate={dateMax}
          className="rounded-md border border-border"
        />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Disponible du {formatJourLong(dateMin)} au {formatJourLong(dateMax)}. Les jours fériés et samedis/dimanches sont indisponibles.
      </p>
    </div>
  );
}

function Etape5ChoixCreneau({
  service,
  ville,
  marque,
  date,
  technicienIdPrefere,
  onChangePreferenceTech,
  onBack,
  onSelect,
}: {
  service: Service;
  ville: Ville;
  marque: Marque | null;
  date: Date;
  technicienIdPrefere: string | null;
  onChangePreferenceTech: (id: string | null) => void;
  onBack: () => void;
  onSelect: (c: CreneauDisponible) => void;
}) {
  const [creneaux, setCreneaux] = React.useState<CreneauDisponible[] | null>(null);
  const [techniciens, setTechniciens] = React.useState<Array<{ id: string; prenom: string }>>([]);
  const [showTechSelector, setShowTechSelector] = React.useState(false);

  React.useEffect(() => {
    getTechniciensPourService(service.id).then((data) => {
      setTechniciens(data.map((t) => ({ id: t.id, prenom: t.prenom })));
    });
  }, [service.id]);

  React.useEffect(() => {
    setCreneaux(null);
    getCreneauxDisponibles({
      serviceId: service.id,
      marqueId: marque?.id ?? null,
      technicienIdPrefere: technicienIdPrefere,
    }).then((data) => {
      const jourCible = new Date(date);
      jourCible.setHours(0, 0, 0, 0);
      const jourSuivant = new Date(jourCible);
      jourSuivant.setDate(jourSuivant.getDate() + 1);

      const filtres = data.filter((c) => {
        const debutDate = new Date(c.debut);
        return debutDate >= jourCible && debutDate < jourSuivant;
      });

      const seen = new Set<string>();
      const dedupes: CreneauDisponible[] = [];
      for (const c of filtres) {
        const key = `${c.debut}-${c.fin}`;
        if (!seen.has(key)) {
          seen.add(key);
          dedupes.push(c);
        }
      }

      dedupes.sort((a, b) => a.debut.localeCompare(b.debut));
      setCreneaux(dedupes);
    });
  }, [service.id, marque?.id, technicienIdPrefere, date]);

  const creneauxMatin = (creneaux ?? []).filter((c) => {
    return new Date(c.debut).getHours() < 12;
  });
  const creneauxAprem = (creneaux ?? []).filter((c) => {
    return new Date(c.debut).getHours() >= 12;
  });

  const techPrefereData = technicienIdPrefere
    ? techniciens.find((t) => t.id === technicienIdPrefere)
    : null;

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Button>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Étape 5
      </p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">
        Choisissez un créneau
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatJourLong(date)} {date.getFullYear()} · {service.nom} · {ville.nom}
        {marque && ` · ${marque.nom}`}
      </p>

      <div className="mt-4 rounded-md border border-border bg-muted/30 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              {techPrefereData
                ? `Technicien : ${techPrefereData.prenom}`
                : "Auto-attribution du technicien"}
            </p>
            <p className="text-xs text-muted-foreground">
              {techPrefereData
                ? "Vous avez choisi un technicien spécifique"
                : "Nous vous attribuons le technicien le mieux placé"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTechSelector(!showTechSelector)}
          >
            {showTechSelector ? "Fermer" : techPrefereData ? "Changer" : "Choisir"}
          </Button>
        </div>

        {showTechSelector && (
          <div className="mt-3 space-y-1.5 border-t border-border pt-3">
            <button
              onClick={() => {
                onChangePreferenceTech(null);
                setShowTechSelector(false);
              }}
              className={`w-full rounded-md border p-2 text-left text-sm transition-colors ${
                technicienIdPrefere === null
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-background text-foreground hover:border-primary"
              }`}
            >
              <span className="font-medium">Auto-attribution</span>
              <span className="ml-2 text-xs text-muted-foreground">
                (recommandé)
              </span>
            </button>
            {techniciens.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onChangePreferenceTech(t.id);
                  setShowTechSelector(false);
                }}
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

      {creneaux === null && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Chargement des créneaux...
        </p>
      )}

      {creneaux !== null && creneaux.length === 0 && (
        <div className="mt-6 rounded-md bg-muted/50 p-6 text-center">
          <p className="text-sm font-medium text-foreground">
            Aucun créneau disponible ce jour
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Essayez une autre date ou changez de technicien.
          </p>
        </div>
      )}

      {creneaux !== null && creneaux.length > 0 && (
        <div className="mt-6 space-y-5">
          {creneauxMatin.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Matin
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {creneauxMatin.map((c) => (
                  <CreneauButton key={`${c.debut}-${c.technicien_id}`} creneau={c} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}
          {creneauxAprem.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Après-midi
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {creneauxAprem.map((c) => (
                  <CreneauButton key={`${c.debut}-${c.technicien_id}`} creneau={c} onSelect={onSelect} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
