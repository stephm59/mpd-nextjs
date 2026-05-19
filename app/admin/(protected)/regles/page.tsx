import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPrimaryTokens } from "@/lib/google/admin-storage";
import {
  Calendar,
  Users,
  Clock,
  Mail,
  MapPin,
  Euro,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReglesPage() {
  const supabase = createAdminClient();

  const [
    { data: parametres },
    { data: techniciens },
    { data: services },
    { data: competences },
    { count: nbVilles },
    { count: nbTarifs },
    { count: nbReservations },
    googleTokens,
  ] = await Promise.all([
    supabase.from("rdv_parametres").select("*").order("cle"),
    supabase.from("rdv_techniciens").select("id, prenom, email_workspace, email_google").order("prenom"),
    supabase.from("rdv_services").select("id, nom").order("nom"),
    supabase.from("rdv_competences").select("technicien_id, service_id"),
    supabase.from("rdv_villes").select("*", { count: "exact", head: true }),
    supabase.from("rdv_tarifs_ville").select("*", { count: "exact", head: true }),
    supabase.from("rdv_reservations").select("*", { count: "exact", head: true }),
    getPrimaryTokens(),
  ]);

  const aCompetence = (techId: string, serviceId: string) => {
    return competences?.some(
      (c) => c.technicien_id === techId && c.service_id === serviceId
    ) ?? false;
  };

  const param = (cle: string) => {
    return parametres?.find((p) => p.cle === cle)?.valeur ?? "—";
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Règles &amp; Configuration</h1>
        <p className="text-slate-600 mt-2">
          Vue d&apos;ensemble du fonctionnement du système de réservation.
          Pour modifier une règle, suivez le lien correspondant.
        </p>
      </header>

      <div className="space-y-6">

        <SectionCard
          icon={<Calendar className="w-5 h-5 text-blue-600" />}
          title="Synchronisation Google Calendar"
          subtitle="Les RDV se créent automatiquement dans les agendas des techniciens"
          editLink={{ href: "/admin/google", label: "Gérer" }}
        >
          {googleTokens ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="font-medium text-slate-900">Connecté</span>
                <span className="text-slate-600">— {googleTokens.googleEmail}</span>
              </div>
              <div className="text-xs text-slate-500 ml-6">
                Scopes : {googleTokens.scopes.map((s) => s.split("/").pop()).join(", ")}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-slate-900">Non connecté — les RDV ne sont pas synchronisés avec Google</span>
            </div>
          )}
        </SectionCard>

        <SectionCard
          icon={<Users className="w-5 h-5 text-purple-600" />}
          title="Techniciens & compétences"
          subtitle={`${techniciens?.length ?? 0} techniciens, ${services?.length ?? 0} services. Coche = le tech intervient sur ce service.`}
          editLink={{ href: "/admin/services", label: "Modifier" }}
        >
          {techniciens && services && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-2 font-medium text-slate-700">Technicien</th>
                    <th className="text-left p-2 font-medium text-slate-700">Email Google</th>
                    {services.map((s) => (
                      <th key={s.id} className="text-center p-2 font-medium text-slate-700">
                        {s.nom}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {techniciens.map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 last:border-0">
                      <td className="p-2 font-medium text-slate-900">{t.prenom}</td>
                      <td className="p-2 text-xs text-slate-600">
                        {t.email_google ?? <span className="text-amber-600">⚠ non renseigné</span>}
                      </td>
                      {services.map((s) => (
                        <td key={s.id} className="text-center p-2">
                          {aCompetence(t.id, s.id) ? (
                            <span className="text-green-600 text-lg" title="Oui">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          icon={<Clock className="w-5 h-5 text-orange-600" />}
          title="Règles temporelles"
          subtitle="Quand et comment les clients peuvent prendre RDV"
          editLink={{ href: "/admin", label: "Modifier" }}
        >
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Délai minimum avant un RDV</dt>
              <dd className="font-medium text-slate-900">{param("delai_minimum_jours")} jour(s)</dd>
            </div>
            <div>
              <dt className="text-slate-500">Jours visibles dans le tunnel</dt>
              <dd className="font-medium text-slate-900">{param("jours_visibles_futur")} jours</dd>
            </div>
            <div>
              <dt className="text-slate-500">Max RDV/jour (toute l&apos;équipe)</dt>
              <dd className="font-medium text-slate-900">{param("max_rdv_jour_total")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Jours ouvrés</dt>
              <dd className="font-medium text-slate-900 capitalize">{param("jours_ouvres").replace(/,/g, ", ")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Horaires Lundi-Jeudi</dt>
              <dd className="font-medium text-slate-900">{param("horaires_lundi_jeudi").replace(/,/g, "  /  ")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Horaires Vendredi</dt>
              <dd className="font-medium text-slate-900">{param("horaires_vendredi").replace(/,/g, "  /  ")}</dd>
            </div>
          
            <div>
              <dt className="text-slate-500">Délai limite pour annuler en ligne</dt>
              <dd className="font-medium text-slate-900">48 heures avant le RDV</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard
          icon={<Mail className="w-5 h-5 text-green-600" />}
          title="Communications automatiques"
          subtitle="Emails envoyés automatiquement par le système"
        >
          <ul className="space-y-2 text-sm text-slate-700">
            <li>✉️ <strong>Email de confirmation client</strong> — envoyé immédiatement après la réservation</li>
            <li>📨 <strong>Email de notification équipe</strong> — envoyé à contact@monptitdepanneur.fr</li>
            <li>⏰ <strong>Rappel J-1</strong> — envoyé la veille à 08h UTC (cron)</li>
            <li>⭐ <strong>Demande d&apos;avis Google</strong> — envoyée 24h après le RDV (cron)</li>
            <li>❌ <strong>Email d&apos;annulation</strong> — envoyé immédiatement lors de l&apos;annulation par le client</li>
          </ul>
        </SectionCard>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CounterCard icon={<MapPin className="w-5 h-5 text-rose-600" />} label="Villes desservies" value={nbVilles ?? 0} href="/admin/villes" />
          <CounterCard icon={<Euro className="w-5 h-5 text-emerald-600" />} label="Tarifs configurés" value={nbTarifs ?? 0} href="/admin/tarifs" />
          <CounterCard icon={<Users className="w-5 h-5 text-purple-600" />} label="Services" value={services?.length ?? 0} href="/admin/services" />
          <CounterCard icon={<Calendar className="w-5 h-5 text-blue-600" />} label="Réservations" value={nbReservations ?? 0} href="/admin/rdv" />
        </div>

      </div>
    </div>
  );
}

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  editLink?: { href: string; label: string };
  children: React.ReactNode;
}

function SectionCard({ icon, title, subtitle, editLink, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{icon}</div>
          <div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {editLink && (
          <Link
            href={editLink.href}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {editLink.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

interface CounterCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
}

function CounterCard({ icon, label, value, href }: CounterCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-slate-300 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </Link>
  );
}
