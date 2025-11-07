import { NextResponse } from 'next/server'
import { deleteCookie } from '@/app/lib/cookies'

// Ensure Node runtime for Prisma-dependent code if needed

export const runtime = 'nodejs'

export async function POST() {
    const res = NextResponse.json({ success: true })

    // Clear cookies
    res.headers.append('Set-Cookie',deleteCookie('access_token'))
    res.headers.append('Set-Cookie',deleteCookie('refresh_token'))

    return res
}
