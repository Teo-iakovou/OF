"use client";
import { useEffect, useRef, useState } from "react";
import { coachChat, fetchConversation, generateConversationTitle } from "@/app/utils/api";
import { dbg } from "@/app/utils/debug";

interface Message {
  role: "user" | "assistant";
  content: string;
  _id?: string;
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
  const [isSending, setIsSending] = useState(false); // only controls typing dots
  const [bootstrapping, setBootstrapping] = useState(!!initialConversationId);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const prevMsgCount = useRef<number>(0);

  // ----- load existing conversation (avoid refetch flicker) -----
  useEffect(() => {
    let ignore = false;
    if (initialConversationId && conversation?._id !== initialConversationId) {
      setBootstrapping(true);
      fetchConversation(initialConversationId)
        .then((c) => !ignore && setConversation(c))
        .finally(() => !ignore && setBootstrapping(false));
    }
    return () => {
      ignore = true;
    };
  }, [initialConversationId, conversation?._id]);

  // ----- autoscroll on new messages -----
  useEffect(() => {
    if (conversation?.messages && conversation.messages.length > prevMsgCount.current) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMsgCount.current = conversation?.messages?.length || 0;
  }, [conversation]);

  // ----- send message with optimistic UI -----
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || !email || isSending) return;

    dbg("send:start", {
      hasExistingConvo: !!conversation?._id,
      inputPreview: text.slice(0, 80),
    });

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
      const res = await coachChat({
        email,
        question: text,
        latestContentInfo,
        conversationId: conversation?._id,
        title: conversation?.title || "AI Coach Chat",
      });

      dbg("send:coachChat:response", {
        newConvoId: res.conversation?._id,
        title: res.conversation?.title,
        msgCount: res.conversation?.messages?.length,
      });

      setConversation(res.conversation);

      // ✅ stop typing dots as soon as assistant reply arrives
      setIsSending(false);

      // Generate title ONLY if this was the first user message in this convo
      const wasFirstUserMessage = (conversation?.messages?.length ?? 0) === 0;
      if (res.conversation._id && wasFirstUserMessage && typeof onNewConversation === "function") {
        const title = await generateConversationTitle(res.conversation._id, text);
        setConversation({ ...res.conversation, title: title || res.conversation.title });
        onNewConversation(res.conversation._id); // sidebar refresh
      }
    } catch (err) {
      dbg("send:error", err);
      setError("Something went wrong sending your message. Please try again.");
      if (!conversation?._id) setConversation(null);
      setIsSending(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (isSending) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Error banner */}
      {error && (
        <div className="w-full max-w-2xl mx-auto px-4 mb-2">
          <div className="rounded-lg border border-red-600/40 bg-red-600/10 text-red-300 text-sm px-3 py-2">
            {error}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 py-6 space-y-4">
        {bootstrapping ? (
          <div className="animate-pulse space-y-3">
            <div className="h-5 w-2/3 rounded-xl bg-gray-200/40" />
            <div className="h-5 w-1/2 rounded-xl bg-gray-200/40" />
            <div className="h-5 w-3/5 rounded-xl bg-gray-200/40" />
          </div>
        ) : conversation?.messages?.length ? (
          <>
            {conversation.messages.map((msg, idx) => (
              <div
                key={msg._id || idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 text-sm md:text-base max-w-[85%] rounded-2xl leading-relaxed shadow-sm
                  ${
                    msg.role === "user"
                      ? "bg-gray-200 text-black"
                      : "bg-gray-100 text-gray-800 border border-gray-300"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator bubble while awaiting assistant */}
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
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-center italic">
            Start your conversation with the AI coach...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={sendMessage}
        className="w-full max-w-2xl mx-auto px-4 py-2 -mb-10 border-t border-gray-700 bg-transparent"
      >
        <div className="flex items-center gap-3 bg-[#1a1f2b] border border-gray-700 rounded-xl px-3 py-2">
          <textarea
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-base leading-[1.5] pt-[0.65rem] pb-[0.65rem]"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            rows={1}
            style={{ minHeight: 44, maxHeight: 160 }}
          />

          <button
            className="h-10 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition disabled:opacity-60"
            type="submit"
            disabled={!input.trim() || isSending}
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