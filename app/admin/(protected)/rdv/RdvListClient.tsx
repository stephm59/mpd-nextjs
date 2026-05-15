"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Rdv {
  id: string;
  reference: string | null;
  creneau_debut: string;
  creneau_fin: string;
  statut: string;
  prix_centimes: number;
  client_prenom: string | null;
  client_nom: string;
  service_nom: string | null;
  technicien_prenom: string | null;
  ville_nom: string | null;
  ville_cp: string | null;
}

interface Tech {
  id: string;
  prenom: string;
}
interface Service {
  id: string;
  nom: string;
}

interface Props {
  rdvs: Rdv[];
  total: number;
  page: number;
  totalPages: number;
  techniciens: Tech[];
  services: Service[];
  filtresInit: {
    statut: string;
    tech: string;
    service: string;
    q: string;
  };
}

export function RdvListClient({ rdvs, total, page, totalPages, techniciens, services, filtresInit }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/admin/rdv?${params.toString()}`);
  }

  function gotoPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/admin/rdv?${params.toString()}`);
  }

  function exportCSV() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    window.location.href = `/admin/rdv/export-csv?${params.toString()}`;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatHeure(iso: string) {
    return new Date(iso).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatPrix(centimes: number) {
    return (centimes / 100).toFixed(2).replace(/\.00$/, "") + " €";
  }

  function statutBadge(statut: string) {
    if (statut === "annule") {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Annulé</span>;
    }
    if (statut === "confirme") {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Confirmé</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">{statut}</span>;
  }

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            value={filtresInit.statut}
            onChange={(e) => updateFilter("statut", e.target.value === "tous" ? "" : e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
          >
            <option value="tous">Tous statuts</option>
            <option value="confirme">Confirmés</option>
            <option value="annule">Annulés</option>
            <option value="a_venir">À venir</option>
            <option value="passe">Passés</option>
          </select>

          <select
            value={filtresInit.tech}
            onChange={(e) => updateFilter("tech", e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
          >
            <option value="">Tous techs</option>
            {techniciens.map((t) => (
              <option key={t.id} value={t.id}>{t.prenom}</option>
            ))}
          </select>

          <select
            value={filtresInit.service}
            onChange={(e) => updateFilter("service", e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
          >
            <option value="">Tous services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.nom}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Recherche (nom, tel, email, réf)..."
            defaultValue={filtresInit.q}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("q", (e.target as HTMLInputElement).value);
              }
            }}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm md:col-span-1"
          />

          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm hover:bg-slate-800"
          >
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Service</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Tech</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Ville</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Prix</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {rdvs.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-slate-900">{formatDate(r.creneau_debut)}</div>
                  <div className="text-xs text-slate-500">{formatHeure(r.creneau_debut)}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  {r.client_prenom} {r.client_nom}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{r.service_nom}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{r.technicien_prenom}</td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {r.ville_nom}
                  <span className="text-xs text-slate-500 ml-1">({r.ville_cp})</span>
                </td>
                <td className="px-4 py-3 text-sm">{statutBadge(r.statut)}</td>
                <td className="px-4 py-3 text-sm font-medium">{formatPrix(r.prix_centimes)}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <Link href={`/admin/rdv/${r.id}`} className="text-blue-600 hover:underline text-xs">
                    Détail →
                  </Link>
                </td>
              </tr>
            ))}
            {rdvs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                  Aucune réservation ne correspond aux filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">{total} RDV au total</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => gotoPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50"
            >
              Précédent
            </button>
            <span className="text-sm text-slate-700">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => gotoPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
