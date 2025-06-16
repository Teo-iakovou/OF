"use client";
import { useState, useRef, useEffect } from "react";
import ProjectNavDropdownButton from "@/app/components/dashboard/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/ProjectNavDropdown";
import CoachChat from "@/app/components/AIchat/CoachChat";

export default function CoachChatDashboardPage() {
  const userEmail = "testuser@gmail.com";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Optional: close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Top Bar */}
      <header className="pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            AI Chat
          </h1>
          <div ref={menuRef} className="relative inline-block md:hidden">
            <ProjectNavDropdownButton open={open} setOpen={setOpen} />
            {open && (
              <ProjectNavDropdownMenu
                overlayMode
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        </div>
      </header>

      {/* Chat and input fill the remaining space */}
      <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-2 md:px-0 justify-center">
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-base text-gray-300 mb-1 text-center mt-16">
            Ask anything about content strategy, tips, or growth.
          </p>
          <div className="text-gray-500 text-center italic text-lg mb-4">
            Start your conversation with the AI coach...
          </div>
        </div>
        <CoachChat email={userEmail} latestContentInfo={""} />
      </div>
    </div>
  );
}
