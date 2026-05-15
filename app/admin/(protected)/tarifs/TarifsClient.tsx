"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertTarifAction } from "./actions";

interface Service {
  id: string;
  nom: string;
  slug: string;
}

interface Ville {
  id: string;
  code_postal: string;
  nom: string;
}

interface Tarif {
  id: string;
  service_id: string;
  ville_id: string;
  prix_centimes: number;
}

interface Props {
  services: Service[];
  villes: Ville[];
  tarifs: Tarif[];
}

export function TarifsClient({ services, villes, tarifs }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultService = services.find((s) => s.slug === "entretien-chaudiere") ?? services[0];
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(defaultService?.id ?? "");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingVilleId, setEditingVilleId] = React.useState<string | null>(null);
  const [editingValue, setEditingValue] = React.useState("");
  const [feedback, setFeedback] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);

  function notify(type: "success" | "error", msg: string) {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 2500);
  }

  const tarifsMap = React.useMemo(() => {
    const map = new Map<string, Tarif>();
    for (const t of tarifs) {
      map.set(`${t.service_id}_${t.ville_id}`, t);
    }
    return map;
  }, [tarifs]);

  function getTarif(villeId: string): Tarif | undefined {
    return tarifsMap.get(`${selectedServiceId}_${villeId}`);
  }

  function formatPrixEuros(centimes: number): string {
    return (centimes / 100).toFixed(2).replace(/\.00$/, "") + " €";
  }

  function startEdit(villeId: string, currentCentimes: number) {
    setEditingVilleId(villeId);
    setEditingValue((currentCentimes / 100).toString());
  }

  function cancelEdit() {
    setEditingVilleId(null);
    setEditingValue("");
  }

  async function saveEdit(villeId: string) {
    if (!selectedServiceId) return;

    startTransition(async () => {
      const result = await upsertTarifAction(selectedServiceId, villeId, editingValue);
      if (result.success) {
        notify("success", "Tarif enregistré");
        setEditingVilleId(null);
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
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Service</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white min-w-[240px]"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.nom}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-700 mb-1">Rechercher</label>
          <input
            type="text"
            placeholder="CP ou nom de ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm px-3 py-2 border border-slate-300 rounded-md text-sm"
          />
        </div>
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

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide w-24">CP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Ville</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide w-48">Prix</th>
            </tr>
          </thead>
          <tbody>
            {villesFiltered.map((v) => {
              const tarif = getTarif(v.id);
              const isEditing = editingVilleId === v.id;
              const prixCentimes = tarif?.prix_centimes ?? 0;

              return (
                <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-mono text-slate-700">{v.code_postal}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{v.nom}</td>
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(v.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          onBlur={() => saveEdit(v.id)}
                          autoFocus
                          disabled={isPending}
                          className="px-2 py-1 border border-blue-400 rounded-md text-sm w-24"
                          placeholder="0"
                        />
                        <span className="text-sm text-slate-500">€</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(v.id, prixCentimes)}
                        disabled={isPending}
                        className={`text-left px-2 py-1 rounded hover:bg-blue-50 hover:text-blue-700 ${
                          prixCentimes === 0 ? "text-slate-400 italic" : "text-slate-900 font-medium"
                        }`}
                      >
                        {prixCentimes === 0 ? "0 € (à définir)" : formatPrixEuros(prixCentimes)}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {villesFiltered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                  Aucune ville ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        {villesFiltered.length} villes affichées. Cliquez sur un prix pour le modifier. Entrée pour valider, Échap pour annuler.
      </p>
    </div>
  );
}
