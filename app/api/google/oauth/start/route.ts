import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { isAdminAuthenticated } from '@/lib/admin/session'
import { getAuthUrl } from '@/lib/google/oauth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const state = crypto.randomBytes(32).toString('hex')
  const authUrl = getAuthUrl(state)

  const response = NextResponse.redirect(authUrl)
  response.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  return response
}
