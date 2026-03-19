"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  createEmptyConversation,
  fetchConversation,
  fetchLatestResultForPackageInstance,
  formatContentInfo,
  fetchConversations,
} from "@/app/utils/api";
import { BookOpen } from "lucide-react";
import CoachChat from "@/app/components/AIchat/CoachChat";
import CoachChatHistory from "@/app/components/AIchat/AiChatHistorySidebar";
import ChatTokenPill from "@/app/components/analytics/ChatTokenPill";
import ContextTokenPill from "@/app/components/analytics/ContextTokenPill";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { useRouter } from "@/i18n/navigation";

export default function AiCoachChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: planData } = usePlanInfo();
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const [selectedConvoId, setSelectedConvoId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [contextInfo, setContextInfo] = useState<{
    tokensUsed?: number;
    tokensLimit?: number;
    nearLimit?: boolean;
  } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [conversationTitle, setConversationTitle] = useState<string | undefined>();
  const initRef = useRef(false);

  const activePackageInstanceId = planData?.packageInstanceId ?? null;
  const isChatUnlimited = planData?.chatTokenLimit === 0;
  const [latestContentInfo, setLatestContentInfo] = useState<string | undefined>();

  useEffect(() => {
    if (!activePackageInstanceId) return;
    fetchLatestResultForPackageInstance(activePackageInstanceId)
      .then((result) => {
        if (result) setLatestContentInfo(formatContentInfo(result));
      })
      .catch(() => {});
  }, [activePackageInstanceId]);

  const storageKey = activePackageInstanceId
    ? `ai_chat_active_conversation:${activePackageInstanceId}`
    : "ai_chat_active_conversation:unknown";

  // Sync conversation title whenever selected conversation changes
  useEffect(() => {
    if (!selectedConvoId) {
      setConversationTitle(undefined);
      return;
    }
    fetchConversation(selectedConvoId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((c) => setConversationTitle((c as any)?.title ?? undefined))
      .catch(() => {});
  }, [selectedConvoId]);

  const setActiveConversation = (id: string | undefined, replaceUrl = true) => {
    setSelectedConvoId(id);
    setRefreshKey((k) => k + 1);
    if (replaceUrl) {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("c", id);
      else params.delete("c");
      router.replace(`/dashboard/ai-chat${params.toString() ? `?${params.toString()}` : ""}`);
    }
  };

  useEffect(() => {
    if (initRef.current) return;
    let cancelled = false;

    const resolveFallback = async (invalidId?: string) => {
      let storedId: string | null = null;
      try {
        storedId = localStorage.getItem(storageKey);
      } catch {}
      if (storedId && storedId !== invalidId) {
        try {
          await fetchConversation(storedId);
          if (!cancelled) setActiveConversation(storedId, true);
          return;
        } catch {}
      }
      try {
        const list = await fetchConversations();
        if (list.length > 0) {
          if (!cancelled) setActiveConversation(list[0]._id, true);
          return;
        }
      } catch {}
      const newId = await createEmptyConversation();
      if (!cancelled) setActiveConversation(newId || undefined, true);
    };

    const init = async () => {
      try {
        const urlId = searchParams.get("c");
        if (urlId) {
          try {
            await fetchConversation(urlId);
            if (!cancelled) setActiveConversation(urlId, false);
          } catch {
            if (!cancelled) router.replace("/dashboard/ai-chat");
            await resolveFallback(urlId);
          }
          return;
        }
        await resolveFallback();
      } finally {
        initRef.current = true;
        if (!cancelled) setIsInitializing(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, storageKey, router]);

  useEffect(() => {
    try {
      if (selectedConvoId) {
        localStorage.setItem(storageKey, selectedConvoId);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {}
  }, [selectedConvoId, storageKey]);

  useEffect(() => {
    if (!historyOpen) return;
    function handle(e: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(e.target as Node))
        setHistoryOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [historyOpen]);

  function handleSelectHistory(id: string) {
    setActiveConversation(id, true);
    setHistoryOpen(false);
  }

  async function handleNewChat() {
    const newId = await createEmptyConversation();
    if (newId) {
      setActiveConversation(newId, true);
    } else {
      setActiveConversation(undefined, true);
    }
    setHistoryOpen(false);
  }

  function handleNewConversationCreated(newId: string) {
    setActiveConversation(newId, true);
  }

  // ── Skeleton (shown immediately on page load until init resolves) ──────────
  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col text-white">
        {/* Header skeleton */}
        <div className="shrink-0 border-b border-white/5 px-4 py-2.5">
          <div className="h-4 w-28 bg-white/5 animate-pulse rounded mx-auto" />
        </div>
        {/* Message skeletons */}
        <div className="flex-1 max-w-[760px] mx-auto w-full px-4 py-6 space-y-4">
          <div className="ml-auto h-10 w-2/3 bg-white/5 animate-pulse rounded-2xl" />
          <div className="h-16 w-3/4 bg-white/5 animate-pulse rounded-2xl" />
          <div className="ml-auto h-10 w-1/2 bg-white/5 animate-pulse rounded-2xl" />
        </div>
        {/* Input skeleton */}
        <div className="shrink-0 max-w-[760px] mx-auto w-full px-4 pb-4">
          <div className="h-12 w-full bg-white/5 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* ── Minimal header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 shrink-0 bg-transparent border-b border-white/5">
        {/* Title row */}
        <div className="relative flex items-center justify-center px-4 py-2.5 max-w-[760px] mx-auto">
          <h1 className="text-sm font-medium text-gray-400 truncate max-w-[60%]">
            {conversationTitle || "AI Chat"}
          </h1>

          {/* History icon button — absolute right */}
          <div className="absolute right-4" ref={historyRef}>
            <button
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition"
              onClick={() => setHistoryOpen((v) => !v)}
              aria-label="Chat History"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {historyOpen && (
              <div className="absolute right-0 mt-2 z-50 w-[min(92vw,340px)]">
                <CoachChatHistory
                  onSelect={handleSelectHistory}
                  selectedId={selectedConvoId}
                  refreshKey={refreshKey}
                  showHeader
                  onNew={handleNewChat}
                  maxHeight={420}
                />
              </div>
            )}
          </div>
        </div>

        {/* Token pills row */}
        <div className="flex items-center justify-center gap-2 pb-1.5">
          {isChatUnlimited ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/40">
              Unlimited
            </span>
          ) : (
            <ChatTokenPill />
          )}
          {contextInfo ? (
            <ContextTokenPill
              tokensUsed={contextInfo.tokensUsed}
              tokensLimit={contextInfo.tokensLimit}
              nearLimit={contextInfo.nearLimit}
            />
          ) : null}
        </div>
      </header>

      {/* ── Chat area ──────────────────────────────────────────────────────── */}
      <main className="flex-1 min-h-0 w-full">
        <div className="w-full max-w-[760px] mx-auto flex flex-col min-h-0">
          <div className="flex-1 min-h-0 flex flex-col">
            <CoachChat
              initialConversationId={selectedConvoId}
              onNewConversation={handleNewConversationCreated}
              onContextChange={setContextInfo}
              latestContentInfo={latestContentInfo}
              layout="page"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
