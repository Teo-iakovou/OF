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
"[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TalkingHeadResultDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
"use client";
;
;
const statusStyles = {
    queued: "bg-white/10 text-white/70 border border-white/15",
    processing: "bg-[#50C0F0]/15 text-[#9bdcf7] border border-[#50C0F0]/35",
    done: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
    failed: "bg-rose-500/15 text-rose-200 border border-rose-400/40"
};
function TalkingHeadResultDrawer({ open, onOpenChange, item }) {
    if (!open || !item) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[96]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Close drawer",
                className: "absolute inset-0 bg-black/55 backdrop-blur-sm",
                onClick: ()=>onOpenChange(false)
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-y-0 right-0 w-full max-w-2xl border-l border-[var(--hg-border)] bg-[var(--hg-surface)] shadow-2xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between border-b border-[var(--hg-border-2)] px-5 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-white",
                                            children: item.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1 flex items-center gap-2 text-xs text-[var(--hg-muted)]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item.createdAt ? new Date(item.createdAt).toLocaleString(undefined, {
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: false
                                                    }) : "Just now"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                    lineNumber: 53,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `inline-flex rounded-full px-2 py-0.5 font-medium ${statusStyles[item.status]}`,
                                                    children: item.status
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                    lineNumber: 64,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                            lineNumber: 52,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>onOpenChange(false),
                                    className: "rounded-md p-1.5 text-[var(--hg-muted)] hover:text-white",
                                    "aria-label": "Close",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto px-5 py-5",
                            children: [
                                item.status === "done" && item.videoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "overflow-hidden rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                controls: true,
                                                src: item.videoUrl,
                                                className: "w-full bg-black"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                lineNumber: 83,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: item.videoUrl,
                                                    download: true,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "inline-flex h-10 items-center gap-2 rounded-xl bg-[#50C0F0] px-4 text-sm font-semibold text-[#04131d] hover:opacity-90",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                            lineNumber: 93,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Download"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: item.videoUrl,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 text-sm text-[var(--hg-muted)] hover:text-white",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                            lineNumber: 102,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Open"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                            lineNumber: 85,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this) : null,
                                item.status === "queued" || item.status === "processing" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-white",
                                            children: "Your video is being generated."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1 text-xs text-[var(--hg-muted)]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        "Stage: ",
                                                        item.stage || "processing"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        "Progress: ",
                                                        typeof item.progress === "number" ? `${item.progress.toFixed(0)}%` : "—"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                            lineNumber: 112,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-2 w-full overflow-hidden rounded-full bg-white/10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-full rounded-full bg-[#50C0F0] transition-all",
                                                style: {
                                                    width: `${Math.max(8, Math.min(100, item.progress ?? 12))}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                lineNumber: 117,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                            lineNumber: 116,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this) : null,
                                item.status === "failed" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Video generation failed. Please try again."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                            lineNumber: 127,
                                            columnNumber: 17
                                        }, this),
                                        item.supportId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Support ID: ",
                                                        item.supportId
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                    lineNumber: 130,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>navigator.clipboard.writeText(item.supportId || ""),
                                                    className: "inline-flex items-center gap-1 rounded border border-rose-200/40 px-2 py-1 text-[11px] hover:border-rose-100",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                            className: "h-3.5 w-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                            lineNumber: 136,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Copy"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                            lineNumber: 129,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                                    lineNumber: 126,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c = TalkingHeadResultDrawer;
var _c;
__turbopack_context__.k.register(_c, "TalkingHeadResultDrawer");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$UpgradeRequiredBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/common/UpgradeRequiredBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$PlanContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/dashboard/PlanContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$quota$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/quota.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$talking$2d$head$2f$TalkingHeadResultDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx [app-client] (ecmascript)");
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
const HISTORY_USER_FALLBACK = "web-client";
const FIXED_OPTIONS = {
    preprocess: "full",
    resolution: "512p",
    enhancer: "gfpgan",
    backgroundEnhancer: "",
    expressionScale: 1,
    poseStyle: 0,
    batchSize: 2,
    still: false
};
const statusClass = {
    queued: "bg-white/10 text-white/70 border border-white/15",
    processing: "bg-[#50C0F0]/15 text-[#9bdcf7] border border-[#50C0F0]/35",
    done: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
    failed: "bg-rose-500/15 text-rose-200 border border-rose-400/40"
};
function toRecentStatus(state) {
    if (state === "failed") return "failed";
    if (state === "succeeded" || state === "completed") return "done";
    if (state === "queued" || state === "waiting") return "queued";
    return "processing";
}
function UploadTalkingHead() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])({
        required: true
    });
    const historyUserId = user?.id || HISTORY_USER_FALLBACK;
    const { data: planData, refresh: refreshPlan, hasActiveInstance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$PlanContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanInfo"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const packageInstanceId = planData?.packageInstanceId ?? null;
    const videosLimit = typeof planData?.videosLimit === "number" ? planData.videosLimit : planData?.sadtalkerVideosLimit ?? null;
    const videosUsed = typeof planData?.videosUsed === "number" ? planData.videosUsed : planData?.sadtalkerVideosUsed ?? null;
    const videosAddon = typeof planData?.addons?.sadtalkerVideos === "number" ? planData.addons.sadtalkerVideos : planData?.addonsVideos ?? 0;
    const videosRemaining = typeof planData?.videosRemaining === "number" ? Math.max(0, planData.videosRemaining) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$quota$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRemaining"])(videosLimit, videosAddon, videosUsed);
    const [imageFile, setImageFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [audioFile, setAudioFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [jobId, setJobId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [jobState, setJobState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [jobStage, setJobStage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [videoUrl, setVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [videoReadyAt, setVideoReadyAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errorCode, setErrorCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errorRequestId, setErrorRequestId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [upgradeInfo, setUpgradeInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [historyLoading, setHistoryLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [forceUpsell, setForceUpsell] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [drawerOpen, setDrawerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedRecent, setSelectedRecent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const pollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isOutOfCredits = forceUpsell || (typeof videosRemaining === "number" ? videosRemaining <= 0 : false);
    const hasActiveJob = jobState === "queued" || jobState === "running" || jobState === "active" || jobState === "waiting";
    const canSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UploadTalkingHead.useMemo[canSubmit]": ()=>{
            return !!imageFile && !!audioFile && !isSubmitting && !hasActiveJob;
        }
    }["UploadTalkingHead.useMemo[canSubmit]"], [
        imageFile,
        audioFile,
        isSubmitting,
        hasActiveJob
    ]);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UploadTalkingHead.useEffect": ()=>{
            const status = searchParams.get("status");
            const kind = searchParams.get("kind");
            if (status === "success" && kind === "addon") {
                refreshPlan(true);
                router.replace(pathname);
            }
        }
    }["UploadTalkingHead.useEffect"], [
        searchParams,
        refreshPlan,
        router,
        pathname
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
                        const nextState = data.state ?? null;
                        setJobState(nextState);
                        setJobStage(data.remoteState ?? null);
                        if (typeof data.progress === "number") setProgress(data.progress);
                        const isSuccessState = nextState === "succeeded" || nextState === "completed";
                        if (isSuccessState && data.result?.videoUrl) {
                            const nextVideoUrl = data.result.videoUrl;
                            setVideoUrl(nextVideoUrl);
                            const now = new Date().toISOString();
                            setVideoReadyAt(now);
                            if (pollRef.current) clearInterval(pollRef.current);
                            await loadHistory();
                            setSelectedRecent({
                                id: jobId,
                                title: "Avatar Video",
                                createdAt: now,
                                status: "done",
                                stage: data.remoteState ?? null,
                                progress: typeof data.progress === "number" ? data.progress : undefined,
                                videoUrl: nextVideoUrl,
                                supportId: null,
                                thumbnailUrl: null
                            });
                            setDrawerOpen(true);
                        } else if (nextState === "failed") {
                            setError(data.error?.message || "Video generation failed.");
                            if (typeof data?.requestId === "string") setErrorRequestId(data.requestId);
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
        jobId,
        loadHistory
    ]);
    const recentItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "UploadTalkingHead.useMemo[recentItems]": ()=>{
            const historyItems = history.map({
                "UploadTalkingHead.useMemo[recentItems].historyItems": (item)=>({
                        id: item.remoteJobId || item.jobId,
                        title: "Avatar Video",
                        createdAt: item.createdAt,
                        status: "done",
                        videoUrl: item.videoUrl,
                        stage: null,
                        progress: undefined,
                        supportId: null,
                        thumbnailUrl: item.options?.thumbnailUrl || item.options?.source_image || item.options?.sourceImage || null
                    })
            }["UploadTalkingHead.useMemo[recentItems].historyItems"]);
            if (!jobId) return historyItems;
            const liveItem = {
                id: jobId,
                title: "Avatar Video",
                createdAt: videoReadyAt || new Date().toISOString(),
                status: toRecentStatus(jobState),
                videoUrl,
                stage: jobStage,
                progress,
                supportId: errorRequestId,
                thumbnailUrl: null
            };
            const exists = historyItems.some({
                "UploadTalkingHead.useMemo[recentItems].exists": (item)=>item.id === liveItem.id
            }["UploadTalkingHead.useMemo[recentItems].exists"]);
            return exists ? historyItems : [
                liveItem,
                ...historyItems
            ];
        }
    }["UploadTalkingHead.useMemo[recentItems]"], [
        history,
        jobId,
        jobState,
        videoUrl,
        jobStage,
        progress,
        errorRequestId,
        videoReadyAt
    ]);
    async function handleSubmit(e) {
        e.preventDefault();
        if (isOutOfCredits) return;
        setError(null);
        setErrorCode(null);
        setErrorRequestId(null);
        setForceUpsell(false);
        setUpgradeInfo(null);
        setVideoUrl(null);
        setVideoReadyAt(null);
        setJobState(null);
        setProgress(undefined);
        setJobStage(null);
        if (!imageFile) {
            setError("Please choose a face photo (PNG/JPG).");
            return;
        }
        if (!audioFile) {
            setError("Please choose a voice audio file (MP3/WAV).");
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("source_image", imageFile);
            formData.append("driven_audio", audioFile);
            formData.append("preprocess", FIXED_OPTIONS.preprocess);
            formData.append("resolution", FIXED_OPTIONS.resolution);
            formData.append("expression_scale", FIXED_OPTIONS.expressionScale.toString());
            formData.append("pose_style", FIXED_OPTIONS.poseStyle.toString());
            formData.append("batch_size", FIXED_OPTIONS.batchSize.toString());
            formData.append("still", FIXED_OPTIONS.still ? "true" : "false");
            if (FIXED_OPTIONS.enhancer) formData.append("enhancer", FIXED_OPTIONS.enhancer);
            if (FIXED_OPTIONS.backgroundEnhancer) {
                formData.append("background_enhancer", FIXED_OPTIONS.backgroundEnhancer);
            }
            formData.append("userId", historyUserId);
            const res = await fetch("/api/sadtalker/create", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (!res.ok) {
                const codeRaw = typeof data?.errorCode === "string" ? data.errorCode : typeof data?.code === "string" ? data.code : "";
                if (res.status === 403 && data?.errorCode === "SADTALKER_NO_CREDITS") {
                    setError("You're out of video credits.");
                    setErrorCode("SADTALKER_NO_CREDITS");
                    setErrorRequestId(typeof data?.requestId === "string" ? data.requestId : null);
                    setForceUpsell(true);
                    refreshPlan(true);
                    return;
                }
                if (codeRaw === "ACTIVE_INSTANCE_REQUIRED" || codeRaw === "FACE_ENROLLMENT_REQUIRED" || codeRaw === "FACE_REQUIRED_FOR_ENROLLMENT" || codeRaw === "MULTIPLE_FACES_NOT_ALLOWED" || codeRaw === "FACE_MISMATCH") {
                    const mappedMessage = codeRaw === "ACTIVE_INSTANCE_REQUIRED" ? "No active package instance. Please select or purchase a package to continue." : codeRaw === "FACE_ENROLLMENT_REQUIRED" ? "Please enroll your profile face to continue." : codeRaw === "FACE_REQUIRED_FOR_ENROLLMENT" ? "No face detected. Upload a clear photo with one visible face." : codeRaw === "MULTIPLE_FACES_NOT_ALLOWED" ? "Multiple faces detected. Upload an image with only one face." : "Face verification failed. This photo does not match your enrolled face.";
                    setError(mappedMessage);
                    setErrorCode(codeRaw);
                    setErrorRequestId(typeof data?.requestId === "string" ? data.requestId : null);
                    return;
                }
                if (data?.code === "UPGRADE_REQUIRED") {
                    setError(data?.error || "Upgrade required");
                    setErrorCode(typeof data?.code === "string" ? data.code : null);
                    setErrorRequestId(typeof data?.requestId === "string" ? data.requestId : null);
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
                throw new Error(data?.error || "Failed to start video generation");
            }
            setJobId(data.jobId);
            setJobState("queued");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to start video generation");
            setErrorCode(null);
            setErrorRequestId(null);
            setUpgradeInfo(null);
        } finally{
            setIsSubmitting(false);
        }
    }
    if (!hasActiveInstance) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8 pb-20",
        children: [
            isOutOfCredits ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-2xl hg-surface p-5 text-white space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold",
                                children: "You’re out of video credits"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 380,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm hg-muted",
                                children: "Buy more to continue generating videos."
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 381,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 379,
                        columnNumber: 11
                    }, this),
                    error === "You're out of video credits." ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-md hg-surface-soft px-3 py-2 text-xs hg-muted",
                        children: [
                            error,
                            errorRequestId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1",
                                children: [
                                    "Support ID: ",
                                    errorRequestId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 386,
                                columnNumber: 33
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 384,
                        columnNumber: 13
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            {
                                label: "Buy 5",
                                pack: "pack_5"
                            },
                            {
                                label: "Buy 15",
                                pack: "pack_15"
                            },
                            {
                                label: "Buy 30",
                                pack: "pack_30",
                                badge: "Best value"
                            }
                        ].map((pack)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: async ()=>{
                                    if (!packageInstanceId) return;
                                    try {
                                        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAddonCheckoutSession"])({
                                            addonType: "sadtalkerVideos",
                                            addonPack: pack.pack,
                                            packageInstanceId
                                        });
                                        if (res?.url) window.location.href = res.url;
                                    } catch (err) {
                                        const message = err instanceof Error ? err.message : "Failed to start checkout";
                                        setError(message);
                                    }
                                },
                                disabled: !packageInstanceId,
                                className: "rounded-full border border-[var(--hg-border)] px-4 py-2 text-xs font-semibold hg-muted hover:border-[var(--hg-accent)] hover:text-[var(--hg-accent)] disabled:opacity-50",
                                children: [
                                    pack.label,
                                    pack.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-2 rounded-full border border-[var(--hg-border)] px-2 py-0.5 text-[10px] uppercase tracking-wide hg-muted-2",
                                        children: pack.badge
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 417,
                                        columnNumber: 19
                                    }, this) : null
                                ]
                            }, pack.pack, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 395,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 389,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                lineNumber: 378,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto w-full max-w-3xl rounded-2xl hg-surface p-5 md:p-6 text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-4 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm hg-muted",
                                                children: "Face photo (PNG/JPG)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 431,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "image/png,image/jpeg",
                                                onChange: (e)=>setImageFile(e.target.files?.[0] ?? null),
                                                className: "block w-full text-sm hg-muted file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--hg-accent)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#04131d] hover:file:opacity-90"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 432,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 430,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm hg-muted",
                                                children: "Driven audio (MP3/WAV)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 440,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "audio/mpeg,audio/wav",
                                                onChange: (e)=>setAudioFile(e.target.files?.[0] ?? null),
                                                className: "block w-full text-sm hg-muted file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--hg-accent)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#04131d] hover:file:opacity-90"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 441,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 439,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 429,
                                columnNumber: 11
                            }, this),
                            jobId || isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-2 text-xs text-[var(--hg-muted)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Status: ",
                                                    jobState || (isSubmitting ? "submitting" : "idle")
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 453,
                                                columnNumber: 17
                                            }, this),
                                            typeof progress === "number" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    progress.toFixed(0),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 454,
                                                columnNumber: 49
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 452,
                                        columnNumber: 15
                                    }, this),
                                    jobStage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1",
                                        children: [
                                            "Stage: ",
                                            jobStage
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 456,
                                        columnNumber: 27
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 451,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: !canSubmit || isOutOfCredits,
                                        className: `inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${canSubmit && !isOutOfCredits ? "bg-[var(--hg-accent)] text-[#04131d] hover:opacity-90" : "bg-[var(--hg-surface-2)] text-[var(--hg-muted-2)] cursor-not-allowed"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 470,
                                                columnNumber: 15
                                            }, this),
                                            isSubmitting ? "Generating…" : "Generate"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 461,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setImageFile(null);
                                            setAudioFile(null);
                                            setError(null);
                                            setErrorCode(null);
                                            setErrorRequestId(null);
                                        },
                                        className: "inline-flex h-10 items-center justify-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 text-sm text-[var(--hg-muted)] hover:text-white",
                                        children: "Reset"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 473,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 460,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 428,
                        columnNumber: 9
                    }, this),
                    error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 space-y-3 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 491,
                                columnNumber: 13
                            }, this),
                            errorRequestId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Support ID: ",
                                            errorRequestId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 494,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>navigator.clipboard.writeText(errorRequestId),
                                        className: "inline-flex items-center gap-1 rounded border border-rose-200/40 px-2 py-1 text-[11px] hover:border-rose-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 500,
                                                columnNumber: 19
                                            }, this),
                                            "Copy"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 495,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 493,
                                columnNumber: 15
                            }, this) : null,
                            errorCode === "FACE_ENROLLMENT_REQUIRED" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    const next = new URLSearchParams(searchParams.toString());
                                    next.set("enroll", "1");
                                    const q = next.toString();
                                    router.push(q ? `${pathname}?${q}` : pathname);
                                },
                                className: "inline-flex h-9 items-center justify-center rounded-lg bg-[var(--hg-accent)] px-3 text-xs font-semibold text-[#04131d] hover:opacity-90",
                                children: "Enroll face"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 506,
                                columnNumber: 15
                            }, this) : null,
                            errorCode === "ACTIVE_INSTANCE_REQUIRED" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    try {
                                        window.dispatchEvent(new Event("dashboard:open-packages"));
                                    } catch  {}
                                    router.push("/#packages");
                                },
                                className: "inline-flex h-9 items-center justify-center rounded-lg bg-[var(--hg-accent)] px-3 text-xs font-semibold text-[#04131d] hover:opacity-90",
                                children: "View packages"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 520,
                                columnNumber: 15
                            }, this) : null,
                            upgradeInfo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$UpgradeRequiredBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                code: upgradeInfo.code,
                                error: upgradeInfo.error,
                                feature: upgradeInfo.feature,
                                plan: upgradeInfo.plan,
                                remaining: upgradeInfo.remaining,
                                limit: upgradeInfo.limit
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 534,
                                columnNumber: 15
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 490,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                lineNumber: 427,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold text-white",
                            children: "Recent"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                            lineNumber: 549,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 548,
                        columnNumber: 9
                    }, this),
                    historyLoading && recentItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 overflow-hidden",
                        children: [
                            0,
                            1,
                            2
                        ].map((idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-48 w-64 shrink-0 animate-pulse rounded-2xl bg-white/5"
                            }, idx, false, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 555,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 553,
                        columnNumber: 11
                    }, this) : null,
                    !historyLoading && recentItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-4 text-sm text-[var(--hg-muted)]",
                        children: "No videos yet. Generate your first avatar video."
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 561,
                        columnNumber: 11
                    }, this) : null,
                    recentItems.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2",
                        children: recentItems.map((item)=>{
                            const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            }) : "Just now";
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>{
                                    setSelectedRecent(item);
                                    setDrawerOpen(true);
                                },
                                className: "group w-[240px] shrink-0 snap-start rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-3 text-left transition hover:border-[var(--hg-accent)]/50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative h-28 overflow-hidden rounded-xl border border-[var(--hg-border-2)] bg-black/25",
                                        children: item.thumbnailUrl ? // eslint-disable-next-line @next/next/no-img-element
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: item.thumbnailUrl,
                                            alt: "Video source preview",
                                            className: "h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]",
                                            loading: "lazy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                            lineNumber: 592,
                                            columnNumber: 23
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex h-full w-full items-center justify-center text-xs text-[var(--hg-muted)]",
                                            children: "No preview"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                            lineNumber: 599,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 589,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-white",
                                                children: "Avatar Video"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 605,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[var(--hg-muted)]",
                                                children: createdAt
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 606,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass[item.status]}`,
                                                children: item.status
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                                lineNumber: 607,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                        lineNumber: 604,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, item.id, true, {
                                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                                lineNumber: 580,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                        lineNumber: 567,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                lineNumber: 547,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$talking$2d$head$2f$TalkingHeadResultDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: drawerOpen,
                onOpenChange: setDrawerOpen,
                item: selectedRecent
            }, void 0, false, {
                fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
                lineNumber: 618,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/render/UploadTalkingHead.tsx",
        lineNumber: 376,
        columnNumber: 5
    }, this);
}
_s(UploadTalkingHead, "qacIkZca0TEsZQOBliv4GUlDox4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$PlanContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlanInfo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = UploadTalkingHead;
var _c;
__turbopack_context__.k.register(_c, "UploadTalkingHead");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/[locale]/dashboard/talking-head/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
        className: "relative min-h-screen text-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto w-full max-w-5xl px-4 pb-16 pt-12 md:px-8 md:pt-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mx-auto max-w-3xl text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-semibold tracking-tight md:text-4xl",
                            children: "AI Video Avatar"
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/talking-head/page.tsx",
                            lineNumber: 10,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-[var(--hg-muted)]",
                            children: "Upload a face photo + voice audio and we'll generate a talking video."
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/talking-head/page.tsx",
                            lineNumber: 11,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/dashboard/talking-head/page.tsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "mt-8 md:mt-10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$render$2f$UploadTalkingHead$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/[locale]/dashboard/talking-head/page.tsx",
                        lineNumber: 17,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[locale]/dashboard/talking-head/page.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/[locale]/dashboard/talking-head/page.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/[locale]/dashboard/talking-head/page.tsx",
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
"[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Copy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "14",
            height: "14",
            x: "8",
            y: "8",
            rx: "2",
            ry: "2",
            key: "17jyea"
        }
    ],
    [
        "path",
        {
            d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
            key: "zix9uf"
        }
    ]
];
const Copy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("copy", __iconNode);
;
 //# sourceMappingURL=copy.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Copy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript)");
}),
"[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clsx",
    ()=>clsx,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
        var o = e.length;
        for(t = 0; t < o; t++)e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else for(f in e)e[f] && (n && (n += " "), n += f);
    return n;
}
function clsx() {
    for(var e, t, f = 0, n = "", o = arguments.length; f < o; f++)(e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
}
const __TURBOPACK__default__export__ = clsx;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Download
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 15V3",
            key: "m9g1x1"
        }
    ],
    [
        "path",
        {
            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
            key: "ih7n3h"
        }
    ],
    [
        "path",
        {
            d: "m7 10 5 5 5-5",
            key: "brsn70"
        }
    ]
];
const Download = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("download", __iconNode);
;
 //# sourceMappingURL=download.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Download",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ExternalLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M15 3h6v6",
            key: "1q9fwt"
        }
    ],
    [
        "path",
        {
            d: "M10 14 21 3",
            key: "gplh6r"
        }
    ],
    [
        "path",
        {
            d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
            key: "a6xqqp"
        }
    ]
];
const ExternalLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("external-link", __iconNode);
;
 //# sourceMappingURL=external-link.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExternalLink",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_8ad96d00._.js.map