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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

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
"[project]/src/app/api/auth/google/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "HEAD",
    ()=>HEAD,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$sanitizeRedirect$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/sanitizeRedirect.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const revalidate = 0;
const OAUTH_STATE_COOKIE = "oauth_google_state";
const OAUTH_NEXT_COOKIE = "oauth_google_next";
const OAUTH_INTENT_COOKIE = "oauth_google_intent";
function getRequestId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
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
function isGoogleConfigured() {
    const env = getGoogleEnv();
    return Boolean(env.clientId);
}
function oauthCookieOptions(req) {
    const host = req.headers.get("host") || req.nextUrl.host || "";
    const isLocalhost = host.includes("localhost") || host.startsWith("127.0.0.1");
    const isHttps = req.headers.get("x-forwarded-proto") === "https";
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: !isLocalhost && isHttps,
        path: "/",
        maxAge: 60 * 10
    };
}
async function HEAD() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 200
    });
}
async function GET(req) {
    const requestId = getRequestId();
    const env = getGoogleEnv();
    const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$sanitizeRedirect$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeRedirect"])(req.nextUrl.searchParams.get("next") || "/");
    const intentRaw = req.nextUrl.searchParams.get("intent");
    const intent = typeof intentRaw === "string" ? intentRaw.slice(0, 64) : "";
    const { host, proto, baseUrl } = getBaseUrl(req);
    const redirectUri = getCallbackUrl(req);
    if (req.nextUrl.searchParams.get("probe") === "1") {
        console.log("[oauth-google-start]", {
            requestId,
            probe: true
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        }, {
            status: 200
        });
    }
    if (req.nextUrl.searchParams.get("debug") === "1") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
            intent
        }, {
            status: 200
        });
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
            detectedClientSecretKey: getDetectedClientSecretKey()
        });
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/login?error=google_auth_failed&rid=${encodeURIComponent(requestId)}`, req.url));
        res.headers.set("x-oauth-rid", requestId);
        return res;
    }
    const state = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
    console.log("[oauth-google-start]", {
        requestId,
        host,
        baseUrl,
        redirectUri,
        next,
        intent: intent || null
    });
    const params = new URLSearchParams({
        client_id: env.clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
        state
    });
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
    const cookieOptions = oauthCookieOptions(req);
    response.cookies.set(OAUTH_STATE_COOKIE, state, cookieOptions);
    response.cookies.set(OAUTH_NEXT_COOKIE, next, cookieOptions);
    if (intent) {
        response.cookies.set(OAUTH_INTENT_COOKIE, intent, cookieOptions);
    }
    return response;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bd061e1f._.js.map