"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ArrowLeft, MapPin, Phone } from "lucide-react";
import { formatDuration, formatPrice } from "@/lib/rdv/format";
import { getTarifByCodePostal } from "@/app/rdv/actions";

type Service = Database["public"]["Tables"]["rdv_services"]["Row"];
type Ville = Database["public"]["Tables"]["rdv_villes"]["Row"];

interface TunnelReservationProps {
  services: Service[];
  villes: Ville[];
}

type EtapeNum = 1 | 2 | 3 | 4 | 5;

interface EtatTunnel {
  etape: EtapeNum;
  service: Service | null;
  ville: Ville | null;
  prixCentimes: number | null;
}

export function TunnelReservation({ services, villes }: TunnelReservationProps) {
  const [etat, setEtat] = useState<EtatTunnel>({
    etape: 1,
    service: null,
    ville: null,
    prixCentimes: null,
  });

  const totalEtapes = etat.service?.est_devis ? 4 : 5;

  function selectService(service: Service) {
    setEtat({ ...etat, service, etape: 2 });
  }

  function retourEtape(etape: EtapeNum) {
    setEtat({ ...etat, etape });
  }

  async function selectVille(ville: Ville, prixCentimes: number) {
    setEtat({ ...etat, ville, prixCentimes, etape: 3 });
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

        {etat.etape >= 3 && (
          <div className="mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => retourEtape((etat.etape - 1) as EtapeNum)}
              className="mb-4"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour
            </Button>
            <div className="rounded-md border border-dashed border-muted-foreground/30 p-8 text-center text-muted-foreground">
              <p className="font-medium">Étape {etat.etape} en construction</p>
              <p className="mt-2 text-sm">
                Service : <strong>{etat.service?.nom}</strong>
              </p>
              <p className="mt-1 text-sm">
                Ville : <strong>{etat.ville?.nom}</strong> ({etat.ville?.code_postal})
              </p>
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
