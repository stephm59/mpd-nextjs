"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { annulerReservation } from "@/app/rdv/actions";

interface AnnulerButtonProps {
  token: string;
  reference: string;
}

export function AnnulerButton({ token, reference }: AnnulerButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [erreur, setErreur] = React.useState<string | null>(null);

  function handleClick() {
    setErreur(null);
    startTransition(async () => {
      const result = await annulerReservation(token);
      if (result.success) {
        router.push(`/rdv/annuler/${token}/succes`);
        return;
      }
      setErreur(result.error);
    });
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          asChild
          disabled={isPending}
        >
          <Link href={`/rdv/confirmation/${reference}`}>
            Garder mon RDV
          </Link>
        </Button>
        <Button
          onClick={handleClick}
          disabled={isPending}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isPending ? "Annulation en cours..." : "Confirmer l'annulation"}
        </Button>
      </div>

      {erreur && (
        <div className="mt-4 rounded-md bg-destructive/10 p-3 text-center">
          <p className="text-sm text-destructive">{erreur}</p>
        </div>
      )}
    </div>
  );
}
