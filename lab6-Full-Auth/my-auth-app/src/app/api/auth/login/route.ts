import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/app/lib/prisma'
import { signAccessToken } from '@/app/lib/jwt'
import { createRefreshTokenForUser } from '@/app/lib/refreshTokens'
import { accessCookie, refreshCookie } from '@/app/lib/cookies'

// Specify the runtime for this route segment
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const access = signAccessToken({ userId: user.id })
    const { token: refresh } = await createRefreshTokenForUser(user.id)

    const res = NextResponse.json({ success: true })
    res.headers.append('Set-Cookie', accessCookie(access))
    res.headers.append('Set-Cookie', refreshCookie(refresh))

    return res
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
