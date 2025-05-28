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

  // Auto-scroll to bottom on message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Load previous conversation if provided
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
    } catch (err) {
      alert("AI coach failed to respond.");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-[#181F28] border border-[#232B36] rounded-2xl shadow-lg max-w-2xl mx-auto mt-10 flex flex-col h-[540px]">
      <div className="px-6 py-4 border-b border-[#232B36]"></div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {conversation?.messages?.length ? (
          conversation.messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[85%] shadow 
                  ${
                    msg.role === "user"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-800 text-pink-200 border border-[#232B36]"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center">
            Start your conversation with the AI coach...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="flex gap-2 px-6 py-4 border-t border-[#232B36]"
      >
        <input
          className="flex-1 rounded-xl px-4 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Type your message and press Enter..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="rounded-xl bg-pink-600 hover:bg-pink-700 px-5 py-2 font-bold shadow-button transition"
          disabled={isLoading || !input.trim()}
          type="submit"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
