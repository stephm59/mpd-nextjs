import { isAdminAuthenticated } from "@/lib/admin/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/app/admin/login/actions";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900">Admin MPD</h1>
          <p className="text-xs text-slate-500 mt-1">Mon p&apos;tit Dépanneur</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            Vue d&apos;ensemble
          </Link>
          <Link href="/admin/rdv" className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            Réservations
          </Link>
          <Link href="/admin/villes" className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            Villes &amp; codes postaux
          </Link>
          <Link href="/admin/tarifs" className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            Tarifs
          </Link>
          <Link href="/admin/services" className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            Services
          </Link>
          <Link href="/admin/google" className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            Google Calendar
          </Link>
          <Link href="/admin/regles" className="block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900">
            Règles &amp; config
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full text-left text-sm text-slate-600 hover:text-slate-900"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
