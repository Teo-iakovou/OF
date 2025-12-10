import { NextRequest, NextResponse } from "next/server";

import { getRedis } from "../_lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HISTORY_LIMIT = Number(process.env.SADTALKER_HISTORY_LIMIT || 50);
const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ai_session";

async function getCurrentUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const headers: Record<string, string> = { cookie: `${SESSION_COOKIE_NAME}=${token}` };

  try {
    const resp = await fetch(`${SERVER_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    if (!resp.ok) return null;
    const text = await resp.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    const id = typeof data?.id === "string" ? data.id.trim() : "";
    return id || null;
  } catch (err) {
    console.error("[sadtalker:history] auth lookup failed", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const userId = await getCurrentUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const jobId = typeof body?.jobId === "string" ? body.jobId.trim() : "";
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
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
