"use client";
import { useState, useRef, useEffect } from "react";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";
import { createEmptyConversation } from "@/app/utils/api";
import { BookOpen } from "lucide-react";
import CoachChat from "@/app/components/AIchat/CoachChat";
import CoachChatHistory from "@/app/components/AIchat/AiChatHistorySidebar";

export default function AiCoachChatPage() {
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : "";

  const [openNav, setOpenNav] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const [selectedConvoId, setSelectedConvoId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!openNav) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenNav(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openNav]);

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
    <div className="h-full flex flex-col overflow-hidden text-white">
      {/* Header */}
      <header className="shrink-0 pt-4 md:pt-12 px-4 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
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

          {/* Mobile Project Nav under the title */}
          <div className="mt-3 md:hidden" ref={menuRef}>
            <ProjectNavDropdownButton open={openNav} setOpen={setOpenNav} />
            {openNav && (
              <div className="relative z-40">
                <ProjectNavDropdownMenu overlayMode onClose={() => setOpenNav(false)} />
              </div>
            )}
          </div>

          {/* History popover */}
          {historyOpen && (
            <div
              ref={historyRef}
              className="absolute right-0 mt-2 z-50 w-[320px] max-h-[70vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-700">
                <span className="font-semibold text-gray-200">AI Chat History</span>
                <button
                  className="px-2 py-1 text-xs rounded text-white bg-cyan-600 hover:bg-cyan-700 transition"
                  onClick={handleNewChat}
                >
                  + New
                </button>
              </div>
              <CoachChatHistory
                userEmail={userEmail}
                onSelect={handleSelectHistory}
                selectedId={selectedConvoId}
                refreshKey={refreshKey}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main fills the rest; chat is anchored to bottom.
          The wrapper below gives CoachChat a real height to work with. */}
      <main className="flex-1 min-h-0 w-full">
        <div className="h-full w-full max-w-3xl mx-auto px-2 md:px-0 flex flex-col min-h-0">
<div className="flex-1 min-h-0 flex flex-col justify-end overflow-hidden">            <CoachChat
              email={userEmail}
              initialConversationId={selectedConvoId}
              onNewConversation={handleNewConversationCreated}
            />
          </div>
        </div>
      </main>
    </div>
  );
}