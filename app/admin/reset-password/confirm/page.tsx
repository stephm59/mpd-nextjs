import { updatePasswordAction } from "./actions";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function ConfirmResetPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorMessage = params.error
    ? params.error === "missing_password"
      ? "Veuillez renseigner un mot de passe."
      : params.error === "password_too_short"
        ? "Le mot de passe doit faire au moins 8 caractères."
        : params.error === "passwords_mismatch"
          ? "Les deux mots de passe ne correspondent pas."
          : params.error === "password_same"
            ? "Ce mot de passe est identique à l'ancien. Choisissez un nouveau mot de passe."
            : params.error === "update_failed"
            ? "La mise à jour a échoué. Le lien est peut-être expiré, réessayez."
            : "Erreur lors de la mise à jour."
    : null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Choisissez un nouveau mot de passe sécurisé (8 caractères minimum).
        </p>

        <form action={updatePasswordAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              autoFocus
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password_confirm" className="block text-sm font-medium text-slate-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              required
              minLength={8}
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
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>
    </main>
  );
}
