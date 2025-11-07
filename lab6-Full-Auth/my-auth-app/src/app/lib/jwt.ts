import jwt, { SignOptions, JwtPayload, Secret } from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as Secret
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as Secret

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' } as SignOptions)
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' } as SignOptions)
}

export function verifyAccessToken<T = JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as T
  } catch {
    return null
  }
}

export function verifyRefreshToken<T = JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as T
  } catch {
    return null
  }
}

export function decodeToken(token: string) {
  try {
    return jwt.decode(token) as Record<string, unknown>
  } catch {
    return null
  }
}
