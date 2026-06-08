import { requestPasswordResetAction } from "./actions";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ error?: string; sent?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isSent = params.sent === "1";
  const errorMessage = params.error === "missing_email"
    ? "Veuillez renseigner votre email."
    : params.error === "link_expired"
      ? "Le lien a expiré ou a déjà été utilisé. Demandez un nouveau lien ci-dessous."
      : null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Mot de passe oublié
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Renseignez votre email pour recevoir un lien de réinitialisation.
        </p>

        {isSent ? (
          <div className="space-y-4">
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">
              Si cet email est enregistré, vous recevrez un lien de réinitialisation dans quelques minutes.
            </p>
            <Link
              href="/admin/login"
              className="block text-center text-sm text-blue-600 hover:underline"
            >
              ← Retour à la connexion
            </Link>
          </div>
        ) : (
          <form action={requestPasswordResetAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoFocus
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Envoyer le lien de réinitialisation
            </button>

            <Link
              href="/admin/login"
              className="block text-center text-sm text-slate-600 hover:underline pt-2"
            >
              ← Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
