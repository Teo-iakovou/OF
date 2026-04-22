import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HISTORY_LIMIT = Number(process.env.SADTALKER_HISTORY_LIMIT || 50);
const SERVER_BASE_URL = process.env.API_URL || "http://localhost:5001";
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
    const id = typeof data?.user?.id === "string" ? data.user.id.trim() : "";
    return id || null;
  } catch (err) {
    console.error("[heygen:history] auth lookup failed", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const internalSecret = process.env.INTERNAL_SECRET;
    const res = await fetch(
      `${SERVER_BASE_URL}/api/heygen/history?userId=${encodeURIComponent(userId)}&limit=${HISTORY_LIMIT}`,
      {
        method: "GET",
        headers: {
          "x-internal-secret": internalSecret ?? "",
          "content-type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("[heygen:history] backend error", res.status);
      return NextResponse.json({ error: "Failed to load history" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ items: Array.isArray(data.items) ? data.items : [] });
  } catch (err) {
    console.error("[heygen:history] error", err);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = typeof body?.jobId === "string" ? body.jobId.trim() : "";
    if (!id) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const internalSecret = process.env.INTERNAL_SECRET;
    const res = await fetch(`${SERVER_BASE_URL}/api/heygen/history/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        "x-internal-secret": internalSecret ?? "",
        "content-type": "application/json",
        "x-user-id": userId,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[heygen:history:delete] backend error", res.status);
      return NextResponse.json({ error: "Failed to delete history item" }, { status: res.status });
    }

    return NextResponse.json({ removed: true });
  } catch (err) {
    console.error("[heygen:history:delete] error", err);
    return NextResponse.json({ error: "Failed to delete history item" }, { status: 500 });
  }
}
