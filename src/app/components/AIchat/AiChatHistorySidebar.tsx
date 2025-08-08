"use client";
import { useEffect, useState } from "react";
import { fetchConversations } from "@/app/utils/api";
import { BookOpen } from "lucide-react";
import { dbg } from "@/app/utils/debug";
interface Conversation {
  _id: string;
  title?: string;
  updatedAt?: string;
}

export default function CoachChatHistory({
  onSelect,
  selectedId,
  refreshKey,
  userEmail,
}: {
  userEmail: string;
  onSelect: (id: string) => void;
  selectedId?: string;
  refreshKey: number;
}) {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // CoachChatHistory.tsx
useEffect(() => {
  if (!userEmail) return;
  setLoading(true);
  dbg("history:load:start", { userEmail, refreshKey });

  fetchConversations(userEmail)
    .then((list) => {
      dbg("history:load:success", { count: list.length, titles: list.map((c: Conversation) => c.title).slice(0,5) });
      setConvos(list);
    })
    .catch((e) => dbg("history:load:error", e))
    .finally(() => setLoading(false));
}, [userEmail, refreshKey]);

  return (
    <div className="w-full max-w-xs bg-[#181F28] border border-[#232B36] rounded-2xl shadow-lg p-4 space-y-2 overflow-y-auto h-[420px]">
      {loading ? (
        <div className="text-xs text-gray-400">Loading...</div>
      ) : convos.length === 0 ? (
        <div className="text-xs text-gray-400">No conversations yet.</div>
      ) : (
        convos.map((c) => (
          <button
            key={c._id}
            onClick={() => onSelect(c._id)}
            className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition
              ${
                selectedId === c._id
                  ? "bg-pink-700 text-white"
                  : "bg-gray-900 text-pink-200 hover:bg-pink-800/30"
              }
            `}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white" />
              <span className="font-medium">{c.title || "Untitled"}</span>
            </div>
            <br />
            <span className="text-xs text-gray-400">
              {c.updatedAt ? new Date(c.updatedAt).toLocaleString() : ""}
            </span>
          </button>
        ))
      )}
    </div>
  );
}
