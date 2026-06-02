"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { ChevronRight, ArrowLeft, MapPin, Flame, Sparkles } from "lucide-react";
import { formatDuration, formatPrice } from "@/lib/rdv/format";
import { formatJourLong } from "@/lib/rdv/dates";
import { getTarifByVilleId } from "@/app/rdv/actions";
import {
  getCreneauxDisponiblesAdmin,
  creerReservationAdmin,
  type CreneauAdmin,
} from "./actions";
import type { ReservationAdminInput } from "@/lib/admin/rdv-schema";

type Service = Database["public"]["Tables"]["rdv_services"]["Row"];
type Ville = Database["public"]["Tables"]["rdv_villes"]["Row"];
type Marque = Database["public"]["Tables"]["rdv_marques_chaudiere"]["Row"];
type Technicien = { id: string; prenom: string; ordre: number };

interface Props {
  services: Service[];
  villes: Ville[];
  marques: Marque[];
  techniciens: Technicien[];
}

type EtapeNum = 1 | 2 | 3 | 4 | 5;

interface EtatForm {
  etape: EtapeNum;
  service: Service | null;
  ville: Ville | null;
  prixCentimes: number | null;
  marque: Marque | null;
  techsCandidatsIds: string[];
  date: Date | null;
  creneau: CreneauAdmin | null;
}

const SERVICES_AVEC_MARQUE = ["entretien-chaudiere", "devis-remplacement-chaudiere"];

