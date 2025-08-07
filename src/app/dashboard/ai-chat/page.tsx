"use client";
import { useState, useRef, useEffect } from "react";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";
import {createEmptyConversation} from "@/app/utils/api";
import { BookOpen } from "lucide-react";
import CoachChat from "@/app/components/AIchat/CoachChat";
import CoachChatHistory from "@/app/components/AIchat/AiChatHistorySidebar";

export default function AiCoachChatPage() {
  const userEmail = typeof window !== "undefined"
    ? localStorage.getItem("userEmail") || ""
    : "";
  

  const [openNav, setOpenNav] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const [selectedConvoId, setSelectedConvoId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!openNav) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenNav(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openNav]);

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
    setSelectedConvoId(id);
    setHistoryOpen(false);
  }


  async function handleNewChat() {
  if (!userEmail) return;
  const newId = await createEmptyConversation(userEmail);
  if (newId) {
    setSelectedConvoId(newId);
    setRefreshKey((k) => k + 1);
    setHistoryOpen(false);
  } else {
    setSelectedConvoId(undefined);
    setRefreshKey((k) => k + 1);
    setHistoryOpen(false);
  }
}


  
  function handleNewConversationCreated(newId: string) {
    setSelectedConvoId(newId);
    setRefreshKey((k) => k + 1);
  }
  

  return (
    <div className="flex flex-col h-screen text-white">
      {/* Header */}
      <header className="pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2 relative">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            AI Chat
          </h1>
          <div className="flex items-center gap-4">
            <button
              className="px-5 py-2 rounded hover:bg-gray-800 bg-gray-900 text-gray-100 hover:text-cyan-400 transition flex items-center gap-2"
              onClick={() => setHistoryOpen((v) => !v)}
            >
              <span className="hidden md:inline font-medium">Chat History</span>
              <BookOpen className="w-5 h-5 md:hidden" />
            </button>
            {historyOpen && (
              <div
                ref={historyRef}
                className="absolute top-full right-0 mt-2 z-40 w-[320px] bg-gray-900 border border-gray-700 rounded-lg shadow-lg"
              >
                <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-700">
                  <span className="font-semibold text-gray-200">
                    AI Chat History
                  </span>
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
            <div ref={menuRef} className="relative inline-block md:hidden">
              <ProjectNavDropdownButton open={openNav} setOpen={setOpenNav} />
              {openNav && (
                <ProjectNavDropdownMenu
                  overlayMode
                  onClose={() => setOpenNav(false)}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat UI */}
      <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-2 md:px-0 justify-center">
        <CoachChat
          email={userEmail}
          initialConversationId={selectedConvoId}
          onNewConversation={handleNewConversationCreated}
        />
      </div>
    </div>
  );
}
