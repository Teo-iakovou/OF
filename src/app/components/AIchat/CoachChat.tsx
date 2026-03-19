"use client";
import { useEffect, useRef, useState, memo } from "react";
import {
  coachChat,
  fetchConversation,
  generateConversationTitle,
  summarizeConversation,
  createEmptyConversation,
} from "@/app/utils/api";
import { Copy, Check, Sparkles, ThumbsUp, ThumbsDown, Download } from "lucide-react";
import type {
  CoachChatResult,
  CoachChatResponse,
  CoachChatLimitData,
  CoachChatRateLimitData,
  CoachChatContextLimitData,
  CoachChatGenericError,
} from "@/app/utils/api";
import { fetchCoachChatPrompts, getUserResultById, formatContentInfo, submitMessageFeedback, trackEvent } from "@/app/utils/api";
import { PACKAGES_URL } from "@/app/utils/urls";
import { useFloatingChatSafe } from "@/app/components/AIchat/FloatingChatContext";
import { QuickPromptsBar } from "../AIchat/QuickPromptsBar";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { AssistantFooter } from "../AIchat/AssistantFooter";
import { ContextUsedPopover } from "../AIchat/ContextUsedPopover";
import { CreditsChip } from "../AIchat/CreditsChip";
import { UpgradeCta } from "../AIchat/UpgradeCta";

// ---- Fallback quick prompts (used when /api/coach-chat/prompts fails) ----
type PromptCategory = "Strategy" | "Captions" | "Hashtags" | "Posting Plan" | "Video" | "Platform";

const FALLBACK_PROMPTS: Array<{ id: string; category: PromptCategory; label: string; prompt: string }> = [
  // Strategy
  {
    id: "strategy-1",
    category: "Strategy",
    label: "Double down on what's working",
    prompt: "Based on my last upload, what content angles should I double down on this month?",
  },
  {
    id: "strategy-2",
    category: "Strategy",
    label: "4-week content calendar",
    prompt: "Help me build a 4-week content calendar for my niche",
  },
  {
    id: "strategy-3",
    category: "Strategy",
    label: "Platform content breakdown",
    prompt: "What type of content performs best on Instagram vs. TikTok for my audience?",
  },
  // Captions
  {
    id: "captions-1",
    category: "Captions",
    label: "3 caption variations",
    prompt: "Write 3 caption variations for my last upload — one punchy, one story-led, one question-based",
  },
  {
    id: "captions-2",
    category: "Captions",
    label: "Scroll-stopping hook",
    prompt: "Turn my last post concept into a hook that stops the scroll",
  },
  {
    id: "captions-3",
    category: "Captions",
    label: "Trust-building caption",
    prompt: "Give me a caption that builds trust and drives saves for my niche",
  },
  // Hashtags
  {
    id: "hashtags-1",
    category: "Hashtags",
    label: "15 tiered hashtags",
    prompt: "Suggest 15 hashtags for my niche, split by tier — broad, mid-level, and niche-specific",
  },
  {
    id: "hashtags-2",
    category: "Hashtags",
    label: "Platform hashtag strategy",
    prompt: "What hashtag strategy should I use for Instagram vs. TikTok vs. LinkedIn?",
  },
  // Posting Plan
  {
    id: "posting-1",
    category: "Posting Plan",
    label: "Best times to post",
    prompt: "What days and times should I be posting based on my niche and audience?",
  },
  {
    id: "posting-2",
    category: "Posting Plan",
    label: "4× per week structure",
    prompt: "I want to post 4 times per week — how should I structure my content mix?",
  },
  {
    id: "posting-3",
    category: "Posting Plan",
    label: "Educational vs promotional balance",
    prompt: "Create a posting rhythm that balances educational, promotional, and relatable content",
  },
  // Video
  {
    id: "video-1",
    category: "Video",
    label: "30-second talking head script",
    prompt: "Write a 30-second talking head script based on my last upload",
  },
  {
    id: "video-2",
    category: "Video",
    label: "Video opening hook",
    prompt: "What is the strongest hook I can open my next video with?",
  },
  {
    id: "video-3",
    category: "Video",
    label: "Tutorial video outline",
    prompt: "Give me a 5-step video outline for my next tutorial in my niche",
  },
  // Platform
  {
    id: "platform-1",
    category: "Platform",
    label: "Repurpose across platforms",
    prompt: "How should I repurpose my last upload across Instagram, TikTok, and LinkedIn?",
  },
  {
    id: "platform-2",
    category: "Platform",
    label: "What's working on Reels",
    prompt: "What content formats are working on Reels right now for creators in my niche?",
  },
  {
    id: "platform-3",
    category: "Platform",
    label: "TikTok vs Instagram priority",
    prompt: "Should I prioritize TikTok or Instagram growth given my content style?",
  },
];

