"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ajouterVilleAction,
  modifierVilleAction,
  toggleVilleActiveAction,
} from "./actions";

interface Ville {
  id: string;
  code_postal: string;
  nom: string;
  est_active: boolean;
}

interface Props {
  villes: Ville[];
}

export function VillesClient({ villes }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingNom, setEditingNom] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);

  function notify(type: "success" | "error", msg: string) {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  }

  async function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await ajouterVilleAction(formData);
      if (result.success) {
        notify(
          "success",
          "Ville ajoutée. Ajoutez maintenant les tarifs dans la section Tarifs pour rendre cette ville disponible."
        );
        setShowAdd(false);
        router.refresh();
      } else {
        notify("error", result.error);
      }
    });
  }

  async function handleEditSave(id: string) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("nom", editingNom);
    startTransition(async () => {
      const result = await modifierVilleAction(formData);
      if (result.success) {
        notify("success", "Nom modifié");
        setEditingId(null);
        router.refresh();
      } else {
        notify("error", result.error);
      }
    });
  }

  async function handleToggle(id: string, currentActive: boolean) {
    startTransition(async () => {
      const result = await toggleVilleActiveAction(id, !currentActive);
      if (result.success) {
        notify("success", currentActive ? "Ville désactivée" : "Ville activée");
        router.refresh();
      } else {
        notify("error", result.error);
      }
    });
  }

  const villesFiltered = villes.filter((v) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return v.code_postal.includes(q) || v.nom.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Rechercher (CP ou nom)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-sm px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => setShowAdd(true)}
          disabled={isPending}
          className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm hover:bg-slate-800 disabled:opacity-50"
        >
          + Ajouter une ville
        </button>
      </div>

      {feedback && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          feedback.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {feedback.msg}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Ajouter une ville</h2>
            <form action={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  name="code_postal"
                  required
                  pattern="[0-9]{5}"
                  placeholder="59000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom de la ville
                </label>
                <input
                  type="text"
                  name="nom"
                  required
                  placeholder="Lille"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-slate-900 text-white text-sm rounded-md hover:bg-slate-800 disabled:opacity-50"
                >
                  {isPending ? "Ajout..." : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">CP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Ville</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Statut</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {villesFiltered.map((v) => (
              <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-sm font-mono text-slate-700">{v.code_postal}</td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  {editingId === v.id ? (
                    <input
                      type="text"
                      value={editingNom}
                      onChange={(e) => setEditingNom(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSave(v.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onBlur={() => handleEditSave(v.id)}
                      autoFocus
                      className="px-2 py-1 border border-slate-300 rounded-md text-sm w-full"
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(v.id);
                        setEditingNom(v.nom);
                      }}
                      className="text-left hover:text-blue-600"
                    >
                      {v.nom}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {v.est_active ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      Désactivée
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <button
                    onClick={() => handleToggle(v.id, v.est_active)}
                    disabled={isPending}
                    className={`text-xs px-3 py-1 rounded-md ${
                      v.est_active
                        ? "text-slate-600 hover:bg-slate-100"
                        : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {v.est_active ? "Désactiver" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
            {villesFiltered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                  Aucune ville ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
