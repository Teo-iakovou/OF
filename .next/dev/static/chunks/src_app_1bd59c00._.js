(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/components/dashboard/ActivePackageCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ActivePackageCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const planLabel = (planKey)=>{
    const key = (planKey || "").toLowerCase();
    if (key === "pro") return "Pro";
    if (key === "ultimate") return "Ultimate";
    if (key === "lite") return "Lite";
    return "—";
};
function ActivePackageCard({ planKey, packageInstanceId, status = "active", createdAt, onOpenSwitcher, profileLabel }) {
    _s();
    const [profileName, setProfileName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const created = createdAt instanceof Date ? createdAt : createdAt ? new Date(createdAt) : null;
    const isInteractive = Boolean(onOpenSwitcher);
    const displayProfile = profileName || profileLabel;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ActivePackageCard.useEffect": ()=>{
            if (!packageInstanceId) {
                setProfileName("");
                return;
            }
            try {
                const stored = localStorage.getItem(`profileName:${packageInstanceId}`) || "";
                setProfileName(stored);
            } catch  {}
        }
    }["ActivePackageCard.useEffect"], [
        packageInstanceId
    ]);
    if (!packageInstanceId) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20${isInteractive ? " cursor-pointer" : ""}`,
        ...isInteractive ? {
            role: "button",
            tabIndex: 0,
            onClick: ()=>onOpenSwitcher?.(),
            onKeyDown: (event)=>{
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenSwitcher?.();
                }
            }
        } : {},
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-wide hg-muted",
                                children: "Active package"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "mt-2 text-xl font-semibold text-white",
                                children: planLabel(planKey)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            displayProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm hg-muted",
                                children: displayProfile
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200",
                                children: status === "active" ? "Active" : status || "Active"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (event)=>{
                                    event.stopPropagation();
                                    onOpenSwitcher?.();
                                },
                                className: "inline-flex h-8 items-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 text-xs font-semibold text-[var(--hg-text)] hover:border-[var(--hg-accent)]/40 hover:text-white",
                                children: "Switch profile"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 space-y-2 text-sm hg-muted",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-wide hg-muted",
                                children: "Package instance ID"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[var(--hg-text)]",
                                children: packageInstanceId || "—"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-wide hg-muted",
                                children: "Created"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[var(--hg-text)]",
                                children: created ? created.toLocaleString() : "—"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/ActivePackageCard.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(ActivePackageCard, "0zwI4/VAgx4CCY7ekMFYy5H4+NA=");
_c = ActivePackageCard;
var _c;
__turbopack_context__.k.register(_c, "ActivePackageCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/dashboard/DashboardOnboarding.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardOnboarding
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const isExhausted = (remaining)=>typeof remaining === "number" ? remaining <= 0 : false;
const actionLinkBase = "inline-flex items-center gap-2 text-sm font-medium text-cyan-700 hover:text-cyan-800";
const disabledLinkBase = "inline-flex items-center gap-2 text-sm text-gray-400";
function ActionLink({ href, disabled, children }) {
    if (disabled) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: disabledLinkBase,
            "aria-disabled": "true",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: actionLinkBase,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_c = ActionLink;
function DashboardOnboarding({ isNewUser, packageInstanceId, uploadsRemaining, chatRemaining, videoRemaining }) {
    _s();
    const storageKey = `dashboard_onboarding_dismissed:${packageInstanceId || "unknown"}`;
    const [dismissed, setDismissed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardOnboarding.useEffect": ()=>{
            if (!isNewUser) return;
            try {
                const raw = localStorage.getItem(storageKey);
                if (raw === "1") setDismissed(true);
            } catch  {}
        }
    }["DashboardOnboarding.useEffect"], [
        isNewUser,
        storageKey
    ]);
    const steps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardOnboarding.useMemo[steps]": ()=>[
                {
                    key: "upload",
                    label: "Upload your first image",
                    href: "/dashboard/upload",
                    disabled: isExhausted(uploadsRemaining)
                },
                {
                    key: "history",
                    label: "Review your AI strategy",
                    href: "/dashboard/history",
                    disabled: false
                },
                {
                    key: "chat",
                    label: "Try AI Chat",
                    href: "/dashboard/ai-chat",
                    disabled: isExhausted(chatRemaining)
                },
                {
                    key: "video",
                    label: "Generate a video",
                    href: "/dashboard/talking-head",
                    disabled: isExhausted(videoRemaining)
                }
            ]
    }["DashboardOnboarding.useMemo[steps]"], [
        uploadsRemaining,
        chatRemaining,
        videoRemaining
    ]);
    const recommended = steps.find((step)=>!step.disabled)?.key || "upload";
    if (!isNewUser || dismissed) return null;
    const onDismiss = ()=>{
        try {
            localStorage.setItem(storageKey, "1");
        } catch  {}
        setDismissed(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-wide text-gray-500",
                                children: "Getting started"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "mt-2 text-xl font-semibold text-gray-900",
                                children: "Start with the basics"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onDismiss,
                        className: "rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:text-gray-700",
                        "aria-label": "Dismiss onboarding",
                        children: "X"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 space-y-3 text-sm text-gray-700",
                children: steps.map((step)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: step.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this),
                                    recommended === step.key ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-700",
                                        children: "Recommended"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                                        lineNumber: 137,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionLink, {
                                href: step.href,
                                disabled: step.disabled,
                                children: step.disabled ? "Quota exhausted" : "Go to step →"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this)
                        ]
                    }, step.key, true, {
                        fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/DashboardOnboarding.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
_s(DashboardOnboarding, "bUNPQHAWkbtChgrJcL+Cn778hzg=");
_c1 = DashboardOnboarding;
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionLink");
__turbopack_context__.k.register(_c1, "DashboardOnboarding");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/dashboard/LastUploadCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LastUploadCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const summaryFor = (result)=>{
    const niche = result.niche ? `Niche: ${result.niche}` : null;
    const platform = result.promotion?.recommendedPlatforms?.[0]?.platform;
    const platformLine = platform ? `Top platform: ${platform}` : null;
    return [
        niche,
        platformLine
    ].filter(Boolean).join(" · ");
};
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif)(?:$|[?#])/i;
const IMAGE_HINT_RE = /(image|thumbnail|thumb|photo|picture|avatar|preview|format=webp|format=jpeg|format=jpg|format=png)/i;
const isLikelyImageUrl = (value)=>{
    if (!value.startsWith("http")) return false;
    try {
        const parsed = new URL(value);
        const joined = `${parsed.pathname}${parsed.search}`.toLowerCase();
        return IMAGE_EXT_RE.test(joined) || IMAGE_HINT_RE.test(joined);
    } catch  {
        const lower = value.toLowerCase();
        return IMAGE_EXT_RE.test(lower) || IMAGE_HINT_RE.test(lower);
    }
};
const extractImageUrl = (result)=>{
    const meta = result?.meta;
    if (!meta || typeof meta !== "object") return null;
    const candidates = [
        meta.thumbnailUrl,
        meta.imageUrl,
        meta.assetUrl,
        meta.upload?.url,
        meta.image?.url,
        meta.r2?.publicUrl,
        meta.r2Url,
        meta.fileUrl
    ];
    for (const candidate of candidates){
        if (typeof candidate === "string" && isLikelyImageUrl(candidate)) {
            return candidate;
        }
    }
    return null;
};
function LastUploadCard({ packageInstanceId, result, loading }) {
    _s();
    const [internalResult, setInternalResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [internalLoading, setInternalLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageLoaded, setImageLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const shouldUseInternalFetch = typeof result === "undefined";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LastUploadCard.useEffect": ()=>{
            if (!shouldUseInternalFetch) return;
            let cancelled = false;
            if (!packageInstanceId) {
                setInternalResult(null);
                return;
            }
            setInternalLoading(true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLatestResultForPackageInstance"])(packageInstanceId).then({
                "LastUploadCard.useEffect": (res)=>{
                    if (!cancelled) setInternalResult(res);
                }
            }["LastUploadCard.useEffect"]).catch({
                "LastUploadCard.useEffect": ()=>{
                    if (!cancelled) setInternalResult(null);
                }
            }["LastUploadCard.useEffect"]).finally({
                "LastUploadCard.useEffect": ()=>{
                    if (!cancelled) setInternalLoading(false);
                }
            }["LastUploadCard.useEffect"]);
            return ({
                "LastUploadCard.useEffect": ()=>{
                    cancelled = true;
                }
            })["LastUploadCard.useEffect"];
        }
    }["LastUploadCard.useEffect"], [
        packageInstanceId,
        shouldUseInternalFetch
    ]);
    const effectiveResult = shouldUseInternalFetch ? internalResult : result ?? null;
    const effectiveLoading = shouldUseInternalFetch ? internalLoading : Boolean(loading);
    const createdAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LastUploadCard.useMemo[createdAt]": ()=>{
            if (!effectiveResult?.createdAt) return null;
            const d = new Date(effectiveResult.createdAt);
            return Number.isNaN(d.getTime()) ? null : d;
        }
    }["LastUploadCard.useMemo[createdAt]"], [
        effectiveResult?.createdAt
    ]);
    const previewUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LastUploadCard.useMemo[previewUrl]": ()=>extractImageUrl(effectiveResult)
    }["LastUploadCard.useMemo[previewUrl]"], [
        effectiveResult
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LastUploadCard.useEffect": ()=>{
            setImageLoaded(false);
        }
    }["LastUploadCard.useEffect"], [
        previewUrl
    ]);
    const renderContent = ()=>{
        if (effectiveLoading) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 w-36 animate-pulse rounded bg-white/10"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 h-4 w-full animate-pulse rounded bg-white/10"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 h-4 w-28 animate-pulse rounded bg-white/10"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true);
        }
        if (!effectiveResult) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm hg-muted",
                children: "No uploads yet. Upload your first image to see insights here."
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm hg-muted",
                    children: [
                        "Created ",
                        createdAt?.toLocaleString()
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-2 text-sm text-[var(--hg-text)]",
                    children: summaryFor(effectiveResult) || "AI insights ready."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                    lineNumber: 125,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/dashboard?settings=1&tab=history",
                    className: "mt-4 inline-flex text-sm font-medium text-[#50C0F0] hover:text-[#7ed2f5]",
                    children: "View Full Insight →"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-wide hg-muted",
                children: "Last activity"
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "mt-2 text-xl font-semibold text-white",
                children: "Last upload"
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex min-h-24 flex-col gap-4 sm:flex-row sm:items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--hg-border-2)] bg-[var(--hg-surface-2)]",
                        children: previewUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: previewUrl,
                                    alt: "Last upload preview",
                                    className: `h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`,
                                    loading: "lazy",
                                    decoding: "async",
                                    fetchPriority: "low",
                                    referrerPolicy: "no-referrer",
                                    onLoad: ()=>setImageLoaded(true),
                                    onError: ()=>setImageLoaded(true)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                                    lineNumber: 145,
                                    columnNumber: 15
                                }, this),
                                !imageLoaded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 animate-pulse bg-white/10"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                                    lineNumber: 158,
                                    columnNumber: 31
                                }, this) : null
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/echofy-removebg-preview.png",
                            alt: "Last upload preview",
                            fill: true,
                            sizes: "96px",
                            className: "object-contain p-3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                            lineNumber: 161,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: renderContent()
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/LastUploadCard.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_s(LastUploadCard, "ZslIo0/h6fhOGS1xt+5sz4vvGn4=");
_c = LastUploadCard;
var _c;
__turbopack_context__.k.register(_c, "LastUploadCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/dashboard/QuotaUsageCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuotaUsageCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const isUnlimited = (limit)=>limit === 0;
const formatQuota = (used, limit)=>{
    if (isUnlimited(limit)) return "Unlimited";
    if (typeof used !== "number" || typeof limit !== "number") return "—";
    return `${used} / ${limit}`;
};
const percentUsed = (used, limit)=>{
    if (typeof used !== "number" || typeof limit !== "number" || limit <= 0) return 0;
    return Math.min(100, Math.round(used / limit * 100));
};
const isLowRemaining = (used, limit)=>{
    if (typeof used !== "number" || typeof limit !== "number" || limit <= 0) return false;
    return used / limit >= 0.8;
};
const QuotaRow = ({ label, used, limit, hideBar = false })=>{
    const pct = percentUsed(used, limit);
    const low = isLowRemaining(used, limit);
    const barColor = low ? "bg-amber-400" : "bg-[var(--hg-accent)]";
    const textColor = low ? "text-amber-200" : "text-[var(--hg-text)]";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-[var(--hg-text)]",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `font-medium ${textColor}`,
                        children: formatQuota(used, limit)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            hideBar ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-2 rounded-full bg-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `h-2 rounded-full ${barColor}`,
                    style: {
                        width: `${pct}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                    lineNumber: 51,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = QuotaRow;
