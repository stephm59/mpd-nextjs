"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { annulerRdvAdminAction } from "../actions";

interface RdvDetail {
  id: string;
  reference: string | null;
  creneau_debut: string;
  creneau_fin: string;
  statut: string;
  prix_centimes: number;
  marque_nom: string | null;
  notes: string | null;
  annule_at: string | null;
  annule_par: string | null;
  created_at: string;
  client_prenom: string | null;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  client_adresse: string;
  client_complement: string | null;
  service_nom: string | null;
  technicien_prenom: string | null;
  ville_nom: string | null;
  ville_cp: string | null;
}

interface Props {
  rdv: RdvDetail;
}

export function RdvDetailClient({ rdv }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);

  function notify(type: "success" | "error", msg: string) {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleAnnuler() {
    startTransition(async () => {
      const result = await annulerRdvAdminAction(rdv.id);
      if (result.success) {
        notify("success", "RDV annulé");
        setShowConfirm(false);
        router.refresh();
      } else {
        notify("error", result.error);
      }
    });
  }

  const dateDebut = new Date(rdv.creneau_debut);
  const dateFin = new Date(rdv.creneau_fin);
  const isAnnule = rdv.statut === "annule";

  return (
    <div>
      {feedback && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          feedback.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {feedback.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Réservation</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Référence :</span> <span className="font-mono">{rdv.reference ?? "—"}</span></p>
              <p><span className="text-slate-500">Date :</span> {dateDebut.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
              <p><span className="text-slate-500">Heure :</span> {dateDebut.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - {dateFin.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
              <p><span className="text-slate-500">Service :</span> {rdv.service_nom}</p>
              {rdv.marque_nom && <p><span className="text-slate-500">Marque :</span> {rdv.marque_nom}</p>}
              <p><span className="text-slate-500">Tech :</span> {rdv.technicien_prenom}</p>
              <p><span className="text-slate-500">Prix :</span> {(rdv.prix_centimes / 100).toFixed(2).replace(/\.00$/, "")} €</p>
              <p><span className="text-slate-500">Statut :</span> {isAnnule ? <span className="text-red-700 font-medium">Annulé</span> : <span className="text-emerald-700 font-medium">Confirmé</span>}</p>
              {rdv.notes && (
                <div className="pt-2">
                  <p className="text-slate-500 mb-1">Notes client :</p>
                  <p className="bg-slate-50 p-3 rounded text-slate-700 whitespace-pre-wrap">{rdv.notes}</p>
                </div>
              )}
            </div>
          </div>

          {isAnnule && rdv.annule_at && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-3">Annulation</h2>
              <div className="space-y-2 text-sm">
                <p><span className="text-red-600">Annulé le :</span> {new Date(rdv.annule_at).toLocaleString("fr-FR")}</p>
                {rdv.annule_par && <p><span className="text-red-600">Par :</span> {rdv.annule_par}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Client</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-slate-900">{rdv.client_prenom} {rdv.client_nom}</p>
              <p><a href={`mailto:${rdv.client_email}`} className="text-blue-600 hover:underline">{rdv.client_email}</a></p>
              <p><a href={`tel:${rdv.client_telephone}`} className="text-blue-600 hover:underline">{rdv.client_telephone}</a></p>
              <div className="pt-2 text-slate-700">
                <p>{rdv.client_adresse}</p>
                {rdv.client_complement && <p className="text-slate-500">{rdv.client_complement}</p>}
                <p className="text-slate-500">{rdv.ville_cp} {rdv.ville_nom}</p>
              </div>
            </div>
          </div>

          {!isAnnule && (
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Actions</h2>
              {showConfirm ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-700">Confirmer l&apos;annulation de ce RDV ?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      disabled={isPending}
                      className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
                    >
                      Non
                    </button>
                    <button
                      onClick={handleAnnuler}
                      disabled={isPending}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {isPending ? "..." : "Oui, annuler"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Annuler ce RDV
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
