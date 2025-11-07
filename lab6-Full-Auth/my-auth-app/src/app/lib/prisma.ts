import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Only create one PrismaClient instance in dev to prevent multiple connections
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
