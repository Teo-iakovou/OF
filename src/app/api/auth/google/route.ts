import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeRedirect } from "@/app/utils/sanitizeRedirect";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const OAUTH_STATE_COOKIE = "oauth_google_state";
const OAUTH_NEXT_COOKIE = "oauth_google_next";
const OAUTH_INTENT_COOKIE = "oauth_google_intent";

function getRequestId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function getBaseUrl(req: NextRequest) {
  const host = req.headers.get("host") || req.nextUrl.host;
  const proto = req.headers.get("x-forwarded-proto") || "http";
  return { host, proto, baseUrl: `${proto}://${host}` };
}

function getCallbackUrl(req: NextRequest) {
  const { baseUrl } = getBaseUrl(req);
  return `${baseUrl}/api/auth/google/callback`;
}

function getGoogleEnv() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_OAUTH_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "";
  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET ||
    process.env.GOOGLE_OAUTH_CLIENT_SECRET ||
    "";
  return { clientId, clientSecret };
}

function getDetectedClientIdKey() {
  return process.env.GOOGLE_CLIENT_ID
    ? "GOOGLE_CLIENT_ID"
    : process.env.GOOGLE_OAUTH_CLIENT_ID
      ? "GOOGLE_OAUTH_CLIENT_ID"
      : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        ? "NEXT_PUBLIC_GOOGLE_CLIENT_ID"
        : null;
}

function getDetectedClientSecretKey() {
  return process.env.GOOGLE_CLIENT_SECRET
    ? "GOOGLE_CLIENT_SECRET"
    : process.env.GOOGLE_OAUTH_CLIENT_SECRET
      ? "GOOGLE_OAUTH_CLIENT_SECRET"
      : null;
}

function isGoogleConfigured() {
  const env = getGoogleEnv();
  return Boolean(env.clientId);
}

function oauthCookieOptions(req: NextRequest) {
  const host = req.headers.get("host") || req.nextUrl.host || "";
  const isLocalhost = host.includes("localhost") || host.startsWith("127.0.0.1");
  const isHttps = req.headers.get("x-forwarded-proto") === "https";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: !isLocalhost && isHttps,
    path: "/",
    maxAge: 60 * 10,
  };
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  const requestId = getRequestId();
  const env = getGoogleEnv();
  const next = sanitizeRedirect(req.nextUrl.searchParams.get("next") || "/");
  const intentRaw = req.nextUrl.searchParams.get("intent");
  const intent = typeof intentRaw === "string" ? intentRaw.slice(0, 64) : "";
  const { host, proto, baseUrl } = getBaseUrl(req);
  const redirectUri = getCallbackUrl(req);

  if (req.nextUrl.searchParams.get("probe") === "1") {
    console.log("[oauth-google-start]", { requestId, probe: true });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (req.nextUrl.searchParams.get("debug") === "1") {
    return NextResponse.json(
      {
        ok: true,
        requestId,
        host,
        proto,
        baseUrl,
        redirectUri,
        hasClientId: Boolean(env.clientId),
        detectedClientIdKey: getDetectedClientIdKey(),
        detectedClientSecretKey: getDetectedClientSecretKey(),
        next,
        intent,
      },
      { status: 200 }
    );
  }

  if (!isGoogleConfigured()) {
    console.log("[oauth-google-start]", {
      requestId,
      host,
      baseUrl,
      redirectUri,
      missingClientId: !env.clientId,
      missingClientSecret: !env.clientSecret,
      detectedClientIdKey: getDetectedClientIdKey(),
      detectedClientSecretKey: getDetectedClientSecretKey(),
    });
    const res = NextResponse.redirect(
      new URL(`/login?error=google_auth_failed&rid=${encodeURIComponent(requestId)}`, req.url)
    );
    res.headers.set("x-oauth-rid", requestId);
    return res;
  }

  const state = randomUUID();
  console.log("[oauth-google-start]", {
    requestId,
    host,
    baseUrl,
    redirectUri,
    next,
    intent: intent || null,
  });

  const params = new URLSearchParams({
    client_id: env.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  const response = NextResponse.redirect(redirectUrl);
  const cookieOptions = oauthCookieOptions(req);
  response.cookies.set(OAUTH_STATE_COOKIE, state, cookieOptions);
  response.cookies.set(OAUTH_NEXT_COOKIE, next, cookieOptions);
  if (intent) {
    response.cookies.set(OAUTH_INTENT_COOKIE, intent, cookieOptions);
  }
  return response;
}
