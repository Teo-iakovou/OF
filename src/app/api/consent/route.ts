import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;
    // TODO: persist to your DB. For now, log to server output.
    console.log("consent:log", {
      ...body,
      serverGpc: req.headers.get("sec-gpc") === "1" || req.headers.get("gpc") === "1",
      ip,
      ua: req.headers.get("user-agent") ?? null,
      ts: Date.now(),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
