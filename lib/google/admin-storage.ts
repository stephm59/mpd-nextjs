import { createAdminClient } from '@/lib/supabase/admin'
import { refreshAccessToken } from './oauth'

const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000 // 5 min de marge avant expiration

export interface StoredTokens {
  googleEmail: string
  refreshToken: string
  accessToken: string | null
  accessTokenExpiresAt: Date | null
  scopes: string[]
}

// TODO: retirer ce type local après application de la migration 008
// et régénération des types Supabase. À ce moment-là, supabase.from('google_oauth_tokens')
// sera correctement typé via Database['public']['Tables']['google_oauth_tokens'].
interface GoogleOauthTokenRow {
  id: string
  google_email: string
  refresh_token: string
  access_token: string | null
  access_token_expires_at: string | null
  scopes: string[] | null
  created_at: string | null
  updated_at: string | null
  last_used_at: string | null
}

// Cast temporaire pour adresser la table google_oauth_tokens (migration 008 pending).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tokensTable(): any {
  return createAdminClient().from('google_oauth_tokens' as never)
}

/**
 * Sauvegarde ou met à jour les tokens pour un compte Google.
 */
export async function saveTokens(
  googleEmail: string,
  data: {
    refreshToken: string
    accessToken: string
    expiryDate: Date | null
    scopes: string[]
  }
): Promise<void> {
  const { error } = await tokensTable()
    .upsert(
      {
        google_email: googleEmail,
        refresh_token: data.refreshToken,
        access_token: data.accessToken,
        access_token_expires_at: data.expiryDate?.toISOString() ?? null,
        scopes: data.scopes,
        updated_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
      },
      { onConflict: 'google_email' }
    )

  if (error) {
    throw new Error(`Échec de sauvegarde tokens : ${error.message}`)
  }
}

/**
 * Récupère les tokens stockés pour un compte Google.
 */
export async function getStoredTokens(
  googleEmail: string
): Promise<StoredTokens | null> {
  const { data, error } = await tokensTable()
    .select('*')
    .eq('google_email', googleEmail)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[getStoredTokens] Erreur:', error.message)
    return null
  }

  if (!data) return null

  const row = data as GoogleOauthTokenRow
  return {
    googleEmail: row.google_email,
    refreshToken: row.refresh_token,
    accessToken: row.access_token,
    accessTokenExpiresAt: row.access_token_expires_at
      ? new Date(row.access_token_expires_at)
      : null,
    scopes: row.scopes ?? [],
  }
}

/**
 * Récupère le premier compte connecté (en pratique : David).
 */
export async function getPrimaryTokens(): Promise<StoredTokens | null> {
  const { data, error } = await tokensTable()
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  const row = data as GoogleOauthTokenRow
  return {
    googleEmail: row.google_email,
    refreshToken: row.refresh_token,
    accessToken: row.access_token,
    accessTokenExpiresAt: row.access_token_expires_at
      ? new Date(row.access_token_expires_at)
      : null,
    scopes: row.scopes ?? [],
  }
}

/**
 * Retourne un access_token valide, en rafraîchissant si nécessaire.
 */
export async function getValidAccessToken(googleEmail: string): Promise<string> {
  const tokens = await getStoredTokens(googleEmail)
  if (!tokens) {
    throw new Error(
      `Aucun token trouvé pour ${googleEmail}. L'utilisateur doit autoriser via /admin/google.`
    )
  }

  const now = new Date()
  const expiresAt = tokens.accessTokenExpiresAt

  if (
    tokens.accessToken &&
    expiresAt &&
    expiresAt.getTime() > now.getTime() + TOKEN_REFRESH_MARGIN_MS
  ) {
    return tokens.accessToken
  }

  const refreshed = await refreshAccessToken(tokens.refreshToken)

  await tokensTable()
    .update({
      access_token: refreshed.accessToken,
      access_token_expires_at: refreshed.expiryDate?.toISOString() ?? null,
      last_used_at: new Date().toISOString(),
    })
    .eq('google_email', googleEmail)

  return refreshed.accessToken
}

/**
 * Supprime les tokens (déconnexion).
 */
export async function deleteTokens(googleEmail: string): Promise<void> {
  const { error } = await tokensTable()
    .delete()
    .eq('google_email', googleEmail)

  if (error) {
    throw new Error(`Échec de suppression : ${error.message}`)
  }
}
