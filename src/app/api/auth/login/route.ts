import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERVER_BASE_URL = process.env.API_URL || "http://localhost:5001";

function getSetCookieList(res: Response) {
  const viaMethod = (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.();
  if (Array.isArray(viaMethod) && viaMethod.length > 0) return viaMethod;
  const raw = res.headers.get("set-cookie");
  return raw
    ? raw
        .split(/,(?=\s*[^;,\s]+=)/g)
        .map((value) => value.trim())
        .filter(Boolean)
    : [];
}

export async function POST(req: NextRequest) {
  const SHOULD_LOG = process.env.AUTH_DEBUG === 'true' || process.env.NODE_ENV !== 'production';
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] POST /api/auth/login start', {
        ua: req.headers.get('user-agent') || undefined,
        origin: req.headers.get('origin') || undefined,
        referer: req.headers.get('referer') || undefined,
      });
    }
  } catch {}
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${SERVER_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any; // eslint is not enforced in route files; keep simple
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  const nextRes = NextResponse.json(data, { status: res.status });
  // Pass through backend Set-Cookie so the backend remains the single cookie owner.
  const setCookieList = getSetCookieList(res);
  for (const value of setCookieList) {
    nextRes.headers.append("set-cookie", value);
  }
  try {
    if (SHOULD_LOG) {
      console.log('[auth-bff] POST /api/auth/login done', {
        status: res.status,
        setCookie: setCookieList.length > 0,
      });
    }
  } catch {}
  return nextRes;
}

