"use client";
import { useState, useRef, useEffect } from "react";
 
import { createEmptyConversation } from "@/app/utils/api";
import { BookOpen } from "lucide-react";
import CoachChat from "@/app/components/AIchat/CoachChat";
import CoachChatHistory from "@/app/components/AIchat/AiChatHistorySidebar";

export default function AiCoachChatPage() {
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : "";

  const [historyOpen, setHistoryOpen] = useState(false);
  
  const historyRef = useRef<HTMLDivElement>(null);

  const [selectedConvoId, setSelectedConvoId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  

  useEffect(() => {
    if (!historyOpen) return;
    function handle(e: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) setHistoryOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [historyOpen]);

  function handleSelectHistory(id: string) {
    setSelectedConvoId(id);
    setHistoryOpen(false);
  }

  async function handleNewChat() {
    if (!userEmail) return;
    const newId = await createEmptyConversation(userEmail);
    if (newId) {
      setSelectedConvoId(newId);
      setRefreshKey(k => k + 1);
    } else {
      setSelectedConvoId(undefined);
      setRefreshKey(k => k + 1);
    }
    setHistoryOpen(false);
  }

  function handleNewConversationCreated(newId: string) {
    setSelectedConvoId(newId);
    setRefreshKey(k => k + 1);
  }

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 shrink-0 pt-4 md:pt-12 px-4 md:px-12 lg:px-20 max-w-6xl mx-auto w-full bg-transparent">
        <div className="relative">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">AI Chat</h1>

            <button
              className="px-4 py-2 rounded bg-gray-900 hover:bg-gray-800 text-gray-100 hover:text-cyan-400 transition flex items-center gap-2"
              onClick={() => setHistoryOpen(v => !v)}
            >
              <span className="hidden md:inline font-medium">Chat History</span>
              <BookOpen className="w-5 h-5 md:hidden" />
            </button>
          </div>

          {/* Mobile Project Nav moved to global drawer in layout */}

          {/* History popover */}
          {historyOpen && (
            <div ref={historyRef} className="absolute right-0 mt-2 z-50 w-[340px]">
              <CoachChatHistory
                userEmail={userEmail}
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
              email={userEmail}
              initialConversationId={selectedConvoId}
              onNewConversation={handleNewConversationCreated}
              layout="page"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
