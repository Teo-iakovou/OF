module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/utils/sanitizeRedirect.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sanitizeRedirect",
    ()=>sanitizeRedirect
]);
function sanitizeRedirect(input) {
    const value = Array.isArray(input) ? input[0] : input;
    if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
    try {
        const url = new URL(value, "http://localhost");
        if (!url.pathname.startsWith("/")) return "/";
        return url.pathname + url.search + url.hash;
    } catch  {
        return "/";
    }
}
}),
"[project]/src/app/api/auth/google/callback/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$sanitizeRedirect$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/sanitizeRedirect.ts [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const revalidate = 0;
const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const OAUTH_STATE_COOKIE = "oauth_google_state";
const OAUTH_NEXT_COOKIE = "oauth_google_next";
const OAUTH_INTENT_COOKIE = "oauth_google_intent";
function getRequestId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function truncate(input, max = 320) {
    return input.length <= max ? input : `${input.slice(0, max)}...`;
}
function getBaseUrl(req) {
    const host = req.headers.get("host") || req.nextUrl.host;
    const proto = req.headers.get("x-forwarded-proto") || "http";
    return {
        host,
        proto,
        baseUrl: `${proto}://${host}`
    };
}
function getCallbackUrl(req) {
    const { baseUrl } = getBaseUrl(req);
    return `${baseUrl}/api/auth/google/callback`;
}
function getGoogleEnv() {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET || "";
    return {
        clientId,
        clientSecret
    };
}
function getDetectedClientIdKey() {
    return process.env.GOOGLE_CLIENT_ID ? "GOOGLE_CLIENT_ID" : process.env.GOOGLE_OAUTH_CLIENT_ID ? "GOOGLE_OAUTH_CLIENT_ID" : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? "NEXT_PUBLIC_GOOGLE_CLIENT_ID" : null;
}
function getDetectedClientSecretKey() {
    return process.env.GOOGLE_CLIENT_SECRET ? "GOOGLE_CLIENT_SECRET" : process.env.GOOGLE_OAUTH_CLIENT_SECRET ? "GOOGLE_OAUTH_CLIENT_SECRET" : null;
}
function decodeJwtPayload(token) {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;
        const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = payload + "=".repeat((4 - payload.length % 4) % 4);
        const json = Buffer.from(padded, "base64").toString("utf8");
        return JSON.parse(json);
    } catch  {
        return null;
    }
}
function getSetCookieList(from) {
    const headerBag = from.headers;
    const viaMethod = headerBag.getSetCookie?.();
    if (Array.isArray(viaMethod) && viaMethod.length > 0) return viaMethod;
    const raw = from.headers.get("set-cookie");
    if (!raw) return [];
    // Split combined Set-Cookie header safely on cookie boundaries.
    return raw.split(/,(?=\s*[^;,\s]+=)/g).map((cookie)=>cookie.trim()).filter(Boolean);
}
function normalizeCookieForLocalhost(cookie, isLocalhost) {
    if (!isLocalhost) return cookie;
    return cookie.replace(/;\s*Secure/gi, "").replace(/SameSite=None/gi, "SameSite=Lax");
}
function appendSetCookies(to, setCookieList, isLocalhost) {
    for (const value of setCookieList){
        to.headers.append("set-cookie", normalizeCookieForLocalhost(value, isLocalhost));
    }
    if ("TURBOPACK compile-time truthy", 1) {
        console.log("[oauth-google-callback]", {
            stage: "set_cookie_forward",
            forwardedSetCookieCount: setCookieList.length
        });
    }
}
function clearOauthCookies(req, res) {
    const host = req.headers.get("host") || req.nextUrl.host || "";
    const isLocalhost = host.includes("localhost") || host.startsWith("127.0.0.1");
    const isHttps = req.headers.get("x-forwarded-proto") === "https";
    const opts = {
        httpOnly: true,
        sameSite: "lax",
        secure: !isLocalhost && isHttps,
        path: "/",
        maxAge: 0
    };
    res.cookies.set(OAUTH_STATE_COOKIE, "", opts);
    res.cookies.set(OAUTH_NEXT_COOKIE, "", opts);
    res.cookies.set(OAUTH_INTENT_COOKIE, "", opts);
}
function redirectError(req, requestId) {
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/login?error=google_auth_failed&rid=${encodeURIComponent(requestId)}`, req.url));
    clearOauthCookies(req, response);
    return response;
}
async function GET(req) {
    const requestId = getRequestId();
    const env = getGoogleEnv();
    const state = req.nextUrl.searchParams.get("state");
    const code = req.nextUrl.searchParams.get("code");
    const expectedState = req.cookies.get(OAUTH_STATE_COOKIE)?.value || "";
    const nextPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$sanitizeRedirect$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeRedirect"])(req.cookies.get(OAUTH_NEXT_COOKIE)?.value || "/");
    const redirectUri = getCallbackUrl(req);
    const { host, baseUrl } = getBaseUrl(req);
    const isLocalhost = host.includes("localhost") || host.startsWith("127.0.0.1");
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
        nextPath
    });
    if (!code || !state || !expectedState || state !== expectedState) {
        console.log("[oauth-google-callback]", {
            requestId,
            stage: "state_validation_failed"
        });
        return redirectError(req, requestId);
    }
    if (!env.clientId || !env.clientSecret) {
        console.log("[oauth-google-callback]", {
            requestId,
            stage: "missing_google_env",
            missingClientId: !env.clientId,
            missingClientSecret: !env.clientSecret,
            detectedClientIdKey: getDetectedClientIdKey(),
            detectedClientSecretKey: getDetectedClientSecretKey()
        });
        return redirectError(req, requestId);
    }
    try {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: env.clientId,
                client_secret: env.clientSecret,
                code,
                grant_type: "authorization_code",
                redirect_uri: redirectUri
            }),
            cache: "no-store"
        });
        console.log("[oauth-google-callback]", {
            requestId,
            stage: "token_exchange",
            status: tokenRes.status,
            redirectUri
        });
        if (!tokenRes.ok) {
            const tokenError = truncate(await tokenRes.text());
            console.log("[oauth-google-callback]", {
                requestId,
                stage: "token_exchange_failed",
                status: tokenRes.status,
                body: tokenError
            });
            return redirectError(req, requestId);
        }
        const tokenData = await tokenRes.json();
        let googleUser = {};
        if (tokenData.access_token) {
            const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`
                },
                cache: "no-store"
            });
            console.log("[oauth-google-callback]", {
                requestId,
                stage: "userinfo_fetch",
                status: userRes.status
            });
            if (!userRes.ok) {
                const userInfoError = truncate(await userRes.text());
                console.log("[oauth-google-callback]", {
                    requestId,
                    stage: "userinfo_failed",
                    status: userRes.status,
                    body: userInfoError
                });
                return redirectError(req, requestId);
            }
            googleUser = await userRes.json();
        } else if (tokenData.id_token) {
            const decoded = decodeJwtPayload(tokenData.id_token);
            googleUser = {
                sub: typeof decoded?.sub === "string" ? decoded.sub : undefined,
                email: typeof decoded?.email === "string" ? decoded.email : undefined,
                name: typeof decoded?.name === "string" ? decoded.name : undefined,
                picture: typeof decoded?.picture === "string" ? decoded.picture : undefined
            };
        } else {
            console.log("[oauth-google-callback]", {
                requestId,
                stage: "missing_tokens"
            });
            return redirectError(req, requestId);
        }
        if (!googleUser.email || !googleUser.sub) {
            console.log("[oauth-google-callback]", {
                requestId,
                stage: "missing_user_identity",
                hasEmail: Boolean(googleUser.email),
                hasSub: Boolean(googleUser.sub)
            });
            return redirectError(req, requestId);
        }
        let loginRes = await fetch(`${SERVER_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: googleUser.email,
                name: googleUser.name || "",
                provider: "google",
                googleId: googleUser.sub
            }),
            cache: "no-store"
        });
        let loginText = await loginRes.text();
        let rawSetCookie = loginRes.headers.get("set-cookie");
        let setCookieList = getSetCookieList(loginRes);
        console.log("[oauth-google] login set-cookie present?", {
            requestId,
            source: "backend",
            hasRaw: Boolean(rawSetCookie),
            listCount: setCookieList.length
        });
        if (setCookieList.length === 0) {
            loginRes = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: googleUser.email,
                    name: googleUser.name || "",
                    provider: "google",
                    googleId: googleUser.sub
                }),
                cache: "no-store"
            });
            loginText = await loginRes.text();
            rawSetCookie = loginRes.headers.get("set-cookie");
            setCookieList = getSetCookieList(loginRes);
            console.log("[oauth-google] login set-cookie present?", {
                requestId,
                source: "bff",
                hasRaw: Boolean(rawSetCookie),
                listCount: setCookieList.length
            });
        }
        if (!loginRes.ok) {
            console.log("[oauth-google-callback]", {
                requestId,
                stage: "backend_login_failed",
                status: loginRes.status,
                body: truncate(loginText || "")
            });
            return redirectError(req, requestId);
        }
        const redirectResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", req.url));
        appendSetCookies(redirectResponse, setCookieList, isLocalhost);
        clearOauthCookies(req, redirectResponse);
        console.log("[oauth-google-callback]", {
            requestId,
            stage: "success",
            destination: "/dashboard"
        });
        return redirectResponse;
    } catch (error) {
        console.log("[oauth-google-callback]", {
            requestId,
            stage: "unexpected_error",
            error: truncate(error instanceof Error ? error.message : String(error))
        });
        return redirectError(req, requestId);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__67080ecc._.js.map