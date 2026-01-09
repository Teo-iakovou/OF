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
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[project]/src/app/api/sadtalker/_lib/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sadTalkerConfig",
    ()=>sadTalkerConfig
]);
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`[sadtalker-config] Missing required env var ${name}`);
    }
    return value;
}
const sadTalkerConfig = {
    redisUrl: requireEnv("SADTALKER_REDIS_URL"),
    storageProvider: (process.env.SADTALKER_STORAGE_PROVIDER || "").toLowerCase() || undefined,
    r2Bucket: process.env.SADTALKER_R2_BUCKET,
    r2AccountId: process.env.SADTALKER_R2_ACCOUNT_ID,
    r2AccessKeyId: process.env.SADTALKER_R2_ACCESS_KEY_ID,
    r2SecretAccessKey: process.env.SADTALKER_R2_SECRET_ACCESS_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    supabaseBucket: process.env.SUPABASE_BUCKET || "sadtalker"
};
}),
"[project]/src/app/api/sadtalker/_lib/redis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRedis",
    ()=>getRedis
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ioredis$2f$built$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/ioredis/built/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$sadtalker$2f$_lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/sadtalker/_lib/config.ts [app-route] (ecmascript)");
;
;
function getRedis() {
    if (!global.__sadtalkerRedisClient) {
        global.__sadtalkerRedisClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ioredis$2f$built$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$sadtalker$2f$_lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sadTalkerConfig"].redisUrl, {
            maxRetriesPerRequest: null,
            enableReadyCheck: true
        });
    }
    return global.__sadtalkerRedisClient;
}
}),
"[project]/src/app/api/sadtalker/history/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$sadtalker$2f$_lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/sadtalker/_lib/redis.ts [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const HISTORY_LIMIT = Number(process.env.SADTALKER_HISTORY_LIMIT || 50);
const SERVER_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ai_session";
async function getCurrentUserId(req) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    const headers = {
        cookie: `${SESSION_COOKIE_NAME}=${token}`
    };
    try {
        const resp = await fetch(`${SERVER_BASE_URL}/api/auth/me`, {
            method: "GET",
            headers,
            cache: "no-store"
        });
        if (!resp.ok) return null;
        const text = await resp.text();
        let data;
        try {
            data = text ? JSON.parse(text) : null;
        } catch  {
            data = null;
        }
        const id = typeof data?.id === "string" ? data.id.trim() : "";
        return id || null;
    } catch (err) {
        console.error("[sadtalker:history] auth lookup failed", err);
        return null;
    }
}
async function GET(req) {
    try {
        const userId = await getCurrentUserId(req);
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const redis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$sadtalker$2f$_lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRedis"])();
        const key = `sadtalker:history:${userId}`;
        const rows = await redis.lrange(key, 0, HISTORY_LIMIT - 1);
        const items = rows.map((row)=>{
            try {
                return JSON.parse(row);
            } catch (err) {
                console.warn("[sadtalker:history] failed to parse row", err);
                return null;
            }
        }).filter((item)=>!!item);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            items
        });
    } catch (err) {
        console.error("[sadtalker:history] error", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to load SadTalker history"
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    try {
        const userId = await getCurrentUserId(req);
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const body = await req.json().catch(()=>null);
        const jobId = typeof body?.jobId === "string" ? body.jobId.trim() : "";
        if (!jobId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "jobId is required"
            }, {
                status: 400
            });
        }
        const redis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$sadtalker$2f$_lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRedis"])();
        const key = `sadtalker:history:${userId}`;
        const rows = await redis.lrange(key, 0, -1);
        let removed = false;
        for (const row of rows){
            try {
                const parsed = JSON.parse(row);
                if (parsed?.jobId === jobId) {
                    await redis.lrem(key, 1, row);
                    removed = true;
                    break;
                }
            } catch  {
            // ignore malformed rows
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            removed
        });
    } catch (err) {
        console.error("[sadtalker:history:delete] error", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to delete history item"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2ff036b0._.js.map