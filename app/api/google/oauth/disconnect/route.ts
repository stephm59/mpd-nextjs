import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin/session'
import { getPrimaryTokens, deleteTokens } from '@/lib/google/admin-storage'
import { revokeTokens } from '@/lib/google/oauth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    const tokens = await getPrimaryTokens()
    if (!tokens) {
      return NextResponse.redirect(new URL('/admin/google?status=disconnected', request.url))
    }

    try {
      await revokeTokens(tokens.refreshToken)
    } catch (err) {
      console.warn('[OAuth disconnect] Révocation Google échouée:', err)
    }

    await deleteTokens(tokens.googleEmail)

    return NextResponse.redirect(new URL('/admin/google?status=disconnected', request.url))
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.redirect(
      new URL(`/admin/google?error=${encodeURIComponent(message)}`, request.url)
    )
  }
}
