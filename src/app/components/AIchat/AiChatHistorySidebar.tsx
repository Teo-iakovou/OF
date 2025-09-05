"use client";

import { useEffect, useState } from "react";
import { fetchConversations, type ConversationSummary } from "@/app/utils/api";
import { BookOpen, Volume2 } from "lucide-react";
import { dbg } from "@/app/utils/debug";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { ttsSynthesize } from "@/app/utils/api";

type Props = {
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
  
  function formatDate(iso?: string) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  useEffect(() => {
    setLoading(true);
    dbg("history:load:start", { refreshKey });

    fetchConversations()
      .then((list) => {
        dbg("history:load:success", {
          count: list.length,
          titles: list.map((c) => c.title).slice(0, 5),
        });
        setConvos(list);
      })
      .catch((e) => dbg("history:load:error", e))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div
      className={[
        "w-full bg-[#0f1520] border border-[#232B36] rounded-2xl shadow-2xl overflow-hidden",
        className || "",
      ].join(" ")}
      style={{ maxHeight }}
    >
      {showHeader && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[#232B36] bg-[#121A24]">
          <span className="font-semibold text-gray-200 text-sm inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
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

      <div className="p-3 md:p-4 space-y-2 overflow-y-auto" style={{ maxHeight: typeof maxHeight === "number" ? maxHeight : undefined }}>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        ) : convos.length === 0 ? (
          <div className="text-xs text-gray-400">No conversations yet.</div>
        ) : (
          convos.map((c) => {
            const active = selectedId === c._id;
            return (
              <button
                key={c._id}
                onClick={() => onSelect(c._id)}
                className={[
                  "w-full text-left px-3 py-2 rounded-xl transition border",
                  active
                    ? "bg-cyan-600/15 border-cyan-600/40 text-cyan-100 ring-1 ring-cyan-500/30"
                    : "bg-[#141a26]/70 hover:bg-[#17202d] border-[#232B36] text-gray-200",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-4 h-4 ${active ? "text-cyan-400" : "text-gray-400"}`} />
                  <span className="font-medium truncate">{c.title || "Untitled"}</span>
                  <span className="ml-auto">
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const url = await ttsSynthesize(c.title || "Conversation");
                          const a = new Audio(url);
                          a.play();
                        } catch {}
                      }}
                      className="inline-flex items-center text-xs text-gray-300 hover:text-white"
                      aria-label="Play title"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-gray-400">
                  {formatDate(c.updatedAt)}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
