"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
 
import { createEmptyConversation, fetchConversation } from "@/app/utils/api";
import { BookOpen } from "lucide-react";
import CoachChat from "@/app/components/AIchat/CoachChat";
import CoachChatHistory from "@/app/components/AIchat/AiChatHistorySidebar";
import ChatTokenPill from "@/app/components/analytics/ChatTokenPill";
import ContextTokenPill from "@/app/components/analytics/ContextTokenPill";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import { fetchConversations } from "@/app/utils/api";
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
  const initRef = useRef(false);

  const activePackageInstanceId = planData?.packageInstanceId ?? null;
  const isChatUnlimited = planData?.chatTokenLimit === 0;
  const storageKey = activePackageInstanceId
    ? `ai_chat_active_conversation:${activePackageInstanceId}`
    : "ai_chat_active_conversation:unknown";

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
      const urlId = searchParams.get("c");
      if (urlId) {
        try {
          await fetchConversation(urlId);
          if (!cancelled) setActiveConversation(urlId, false);
        } catch {
          if (!cancelled) router.replace("/dashboard/ai-chat");
          await resolveFallback(urlId);
        } finally {
          initRef.current = true;
        }
        return;
      }
      await resolveFallback();
      initRef.current = true;
    };

    init();
    return () => {
      cancelled = true;
    };
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
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) setHistoryOpen(false);
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

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 shrink-0 pt-4 md:pt-12 pl-16 pr-4 md:px-12 lg:px-20 max-w-6xl mx-auto w-full bg-transparent">
        <div className="relative">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">AI Chat</h1>

            <div className="flex items-center gap-3">
              {isChatUnlimited ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
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
              <button
                className="px-4 py-2 rounded bg-gray-900 hover:bg-gray-800 text-gray-100 hover:text-cyan-400 transition flex items-center gap-2"
                onClick={() => setHistoryOpen(v => !v)}
              >
                <span className="hidden md:inline font-medium">Chat History</span>
                <BookOpen className="w-5 h-5 md:hidden" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Conversations have a memory limit. When full, summarize to continue.
            {isChatUnlimited ? " Your plan tokens are unlimited." : ""}
          </p>

          {/* Mobile Project Nav moved to global drawer in layout */}

          {/* History popover */}
          {historyOpen && (
            <div ref={historyRef} className="absolute right-0 mt-2 z-50 w-[340px]">
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
      </header>

      {/* Main fills remaining height; CoachChat manages its own scroll area */}
      <main className="flex-1 min-h-0 w-full">
        <div className="w-full max-w-3xl mx-auto px-2 md:px-0 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 flex flex-col">
            <CoachChat
              initialConversationId={selectedConvoId}
              onNewConversation={handleNewConversationCreated}
              onContextChange={setContextInfo}
              layout="page"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
