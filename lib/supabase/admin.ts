import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Client Supabase ADMIN avec service_role.
 *
 * ⚠️ À utiliser UNIQUEMENT côté serveur (Server Actions, Route Handlers).
 * Cette clé contourne les RLS, ne JAMAIS l'importer dans un composant client.
 *
 * Le import 'server-only' empêche son import côté client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Variables d\'environnement Supabase manquantes (NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY)'
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
