import { prisma } from "@/app/lib/prisma";
import { signRefreshToken, decodeToken, verifyRefreshToken } from "./jwt";
import { addDays } from "date-fns";
import cuid from "cuid";

export async function createRefreshTokenForUser(userId: string, days = 7) {
  const jti = cuid();
  const expiresAt = addDays(new Date(), days);

  await prisma.refreshToken.create({
    data: { id: jti, userId, expiresAt },
  });

  const token = signRefreshToken({ userId, jti });

  return { token, jti, expiresAt };
}

export async function rotateRefreshToken(refreshJwt: string) {
  const payload = verifyRefreshToken<{ userId: string; jti: string }>(
    refreshJwt
  );

  if (!payload) {
    const decoded = decodeToken(refreshJwt);

    if (decoded?.userId) {
      await prisma.refreshToken.updateMany({
        where: { userId: decoded.userId },
        data: { revoked: true },
      });
    }

    return { success: false, reason: "invalid" };
  }

  const { userId, jti } = payload;

  const dbToken = await prisma.refreshToken.findUnique({
    where: { id: jti },
  });

  if (!dbToken || dbToken.revoked) {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });

    return { success: false, reason: "reuse" };
  }

  const newJti = cuid();
  const expiresAt = addDays(new Date(), 7);

  await prisma.refreshToken.create({
    data: { id: newJti, userId, expiresAt },
  });

  await prisma.refreshToken.update({
    where: { id: jti },
    data: { revoked: true, replacedBy: newJti },
  });

  const token = signRefreshToken({ userId, jti: newJti });

  return { success: true, token, newJti };
}
