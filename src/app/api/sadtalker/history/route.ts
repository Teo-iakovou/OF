import { NextRequest, NextResponse } from "next/server";

import { getRedis } from "../_lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HISTORY_LIMIT = Number(process.env.SADTALKER_HISTORY_LIMIT || 50);

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams;
    const userParam = search.get("userId") || req.headers.get("x-sadtalker-user");
    const userId = userParam?.trim();
    if (!userId) {
      return NextResponse.json({ error: "userId query parameter is required" }, { status: 400 });
    }

    const redis = getRedis();
    const key = `sadtalker:history:${userId}`;
    const rows = await redis.lrange(key, 0, HISTORY_LIMIT - 1);
    const items = rows
      .map((row) => {
        try {
          return JSON.parse(row);
        } catch (err) {
          console.warn("[sadtalker:history] failed to parse row", err);
          return null;
        }
      })
      .filter((item): item is Record<string, unknown> => !!item);

    return NextResponse.json({ items });
  } catch (err) {
    console.error("[sadtalker:history] error", err);
    return NextResponse.json({ error: "Failed to load SadTalker history" }, { status: 500 });
  }
}
