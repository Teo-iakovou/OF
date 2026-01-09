(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/components/common/UpgradeRequiredBanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UpgradeRequiredBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
"use client";
;
;
;
const PLAN_TARGETS = {
    lite: "/pro",
    pro: "/ultimate",
    ultimate: "/ultimate"
};
function resolveTarget(plan) {
    if (!plan) return "/lite";
    const key = plan.toLowerCase();
    return PLAN_TARGETS[key] || "/lite";
}
function UpgradeRequiredBanner({ code, error, feature, plan, remaining, limit, className = "" }) {
    if (code !== "UPGRADE_REQUIRED") return null;
    const hasCounts = typeof remaining === "number" || typeof limit === "number";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100 space-y-2", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-semibold text-rose-200",
                children: error || "Upgrade required"
            }, void 0, false, {
                fileName: "[project]/src/app/components/common/UpgradeRequiredBanner.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            feature ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-[0.3em] text-rose-200/70",
                children: feature
            }, void 0, false, {
                fileName: "[project]/src/app/components/common/UpgradeRequiredBanner.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this) : null,
            hasCounts ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-rose-100/80",
                children: [
                    typeof remaining === "number" ? `${Math.max(0, remaining)} left` : "",
                    typeof limit === "number" ? ` / ${limit} total` : ""
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/common/UpgradeRequiredBanner.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this) : null,
            plan ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-rose-100/80",
                children: [
                    "Current plan: ",
                    plan
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/common/UpgradeRequiredBanner.tsx",
                lineNumber: 58,
                columnNumber: 15
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: resolveTarget(plan),
                className: "inline-flex items-center gap-2 rounded-full bg-rose-400/20 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-400/30",
                children: "Upgrade plan →"
            }, void 0, false, {
                fileName: "[project]/src/app/components/common/UpgradeRequiredBanner.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/common/UpgradeRequiredBanner.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c = UpgradeRequiredBanner;
var _c;
__turbopack_context__.k.register(_c, "UpgradeRequiredBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/render/UploadTalkingHead.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UploadTalkingHead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$UpgradeRequiredBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/common/UpgradeRequiredBanner.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const HISTORY_USER_FALLBACK = "web-client";
const preprocessOptions = [
    {
        value: "full",
        label: "Full"
    },
    {
        value: "crop",
        label: "Crop"
    },
    {
        value: "resize",
        label: "Resize"
    },
    {
        value: "none",
        label: "None"
    }
];
const enhancerOptions = [
    {
        value: "",
        label: "None"
    },
    {
        value: "gfpgan",
        label: "GFPGAN"
    },
    {
        value: "RestoreFormer",
        label: "RestoreFormer"
    }
];
const backgroundEnhancerOptions = [
    {
        value: "",
        label: "None"
    },
    {
        value: "realesrgan",
        label: "Real-ESRGAN"
    },
    {
        value: "gpen",
        label: "GPEN"
    }
];
const resolutionOptions = [
    {
        value: "512p",
        label: "512p (High Quality)"
    },
    {
        value: "256p",
        label: "256p (Faster)"
    }
];
function UploadTalkingHead() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])({
        required: true
    });
    const historyUserId = user?.id || HISTORY_USER_FALLBACK;
    const [imageFile, setImageFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [audioFile, setAudioFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [preprocess, setPreprocess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("full");
    const [resolution, setResolution] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("512p");
    const [enhancer, setEnhancer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [backgroundEnhancer, setBackgroundEnhancer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [expressionScale, setExpressionScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [poseStyle, setPoseStyle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [batchSize, setBatchSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(2);
    const [stillMode, setStillMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [inputYaw, setInputYaw] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [inputPitch, setInputPitch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [inputRoll, setInputRoll] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [jobId, setJobId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [jobState, setJobState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [jobStage, setJobStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [videoUrl, setVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [videoReadyAt, setVideoReadyAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [upgradeInfo, setUpgradeInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [historyLoading, setHistoryLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("create");
    const pollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const loadHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UploadTalkingHead.useCallback[loadHistory]": async ()=>{
            try {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                setHistoryLoading(true);
                const res = await fetch(`/api/sadtalker/history?userId=${encodeURIComponent(historyUserId)}`, {
                    method: "GET",
                    cache: "no-store"
                });
                if (!res.ok) {
                    throw new Error(`History request failed (${res.status})`);
                }
                const data = await res.json();
                setHistory(Array.isArray(data.items) ? data.items : []);
            } catch (err) {
                console.warn("[sadtalker-ui] history error", err);
            } finally{
                setHistoryLoading(false);
            }
        }
    }["UploadTalkingHead.useCallback[loadHistory]"], [
        historyUserId
    ]);
    const canSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UploadTalkingHead.useMemo[canSubmit]": ()=>{
            return !!imageFile && !!audioFile && !isSubmitting;
        }
    }["UploadTalkingHead.useMemo[canSubmit]"], [
        imageFile,
        audioFile,
        isSubmitting
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UploadTalkingHead.useEffect": ()=>{
            if (!jobId) return;
            if (pollRef.current) clearInterval(pollRef.current);
            const poll = {
                "UploadTalkingHead.useEffect.poll": async ()=>{
                    try {
                        const res = await fetch(`/api/sadtalker/status?id=${encodeURIComponent(jobId)}`, {
                            method: "GET",
                            cache: "no-store"
                        });
                        if (!res.ok) {
                            throw new Error(`Status request failed (${res.status})`);
                        }
                        const data = await res.json();
                        setJobState(data.state ?? null);
                        setJobStage(data.remoteState ?? null);
                        if (typeof data.progress === "number") setProgress(data.progress);
                        const isSuccessState = data.state === "succeeded" || data.state === "completed";
                        if (isSuccessState && data.result?.videoUrl) {
                            setVideoUrl(data.result.videoUrl);
                            setVideoReadyAt(new Date().toISOString());
                            if (pollRef.current) clearInterval(pollRef.current);
                        } else if (data.state === "failed") {
                            setError(data.error?.message || "SadTalker job failed");
                            if (pollRef.current) clearInterval(pollRef.current);
                        }
                    } catch (err) {
                        console.warn("[sadtalker-ui] polling error", err);
                    }
                }
            }["UploadTalkingHead.useEffect.poll"];
            poll();
            pollRef.current = setInterval(poll, 3000);
            return ({
                "UploadTalkingHead.useEffect": ()=>{
                    if (pollRef.current) clearInterval(pollRef.current);
                }
            })["UploadTalkingHead.useEffect"];
        }
    }["UploadTalkingHead.useEffect"], [
        jobId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UploadTalkingHead.useEffect": ()=>{
            loadHistory();
        }
    }["UploadTalkingHead.useEffect"], [
        loadHistory
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UploadTalkingHead.useEffect": ()=>{
            if (videoUrl) {
                loadHistory();
            }
        }
    }["UploadTalkingHead.useEffect"], [
        videoUrl,
        loadHistory
    ]);
    const renderHistory = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs uppercase tracking-wide text-gray-500",
                                    children: "History"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                    lineNumber: 163,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-gray-50",
                                    children: "Recent talking heads"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                    lineNumber: 164,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500",
                                    children: "Stored per account."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                    lineNumber: 165,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                            lineNumber: 162,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>loadHistory(),
                            className: "inline-flex items-center justify-center rounded-full border border-gray-700 px-4 py-1.5 text-xs font-semibold text-gray-200 hover:border-blue-400 hover:text-blue-300",
                            children: "Refresh"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                            lineNumber: 167,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                    lineNumber: 161,
                    columnNumber: 7
                }, this),
                historyLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm text-gray-400",
                    children: "Loading your previous renders…"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                    lineNumber: 175,
                    columnNumber: 26
                }, this),
                !historyLoading && history.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm text-gray-400",
                    children: "No talking head videos saved yet. Generate one above to populate this list."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                    lineNumber: 177,
                    columnNumber: 9
                }, this),
                !historyLoading && history.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                    children: history.map((item)=>{
                        const created = item.createdAt ? new Date(item.createdAt).toLocaleString() : "—";
                        const shortId = item.remoteJobId ? `#${item.remoteJobId.slice(-6)}` : `Job ${item.jobId}`;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: "rounded-xl border border-gray-800 bg-gray-950/80 p-3 space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg overflow-hidden bg-black aspect-video",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                        src: item.videoUrl,
                                        className: "w-full h-full object-cover",
                                        muted: true,
                                        loop: true,
                                        playsInline: true,
                                        preload: "metadata",
                                        controls: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 192,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                    lineNumber: 191,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs uppercase tracking-wide text-gray-500",
                                            children: shortId
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                            lineNumber: 203,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-300",
                                            children: created
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                            lineNumber: 204,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                    lineNumber: 202,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between gap-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: item.videoUrl,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "text-blue-400 hover:text-blue-300 underline",
                                            children: "Open"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                            lineNumber: 207,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: item.videoUrl,
                                            download: true,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500",
                                            children: "Download"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                            lineNumber: 215,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: async ()=>{
                                                try {
                                                    const res = await fetch("/api/sadtalker/history", {
                                                        method: "DELETE",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            userId: historyUserId,
                                                            jobId: item.jobId
                                                        })
                                                    });
                                                    if (!res.ok) return;
                                                    setHistory((prev)=>prev.filter((row)=>row.jobId !== item.jobId));
                                                } catch  {
                                                // best-effort delete; ignore errors
                                                }
                                            },
                                            className: "inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500",
                                            children: "Delete"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                            lineNumber: 224,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                    lineNumber: 206,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, `${item.jobId}-${item.remoteJobId || "local"}`, true, {
                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                            lineNumber: 187,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                    lineNumber: 182,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
            lineNumber: 160,
            columnNumber: 5
        }, this);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setUpgradeInfo(null);
        setVideoUrl(null);
        setVideoReadyAt(null);
        setJobState(null);
        setProgress(undefined);
        setJobStage(null);
        if (!imageFile) {
            setError("Please choose a source image (PNG/JPG).");
            setUpgradeInfo(null);
            return;
        }
        if (!audioFile) {
            setError("Please choose an audio file (MP3/WAV).");
            setUpgradeInfo(null);
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("source_image", imageFile);
            formData.append("driven_audio", audioFile);
            formData.append("preprocess", preprocess);
            formData.append("resolution", resolution);
            formData.append("expression_scale", expressionScale.toString());
            formData.append("pose_style", poseStyle.toString());
            formData.append("batch_size", batchSize.toString());
            formData.append("still", stillMode ? "true" : "false");
            if (enhancer) formData.append("enhancer", enhancer);
            if (backgroundEnhancer) formData.append("background_enhancer", backgroundEnhancer);
            if (inputYaw.trim()) formData.append("input_yaw", inputYaw.trim());
            if (inputPitch.trim()) formData.append("input_pitch", inputPitch.trim());
            if (inputRoll.trim()) formData.append("input_roll", inputRoll.trim());
            formData.append("userId", historyUserId);
            const res = await fetch("/api/sadtalker/create", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (!res.ok) {
                if (data?.code === "UPGRADE_REQUIRED") {
                    setError(data?.error || "Upgrade required");
                    setUpgradeInfo({
                        code: data.code,
                        error: data?.error,
                        feature: data?.feature,
                        plan: data?.plan ?? null,
                        remaining: typeof data?.remaining === "number" ? data.remaining : null,
                        limit: typeof data?.limit === "number" ? data.limit : null
                    });
                    return;
                }
                throw new Error(data?.error || "Failed to enqueue SadTalker job");
            }
            setJobId(data.jobId);
            setJobState("queued");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to start SadTalker job";
            setError(message);
            setUpgradeInfo(null);
        } finally{
            setIsSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    {
                        label: "Generate",
                        value: "create"
                    },
                    {
                        label: "My videos",
                        value: "history"
                    }
                ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setActiveTab(tab.value),
                        className: `rounded-full px-4 py-1.5 text-sm font-semibold transition ${activeTab === tab.value ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-gray-800/70 text-gray-300 hover:text-white"}`,
                        children: tab.label
                    }, tab.value, false, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 331,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                lineNumber: 326,
                columnNumber: 7
            }, this),
            activeTab === "create" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-2",
                                                children: "Source Image (PNG/JPG)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 351,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "image/png,image/jpeg",
                                                onChange: (e)=>setImageFile(e.target.files?.[0] ?? null),
                                                className: "block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 352,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 text-xs text-gray-500",
                                                children: "Max 10 MB. Use a clear frontal face for best results."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 358,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 350,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-2",
                                                children: "Driven Audio (MP3/WAV)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 361,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "audio/mpeg,audio/wav",
                                                onChange: (e)=>setAudioFile(e.target.files?.[0] ?? null),
                                                className: "block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 362,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 text-xs text-gray-500",
                                                children: "Max 15 MB. Audio will drive lip sync."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 368,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 360,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 349,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-2",
                                                children: "Preprocess"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 374,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: preprocess,
                                                onChange: (e)=>setPreprocess(e.target.value),
                                                className: "w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600",
                                                children: preprocessOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: opt.value,
                                                        children: opt.label
                                                    }, opt.value, false, {
                                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 17
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 375,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 373,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-2",
                                                children: "Resolution"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 388,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: resolution,
                                                onChange: (e)=>setResolution(e.target.value),
                                                className: "w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600",
                                                children: resolutionOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: opt.value,
                                                        children: opt.label
                                                    }, opt.value, false, {
                                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                        lineNumber: 395,
                                                        columnNumber: 17
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 389,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 387,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-2",
                                                children: "Face Enhancer"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 403,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: enhancer,
                                                onChange: (e)=>setEnhancer(e.target.value),
                                                className: "w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600",
                                                children: enhancerOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: opt.value,
                                                        children: opt.label
                                                    }, opt.value, false, {
                                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                        lineNumber: 410,
                                                        columnNumber: 17
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 404,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 402,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-2",
                                                children: "Background Enhancer"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 417,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: backgroundEnhancer,
                                                onChange: (e)=>setBackgroundEnhancer(e.target.value),
                                                className: "w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600",
                                                children: backgroundEnhancerOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: opt.value,
                                                        children: opt.label
                                                    }, opt.value, false, {
                                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                        lineNumber: 424,
                                                        columnNumber: 17
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 418,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 416,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-1",
                                                children: "Expression Scale"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 432,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: 0.5,
                                                max: 1.5,
                                                step: 0.05,
                                                value: expressionScale,
                                                onChange: (e)=>setExpressionScale(Number(e.target.value)),
                                                className: "w-full"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 433,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400 mt-1",
                                                children: expressionScale.toFixed(2)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 442,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 431,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm text-gray-300 mb-1",
                                                        children: "Pose Style"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                        lineNumber: 446,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        min: -10,
                                                        max: 10,
                                                        value: poseStyle,
                                                        onChange: (e)=>setPoseStyle(Number(e.target.value)),
                                                        className: "w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                        lineNumber: 447,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 445,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm text-gray-300 mb-1",
                                                        children: "Batch Size"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                        lineNumber: 457,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        min: 1,
                                                        max: 8,
                                                        value: batchSize,
                                                        onChange: (e)=>setBatchSize(Number(e.target.value)),
                                                        className: "w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                        lineNumber: 458,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 456,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 444,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "col-span-1 md:col-span-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2 text-sm text-gray-300",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: stillMode,
                                                    onChange: (e)=>setStillMode(e.target.checked),
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                    lineNumber: 471,
                                                    columnNumber: 15
                                                }, this),
                                                "Use still-mode (keeps head movements minimal)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                            lineNumber: 470,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 469,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-1",
                                                children: "Input Yaw (comma separated)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 482,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: inputYaw,
                                                onChange: (e)=>setInputYaw(e.target.value),
                                                placeholder: "e.g. -10,0,10",
                                                className: "w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 483,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 481,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-1",
                                                children: "Input Pitch (comma separated)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 492,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: inputPitch,
                                                onChange: (e)=>setInputPitch(e.target.value),
                                                placeholder: "e.g. -3,0,3",
                                                className: "w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 493,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 491,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-gray-300 mb-1",
                                                children: "Input Roll (comma separated)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 502,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: inputRoll,
                                                onChange: (e)=>setInputRoll(e.target.value),
                                                placeholder: "e.g. -2,0,2",
                                                className: "w-full bg-gray-900 text-gray-100 rounded-md p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 503,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 501,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 372,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: !canSubmit,
                                className: `w-full md:w-auto px-6 py-3 rounded-md font-semibold transition ${canSubmit ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-700 cursor-not-allowed"}`,
                                children: isSubmitting ? "Submitting…" : "Generate Talking Head"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 513,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 348,
                        columnNumber: 11
                    }, this),
                    jobId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-800/80 border border-gray-700 rounded-lg p-4 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs uppercase tracking-wide text-gray-500",
                                children: "Job"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 526,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-300 break-all",
                                children: jobId
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 527,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1 text-sm text-gray-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 530,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-blue-400",
                                                children: jobState ?? "queued"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 531,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 529,
                                        columnNumber: 13
                                    }, this),
                                    jobStage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs uppercase tracking-wide text-gray-500",
                                        children: [
                                            "Current step: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-300",
                                                children: jobStage
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 535,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 534,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 528,
                                columnNumber: 11
                            }, this),
                            typeof progress === "number" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full bg-gray-900/70 rounded-full h-2 overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-500 h-2 transition-all",
                                            style: {
                                                width: `${Math.max(5, Math.min(100, progress))}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                            lineNumber: 542,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 541,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xs text-gray-400",
                                        children: [
                                            progress.toFixed(0),
                                            "% complete"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 547,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 540,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 525,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-red-900/40 border border-red-700 text-red-200 rounded-lg p-4 text-sm space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 555,
                                columnNumber: 11
                            }, this),
                            upgradeInfo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$UpgradeRequiredBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                code: upgradeInfo.code,
                                error: upgradeInfo.error,
                                feature: upgradeInfo.feature,
                                plan: upgradeInfo.plan,
                                remaining: upgradeInfo.remaining,
                                limit: upgradeInfo.limit
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 557,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 554,
                        columnNumber: 9
                    }, this),
                    videoUrl && activeTab === "create" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-5 shadow-2xl shadow-black/40",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs uppercase tracking-wide text-gray-500",
                                                children: "Result ready"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 573,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-gray-50",
                                                children: "Talking head generated successfully"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 574,
                                                columnNumber: 15
                                            }, this),
                                            videoReadyAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400",
                                                children: [
                                                    "Ready ",
                                                    new Date(videoReadyAt).toLocaleString(undefined, {
                                                        hour12: false
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 576,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 572,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: videoUrl,
                                                download: true,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        viewBox: "0 0 24 24",
                                                        fill: "currentColor",
                                                        className: "h-5 w-5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L11 12.586V4a1 1 0 0 1 1-1Z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                                lineNumber: 590,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M5 18a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                                lineNumber: 591,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                        lineNumber: 589,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Download MP4"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 582,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: videoUrl,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "inline-flex items-center gap-2 rounded-full border border-gray-600 px-5 py-2 text-sm font-semibold text-gray-100 hover:border-blue-400 hover:text-blue-300",
                                                children: "View in new tab"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 595,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 581,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 571,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-gray-800 overflow-hidden bg-black",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                    controls: true,
                                    src: videoUrl,
                                    className: "w-full max-h-[480px] object-contain"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                    lineNumber: 606,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 605,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 570,
                        columnNumber: 9
                    }, this),
                    activeTab === "create" && renderHistory()
                ]
            }, void 0, true),
            activeTab === "history" && renderHistory()
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
        lineNumber: 325,
        columnNumber: 5
    }, this);
}
_s(UploadTalkingHead, "5nXF92+ZQu/vTPL8JDvntV2MyKY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = UploadTalkingHead;
var _c;
__turbopack_context__.k.register(_c, "UploadTalkingHead");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/dashboard/talking-head/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TalkingHeadPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$render$2f$UploadTalkingHead$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/render/UploadTalkingHead.tsx [app-client] (ecmascript)");
"use client";
;
;
function TalkingHeadPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "shrink-0 pt-12 md:pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl md:text-4xl font-semibold tracking-tight",
                        children: "Talking Head"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
                        lineNumber: 11,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
                    lineNumber: 10,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 md:px-12 lg:px-20 max-w-6xl mx-auto pb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "mt-12 mx-auto w-full max-w-3xl bg-gray-800 rounded-lg p-8 shadow-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold mb-2",
                                children: "Generate a Talking Head"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
                                lineNumber: 21,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-300 mb-6",
                                children: "Upload a face photo, enter a script, choose a voice, and we’ll render a video."
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
                                lineNumber: 22,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$render$2f$UploadTalkingHead$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
                                lineNumber: 25,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/talking-head/page.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = TalkingHeadPage;
var _c;
__turbopack_context__.k.register(_c, "TalkingHeadPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_c0f0e0b5._.js.map