import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@/lib/google/oauth'
import { saveTokens } from '@/lib/google/admin-storage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/google?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  const stateCookie = request.cookies.get('google_oauth_state')?.value
  if (!state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(
      new URL(`/admin/google?error=${encodeURIComponent('État OAuth invalide (CSRF)')}`, request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`/admin/google?error=${encodeURIComponent('Aucun code reçu')}`, request.url)
    )
  }

  try {
    const result = await exchangeCodeForTokens(code)

    await saveTokens(result.googleEmail, {
      refreshToken: result.refreshToken,
      accessToken: result.accessToken,
      expiryDate: result.expiryDate,
      scopes: result.scopes,
    })

    const response = NextResponse.redirect(new URL('/admin/google?status=success', request.url))
    response.cookies.delete('google_oauth_state')
    return response
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[OAuth callback] Erreur:', message)
    return NextResponse.redirect(
      new URL(`/admin/google?error=${encodeURIComponent(message)}`, request.url)
    )
  }
}
