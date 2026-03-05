(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/i18n/routing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "routing",
    ()=>routing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/routing/defineRouting.js [app-client] (ecmascript) <export default as defineRouting>");
;
const routing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$routing$2f$defineRouting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__defineRouting$3e$__["defineRouting"])({
    locales: [
        'en',
        'el',
        'es',
        'it'
    ],
    defaultLocale: 'en',
    localePrefix: 'as-needed',
    localeCookie: {
        name: 'NEXT_LOCALE',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax'
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/i18n/navigation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link",
    ()=>Link,
    "getPathname",
    ()=>getPathname,
    "redirect",
    ()=>redirect,
    "usePathname",
    ()=>usePathname,
    "useRouter",
    ()=>useRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/navigation/react-client/createNavigation.js [app-client] (ecmascript) <export default as createNavigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/routing.ts [app-client] (ecmascript)");
;
;
const { Link, redirect, usePathname, useRouter, getPathname } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$navigation$2f$react$2d$client$2f$createNavigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createNavigation$3e$__["createNavigation"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$routing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["routing"]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/dashboard/loading spinner/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const Spinner = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-center w-full h-32",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 blur-md animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/dashboard/loading spinner/page.tsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-8 h-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/dashboard/loading spinner/page.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/dashboard/loading spinner/page.tsx",
            lineNumber: 7,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/components/dashboard/loading spinner/page.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Spinner;
const __TURBOPACK__default__export__ = Spinner;
var _c;
__turbopack_context__.k.register(_c, "Spinner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/navigation/RouteTransitionOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RouteTransitionOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$loading__spinner$2f$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/dashboard/loading spinner/page.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function RouteTransitionOverlay() {
    _s();
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RouteTransitionOverlay.useEffect": ()=>{
            const start = {
                "RouteTransitionOverlay.useEffect.start": ()=>setVisible(true)
            }["RouteTransitionOverlay.useEffect.start"];
            window.addEventListener("route-transition-start", start);
            return ({
                "RouteTransitionOverlay.useEffect": ()=>window.removeEventListener("route-transition-start", start)
            })["RouteTransitionOverlay.useEffect"];
        }
    }["RouteTransitionOverlay.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RouteTransitionOverlay.useEffect": ()=>{
            // Hide overlay once we land on the target route (dashboard) or any route change completes
            if (visible) setVisible(false);
        }
    }["RouteTransitionOverlay.useEffect"], [
        pathname
    ]);
    if (!visible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "scale-110",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$dashboard$2f$loading__spinner$2f$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/components/navigation/RouteTransitionOverlay.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/navigation/RouteTransitionOverlay.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/navigation/RouteTransitionOverlay.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(RouteTransitionOverlay, "JYI3lwMoQL0ZZUZOhPjBoCJRUoc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = RouteTransitionOverlay;
var _c;
__turbopack_context__.k.register(_c, "RouteTransitionOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/cart/CartContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CartProvider({ children }) {
    _s();
    const [cartItems, setCartItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CartProvider.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    const stored = localStorage.getItem("cartItems");
                    return stored ? JSON.parse(stored) : [];
                } catch  {
                    return [];
                }
            }
            return [];
        }
    }["CartProvider.useState"]);
    // Sync to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
            }
        }
    }["CartProvider.useEffect"], [
        cartItems
    ]);
    // Add to cart
    function addToCart(id) {
        setCartItems((prev)=>{
            const exists = prev.find((item)=>item.id === id);
            if (exists) {
                return prev.map((item)=>item.id === id ? {
                        ...item,
                        quantity: item.quantity + 1
                    } : item);
            }
            return [
                ...prev,
                {
                    id,
                    quantity: 1
                }
            ];
        });
    }
    // Remove item
    function removeFromCart(id) {
        setCartItems((prev)=>prev.filter((item)=>item.id !== id));
    }
    // Change qty
    function changeQty(id, qty) {
        setCartItems((prev)=>prev.map((item)=>item.id === id ? {
                    ...item,
                    quantity: Math.max(1, qty)
                } : item));
    }
    function clearCart() {
        setCartItems([]);
    }
    const cartCount = cartItems.reduce((acc, item)=>acc + item.quantity, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            cartItems,
            setCartItems,
            addToCart,
            removeFromCart,
            changeQty,
            clearCart,
            cartCount
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/components/cart/CartContext.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "ClFtzLyeCiJNsvHm+XY/jm3jYSU=");
_c = CartProvider;
function useCart() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
_s1(useCart, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/utils/fetcher.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/utils/fetcher.ts
__turbopack_context__.s([
    "BASE_URL",
    ()=>BASE_URL,
    "fetchJson",
    ()=>fetchJson
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const AUTH_EVENT = "ai-auth-changed";
async function fetchJson(input, init = {}) {
    const { onUnauthorized, ...requestInit } = init;
    const USE_BFF = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_USE_BFF === 'true';
    const BFF_PREFIXES = [
        '/api/auth/',
        '/api/checkout/',
        '/api/user/'
    ];
    // If using the in-app BFF, route auth calls to relative /api/auth/*
    let url = input;
    try {
        if (USE_BFF && typeof input === 'string') {
            for (const prefix of BFF_PREFIXES){
                if (input.startsWith(BASE_URL + prefix)) {
                    url = input.slice(BASE_URL.length);
                    break;
                }
                const idx = input.indexOf(prefix);
                if (input.startsWith('http') && idx !== -1) {
                    url = input.slice(idx);
                    break;
                }
            }
        }
        // Always force auth routes through the BFF to avoid cookie/domain issues.
        if (typeof input === 'string') {
            const authPrefix = '/api/auth/';
            if (input.startsWith(BASE_URL + authPrefix)) {
                url = input.slice(BASE_URL.length);
            } else {
                const idx = input.indexOf(authPrefix);
                if (input.startsWith('http') && idx !== -1) {
                    url = input.slice(idx);
                }
            }
        }
    } catch  {}
    const headers = new Headers(requestInit.headers);
    if (!headers.has('content-type')) headers.set('Content-Type', 'application/json');
    const res = await fetch(url, {
        ...requestInit,
        credentials: "include",
        headers
    });
    const text = await res.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch  {
        data = text;
    }
    if (res.status === 401) {
        try {
            if ("TURBOPACK compile-time truthy", 1) {
                window.dispatchEvent(new Event(AUTH_EVENT));
            }
        } catch  {}
        try {
            onUnauthorized?.();
        } catch  {}
        // optional: client-side redirect can be handled by caller
        const err = new Error("Unauthorized");
        err.status = 401;
        err.data = data;
        if (data && typeof data === "object" && "requestId" in data) {
            const rid = data.requestId;
            if (typeof rid === "string") err.requestId = rid;
        }
        throw err;
    }
    return {
        ok: res.ok,
        status: res.status,
        data
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/hooks/useUser.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearUserCache",
    ()=>clearUserCache,
    "notifyAuthChange",
    ()=>notifyAuthChange,
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/fetcher.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Simple in-memory cache to avoid duplicate /me calls across components
let cachedUser = undefined; // undefined = unknown, null = unauthenticated
let inFlight = null;
let lastFetched = 0;
const STALE_TTL_MS = 5000;
const AUTH_EVENT = "ai-auth-changed";
async function fetchUserOnce() {
    if (inFlight) return inFlight;
    inFlight = (async ()=>{
        try {
            const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`/api/auth/me`, {
                method: "GET",
                cache: "no-store"
            });
            const payload = r.data;
            cachedUser = r.ok && payload && payload.user ? payload.user : null;
        } catch  {
            cachedUser = null;
        } finally{
            lastFetched = Date.now();
            const val = cachedUser ?? null;
            inFlight = null;
            return val;
        }
    })();
    return inFlight;
}
function useUser(opts = {}) {
    _s();
    const { redirectTo = "/", required = true, initialUser } = opts;
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUser.useEffect": ()=>{
            let cancelled = false;
            function handleAuthChanged() {
                ({
                    "useUser.useEffect.handleAuthChanged": async ()=>{
                        try {
                            const u = await fetchUserOnce();
                            if (!cancelled) setUser(u);
                        } catch  {
                            if (!cancelled) setUser(null);
                        }
                    }
                })["useUser.useEffect.handleAuthChanged"]();
            }
            if ("TURBOPACK compile-time truthy", 1) {
                window.addEventListener(AUTH_EVENT, handleAuthChanged);
            }
            ({
                "useUser.useEffect": async ()=>{
                    try {
                        // If the server already provided the user, use it immediately when truthy.
                        // If it's explicitly null but a client token exists (testing header auth),
                        // allow a client-side revalidation before redirecting.
                        if (typeof initialUser !== "undefined") {
                            if (initialUser) {
                                cachedUser = initialUser;
                                lastFetched = Date.now();
                                setUser(initialUser);
                                setLoading(false);
                                return;
                            } else if (!initialUser && required) {
                                // No server user and no client token → redirect now.
                                router.replace(redirectTo);
                                setUser(null);
                                setLoading(false);
                                return;
                            }
                        // else: initialUser is null but we have a client token; fall through to fetch
                        }
                        // Serve instantly from cache if fresh; revalidate in background if stale
                        const now = Date.now();
                        const fresh = cachedUser !== undefined && now - lastFetched < STALE_TTL_MS;
                        // For protected pages (required=true), bypass fresh cache to avoid
                        // letting a stale authenticated user slip through after logout.
                        if (fresh && !required) {
                            setUser(cachedUser ?? null);
                            setLoading(false);
                            return;
                        }
                        const u = await fetchUserOnce();
                        if (cancelled) return;
                        setUser(u);
                        if (!u && required) router.replace(redirectTo);
                    } catch (e) {
                        if (cancelled) return;
                        setError(e);
                        setUser(null);
                        if (required) router.replace(redirectTo);
                    } finally{
                        if (!cancelled) setLoading(false);
                    }
                }
            })["useUser.useEffect"]();
            return ({
                "useUser.useEffect": ()=>{
                    cancelled = true;
                }
            })["useUser.useEffect"];
            //TURBOPACK unreachable
            ;
        }
    }["useUser.useEffect"], [
        redirectTo,
        required,
        router,
        initialUser
    ]);
    return {
        user,
        loading,
        error,
        refresh: async ()=>{
            setLoading(true);
            try {
                const u = await fetchUserOnce();
                setUser(u);
            } catch (e) {
                setUser(null);
                setError(e);
            } finally{
                setLoading(false);
            }
        }
    };
}
_s(useUser, "6RFyu9sagNamVh1bs25TQK7ZGok=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
function clearUserCache() {
    cachedUser = undefined;
    inFlight = null;
    lastFetched = 0;
}
function notifyAuthChange() {
    try {
        if ("TURBOPACK compile-time truthy", 1) {
            window.dispatchEvent(new Event(AUTH_EVENT));
        }
    } catch  {}
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/utils/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/utils/api.ts
__turbopack_context__.s([
    "analyzeImageMultipart",
    ()=>analyzeImageMultipart,
    "checkUserPackage",
    ()=>checkUserPackage,
    "clearApiCaches",
    ()=>clearApiCaches,
    "coachChat",
    ()=>coachChat,
    "createAddonCheckoutSession",
    ()=>createAddonCheckoutSession,
    "createEmptyConversation",
    ()=>createEmptyConversation,
    "deleteAnalysisResult",
    ()=>deleteAnalysisResult,
    "deleteConversation",
    ()=>deleteConversation,
    "enrollPersonaFaceMultipart",
    ()=>enrollPersonaFaceMultipart,
    "fetchActivePackageInstances",
    ()=>fetchActivePackageInstances,
    "fetchAnalysisHistory",
    ()=>fetchAnalysisHistory,
    "fetchCoachChatPrompts",
    ()=>fetchCoachChatPrompts,
    "fetchConversation",
    ()=>fetchConversation,
    "fetchConversations",
    ()=>fetchConversations,
    "fetchLatestResultForPackageInstance",
    ()=>fetchLatestResultForPackageInstance,
    "generateConversationTitle",
    ()=>generateConversationTitle,
    "getAnalysisById",
    ()=>getAnalysisById,
    "getCheckoutInFlightServerSnapshot",
    ()=>getCheckoutInFlightServerSnapshot,
    "getCheckoutInFlightSnapshot",
    ()=>getCheckoutInFlightSnapshot,
    "getRecentCreations",
    ()=>getRecentCreations,
    "getRenderJob",
    ()=>getRenderJob,
    "getUserResultById",
    ()=>getUserResultById,
    "getUserResultImageUrl",
    ()=>getUserResultImageUrl,
    "getUserResults",
    ()=>getUserResults,
    "postRecommendationFeedback",
    ()=>postRecommendationFeedback,
    "purchasePackage",
    ()=>purchasePackage,
    "renderGenerate",
    ()=>renderGenerate,
    "selectPackageInstance",
    ()=>selectPackageInstance,
    "sendFeedback",
    ()=>sendFeedback,
    "startCheckout",
    ()=>startCheckout,
    "subscribeCheckoutInFlight",
    ()=>subscribeCheckoutInFlight,
    "summarizeConversation",
    ()=>summarizeConversation,
    "updateAnalysisById",
    ()=>updateAnalysisById,
    "updateUserProfile",
    ()=>updateUserProfile,
    "verifyAddonSession",
    ()=>verifyAddonSession,
    "verifySession",
    ()=>verifySession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/fetcher.ts [app-client] (ecmascript)");
;
// -------------------------------
// Small helpers
// -------------------------------
async function readJsonOrText(res) {
    const text = await res.text();
    try {
        return {
            ok: res.ok,
            status: res.status,
            data: JSON.parse(text)
        };
    } catch  {
        return {
            ok: res.ok,
            status: res.status,
            data: text
        };
    }
}
function ensureOk(r, what) {
    if (!r.ok) {
        const msg = typeof r.data === "string" ? r.data : JSON.stringify(r.data, null, 2);
        throw new Error(`${what} failed (${r.status}) - ${msg}`);
    }
    return r.data;
}
async function fetchAnalysisHistory(page = 1, limit = 10, options = {}) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ts: String(Date.now())
    });
    if (options.packageInstanceId) params.set("packageInstanceId", options.packageInstanceId);
    const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/analyze?${params.toString()}`;
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(url, {
        method: "GET",
        cache: "no-store"
    });
    if (!r.ok) throw new Error("Fetch analysis history failed");
    return r.data;
}
async function getUserResults(params) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const includeLegacy = params?.includeLegacy ?? false;
    const qs = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        includeLegacy: String(includeLegacy)
    });
    if (params?.packageInstanceId) {
        qs.set("packageInstanceId", params.packageInstanceId);
    }
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/user/results?${qs.toString()}`, {
        method: "GET",
        cache: "no-store"
    });
    if (!r.ok) {
        const data = r.data;
        const err = new Error(data?.error || "Failed to load results");
        err.status = r.status;
        err.code = data?.errorCode || data?.error;
        if (typeof data?.requestId === "string") err.requestId = data.requestId;
        throw err;
    }
    return r.data;
}
async function fetchLatestResultForPackageInstance(packageInstanceId) {
    const { results } = await fetchAnalysisHistory(1, 1, {
        packageInstanceId
    });
    return results[0] || null;
}
const extractResultImageUrl = (result)=>{
    const meta = result.meta;
    if (!meta || typeof meta !== "object") return null;
    const imageUrl = meta.imageUrl;
    return typeof imageUrl === "string" && imageUrl.startsWith("http") ? imageUrl : null;
};
const isLikelyPrivateR2Url = (url)=>{
    const lower = url.toLowerCase();
    const hasSigningParams = lower.includes("x-amz-") || lower.includes("signature") || lower.includes("token=");
    try {
        const parsed = new URL(url);
        const hostIsR2 = parsed.hostname.includes("r2.cloudflarestorage.com");
        const uploadsPath = parsed.pathname.includes("/aiplatform/uploads/");
        return (hostIsR2 || uploadsPath) && !hasSigningParams;
    } catch  {
        const uploadsPath = lower.includes("/aiplatform/uploads/");
        return uploadsPath && !hasSigningParams;
    }
};
const extractResultImageKey = (result)=>{
    const meta = result.meta;
    const topLevelImageKey = result.imageKey;
    const nestedImage = meta?.image;
    const candidates = [
        topLevelImageKey,
        meta?.imageKey,
        nestedImage?.key,
        meta?.assetKey,
        meta?.r2Key,
        meta?.uploadKey
    ];
    for (const candidate of candidates){
        if (typeof candidate === "string" && candidate.trim()) {
            return candidate.trim();
        }
    }
    return null;
};
async function getRecentCreations(params) {
    const { packageInstanceId, limit = 12 } = params;
    const res = await getUserResults({
        page: 1,
        limit,
        packageInstanceId
    });
    return (res.results || []).map((item)=>{
        const createdAt = item.createdAt || "";
        const niche = item?.promotion?.niche || "Report";
        const title = ("TURBOPACK compile-time truthy", 1) ? `${niche} report` : "TURBOPACK unreachable";
        const platform = item?.promotion?.recommendedPlatforms?.[0]?.platform || "Analysis";
        const status = item?.promotion ? "Ready" : "Processing";
        const thumb = typeof item.thumbnailUrl === "string" && item.thumbnailUrl || typeof item.imageUrl === "string" && item.imageUrl || typeof item.meta?.thumbnailUrl === "string" && item.meta.thumbnailUrl || typeof item.meta?.imageUrl === "string" && item.meta.imageUrl || typeof item.meta?.assetUrl === "string" && item.meta.assetUrl || null;
        const normalizedThumb = typeof thumb === "string" && isLikelyPrivateR2Url(thumb) ? null : thumb;
        return {
            id: item._id,
            title,
            createdAt,
            type: platform,
            status,
            thumbnailUrl: normalizedThumb,
            imageKey: extractResultImageKey(item)
        };
    });
}
async function getUserResultImageUrl({ id }) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/user/results/${encodeURIComponent(id)}/image-url`, {
        method: "GET",
        cache: "no-store",
        credentials: "include"
    });
    if (!r.ok) {
        const data = r.data;
        const err = new Error(data?.error || "Failed to load result image URL");
        err.status = r.status;
        if (typeof data?.requestId === "string") err.requestId = data.requestId;
        throw err;
    }
    return r.data;
}
async function deleteAnalysisResult(id) {
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/analyze/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const parsed = await readJsonOrText(res);
    return ensureOk(parsed, "Delete analysis result");
}
// -------------------------------
/** Stripe (unchanged) */ let checkoutInFlightPromise = null;
let checkoutInFlight = false;
const checkoutInFlightListeners = new Set();
function setCheckoutInFlight(next) {
    checkoutInFlight = next;
    checkoutInFlightListeners.forEach((listener)=>listener());
}
function subscribeCheckoutInFlight(listener) {
    checkoutInFlightListeners.add(listener);
    return ()=>{
        checkoutInFlightListeners.delete(listener);
    };
}
function getCheckoutInFlightSnapshot() {
    return checkoutInFlight;
}
function getCheckoutInFlightServerSnapshot() {
    return false;
}
async function startCheckout(packageId, personaKey) {
    if (checkoutInFlightPromise) return;
    setCheckoutInFlight(true);
    const USE_BFF = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_USE_BFF === 'true';
    const url = USE_BFF ? `/api/checkout/create-checkout-session` : `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/checkout/create-checkout-session`;
    checkoutInFlightPromise = (async ()=>{
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                packageId,
                personaKey
            })
        });
        const { ok, data } = await readJsonOrText(res);
        if (!ok) throw new Error(typeof data === "string" ? data : data?.error || "Failed to start checkout");
        if (!data?.url) throw new Error("No checkout URL returned");
        window.location.href = data.url;
    })();
    try {
        await checkoutInFlightPromise;
    } finally{
        checkoutInFlightPromise = null;
        setCheckoutInFlight(false);
    }
}
async function verifySession(sessionId) {
    const USE_BFF = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_USE_BFF === 'true';
    const base = USE_BFF ? '' : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"];
    const res = await fetch(`${base}/api/checkout/verify-session?session_id=${encodeURIComponent(sessionId)}`);
    const parsed = await readJsonOrText(res);
    return ensureOk(parsed, "Verify session");
}
async function purchasePackage(packageId) {
    const USE_BFF = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_USE_BFF === 'true';
    const url = USE_BFF ? `/api/user/purchase` : `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/user/purchase`;
    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            packageId
        })
    });
    const parsed = await readJsonOrText(res);
    return ensureOk(parsed, "Purchase package");
}
async function updateUserProfile(payload) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/user/profile`, {
        method: "PATCH",
        cache: "no-store",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    if (!r.ok) {
        const data = r.data;
        const err = new Error(data?.message || data?.error || "Failed to update profile");
        err.status = r.status;
        if (typeof data?.requestId === "string") err.requestId = data.requestId;
        if (typeof data?.errorCode === "string") err.errorCode = data.errorCode;
        throw err;
    }
    return r.data;
}
function isUnauthorizedError(e) {
    if (typeof e !== "object" || e === null) return false;
    const maybe = e;
    return typeof maybe.status === "number" && maybe.status === 401 || typeof maybe.message === "string" && maybe.message === "Unauthorized";
}
async function checkUserPackage(options = {}) {
    // Simple in-memory cache to avoid duplicate calls from StrictMode double effects
    // and from multiple components on the same view. Stale after 5 seconds.
    const now = Date.now();
    const TTL = 5000;
    const force = options.force === true;
    if (!force && pkgCache.value !== undefined && now - pkgCache.ts < TTL) {
        return pkgCache.value;
    }
    if (!force && pkgCache.inFlight) return pkgCache.inFlight;
    pkgCache.inFlight = (async ()=>{
        try {
            const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/user/check-package`, {
                method: "GET",
                cache: "no-store"
            });
            if (!r.ok) {
                const err = new Error("Check user package failed");
                err.status = r.status;
                err.data = r.data;
                throw err;
            }
            const val = r.data;
            pkgCache.value = val;
            pkgCache.ts = Date.now();
            return val;
        } catch (e) {
            // Do NOT cache unauthorized; let callers retry after auth settles
            if (isUnauthorizedError(e)) {
                return {
                    hasAccess: false
                };
            }
            throw e;
        } finally{
            pkgCache.inFlight = null;
        }
    })();
    return pkgCache.inFlight;
}
async function fetchActivePackageInstances() {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/user/package-instances`, {
        method: "GET",
        cache: "no-store"
    });
    if (!r.ok) throw new Error("Fetch package instances failed");
    const payload = r.data;
    return payload.instances || [];
}
async function selectPackageInstance(packageInstanceId) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/user/select-package-instance`, {
        method: "POST",
        body: JSON.stringify({
            packageInstanceId
        })
    });
    if (!r.ok) throw new Error("Select package instance failed");
    const payload = r.data;
    return payload;
}
async function createAddonCheckoutSession(params) {
    const qtyMap = {
        pack_1: 1,
        pack_5: 5,
        pack_20: 20,
        pack_50: 50,
        pack_200: 200
    };
    const addonQty = qtyMap[params.addonPack] ?? undefined;
    const USE_BFF = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_USE_BFF === "true";
    const url = USE_BFF ? `/api/checkout/create-addon-checkout-session` : `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/checkout/create-addon-checkout-session`;
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(url, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...params,
            addonQty
        })
    });
    if (!r.ok) {
        const err = new Error("Failed to create addon checkout session");
        err.payload = r.data;
        throw err;
    }
    return r.data;
}
async function verifyAddonSession(sessionId) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/billing/addons/verify?session_id=${encodeURIComponent(sessionId)}`, {
        method: "GET",
        cache: "no-store"
    });
    if (!r.ok) throw new Error("Verify addon session failed");
    return r.data;
}
// Package cache (module scope)
const pkgCache = {
    value: undefined,
    ts: 0,
    inFlight: null
};
function clearApiCaches() {
    pkgCache.value = undefined;
    pkgCache.ts = 0;
    pkgCache.inFlight = null;
}
async function renderGenerate(input) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/render/generate`, {
        method: "POST",
        body: JSON.stringify(input)
    });
    if (!r.ok) throw new Error("Failed to create render job");
    return r.data;
}
async function getRenderJob(jobId) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/render/jobs/${encodeURIComponent(jobId)}`, {
        method: "GET"
    });
    if (!r.ok) throw new Error("Failed to fetch job status");
    return r.data;
}
async function coachChat({ question, latestContentInfo, conversationId, title }) {
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/coach-chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                question,
                latestContentInfo,
                conversationId,
                title
            })
        });
        const parsed = await readJsonOrText(res);
        if (res.status === 200) return {
            status: 200,
            data: parsed.data
        };
        if (res.status === 402) return {
            status: 402,
            data: parsed.data
        };
        if (res.status === 409) return {
            status: 409,
            data: parsed.data
        };
        if (res.status === 429) return {
            status: 429,
            data: parsed.data
        };
        return {
            status: res.status,
            data: parsed.data
        };
    } catch  {
        return {
            status: 0,
            data: {
                error: "Network error"
            }
        };
    }
}
async function summarizeConversation(conversationId) {
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/conversations/${conversationId}/summarize`, {
            method: "POST",
            credentials: "include"
        });
        const parsed = await readJsonOrText(res);
        const data = ensureOk(parsed, "Summarize conversation");
        if (!data?.newConversationId || !data?.summary) return null;
        return {
            newConversationId: data.newConversationId,
            summary: data.summary
        };
    } catch (error) {
        console.error("Error summarizing conversation:", error);
        return null;
    }
}
async function fetchConversation(id) {
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/conversations/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        cache: "no-store"
    });
    const parsed = await readJsonOrText(res);
    return ensureOk(parsed, "Fetch conversation");
}
async function deleteConversation(conversationId) {
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/conversations/${conversationId}`, {
        method: "DELETE",
        credentials: "include"
    });
    const parsed = await readJsonOrText(res);
    return ensureOk(parsed, "Delete conversation");
}
async function createEmptyConversation() {
    try {
        const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/conversations`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });
        const parsed = await readJsonOrText(res);
        const data = ensureOk(parsed, "Create conversation");
        return data._id ?? data.id ?? null;
    } catch (error) {
        console.error("Error creating new conversation:", error);
        return null;
    }
}
async function generateConversationTitle(conversationId, firstUserMessage) {
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/conversations/${conversationId}/generate-title`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            firstUserMessage
        }),
        cache: "no-store"
    });
    const parsed = await readJsonOrText(res);
    const data = ensureOk(parsed, "Generate title");
    return data.title || null;
}
async function fetchConversations() {
    const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/conversations?ts=${Date.now()}`;
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(url, {
        method: "GET",
        cache: "no-store"
    });
    if (!r.ok) throw new Error("Fetch conversations failed");
    return r.data;
}
async function sendFeedback(message) {
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/feedback`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message
        })
    });
    const parsed = await readJsonOrText(res);
    if (!parsed.ok) {
        throw new Error(typeof parsed.data === "string" ? parsed.data : parsed.data?.error || `Failed to send feedback (${parsed.status})`);
    }
    return parsed.data;
}
function analyzeImageMultipart(opts) {
    const { file, packageInstanceId, goal, linkBase, onProgress, signal } = opts;
    const form = new FormData();
    form.append("image", file);
    if (goal) form.append("goal", goal);
    if (linkBase) form.append("linkBase", linkBase);
    if (packageInstanceId) form.append("packageInstanceId", packageInstanceId);
    // Include browser timezone so backend returns local windows
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone) form.append("timezone", timezone);
    } catch  {}
    const url = `/api/analyze`;
    return new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = ()=>{
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const json = JSON.parse(xhr.responseText);
                    resolve(json);
                } catch  {
                    reject(new Error("Invalid JSON from server."));
                }
            } else {
                try {
                    const err = JSON.parse(xhr.responseText);
                    const errorObj = new Error(err?.error || `Upload failed (${xhr.status})`);
                    if (typeof err?.requestId === "string") errorObj.requestId = err.requestId;
                    if (typeof err?.code === "string") errorObj.code = err.code;
                    if (typeof err?.feature === "string") errorObj.feature = err.feature;
                    if (typeof err?.plan === "string" || err?.plan === null) errorObj.plan = err?.plan ?? null;
                    if (typeof err?.remaining === "number") errorObj.remaining = err.remaining;
                    if (typeof err?.limit === "number") errorObj.limit = err.limit;
                    errorObj.payload = err;
                    reject(errorObj);
                } catch  {
                    reject(new Error(`Upload failed (${xhr.status})`));
                }
            }
        };
        if (xhr.upload && typeof onProgress === "function") {
            xhr.upload.onprogress = (evt)=>{
                if (!evt.lengthComputable) return;
                onProgress(Math.round(evt.loaded / evt.total * 100));
            };
        }
        xhr.onerror = ()=>reject(new Error("Network error"));
        // Support external abort via AbortController
        let aborted = false;
        const onAbort = ()=>{
            aborted = true;
            try {
                xhr.abort();
            } catch  {}
            reject(new DOMException("Aborted", "AbortError"));
        };
        if (signal) {
            if (signal.aborted) return onAbort();
            signal.addEventListener("abort", onAbort, {
                once: true
            });
        }
        xhr.send(form);
        // Cleanup abort listener when promise settles
        const cleanup = ()=>{
            if (signal) signal.removeEventListener("abort", onAbort);
        };
        xhr.onloadend = ()=>{
            if (!aborted) cleanup();
        };
    });
}
function enrollPersonaFaceMultipart(params) {
    const form = new FormData();
    form.append("image", params.file);
    const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/persona/enroll-face`;
    return new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.withCredentials = true;
        xhr.onreadystatechange = ()=>{
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const json = JSON.parse(xhr.responseText);
                    resolve(json);
                } catch  {
                    reject(new Error("Invalid JSON from server."));
                }
            } else {
                try {
                    const err = JSON.parse(xhr.responseText);
                    const code = typeof err?.errorCode === "string" ? err.errorCode : typeof err?.error === "string" ? err.error : undefined;
                    const message = typeof err?.error === "string" ? err.error : typeof err?.message === "string" ? err.message : `Enroll failed (${xhr.status})`;
                    reject({
                        status: xhr.status,
                        code,
                        requestId: typeof err?.requestId === "string" ? err.requestId : undefined,
                        message
                    });
                } catch  {
                    reject({
                        status: xhr.status,
                        code: undefined,
                        requestId: undefined,
                        message: `Enroll failed (${xhr.status})`
                    });
                }
            }
        };
        xhr.onerror = ()=>reject({
                status: 0,
                code: undefined,
                requestId: undefined,
                message: "Network error"
            });
        xhr.send(form);
    });
}
async function getAnalysisById(id) {
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/analyze/${id}`, {
        cache: "no-store"
    });
    const parsed = await readJsonOrText(res);
    return ensureOk(parsed, "Fetch result by id");
}
async function getUserResultById({ id }) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/analyze/${encodeURIComponent(id)}`, {
        method: "GET",
        cache: "no-store"
    });
    if (!r.ok) {
        const data = r.data;
        const err = new Error(data?.error || "Failed to load report");
        err.status = r.status;
        if (typeof data?.requestId === "string") err.requestId = data.requestId;
        throw err;
    }
    return r.data;
}
async function postRecommendationFeedback(payload) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/recommendations/feedback`, {
        method: "POST",
        cache: "no-store",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    if (!r.ok) {
        const data = r.data;
        const err = new Error(data?.error || data?.message || "Failed to save recommendation feedback");
        err.status = r.status;
        if (typeof data?.requestId === "string") err.requestId = data.requestId;
        throw err;
    }
    return {
        ok: true,
        requestId: typeof r.data?.requestId === "string" ? r.data.requestId : undefined,
        data: r.data
    };
}
async function updateAnalysisById(id, patch) {
    const res = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/analyze/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patch)
    });
    const parsed = await readJsonOrText(res);
    return ensureOk(parsed, "Update analysis");
}
async function fetchCoachChatPrompts() {
    const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/api/coach-chat/prompts?ts=${Date.now()}`;
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(url, {
        method: "GET",
        cache: "no-store"
    });
    if (!r.ok) throw new Error("Fetch coach prompts failed");
    return r.data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/utils/authClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logoutClient",
    ()=>logoutClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/fetcher.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
"use client";
;
;
;
function getLogoutUrl() {
    return "/api/auth/logout";
}
async function logoutClient() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(getLogoutUrl(), {
            method: "POST"
        });
    } catch (_) {
    // Ignore network failures; we'll clear state locally regardless.
    }
    try {
        sessionStorage.removeItem("justLoggedIn");
    } catch  {}
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearUserCache"])();
    } catch  {}
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearApiCaches"])();
    } catch  {}
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyAuthChange"])();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/hooks/useSectionObserver.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSectionObserver",
    ()=>useSectionObserver
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useSectionObserver(sectionIds) {
    _s();
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSectionObserver.useEffect": ()=>{
            if (!sectionIds.length || ("TURBOPACK compile-time value", "object") === "undefined") return;
            const observer = new IntersectionObserver({
                "useSectionObserver.useEffect": (entries)=>{
                    const visible = entries.filter({
                        "useSectionObserver.useEffect.visible": (entry)=>entry.isIntersecting
                    }["useSectionObserver.useEffect.visible"]);
                    if (!visible.length) return;
                    const topMost = visible.reduce({
                        "useSectionObserver.useEffect.topMost": (prev, curr)=>{
                            if (!prev) return curr;
                            return curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev;
                        }
                    }["useSectionObserver.useEffect.topMost"]);
                    if (topMost?.target?.id) {
                        setActiveId(topMost.target.id);
                    }
                }
            }["useSectionObserver.useEffect"], {
                rootMargin: "-45% 0% -45% 0%",
                threshold: [
                    0,
                    0.1,
                    0.25,
                    0.5
                ]
            });
            sectionIds.forEach({
                "useSectionObserver.useEffect": (id)=>{
                    const el = document.getElementById(id);
                    if (el) observer.observe(el);
                }
            }["useSectionObserver.useEffect"]);
            return ({
                "useSectionObserver.useEffect": ()=>{
                    observer.disconnect();
                }
            })["useSectionObserver.useEffect"];
        }
    }["useSectionObserver.useEffect"], [
        sectionIds.join("|")
    ]);
    return activeId;
}
_s(useSectionObserver, "pJ3h3JYrLkpIUWDqhHtZztvl5yA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/navigation/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-help.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/life-buoy.js [app-client] (ecmascript) <export default as LifeBuoy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/cart/CartContext.tsx [app-client] (ecmascript)"); // Make sure the path is correct!
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/navigation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$authClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/authClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useSectionObserver$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useSectionObserver.ts [app-client] (ecmascript)");
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
function hasPrefetch(r) {
    const candidate = r;
    return typeof candidate?.prefetch === "function";
}
function Navbar({ onCartClick }) {
    _s();
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { cartCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])({
        required: false
    });
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const navItems = [
        {
            id: "packages",
            label: "Products",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
        },
        {
            id: "features",
            label: "Features",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"]
        },
        {
            id: "upgrade",
            label: "Upgrade",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"]
        },
        {
            id: "faq",
            label: "FAQ",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"]
        },
        {
            id: "affiliates",
            label: "Affiliates",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
        },
        {
            id: "help-center",
            label: "Help Center",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__["LifeBuoy"]
        },
        {
            id: "contact",
            label: "Contact Us",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"]
        }
    ];
    const activeSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useSectionObserver$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSectionObserver"])(navItems.map({
        "Navbar.useSectionObserver[activeSection]": (item)=>item.id
    }["Navbar.useSectionObserver[activeSection]"]));
    // Avoid hydration mismatch for client-only cart count badge
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>setMounted(true)
    }["Navbar.useEffect"], []);
    // Prefetch dashboard route for instant navigation when authenticated
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            if (user) {
                try {
                    if (hasPrefetch(router)) {
                        router.prefetch("/dashboard");
                    }
                } catch  {}
            }
        }
    }["Navbar.useEffect"], [
        user,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "bg-[#060a1b]/95 backdrop-blur text-white py-4 px-6 fixed top-0 left-0 w-full z-50 shadow-[0_10px_40px_rgba(5,8,25,0.45)] border-b border-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex items-center justify-between md:justify-between w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                            href: "/",
                            className: "absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none flex items-center space-x-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/echofy-removebg-preview.png",
                                alt: "Logo",
                                width: 70,
                                height: 70,
                                className: "rounded-full object-contain"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 ml-auto",
                            children: [
                                !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                    href: "/login",
                                    "aria-label": "Sign in",
                                    className: "p-2 rounded-md border border-gray-700 bg-[#1f2937] hover:bg-[#374151] text-white transition-all shadow-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiUser"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 88,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, this),
                                !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                    href: "/signup",
                                    className: "hidden md:inline-flex items-center rounded-md border border-cyan-600 text-cyan-300 px-3 py-1 text-sm hover:bg-cyan-600/10",
                                    children: "Sign Up"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onCartClick,
                                    className: "relative p-1 hover:text-cyan-400 transition bg-transparent border-none shadow-none",
                                    "aria-label": "View cart",
                                    style: {
                                        background: "transparent"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                            size: 28
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this),
                                        mounted && cartCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: " absolute -top-2 -right-2 flex items-center justify-center bg-gradient-to-tr from-cyan-400 to-blue-600 text-white text-xs rounded-full w-5 h-5 font-bold shadow z-10 ",
                                            children: cartCount || 0
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                            lineNumber: 107,
                                            columnNumber: 1
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsMenuOpen(!isMenuOpen),
                                    "aria-label": isMenuOpen ? "Close menu" : "Open menu",
                                    className: `p-2 rounded-md border border-gray-700 bg-[#1f2937] hover:bg-[#374151] text-white transition-all shadow-sm ${isMenuOpen ? "z-10" : "z-50"}`,
                                    children: isMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiX"], {
                                        size: 22
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 126,
                                        columnNumber: 29
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiMenu"], {
                                        size: 22
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 126,
                                        columnNumber: 49
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-[#181F28] text-gray-200 z-[60] flex flex-col",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col justify-between h-full p-6 overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-semibold tracking-wide",
                                    children: "Menu"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 138,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsMenuOpen(false),
                                    "aria-label": "Close menu",
                                    className: "   flex items-center justify-center   w-9 h-9   rounded-full   bg-[#222735]   text-white   hover:text-cyan-400   hover:bg-[#232B36]   transition   border border-gray-700   shadow   focus:outline-none   focus:ring-2 focus:ring-cyan-500   text-2xl   font-bold   ",
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 139,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                            lineNumber: 137,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "flex flex-col gap-5 text-lg font-medium",
                            children: [
                                navItems.map(({ id, label, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `#${id}`,
                                        onClick: ()=>setIsMenuOpen(false),
                                        className: `transition flex items-center gap-2 ${activeSection === id ? "text-cyan-400" : "hover:text-cyan-400"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                                lineNumber: 174,
                                                columnNumber: 19
                                            }, this),
                                            label
                                        ]
                                    }, id, true, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                    href: "/dashboard",
                                    prefetch: true,
                                    onClick: (e)=>{
                                        if (!user) {
                                            e.preventDefault();
                                            setIsMenuOpen(false);
                                            router.push("/login?next=/dashboard");
                                            return;
                                        }
                                        setIsMenuOpen(false);
                                        try {
                                            window.dispatchEvent(new Event("route-transition-start"));
                                        } catch  {}
                                    },
                                    className: "hover:text-cyan-400 transition flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                            lineNumber: 197,
                                            columnNumber: 17
                                        }, this),
                                        "Dashboard"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 180,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                            lineNumber: 164,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-gray-700 my-6"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this),
                        user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: async ()=>{
                                    setIsMenuOpen(false);
                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$authClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutClient"])();
                                    router.replace("/login");
                                },
                                className: "flex items-center gap-2 text-gray-400 hover:text-white transition",
                                "aria-label": "Log out",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiUser"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 215,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Log out"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 216,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                lineNumber: 206,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                            lineNumber: 205,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-6 text-gray-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://twitter.com",
                                    target: "_blank",
                                    className: "hover:text-white",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTwitter"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 228,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://instagram.com",
                                    target: "_blank",
                                    className: "hover:text-white",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaInstagram"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 235,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://tiktok.com",
                                    target: "_blank",
                                    className: "hover:text-white",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTiktok"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 242,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 237,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://youtube.com",
                                    target: "_blank",
                                    className: "hover:text-white",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaYoutube"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                        lineNumber: 249,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                            lineNumber: 222,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                    lineNumber: 135,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/navigation/Navbar.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(Navbar, "DsO58RbCj5ka8Gz1nEoHq3ZvGNc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useSectionObserver$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSectionObserver"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/consent/ConsentContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConsentProvider",
    ()=>ConsentProvider,
    "useConsent",
    ()=>useConsent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const CONSENT_KEY = "consent.v1"; // bump when policy changes
const POLICY_VERSION = "1.0";
const ConsentCtx = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function ConsentProvider({ children }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [consent, setConsent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // On mount: read stored consent; honor GPC if present and no stored consent
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsentProvider.useEffect": ()=>{
            try {
                const raw = localStorage.getItem(CONSENT_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    setConsent(parsed);
                    return;
                }
            } catch  {}
            // default: EU-safe — only necessary allowed until explicit choice
            const gpc = typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;
            const base = {
                categories: {
                    necessary: true,
                    analytics: false,
                    marketing: false
                },
                timestamp: Date.now(),
                locale: typeof navigator !== "undefined" ? navigator.language : undefined,
                version: POLICY_VERSION,
                gpc
            };
            setConsent(base);
            setIsOpen(true); // show banner
        }
    }["ConsentProvider.useEffect"], []);
    const open = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsentProvider.useCallback[open]": ()=>setIsOpen(true)
    }["ConsentProvider.useCallback[open]"], []);
    const close = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsentProvider.useCallback[close]": ()=>setIsOpen(false)
    }["ConsentProvider.useCallback[close]"], []);
    const save = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ConsentProvider.useCallback[save]": async (cats)=>{
            const gpc = typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;
            const rec = {
                categories: {
                    necessary: true,
                    ...cats
                },
                timestamp: Date.now(),
                locale: typeof navigator !== "undefined" ? navigator.language : undefined,
                version: POLICY_VERSION,
                gpc
            };
            setConsent(rec);
            try {
                localStorage.setItem(CONSENT_KEY, JSON.stringify(rec));
            } catch  {}
            // fire-and-forget log
            try {
                fetch("/api/consent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(rec)
                });
            } catch  {}
            setIsOpen(false);
        }
    }["ConsentProvider.useCallback[save]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConsentProvider.useMemo[value]": ()=>({
                consent,
                open,
                close,
                save,
                isOpen
            })
    }["ConsentProvider.useMemo[value]"], [
        consent,
        open,
        close,
        save,
        isOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConsentCtx.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/components/consent/ConsentContext.tsx",
        lineNumber: 84,
        columnNumber: 10
    }, this);
}
_s(ConsentProvider, "t0oHtWWLdb/eM0ZsI31efVqFNCY=");
_c = ConsentProvider;
function useConsent() {
    _s1();
    const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ConsentCtx);
    if (!v) throw new Error("useConsent must be used within ConsentProvider");
    return v;
}
_s1(useConsent, "vseRKStixtRCAgA7lJDFgCF8qLI=");
var _c;
__turbopack_context__.k.register(_c, "ConsentProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/navigation/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/navigation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/consent/ConsentContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const Footer = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-gradient-to-r from-[#050819] via-[#030411] to-[#010208] text-gray-300 py-8 text-center border-t border-white/10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "© 2025 AI Content Helper. All rights reserved."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/navigation/Footer.tsx",
                    lineNumber: 8,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FooterLinks, {}, void 0, false, {
                    fileName: "[project]/src/app/components/navigation/Footer.tsx",
                    lineNumber: 9,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center space-x-6 mt-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://twitter.com",
                            target: "_blank",
                            className: "hover:text-blue-400 transition",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTwitter"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/navigation/Footer.tsx",
                                lineNumber: 16,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/navigation/Footer.tsx",
                            lineNumber: 11,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://instagram.com",
                            target: "_blank",
                            className: "hover:text-pink-400 transition",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaInstagram"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/navigation/Footer.tsx",
                                lineNumber: 23,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/navigation/Footer.tsx",
                            lineNumber: 18,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://tiktok.com",
                            target: "_blank",
                            className: "hover:text-gray-400 transition",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTiktok"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/navigation/Footer.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/navigation/Footer.tsx",
                            lineNumber: 25,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://youtube.com",
                            target: "_blank",
                            className: "hover:text-red-400 transition",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaYoutube"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/navigation/Footer.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/navigation/Footer.tsx",
                            lineNumber: 32,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/navigation/Footer.tsx",
                    lineNumber: 10,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/navigation/Footer.tsx",
            lineNumber: 7,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/components/navigation/Footer.tsx",
        lineNumber: 6,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = Footer;
const __TURBOPACK__default__export__ = Footer;
function FooterLinks() {
    _s();
    const { open } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsent"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-center flex-wrap gap-6 mt-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                href: "/privacy",
                className: "hover:text-white transition",
                children: "Privacy Policy"
            }, void 0, false, {
                fileName: "[project]/src/app/components/navigation/Footer.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                href: "/terms",
                className: "hover:text-white transition",
                children: "Terms of Service"
            }, void 0, false, {
                fileName: "[project]/src/app/components/navigation/Footer.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                href: "/cookies",
                className: "hover:text-white transition",
                children: "Cookie Policy"
            }, void 0, false, {
                fileName: "[project]/src/app/components/navigation/Footer.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: open,
                className: "hover:text-white transition underline underline-offset-2",
                children: "Cookie preferences"
            }, void 0, false, {
                fileName: "[project]/src/app/components/navigation/Footer.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/navigation/Footer.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(FooterLinks, "YlmSHdnQ5e2VLXrF1kLryHKACBg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsent"]
    ];
});
_c1 = FooterLinks;
var _c, _c1;
__turbopack_context__.k.register(_c, "Footer");
__turbopack_context__.k.register(_c1, "FooterLinks");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/consent/ConsentBanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConsentBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/consent/ConsentContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ConsentBanner() {
    _s();
    const { isOpen, save, open } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsent"])();
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-x-0 bottom-0 z-[10000] px-4 pb-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto rounded-2xl border border-[#232B36] bg-[#0f1520] p-4 text-gray-200 shadow-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm",
                    children: "We use cookies to provide essential site functionality and to improve your experience. You can accept all, reject non‑essential, or manage preferences."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/consent/ConsentBanner.tsx",
                    lineNumber: 10,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 flex flex-wrap gap-2 justify-end",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-3 py-1.5 rounded-lg border border-[#2a3443] bg-transparent hover:bg-[#141b26]",
                            onClick: ()=>save({
                                    analytics: false,
                                    marketing: false
                                }),
                            children: "Reject all"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/consent/ConsentBanner.tsx",
                            lineNumber: 14,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-3 py-1.5 rounded-lg border border-[#2a3443] bg-[#141b26] hover:bg-[#182030]",
                            onClick: ()=>open(),
                            children: "Manage"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/consent/ConsentBanner.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-3 py-1.5 rounded-lg bg-gradient-to-b from-indigo-500 to-blue-600 text-white font-semibold shadow hover:brightness-110",
                            onClick: ()=>save({
                                    analytics: true,
                                    marketing: true
                                }),
                            children: "Accept all"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/consent/ConsentBanner.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/consent/ConsentBanner.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/consent/ConsentBanner.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/consent/ConsentBanner.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_s(ConsentBanner, "+emc6di29sJpFifwkF0+bGThdmc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsent"]
    ];
});
_c = ConsentBanner;
var _c;
__turbopack_context__.k.register(_c, "ConsentBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/consent/ConsentModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConsentModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/consent/ConsentContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ConsentModal() {
    _s();
    const { isOpen, close, save } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsent"])();
    const [analytics, setAnalytics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [marketing, setMarketing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConsentModal.useEffect": ()=>{
            if (!isOpen) return;
            // reset toggles when opened
            setAnalytics(false);
            setMarketing(false);
        }
    }["ConsentModal.useEffect"], [
        isOpen
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[10001] flex items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
                onClick: close
            }, void 0, false, {
                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-lg rounded-2xl border border-[#232B36] bg-[#0f1520] p-5 text-gray-100 shadow-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-lg font-semibold",
                        children: "Cookie Preferences"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 text-sm text-gray-300",
                        children: "Adjust what we can use. Necessary cookies are always on."
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between border border-[#232B36] rounded-xl p-3 bg-[#121A24] opacity-70",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-medium",
                                                children: "Strictly necessary"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                                lineNumber: 28,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400",
                                                children: "Required for basic site functions."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                                lineNumber: 29,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                        lineNumber: 27,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs px-2 py-0.5 rounded-full bg-[#1b2431] border border-[#2a3443]",
                                        children: "On"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                        lineNumber: 31,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                lineNumber: 26,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center justify-between border border-[#232B36] rounded-xl p-3 bg-[#0f1623]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-medium",
                                                children: "Analytics"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                                lineNumber: 36,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400",
                                                children: "Helps us understand usage."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                                lineNumber: 37,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                        lineNumber: 35,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        className: "h-5 w-5",
                                        checked: analytics,
                                        onChange: (e)=>setAnalytics(e.target.checked)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                        lineNumber: 39,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center justify-between border border-[#232B36] rounded-xl p-3 bg-[#0f1623]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-medium",
                                                children: "Marketing"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                                lineNumber: 44,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-400",
                                                children: "Personalized ads & pixels."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                                lineNumber: 45,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                        lineNumber: 43,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        className: "h-5 w-5",
                                        checked: marketing,
                                        onChange: (e)=>setMarketing(e.target.checked)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                        lineNumber: 47,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex justify-end gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "px-3 py-1.5 rounded-lg border border-[#2a3443] bg-transparent hover:bg-[#141b26]",
                                onClick: close,
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "px-3 py-1.5 rounded-lg bg-gradient-to-b from-indigo-500 to-blue-600 text-white font-semibold shadow hover:brightness-110",
                                onClick: ()=>save({
                                        analytics,
                                        marketing
                                    }),
                                children: "Save preferences"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/consent/ConsentModal.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(ConsentModal, "CuXEKp9fxF/qCx1aw0CUCjT8mP8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConsent"]
    ];
});
_c = ConsentModal;
var _c;
__turbopack_context__.k.register(_c, "ConsentModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/common/Reveal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Reveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function Reveal({ as, children, className = "", delay = 0, once = false, threshold = 0.15, ...rest }) {
    _s();
    const Tag = as || "div";
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Reveal.useEffect": ()=>{
            const el = ref.current;
            if (!el) return;
            const observer = new IntersectionObserver({
                "Reveal.useEffect": ([entry])=>{
                    if (entry.isIntersecting) {
                        setVisible(true);
                        if (once) observer.disconnect();
                    } else if (!once) {
                        setVisible(false);
                    }
                }
            }["Reveal.useEffect"], {
                threshold
            });
            observer.observe(el);
            return ({
                "Reveal.useEffect": ()=>observer.disconnect()
            })["Reveal.useEffect"];
        }
    }["Reveal.useEffect"], [
        once,
        threshold
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        ref: ref,
        className: `transition-all duration-1000 ease-out will-change-transform ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`,
        style: {
            transitionDelay: `${delay}ms`
        },
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/components/common/Reveal.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(Reveal, "F7BtIAxVh3vOWU1Jr24RYsj9CHc=");
_c = Reveal;
var _c;
__turbopack_context__.k.register(_c, "Reveal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/internal/font/google/outfit_971bf5f5.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "outfit_971bf5f5-module__G3Em6W__className",
});
}),
"[next]/internal/font/google/outfit_971bf5f5.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$outfit_971bf5f5$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/outfit_971bf5f5.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$outfit_971bf5f5$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Outfit', 'Outfit Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$outfit_971bf5f5$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$outfit_971bf5f5$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/src/app/components/packages/Packages.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Packages,
    "packages",
    ()=>packages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$Reveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/common/Reveal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crown.js [app-client] (ecmascript) <export default as Crown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$outfit_971bf5f5$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/outfit_971bf5f5.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const packages = [
    {
        id: "lite",
        title: "Lite",
        price: "$99",
        period: "/one-time",
        outcome: "Best for getting started and testing AI analysis",
        includes: [
            "AI image analysis with platform strategy",
            "Caption and hashtag suggestions",
            "History and reports",
            "One-time face enrollment protection"
        ],
        features: [
            "AI image analysis with platform strategy",
            "Caption and hashtag suggestions",
            "History and reports",
            "One-time face enrollment protection"
        ],
        highlights: [
            "Uploads included",
            "Fast results",
            "Email support (basic)"
        ],
        badge: null,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"],
        featured: false
    },
    {
        id: "pro",
        title: "Pro",
        price: "$189",
        period: "/one-time",
        outcome: "Best for consistent creators posting weekly",
        includes: [
            "Everything in Lite",
            "Higher quotas (uploads + more AI usage)",
            "Advanced strategy output (detailed per platform)",
            "Priority processing",
            "Better support"
        ],
        features: [
            "Everything in Lite",
            "Higher quotas (uploads + more AI usage)",
            "Advanced strategy output (detailed per platform)",
            "Priority processing",
            "Better support"
        ],
        highlights: [
            "Most popular",
            "More AI capacity",
            "Faster turnaround"
        ],
        badge: "Most Popular",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
        featured: true
    },
    {
        id: "ultimate",
        title: "Ultimate",
        price: "$399",
        period: "/one-time",
        outcome: "Best for power users and agencies",
        includes: [
            "Everything in Pro",
            "Maximum quotas for scale",
            "Talking Head video credits included",
            "Premium support"
        ],
        features: [
            "Everything in Pro",
            "Maximum quotas for scale",
            "Talking Head video credits included",
            "Premium support"
        ],
        highlights: [
            "Best value for teams",
            "Highest priority",
            "Agency-ready scale"
        ],
        badge: "Best Value",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"],
        featured: false
    }
];
function isStringArray(value) {
    return Array.isArray(value) && value.every((item)=>typeof item === "string");
}
function isPlanCopy(value) {
    if (!value || typeof value !== "object") return false;
    const obj = value;
    return typeof obj.title === "string" && typeof obj.price === "string" && typeof obj.period === "string" && typeof obj.outcome === "string" && isStringArray(obj.includes) && isStringArray(obj.highlights) && (typeof obj.badge === "string" || obj.badge === null) && typeof obj.cta === "string";
}
function Packages() {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])("pricing");
    const fallbackPlans = {
        lite: {
            title: "Lite",
            price: "$99",
            period: "/one-time",
            outcome: "Best for getting started and testing AI analysis",
            includes: [
                "AI image analysis with platform strategy",
                "Caption and hashtag suggestions",
                "History and reports",
                "One-time face enrollment protection"
            ],
            highlights: [
                "Uploads included",
                "Fast results",
                "Email support (basic)"
            ],
            badge: null,
            cta: "Get started"
        },
        pro: {
            title: "Pro",
            price: "$189",
            period: "/one-time",
            outcome: "Best for consistent creators posting weekly",
            includes: [
                "Everything in Lite",
                "Higher quotas (uploads + more AI usage)",
                "Advanced strategy output (detailed per platform)",
                "Priority processing",
                "Better support"
            ],
            highlights: [
                "Most popular",
                "More AI capacity",
                "Faster turnaround"
            ],
            badge: "Most Popular",
            cta: "Get started"
        },
        ultimate: {
            title: "Ultimate",
            price: "$399",
            period: "/one-time",
            outcome: "Best for power users and agencies",
            includes: [
                "Everything in Pro",
                "Maximum quotas for scale",
                "Talking Head video credits included",
                "Premium support"
            ],
            highlights: [
                "Best value for teams",
                "Highest priority",
                "Agency-ready scale"
            ],
            badge: "Best Value",
            cta: "Get started"
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "packages",
        className: "scroll-mt-32 space-y-10 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]",
                        children: t("eyebrow")
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-3xl md:text-4xl font-semibold text-white",
                        children: t("title")
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-base text-[var(--hg-muted)] max-w-2xl mx-auto",
                        children: t("subtitle")
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/packages/Packages.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto px-4",
                children: packages.map((pkg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$common$2f$Reveal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        as: "div",
                        delay: i * 100,
                        className: "flex",
                        children: (()=>{
                            const rawPlan = t.raw(`plans.${pkg.id}`);
                            const plan = isPlanCopy(rawPlan) ? rawPlan : fallbackPlans[pkg.id];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `
                group relative isolate flex min-h-[400px] flex-col w-full rounded-3xl border p-4 md:p-5
                transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--hg-accent)]/50 hover:shadow-[0_14px_30px_rgba(80,192,240,0.16)]
                ${pkg.featured ? 'border-[var(--hg-border)] bg-[var(--hg-surface-2)] shadow-[0_18px_45px_rgba(0,0,0,0.38)]' : 'border-[var(--hg-border)] bg-[var(--hg-surface)] shadow-[0_18px_45px_rgba(0,0,0,0.35)]'}
              `,
                                children: [
                                    pkg.featured ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(900px_circle_at_50%_-20%,rgba(80,192,240,0.14),transparent_55%)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 204,
                                        columnNumber: 17
                                    }, this) : null,
                                    plan.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `rounded-full px-2 ${pkg.featured ? "bg-[var(--hg-surface-2)]" : "bg-[var(--hg-surface)]"}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center gap-1.5 rounded-full border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-accent)_14%,transparent)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#9fd9f3] shadow-[0_10px_22px_rgba(80,192,240,0.14)]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                        className: "h-3.5 w-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 21
                                                    }, this),
                                                    plan.badge
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                lineNumber: 215,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/packages/Packages.tsx",
                                            lineNumber: 210,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 209,
                                        columnNumber: 17
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--hg-border)] bg-white/[0.03]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(pkg.icon, {
                                            className: `h-6 w-6 ${pkg.featured ? "text-[var(--hg-accent)]" : "text-white/80"}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/packages/Packages.tsx",
                                            lineNumber: 224,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 223,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold text-white",
                                                children: plan.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                lineNumber: 229,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[var(--hg-muted)]",
                                                children: plan.outcome
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                lineNumber: 230,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 mb-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-baseline gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$outfit_971bf5f5$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].className} text-3xl md:text-4xl font-extrabold leading-none text-white`,
                                                    children: plan.price
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-base text-[var(--hg-muted)]",
                                                    children: plan.period
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                    lineNumber: 239,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/components/packages/Packages.tsx",
                                            lineNumber: 235,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]",
                                        children: t("includesLabel")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mb-6 space-y-3",
                                        children: plan.includes.map((feature, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start gap-3.5 text-sm md:text-[15px] leading-6 text-[var(--hg-muted)]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "h-5.5 w-5.5 shrink-0 text-[var(--hg-accent)] mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                        lineNumber: 248,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: feature
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                        lineNumber: 249,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                lineNumber: 247,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]",
                                        children: t("highlightsLabel")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-8 flex flex-wrap gap-2",
                                        children: plan.highlights.map((highlight)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center rounded-full border border-[var(--hg-border)] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/90",
                                                children: highlight
                                            }, highlight, false, {
                                                fileName: "[project]/src/app/components/packages/Packages.tsx",
                                                lineNumber: 257,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/${pkg.id}`,
                                        className: "mt-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `
                    h-12 w-full rounded-2xl text-sm font-semibold transition-all
                    ${pkg.featured ? 'bg-[var(--hg-accent)] text-[#04131d] hover:opacity-90 shadow-[0_10px_26px_rgba(80,192,240,0.35)]' : 'bg-[var(--hg-surface-2)] text-white border border-[var(--hg-border)] hover:border-[var(--hg-accent)]/50 group-hover:shadow-[inset_0_0_0_1px_rgba(80,192,240,0.35)]'}
                  `,
                                            children: plan.cta
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/packages/Packages.tsx",
                                            lineNumber: 268,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/packages/Packages.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this);
                        })()
                    }, pkg.id, false, {
                        fileName: "[project]/src/app/components/packages/Packages.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/components/packages/Packages.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/packages/Packages.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
_s(Packages, "h6+q2O3NJKPY5uL0BIJGLIanww8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"]
    ];
});
_c = Packages;
var _c;
__turbopack_context__.k.register(_c, "Packages");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/utils/sanitizeRedirect.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/utils/authRedirect.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildLoginHref",
    ()=>buildLoginHref,
    "inferPackageIdFromPath",
    ()=>inferPackageIdFromPath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$sanitizeRedirect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/sanitizeRedirect.ts [app-client] (ecmascript)");
;
const localePattern = /^(en|el|es|it)$/;
const packageIds = new Set([
    "lite",
    "pro",
    "ultimate"
]);
function detectLocalePrefix(pathname) {
    const first = pathname.split("/").filter(Boolean)[0];
    return first && localePattern.test(first) ? `/${first}` : "";
}
function inferPackageIdFromPath(path) {
    const safe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$sanitizeRedirect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeRedirect"])(path);
    const parts = safe.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean) || [];
    if (parts.length === 0) return null;
    const withoutLocale = localePattern.test(parts[0]) ? parts.slice(1) : parts;
    if (withoutLocale.length === 0) return null;
    const direct = withoutLocale[0];
    if (packageIds.has(direct)) return direct;
    const pkgIndex = withoutLocale.indexOf("packages");
    if (pkgIndex >= 0) {
        const candidate = withoutLocale[pkgIndex + 1];
        if (candidate && packageIds.has(candidate)) return candidate;
    }
    return null;
}
function buildLoginHref(pathname, nextPath, intent) {
    const safeNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$sanitizeRedirect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeRedirect"])(nextPath);
    const localePrefix = detectLocalePrefix(pathname);
    const params = new URLSearchParams({
        next: safeNext
    });
    if (intent) params.set("intent", intent);
    return `${localePrefix}/login?${params.toString()}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/cart/CartDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CartDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$packages$2f$Packages$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/packages/Packages.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/navigation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/cart/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$authRedirect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/authRedirect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
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
function CartDrawer({ isOpen, onClose }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { cartItems, removeFromCart, changeQty } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const { user, loading: userLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])({
        required: false
    });
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCheckingOut, setIsCheckingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const checkoutInFlight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeCheckoutInFlight"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCheckoutInFlightSnapshot"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCheckoutInFlightServerSnapshot"]);
    const currentPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CartDrawer.useMemo[currentPath]": ()=>{
            const query = searchParams.toString();
            return query ? `${pathname}?${query}` : pathname;
        }
    }["CartDrawer.useMemo[currentPath]"], [
        pathname,
        searchParams
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartDrawer.useEffect": ()=>{
            setIsMounted(true);
        }
    }["CartDrawer.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartDrawer.useEffect": ()=>{
            document.body.style.overflow = isOpen ? "hidden" : "auto";
            return ({
                "CartDrawer.useEffect": ()=>{
                    document.body.style.overflow = "auto";
                }
            })["CartDrawer.useEffect"];
        }
    }["CartDrawer.useEffect"], [
        isOpen
    ]);
    // Avoid rendering cart contents until after mount
    if (!isMounted) return null;
    const itemCount = cartItems.reduce((acc, item)=>acc + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item)=>{
        const pkg = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$packages$2f$Packages$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["packages"].find((p)=>p.id === item.id);
        if (!pkg) return sum;
        const priceNum = Number(pkg.price.replace(/[^0-9.-]+/g, ""));
        return sum + priceNum * item.quantity;
    }, 0);
    const handleStripePayment = async ()=>{
        if (!cartItems.length || isCheckingOut || checkoutInFlight || userLoading) return;
        if (!user) {
            router.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$authRedirect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLoginHref"])(pathname, currentPath, "checkout"));
            return;
        }
        setIsCheckingOut(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startCheckout"])(cartItems[0].id);
        } catch (error) {
            console.error("Stripe checkout error:", error);
            setIsCheckingOut(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `fixed top-0 right-0 w-full sm:w-[400px] h-full bg-[#232B36] border-l border-[#2e3643] shadow-2xl transition-transform duration-300 z-50 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`,
        style: {
            maxWidth: 420
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center p-6 border-b border-[#2e3643] bg-[#1c2330]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white tracking-tight",
                        children: [
                            "Cart ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-light",
                                children: "•"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                lineNumber: 91,
                                columnNumber: 16
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-cyan-400",
                                children: [
                                    itemCount,
                                    " ",
                                    itemCount === 1 ? "item" : "items"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        "aria-label": "Close cart",
                        className: "flex items-center justify-center w-9 h-9 rounded-full bg-[#222735] text-white hover:text-cyan-400 hover:bg-[#232B36] transition border border-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-cyan-500 text-2xl font-bold",
                        children: "×"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 py-6 space-y-6",
                children: cartItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-gray-400 py-24 text-center select-none opacity-75 text-base",
                    children: "Cart is empty."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                    lineNumber: 108,
                    columnNumber: 11
                }, this) : cartItems.map((item)=>{
                    const pkg = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$packages$2f$Packages$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["packages"].find((p)=>p.id === item.id);
                    if (!pkg) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 bg-[#181F28] rounded-xl shadow border border-[#232B36] px-4 py-4 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center w-16 h-16 bg-[#222735] rounded-xl overflow-hidden border border-[#2e3643]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/echofy-removebg-preview.png",
                                    alt: pkg.title,
                                    width: 320,
                                    height: 320,
                                    className: "object-cover w-full h-full"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                    lineNumber: 121,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                lineNumber: 120,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0 relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-label": "Remove item",
                                        onClick: ()=>removeFromCart(item.id),
                                        className: "absolute top-2 right-2 p-1 rounded-full hover:text-red-500 text-gray-400 transition bg-transparent",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                            lineNumber: 135,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                        lineNumber: 130,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-1 mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-bold text-lg",
                                                children: pkg.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                                lineNumber: 138,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-cyan-400 font-semibold text-md",
                                                children: pkg.price
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                                lineNumber: 139,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                        lineNumber: 137,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>changeQty(item.id, Math.max(1, item.quantity - 1)),
                                                disabled: item.quantity === 1,
                                                className: "w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-white text-xl bg-[#181F28] hover:bg-[#181F28] hover:text-cyan-400 transition disabled:opacity-60",
                                                children: "−"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                                lineNumber: 144,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white font-semibold text-lg",
                                                children: item.quantity
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                                lineNumber: 153,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>changeQty(item.id, item.quantity + 1),
                                                className: "w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-white text-xl bg-[#181F28] hover:bg-[#181F28] hover:text-cyan-400 transition",
                                                children: "+"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                                lineNumber: 156,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                        lineNumber: 143,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                lineNumber: 129,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                        lineNumber: 116,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-[#2e3643] bg-[#232B36] px-6 pt-5 pb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center text-lg font-bold text-white mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Subtotal"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-cyan-400",
                                children: [
                                    "$",
                                    subtotal
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: cartItems.length === 0 || isCheckingOut || checkoutInFlight,
                        onClick: handleStripePayment,
                        className: "w-full mt-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 transition text-lg font-semibold py-4 rounded-xl shadow-lg disabled:opacity-60",
                        children: [
                            "Check out • $",
                            subtotal
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/cart/CartDrawer.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
_s(CartDrawer, "20VrvsPCpzEbN9MWfXNiKYypCaw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = CartDrawer;
var _c;
__turbopack_context__.k.register(_c, "CartDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/auth/AuthForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/navigation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/fetcher.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/hooks/useUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$authRedirect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/authRedirect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
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
const loginEndpoint = "/api/auth/login";
const meEndpoint = "/api/auth/me";
function AuthForm({ redirectTo, intent, onSuccess, footnote, submitLabel }) {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])("auth");
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleSubmit(e) {
        e.preventDefault();
        if (!email) return;
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(loginEndpoint, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email
                })
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || t("errors.signInFailed"));
            }
            const verify = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$fetcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchJson"])(meEndpoint, {
                method: "GET",
                cache: "no-store"
            });
            if (!verify.ok) {
                throw new Error(t("errors.verifyFailed"));
            }
            try {
                sessionStorage.setItem("justLoggedIn", "1");
            } catch  {}
            try {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearUserCache"])();
            } catch  {}
            router.refresh();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$hooks$2f$useUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyAuthChange"])();
            onSuccess?.();
            const target = redirectTo || "/";
            const packageState = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkUserPackage"])({
                force: true
            }).catch(()=>null);
            const hasActiveAccess = Boolean(packageState?.hasAccess && packageState?.packageInstanceId);
            if (hasActiveAccess) {
                router.replace("/dashboard");
                return;
            }
            if (intent === "checkout") {
                const packageId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$authRedirect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inferPackageIdFromPath"])(target);
                if (packageId) {
                    router.push(`/checkout?packageId=${encodeURIComponent(packageId)}`);
                    return;
                }
            }
            router.push(target);
        } catch (err) {
            setError(err?.message || t("errors.signInFailed"));
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "auth-email",
                        className: "mb-1 block text-sm text-[var(--hg-muted)]",
                        children: t("emailLabel")
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/auth/AuthForm.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "auth-email",
                        type: "email",
                        value: email,
                        onChange: (e)=>setEmail(e.target.value),
                        className: "w-full rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--hg-accent)]/60",
                        placeholder: t("emailPlaceholder"),
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/auth/AuthForm.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/auth/AuthForm.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/components/auth/AuthForm.tsx",
                lineNumber: 105,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: !email || loading,
                className: "w-full rounded-xl bg-[var(--hg-accent)] py-2.5 font-semibold text-[#07131d] shadow-lg transition disabled:opacity-60",
                children: loading ? t("signingIn") : submitLabel || t("continueWithEmail")
            }, void 0, false, {
                fileName: "[project]/src/app/components/auth/AuthForm.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            footnote || t("emailFootnote") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center text-xs text-[var(--hg-muted)]",
                children: footnote || t("emailFootnote")
            }, void 0, false, {
                fileName: "[project]/src/app/components/auth/AuthForm.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/auth/AuthForm.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(AuthForm, "glL/irkSSuoQTF4PDIqBwor5HVQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthForm;
var _c;
__turbopack_context__.k.register(_c, "AuthForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/auth/AuthModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$auth$2f$AuthForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/auth/AuthForm.tsx [app-client] (ecmascript)");
"use client";
;
;
function AuthModal({ open, onClose, redirectTo, onSuccess }) {
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full max-w-md rounded-2xl bg-[#0f1624] p-6 shadow-2xl border border-white/10",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "absolute right-3 top-3 text-gray-400 hover:text-white",
                    onClick: onClose,
                    "aria-label": "Close sign in modal",
                    children: "×"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/auth/AuthModal.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm uppercase tracking-widest text-cyan-400",
                            children: "Welcome back"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/auth/AuthModal.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white",
                            children: "Sign in to continue"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/auth/AuthModal.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-400",
                            children: "Enter your email to access premium tools."
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/auth/AuthModal.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/auth/AuthModal.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$auth$2f$AuthForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    redirectTo: redirectTo,
                    onSuccess: ()=>{
                        onClose();
                        if (onSuccess) onSuccess();
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/components/auth/AuthModal.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/auth/AuthModal.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/auth/AuthModal.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = AuthModal;
var _c;
__turbopack_context__.k.register(_c, "AuthModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/auth/AuthModalContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthModalProvider",
    ()=>AuthModalProvider,
    "useAuthModal",
    ()=>useAuthModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$auth$2f$AuthModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/auth/AuthModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthModalContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthModalProvider({ children }) {
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [options, setOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const handleOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthModalProvider.useCallback[handleOpen]": (opts)=>{
            setOptions(opts);
            setOpen(true);
        }
    }["AuthModalProvider.useCallback[handleOpen]"], []);
    const handleClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthModalProvider.useCallback[handleClose]": ()=>{
            setOpen(false);
        }
    }["AuthModalProvider.useCallback[handleClose]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthModalContext.Provider, {
        value: {
            open: handleOpen
        },
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$auth$2f$AuthModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: open,
                onClose: handleClose,
                redirectTo: options?.redirectTo,
                onSuccess: options?.onSuccess
            }, void 0, false, {
                fileName: "[project]/src/app/components/auth/AuthModalContext.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/auth/AuthModalContext.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(AuthModalProvider, "Qq5nF23z7/nAriKw6+GlOpHyeZc=");
_c = AuthModalProvider;
function useAuthModal() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthModalContext);
    if (!ctx) {
        throw new Error("useAuthModal must be used within an AuthModalProvider");
    }
    return ctx;
}
_s1(useAuthModal, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AuthModalProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/layout/AppShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/navigation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$navigation$2f$RouteTransitionOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/navigation/RouteTransitionOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$navigation$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/navigation/Navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$navigation$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/navigation/Footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/consent/ConsentContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/consent/ConsentBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/consent/ConsentModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/cart/CartDrawer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/cart/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$auth$2f$AuthModalContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/auth/AuthModalContext.tsx [app-client] (ecmascript)");
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
function AppShell({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [cartDrawerOpen, setCartDrawerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleCartClick = ()=>setCartDrawerOpen(true);
    const pathWithoutLocale = (()=>{
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length === 0) return "/";
        if ([
            "en",
            "el",
            "es",
            "it"
        ].includes(parts[0])) {
            const stripped = `/${parts.slice(1).join("/")}`;
            return stripped === "/" ? "/" : stripped;
        }
        return pathname;
    })();
    const useLandingShell = pathWithoutLocale === "/" || /^\/(lite|pro|ultimate)$/.test(pathWithoutLocale) || pathWithoutLocale === "/login" || pathWithoutLocale === "/signup" || pathWithoutLocale === "/privacy" || pathWithoutLocale === "/terms" || pathWithoutLocale === "/cookies";
    const isDashboardRoute = pathWithoutLocale.startsWith("/dashboard");
    const isAiDashboardRoute = pathWithoutLocale.startsWith("/dashboard/ai");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConsentProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$auth$2f$AuthModalContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthModalProvider"], {
                children: [
                    !isDashboardRoute && !useLandingShell && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$navigation$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onCartClick: handleCartClick
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/layout/AppShell.tsx",
                        lineNumber: 48,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-grow",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/layout/AppShell.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$navigation$2f$RouteTransitionOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/components/layout/AppShell.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this),
                    !isAiDashboardRoute && !useLandingShell && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$navigation$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/components/layout/AppShell.tsx",
                        lineNumber: 54,
                        columnNumber: 55
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/components/layout/AppShell.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$consent$2f$ConsentModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/components/layout/AppShell.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$cart$2f$CartDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        isOpen: cartDrawerOpen,
                        onClose: ()=>setCartDrawerOpen(false),
                        onCheckout: ()=>{}
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/layout/AppShell.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/layout/AppShell.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/components/layout/AppShell.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/components/layout/AppShell.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(AppShell, "SlCMJvP+nf8xEIDelYTtxVHpS7A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AppShell;
var _c;
__turbopack_context__.k.register(_c, "AppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__4e5e4096._.js.map