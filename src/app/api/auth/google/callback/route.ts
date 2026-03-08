import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const OAUTH_STATE_COOKIE = "oauth_google_state";
const OAUTH_NEXT_COOKIE = "oauth_google_next";
const OAUTH_INTENT_COOKIE = "oauth_google_intent";

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

function getRequestId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function truncate(input: string, max = 320) {
  return input.length <= max ? input : `${input.slice(0, max)}...`;
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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function clearOauthCookies(req: NextRequest, res: NextResponse) {
  const host = req.headers.get("host") || req.nextUrl.host || "";
  const isLocalhost = host.includes("localhost") || host.startsWith("127.0.0.1");
  const isHttps = req.headers.get("x-forwarded-proto") === "https";
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: !isLocalhost && isHttps,
    path: "/",
    maxAge: 0,
  };
  res.cookies.set(OAUTH_STATE_COOKIE, "", opts);
  res.cookies.set(OAUTH_NEXT_COOKIE, "", opts);
  res.cookies.set(OAUTH_INTENT_COOKIE, "", opts);
}

function redirectError(req: NextRequest, requestId: string) {
  const response = NextResponse.redirect(
    new URL(`/login?error=google_auth_failed&rid=${encodeURIComponent(requestId)}`, req.url)
  );
  clearOauthCookies(req, response);
  return response;
}

export async function GET(req: NextRequest) {
  const requestId = getRequestId();
  const env = getGoogleEnv();
  const state = req.nextUrl.searchParams.get("state");
  const code = req.nextUrl.searchParams.get("code");
  const expectedState = req.cookies.get(OAUTH_STATE_COOKIE)?.value || "";
  const redirectUri = getCallbackUrl(req);
  const { host, baseUrl } = getBaseUrl(req);
  const hasCode = Boolean(code);
  const hasState = Boolean(state);
  const cookieStateExists = Boolean(expectedState);
  const cookieStateMatch = Boolean(state && expectedState && state === expectedState);
  console.log("[oauth-google-callback]", {
    requestId,
    host,
    baseUrl,
    hasCode,
    hasState,
    cookieStateExists,
    cookieStateMatch,
    redirectUri,
  });

  if (!code || !state || !expectedState || state !== expectedState) {
    console.log("[oauth-google-callback]", { requestId, stage: "state_validation_failed" });
    return redirectError(req, requestId);
  }
  if (!env.clientId || !env.clientSecret) {
    console.log("[oauth-google-callback]", {
      requestId,
      stage: "missing_google_env",
      missingClientId: !env.clientId,
      missingClientSecret: !env.clientSecret,
      detectedClientIdKey: getDetectedClientIdKey(),
      detectedClientSecretKey: getDetectedClientSecretKey(),
    });
    return redirectError(req, requestId);
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.clientId,
        client_secret: env.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });
    console.log("[oauth-google-callback]", {
      requestId,
      stage: "token_exchange",
      status: tokenRes.status,
      redirectUri,
    });

    if (!tokenRes.ok) {
      const tokenError = truncate(await tokenRes.text());
      console.log("[oauth-google-callback]", {
        requestId,
        stage: "token_exchange_failed",
        status: tokenRes.status,
        body: tokenError,
      });
      return redirectError(req, requestId);
    }

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      id_token?: string;
    };

    let googleUser: GoogleUserInfo = {};
    if (tokenData.access_token) {
      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
        cache: "no-store",
      });
      console.log("[oauth-google-callback]", {
        requestId,
        stage: "userinfo_fetch",
        status: userRes.status,
      });
      if (!userRes.ok) {
        const userInfoError = truncate(await userRes.text());
        console.log("[oauth-google-callback]", {
          requestId,
          stage: "userinfo_failed",
          status: userRes.status,
          body: userInfoError,
        });
        return redirectError(req, requestId);
      }
      googleUser = (await userRes.json()) as GoogleUserInfo;
    } else if (tokenData.id_token) {
      const decoded = decodeJwtPayload(tokenData.id_token);
      googleUser = {
        sub: typeof decoded?.sub === "string" ? decoded.sub : undefined,
        email: typeof decoded?.email === "string" ? decoded.email : undefined,
        name: typeof decoded?.name === "string" ? decoded.name : undefined,
        picture: typeof decoded?.picture === "string" ? decoded.picture : undefined,
      };
    } else {
      console.log("[oauth-google-callback]", { requestId, stage: "missing_tokens" });
      return redirectError(req, requestId);
    }

    if (!googleUser.email || !googleUser.sub) {
      console.log("[oauth-google-callback]", {
        requestId,
        stage: "missing_user_identity",
        hasEmail: Boolean(googleUser.email),
        hasSub: Boolean(googleUser.sub),
      });
      return redirectError(req, requestId);
    }

    const params = new URLSearchParams({
      email: googleUser.email,
      redirect: "/dashboard",
      provider: "google",
      googleId: googleUser.sub,
    });
    if (googleUser.name) {
      params.set("name", googleUser.name);
    }
    const loginUrl = new URL(`/api/auth/login?${params.toString()}`, baseUrl);
    const redirectResponse = NextResponse.redirect(loginUrl, 302);
    clearOauthCookies(req, redirectResponse);

    console.log("[oauth-google-callback]", {
      requestId,
      stage: "success",
      destination: loginUrl.toString(),
    });
    return redirectResponse;
  } catch (error) {
    console.log("[oauth-google-callback]", {
      requestId,
      stage: "unexpected_error",
      error: truncate(error instanceof Error ? error.message : String(error)),
    });
    return redirectError(req, requestId);
  }
}
