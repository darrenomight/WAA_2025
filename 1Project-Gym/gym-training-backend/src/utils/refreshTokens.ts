import { prisma } from "./prisma";
import { signRefreshToken, verifyRefreshToken, decodeToken } from "./jwt";
import { randomUUID } from "crypto";

// Create a new refresh token for a user
export async function createRefreshTokenForUser(
  userId: string,
  email: string,
  days: number = 7
) {
  const jti = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      id: jti,
      userId,
      expiresAt,
    },
  });

  // Generate JWT
  const token = signRefreshToken({ userId, email, jti });

  return { token, jti, expiresAt };
}

// Rotate refresh token (exchange old for new)
export async function rotateRefreshToken(refreshJwt: string) {
  // Verify the token
  const payload = verifyRefreshToken(refreshJwt);

  if (!payload) {
    // Token is invalid/expired, try to decode and revoke all user tokens
    const decoded = decodeToken(refreshJwt) as any;
    if (decoded?.userId) {
      await prisma.refreshToken.updateMany({
        where: { userId: decoded.userId },
        data: { revoked: true },
      });
    }
    return { success: false, reason: "invalid" };
  }

  const { userId, email, jti } = payload;

  // Check if token exists in database and is not revoked
  const dbToken = await prisma.refreshToken.findUnique({
    where: { id: jti },
  });

  if (!dbToken || dbToken.revoked) {
    // Token reuse detected! Revoke all tokens for this user
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
    return { success: false, reason: "reuse" };
  }

  // Create new refresh token
  const newJti = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      id: newJti,
      userId,
      expiresAt,
    },
  });

  // Mark old token as revoked and replaced
  await prisma.refreshToken.update({
    where: { id: jti },
    data: {
      revoked: true,
      replacedBy: newJti,
    },
  });

  // Generate new JWT
  const token = signRefreshToken({ userId, email, jti: newJti });

  return { success: true, token, newJti };
}

// Revoke all refresh tokens for a user (logout from all devices)
export async function revokeAllUserTokens(userId: string) {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}