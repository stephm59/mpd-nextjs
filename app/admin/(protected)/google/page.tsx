import Link from 'next/link'
import { CheckCircle2, AlertCircle, Calendar, LogOut } from 'lucide-react'
import { getPrimaryTokens } from '@/lib/google/admin-storage'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ status?: string; error?: string }>
}

export default async function AdminGooglePage({ searchParams }: PageProps) {
  // Auth gérée par app/admin/(protected)/layout.tsx (redirige si non auth)

  const tokens = await getPrimaryTokens()
  const params = await searchParams
  const isConnected = !!tokens

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/admin" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Retour au tableau de bord
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Calendar</h1>
      <p className="text-gray-600 mb-8">
        Connecter Google Calendar pour que les RDV créés sur le site apparaissent automatiquement
        dans les agendas des techniciens.
      </p>

      {params.status === 'success' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900">Connexion réussie</p>
            <p className="text-sm text-green-700">Le site peut maintenant gérer les agendas Google.</p>
          </div>
        </div>
      )}

      {params.status === 'disconnected' && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Déconnecté</p>
            <p className="text-sm text-amber-700">Les RDV ne seront plus synchronisés avec Google Calendar.</p>
          </div>
        </div>
      )}

      {params.error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Erreur</p>
            <p className="text-sm text-red-700">{decodeURIComponent(params.error)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-card p-8">
        {isConnected ? (
          <ConnectedState email={tokens.googleEmail} />
        ) : (
          <DisconnectedState />
        )}
      </div>
    </div>
  )
}

function ConnectedState({ email }: { email: string }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Connecté à Google Calendar</p>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          <strong>Ce qui fonctionne maintenant :</strong>
        </p>
        <ul className="mt-2 space-y-1 text-sm text-blue-800 ml-4">
          <li>• Les nouveaux RDV sont automatiquement créés dans le Google Calendar du tech assigné</li>
          <li>• Les annulations suppriment automatiquement l&apos;événement</li>
          <li>• Les créneaux occupés des techs sont masqués dans le tunnel de réservation</li>
        </ul>
      </div>

      <form action="/api/google/oauth/disconnect" method="POST">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Déconnecter Google Calendar
        </button>
      </form>
    </>
  )
}

function DisconnectedState() {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Non connecté</p>
          <p className="text-sm text-gray-600">Aucun compte Google n&apos;est associé.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-900 mb-2">
          <strong>Pourquoi se connecter ?</strong>
        </p>
        <ul className="space-y-1 text-sm text-amber-800 ml-4">
          <li>• Les RDV pris en ligne apparaîtront automatiquement dans les calendriers des techs</li>
          <li>• Plus besoin de saisir manuellement les RDV (Ophélie économise du temps)</li>
          <li>• Le tunnel propose seulement les créneaux où le tech est disponible</li>
        </ul>
      </div>

      <a
        href="/api/google/oauth/start"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <Calendar className="w-4 h-4" />
        Connecter Google Calendar
      </a>

      <p className="mt-4 text-xs text-gray-500">
        Vous serez redirigé vers Google pour autoriser l&apos;accès. Une seule autorisation suffit.
      </p>
    </>
  )
}
