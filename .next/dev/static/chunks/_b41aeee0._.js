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
"[project]/src/app/components/ui/Skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function Skeleton({ className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            "animate-pulse rounded-md bg-gray-200/20 dark:bg-gray-700/40",
            className
        ].join(" "),
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/app/components/ui/Skeleton.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
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
;
function UpgradeCta({ href = "/dashboard/billing" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: href,
        className: "inline-flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white hover:opacity-90",
        children: "Upgrade to continue"
    }, void 0, false, {
        fileName: "[project]/src/app/components/AIchat/UpgradeCta.tsx",
        lineNumber: 5,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript) <export default as Volume2>");
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
function CoachChat({ latestContentInfo, initialConversationId, onNewConversation, layout = "panel" }) {
    _s();
    var _s1 = __turbopack_context__.k.signature();
    const [conversation, setConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSending, setIsSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // FIX: start false; only show skeleton when we really fetch history
    const [bootstrapping, setBootstrapping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLimited, setIsLimited] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [credits, setCredits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [prompts, setPrompts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [promptsLoading, setPromptsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showPrompts, setShowPrompts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chatEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [playingKey, setPlayingKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const ttsSeqRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
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
    // Split into ~400-char chunks by sentence to reduce initial latency on long texts
    function chunkText(s, maxLen = 400) {
        const parts = s.split(/(?<=[\.!?])\s+/);
        const out = [];
        let buf = "";
        for (const p of parts){
            if ((buf + (buf ? " " : "") + p).length > maxLen) {
                if (buf) out.push(buf);
                buf = p;
            } else {
                buf = buf ? buf + " " + p : p;
            }
        }
        if (buf) out.push(buf);
        return out.length ? out : [
            s
        ];
    }
    async function playTTS(key, text) {
        try {
            // Toggle off if same key is playing
            if (playingKey === key) {
                audioRef.current?.pause();
                audioRef.current = null;
                setPlayingKey(null);
                return;
            }
            // Stop any existing playback
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setPlayingKey(key);
            const seq = ++ttsSeqRef.current;
            const chunks = text.length > 500 ? chunkText(text) : [
                text
            ];
            let idx = 0;
            const playNext = async ()=>{
                if (ttsSeqRef.current !== seq) return; // cancelled by a newer request
                if (idx >= chunks.length) {
                    setPlayingKey((k)=>k === key ? null : k);
                    return;
                }
                const ck = `${key}#${idx}`;
                let url = audioCache.current.get(ck);
                if (!url) {
                    url = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ttsSynthesize"])(chunks[idx], {});
                    audioCache.current.set(ck, url);
                }
                const audio = new Audio(url);
                audioRef.current = audio;
                audio.onended = ()=>{
                    if (ttsSeqRef.current !== seq) return;
                    idx += 1;
                    playNext();
                };
                audio.onerror = ()=>{
                    if (ttsSeqRef.current !== seq) return;
                    idx += 1;
                    playNext();
                };
                await audio.play().catch(()=>{
                    setPlayingKey((k)=>k === key ? null : k);
                });
            };
            playNext();
        } catch  {
            setPlayingKey(null);
        }
    }
    // Stop audio on unmount or route change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoachChat.useEffect": ()=>{
            return ({
                "CoachChat.useEffect": ()=>{
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current = null;
                    }
                    setPlayingKey(null);
                    ttsSeqRef.current += 1;
                }
            })["CoachChat.useEffect"];
        }
    }["CoachChat.useEffect"], []);
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
    const sendMessage = async (e)=>{
        e?.preventDefault();
        const text = input.trim();
        if (!text || isSending || isLimited) return;
        setShowPrompts(false);
        setIsSending(true);
        setError(null);
        // optimistic message
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
        if (isSending || isLimited) return;
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
                    lineNumber: 442,
                    columnNumber: 17
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                    lineNumber: 442,
                    columnNumber: 49
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: copied ? "Copied" : "Copy"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                    lineNumber: 443,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
            lineNumber: 433,
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
                    lineNumber: 457,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                lineNumber: 456,
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
                                lineNumber: 475,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 w-1/2 rounded-xl bg-gray-200/40"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 476,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 w-3/5 rounded-xl bg-gray-200/40"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 477,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 474,
                        columnNumber: 5
                    }, this) : isEmpty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 text-center italic",
                        children: "Start your conversation with the AI coach..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 480,
                        columnNumber: 5
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            conversation.messages.map((msg, idx)=>{
                                const isUser = msg.role === "user";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `mb-4 ${isUser ? "flex justify-end" : "block"}`,
                                    children: isUser ? // USER (question) — colored bubble, right-aligned
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-2 text-sm md:text-base max-w-[85%] rounded-2xl leading-relaxed shadow-md bg-blue-600 text-white",
                                        children: msg.content
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                        lineNumber: 491,
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
                                                lineNumber: 497,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 flex items-center gap-3",
                                                children: [
                                                    !(streamRef.current && conversation && streamRef.current.convId === conversation._id && streamRef.current.msgIndex === idx) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyButton, {
                                                                text: msg.content
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                                                lineNumber: 506,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>playTTS(`${conversation._id}:${idx}`, msg.content),
                                                                className: `inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${playingKey === `${conversation._id}:${idx}` ? "border-cyan-500 text-cyan-400" : "border-gray-600 text-gray-300 hover:text-white"}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                                                        lineNumber: 516,
                                                                        columnNumber: 15
                                                                    }, this),
                                                                    playingKey === `${conversation._id}:${idx}` ? "Stop" : "Play"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                                                lineNumber: 507,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true),
                                                    msg.meta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$AssistantFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssistantFooter"], {
                                                        meta: msg.meta
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                                        lineNumber: 521,
                                                        columnNumber: 26
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                                lineNumber: 502,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                        lineNumber: 496,
                                        columnNumber: 9
                                    }, this)
                                }, msg._id || idx, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 488,
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
                                            lineNumber: 533,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-2 w-2 rounded-full bg-current animate-bounce"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                            lineNumber: 534,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                            lineNumber: 535,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 532,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 531,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: chatEndRef
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 543,
                        columnNumber: 3
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                lineNumber: 464,
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
                    showPrompts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-2xl mx-auto px-0 mb-3",
                        children: promptsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-40"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 559,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-48"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 560,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-56"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 561,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-8 w-36"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 562,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                            lineNumber: 558,
                            columnNumber: 15
                        }, this) : prompts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$QuickPromptsBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QuickPromptsBar"], {
                            prompts: prompts,
                            onPick: (text)=>{
                                setInput(text);
                                setShowPrompts(false);
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                            lineNumber: 565,
                            columnNumber: 15
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 556,
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
                                    lineNumber: 578,
                                    columnNumber: 25
                                }, this),
                                isLimited && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$UpgradeCta$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UpgradeCta"], {
                                    href: "/dashboard/billing"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 579,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                            lineNumber: 577,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 576,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 bg-[#1a1f2b] border border-gray-700 rounded-xl px-3 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                ref: textareaRef,
                                className: "flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-base leading-[1.5] pt-[0.65rem] pb-[0.65rem] overflow-hidden",
                                placeholder: isLimited ? "Upgrade to continue chatting…" : "Type your message...",
                                value: input,
                                onChange: (e)=>setInput(e.target.value),
                                onInput: autoGrow,
                                onKeyDown: handleKeyDown,
                                disabled: isSending || isLimited,
                                rows: 1,
                                style: {
                                    minHeight: 44
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 584,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "h-10 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition disabled:opacity-60",
                                type: "submit",
                                disabled: !input.trim() || isSending || isLimited,
                                "aria-disabled": isSending || isLimited,
                                children: isSending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                            lineNumber: 605,
                                            columnNumber: 17
                                        }, this),
                                        "Sending…"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                    lineNumber: 604,
                                    columnNumber: 15
                                }, this) : "Send"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                                lineNumber: 597,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                        lineNumber: 583,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
                lineNumber: 547,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/AIchat/CoachChat.tsx",
        lineNumber: 453,
        columnNumber: 5
    }, this);
}
_s(CoachChat, "pAtKc4LK6PxNVM6N1BNj7KbmWEU=");
_c = CoachChat;
const __TURBOPACK__default__export__ = /*#__PURE__*/ _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(CoachChat);
var _c, _c1;
__turbopack_context__.k.register(_c, "CoachChat");
__turbopack_context__.k.register(_c1, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/utils/debug.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/utils/debug.ts
__turbopack_context__.s([
    "DEBUG",
    ()=>DEBUG,
    "dbg",
    ()=>dbg
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const DEBUG = ("TURBOPACK compile-time value", "object") !== "undefined" && (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_DEBUG === "1" || new URLSearchParams(window.location.search).has("debug"));
function dbg(label, data) {
    if (!DEBUG) return;
    // safer pretty logging
    try {
        console.groupCollapsed(`[DBG] ${label}`);
        if (data !== undefined) console.log(data);
        console.groupEnd();
    } catch  {
        console.log(`[DBG] ${label}`, data);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CoachChatHistory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$debug$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/debug.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Skeleton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function CoachChatHistory({ onSelect, selectedId, refreshKey, showHeader = false, onNew, className, maxHeight = 420 }) {
    _s();
    const [convos, setConvos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    function formatDate(iso) {
        if (!iso) return "";
        try {
            const d = new Date(iso);
            return d.toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch  {
            return "";
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoachChatHistory.useEffect": ()=>{
            setLoading(true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$debug$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbg"])("history:load:start", {
                refreshKey
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchConversations"])().then({
                "CoachChatHistory.useEffect": (list)=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$debug$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbg"])("history:load:success", {
                        count: list.length,
                        titles: list.map({
                            "CoachChatHistory.useEffect": (c)=>c.title
                        }["CoachChatHistory.useEffect"]).slice(0, 5)
                    });
                    setConvos(list);
                }
            }["CoachChatHistory.useEffect"]).catch({
                "CoachChatHistory.useEffect": (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$debug$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbg"])("history:load:error", e)
            }["CoachChatHistory.useEffect"]).finally({
                "CoachChatHistory.useEffect": ()=>setLoading(false)
            }["CoachChatHistory.useEffect"]);
        }
    }["CoachChatHistory.useEffect"], [
        refreshKey
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: [
            "w-full bg-[#0f1520] border border-[#232B36] rounded-2xl shadow-2xl overflow-hidden",
            className || ""
        ].join(" "),
        style: {
            maxHeight
        },
        children: [
            showHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-4 pt-3 pb-2 border-b border-[#232B36] bg-[#121A24]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-gray-200 text-sm inline-flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                className: "w-4 h-4 text-cyan-400"
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this),
                            "AI Chat History"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    !!onNew && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onNew,
                        className: "px-2 py-1 text-xs rounded text-white bg-cyan-600 hover:bg-cyan-700 transition",
                        children: "+ New"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                        lineNumber: 85,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 md:p-4 space-y-2 overflow-y-auto",
                style: {
                    maxHeight: typeof maxHeight === "number" ? maxHeight : undefined
                },
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            className: "h-10 w-full"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            className: "h-10 w-full"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                            lineNumber: 99,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            className: "h-10 w-full"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                            lineNumber: 100,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            className: "h-10 w-3/4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                    lineNumber: 97,
                    columnNumber: 11
                }, this) : convos.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-xs text-gray-400",
                    children: "No conversations yet."
                }, void 0, false, {
                    fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                    lineNumber: 104,
                    columnNumber: 11
                }, this) : convos.map((c)=>{
                    const active = selectedId === c._id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onSelect(c._id),
                        className: [
                            "w-full text-left px-3 py-2 rounded-xl transition border",
                            active ? "bg-cyan-600/15 border-cyan-600/40 text-cyan-100 ring-1 ring-cyan-500/30" : "bg-[#141a26]/70 hover:bg-[#17202d] border-[#232B36] text-gray-200"
                        ].join(" "),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: `w-4 h-4 ${active ? "text-cyan-400" : "text-gray-400"}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                                        lineNumber: 120,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium truncate",
                                        children: c.title || "Untitled"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                                        lineNumber: 121,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: async (e)=>{
                                                e.stopPropagation();
                                                try {
                                                    const url = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ttsSynthesize"])(c.title || "Conversation");
                                                    const a = new Audio(url);
                                                    a.play();
                                                } catch  {}
                                            },
                                            className: "inline-flex items-center text-xs text-gray-300 hover:text-white",
                                            "aria-label": "Play title",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                                                lineNumber: 136,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                                            lineNumber: 123,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                                        lineNumber: 122,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                                lineNumber: 119,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-[11px] text-gray-400",
                                children: formatDate(c.updatedAt)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                                lineNumber: 140,
                                columnNumber: 17
                            }, this)
                        ]
                    }, c._id, true, {
                        fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                        lineNumber: 109,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_s(CoachChatHistory, "LAIRts95rZ2ofHdN1GdjixZVsac=");
_c = CoachChatHistory;
var _c;
__turbopack_context__.k.register(_c, "CoachChatHistory");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/dashboard/ai-chat/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AiCoachChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/utils/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$CoachChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/AIchat/CoachChat.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$AiChatHistorySidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/AIchat/AiChatHistorySidebar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function AiCoachChatPage() {
    _s();
    const [historyOpen, setHistoryOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const historyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [selectedConvoId, setSelectedConvoId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const [refreshKey, setRefreshKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AiCoachChatPage.useEffect": ()=>{
            if (!historyOpen) return;
            function handle(e) {
                if (historyRef.current && !historyRef.current.contains(e.target)) setHistoryOpen(false);
            }
            document.addEventListener("mousedown", handle);
            return ({
                "AiCoachChatPage.useEffect": ()=>document.removeEventListener("mousedown", handle)
            })["AiCoachChatPage.useEffect"];
        }
    }["AiCoachChatPage.useEffect"], [
        historyOpen
    ]);
    function handleSelectHistory(id) {
        setSelectedConvoId(id);
        setHistoryOpen(false);
    }
    async function handleNewChat() {
        const newId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmptyConversation"])();
        if (newId) {
            setSelectedConvoId(newId);
            setRefreshKey((k)=>k + 1);
        } else {
            setSelectedConvoId(undefined);
            setRefreshKey((k)=>k + 1);
        }
        setHistoryOpen(false);
    }
    function handleNewConversationCreated(newId) {
        setSelectedConvoId(newId);
        setRefreshKey((k)=>k + 1);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-40 shrink-0 pt-4 md:pt-12 pl-16 pr-4 md:px-12 lg:px-20 max-w-6xl mx-auto w-full bg-transparent",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl md:text-4xl font-semibold tracking-tight",
                                    children: "AI Chat"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "px-4 py-2 rounded bg-gray-900 hover:bg-gray-800 text-gray-100 hover:text-cyan-400 transition flex items-center gap-2",
                                    onClick: ()=>setHistoryOpen((v)=>!v),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden md:inline font-medium",
                                            children: "Chat History"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                                            lineNumber: 62,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                            className: "w-5 h-5 md:hidden"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                                            lineNumber: 63,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        historyOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: historyRef,
                            className: "absolute right-0 mt-2 z-50 w-[340px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$AiChatHistorySidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onSelect: handleSelectHistory,
                                selectedId: selectedConvoId,
                                refreshKey: refreshKey,
                                showHeader: true,
                                onNew: handleNewChat,
                                maxHeight: 420
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                                lineNumber: 72,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                            lineNumber: 71,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 min-h-0 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-3xl mx-auto px-2 md:px-0 flex flex-col min-h-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-h-0 flex flex-col",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$AIchat$2f$CoachChat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            initialConversationId: selectedConvoId,
                            onNewConversation: handleNewConversationCreated,
                            layout: "page"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                            lineNumber: 89,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/ai-chat/page.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(AiCoachChatPage, "oUUE4VWSiUtfylFnhyrs79OyHoo=");
_c = AiCoachChatPage;
var _c;
__turbopack_context__.k.register(_c, "AiCoachChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>BookOpen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 7v14",
            key: "1akyts"
        }
    ],
    [
        "path",
        {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
            key: "ruj8y"
        }
    ]
];
const BookOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("book-open", __iconNode);
;
 //# sourceMappingURL=book-open.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookOpen",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript)");
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
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>Check
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
];
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("check", __iconNode);
;
 //# sourceMappingURL=check.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    ()=>Volume2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
            key: "uqj9uw"
        }
    ],
    [
        "path",
        {
            d: "M16 9a5 5 0 0 1 0 6",
            key: "1q6k2b"
        }
    ],
    [
        "path",
        {
            d: "M19.364 18.364a9 9 0 0 0 0-12.728",
            key: "ijwkga"
        }
    ]
];
const Volume2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("volume-2", __iconNode);
;
 //# sourceMappingURL=volume-2.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript) <export default as Volume2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Volume2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_b41aeee0._.js.map