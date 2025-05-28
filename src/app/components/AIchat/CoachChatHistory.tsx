"use client";
import { useEffect, useState } from "react";
import { fetchConversations } from "@/app/utils/api";

interface Conversation {
  _id: string;
  title?: string;
  updatedAt?: string;
}

export default function CoachChatHistory({
  userId,
  onSelect,
  selectedId,
}: {
  userId: string;
  onSelect: (id: string) => void;
  selectedId?: string;
}) {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetchConversations(userId)
      .then(setConvos)
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="w-full max-w-xs bg-[#181F28] border border-[#232B36] rounded-2xl shadow-lg p-4 space-y-2 overflow-y-auto h-[420px]">
      <h4 className="font-bold mb-2 text-pink-400">AI Chat History</h4>
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
            <span className="font-medium">{c.title || "Untitled"}</span>
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
