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
"[project]/src/app/api/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const runtime = 'nodejs';
const dynamic = 'force-dynamic';
const revalidate = 0;
const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
function getSetCookieList(res) {
    const viaMethod = res.headers.getSetCookie?.();
    if (Array.isArray(viaMethod) && viaMethod.length > 0) return viaMethod;
    const raw = res.headers.get("set-cookie");
    return raw ? raw.split(/,(?=\s*[^;,\s]+=)/g).map((value)=>value.trim()).filter(Boolean) : [];
}
async function POST(req) {
    const SHOULD_LOG = process.env.AUTH_DEBUG === 'true' || ("TURBOPACK compile-time value", "development") !== 'production';
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('[auth-bff] POST /api/auth/login start', {
                ua: req.headers.get('user-agent') || undefined,
                origin: req.headers.get('origin') || undefined,
                referer: req.headers.get('referer') || undefined
            });
        }
    } catch  {}
    const body = await req.json().catch(()=>({}));
    const res = await fetch(`${SERVER_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const text = await res.text();
    let data; // eslint is not enforced in route files; keep simple
    try {
        data = text ? JSON.parse(text) : null;
    } catch  {
        data = text;
    }
    const nextRes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
        status: res.status
    });
    // Pass through backend Set-Cookie so the backend remains the single cookie owner.
    const setCookieList = getSetCookieList(res);
    for (const value of setCookieList){
        nextRes.headers.append("set-cookie", value);
    }
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('[auth-bff] POST /api/auth/login done', {
                status: res.status,
                setCookie: setCookieList.length > 0
            });
        }
    } catch  {}
    return nextRes;
}
async function GET(req) {
    const SHOULD_LOG = process.env.AUTH_DEBUG === 'true' || ("TURBOPACK compile-time value", "development") !== 'production';
    // Support GET /api/auth/login?email=...&redirect=/... as a top-level flow
    const email = req.nextUrl.searchParams.get("email");
    const redirect = req.nextUrl.searchParams.get("redirect") || "/";
    if (!email) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "email is required"
        }, {
            status: 400
        });
    }
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('[auth-bff] GET /api/auth/login start', {
                email,
                redirect,
                ua: req.headers.get('user-agent') || undefined
            });
        }
    } catch  {}
    const res = await fetch(`${SERVER_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email
        })
    });
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch  {
        data = text;
    }
    if (!res.ok) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
        status: res.status
    });
    const to = redirect.startsWith("/") ? redirect : "/";
    const nextRes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(to, req.url));
    // Pass through backend Set-Cookie so the backend remains the single cookie owner.
    const setCookieList = getSetCookieList(res);
    for (const value of setCookieList){
        nextRes.headers.append("set-cookie", value);
    }
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            console.log('[auth-bff] GET /api/auth/login done', {
                status: res.status,
                to
            });
        }
    } catch  {}
    return nextRes;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__75f27e91._.js.map