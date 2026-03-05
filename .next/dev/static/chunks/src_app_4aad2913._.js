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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/urls.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
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
                lineNumber: 37,
                columnNumber: 7
            }, this),
            feature ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-[0.3em] text-rose-200/70",
                children: feature
            }, void 0, false, {
                fileName: "[project]/src/app/components/common/UpgradeRequiredBanner.tsx",
                lineNumber: 39,
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
                lineNumber: 42,
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
                lineNumber: 47,
                columnNumber: 15
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKAGES_URL"],
                className: "inline-flex items-center gap-2 rounded-full bg-rose-400/20 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-400/30",
                children: "Upgrade plan →"
            }, void 0, false, {
                fileName: "[project]/src/app/components/common/UpgradeRequiredBanner.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/common/UpgradeRequiredBanner.tsx",
        lineNumber: 31,
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
"[project]/src/app/components/uploads/FileUpload.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FileUpload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$PlanContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/dashboard/PlanContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-upload.js [app-client] (ecmascript) <export default as UploadCloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$UpgradeRequiredBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/common/UpgradeRequiredBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/urls.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const mapErrorToUserMessage = (meta)=>{
    const code = meta.code || "";
    if (code === "UPGRADE_REQUIRED") {
        return {
            title: "Upgrade required",
            message: "Your plan doesn’t include this feature. Upgrade to continue.",
            actionLabel: "View plans",
            actionHref: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKAGES_URL"],
            requestId: meta.requestId || undefined
        };
    }
    if (code === "FACE_REQUIRED_FOR_ENROLLMENT") {
        return {
            title: "Face enrollment required",
            message: "Please enroll your profile face to continue.",
            requestId: meta.requestId || undefined
        };
    }
    if (code === "FACE_ENROLLMENT_REQUIRED") {
        return {
            title: "Face enrollment required",
            message: "Please enroll your profile face to continue.",
            requestId: meta.requestId || undefined
        };
    }
    if (code === "FACE_MISMATCH") {
        return {
            title: "Face verification failed",
            message: "This upload doesn’t match the enrolled persona for this package.",
            requestId: meta.requestId || undefined
        };
    }
    if (code === "FACE_ID_DRIFT" || code === "FACE_REENROLL_REQUIRED") {
        return {
            title: "Face verification needs re-enrollment",
            message: "We detected a face ID drift. Please re-enroll your face photo for this package to continue.",
            actionLabel: "Re-enroll face",
            actionHref: "/dashboard?enroll=1",
            requestId: meta.requestId || undefined
        };
    }
    if (code === "MULTIPLE_FACES_NOT_ALLOWED") {
        return {
            title: "Multiple faces detected",
            message: "Please upload an image with only one visible face.",
            requestId: meta.requestId || undefined
        };
    }
    if (code === "PERSONA_ALREADY_BOUND") {
        return {
            title: "Persona already bound",
            message: "This persona belongs to another active package.",
            requestId: meta.requestId || undefined
        };
    }
    return {
        title: "Upload failed",
        message: "We couldn’t analyze that image. Please try again.",
        requestId: meta.requestId || undefined
    };
};
const MAX_MB = 25;
const ACCEPT = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/avif"
];
function FileUpload({ onUploadSuccess, packageInstanceId }) {
    _s();
    const { refresh: refreshPlan } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$PlanContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanInfo"])();
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [file, setFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [previewURL, setPreviewURL] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errorRequestId, setErrorRequestId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errorMeta, setErrorMeta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const lastPlanRefreshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [upgradeInfo, setUpgradeInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [personaMismatch, setPersonaMismatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [personaAlreadyBound, setPersonaAlreadyBound] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bindingActionLoading, setBindingActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dragActive, setDragActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadPct, setUploadPct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const abortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FileUpload.useEffect": ()=>{
            return ({
                "FileUpload.useEffect": ()=>{
                    if (previewURL) URL.revokeObjectURL(previewURL);
                    abortRef.current?.abort();
                }
            })["FileUpload.useEffect"];
        }
    }["FileUpload.useEffect"], [
        previewURL
    ]);
    function formatSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    function validate(f) {
        if (!ACCEPT.includes(f.type)) return "Unsupported file type. Use PNG, JPG, WEBP, or AVIF.";
        if (f.size > MAX_MB * 1024 * 1024) return `File is too large. Max ${MAX_MB} MB.`;
        return null;
    }
    function handleFiles(fileList) {
        const f = fileList?.[0] || null;
        if (!f) return;
        const v = validate(f);
        if (v) {
            setError(v);
            setErrorMeta({
                rawMessage: v
            });
            setUpgradeInfo(null);
            setStatus("error");
            return;
        }
        setError(null);
        setUpgradeInfo(null);
        setFile(f);
        setStatus("ready");
        setPreviewURL((old)=>{
            if (old) URL.revokeObjectURL(old);
            return URL.createObjectURL(f);
        });
    }
    function onSelectClick() {
        inputRef.current?.click();
    }
    async function onSubmit(fileOverride) {
        const selectedFile = fileOverride ?? file;
        if (!selectedFile || status === "uploading") return;
        setStatus("uploading");
        setUploadPct(0);
        setError(null);
        setErrorRequestId(null);
        setErrorMeta(null);
        setUpgradeInfo(null);
        setPersonaMismatch(null);
        setPersonaAlreadyBound(null);
        setError(null);
        const controller = new AbortController();
        abortRef.current = controller;
        try {
            const { insights, duplicate, requestId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["analyzeImageMultipart"])({
                file: selectedFile,
                packageInstanceId,
                signal: controller.signal,
                onProgress: (pct)=>setUploadPct(pct)
            });
            onUploadSuccess(insights, {
                duplicate,
                requestId
            });
            const now = Date.now();
            if (now - lastPlanRefreshRef.current > 500) {
                lastPlanRefreshRef.current = now;
                refreshPlan(true);
            }
            setStatus("success");
            setErrorRequestId(null);
            setUpgradeInfo(null);
            setPersonaMismatch(null);
            setPersonaAlreadyBound(null);
        // keep preview so user sees what was uploaded; call reset() if you want to clear immediately
        } catch (e) {
            if (controller.signal.aborted) {
                setError("Upload cancelled.");
                setErrorRequestId(null);
                setErrorMeta({
                    rawMessage: "Upload cancelled."
                });
                setUpgradeInfo(null);
            } else {
                const errObj = e;
                const nested = errObj && typeof errObj.data === "object" && errObj.data ? errObj.data : null;
                const codeRaw = typeof errObj?.errorCode === "string" && errObj.errorCode || typeof errObj?.code === "string" && errObj.code || typeof errObj?.error === "string" && errObj.error || typeof errObj?.message === "string" && errObj.message || (nested && typeof nested.errorCode === "string" ? nested.errorCode : null) || (nested && typeof nested.code === "string" ? nested.code : null) || (nested && typeof nested.error === "string" ? nested.error : null) || (nested && typeof nested.message === "string" ? nested.message : null) || null;
                const maybeRequestId = typeof errObj?.requestId === "string" && errObj.requestId || (nested && typeof nested.requestId === "string" ? nested.requestId : null) || null;
                const statusCode = errObj?.status ?? (nested && typeof nested.status === "number" ? nested.status : null) ?? null;
                const maybeUpgrade = errObj?.code === "UPGRADE_REQUIRED" ? {
                    code: errObj.code,
                    error: errObj.message,
                    feature: errObj.feature,
                    plan: errObj.plan ?? null,
                    remaining: typeof errObj.remaining === "number" ? errObj.remaining : null,
                    limit: typeof errObj.limit === "number" ? errObj.limit : null
                } : null;
                const personaEnrollRequired = codeRaw === "FACE_REQUIRED_FOR_ENROLLMENT" || codeRaw === "FACE_ENROLLMENT_REQUIRED";
                const faceMismatch = codeRaw === "FACE_MISMATCH";
                const faceIdDrift = codeRaw === "FACE_ID_DRIFT" || codeRaw === "FACE_REENROLL_REQUIRED";
                const multipleFaces = codeRaw === "MULTIPLE_FACES_NOT_ALLOWED";
                if (codeRaw === "PACKAGE_NOT_BOUND_TO_PERSONA" && errObj.payload) {
                    const payload = errObj.payload;
                    const packagePersonaKey = typeof payload.packagePersonaKey === "string" ? payload.packagePersonaKey : "";
                    const requestedPersonaKey = typeof payload.requestedPersonaKey === "string" ? payload.requestedPersonaKey : "";
                    if (packagePersonaKey && requestedPersonaKey) {
                        setPersonaMismatch({
                            packagePersonaKey,
                            requestedPersonaKey
                        });
                    }
                }
                if (codeRaw === "PERSONA_ALREADY_BOUND" && errObj.payload) {
                    const payload = errObj.payload;
                    const existingInstanceId = typeof payload.existingInstanceId === "string" ? payload.existingInstanceId : undefined;
                    setPersonaAlreadyBound({
                        existingInstanceId
                    });
                }
                const msg = personaEnrollRequired ? "Please enroll your profile face to continue." : faceMismatch ? "This package is locked to a different persona face. Select the correct package or buy a new one for this persona." : faceIdDrift ? "We detected a face ID drift. Please re-enroll your face photo for this package to continue." : multipleFaces ? "Please upload an image with only one visible face to enroll this persona." : codeRaw === "PERSONA_ALREADY_BOUND" ? "This persona already belongs to another active package. Please select the correct package and try again." : e instanceof Error ? e.message : typeof e === "string" ? e : "Upload failed. Please try again.";
                if (maybeRequestId && (statusCode === 409 || statusCode === 400 || statusCode === 422)) {
                    try {
                        window.dispatchEvent(new Event("ai-auth-changed"));
                    } catch  {}
                }
                setError(msg);
                setErrorRequestId(maybeRequestId);
                setErrorMeta({
                    code: codeRaw,
                    statusCode,
                    rawMessage: e instanceof Error ? e.message : typeof e === "string" ? e : null,
                    requestId: maybeRequestId
                });
                setUpgradeInfo(maybeUpgrade);
            }
            setStatus("error");
        } finally{
            abortRef.current = null;
        }
    }
    function onCancel() {
        abortRef.current?.abort();
    }
    function reset() {
        setStatus("idle");
        setError(null);
        setErrorRequestId(null);
        setErrorMeta(null);
        setUpgradeInfo(null);
        setPersonaMismatch(null);
        setPersonaAlreadyBound(null);
        setFile(null);
        setUploadPct(0);
        if (previewURL) URL.revokeObjectURL(previewURL);
        setPreviewURL(null);
        if (inputRef.current) inputRef.current.value = "";
    }
    const showDebug = ("TURBOPACK compile-time value", "development") !== "production";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-none",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl hg-surface p-4 backdrop-blur",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-3 flex items-start justify-between gap-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-base font-semibold tracking-tight text-white",
                                children: "Upload image"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                lineNumber: 362,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs hg-muted",
                                children: "Drag & drop or click to browse"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                lineNumber: 363,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                        lineNumber: 361,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                    lineNumber: 360,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onDragOver: (e)=>{
                        e.preventDefault();
                        setDragActive(true);
                    },
                    onDragLeave: ()=>setDragActive(false),
                    onDrop: (e)=>{
                        e.preventDefault();
                        setDragActive(false);
                        handleFiles(e.dataTransfer.files);
                    },
                    onClick: ()=>onSelectClick(),
                    role: "button",
                    tabIndex: 0,
                    onKeyDown: (e)=>e.key === "Enter" ? onSelectClick() : null,
                    className: `relative h-32 md:h-[150px] rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition
            ${dragActive ? "border-[#50C0F0] bg-[rgba(80,192,240,0.14)]" : "border-[var(--hg-border-2)] bg-[var(--hg-surface-2)] hover:border-[var(--hg-border)]"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: inputRef,
                            type: "file",
                            accept: ACCEPT.join(","),
                            hidden: true,
                            onChange: (e)=>handleFiles(e.target.files)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 384,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-full flex-col items-center justify-center gap-2 hg-text",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `grid place-items-center rounded-full w-9 h-9
              ${dragActive ? "bg-[rgba(80,192,240,0.24)]" : "bg-[rgba(255,255,255,0.06)]"}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__["UploadCloud"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                        lineNumber: 396,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-white",
                                            children: "Click to choose"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                            lineNumber: 399,
                                            columnNumber: 15
                                        }, this),
                                        " ",
                                        "or drag & drop"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 398,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-[11px] hg-muted-2",
                                    children: [
                                        "Max ",
                                        MAX_MB,
                                        "MB • PNG/JPG/WebP/AVIF"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 402,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 391,
                            columnNumber: 11
                        }, this),
                        dragActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[rgba(80,192,240,0.45)]"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 405,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                    lineNumber: 366,
                    columnNumber: 9
                }, this),
                file ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 rounded-xl hg-surface-soft p-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            previewURL ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: previewURL,
                                alt: "Preview",
                                width: 60,
                                height: 60,
                                className: "h-[60px] w-[60px] rounded-md object-cover border border-[var(--hg-border)]"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                lineNumber: 413,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-[60px] w-[60px] rounded-md bg-[rgba(255,255,255,0.04)] border border-[var(--hg-border)] grid place-items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                                    className: "w-4 h-4 opacity-70 text-[var(--hg-muted)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 422,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                lineNumber: 421,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "truncate text-sm font-medium text-white",
                                        children: file.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                        lineNumber: 426,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs hg-muted",
                                        children: [
                                            file.type || "image",
                                            " • ",
                                            formatSize(file.size)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                        lineNumber: 427,
                                        columnNumber: 17
                                    }, this),
                                    status === "uploading" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Progress, {
                                            pct: uploadPct
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                            lineNumber: 430,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                        lineNumber: 429,
                                        columnNumber: 19
                                    }, this) : null,
                                    status === "success" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 inline-flex items-center gap-1 text-emerald-300 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                                lineNumber: 435,
                                                columnNumber: 21
                                            }, this),
                                            " Uploaded & analyzed"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                        lineNumber: 434,
                                        columnNumber: 19
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                lineNumber: 425,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                        lineNumber: 411,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                    lineNumber: 410,
                    columnNumber: 11
                }, this) : null,
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 text-xs text-rose-300 bg-rose-900/20 border border-rose-700/40 rounded-md px-3 py-2 space-y-2",
                    children: [
                        (()=>{
                            const mapped = mapErrorToUserMessage(errorMeta || {
                                rawMessage: error
                            });
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-semibold text-rose-200",
                                        children: mapped.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                        lineNumber: 449,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "break-words whitespace-normal",
                                        children: mapped.message
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                        lineNumber: 450,
                                        columnNumber: 19
                                    }, this),
                                    mapped.actionLabel && mapped.actionHref ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: mapped.actionHref,
                                        className: "inline-flex items-center rounded-md border border-rose-700/60 px-2.5 py-1 text-[11px] hover:border-rose-400",
                                        children: mapped.actionLabel
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                        lineNumber: 452,
                                        columnNumber: 21
                                    }, this) : null
                                ]
                            }, void 0, true);
                        })(),
                        errorRequestId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[11px] hg-muted",
                                    children: [
                                        "Support ID: ",
                                        errorRequestId
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 464,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>navigator.clipboard.writeText(errorRequestId),
                                    className: "inline-flex items-center gap-1 text-[11px] hg-muted underline hover:text-[#50C0F0]",
                                    children: "Copy"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 467,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 463,
                            columnNumber: 15
                        }, this),
                        upgradeInfo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$UpgradeRequiredBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            code: upgradeInfo.code,
                            error: mapErrorToUserMessage({
                                code: "UPGRADE_REQUIRED"
                            }).title,
                            feature: upgradeInfo.feature,
                            plan: upgradeInfo.plan,
                            remaining: upgradeInfo.remaining,
                            limit: upgradeInfo.limit
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 477,
                            columnNumber: 15
                        }, this) : null,
                        showDebug && errorMeta ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "rounded-md border border-rose-700/40 bg-rose-900/10 px-3 py-2 text-[11px] text-rose-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    className: "cursor-pointer text-rose-200",
                                    children: "Debug"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 488,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 space-y-1 break-words whitespace-normal",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                "Status: ",
                                                errorMeta.statusCode ?? "—"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                            lineNumber: 490,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                "Code: ",
                                                errorMeta.code ?? "—"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                            lineNumber: 491,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                "Message: ",
                                                String(errorMeta.rawMessage ?? "—")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                            lineNumber: 492,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 489,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 487,
                            columnNumber: 15
                        }, this) : null,
                        personaMismatch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-md border border-rose-700/40 bg-rose-900/10 px-3 py-2 text-rose-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "This package is bound to persona",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: personaMismatch.packagePersonaKey
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                            lineNumber: 500,
                                            columnNumber: 19
                                        }, this),
                                        ". You requested",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: personaMismatch.requestedPersonaKey
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                            lineNumber: 502,
                                            columnNumber: 19
                                        }, this),
                                        "."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 498,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex flex-wrap gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/dashboard",
                                            className: "text-[11px] underline underline-offset-2 hover:text-white",
                                            children: "Select another package"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                            lineNumber: 505,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/#packages",
                                            className: "text-[11px] underline underline-offset-2 hover:text-white",
                                            children: "Buy another package"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                            lineNumber: 511,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 504,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 497,
                            columnNumber: 15
                        }, this) : null,
                        personaAlreadyBound?.existingInstanceId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-md border border-rose-700/40 bg-rose-900/10 px-3 py-2 text-rose-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "This persona already belongs to another active package. Please select the correct package and try again."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 522,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: async ()=>{
                                        setBindingActionLoading(true);
                                        try {
                                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectPackageInstance"])(personaAlreadyBound.existingInstanceId || "");
                                            if ("TURBOPACK compile-time truthy", 1) {
                                                window.dispatchEvent(new Event("ai-auth-changed"));
                                            }
                                        } catch (err) {
                                            console.error("Failed to select package instance:", err);
                                        } finally{
                                            setBindingActionLoading(false);
                                        }
                                    },
                                    disabled: bindingActionLoading,
                                    className: "mt-2 inline-flex items-center gap-2 rounded-md border border-rose-700/60 px-2.5 py-1 text-[11px] hover:border-rose-400 disabled:opacity-60",
                                    children: bindingActionLoading ? "Selecting..." : "Select that package"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 525,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 521,
                            columnNumber: 15
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                    lineNumber: 444,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 flex flex-wrap items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onSubmit(),
                            disabled: !file || status === "uploading",
                            className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition
              ${file && status !== "uploading" ? "bg-[#50C0F0] text-[#07141d] hover:opacity-90 shadow" : "bg-[rgba(255,255,255,0.10)] cursor-not-allowed"}`,
                            children: status === "uploading" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-4 h-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                        lineNumber: 563,
                                        columnNumber: 17
                                    }, this),
                                    "Uploading…"
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: "Analyze with AI"
                            }, void 0, false)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 551,
                            columnNumber: 11
                        }, this),
                        status === "uploading" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[var(--hg-border)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 576,
                                    columnNumber: 15
                                }, this),
                                "Cancel"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: reset,
                            className: "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[var(--hg-border)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                                    lineNumber: 584,
                                    columnNumber: 15
                                }, this),
                                "Reset"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                            lineNumber: 580,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                    lineNumber: 550,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
            lineNumber: 359,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
        lineNumber: 358,
        columnNumber: 5
    }, this);
}
_s(FileUpload, "oFoP5YlzRpZHI4UPZMz+0/fxYoc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$PlanContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanInfo"]
    ];
});
_c = FileUpload;
/* ───────── Smaller UI atoms ───────── */ function Progress({ pct }) {
    const v = Math.max(0, Math.min(100, Math.round(pct)));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-2 rounded-full bg-[rgba(255,255,255,0.10)] overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full bg-gradient-to-r from-[#50C0F0] to-[#7fd9ff]",
                    style: {
                        width: `${v}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                    lineNumber: 601,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                lineNumber: 600,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 text-[10px] hg-muted",
                children: [
                    v,
                    "%"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
                lineNumber: 606,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/uploads/FileUpload.tsx",
        lineNumber: 599,
        columnNumber: 5
    }, this);
}
_c1 = Progress;
var _c, _c1;
__turbopack_context__.k.register(_c, "FileUpload");
__turbopack_context__.k.register(_c1, "Progress");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/upload/UploadStage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UploadStage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$Reveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/common/Reveal.tsx [app-client] (ecmascript)");
"use client";
;
;
function UploadStage({ title = "Upload content", subtitle = "Analyze your image to get captions, hashtags, and timing insights.", statusLabel = "Ready to upload", showHeader = true, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            showHeader ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold tracking-tight text-white",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/upload/UploadStage.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-gray-400",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/upload/UploadStage.tsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs uppercase tracking-wide text-gray-500",
                        children: statusLabel
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/upload/UploadStage.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/upload/UploadStage.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$Reveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                as: "section",
                className: "w-full rounded-2xl p-5",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/components/upload/UploadStage.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/upload/UploadStage.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = UploadStage;
var _c;
__turbopack_context__.k.register(_c, "UploadStage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/dashboard/upload/CreationCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreationCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function isLikelyPrivateR2Url(url) {
    const lower = url.toLowerCase();
    const hasSignedQuery = lower.includes("x-amz-") || lower.includes("signature") || lower.includes("token=");
    try {
        const parsed = new URL(url);
        const hostIsR2 = parsed.hostname.includes("r2.cloudflarestorage.com");
        const hasUploadsPath = parsed.pathname.includes("/aiplatform/uploads/");
        return (hostIsR2 || hasUploadsPath) && !hasSignedQuery;
    } catch  {
        const hasUploadsPath = lower.includes("/aiplatform/uploads/");
        return hasUploadsPath && !hasSignedQuery;
    }
}
function CreationCard({ id, title, createdAt, type, status, thumbnailUrl, imageKey, onOpenCreation }) {
    _s();
    const [imgFailed, setImgFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [resolvedThumbUrl, setResolvedThumbUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchAttemptRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dateLabel = createdAt ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(createdAt)).replace(",", " •") : "—";
    const normalizedType = (type || "").trim();
    const knownPlatforms = new Set([
        "instagram",
        "tiktok",
        "onlyfans"
    ]);
    const displayMap = {
        instagram: "Instagram",
        tiktok: "TikTok",
        onlyfans: "OnlyFans"
    };
    const normalizedLower = normalizedType.toLowerCase();
    const titleText = knownPlatforms.has(normalizedLower) ? `${displayMap[normalizedLower] || normalizedType} Strategy` : title || "Content Strategy";
    const pill = status || "Ready";
    const shouldPreferSigned = Boolean(imageKey && thumbnailUrl && isLikelyPrivateR2Url(thumbnailUrl));
    const previewUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreationCard.useMemo[previewUrl]": ()=>resolvedThumbUrl || (shouldPreferSigned ? null : thumbnailUrl || null)
    }["CreationCard.useMemo[previewUrl]"], [
        resolvedThumbUrl,
        shouldPreferSigned,
        thumbnailUrl
    ]);
    const showFallback = !previewUrl || imgFailed;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreationCard.useEffect": ()=>{
            if (!imageKey) return;
            const shouldFetchSigned = !thumbnailUrl || shouldPreferSigned || imgFailed;
            if (!shouldFetchSigned) return;
            const fetchKey = `${id}:${imageKey}`;
            if (fetchAttemptRef.current === fetchKey) return;
            fetchAttemptRef.current = fetchKey;
            let cancelled = false;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserResultImageUrl"])({
                id
            }).then({
                "CreationCard.useEffect": (payload)=>{
                    if (cancelled) return;
                    setResolvedThumbUrl(payload.url);
                }
            }["CreationCard.useEffect"]).catch({
                "CreationCard.useEffect": ()=>{
                    if (cancelled) return;
                    setResolvedThumbUrl(null);
                }
            }["CreationCard.useEffect"]);
            return ({
                "CreationCard.useEffect": ()=>{
                    cancelled = true;
                }
            })["CreationCard.useEffect"];
        }
    }["CreationCard.useEffect"], [
        id,
        imageKey,
        imgFailed,
        shouldPreferSigned,
        thumbnailUrl
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreationCard.useEffect": ()=>{
            setImgFailed(false);
        }
    }["CreationCard.useEffect"], [
        previewUrl
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: ()=>onOpenCreation?.(id),
        className: "group w-full text-left rounded-2xl hg-surface p-4 hover:shadow-md transition motion-reduce:transition-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-32 w-full overflow-hidden rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)]",
                children: [
                    !showFallback ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: previewUrl,
                        alt: title,
                        loading: "lazy",
                        referrerPolicy: "no-referrer",
                        onError: ()=>setImgFailed(true),
                        className: "absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center justify-center text-[var(--hg-muted-2)] text-sm",
                        children: "No preview"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this),
                    normalizedType ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-2 left-2 rounded-full border border-[var(--hg-border)] bg-[rgba(255,255,255,0.08)] px-2 py-0.5 text-[10px] text-[var(--hg-muted)]",
                        children: displayMap[normalizedLower] || normalizedType
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-base font-semibold text-white truncate",
                                children: titleText
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center rounded-full border border-[var(--hg-border)] bg-[rgba(255,255,255,0.08)] px-2 py-0.5 text-[11px] text-[var(--hg-muted)]",
                                children: pill
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs hg-muted",
                        children: dateLabel
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/upload/CreationCard.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_s(CreationCard, "yNmsRbTF5GPzoxP5WRjrJpVLI0Q=");
_c = CreationCard;
var _c;
__turbopack_context__.k.register(_c, "CreationCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/hooks/useRecentCreations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRecentCreations",
    ()=>useRecentCreations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useRecentCreations({ packageInstanceId, limit = 12 }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRecentCreations.useCallback[refresh]": async ()=>{
            if (!packageInstanceId) {
                setItems([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const next = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRecentCreations"])({
                    packageInstanceId,
                    limit
                });
                setItems(next);
            } catch (err) {
                console.error("Failed to load recent creations:", err);
                setItems([]);
            } finally{
                setLoading(false);
            }
        }
    }["useRecentCreations.useCallback[refresh]"], [
        packageInstanceId,
        limit
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRecentCreations.useEffect": ()=>{
            refresh();
        }
    }["useRecentCreations.useEffect"], [
        refresh
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRecentCreations.useEffect": ()=>{
            const handleAnalysisChanged = {
                "useRecentCreations.useEffect.handleAnalysisChanged": ()=>{
                    refresh();
                }
            }["useRecentCreations.useEffect.handleAnalysisChanged"];
            window.addEventListener("analysis:changed", handleAnalysisChanged);
            return ({
                "useRecentCreations.useEffect": ()=>{
                    window.removeEventListener("analysis:changed", handleAnalysisChanged);
                }
            })["useRecentCreations.useEffect"];
        }
    }["useRecentCreations.useEffect"], [
        refresh
    ]);
    return {
        items,
        loading,
        refresh
    };
}
_s(useRecentCreations, "xwMMckCKDpV0xFMobWbFw/+RopQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/dashboard/upload/RecentCreations.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RecentCreations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$upload$2f$CreationCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/upload/CreationCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useRecentCreations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useRecentCreations.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function RecentCreations({ packageInstanceId, onOpenCreation, refreshToken }) {
    _s();
    const { items, loading, refresh } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useRecentCreations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRecentCreations"])({
        packageInstanceId: packageInstanceId || null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecentCreations.useEffect": ()=>{
            if (refreshToken === undefined) return;
            refresh();
        }
    }["RecentCreations.useEffect"], [
        refreshToken,
        refresh
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "w-full pt-1 pb-8 md:pt-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-baseline justify-between border-b border-[var(--hg-border-2)] pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-semibold tracking-tight text-white/95 md:text-3xl",
                        children: "Recents"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard/history",
                        className: "text-base font-medium tracking-tight hg-muted transition-colors hover:text-[#50C0F0] md:text-lg",
                        children: "See all ›"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex gap-4 overflow-x-auto pb-2 pr-4 scroll-px-4 md:mt-4 md:gap-6 md:pr-6 md:scroll-px-6",
                children: Array.from({
                    length: 3
                }).map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-[220px] shrink-0 rounded-2xl hg-surface p-4 sm:w-[260px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-32 w-full rounded-lg bg-[var(--hg-surface-2)]"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                                lineNumber: 47,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 w-40 rounded bg-[rgba(255,255,255,0.08)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                                        lineNumber: 49,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-3 w-24 rounded bg-[rgba(255,255,255,0.06)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                                        lineNumber: 50,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                                lineNumber: 48,
                                columnNumber: 15
                            }, this)
                        ]
                    }, `recent-skeleton-${idx}`, true, {
                        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                        lineNumber: 43,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, this) : items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 rounded-2xl hg-surface p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-base font-semibold text-white",
                        children: "Create your first strategy"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm hg-muted",
                        children: "Upload an image to generate a report."
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            const target = document.getElementById("upload-stage");
                            if (target) {
                                target.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });
                            }
                        },
                        className: "mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-2 text-sm font-medium text-[#04131d] hover:opacity-90",
                        children: "Upload content"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-4 scroll-px-4 md:mt-4 md:gap-6 md:pr-6 md:scroll-px-6",
                children: items.map((item)=>{
                    const finalThumbnailProp = item.thumbnailUrl;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-[220px] shrink-0 snap-start sm:w-[260px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$upload$2f$CreationCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            id: item.id,
                            title: item.title,
                            createdAt: item.createdAt,
                            type: item.type,
                            status: item.status,
                            thumbnailUrl: finalThumbnailProp,
                            imageKey: item.imageKey,
                            onOpenCreation: onOpenCreation
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                            lineNumber: 82,
                            columnNumber: 17
                        }, this)
                    }, item.id, false, {
                        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                        lineNumber: 81,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                lineNumber: 77,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: refresh,
                className: "sr-only",
                "aria-hidden": true,
                tabIndex: -1,
                children: "Refresh"
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/upload/RecentCreations.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(RecentCreations, "2o+g2BNIyZBotXQUr4PayhaTOdE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useRecentCreations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRecentCreations"]
    ];
});
_c = RecentCreations;
var _c;
__turbopack_context__.k.register(_c, "RecentCreations");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/dashboard/upload/useReportDrawer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReportDrawer",
    ()=>useReportDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useReportDrawer() {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handledOpenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const openDrawer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useReportDrawer.useCallback[openDrawer]": (id)=>{
            if (!id) return;
            setActiveId(id);
            setIsOpen(true);
        }
    }["useReportDrawer.useCallback[openDrawer]"], []);
    const closeDrawer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useReportDrawer.useCallback[closeDrawer]": ()=>{
            setIsOpen(false);
        }
    }["useReportDrawer.useCallback[closeDrawer]"], []);
    const openDrawerFromQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useReportDrawer.useCallback[openDrawerFromQuery]": ()=>{
            const openId = searchParams.get("open");
            if (!openId) return;
            if (handledOpenRef.current === openId && isOpen) return;
            handledOpenRef.current = openId;
            setActiveId(openId);
            setIsOpen(true);
            const next = new URLSearchParams(searchParams.toString());
            next.delete("open");
            const query = next.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false
            });
        }
    }["useReportDrawer.useCallback[openDrawerFromQuery]"], [
        isOpen,
        pathname,
        router,
        searchParams
    ]);
    return {
        openDrawer,
        closeDrawer,
        isOpen,
        activeId,
        setIsOpen,
        openDrawerFromQuery
    };
}
_s(useReportDrawer, "I/RiWCLLkpiXLTW/9XPe04esKxI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/[locale]/dashboard/upload/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UploadPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$uploads$2f$FileUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/uploads/FileUpload.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$PlanContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/dashboard/PlanContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$SelectActiveInstance$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/SelectActiveInstance.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$quotaDisplay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/quotaDisplay.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/urls.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$Reveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/common/Reveal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$upload$2f$UploadStage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/upload/UploadStage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$upload$2f$RecentCreations$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/upload/RecentCreations.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$report$2f$ReportDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/report/ReportDrawer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$upload$2f$useReportDrawer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/upload/useReportDrawer.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
function UploadPage() {
    _s();
    const [refreshToken, setRefreshToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const { openDrawer, closeDrawer, isOpen: reportOpen, activeId: reportResultId, setIsOpen: setReportOpen, openDrawerFromQuery } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$upload$2f$useReportDrawer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReportDrawer"])();
    const [uploadsLeft, setUploadsLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { data: planData, loading: planLoading, refresh: refreshPlan } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$PlanContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanInfo"])();
    const activePackageInstanceId = planData?.packageInstanceId ?? null;
    const hasAccess = planData?.hasAccess ?? false;
    const needsSelection = Boolean(planData?.needsInstanceSelection);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UploadPage.useEffect": ()=>{
            setUploadsLeft(typeof planData?.uploadsRemaining === "number" ? planData.uploadsRemaining : null);
        }
    }["UploadPage.useEffect"], [
        planData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UploadPage.useEffect": ()=>{
            openDrawerFromQuery();
        }
    }["UploadPage.useEffect"], [
        openDrawerFromQuery
    ]);
    const handleUploadSuccess = (doc, info)=>{
        // update local usage UI
        setUploadsLeft((prev)=>{
            if (prev === null) return prev;
            return info?.duplicate ? prev : Math.max(prev - 1, 0);
        });
        // 🔔 broadcast “new analysis” (cross-tab + same-tab)
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem("analysis:changed", String(Date.now())); // triggers 'storage' in other tabs
                window.dispatchEvent(new Event("analysis:changed")); // same-tab listeners
            }
        } catch  {}
        if (doc?._id) {
            openDrawer(doc._id);
        }
        setRefreshToken((prev)=>prev + 1);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen flex flex-col text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full px-4 pb-24 pt-8 md:pt-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto w-full max-w-[960px] space-y-8 md:space-y-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "mx-auto max-w-2xl text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl font-semibold tracking-tight text-white md:text-4xl",
                                        children: "Create your next strategy"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-sm hg-muted md:text-base",
                                        children: "Upload one image and get platform-ready content ideas in seconds."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 77,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            planLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$Reveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                as: "section",
                                id: "upload-card",
                                className: "mx-auto w-full max-w-xl rounded-2xl hg-surface p-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "h-6 w-40 mb-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 87,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                        className: "h-4 w-64 mb-6"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 88,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                className: "h-10 w-full"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                                lineNumber: 90,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                className: "h-40 w-full"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                                lineNumber: 91,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                                className: "h-10 w-32 mx-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                                lineNumber: 92,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                lineNumber: 82,
                                columnNumber: 15
                            }, this) : needsSelection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$SelectActiveInstance$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onSelected: ()=>refreshPlan(true)
                            }, void 0, false, {
                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                lineNumber: 96,
                                columnNumber: 15
                            }, this) : !hasAccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$Reveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                as: "section",
                                id: "upload-card",
                                className: "mx-auto w-full max-w-xl rounded-2xl hg-surface p-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-semibold text-white",
                                        children: "Upload content"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 rounded-xl hg-surface-soft px-3 py-2 text-sm hg-muted",
                                        children: "You don't have a package yet. Please purchase a plan to start uploading."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 104,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKAGES_URL"],
                                        className: "mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#04131d] hover:opacity-90",
                                        children: "View plans →"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 107,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                lineNumber: 98,
                                columnNumber: 15
                            }, this) : (uploadsLeft ?? 0) <= 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$Reveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                as: "section",
                                id: "upload-card",
                                className: "mx-auto w-full max-w-xl rounded-2xl hg-surface p-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-xl font-semibold text-white",
                                        children: "Upload content"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 120,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 rounded-xl hg-surface-soft px-3 py-2 text-sm hg-muted",
                                        children: "You've used all your uploads. Upgrade your plan to continue."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKAGES_URL"],
                                        className: "mt-4 inline-flex rounded-xl bg-[#50C0F0] px-4 py-3 text-sm font-medium text-[#04131d] hover:opacity-90",
                                        children: "Manage billing →"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 124,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                lineNumber: 115,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: "upload-panel",
                                        className: "mx-auto w-full max-w-xl",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            id: "upload-stage",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$upload$2f$UploadStage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                title: "Create",
                                                subtitle: "Upload an image to generate recommendations.",
                                                statusLabel: "Ready to upload",
                                                showHeader: false,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm hg-muted",
                                                        children: [
                                                            "Uploads remaining:",
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold text-white",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$quotaDisplay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatRemaining"])(uploadsLeft)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                                                lineNumber: 143,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$uploads$2f$FileUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            onUploadSuccess: handleUploadSuccess,
                                                            packageInstanceId: activePackageInstanceId
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                                            lineNumber: 148,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                                lineNumber: 135,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                            lineNumber: 134,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 133,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$upload$2f$RecentCreations$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        packageInstanceId: activePackageInstanceId,
                                        refreshToken: refreshToken,
                                        onOpenCreation: openDrawer
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                                lineNumber: 132,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$report$2f$ReportDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: reportOpen,
                onOpenChange: (next)=>{
                    setReportOpen(next);
                    if (!next) closeDrawer();
                },
                resultId: reportResultId
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[locale]/dashboard/upload/page.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(UploadPage, "68zUBVomKSaDrKlKouTD5TqXJJc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$upload$2f$useReportDrawer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReportDrawer"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$PlanContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanInfo"]
    ];
});
_c = UploadPage;
var _c;
__turbopack_context__.k.register(_c, "UploadPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_4aad2913._.js.map