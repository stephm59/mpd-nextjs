"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  modifierServiceNomAction,
  modifierServiceDureeAction,
  modifierServiceOrdreAction,
  toggleServiceDevisAction,
  toggleServiceActifAction,
} from "./actions";

interface Service {
  id: string;
  nom: string;
  slug: string;
  duree_minutes: number;
  ordre: number;
  est_devis: boolean;
  est_actif: boolean;
  description: string | null;
}

interface Props {
  services: Service[];
}

export function ServicesClient({ services }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = React.useState<{ id: string; field: "nom" | "duree"; value: string } | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);

  function notify(type: "success" | "error", msg: string) {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 2500);
  }

  function startEdit(id: string, field: "nom" | "duree", currentValue: string | number) {
    setEditing({ id, field, value: String(currentValue) });
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function saveEdit() {
    if (!editing) return;

    startTransition(async () => {
      let result;
      if (editing.field === "nom") {
        result = await modifierServiceNomAction(editing.id, editing.value);
      } else {
        result = await modifierServiceDureeAction(editing.id, editing.value);
      }

      if (result.success) {
        notify("success", "Service modifié");
        setEditing(null);
        router.refresh();
      } else {
        notify("error", result.error);
      }
    });
  }

  async function moveOrdre(id: string, currentOrdre: number, direction: "up" | "down") {
    const newOrdre = direction === "up" ? currentOrdre - 1 : currentOrdre + 1;
    if (newOrdre < 0) return;

    startTransition(async () => {
      const result = await modifierServiceOrdreAction(id, newOrdre);
      if (result.success) {
        notify("success", "Ordre modifié");
        router.refresh();
      } else {
        notify("error", result.error);
      }
    });
  }

  async function handleToggleDevis(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleServiceDevisAction(id, !current);
      if (result.success) {
        notify("success", "Type modifié");
        router.refresh();
      } else {
        notify("error", result.error);
      }
    });
  }

  async function handleToggleActif(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleServiceActifAction(id, !current);
      if (result.success) {
        notify("success", current ? "Service désactivé" : "Service activé");
        router.refresh();
      } else {
        notify("error", result.error);
      }
    });
  }

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

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide w-32">Ordre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide w-32">Durée</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide w-32">Type</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wide w-32">Statut</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => {
              const isEditingNom = editing?.id === s.id && editing.field === "nom";
              const isEditingDuree = editing?.id === s.id && editing.field === "duree";

              return (
                <tr key={s.id} className={`border-b border-slate-100 hover:bg-slate-50 ${!s.est_actif ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-slate-700 w-6">{s.ordre}</span>
                      <button
                        onClick={() => moveOrdre(s.id, s.ordre, "up")}
                        disabled={isPending}
                        className="px-1.5 py-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-50"
                        title="Monter"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveOrdre(s.id, s.ordre, "down")}
                        disabled={isPending}
                        className="px-1.5 py-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-50"
                        title="Descendre"
                      >
                        ↓
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-900">
                    {isEditingNom ? (
                      <input
                        type="text"
                        value={editing.value}
                        onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        onBlur={saveEdit}
                        autoFocus
                        disabled={isPending}
                        className="px-2 py-1 border border-blue-400 rounded-md text-sm w-full"
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(s.id, "nom", s.nom)}
                        className="text-left hover:text-blue-600 w-full"
                      >
                        {s.nom}
                      </button>
                    )}
                    {s.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {isEditingDuree ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={editing.value}
                          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          onBlur={saveEdit}
                          autoFocus
                          disabled={isPending}
                          className="px-2 py-1 border border-blue-400 rounded-md text-sm w-16"
                        />
                        <span className="text-xs text-slate-500">min</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(s.id, "duree", s.duree_minutes)}
                        className="hover:text-blue-600"
                      >
                        {s.duree_minutes} min
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleToggleDevis(s.id, s.est_devis)}
                      disabled={isPending}
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium disabled:opacity-50 ${
                        s.est_devis
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {s.est_devis ? "Devis" : "Standard"}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => handleToggleActif(s.id, s.est_actif)}
                      disabled={isPending}
                      className={`text-xs px-3 py-1 rounded-md disabled:opacity-50 ${
                        s.est_actif
                          ? "text-slate-600 hover:bg-slate-100"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {s.est_actif ? "Désactiver" : "Activer"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Cliquez sur un nom ou une durée pour les modifier. Utilisez ↑↓ pour changer l&apos;ordre. Cliquez sur le badge pour changer le type Standard/Devis. Désactivez un service pour le retirer du tunnel /rdv.
      </p>
    </div>
  );
}