export function AdminReservationForm({
  services,
  villes,
  marques,
  techniciens,
}: Props) {
  const [etat, setEtat] = useState<EtatForm>({
    etape: 1,
    service: null,
    ville: null,
    prixCentimes: null,
    marque: null,
    techsCandidatsIds: techniciens.map((t) => t.id),
    date: null,
    creneau: null,
  });

  const serviceAvecMarque = etat.service && SERVICES_AVEC_MARQUE.includes(etat.service.slug);

  function selectService(service: Service) {
    setEtat({ ...etat, service, etape: 2, marque: null });
  }

  function selectVille(ville: Ville, prixCentimes: number) {
    setEtat({ ...etat, ville, prixCentimes, etape: 3 });
  }

  function selectMarque(marque: Marque) {
    setEtat({ ...etat, marque, etape: 4 });
  }

  function selectDateEtCreneau(date: Date, creneau: CreneauAdmin) {
    setEtat({ ...etat, date, creneau, etape: 5 });
  }

  function setTechsCandidats(ids: string[]) {
    setEtat({ ...etat, techsCandidatsIds: ids });
  }

  function retourEtape(etape: EtapeNum) {
    setEtat({ ...etat, etape });
  }

  function retourDepuisDateCreneau() {
    setEtat({ ...etat, etape: serviceAvecMarque ? 3 : 2 });
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 lg:p-8">
        {etat.etape === 1 && (
          <EtapeService services={services} onSelect={selectService} />
        )}

        {etat.etape === 2 && etat.service && (
          <EtapeVille
            service={etat.service}
            villes={villes}
            onBack={() => retourEtape(1)}
            onSelect={selectVille}
          />
        )}

        {etat.etape === 3 && serviceAvecMarque && etat.service && etat.ville && (
          <EtapeMarque
            service={etat.service}
            ville={etat.ville}
            marques={marques}
            onBack={() => retourEtape(2)}
            onSelect={selectMarque}
          />
        )}

        {((etat.etape === 3 && !serviceAvecMarque) || etat.etape === 4) &&
          etat.service &&
          etat.ville && (
            <EtapeDateTechs
              service={etat.service}
              ville={etat.ville}
              marque={etat.marque}
              techniciens={techniciens}
              techsCandidatsIds={etat.techsCandidatsIds}
              onChangeTechsCandidats={setTechsCandidats}
              onBack={retourDepuisDateCreneau}
              onSelect={selectDateEtCreneau}
            />
          )}

        {etat.etape === 5 &&
          etat.service &&
          etat.ville &&
          etat.date &&
          etat.creneau &&
          etat.prixCentimes !== null && (
            <EtapeCoordonnees
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

function EtapeService({
  services,
  onSelect,
}: {
  services: Service[];
  onSelect: (s: Service) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Étape 1</p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">Quel service ?</h2>

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

function EtapeVille({
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

  const villesFiltrees =
    recherche.length >= 2 ? villes.filter((v) => v.code_postal.startsWith(recherche)) : [];
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

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Étape 2</p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">Dans quelle commune ?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Service : <strong className="text-foreground">{service.nom}</strong>
      </p>

      <div className="mt-6">
        <label htmlFor="code-postal" className="text-sm font-medium text-foreground">
          Code postal
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
            {villesFiltrees.length} commune{villesFiltrees.length > 1 ? "s" : ""} trouvée
            {villesFiltrees.length > 1 ? "s" : ""}
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
        <p className="mt-4 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
          Aucune commune référencée pour ce code postal. Vérifiez la saisie ou ajoutez la ville dans l&apos;admin.
        </p>
      )}

      {erreur && (
        <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{erreur}</p>
      )}

      {recherche.length > 0 && recherche.length < 2 && (
        <p className="mt-4 text-sm text-muted-foreground">Continuez à taper le code postal...</p>
      )}

      {isPending && (
        <p className="mt-4 text-sm text-muted-foreground">Récupération du tarif...</p>
      )}
    </div>
  );
}

function EtapeMarque({
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

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Étape 3</p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">
        Quelle marque de chaudière ?
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
    </div>
  );
}

function EtapeDateTechs({
  service,
  ville,
  marque,
  techniciens,
  techsCandidatsIds,
  onChangeTechsCandidats,
  onBack,
  onSelect,
}: {
  service: Service;
  ville: Ville;
  marque: Marque | null;
  techniciens: Technicien[];
  techsCandidatsIds: string[];
  onChangeTechsCandidats: (ids: string[]) => void;
  onBack: () => void;
  onSelect: (date: Date, creneau: CreneauAdmin) => void;
}) {
  const [creneauxParJour, setCreneauxParJour] = React.useState<Map<string, CreneauAdmin[]> | null>(
    null
  );
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (techsCandidatsIds.length === 0) {
      setCreneauxParJour(new Map());
      setSelectedDate(null);
      return;
    }
    setIsLoading(true);
    setCreneauxParJour(null);
    setSelectedDate(null);
    getCreneauxDisponiblesAdmin({
      serviceId: service.id,
      dureeMinutes: null,
      villeId: ville.id,
      technicienIds: techsCandidatsIds,
    })
      .then((tous) => {
        const parJour = new Map<string, CreneauAdmin[]>();
        for (const c of tous) {
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
      })
      .finally(() => setIsLoading(false));
  }, [service.id, ville.id, techsCandidatsIds]);

  function toggleTech(id: string) {
    if (techsCandidatsIds.includes(id)) {
      onChangeTechsCandidats(techsCandidatsIds.filter((x) => x !== id));
    } else {
      onChangeTechsCandidats([...techsCandidatsIds, id]);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateMin = today;
  const dateMax = new Date(today);
  dateMax.setDate(dateMax.getDate() + 60);

  const NOM_JOUR_JS = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  const joursOuvres = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

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
    if (!joursOuvres.includes(nomJour)) return true;
    if (!jourADesCreneaux(date)) return true;
    return false;
  };

  const creneauxJourSelectionne = selectedDate
    ? (creneauxParJour?.get(dateToKey(selectedDate)) ?? [])
    : [];
  const creneauxMatin = creneauxJourSelectionne.filter((c) => new Date(c.debut).getHours() < 12);
  const creneauxAprem = creneauxJourSelectionne.filter((c) => new Date(c.debut).getHours() >= 12);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Button>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Date et créneau
      </p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">Techniciens et créneau</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {service.nom} · {ville.nom} ({ville.code_postal})
        {marque && ` · ${marque.nom}`}
      </p>

      <div className="mt-6 rounded-md border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground mb-2">Techniciens candidats</p>
        <p className="text-xs text-muted-foreground mb-3">
          Tous les techs actifs sont éligibles (pas de filtre compétence en mode admin). Cochez ceux
          qui peuvent intervenir, le créneau attribuera celui qui est libre.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {techniciens.map((tech) => (
            <label
              key={tech.id}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background p-2.5 text-sm transition-colors hover:border-primary"
            >
              <Checkbox
                checked={techsCandidatsIds.includes(tech.id)}
                onCheckedChange={() => toggleTech(tech.id)}
              />
              <span className="font-medium text-foreground">{tech.prenom}</span>
            </label>
          ))}
        </div>
      </div>

      {techsCandidatsIds.length === 0 && (
        <p className="mt-4 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
          Cochez au moins un technicien pour afficher les créneaux.
        </p>
      )}

      {techsCandidatsIds.length > 0 && (isLoading || creneauxParJour === null) && (
        <div className="mt-6 py-12 text-center text-muted-foreground">
          Chargement des disponibilités...
        </div>
      )}

      {techsCandidatsIds.length > 0 && !isLoading && creneauxParJour !== null && (
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
                <p className="text-sm font-medium text-foreground">Aucun créneau ce jour</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choisissez un autre jour ou élargissez la sélection de techs.
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
                      {creneauxMatin.map((c) => (
                        <CreneauButton
                          key={c.debut}
                          creneau={c}
                          onSelect={(c) => onSelect(selectedDate, c)}
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
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                      {creneauxAprem.map((c) => (
                        <CreneauButton
                          key={c.debut}
                          creneau={c}
                          onSelect={(c) => onSelect(selectedDate, c)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CreneauButton({
  creneau,
  onSelect,
}: {
  creneau: CreneauAdmin;
  onSelect: (c: CreneauAdmin) => void;
}) {
  const heure = new Date(creneau.debut).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const techsLabel =
    creneau.techniciens_libres.length === 1
      ? creneau.techniciens_libres[0].prenom
      : `${creneau.techniciens_libres.length} techs`;
  return (
    <button
      onClick={() => onSelect(creneau)}
      title={creneau.techniciens_libres.map((t) => t.prenom).join(", ")}
      className="flex flex-col items-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <span>{heure}</span>
      <span className="text-[10px] font-normal text-muted-foreground">{techsLabel}</span>
    </button>
  );
}

function EtapeCoordonnees({
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
  creneau: CreneauAdmin;
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
  const [envoyerEmail, setEnvoyerEmail] = React.useState(true);

  const [isSubmitting, startSubmit] = React.useTransition();
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = React.useState<string | null>(null);

  const isValid =
    prenom.trim().length >= 2 &&
    nom.trim().length >= 2 &&
    email.trim().length > 0 &&
    telephone.trim().length > 0 &&
    adresse.trim().length >= 5;

  const technicienAttribue = creneau.techniciens_libres[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    startSubmit(async () => {
      const input: ReservationAdminInput = {
        service_id: service.id,
        service_nom_personnalise: null,
        duree_personnalisee_minutes: null,
        description_intervention: null,
        prix_libre: null,
        ville_id: ville.id,
        marque_id: marque?.id ?? null,
        technicien_id: technicienAttribue.id,
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
        envoyer_email_client: envoyerEmail,
      };

      const result = await creerReservationAdmin(input);

      if (result.success) {
        router.push(`/admin/rdv/${result.reservation_id}`);
        return;
      }
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      setGlobalError(result.error);
    });
  }

  const heureDebut = new Date(creneau.debut).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const heureFin = new Date(creneau.fin).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-4"
        disabled={isSubmitting}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour
      </Button>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Coordonnées client
      </p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">Finaliser la réservation</h2>

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
            <dt className="text-muted-foreground">Ville</dt>
            <dd className="font-medium text-foreground">
              {ville.nom} ({ville.code_postal})
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Date</dt>
            <dd className="font-medium text-foreground">
              {formatJourLong(date)} {date.getFullYear()}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Créneau</dt>
            <dd className="font-medium text-foreground">
              {heureDebut} - {heureFin}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Technicien attribué</dt>
            <dd className="font-medium text-foreground">{technicienAttribue.prenom}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2">
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
            Notes internes <span className="text-muted-foreground font-normal">(optionnel)</span>
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contexte, infos prises au téléphone, etc."
            maxLength={500}
            rows={3}
            className="mt-1.5"
            disabled={isSubmitting}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-muted/20 p-3">
          <Checkbox
            id="envoyer-email"
            checked={envoyerEmail}
            onCheckedChange={(checked) => setEnvoyerEmail(checked === true)}
            disabled={isSubmitting}
            className="mt-0.5"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Envoyer un email de confirmation au client
            </p>
            <p className="text-xs text-muted-foreground">
              Décocher si le client ne doit pas être notifié (ex. RDV calé au téléphone et déjà
              annoncé).
            </p>
          </div>
        </label>

        {globalError && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{globalError}</p>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Création..." : "Créer la réservation"}
        </Button>
      </form>
    </div>
  );
}
