import { NextRequest, NextResponse } from 'next/server'
import { rotateRefreshToken } from '@/app/lib/refreshTokens'
import { accessCookie, refreshCookie, clearCookies } from '@/app/lib/cookies'
import { signAccessToken, decodeToken } from '@/app/lib/jwt'

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || ''
  const parsed = Object.fromEntries(
    cookieHeader.split(';').map(s => s.trim().split('='))
  )
  const refreshToken = parsed['refresh_token']

  if (!refreshToken) {
    const res = NextResponse.json({ error: 'No refresh token' }, { status: 401 })
    clearCookies().forEach(c => res.headers.append('Set-Cookie', c))
    return res
  }

  const result = await rotateRefreshToken(refreshToken)

  if (!result.success) {
    const res = NextResponse.json({ error: result.reason }, { status: 401 })
    clearCookies().forEach(c => res.headers.append('Set-Cookie', c))
    return res
  }

  // TypeScript now knows result.token exists
  if (!result.token) {
    // Defensive check — though type guard above should prevent this
    throw new Error('Refresh token missing')
  }

  const payload = decodeToken(result.token) as { userId?: string } | null

  if (!payload?.userId) {
    const res = NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    clearCookies().forEach(c => res.headers.append('Set-Cookie', c))
    return res
  }

  const access = signAccessToken({ userId: payload.userId })
  const res = NextResponse.json({ success: true })

  res.headers.append('Set-Cookie', accessCookie(access))
  res.headers.append('Set-Cookie', refreshCookie(result.token)) // ✅ safe now

  return res
}
