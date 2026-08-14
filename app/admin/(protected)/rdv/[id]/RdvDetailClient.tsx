"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { annulerRdvAdminAction, deplacerRdvAdminAction } from "../actions";
import {
  getCreneauxDisponiblesAdmin,
  getTechniciensActifs,
  type CreneauAdmin,
} from "../nouveau/actions";
import { formatInTimeZone } from "date-fns-tz";
import { fr } from "date-fns/locale";

interface RdvDetail {
  id: string;
  reference: string | null;
  creneau_debut: string;
  creneau_fin: string;
  statut: string;
  prix_centimes: number;
  prix_libre: string | null;
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

export interface DeplacementContext {
  serviceId: string | null;
  villeId: string;
  technicienId: string;
  dureePersoMinutes: number | null;
  deplaceAt: string | null;
  deplacePar: string | null;
  creneauDebutInitial: string | null;
}

interface Props {
  rdv: RdvDetail;
  deplacement?: DeplacementContext | null;
}

export function RdvDetailClient({ rdv, deplacement }: Props) {
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
              <p><span className="text-slate-500">Prix :</span> {
                rdv.prix_libre && rdv.prix_libre.trim().length > 0
                  ? rdv.prix_libre
                  : `${(rdv.prix_centimes / 100).toFixed(2).replace(/\.00$/, "")} €`
              }</p>
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

          {!isAnnule && deplacement && (
            <DeplacerPanel
              rdvId={rdv.id}
              ctx={deplacement}
              creneauActuel={{ debut: rdv.creneau_debut, fin: rdv.creneau_fin }}
              onDone={(msg) => {
                notify("success", msg);
                router.refresh();
              }}
              onError={(msg) => notify("error", msg)}
            />
          )}

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

/**
 * Déplacement d'un RDV côté équipe.
 *
 * Utilise les créneaux admin (pas de délai mini, pas de blocage `date_premiere_reservation`,
 * tous les techs actifs) : quand un client appelle, Ophélie doit pouvoir caler ce qu'elle veut.
 */
function DeplacerPanel({
  rdvId,
  ctx,
  creneauActuel,
  onDone,
  onError,
}: {
  rdvId: string;
  ctx: DeplacementContext;
  creneauActuel: { debut: string; fin: string };
  onDone: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [ouvert, setOuvert] = React.useState(false);
  const [creneaux, setCreneaux] = React.useState<CreneauAdmin[] | null>(null);
  const [jourSelectionne, setJourSelectionne] = React.useState<string | null>(null);
  const [choix, setChoix] = React.useState<{ creneau: CreneauAdmin; technicienId: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    if (!ouvert || creneaux !== null) return;

    getTechniciensActifs().then((techs) => {
      getCreneauxDisponiblesAdmin({
        serviceId: ctx.serviceId,
        dureeMinutes: ctx.dureePersoMinutes,
        villeId: ctx.villeId,
        technicienIds: techs.map((t) => t.id),
      }).then(setCreneaux);
    });
  }, [ouvert, creneaux, ctx.serviceId, ctx.dureePersoMinutes, ctx.villeId]);

  function jourDe(iso: string): string {
    return formatInTimeZone(new Date(iso), "Europe/Paris", "yyyy-MM-dd");
  }

  const jours = creneaux
    ? Array.from(new Set(creneaux.map((c) => jourDe(c.debut)))).sort()
    : [];
  const creneauxDuJour = creneaux && jourSelectionne
    ? creneaux.filter((c) => jourDe(c.debut) === jourSelectionne)
    : [];

  function confirmer() {
    if (!choix) return;
    startTransition(async () => {
      const result = await deplacerRdvAdminAction({
        reservation_id: rdvId,
        date_debut: choix.creneau.debut,
        date_fin: choix.creneau.fin,
        technicien_id: choix.technicienId,
      });
      if (result.success) {
        setOuvert(false);
        setChoix(null);
        setCreneaux(null);
        onDone("RDV déplacé, client et technicien prévenus");
      } else {
        onError(result.error);
      }
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
        Déplacer
      </h2>

      {ctx.deplaceAt && (
        <p className="mb-3 text-xs text-slate-500">
          Déjà déplacé le{" "}
          {formatInTimeZone(new Date(ctx.deplaceAt), "Europe/Paris", "dd/MM/yyyy 'à' HH:mm")}
          {ctx.deplacePar === "client" ? " par le client" : " par l'équipe"}
          {ctx.creneauDebutInitial && (
            <>
              {" · créneau d'origine : "}
              {formatInTimeZone(new Date(ctx.creneauDebutInitial), "Europe/Paris", "dd/MM/yyyy HH:mm")}
            </>
          )}
        </p>
      )}

      {!ouvert ? (
        <button
          onClick={() => setOuvert(true)}
          className="text-blue-600 text-sm hover:underline"
        >
          Déplacer ce RDV
        </button>
      ) : (
        <div>
          <p className="mb-3 text-sm text-slate-600">
            Créneau actuel :{" "}
            <strong className="text-slate-900">
              {formatInTimeZone(new Date(creneauActuel.debut), "Europe/Paris", "dd/MM/yyyy HH:mm")}
              {" - "}
              {formatInTimeZone(new Date(creneauActuel.fin), "Europe/Paris", "HH:mm")}
            </strong>
          </p>

          {creneaux === null && (
            <p className="text-sm text-slate-500">Chargement des disponibilités...</p>
          )}

          {creneaux !== null && jours.length === 0 && (
            <p className="text-sm text-slate-500">
              Aucun créneau disponible. Vérifiez la connexion Google Calendar.
            </p>
          )}

          {creneaux !== null && jours.length > 0 && (
            <>
              <label className="block text-xs font-medium text-slate-600 mb-1">Jour</label>
              <select
                value={jourSelectionne ?? ""}
                onChange={(e) => {
                  setJourSelectionne(e.target.value || null);
                  setChoix(null);
                }}
                className="w-full mb-3 rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Choisir un jour...</option>
                {jours.map((j) => (
                  <option key={j} value={j}>
                    {formatInTimeZone(new Date(`${j}T12:00:00Z`), "Europe/Paris", "EEEE d MMMM yyyy", {
                      locale: fr,
                    })}
                  </option>
                ))}
              </select>

              {jourSelectionne && (
                <div className="space-y-1.5 max-h-64 overflow-auto">
                  {creneauxDuJour.map((c) =>
                    c.techniciens_libres.map((t) => {
                      const actif =
                        choix?.creneau.debut === c.debut && choix?.technicienId === t.id;
                      return (
                        <button
                          key={`${c.debut}-${t.id}`}
                          onClick={() => setChoix({ creneau: c, technicienId: t.id })}
                          className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                            actif
                              ? "border-blue-500 bg-blue-50 text-slate-900"
                              : "border-slate-200 hover:border-blue-400"
                          }`}
                        >
                          <span className="font-medium">
                            {formatInTimeZone(new Date(c.debut), "Europe/Paris", "HH:mm")}
                            {" - "}
                            {formatInTimeZone(new Date(c.fin), "Europe/Paris", "HH:mm")}
                          </span>
                          <span className="ml-2 text-slate-500">{t.prenom}</span>
                          {t.id === ctx.technicienId && (
                            <span className="ml-2 text-xs text-slate-400">(tech actuel)</span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setOuvert(false);
                setChoix(null);
              }}
              disabled={isPending}
              className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
            >
              Fermer
            </button>
            <button
              onClick={confirmer}
              disabled={!choix || isPending}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "..." : "Confirmer le déplacement"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Le client recevra un email avec son nouveau créneau.
          </p>
        </div>
      )}
    </div>
  );
}
