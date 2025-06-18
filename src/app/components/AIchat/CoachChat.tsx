"use client";
import { useState, useEffect, useRef } from "react";
import { coachChat, fetchConversation } from "@/app/utils/api";

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
}: {
  email: string;
  latestContentInfo?: string;
  initialConversationId?: string;
}) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const prevMsgCount = useRef<number>(0);

  useEffect(() => {
    // Only scroll if messages increased
    if (
      conversation?.messages &&
      conversation.messages.length > prevMsgCount.current
    ) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMsgCount.current = conversation?.messages?.length || 0;
  }, [conversation]);

  useEffect(() => {
    if (initialConversationId) {
      fetchConversation(initialConversationId).then(setConversation);
    }
  }, [initialConversationId]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !email) return;
    setIsLoading(true);
    try {
      const res = await coachChat({
        email,
        question: input.trim(),
        latestContentInfo,
        conversationId: conversation?._id,
        title: conversation ? conversation.title : "AI Coach Chat",
      });
      setConversation(res.conversation);
      setInput("");
      setIsLoading(false); // <-- Add this line here
    } catch {
      alert("AI coach failed to respond.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 py-6 space-y-4">
        {conversation?.messages?.length ? (
          conversation.messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
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
          ))
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
        <div className="flex items-end gap-3 bg-[#1a1f2b] border border-gray-700 rounded-xl px-3 py-2">
          <textarea
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none resize-none text-base leading-[1.5] pt-[0.65rem] pb-[0.65rem]"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            rows={1}
            style={{ minHeight: 44, maxHeight: 160 }}
          />
          {isLoading ? (
            <div className="flex items-center px-3">
              <span className="dot-wave">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
            </div>
          ) : (
            <button
              className="px-4 py-2 mb-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition"
              type="submit"
              disabled={!input.trim()}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