// Message with meta for requestId/latency/context
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  _id?: string;
  meta?: {
    usedContextIds?: string[];
    requestId?: string;
    latencyMs?: number;
  };
}
interface Conversation {
  _id: string;
  title?: string;
  messages: Message[];
  tokensUsed?: number;
  tokensLimit?: number;
  nearLimit?: boolean;
}

function CoachChat({
  latestContentInfo,
  initialConversationId,
  onNewConversation,
  onContextChange,
  layout = "panel",
}: {
  onNewConversation: (newId: string) => void;
  latestContentInfo?: string;
  initialConversationId?: string;
  onContextChange?: (info: { tokensUsed?: number; tokensLimit?: number; nearLimit?: boolean } | null) => void;
  layout?: "page" | "panel";
}) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // FIX: start false; only show skeleton when we really fetch history
  const [bootstrapping, setBootstrapping] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLimited, setIsLimited] = useState(false);
  const [isContextLimited, setIsContextLimited] = useState(false);
  const [contextNearLimit, setContextNearLimit] = useState(false);
  const [contextInfo, setContextInfo] = useState<{ used?: number; limit?: number } | null>(null);
  const [contextActionLoading, setContextActionLoading] = useState(false);
  const [credits, setCredits] = useState<{ used: number; limit: number } | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [promptsLoading, setPromptsLoading] = useState<boolean>(true);
  const [showPrompts, setShowPrompts] = useState(true);
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(false);
  const [activePromptCategory, setActivePromptCategory] = useState<string>("Suggested");
  const [dismissedPreview, setDismissedPreview] = useState(false);
  const [contextContentInfo, setContextContentInfo] = useState<string | undefined>();
  const [feedback, setFeedback] = useState<Record<number, "up" | "down">>({});

  const floatingChat = useFloatingChatSafe();

  // Consume resultId from FloatingChat context (set when user clicks "Ask Sage" on a result card)
  const pendingResultId = floatingChat?.contextRef?.resultId;
  useEffect(() => {
    if (!pendingResultId) return;
    floatingChat?.setContextRef(null);
    getUserResultById({ id: pendingResultId })
      .then((result) => setContextContentInfo(formatContentInfo(result)))
      .catch(() => {});
  }, [pendingResultId]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // FIX: track which conversationId we've already loaded to avoid refetch/remount blink
  const loadedIdRef = useRef<string | null>(null);

  // Analytics: fire chat_upgrade_cta_seen at most once per session
  const ctaSeenRef = useRef(false);


  // ---- typing animation ("word by word") ----
const STREAM_WORD_DELAY = 24; // ms between tokens (~40–60 feels ChatGPT-like)
type Stream = { convId: string; msgIndex: number; tokens: string[]; pos: number };
const streamRef = useRef<Stream | null>(null);
const [isStreaming, setIsStreaming] = useState(false);

// kick off a stream for conv._id + a specific message index
function startStreaming(s: Stream) {
  streamRef.current = s;
  setIsStreaming(true);
}

// drive the streaming loop
useEffect(() => {
  if (!isStreaming) return;

  const id = setInterval(() => {
    const s = streamRef.current;
    if (!s) {
      clearInterval(id);
      setIsStreaming(false);
      return;
    }

    const nextPos = s.pos + 1;
    setConversation((prev) => {
      if (!prev || prev._id !== s.convId) return prev;
      if (!prev.messages[s.msgIndex]) return prev;

      const text = s.tokens.slice(0, nextPos).join(""); // tokens include spaces
      const msgs = [...prev.messages];
      msgs[s.msgIndex] = { ...msgs[s.msgIndex], content: text };
      return { ...prev, messages: msgs };
    });

    // keep scroll pinned to bottom while streaming
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (nextPos >= s.tokens.length) {
      streamRef.current = null;
      clearInterval(id);
      setIsStreaming(false);
    } else {
      streamRef.current = { ...s, pos: nextPos };
    }
  }, STREAM_WORD_DELAY);

  return () => clearInterval(id);
}, [isStreaming]);

// Split into word + whitespace tokens so spacing is natural.
function tokenizeWordsWithSpaces(s: string) {
  return s.match(/\S+|\s+/g) ?? [];
}


  // ----- textarea auto-grow -----
  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(() => {
    autoGrow();
  }, [input]);

  // ----- autoscroll (count-based to avoid extra renders) -----
  const prevMsgCount = useRef<number>(0);
  const messageCount = conversation?.messages?.length ?? 0;
  useEffect(() => {
    if (messageCount > prevMsgCount.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMsgCount.current = messageCount;
  }, [messageCount]);

  useEffect(() => {
    if (!onContextChange) return;
    if (!conversation || !conversation._id) {
      onContextChange(null);
      return;
    }
    onContextChange({
      tokensUsed: conversation.tokensUsed,
      tokensLimit: conversation.tokensLimit,
      nearLimit: conversation.nearLimit,
    });
  }, [conversation, onContextChange]);

  // ----- Load existing conversation by id (guarded) -----
  useEffect(() => {
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
    fetchConversation(id)
      .then((c) => {
        if (ignore) return;
        setConversation(c);
        loadedIdRef.current = id;
        // Show prompts only if there are no messages
        setShowPrompts((c?.messages?.length ?? 0) === 0);
      })
      .finally(() => {
        if (!ignore) setBootstrapping(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConversationId]);

  // ----- Quick Prompts (load once per user) -----
  useEffect(() => {
    let ignore = false;

    setPromptsLoading(true);
    fetchCoachChatPrompts()
      .then((r) => {
        if (!ignore) setPrompts(r.prompts || []);
      })
      .catch(() => {
        if (!ignore) setPrompts(FALLBACK_PROMPTS.map((p) => p.prompt));
      })
      .finally(() => { if (!ignore) setPromptsLoading(false); });

    return () => {
      ignore = true;
    };
  }, []); // FIX: don't refetch on every new message

  const handleStartNewChat = async () => {
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
      const newId = await createEmptyConversation();
      if (newId) {
        const nextConversation = await fetchConversation(newId);
        if (nextConversation) {
          setConversation(nextConversation as Conversation);
        }
        loadedIdRef.current = newId;
        onNewConversation?.(newId);
      }
    } finally {
      setContextActionLoading(false);
    }
  };

  const handleSummarizeContinue = async () => {
    if (contextActionLoading || !conversation?._id) return;
    setContextActionLoading(true);
    try {
      const summarized = await summarizeConversation(conversation._id);
      if (summarized?.newConversationId) {
        const nextConversation = await fetchConversation(summarized.newConversationId);
        if (nextConversation) {
          setConversation(nextConversation as Conversation);
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
    } finally {
      setContextActionLoading(false);
    }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isSending || isLimited || isContextLimited) return;

    trackEvent("chat_message_sent", {
      conversationDepth: (conversation?.messages.filter((m) => m.role === "user").length ?? 0) + 1,
      hasContextInfo: !!(contextContentInfo ?? latestContentInfo),
    });

    setShowPrompts(false);
    setShowSuggestedPrompts(false);
    setIsSending(true);
    setError(null);
    setContextNearLimit(false);

    // optimistic message
    const previousConversation = conversation;
    const optimistic: Conversation =
      conversation
        ? { ...conversation, messages: [...conversation.messages, { role: "user", content: text }] }
        : { _id: "temp", messages: [{ role: "user", content: text }] };

    setConversation(optimistic);
    setInput("");

    try {
      const res: CoachChatResult = await coachChat({
        question: text,
        latestContentInfo: contextContentInfo ?? latestContentInfo,
        conversationId: conversation?._id,
        title: conversation?.title || "AI Coach Chat",
      });

      switch (res.status) {
        case 402: {
          const data = res.data as CoachChatLimitData;
          setIsLimited(true);
          setError(data.error || "You’ve reached your plan’s chat limit.");
          if (data.quota) setCredits(data.quota);
          setIsSending(false);
          if (!conversation?._id) setConversation(null);
          return;
        }

        case 429: {
          const data = res.data as CoachChatRateLimitData;
          setError(data.message || data.error || "You’re sending messages too fast. Try again shortly.");
          setIsSending(false);
          if (!conversation?._id) setConversation(null);
          return;
        }

        case 409: {
          const data = res.data as CoachChatContextLimitData;
          setIsContextLimited(true);
          setContextInfo({ used: data.tokensUsed, limit: data.tokensLimit });
          setIsSending(false);
          setConversation(previousConversation || null);
          return;
        }

       case 200: {
  const data = res.data as CoachChatResponse;

  // shallow copy + attach meta to last assistant
  const conv = { ...data.conversation };
  let lastAssistantIndex = -1;
  for (let i = conv.messages.length - 1; i >= 0; i--) {
    if (conv.messages[i].role === "assistant") {
      lastAssistantIndex = i;
      conv.messages[i] = {
        ...conv.messages[i],
        meta: {
          usedContextIds: data.usedContextIds,
          requestId: data.requestId,
          latencyMs: data.latencyMs,
        },
      };
      break;
    }
  }

  // If we have an assistant message, animate its content.
  if (lastAssistantIndex >= 0) {
    const full = conv.messages[lastAssistantIndex].content || "";
    // render empty first, then stream in
    conv.messages[lastAssistantIndex] = { ...conv.messages[lastAssistantIndex], content: "" };
    setConversation(conv);

    // start typewriter
    startStreaming({
      convId: conv._id,
      msgIndex: lastAssistantIndex,
      tokens: tokenizeWordsWithSpaces(full),
      pos: 0,
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
    setContextInfo({ used: data.tokensUsed ?? undefined, limit: data.tokensLimit ?? undefined });
  }

  // first message in brand-new chat?
  const wasFirstUserMessage = (optimistic.messages.length === 1);
  if (wasFirstUserMessage && conv._id) {
    loadedIdRef.current = conv._id;
    onNewConversation?.(conv._id);
    try {
      const title = await generateConversationTitle(conv._id, text);
      if (title) setConversation((prev) => (prev ? { ...prev, title } : prev));
    } catch {}
  }
  return;
}

        default: {
          const data = res.data as CoachChatGenericError;
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

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (isSending || isLimited || isContextLimited) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op; you could surface an error banner if you want
    }
  }

  const disabled = !text?.trim();

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={disabled}
      className={`inline-flex items-center gap-1 text-xs font-medium transition
        ${disabled ? "opacity-40 cursor-not-allowed" : "text-gray-400 hover:text-gray-200"}`}
      aria-label={copied ? "Copied" : "Copy answer"}
      title={copied ? "Copied" : "Copy"}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}


  function stripMarkdown(text: string): string {
    return text
      .replace(/```[\s\S]*?```/g, "")    // fenced code blocks
      .replace(/\*\*(.+?)\*\*/g, "$1")   // **bold**
      .replace(/\*(.+?)\*/g, "$1")       // *italic*
      .replace(/__(.+?)__/g, "$1")       // __bold__
      .replace(/_(.+?)_/g, "$1")         // _italic_
      .replace(/#{1,6}\s+/g, "")         // headings
      .replace(/`(.+?)`/g, "$1")         // inline code
      .trim();
  }

  function exportConversation() {
    if (!conversation) return;
    const date = new Date().toISOString().slice(0, 10);
    const convId = conversation._id.slice(-6);
    const dateLabel = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const lines: string[] = [
      "---",
      "CONTENT STRATEGY BRIEF",
      "Generated by Sage · echo-fy.com",
      `Date: ${dateLabel}`,
      "---",
      "",
    ];

    const msgs = conversation.messages.filter((m) => m.role !== "system");
    msgs.forEach((msg) => {
      if (msg.role === "user") {
        lines.push(`YOU: ${msg.content.trim()}`);
        lines.push("");
      } else if (msg.role === "assistant") {
        lines.push(`SAGE: ${stripMarkdown(msg.content)}`);
        lines.push("");
        lines.push("---");
        lines.push("");
      }
    });

    lines.push("--- End of Brief ---");
    const text = lines.join("\n");

    // Download
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sage-brief-${convId}-${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    // Copy to clipboard (silent)
    navigator.clipboard.writeText(text).catch(() => {});

    trackEvent("chat_exported", {
      messageCount: msgs.length,
      conversationId: conversation._id,
    });
  }

  const promptCategories = (() => {
    const cats: Array<{ id: string; label: string; items: Array<{ label: string; prompt: string }> }> = [];
    if (prompts.length > 0) {
      cats.push({ id: "Suggested", label: "Suggested", items: prompts.map((p) => ({ label: p, prompt: p })) });
    }
    const seen = new Set<string>();
    FALLBACK_PROMPTS.forEach((p) => {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        cats.push({
          id: p.category,
          label: p.category,
          items: FALLBACK_PROMPTS.filter((q) => q.category === p.category).map((q) => ({ label: q.label, prompt: q.prompt })),
        });
      }
    });
    return cats;
  })();

  const isEmpty = !bootstrapping && !(conversation?.messages?.length);
  const isPageLayout = layout === "page";

  const isNearMonthlyLimit =
    (contextInfo?.limit ?? 0) > 0 &&
    (contextInfo?.used ?? 0) > 0 &&
    (contextInfo?.used ?? 0) / (contextInfo?.limit ?? 1) >= 0.8 &&
    (contextInfo?.used ?? 0) / (contextInfo?.limit ?? 1) < 1.0;

  // Fire chat_upgrade_cta_seen once per session when the preview card becomes visible
  useEffect(() => {
    if (isNearMonthlyLimit && !isLimited && !dismissedPreview && !ctaSeenRef.current) {
      ctaSeenRef.current = true;
      const used = contextInfo?.used ?? 0;
      const limit = contextInfo?.limit ?? 1;
      trackEvent("chat_upgrade_cta_seen", { usagePercent: Math.round((used / limit) * 100) });
    }
  }, [isNearMonthlyLimit, isLimited, dismissedPreview, contextInfo]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Error banner */}
      {error && (
        <div className="w-full max-w-2xl mx-auto px-4 mb-2">
          <div className="rounded-lg border border-red-600/40 bg-red-600/10 text-red-300 text-sm px-3 py-2">
            {error}
          </div>
        </div>
      )}

      {/* Export button — only when there are messages */}
      {!isEmpty && (
        <div className="shrink-0 flex justify-end px-4 py-1.5 border-b border-gray-800/50">
          <button
            type="button"
            onClick={exportConversation}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition px-2 py-1 rounded border border-transparent hover:border-gray-700"
          >
            <Download className="w-3.5 h-3.5" />
            Export Brief
          </button>
        </div>
      )}

    {/* Messages */}
<div
  className={[
    "flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 md:px-4",
    isEmpty ? "flex items-center justify-center py-0" : "py-6",
    isPageLayout ? "pb-40" : "",
    isPageLayout && isEmpty ? "min-h-[60vh]" : "",
  ].join(" ")}
  style={{ scrollbarGutter: "stable" }}
>
  {bootstrapping ? (
    <div className="animate-pulse space-y-3 w-full">
      <div className="h-5 w-2/3 rounded-xl bg-gray-200/40" />
      <div className="h-5 w-1/2 rounded-xl bg-gray-200/40" />
      <div className="h-5 w-3/5 rounded-xl bg-gray-200/40" />
    </div>
  ) : isEmpty ? (
    <p className="text-gray-500 text-center italic">
      Start your conversation with the AI coach...
    </p>
  ) : (
    <>
  {(() => {
    const msgs = conversation!.messages;
    const lastAssistantIdx = msgs.reduce(
      (last, m, i) => (m.role === "assistant" ? i : last),
      -1
    );
    return msgs.map((msg, idx) => {
  if (msg.role === "system") return null;
  const isUser = msg.role === "user";
  const isStreaming =
    !!(streamRef.current &&
      conversation &&
      streamRef.current.convId === conversation._id &&
      streamRef.current.msgIndex === idx);
  return (
    <div key={msg._id || idx} className={`mb-4 ${isUser ? "flex justify-end" : "block"}`}>
      {isUser ? (
        // USER (question) — colored bubble, right-aligned
        <div className="px-4 py-2 text-sm md:text-base max-w-[85%] rounded-2xl leading-relaxed shadow-md bg-blue-600 text-white">
          {msg.content}
        </div>
      ) : (
        // ASSISTANT (answer) — no bubble, left-aligned
        <div className="max-w-3xl text-gray-100 leading-relaxed">
          <div className="whitespace-pre-wrap">
            {msg.content}
          </div>

          {/* Toolbar under the answer */}
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {!isStreaming && (
                <CopyButton text={msg.content} />
              )}
              {!isStreaming && msg.meta?.usedContextIds?.length ? (
                <ContextUsedPopover ids={msg.meta.usedContextIds} />
              ) : null}
            </div>
            {/* Feedback buttons — every assistant message, after streaming */}
            {!isStreaming && (
              <div className="flex items-center gap-1">
                {(["up", "down"] as const).map((vote) => {
                  const voted = feedback[idx];
                  const isSelected = voted === vote;
                  const isOther = voted !== undefined && voted !== vote;
                  return (
                    <button
                      key={vote}
                      type="button"
                      disabled={voted !== undefined}
                      onClick={async () => {
                        if (voted !== undefined) return;
                        trackEvent("chat_feedback_given", { vote, messageIndex: idx });
                        setFeedback((prev) => ({ ...prev, [idx]: vote }));
                        try {
                          await submitMessageFeedback(conversation!._id, idx, vote);
                        } catch {
                          setFeedback((prev) => {
                            const next = { ...prev };
                            delete next[idx];
                            return next;
                          });
                        }
                      }}
                      className={`p-1 rounded transition ${
                        isSelected
                          ? "text-[var(--hg-accent)]"
                          : isOther
                          ? "text-gray-700 opacity-30 cursor-default"
                          : "text-gray-600 hover:text-gray-400"
                      }`}
                      aria-label={vote === "up" ? "Helpful" : "Not helpful"}
                    >
                      {vote === "up"
                        ? <ThumbsUp className="w-3.5 h-3.5" />
                        : <ThumbsDown className="w-3.5 h-3.5" />
                      }
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Capability hints — only on the last assistant message, not while streaming/sending */}
          {idx === lastAssistantIdx && !isStreaming && !isSending && (
            <AssistantFooter meta={msg.meta} />
          )}
        </div>
      )}
    </div>
  );
  });
  })()}

      {/* Typing indicator (assistant) — no bubble */}
      {isSending && (
        <div className="mb-4">
          <div className="inline-flex items-center gap-1 text-gray-400">
            <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.2s]" />
            <span className="h-2 w-2 rounded-full bg-current animate-bounce" />
            <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
          </div>
        </div>
      )}
    </>
  )}

  {/* Anchor to keep scroll at bottom */}
  <div ref={chatEndRef} />
</div>

      {/* Input bar */}
      <form
        onSubmit={sendMessage}
        className={[
          "shrink-0 w-full max-w-2xl mx-auto px-4 py-3 border-t border-gray-700/50",
          isPageLayout ? "fixed inset-x-0 bottom-0 z-30 bg-transparent" : "bg-transparent",
        ].join(" ")}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {isContextLimited ? (
          <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-100">
            <div className="font-semibold">Context limit reached.</div>
            <div className="mt-1 text-amber-200">
              Start a new chat or summarize to continue this thread.
            </div>
            {contextInfo?.limit ? (
              <div className="mt-1 text-xs text-amber-200">
                {Number(contextInfo.used ?? 0).toLocaleString()} / {Number(contextInfo.limit).toLocaleString()} tokens
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleStartNewChat}
                disabled={contextActionLoading}
                className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-500/30 disabled:opacity-60"
              >
                Start new chat
              </button>
              <button
                type="button"
                onClick={handleSummarizeContinue}
                disabled={contextActionLoading}
                className="rounded-lg border border-amber-400/50 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:border-amber-300 disabled:opacity-60"
              >
                Summarize and continue
              </button>
            </div>
          </div>
        ) : null}

        {!isContextLimited && contextNearLimit ? (
          <div className="mb-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-100">
            <span className="font-semibold">Context window nearly full.</span>{" "}
            Start a new chat to keep things fast.
            <button
              type="button"
              onClick={handleStartNewChat}
              className="ml-2 rounded-md border border-amber-400/40 px-2 py-0.5 text-[11px] font-semibold text-amber-100 hover:border-amber-300"
            >
              Start new chat
            </button>
          </div>
        ) : null}

        {isEmpty && showPrompts && (
          <div className="w-full max-w-2xl mx-auto px-0 mb-4 text-center">
            <h2 className="text-lg font-semibold text-gray-100 mb-2">
              Hi, I&apos;m your AI Creator Coach
            </h2>
            <ul className="text-sm text-gray-400 space-y-1 mb-3 text-left inline-block">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--hg-accent)]">✦</span>
                Analyse your content strategy and suggest what to post next
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--hg-accent)]">✦</span>
                Write captions, hashtags, and hooks tailored to your audience
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--hg-accent)]">✦</span>
                Build posting plans and grow your reach across platforms
              </li>
            </ul>
            <p className="text-xs text-gray-500">Choose a prompt below or ask me anything</p>
          </div>
        )}

        {showPrompts && (
          <div className="w-full max-w-2xl mx-auto px-0 mb-3">
            {promptsLoading ? (
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-8 w-36" />
              </div>
            ) : prompts.length > 0 ? (
              <QuickPromptsBar
                prompts={prompts}
                onPick={(text) => {
                  trackEvent("chat_prompt_selected", {
                    category: "Suggested",
                    label: text.slice(0, 80),
                    source: "quick_bar",
                  });
                  setInput(text);
                  setShowPrompts(false);
                }}
              />
            ) : null}
          </div>
        )}

        {isLimited && (
          <div className="mb-3 rounded-xl border border-[var(--hg-accent)]/30 bg-[var(--hg-accent)]/10 px-3 py-2 text-xs text-[var(--hg-accent)]">
            <span className="font-semibold">Monthly limit reached</span>
            {" — "}
            <a href={PACKAGES_URL} className="underline underline-offset-2 hover:opacity-80">
              upgrade to keep coaching
            </a>
          </div>
        )}

        {(() => {
          if (!isNearMonthlyLimit || isLimited || dismissedPreview) return null;
          return (
            <div
              className="mb-3 relative rounded-xl border border-[var(--hg-accent)]/20 px-3 py-3 text-xs"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--hg-accent) 5%, transparent), transparent)",
              }}
            >
              <button
                type="button"
                onClick={() => setDismissedPreview(true)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-400 transition"
                aria-label="Dismiss"
              >
                ×
              </button>
              <div className="font-semibold text-[var(--hg-accent)] mb-1">
                ⚡ You&apos;re getting great results
              </div>
              <div className="text-gray-400 mb-2">
                You&apos;ve used 80%+ of your monthly AI tokens.
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-400 mb-3">
                <span><span className="text-[var(--hg-accent)]">✦</span> 3× more tokens</span>
                <span><span className="text-[var(--hg-accent)]">✦</span> Full upload history context</span>
                <span><span className="text-[var(--hg-accent)]">✦</span> Priority responses</span>
                <span><span className="text-[var(--hg-accent)]">✦</span> DM script generation</span>
              </div>
              <a
                href={PACKAGES_URL}
                onClick={() => trackEvent("chat_upgrade_cta_clicked", { source: "preview_card" })}
                className="inline-block rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--hg-accent)] border border-[var(--hg-accent)]/40 hover:bg-[var(--hg-accent)]/10 transition"
              >
                Unlock Pro →
              </a>
            </div>
          );
        })()}

        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {credits && <CreditsChip used={credits.used} limit={credits.limit} />}
            {isLimited && (
              <span onClick={() => trackEvent("chat_upgrade_cta_clicked", { source: "limit_reached" })}>
                <UpgradeCta />
              </span>
            )}
          </div>
        </div>

        {showSuggestedPrompts && (
          <div className="mb-2 rounded-xl border border-gray-700/50 bg-[#141922] overflow-hidden">
            {/* Tab bar */}
            <div className="flex overflow-x-auto border-b border-gray-700/50 scrollbar-hide">
              {promptCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActivePromptCategory(cat.id)}
                  className={`shrink-0 px-3 py-2 text-[11px] font-medium transition whitespace-nowrap ${
                    activePromptCategory === cat.id
                      ? "text-[var(--hg-accent)] border-b-2 border-[var(--hg-accent)] -mb-px"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {/* Prompts for active category */}
            <div className="max-h-[280px] overflow-y-auto p-2 space-y-1">
              {promptCategories
                .find((c) => c.id === activePromptCategory)
                ?.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      trackEvent("chat_prompt_selected", {
                        category: activePromptCategory,
                        label: item.label,
                        source: "sparkles_panel",
                      });
                      setInput(item.prompt);
                      setShowSuggestedPrompts(false);
                      textareaRef.current?.focus();
                    }}
                    className="w-full text-left rounded-lg border border-gray-700/60 bg-[#1a1f2b] px-3 py-2 text-xs text-gray-300 hover:border-gray-600 hover:bg-[#202636] hover:text-gray-100 transition"
                  >
                    {item.label}
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 bg-[#1a1f2b] border border-gray-700 rounded-xl px-3 py-2">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-base leading-[1.5] pt-[0.65rem] pb-[0.65rem] overflow-hidden"
            placeholder={
              isContextLimited
                ? "Context limit reached. Start a new chat or summarize."
                : isLimited
                  ? "Upgrade to continue chatting…"
                  : "Type your message..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={autoGrow}
            onKeyDown={handleKeyDown}
            disabled={isSending || isLimited || isContextLimited}
            rows={1}
            style={{ minHeight: 44 }}
          />

          <button
            type="button"
            onClick={() => {
              const next = !showSuggestedPrompts;
              setShowSuggestedPrompts(next);
              if (next) setActivePromptCategory(promptCategories[0]?.id ?? "Suggested");
            }}
            aria-label="Suggest prompts"
            title="Suggest prompts"
            className={`h-8 w-8 flex items-center justify-center rounded-lg transition ${
              showSuggestedPrompts
                ? "text-[var(--hg-accent)] bg-[var(--hg-accent)]/10"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            className="h-10 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition disabled:opacity-60"
            type="submit"
            disabled={!input.trim() || isSending || isLimited || isContextLimited}
            aria-disabled={isSending || isLimited || isContextLimited}
          >
            {isSending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sending…
              </span>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default memo(CoachChat);