function QuotaUsageCard({ uploadsUsed, uploadLimit, chatUsed, chatLimit, videoUsed, videoLimit }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs uppercase tracking-wide hg-muted",
                            children: "Quota usage"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "mt-2 text-xl font-semibold text-white",
                            children: "Usage overview"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuotaRow, {
                        label: "Uploads",
                        used: uploadsUsed,
                        limit: uploadLimit
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuotaRow, {
                        label: "AI Chat",
                        used: chatUsed,
                        limit: chatLimit,
                        hideBar: chatLimit === 0
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuotaRow, {
                        label: "Videos",
                        used: videoUsed,
                        limit: videoLimit
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/QuotaUsageCard.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_c1 = QuotaUsageCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "QuotaRow");
__turbopack_context__.k.register(_c1, "QuotaUsageCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/dashboard/QuickActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuickActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const isExhausted = (remaining)=>typeof remaining === "number" ? remaining <= 0 : false;
const ActionButton = ({ href, onClick, label, primary = false, disabled = false, tooltip })=>{
    const base = "inline-flex h-10 items-center justify-center rounded-xl px-4 text-center text-sm font-medium transition";
    const enabledStyles = primary ? "bg-[#50C0F0] text-[#07131d] hover:opacity-90" : "bg-[var(--hg-surface-2)] text-[var(--hg-text)] border border-[var(--hg-border)] hover:border-[var(--hg-accent)]/40";
    const disabledStyles = "cursor-not-allowed border border-[var(--hg-border-2)] bg-[var(--hg-surface-2)] text-[var(--hg-muted-2)]";
    if (disabled) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `${base} ${disabledStyles}`,
            title: tooltip || "Unavailable",
            children: label
        }, void 0, false, {
            fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (onClick) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onClick,
            className: `${base} ${enabledStyles}`,
            children: label
        }, void 0, false, {
            fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href || "#",
        className: `${base} ${enabledStyles}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = ActionButton;
function QuickActions({ uploadsRemaining, chatRemaining }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const uploadDisabled = isExhausted(uploadsRemaining);
    const chatDisabled = isExhausted(chatRemaining);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-5 shadow-sm shadow-black/20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs uppercase tracking-wide hg-muted",
                children: "Quick actions"
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "mt-2 text-xl font-semibold text-white",
                children: "Jump in"
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 [&>*]:w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                        href: "/dashboard/upload",
                        label: "Upload Content",
                        primary: true,
                        disabled: uploadDisabled,
                        tooltip: "Upload limit reached"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                        href: "/dashboard/ai-chat",
                        label: "AI Chat",
                        disabled: chatDisabled,
                        tooltip: "Chat limit reached"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                        label: "AI Video Avatar",
                        onClick: ()=>{
                            if ("TURBOPACK compile-time truthy", 1) {
                                window.dispatchEvent(new Event("dashboard:close-settings"));
                            }
                            router.push("/dashboard/talking-head");
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/QuickActions.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(QuickActions, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = QuickActions;
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionButton");
__turbopack_context__.k.register(_c1, "QuickActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfileSwitcherModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const formatPlanLabel = (value)=>{
    if (!value) return "—";
    return value.charAt(0).toUpperCase() + value.slice(1);
};
const shortId = (value)=>{
    if (value.length <= 12) return value;
    return `${value.slice(0, 6)}…${value.slice(-4)}`;
};
const formatStatus = (value)=>{
    if (!value) return "Active";
    return value.charAt(0).toUpperCase() + value.slice(1);
};
const profileNameKey = (id)=>`profileName:${id}`;
const getProfileName = (id)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        return localStorage.getItem(profileNameKey(id)) || "";
    } catch  {
        return "";
    }
};
const setProfileName = (id, name)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        if (name) {
            localStorage.setItem(profileNameKey(id), name);
        } else {
            localStorage.removeItem(profileNameKey(id));
        }
    } catch  {}
};
function ProfileSwitcherModal({ open, instances, loading, activeInstanceId, selectingId, onClose, onSelect }) {
    _s();
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [draftName, setDraftName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [profileNames, setProfileNames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfileSwitcherModal.useEffect": ()=>{
            if (!open) return;
            const handleKeyDown = {
                "ProfileSwitcherModal.useEffect.handleKeyDown": (event)=>{
                    if (event.key === "Escape") onClose();
                }
            }["ProfileSwitcherModal.useEffect.handleKeyDown"];
            document.addEventListener("keydown", handleKeyDown);
            return ({
                "ProfileSwitcherModal.useEffect": ()=>{
                    document.removeEventListener("keydown", handleKeyDown);
                }
            })["ProfileSwitcherModal.useEffect"];
        }
    }["ProfileSwitcherModal.useEffect"], [
        onClose,
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfileSwitcherModal.useEffect": ()=>{
            if (!open) return;
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return ({
                "ProfileSwitcherModal.useEffect": ()=>{
                    document.body.style.overflow = prevOverflow;
                }
            })["ProfileSwitcherModal.useEffect"];
        }
    }["ProfileSwitcherModal.useEffect"], [
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfileSwitcherModal.useEffect": ()=>{
            if (!open) return;
            const next = {};
            instances.forEach({
                "ProfileSwitcherModal.useEffect": (instance)=>{
                    const name = getProfileName(instance.id);
                    if (name) next[instance.id] = name;
                }
            }["ProfileSwitcherModal.useEffect"]);
            setProfileNames(next);
        }
    }["ProfileSwitcherModal.useEffect"], [
        instances,
        open
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center px-4 py-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onClose,
                className: "absolute inset-0 bg-black/30 backdrop-blur-md",
                "aria-label": "Close profile switcher"
            }, void 0, false, {
                fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-[560px] max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-xl",
                onClick: (event)=>event.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-semibold text-gray-900",
                                        children: "Switch profile"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-gray-500",
                                        children: "Choose which profile is active."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                        lineNumber: 114,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onClose,
                                className: "rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:border-gray-300",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-[calc(80vh-140px)] overflow-y-auto px-6 py-4",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500",
                            children: "Loading profiles…"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                            lineNumber: 126,
                            columnNumber: 13
                        }, this) : instances.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600",
                                    children: "No active package instances found."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                    lineNumber: 129,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/#packages",
                                    className: "inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:border-gray-300",
                                    children: "Go to packages"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                    lineNumber: 130,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: instances.map((instance, index)=>{
                                const isActive = instance.id === activeInstanceId;
                                const createdAt = instance.createdAt ? new Date(instance.createdAt).toLocaleDateString() : "—";
                                const profileLabel = `Profile ${String.fromCharCode(65 + index)}`;
                                const customName = profileNames[instance.id] || "";
                                const displayName = customName || profileLabel;
                                const showEditor = editingId === instance.id;
                                const statusLabel = isActive ? "Active" : "Inactive";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl border border-gray-200 bg-white p-4 shadow-sm opacity-0 translate-y-1 transition-all duration-200",
                                    style: {
                                        transitionDelay: `${index * 60}ms`,
                                        opacity: 1,
                                        transform: "translateY(0)"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-medium text-gray-900",
                                                        children: displayName
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                        lineNumber: 161,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            formatPlanLabel(instance.planKey || null),
                                                            " · ",
                                                            profileLabel
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            "Created ",
                                                            createdAt
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            "ID ",
                                                            shortId(instance.id)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 25
                                                    }, this),
                                                    showEditor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: draftName,
                                                        onChange: (event)=>setDraftName(event.target.value),
                                                        onKeyDown: (event)=>{
                                                            if (event.key === "Enter") {
                                                                const next = draftName.trim();
                                                                setProfileName(instance.id, next);
                                                                setProfileNames((prev)=>({
                                                                        ...prev,
                                                                        [instance.id]: next
                                                                    }));
                                                                setEditingId(null);
                                                            }
                                                            if (event.key === "Escape") {
                                                                setEditingId(null);
                                                                setDraftName("");
                                                            }
                                                        },
                                                        onBlur: ()=>{
                                                            const next = draftName.trim();
                                                            setProfileName(instance.id, next);
                                                            setProfileNames((prev)=>({
                                                                    ...prev,
                                                                    [instance.id]: next
                                                                }));
                                                            setEditingId(null);
                                                        },
                                                        className: "mt-2 w-full rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700",
                                                        placeholder: "Rename profile",
                                                        autoFocus: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            setDraftName(displayName);
                                                            setEditingId(instance.id);
                                                        },
                                                        className: "mt-2 inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600 hover:border-gray-300",
                                                        children: "Rename"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                        lineNumber: 194,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                lineNumber: 160,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col items-end gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `rounded-full border px-3 py-1 text-xs font-medium ${isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-100 text-gray-600"}`,
                                                        children: statusLabel
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        disabled: isActive || selectingId === instance.id,
                                                        onClick: ()=>onSelect(instance.id),
                                                        className: "rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:border-gray-300 disabled:opacity-60",
                                                        children: isActive ? "Active" : "Set active"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                                lineNumber: 206,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                        lineNumber: 159,
                                        columnNumber: 21
                                    }, this)
                                }, instance.id, false, {
                                    fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                                    lineNumber: 150,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                            lineNumber: 138,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(ProfileSwitcherModal, "Ia9N2fA9SheTDU9zdtobLp6Bj8k=");
_c = ProfileSwitcherModal;
var _c;
__turbopack_context__.k.register(_c, "ProfileSwitcherModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/dashboard/useOverviewModel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOverviewModel",
    ()=>useOverviewModel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const MIN_SKELETON_MS = 300;
const INITIAL_STATE = {
    ready: false,
    coreLoading: true,
    coreError: null,
    planData: null,
    hasActiveInstance: false,
    isMissingActiveInstance: false,
    isNewUser: false,
    instances: [],
    instancesLoading: false,
    instancesError: null,
    latestResult: null,
    latestLoading: false
};
function useOverviewModel({ enabled }) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INITIAL_STATE);
    const requestSeq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const instancesSeq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const safeCheckUserPackage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOverviewModel.useCallback[safeCheckUserPackage]": async (force = false)=>{
            const fn = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkUserPackage"];
            if (!force) {
                return await fn();
            }
            try {
                return await fn({
                    force: true
                });
            } catch  {
                return await fn();
            }
        }
    }["useOverviewModel.useCallback[safeCheckUserPackage]"], []);
    const loadInstances = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOverviewModel.useCallback[loadInstances]": async ()=>{
            if (!enabled) return;
            const seq = ++instancesSeq.current;
            setState({
                "useOverviewModel.useCallback[loadInstances]": (prev)=>({
                        ...prev,
                        instancesLoading: true,
                        instancesError: null
                    })
            }["useOverviewModel.useCallback[loadInstances]"]);
            try {
                const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchActivePackageInstances"])();
                if (seq !== instancesSeq.current) return;
                setState({
                    "useOverviewModel.useCallback[loadInstances]": (prev)=>({
                            ...prev,
                            instances: list,
                            instancesLoading: false,
                            instancesError: null
                        })
                }["useOverviewModel.useCallback[loadInstances]"]);
            } catch (err) {
                if (seq !== instancesSeq.current) return;
                const message = err instanceof Error ? err.message : "Failed to load packages";
                setState({
                    "useOverviewModel.useCallback[loadInstances]": (prev)=>({
                            ...prev,
                            instancesLoading: false,
                            instancesError: message
                        })
                }["useOverviewModel.useCallback[loadInstances]"]);
            }
        }
    }["useOverviewModel.useCallback[loadInstances]"], [
        enabled
    ]);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOverviewModel.useCallback[refresh]": async (force = false)=>{
            if (!enabled) {
                return;
            }
            const seq = ++requestSeq.current;
            const startedAt = Date.now();
            setState({
                "useOverviewModel.useCallback[refresh]": (prev)=>({
                        ...prev,
                        ready: false,
                        coreLoading: true,
                        latestResult: null,
                        latestLoading: false,
                        coreError: null
                    })
            }["useOverviewModel.useCallback[refresh]"]);
            let planData = null;
            let coreError = null;
            try {
                planData = await safeCheckUserPackage(force);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load dashboard overview";
                coreError = message;
            }
            if (seq !== requestSeq.current) return;
            const hasActiveInstance = Boolean(planData?.hasAccess && planData?.packageInstanceId);
            const isMissingActiveInstance = !hasActiveInstance;
            const uploadsUsed = typeof planData?.uploadsUsed === "number" ? planData.uploadsUsed : null;
            const createdAt = planData?.packageInstanceCreatedAt ? Date.parse(planData.packageInstanceCreatedAt) : NaN;
            const now = Date.now();
            const within24h = Number.isFinite(createdAt) && createdAt <= now ? now - createdAt < 24 * 60 * 60 * 1000 : false;
            const isNewUser = uploadsUsed === 0 || uploadsUsed === null && within24h;
            const elapsed = Date.now() - startedAt;
            const wait = Math.max(0, MIN_SKELETON_MS - elapsed);
            if (wait > 0) {
                await new Promise({
                    "useOverviewModel.useCallback[refresh]": (resolve)=>setTimeout(resolve, wait)
                }["useOverviewModel.useCallback[refresh]"]);
            }
            if (seq !== requestSeq.current) return;
            setState({
                "useOverviewModel.useCallback[refresh]": (prev)=>({
                        ...prev,
                        ready: true,
                        coreLoading: false,
                        coreError,
                        planData,
                        hasActiveInstance,
                        isMissingActiveInstance,
                        isNewUser,
                        instancesError: prev.instancesError,
                        latestResult: null,
                        latestLoading: hasActiveInstance && !coreError
                    })
            }["useOverviewModel.useCallback[refresh]"]);
            if (coreError || !hasActiveInstance || !planData?.packageInstanceId) return;
            try {
                const latest = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLatestResultForPackageInstance"])(planData.packageInstanceId);
                if (seq !== requestSeq.current) return;
                setState({
                    "useOverviewModel.useCallback[refresh]": (prev)=>({
                            ...prev,
                            latestResult: latest,
                            latestLoading: false
                        })
                }["useOverviewModel.useCallback[refresh]"]);
            } catch  {
                if (seq !== requestSeq.current) return;
                setState({
                    "useOverviewModel.useCallback[refresh]": (prev)=>({
                            ...prev,
                            latestResult: null,
                            latestLoading: false
                        })
                }["useOverviewModel.useCallback[refresh]"]);
            }
        }
    }["useOverviewModel.useCallback[refresh]"], [
        enabled,
        safeCheckUserPackage
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOverviewModel.useEffect": ()=>{
            void refresh(false);
        }
    }["useOverviewModel.useEffect"], [
        refresh
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOverviewModel.useEffect": ()=>{
            if (!enabled) {
                requestSeq.current += 1;
                instancesSeq.current += 1;
            }
        }
    }["useOverviewModel.useEffect"], [
        enabled
    ]);
    return {
        ...state,
        refresh,
        loadInstances
    };
}
_s(useOverviewModel, "TjhIDrN1YnEHr5Z0s7h3k5MYutA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/[locale]/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$ActivePackageCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/ActivePackageCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$DashboardOnboarding$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/DashboardOnboarding.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$LastUploadCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/LastUploadCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$QuotaUsageCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/QuotaUsageCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$QuickActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/QuickActions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$ProfileSwitcherModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/ProfileSwitcherModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/cart/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$quota$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/quota.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/urls.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$useOverviewModel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/dashboard/useOverviewModel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/navigation.ts [app-client] (ecmascript)");
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
;
;
function OverviewSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mx-auto w-full max-w-6xl px-4 pt-12 md:px-8 md:pt-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs uppercase tracking-[0.14em] hg-muted-2",
                            children: "Overview"
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl md:text-4xl font-semibold tracking-tight",
                            children: "Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm hg-muted",
                            children: "See what you can do now and jump into your next action fast."
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "pb-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-6xl space-y-6 px-4 pt-8 md:space-y-8 md:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "h-28 animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]"
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "h-[280px] animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "h-[280px] animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "h-[220px] animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 35,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "h-[220px] animate-pulse rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = OverviewSkeleton;
function DashboardPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { clearCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])({
        required: true,
        redirectTo: "/"
    });
    const didClearCartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const { ready, coreLoading, coreError, planData, isNewUser, hasActiveInstance, isMissingActiveInstance, instances, instancesLoading, instancesError: modelInstancesError, latestResult, latestLoading, refresh, loadInstances } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$useOverviewModel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOverviewModel"])({
        enabled: !loading && !!user
    });
    const [instancesError, setInstancesError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectingId, setSelectingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [optimisticActiveId, setOptimisticActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [switcherOpen, setSwitcherOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const planKey = planData?.package || null;
    const packageInstanceId = planData?.packageInstanceId ?? null;
    const activeId = optimisticActiveId ?? packageInstanceId;
    const activeIndex = instances.findIndex((instance)=>instance.id === activeId);
    const activeProfileLabel = activeIndex >= 0 ? `Profile ${String.fromCharCode(65 + activeIndex)}` : null;
    const uploadsLimitRaw = typeof planData?.uploadLimit === "number" ? planData.uploadLimit : null;
    const uploadsUsedRaw = typeof planData?.uploadsUsed === "number" ? planData.uploadsUsed : 0;
    const addonsUploadsRaw = typeof planData?.addonsUploads === "number" ? planData.addonsUploads : 0;
    const uploadsLimit = uploadsLimitRaw === 0 ? null : uploadsLimitRaw;
    const uploadsUsed = Math.max(0, uploadsUsedRaw);
    const uploadsRemaining = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$quota$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRemaining"])(uploadsLimitRaw, addonsUploadsRaw, uploadsUsed);
    const chatRemainingRaw = typeof planData?.chatRemaining === "number" ? Math.max(0, planData.chatRemaining || 0) : null;
    const chatLimitRaw = typeof planData?.chatMonthlyLimit === "number" ? Math.max(0, planData.chatMonthlyLimit || 0) : null;
    const chatUsedRaw = typeof planData?.chatUsedThisCycle === "number" ? Math.max(0, planData.chatUsedThisCycle || 0) : null;
    const chatLimit = chatLimitRaw === 0 ? null : chatLimitRaw;
    const chatUsed = typeof chatUsedRaw === "number" ? chatUsedRaw : null;
    const chatRemaining = chatRemainingRaw ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$quota$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRemaining"])(chatLimitRaw, 0, chatUsed);
    const videoRemainingRaw = typeof planData?.sadtalkerVideosRemaining === "number" ? Math.max(0, planData.sadtalkerVideosRemaining || 0) : null;
    const videoLimitRaw = typeof planData?.sadtalkerVideoLimit === "number" ? Math.max(0, planData.sadtalkerVideoLimit || 0) : null;
    const videoUsedRaw = typeof planData?.sadtalkerVideosUsed === "number" ? Math.max(0, planData.sadtalkerVideosUsed || 0) : null;
    const videoLimit = videoLimitRaw === 0 ? null : videoLimitRaw;
    const videoUsed = typeof videoUsedRaw === "number" ? videoUsedRaw : null;
    const videoRemaining = videoRemainingRaw ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$quota$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRemaining"])(videoLimitRaw, 0, videoUsed);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            setInstancesError(modelInstancesError);
        }
    }["DashboardPage.useEffect"], [
        modelInstancesError
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            const status = searchParams.get("status");
            if (status !== "success" || didClearCartRef.current) return;
            didClearCartRef.current = true;
            clearCart();
            router.replace("/dashboard");
        }
    }["DashboardPage.useEffect"], [
        searchParams,
        clearCart,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            if (!switcherOpen) return;
            void loadInstances();
        }
    }["DashboardPage.useEffect"], [
        switcherOpen,
        loadInstances
    ]);
    const handleSelectInstance = async (instanceId)=>{
        const previousId = optimisticActiveId ?? packageInstanceId;
        setOptimisticActiveId(instanceId);
        setSelectingId(instanceId);
        setInstancesError(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectPackageInstance"])(instanceId);
            if ("TURBOPACK compile-time truthy", 1) {
                window.dispatchEvent(new Event("ai-auth-changed"));
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearApiCaches"])();
            await refresh(true);
            setOptimisticActiveId(instanceId);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to select package";
            setInstancesError(message);
            setOptimisticActiveId(previousId ?? null);
            return false;
        } finally{
            setSelectingId(null);
        }
    };
    const handleSelectFromSwitcher = async (instanceId)=>{
        const ok = await handleSelectInstance(instanceId);
        if (ok) setSwitcherOpen(false);
    };
    const handleOpenSwitcher = ()=>{
        setSwitcherOpen(true);
    };
    const showSkeleton = !loading && coreLoading && !ready;
    const showGetStarted = !loading && ready && !coreError && (isMissingActiveInstance || !hasActiveInstance);
    if (showSkeleton) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OverviewSkeleton, {}, void 0, false, {
            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
            lineNumber: 173,
            columnNumber: 12
        }, this);
    }
    if (showGetStarted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen text-white",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mx-auto w-full max-w-6xl px-4 pt-12 md:px-8 md:pt-16",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.14em] hg-muted-2",
                                children: "Overview"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl md:text-4xl font-semibold tracking-tight",
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm hg-muted",
                                children: "See what you can do now and jump into your next action fast."
                            }, void 0, false, {
                                fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                lineNumber: 183,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                    lineNumber: 179,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "pb-16",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto max-w-6xl px-4 pt-8 md:px-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 shadow-sm shadow-black/20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs uppercase tracking-[0.14em] hg-muted-2",
                                    children: "Active package"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 191,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-white",
                                    children: "Select a package to continue"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 192,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 text-sm hg-muted",
                                    children: "You need an active package instance to use Uploads, History, and AI Chat."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKAGES_URL"],
                                    className: "mt-4 inline-flex h-10 items-center rounded-xl bg-[#50C0F0] px-4 text-sm font-semibold text-[#07131d] hover:opacity-90",
                                    children: "Select package"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 196,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 190,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                    lineNumber: 188,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
            lineNumber: 178,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mx-auto w-full max-w-6xl px-4 pt-12 md:px-8 md:pt-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs uppercase tracking-[0.14em] hg-muted-2",
                            children: "Overview"
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl md:text-4xl font-semibold tracking-tight",
                            children: "Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm hg-muted",
                            children: "See what you can do now and jump into your next action fast."
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                    lineNumber: 212,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "pb-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-6xl space-y-6 px-4 pt-8 md:space-y-8 md:px-8",
                    children: [
                        coreError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Could not load dashboard overview."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 opacity-90",
                                    children: coreError
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 226,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>void refresh(true),
                                    className: "mt-3 inline-flex h-9 items-center rounded-lg border border-rose-300/40 px-3 text-xs font-semibold text-rose-100 hover:border-rose-200/60",
                                    children: "Retry"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 227,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 224,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$DashboardOnboarding$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                isNewUser: isNewUser,
                                packageInstanceId: packageInstanceId,
                                planKey: planKey || undefined,
                                uploadsRemaining: uploadsRemaining,
                                chatRemaining: chatRemaining,
                                videoRemaining: videoRemaining
                            }, void 0, false, {
                                fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 237,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$ActivePackageCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        planKey: planKey || undefined,
                                        packageInstanceId: packageInstanceId,
                                        status: planData?.hasAccess ? "active" : "inactive",
                                        createdAt: planData?.packageInstanceCreatedAt,
                                        onOpenSwitcher: handleOpenSwitcher,
                                        profileLabel: activeProfileLabel
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$QuotaUsageCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        uploadsUsed: uploadsUsed,
                                        uploadLimit: uploadsLimit,
                                        chatUsed: chatUsed,
                                        chatLimit: chatLimit,
                                        videoUsed: videoUsed,
                                        videoLimit: videoLimit
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$QuickActions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        uploadsRemaining: uploadsRemaining,
                                        chatRemaining: chatRemaining
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 271,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$LastUploadCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        result: latestResult,
                                        loading: latestLoading
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                                    lineNumber: 275,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 248,
                            columnNumber: 11
                        }, this),
                        instancesError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200",
                            children: instancesError
                        }, void 0, false, {
                            fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$ProfileSwitcherModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: switcherOpen,
                instances: instances,
                loading: instancesLoading,
                activeInstanceId: activeId,
                selectingId: selectingId,
                onClose: ()=>setSwitcherOpen(false),
                onSelect: handleSelectFromSwitcher
            }, void 0, false, {
                fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
                lineNumber: 288,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[locale]/dashboard/page.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "b4k2XJKvg0DZr9DPwQavcITUoMI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$useOverviewModel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOverviewModel"]
    ];
});
_c1 = DashboardPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "OverviewSkeleton");
__turbopack_context__.k.register(_c1, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_1bd59c00._.js.map