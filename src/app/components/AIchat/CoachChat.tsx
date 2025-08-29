"use client";
import { useEffect, useRef, useState } from "react";
import { coachChat, fetchConversation, generateConversationTitle } from "@/app/utils/api";
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

export default function CoachChat({
  email,
  latestContentInfo,
  initialConversationId,
  onNewConversation,
}: {
  onNewConversation: (newId: string) => void;
  email: string;
  latestContentInfo?: string;
  initialConversationId?: string;
}) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(!!initialConversationId);
  const [error, setError] = useState<string | null>(null);
  const [isLimited, setIsLimited] = useState(false);
  const [credits, setCredits] = useState<{ used: number; limit: number } | null>(null); // optional
  const [prompts, setPrompts] = useState<string[]>([]);
const textareaRef = useRef<HTMLTextAreaElement>(null);
const [showPrompts, setShowPrompts] = useState(true);


  const chatEndRef = useRef<HTMLDivElement>(null);
  const prevMsgCount = useRef<number>(0);

  const autoGrow = () => {
  const el = textareaRef.current;
  if (!el) return;
  el.style.height = "0px";                  // shrink first (for deletions)
  el.style.height = `${el.scrollHeight}px`; // grow to content height
};

useEffect(() => {
  autoGrow();
}, [input]);

// put this near your other derived values
const messageCount = conversation?.messages?.length ?? 0;

// Autoscroll on new messages
useEffect(() => {
  if (messageCount > prevMsgCount.current) {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  prevMsgCount.current = messageCount;
}, [messageCount]); // <-- depend on the count, not the whole conversation


  // Load existing conversation
 useEffect(() => {
  let ignore = false;

  if (initialConversationId) {
    setBootstrapping(true);

    // ✅ flip into fresh-chat mode so prompts show immediately
    setShowPrompts(true);
    setInput("");
    setConversation({ _id: initialConversationId, title: "", messages: [] });

    fetchConversation(initialConversationId)
      .then((c) => {
        if (ignore) return;
        setConversation(c);
        // If the fetched conversation actually has messages, hide prompts again
        if ((c?.messages?.length ?? 0) > 0) setShowPrompts(false);
      })
      .finally(() => {
        if (!ignore) setBootstrapping(false);
      });
  }

  return () => { ignore = true; };
}, [initialConversationId]); // ← only depend on the ID

  // Autoscroll on new messages
  useEffect(() => {
    if (conversation?.messages && conversation.messages.length > prevMsgCount.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMsgCount.current = conversation?.messages?.length || 0;
  }, [conversation]);

const sendMessage = async (e?: React.FormEvent) => {
  e?.preventDefault();
  const text = input.trim();
  if (!text || !email || isSending || isLimited) return;
setShowPrompts(false);
  setIsSending(true);
  setError(null);

  // optimistic UI
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

    // IMPORTANT: do NOT destructure `data` before narrowing on `status`
    switch (res.status) {
      case 402: {
        const data = res.data as CoachChatLimitData;
        setIsLimited(true);
        setError(data.error || "You’ve reached your plan’s chat limit.");
        if ((data as CoachChatLimitData).quota) {
          setCredits((data as CoachChatLimitData).quota!);
        }
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

        // Attach meta to the last assistant message so <AssistantFooter/> can render
        const conv = { ...data.conversation }; // shallow copy
        if (conv?.messages?.length) {
          for (let i = conv.messages.length - 1; i >= 0; i--) {
            if (conv.messages[i].role === "assistant") {
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
        }

        setConversation(conv);
        setIsSending(false);
        if (data.quota) setCredits(data.quota);

        const wasFirstUserMessage = (conversation?.messages?.length ?? 0) === 0;
        if (conv._id && wasFirstUserMessage && typeof onNewConversation === "function") {
          const title = await generateConversationTitle(conv._id, text);
          setConversation({ ...conv, title: title || conv.title });
          onNewConversation(conv._id);
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

  const isEmpty = !bootstrapping && !(conversation?.messages?.length);

  // Load Quick Prompts for this user
useEffect(() => {
  let ignore = false;
  if (!email) return;
  fetchCoachChatPrompts(email)
    .then((r) => {
      if (!ignore) setPrompts(r.prompts || []);
    })
    .catch(() => {
      // fallback: static prompts (never block UI)
      if (!ignore) setPrompts([
        "Give me a catchy caption for my last upload",
        "Suggest 5 niche hashtags for my audience",
        "What are my best times to post this week?",
      ]);
    });
  return () => { ignore = true; };
}, [email, conversation?.messages?.length]);
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
            {conversation!.messages.map((msg, idx) => (
              <div key={msg._id || idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-3`}>
                <div
                  className={`px-4 py-2 text-sm md:text-base max-w-[85%] rounded-2xl leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gray-200 text-black"
                      : "bg-gray-100 text-gray-800 border border-gray-300"
                  }`}
                >
                  {msg.content}
                  {/* Assistant meta footer */}
                  {msg.role === "assistant" && <AssistantFooter meta={msg.meta} />}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="px-4 py-2 text-sm max-w-[85%] rounded-2xl shadow-sm bg-gray-100 text-gray-600 border border-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-current animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                  </span>
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
        className="shrink-0 w-full max-w-2xl mx-auto px-4 py-3 border-t border-gray-700/50 bg-transparent"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
{/* Quick prompts — wrapped grid, no horizontal scroll */}
{showPrompts && prompts.length > 0 && (
  <div className="w-full max-w-2xl mx-auto px-0 mb-3">
    <QuickPromptsBar
      prompts={prompts}
      onPick={(text) => {
        setInput(text);
        setShowPrompts(false); // ← hide immediately after selecting
        // (optional) auto-send here if you want: then call sendMessage();
      }}
    />
  </div>
)}
        {/* Credits + Upgrade */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {credits && <CreditsChip used={credits.used} limit={credits.limit} />}
            {isLimited && <UpgradeCta href="/dashboard/billing" />}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#1a1f2b] border border-gray-700 rounded-xl px-3 py-2">
        <textarea
  ref={textareaRef}
  className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-base leading-[1.5] pt-[0.65rem] pb-[0.65rem] overflow-hidden" // ← overflow-hidden, no scroll
  placeholder={isLimited ? "Upgrade to continue chatting…" : "Type your message..."}
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onInput={autoGrow}                 // ← keeps height synced with content
  onKeyDown={handleKeyDown}
  disabled={isSending || isLimited}
  rows={1}
  style={{ minHeight: 44 }}          // ← remove maxHeight to allow growth
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