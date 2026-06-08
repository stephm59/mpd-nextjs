import "server-only";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";

/**
 * Vérifie si l'utilisateur courant est authentifié via Supabase Auth.
 * Appelé par les layouts/pages protégées pour gérer le redirect vers /admin/login.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const supabase = await createSupabaseAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user !== null;
}

/**
 * Retourne l'email de l'utilisateur courant si authentifié, sinon null.
 * Utile pour afficher "Connecté en tant que X" dans l'UI.
 */
export async function getCurrentAdminEmail(): Promise<string | null> {
  const supabase = await createSupabaseAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email ?? null;
}
