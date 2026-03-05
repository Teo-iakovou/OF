(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/components/AIchat/QuickPromptsBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QuickPromptsBar",
    ()=>QuickPromptsBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function QuickPromptsBar({ prompts, onPick, className = "", label = "Suggested prompts", sendOnClick = false }) {
    if (!prompts || prompts.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-full ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-1 text-xs font-medium text-gray-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/app/components/AIchat/QuickPromptsBar.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2",
                children: prompts.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onPick(p, {
                                send: sendOnClick
                            }),
                        title: p,
                        className: "text-left px-3 py-2 rounded-lg bg-[#202636] border border-gray-700/70 hover:border-gray-600 hover:bg-[#253045] text-gray-100 text-xs leading-snug transition",
                        children: p
                    }, `${i}-${p.slice(0, 28)}`, false, {
                        fileName: "[project]/src/app/components/AIchat/QuickPromptsBar.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/components/AIchat/QuickPromptsBar.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/AIchat/QuickPromptsBar.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = QuickPromptsBar;
var _c;
__turbopack_context__.k.register(_c, "QuickPromptsBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/AIchat/AssistantFooter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/components/AIchat/AssistantFooter.tsx
__turbopack_context__.s([
    "AssistantFooter",
    ()=>AssistantFooter
]);
"use client";
function AssistantFooter(props) {
    void props; // silence no-unused-vars
    return null; // never renders anything
}
_c = AssistantFooter;
var _c;
__turbopack_context__.k.register(_c, "AssistantFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/AIchat/CreditsChip.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreditsChip",
    ()=>CreditsChip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function CreditsChip({ used, limit }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700",
        title: "Monthly chat credits",
        children: [
            "Chat: ",
            used,
            "/",
            limit
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/AIchat/CreditsChip.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = CreditsChip;
var _c;
__turbopack_context__.k.register(_c, "CreditsChip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/AIchat/UpgradeCta.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UpgradeCta",
    ()=>UpgradeCta
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/urls.ts [app-client] (ecmascript)");
;
;
function UpgradeCta({ href = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKAGES_URL"] }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: href,
        className: "inline-flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white hover:opacity-90",
        children: "Upgrade to continue"
    }, void 0, false, {
        fileName: "[project]/src/app/components/AIchat/UpgradeCta.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = UpgradeCta;
var _c;
__turbopack_context__.k.register(_c, "UpgradeCta");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/AIchat/CoachChat.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$QuickPromptsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/AIchat/QuickPromptsBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$AssistantFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/AIchat/AssistantFooter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$CreditsChip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/AIchat/CreditsChip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$UpgradeCta$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/AIchat/UpgradeCta.tsx [app-client] (ecmascript)");
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
function CoachChat({ latestContentInfo, initialConversationId, onNewConversation, onContextChange, layout = "panel" }) {
    _s();
    var _s1 = __turbopack_context__.k.signature();
    const [conversation, setConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSending, setIsSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // FIX: start false; only show skeleton when we really fetch history
    const [bootstrapping, setBootstrapping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLimited, setIsLimited] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isContextLimited, setIsContextLimited] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contextNearLimit, setContextNearLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contextInfo, setContextInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [contextActionLoading, setContextActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [credits, setCredits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [prompts, setPrompts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [promptsLoading, setPromptsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showPrompts, setShowPrompts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chatEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // FIX: track which conversationId we've already loaded to avoid refetch/remount blink
    const loadedIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ---- typing animation ("word by word") ----
    const STREAM_WORD_DELAY = 24; // ms between tokens (~40–60 feels ChatGPT-like)
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isStreaming, setIsStreaming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // kick off a stream for conv._id + a specific message index
    function startStreaming(s) {
        streamRef.current = s;
        setIsStreaming(true);
    }
    // drive the streaming loop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoachChat.useEffect": ()=>{
            if (!isStreaming) return;
            const id = setInterval({
                "CoachChat.useEffect.id": ()=>{
                    const s = streamRef.current;
                    if (!s) {
                        clearInterval(id);
                        setIsStreaming(false);
                        return;
                    }
                    const nextPos = s.pos + 1;
                    setConversation({
                        "CoachChat.useEffect.id": (prev)=>{
                            if (!prev || prev._id !== s.convId) return prev;
                            if (!prev.messages[s.msgIndex]) return prev;
                            const text = s.tokens.slice(0, nextPos).join(""); // tokens include spaces
                            const msgs = [
                                ...prev.messages
                            ];
                            msgs[s.msgIndex] = {
                                ...msgs[s.msgIndex],
                                content: text
                            };
                            return {
                                ...prev,
                                messages: msgs
                            };
                        }
                    }["CoachChat.useEffect.id"]);
                    // keep scroll pinned to bottom while streaming
                    chatEndRef.current?.scrollIntoView({
                        behavior: "smooth"
                    });
                    if (nextPos >= s.tokens.length) {
                        streamRef.current = null;
                        clearInterval(id);
                        setIsStreaming(false);
                    } else {
                        streamRef.current = {
                            ...s,
                            pos: nextPos
                        };
                    }
                }
            }["CoachChat.useEffect.id"], STREAM_WORD_DELAY);
            return ({
                "CoachChat.useEffect": ()=>clearInterval(id)
            })["CoachChat.useEffect"];
        }
    }["CoachChat.useEffect"], [
        isStreaming
    ]);
    // Split into word + whitespace tokens so spacing is natural.
    function tokenizeWordsWithSpaces(s) {
        return s.match(/\S+|\s+/g) ?? [];
    }
    // ----- textarea auto-grow -----
    const autoGrow = ()=>{
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "0px";
        el.style.height = `${el.scrollHeight}px`;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoachChat.useEffect": ()=>{
            autoGrow();
        }
    }["CoachChat.useEffect"], [
        input
    ]);
    // ----- autoscroll (count-based to avoid extra renders) -----
    const prevMsgCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const messageCount = conversation?.messages?.length ?? 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoachChat.useEffect": ()=>{
            if (messageCount > prevMsgCount.current) {
                chatEndRef.current?.scrollIntoView({
                    behavior: "smooth"
                });
            }
            prevMsgCount.current = messageCount;
        }
    }["CoachChat.useEffect"], [
        messageCount
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoachChat.useEffect": ()=>{
            if (!onContextChange) return;
            if (!conversation || !conversation._id) {
                onContextChange(null);
                return;
            }
            onContextChange({
                tokensUsed: conversation.tokensUsed,
                tokensLimit: conversation.tokensLimit,
                nearLimit: conversation.nearLimit
            });
        }
    }["CoachChat.useEffect"], [
        conversation,
        onContextChange
    ]);
    // ----- Load existing conversation by id (guarded) -----
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoachChat.useEffect": ()=>{
            let ignore = false;
            const id = initialConversationId;
            if (!id) return;
            // If we already adopted/loaded this id, skip
            if (loadedIdRef.current === id) return;
            if (conversation && conversation._id === id) {
                loadedIdRef.current = id;
                return;
            }
            setBootstrapping(true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchConversation"])(id).then({
                "CoachChat.useEffect": (c)=>{
                    if (ignore) return;
                    setConversation(c);
                    loadedIdRef.current = id;
                    // Show prompts only if there are no messages
                    setShowPrompts((c?.messages?.length ?? 0) === 0);
                }
            }["CoachChat.useEffect"]).finally({
                "CoachChat.useEffect": ()=>{
                    if (!ignore) setBootstrapping(false);
                }
            }["CoachChat.useEffect"]);
            return ({
                "CoachChat.useEffect": ()=>{
                    ignore = true;
                }
            })["CoachChat.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["CoachChat.useEffect"], [
        initialConversationId
    ]);
    // ----- Quick Prompts (load once per user) -----
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoachChat.useEffect": ()=>{
            let ignore = false;
            setPromptsLoading(true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCoachChatPrompts"])().then({
                "CoachChat.useEffect": (r)=>{
                    if (!ignore) setPrompts(r.prompts || []);
                }
            }["CoachChat.useEffect"]).catch({
                "CoachChat.useEffect": ()=>{
                    if (!ignore) setPrompts([
                        "Give me a catchy caption for my last upload",
                        "Suggest 5 niche hashtags for my audience",
                        "What are my best times to post this week?"
                    ]);
                }
            }["CoachChat.useEffect"]).finally({
                "CoachChat.useEffect": ()=>{
                    if (!ignore) setPromptsLoading(false);
                }
            }["CoachChat.useEffect"]);
            return ({
                "CoachChat.useEffect": ()=>{
                    ignore = true;
                }
            })["CoachChat.useEffect"];
        }
    }["CoachChat.useEffect"], []); // FIX: don't refetch on every new message
    const handleStartNewChat = async ()=>{
        if (contextActionLoading) return;
        setIsLimited(false);
        setIsContextLimited(false);
        setContextNearLimit(false);
        setContextInfo(null);
        setConversation(null);
        setInput("");
        setShowPrompts(true);
        setContextActionLoading(true);
        try {
            const newId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyConversation"])();
            if (newId) {
                const nextConversation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchConversation"])(newId);
                if (nextConversation) {
                    setConversation(nextConversation);
                }
                loadedIdRef.current = newId;
                onNewConversation?.(newId);
            }
        } finally{
            setContextActionLoading(false);
        }
    };
    const handleSummarizeContinue = async ()=>{
        if (contextActionLoading || !conversation?._id) return;
        setContextActionLoading(true);
        try {
            const summarized = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["summarizeConversation"])(conversation._id);
            if (summarized?.newConversationId) {
                const nextConversation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchConversation"])(summarized.newConversationId);
                if (nextConversation) {
                    setConversation(nextConversation);
                } else {
                    setConversation(null);
                }
                setInput("");
                setIsContextLimited(false);
                setContextNearLimit(false);
                setContextInfo(null);
                loadedIdRef.current = summarized.newConversationId;
                onNewConversation?.(summarized.newConversationId);
            }
        } finally{
            setContextActionLoading(false);
        }
    };
    const sendMessage = async (e)=>{
        e?.preventDefault();
        const text = input.trim();
        if (!text || isSending || isLimited || isContextLimited) return;
        setShowPrompts(false);
        setIsSending(true);
        setError(null);
        setContextNearLimit(false);
        // optimistic message
        const previousConversation = conversation;
        const optimistic = conversation ? {
            ...conversation,
            messages: [
                ...conversation.messages,
                {
                    role: "user",
                    content: text
                }
            ]
        } : {
            _id: "temp",
            messages: [
                {
                    role: "user",
                    content: text
                }
            ]
        };
        setConversation(optimistic);
        setInput("");
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["coachChat"])({
                question: text,
                latestContentInfo,
                conversationId: conversation?._id,
                title: conversation?.title || "AI Coach Chat"
            });
            switch(res.status){
                case 402:
                    {
                        const data = res.data;
                        setIsLimited(true);
                        setError(data.error || "You’ve reached your plan’s chat limit.");
                        if (data.quota) setCredits(data.quota);
                        setIsSending(false);
                        if (!conversation?._id) setConversation(null);
                        return;
                    }
                case 429:
                    {
                        const data = res.data;
                        setError(data.message || data.error || "You’re sending messages too fast. Try again shortly.");
                        setIsSending(false);
                        if (!conversation?._id) setConversation(null);
                        return;
                    }
                case 409:
                    {
                        const data = res.data;
                        setIsContextLimited(true);
                        setContextInfo({
                            used: data.tokensUsed,
                            limit: data.tokensLimit
                        });
                        setIsSending(false);
                        setConversation(previousConversation || null);
                        return;
                    }
                case 200:
                    {
                        const data = res.data;
                        // shallow copy + attach meta to last assistant
                        const conv = {
                            ...data.conversation
                        };
                        let lastAssistantIndex = -1;
                        for(let i = conv.messages.length - 1; i >= 0; i--){
                            if (conv.messages[i].role === "assistant") {
                                lastAssistantIndex = i;
                                conv.messages[i] = {
                                    ...conv.messages[i],
                                    meta: {
                                        usedContextIds: data.usedContextIds,
                                        requestId: data.requestId,
                                        latencyMs: data.latencyMs
                                    }
                                };
                                break;
                            }
                        }
                        // If we have an assistant message, animate its content.
                        if (lastAssistantIndex >= 0) {
                            const full = conv.messages[lastAssistantIndex].content || "";
                            // render empty first, then stream in
                            conv.messages[lastAssistantIndex] = {
                                ...conv.messages[lastAssistantIndex],
                                content: ""
                            };
                            setConversation(conv);
                            // start typewriter
                            startStreaming({
                                convId: conv._id,
                                msgIndex: lastAssistantIndex,
                                tokens: tokenizeWordsWithSpaces(full),
                                pos: 0
                            });
                        } else {
                            // fallback (no assistant message found)
                            setConversation(conv);
                        }
                        setIsSending(false);
                        if (data.quota) setCredits(data.quota);
                        setIsContextLimited(false);
                        setContextNearLimit(Boolean(data.nearContextLimit));
                        if (typeof data.tokensUsed === "number" || typeof data.tokensLimit === "number") {
                            setContextInfo({
                                used: data.tokensUsed ?? undefined,
                                limit: data.tokensLimit ?? undefined
                            });
                        }
                        // first message in brand-new chat?
                        const wasFirstUserMessage = optimistic.messages.length === 1;
                        if (wasFirstUserMessage && conv._id) {
                            loadedIdRef.current = conv._id;
                            onNewConversation?.(conv._id);
                            try {
                                const title = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateConversationTitle"])(conv._id, text);
                                if (title) setConversation((prev)=>prev ? {
                                        ...prev,
                                        title
                                    } : prev);
                            } catch  {}
                        }
                        return;
                    }
                default:
                    {
                        const data = res.data;
                        setError(data.error || data.message || "Chat failed. Please try again.");
                        setIsSending(false);
                        if (!conversation?._id) setConversation(null);
                        return;
                    }
            }
        } catch (err) {
            console.error("CoachChat sendMessage error:", err);
            setError("Something went wrong sending your message. Please try again.");
            if (!conversation?._id) setConversation(null);
            setIsSending(false);
        }
    };
    const handleKeyDown = (e)=>{
        if (isSending || isLimited || isContextLimited) return;
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    function CopyButton({ text }) {
        _s1();
        const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
        async function onCopy() {
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(()=>setCopied(false), 1200);
            } catch  {
            // no-op; you could surface an error banner if you want
            }
        }
        const disabled = !text?.trim();
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onCopy,
            disabled: disabled,
            className: `inline-flex items-center gap-1 text-xs font-medium transition
        ${disabled ? "opacity-40 cursor-not-allowed" : "text-gray-400 hover:text-gray-200"}`,
            "aria-label": copied ? "Copied" : "Copy answer",
            title: copied ? "Copied" : "Copy",
            children: [
                copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                    lineNumber: 445,
                    columnNumber: 17
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                    lineNumber: 445,
                    columnNumber: 49
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: copied ? "Copied" : "Copy"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                    lineNumber: 446,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
            lineNumber: 436,
            columnNumber: 5
        }, this);
    }
    _s1(CopyButton, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
    const isEmpty = !bootstrapping && !conversation?.messages?.length;
    const isPageLayout = layout === "page";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full min-h-0",
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-2xl mx-auto px-4 mb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border border-red-600/40 bg-red-600/10 text-red-300 text-sm px-3 py-2",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                    lineNumber: 460,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                lineNumber: 459,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: [
                    "flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 md:px-4",
                    isEmpty ? "flex items-center justify-center py-0" : "py-6",
                    isPageLayout ? "pb-40" : "",
                    isPageLayout && isEmpty ? "min-h-[60vh]" : ""
                ].join(" "),
                style: {
                    scrollbarGutter: "stable"
                },
                children: [
                    bootstrapping ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-pulse space-y-3 w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 w-2/3 rounded-xl bg-gray-200/40"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 478,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 w-1/2 rounded-xl bg-gray-200/40"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 479,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 w-3/5 rounded-xl bg-gray-200/40"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 480,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 477,
                        columnNumber: 5
                    }, this) : isEmpty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 text-center italic",
                        children: "Start your conversation with the AI coach..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 483,
                        columnNumber: 5
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            conversation.messages.map((msg, idx)=>{
                                if (msg.role === "system") return null;
                                const isUser = msg.role === "user";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `mb-4 ${isUser ? "flex justify-end" : "block"}`,
                                    children: isUser ? // USER (question) — colored bubble, right-aligned
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-2 text-sm md:text-base max-w-[85%] rounded-2xl leading-relaxed shadow-md bg-blue-600 text-white",
                                        children: msg.content
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                        lineNumber: 495,
                                        columnNumber: 9
                                    }, this) : // ASSISTANT (answer) — no bubble, left-aligned
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-w-3xl text-gray-100 leading-relaxed",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "whitespace-pre-wrap",
                                                children: msg.content
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                                lineNumber: 501,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 flex items-center gap-3",
                                                children: [
                                                    !(streamRef.current && conversation && streamRef.current.convId === conversation._id && streamRef.current.msgIndex === idx) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyButton, {
                                                            text: msg.content
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                                            lineNumber: 510,
                                                            columnNumber: 17
                                                        }, this)
                                                    }, void 0, false),
                                                    msg.meta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$AssistantFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssistantFooter"], {
                                                        meta: msg.meta
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                                        lineNumber: 513,
                                                        columnNumber: 26
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                                lineNumber: 506,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                        lineNumber: 500,
                                        columnNumber: 9
                                    }, this)
                                }, msg._id || idx, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 492,
                                    columnNumber: 5
                                }, this);
                            }),
                            isSending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center gap-1 text-gray-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.2s]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                            lineNumber: 525,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-2 w-2 rounded-full bg-current animate-bounce"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                            lineNumber: 526,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                            lineNumber: 527,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 524,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 523,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: chatEndRef
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 535,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                lineNumber: 467,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: sendMessage,
                className: [
                    "shrink-0 w-full max-w-2xl mx-auto px-4 py-3 border-t border-gray-700/50",
                    isPageLayout ? "fixed inset-x-0 bottom-0 z-30 bg-transparent" : "bg-transparent"
                ].join(" "),
                style: {
                    paddingBottom: "env(safe-area-inset-bottom, 0px)"
                },
                children: [
                    isContextLimited ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold",
                                children: "Context limit reached."
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 549,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-amber-200",
                                children: "Start a new chat or summarize to continue this thread."
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 550,
                                columnNumber: 13
                            }, this),
                            contextInfo?.limit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-xs text-amber-200",
                                children: [
                                    Number(contextInfo.used ?? 0).toLocaleString(),
                                    " / ",
                                    Number(contextInfo.limit).toLocaleString(),
                                    " tokens"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 554,
                                columnNumber: 15
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 flex flex-wrap gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleStartNewChat,
                                        disabled: contextActionLoading,
                                        className: "rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-500/30 disabled:opacity-60",
                                        children: "Start new chat"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                        lineNumber: 559,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleSummarizeContinue,
                                        disabled: contextActionLoading,
                                        className: "rounded-lg border border-amber-400/50 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:border-amber-300 disabled:opacity-60",
                                        children: "Summarize and continue"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                        lineNumber: 567,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 558,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 548,
                        columnNumber: 11
                    }, this) : null,
                    !isContextLimited && contextNearLimit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold",
                                children: "Context window nearly full."
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 581,
                                columnNumber: 13
                            }, this),
                            " ",
                            "Start a new chat to keep things fast.",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleStartNewChat,
                                className: "ml-2 rounded-md border border-amber-400/40 px-2 py-0.5 text-[11px] font-semibold text-amber-100 hover:border-amber-300",
                                children: "Start new chat"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 583,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 580,
                        columnNumber: 11
                    }, this) : null,
                    showPrompts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-2xl mx-auto px-0 mb-3",
                        children: promptsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-40"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 597,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-48"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 598,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-56"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 599,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-36"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 600,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                            lineNumber: 596,
                            columnNumber: 15
                        }, this) : prompts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$QuickPromptsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuickPromptsBar"], {
                            prompts: prompts,
                            onPick: (text)=>{
                                setInput(text);
                                setShowPrompts(false);
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                            lineNumber: 603,
                            columnNumber: 15
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 594,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 flex items-center justify-between",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                credits && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$CreditsChip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditsChip"], {
                                    used: credits.used,
                                    limit: credits.limit
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 616,
                                    columnNumber: 25
                                }, this),
                                isLimited && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$UpgradeCta$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UpgradeCta"], {}, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 617,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                            lineNumber: 615,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 614,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 bg-[#1a1f2b] border border-gray-700 rounded-xl px-3 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                ref: textareaRef,
                                className: "flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-base leading-[1.5] pt-[0.65rem] pb-[0.65rem] overflow-hidden",
                                placeholder: isContextLimited ? "Context limit reached. Start a new chat or summarize." : isLimited ? "Upgrade to continue chatting…" : "Type your message...",
                                value: input,
                                onChange: (e)=>setInput(e.target.value),
                                onInput: autoGrow,
                                onKeyDown: handleKeyDown,
                                disabled: isSending || isLimited || isContextLimited,
                                rows: 1,
                                style: {
                                    minHeight: 44
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 622,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "h-10 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition disabled:opacity-60",
                                type: "submit",
                                disabled: !input.trim() || isSending || isLimited || isContextLimited,
                                "aria-disabled": isSending || isLimited || isContextLimited,
                                children: isSending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                            lineNumber: 649,
                                            columnNumber: 17
                                        }, this),
                                        "Sending…"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 648,
                                    columnNumber: 15
                                }, this) : "Send"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 641,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 621,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                lineNumber: 539,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
        lineNumber: 456,
        columnNumber: 5
    }, this);
}
_s(CoachChat, "7cchd6Zo+myo9RYvLes+bhmNR5Y=");
_c = CoachChat;
const __TURBOPACK__default__export__ = /*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(CoachChat);
var _c, _c1;
__turbopack_context__.k.register(_c, "CoachChat");
__turbopack_context__.k.register(_c1, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/AIchat/CoachChat.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/components/AIchat/CoachChat.tsx [app-client] (ecmascript)"));
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
]);

//# sourceMappingURL=_13ed908b._.js.map