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

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const userId = typeof body?.userId === "string" ? body.userId.trim() : "";
    const jobId = typeof body?.jobId === "string" ? body.jobId.trim() : "";
    if (!userId || !jobId) {
      return NextResponse.json({ error: "userId and jobId are required" }, { status: 400 });
    }

    const redis = getRedis();
    const key = `sadtalker:history:${userId}`;
    const rows = await redis.lrange(key, 0, -1);

    let removed = false;
    for (const row of rows) {
      try {
        const parsed = JSON.parse(row) as { jobId?: string } | null;
        if (parsed?.jobId === jobId) {
          await redis.lrem(key, 1, row);
          removed = true;
          break;
        }
      } catch {
        // ignore malformed rows
      }
    }

    return NextResponse.json({ removed });
  } catch (err) {
    console.error("[sadtalker:history:delete] error", err);
    return NextResponse.json({ error: "Failed to delete history item" }, { status: 500 });
  }
}
