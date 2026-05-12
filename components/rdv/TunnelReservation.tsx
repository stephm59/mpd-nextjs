"use client";

import { useState } from "react";
import type { Database } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { formatDuration } from "@/lib/rdv/format";

type Service = Database["public"]["Tables"]["rdv_services"]["Row"];

interface TunnelReservationProps {
  services: Service[];
}

type EtapeNum = 1 | 2 | 3 | 4 | 5;

interface EtatTunnel {
  etape: EtapeNum;
  service: Service | null;
}

export function TunnelReservation({ services }: TunnelReservationProps) {
  const [etat, setEtat] = useState<EtatTunnel>({
    etape: 1,
    service: null,
  });

  const totalEtapes = etat.service?.est_devis ? 4 : 5;

  function selectService(service: Service) {
    setEtat({ ...etat, service, etape: 2 });
  }

  function retourEtape(etape: EtapeNum) {
    setEtat({ ...etat, etape });
  }

  return (
    <Card className="shadow-card">
      <CardContent className="p-6 lg:p-8">
        <ProgressBar etape={etat.etape} total={totalEtapes} />

        {etat.etape === 1 && (
          <Etape1ChoixService
            services={services}
            onSelect={selectService}
          />
        )}

        {etat.etape > 1 && (
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
                Service sélectionné : <strong>{etat.service?.nom}</strong>
              </p>
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
