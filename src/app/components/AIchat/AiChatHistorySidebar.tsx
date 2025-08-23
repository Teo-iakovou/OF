"use client";

import { useEffect, useState } from "react";
import { fetchConversations, type ConversationSummary } from "@/app/utils/api";
import { BookOpen } from "lucide-react";
import { dbg } from "@/app/utils/debug";

type Props = {
  userEmail: string;
  onSelect: (id: string) => void;
  selectedId?: string;
  refreshKey: number;

  /** When true, render the header row with title + “+ New” */
  showHeader?: boolean;
  /** Called when the header’s “+ New” is clicked */
  onNew?: () => void;

  /** Optional className overrides for container */
  className?: string;
  /** Optional maxHeight override (useful for popovers) */
  maxHeight?: number | string;
};

export default function CoachChatHistory({
  userEmail,
  onSelect,
  selectedId,
  refreshKey,
  showHeader = false,
  onNew,
  className,
  maxHeight = 420,
}: Props) {
  const [convos, setConvos] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;
    setLoading(true);
    dbg("history:load:start", { userEmail, refreshKey });

    fetchConversations(userEmail)
      .then((list) => {
        dbg("history:load:success", {
          count: list.length,
          titles: list.map((c) => c.title).slice(0, 5),
        });
        setConvos(list);
      })
      .catch((e) => dbg("history:load:error", e))
      .finally(() => setLoading(false));
  }, [userEmail, refreshKey]);

  return (
    <div
      className={[
        "w-full bg-[#181F28] border border-[#232B36] rounded-2xl shadow-lg overflow-hidden",
        className || "",
      ].join(" ")}
      style={{ maxHeight }}
    >
      {showHeader && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-700">
          <span className="font-semibold text-gray-200 text-sm inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            AI Chat History
          </span>
          {!!onNew && (
            <button
              onClick={onNew}
              className="px-2 py-1 text-xs rounded text-white bg-cyan-600 hover:bg-cyan-700 transition"
            >
              + New
            </button>
          )}
        </div>
      )}

      <div className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: typeof maxHeight === "number" ? maxHeight : undefined }}>
        {loading ? (
          <div className="text-xs text-gray-400">Loading...</div>
        ) : convos.length === 0 ? (
          <div className="text-xs text-gray-400">No conversations yet.</div>
        ) : (
          convos.map((c) => (
            <button
              key={c._id}
              onClick={() => onSelect(c._id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                selectedId === c._id
                  ? "bg-pink-700 text-white"
                  : "bg-gray-900 text-pink-200 hover:bg-pink-800/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white" />
                <span className="font-medium">{c.title || "Untitled"}</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {c.updatedAt ? new Date(c.updatedAt).toLocaleString() : ""}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}