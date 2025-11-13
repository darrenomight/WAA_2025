import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redisClient as redis } from "@/lib/redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const cacheKey = `products:page:${page}:limit:${limit}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("Cache hit for", cacheKey);
    return NextResponse.json(JSON.parse(cached));
  }

  console.log("Fetching from DB...");
  const products = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  await redis.set(cacheKey, JSON.stringify(products), "EX", 60);

  return NextResponse.json(products);
}
