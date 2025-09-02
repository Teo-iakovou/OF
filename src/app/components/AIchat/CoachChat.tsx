"use client";
import { useEffect, useRef, useState, memo } from "react";
import { coachChat, fetchConversation, generateConversationTitle } from "@/app/utils/api";
import { Copy, Check } from "lucide-react";
import type {
  CoachChatResult,
  CoachChatResponse,
  CoachChatLimitData,
  CoachChatRateLimitData,
  CoachChatGenericError,
} from "@/app/utils/api";
import { fetchCoachChatPrompts } from "@/app/utils/api";
import { QuickPromptsBar } from "../AIchat/QuickPromptsBar";
import { AssistantFooter } from "../AIchat/AssistantFooter";
import { CreditsChip } from "../AIchat/CreditsChip";
import { UpgradeCta } from "../AIchat/UpgradeCta";

// Message with meta for requestId/latency/context
interface Message {
  role: "user" | "assistant";
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
}

function CoachChat({
  email,
  latestContentInfo,
  initialConversationId,
  onNewConversation,
  layout = "panel",
}: {
  onNewConversation: (newId: string) => void;
  email: string;
  latestContentInfo?: string;
  initialConversationId?: string;
  layout?: "page" | "panel";
}) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // FIX: start false; only show skeleton when we really fetch history
  const [bootstrapping, setBootstrapping] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLimited, setIsLimited] = useState(false);
  const [credits, setCredits] = useState<{ used: number; limit: number } | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [showPrompts, setShowPrompts] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // FIX: track which conversationId we've already loaded to avoid refetch/remount blink
  const loadedIdRef = useRef<string | null>(null);


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
    if (!email) return;

    fetchCoachChatPrompts(email)
      .then((r) => {
        if (!ignore) setPrompts(r.prompts || []);
      })
      .catch(() => {
        if (!ignore)
          setPrompts([
            "Give me a catchy caption for my last upload",
            "Suggest 5 niche hashtags for my audience",
            "What are my best times to post this week?",
          ]);
      });

    return () => {
      ignore = true;
    };
  }, [email]); // FIX: don't refetch on every new message

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || !email || isSending || isLimited) return;

    setShowPrompts(false);
    setIsSending(true);
    setError(null);

    // optimistic message
    const optimistic: Conversation =
      conversation
        ? { ...conversation, messages: [...conversation.messages, { role: "user", content: text }] }
        : { _id: "temp", messages: [{ role: "user", content: text }] };

    setConversation(optimistic);
    setInput("");

    try {
      const res: CoachChatResult = await coachChat({
        email,
        question: text,
        latestContentInfo,
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
    if (isSending || isLimited) return;
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


  const isEmpty = !bootstrapping && !(conversation?.messages?.length);
  const isPageLayout = layout === "page";

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

    {/* Messages */}
<div
  className={[
    "flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 md:px-4",
    isEmpty ? "flex items-center justify-center py-0" : "py-6",
    isPageLayout ? "pb-40" : "",
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
   {conversation!.messages.map((msg, idx) => {
  const isUser = msg.role === "user";
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
          <div className="mt-2 flex items-center gap-3">
            <CopyButton text={msg.content} />
            {msg.meta && <AssistantFooter meta={msg.meta} />}
          </div>
        </div>
      )}
    </div>
  );
})}

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
        {showPrompts && prompts.length > 0 && (
          <div className="w-full max-w-2xl mx-auto px-0 mb-3">
            <QuickPromptsBar
              prompts={prompts}
              onPick={(text) => {
                setInput(text);
                setShowPrompts(false);
              }}
            />
          </div>
        )}

        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {credits && <CreditsChip used={credits.used} limit={credits.limit} />}
            {isLimited && <UpgradeCta href="/dashboard/billing" />}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#1a1f2b] border border-gray-700 rounded-xl px-3 py-2">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-base leading-[1.5] pt-[0.65rem] pb-[0.65rem] overflow-hidden"
            placeholder={isLimited ? "Upgrade to continue chatting…" : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={autoGrow}
            onKeyDown={handleKeyDown}
            disabled={isSending || isLimited}
            rows={1}
            style={{ minHeight: 44 }}
          />

          <button
            className="h-10 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition disabled:opacity-60"
            type="submit"
            disabled={!input.trim() || isSending || isLimited}
            aria-disabled={isSending || isLimited}
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
