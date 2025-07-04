"use client";
import { useState, useRef, useEffect } from "react";
import ProjectNavDropdownButton from "@/app/components/dashboard/buttons/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/buttons/ProjectNavDropdown";
import CoachChat from "@/app/components/AIchat/CoachChat";
import CoachChatHistory from "@/app/components/AIchat/AiChatHistorySidebar";
import { BookOpen } from "lucide-react";

export default function AiCoachChatPage() {
  // Get user email from localStorage (replace with auth context/provider if you add one)
  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail") || ""
      : "";

  // You may want to fetch userId from backend or global state in the future
  const userId = ""; // TODO: fetch actual userId if you support it

  const [openNav, setOpenNav] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [selectedConvoId, setSelectedConvoId] = useState<string | undefined>();

  // Close project nav dropdown on outside click
  useEffect(() => {
    if (!openNav) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpenNav(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openNav]);

  // Close chat history on outside click
  const historyRef = useRef<HTMLDivElement>(null);
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

  function handleNewChat() {
    setSelectedConvoId(undefined);
    setHistoryOpen(false);
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
            {/* Chat History Button */}
            <button
              className="px-5 py-2 rounded hover:bg-gray-800 bg-gray-900 text-gray-100 hover:text-cyan-400 transition flex items-center gap-2"
              onClick={() => setHistoryOpen((v) => !v)}
            >
              <span className="hidden md:inline font-medium">Chat History</span>
              <BookOpen className="w-5 h-5 md:hidden" />
            </button>

            {/* Dropdown for Chat History */}
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
                  userId={userId}
                  onSelect={handleSelectHistory}
                  selectedId={selectedConvoId}
                />
              </div>
            )}
            {/* Project Nav Dropdown (mobile only) */}
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
        <CoachChat email={userEmail} initialConversationId={selectedConvoId} />
      </div>
    </div>
  );
}
