"use client";
import { useEffect, useRef, useState, memo, Fragment } from "react";
import {
  coachChat,
  fetchConversation,
  generateConversationTitle,
  summarizeConversation,
  createEmptyConversation,
} from "@/app/utils/api";
import { Copy, Check, ThumbsUp, ThumbsDown, Download, FileText, Sparkles } from "lucide-react";
import type {
  CoachChatResult,
  CoachChatResponse,
  CoachChatLimitData,
  CoachChatRateLimitData,
  CoachChatContextLimitData,
  CoachChatGenericError,
} from "@/app/utils/api";
import { getUserResultById, formatContentInfo, submitMessageFeedback, trackEvent } from "@/app/utils/api";
import { PACKAGES_URL } from "@/app/utils/urls";
import { useFloatingChatSafe } from "@/app/components/AIchat/FloatingChatContext";
import { QuickPromptsBar } from "@/app/components/AIchat/QuickPromptsBar";
import { AssistantFooter } from "@/app/components/AIchat/AssistantFooter";

function fmtTokens(n: number): string {
  if (n < 1000) return String(Math.round(n));
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

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

type PromptCategory = "Strategy" | "Captions" | "Hooks" | "Avatar / Video" | "Planning";
type PromptGroup = {
  id: PromptCategory;
  label: PromptCategory;
  prompts: string[];
};

const FALLBACK_PROMPT_GROUPS: PromptGroup[] = [
  {
    id: "Strategy",
    label: "Strategy",
    prompts: [
      "Based on my last upload, what 3 content angles should I double down on this week?",
      "Turn my recent performance into a practical 7-day content strategy.",
      "What should I stop posting right now, and what should I post instead?",
    ],
  },
  {
    id: "Captions",
    label: "Captions",
    prompts: [
      "Write 5 premium caption variations for my next post: bold, flirty, educational, story-led, and CTA-focused.",
      "Give me caption options optimized for saves and shares, not just likes.",
      "Rewrite this caption so it sounds more confident and creator-brand aligned.",
    ],
  },
  {
    id: "Hooks",
    label: "Hooks",
    prompts: [
      "Give me 10 short hooks that stop the scroll for this topic.",
      "Create opening lines for a talking-head video with a high-retention first 3 seconds.",
      "Convert my current post idea into 3 stronger hook-first versions.",
    ],
  },
  {
    id: "Avatar / Video",
    label: "Avatar / Video",
    prompts: [
      "Write a 30-second avatar video script with a strong hook and clear CTA.",
      "Give me a talking-head script for this upload in a confident premium tone.",
      "Create 3 short video script outlines I can film this week from one idea.",
    ],
  },
  {
    id: "Planning",
    label: "Planning",
    prompts: [
      "Build a weekly posting plan with platform-specific priorities for Instagram and TikTok.",
      "Turn one upload into a repurposing plan: reel, story, carousel, and short script.",
      "Create a content calendar for the next 14 days with themes, hooks, and CTA direction.",
    ],
  },
];

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
  const [dismissedPreview, setDismissedPreview] = useState(false);
  const [contextContentInfo, setContextContentInfo] = useState<string | undefined>();
  const [feedback, setFeedback] = useState<Record<number, "up" | "down">>({});
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState<PromptCategory>("Strategy");

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
      })
      .finally(() => {
        if (!ignore) setBootstrapping(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConversationId]);

  const handleStartNewChat = async () => {
    if (contextActionLoading) return;
    setIsLimited(false);
    setIsContextLimited(false);
    setContextNearLimit(false);
    setContextInfo(null);
    setConversation(null);
    setInput("");
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

  const handlePromptPick = (text: string, opts?: { send?: boolean }) => {
    setInput(text);
    setSuggestionsOpen(false);
    textareaRef.current?.focus();
    trackEvent("chat_prompt_selected", {
      category: activeSuggestionCategory,
      label: text.slice(0, 120),
      source: conversation?.messages?.length ? "suggestions_panel" : "empty_state",
    });
    if (opts?.send) {
      window.requestAnimationFrame(() => {
        sendMessage();
      });
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

  const isEmpty = !bootstrapping && !(conversation?.messages?.length);
  const isPageLayout = layout === "page";
  const promptGroup =
    FALLBACK_PROMPT_GROUPS.find((group) => group.id === activeSuggestionCategory) ||
    FALLBACK_PROMPT_GROUPS[0];

  const isNearMonthlyLimit =
    (contextInfo?.limit ?? 0) > 0 &&
    (contextInfo?.used ?? 0) > 0 &&
    (contextInfo?.used ?? 0) / (contextInfo?.limit ?? 1) >= 0.8 &&
    (contextInfo?.used ?? 0) / (contextInfo?.limit ?? 1) < 1.0;

  const inputBarTokensUsed =
    typeof contextInfo?.used === "number"
      ? contextInfo.used
      : typeof conversation?.tokensUsed === "number"
        ? conversation.tokensUsed
        : null;
  const inputBarTokensLimit =
    typeof contextInfo?.limit === "number"
      ? contextInfo.limit
      : typeof conversation?.tokensLimit === "number"
        ? conversation.tokensLimit
        : null;
  const hasInputBarTokenData =
    typeof inputBarTokensUsed === "number" &&
    typeof inputBarTokensLimit === "number" &&
    inputBarTokensLimit > 0;

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
        <div className="shrink-0 flex justify-end px-4 py-1.5">
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
    isPageLayout && !isEmpty ? "pb-40" : "",
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
    <p className="text-gray-500 text-center italic">Start your conversation...</p>
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
    <Fragment key={msg._id || idx}>
    <div className={`mb-4 ${isUser ? "flex justify-end" : "block"}`}>
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

          {!isStreaming && idx === lastAssistantIdx ? <AssistantFooter meta={msg.meta} /> : null}

        </div>
      )}
    </div>
    {!isUser && idx < msgs.length - 1 && (
      <hr className="border-0 border-t border-white/5 my-3" />
    )}
    </Fragment>
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
          "shrink-0 w-full max-w-2xl mx-auto px-4 py-3",
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

        {suggestionsOpen ? (
          <div className="mb-3 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)]/90 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs text-[var(--hg-muted)]">
                Suggestions for captions, hooks, strategy, and avatar scripts
              </p>
              <button
                type="button"
                onClick={() => setSuggestionsOpen(false)}
                className="text-xs text-gray-400 transition hover:text-white"
              >
                Hide
              </button>
            </div>

            <div className="mb-2 flex flex-wrap gap-1.5">
              {FALLBACK_PROMPT_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveSuggestionCategory(group.id)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                    activeSuggestionCategory === group.id
                      ? "border-[var(--hg-accent)]/50 bg-[var(--hg-accent)]/15 text-[var(--hg-accent)]"
                      : "border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-gray-300 hover:border-white/25"
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>

            <QuickPromptsBar
              prompts={promptGroup.prompts}
              category={promptGroup.label}
              label="Pick a prompt"
              onPick={handlePromptPick}
            />
          </div>
        ) : null}

        <div className="flex items-center gap-2 bg-[#1a1f2b] border border-gray-700 rounded-xl px-3 py-2">
          <button
            type="button"
            onClick={() => setSuggestionsOpen((prev) => !prev)}
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-gray-300 transition ${
              suggestionsOpen
                ? "border-[var(--hg-accent)]/50 bg-[var(--hg-accent)]/15 text-[var(--hg-accent)]"
                : "border-gray-700 hover:border-gray-500 hover:text-white"
            }`}
            aria-label="Toggle prompt suggestions"
            title="Suggestions"
          >
            <Sparkles className="h-4 w-4" />
          </button>

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

          {/* Context Tokens chip (always visible in input bar) */}
          <span className="relative group inline-flex items-center gap-1 text-[11px] text-gray-500 shrink-0 cursor-default select-none">
              <FileText className="w-3 h-3" />
              {hasInputBarTokenData
                ? `${fmtTokens(inputBarTokensUsed)}/${fmtTokens(inputBarTokensLimit)}`
                : "—/—"}
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-1.5 text-[11px] text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-75 whitespace-nowrap z-50 shadow-lg">
                {hasInputBarTokenData
                  ? `Context Tokens: ${fmtTokens(inputBarTokensUsed)} of ${fmtTokens(inputBarTokensLimit)} used in this conversation`
                  : "Context Token usage is loading..."}
              </span>
          </span>

          <button
            className="h-10 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition disabled:opacity-60 shrink-0"
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
        <p className="mt-2 px-1 text-[11px] text-gray-500">
          Ask for captions, hooks, avatar scripts, or next-post strategy using your latest upload
          context.
        </p>
      </form>
    </div>
  );
}

export default memo(CoachChat);
