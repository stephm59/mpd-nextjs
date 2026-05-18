import { google } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly','openid',
  'https://www.googleapis.com/auth/userinfo.email',
]

/**
 * Crée un client OAuth2 Google avec les credentials du projet.
 */
export function getOAuth2Client(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Missing Google OAuth env vars : GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI'
    )
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

/**
 * Génère l'URL d'autorisation Google. Le state prévient les attaques CSRF.
 */
export function getAuthUrl(state: string): string {
  const client = getOAuth2Client()
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state,
  })
}

/**
 * Échange le code reçu en callback contre access_token + refresh_token.
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  refreshToken: string
  accessToken: string
  expiryDate: Date | null
  scopes: string[]
  googleEmail: string
}> {
  const client = getOAuth2Client()
  const { tokens } = await client.getToken(code)

  if (!tokens.refresh_token) {
    throw new Error(
      "Aucun refresh_token reçu. Solution : aller dans https://myaccount.google.com/permissions, " +
      "supprimer l'accès de l'app Mon p'tit Dépanneur, puis réessayer."
    )
  }

  if (!tokens.access_token) {
    throw new Error("Aucun access_token reçu de Google.")
  }

  client.setCredentials(tokens)
  const oauth2 = google.oauth2({ version: 'v2', auth: client })
  const userInfo = await oauth2.userinfo.get()

  if (!userInfo.data.email) {
    throw new Error("Impossible de récupérer l'email Google de l'utilisateur.")
  }

  return {
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token,
    expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    scopes: tokens.scope ? tokens.scope.split(' ') : SCOPES,
    googleEmail: userInfo.data.email,
  }
}

/**
 * Rafraîchit un access_token expiré.
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string
  expiryDate: Date | null
}> {
  const client = getOAuth2Client()
  client.setCredentials({ refresh_token: refreshToken })

  const { credentials } = await client.refreshAccessToken()

  if (!credentials.access_token) {
    throw new Error("Échec du refresh : pas de nouveau access_token reçu.")
  }

  return {
    accessToken: credentials.access_token,
    expiryDate: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
  }
}

/**
 * Révoque les tokens d'un utilisateur (déconnexion).
 */
export async function revokeTokens(refreshToken: string): Promise<void> {
  const client = getOAuth2Client()
  await client.revokeToken(refreshToken)
}
