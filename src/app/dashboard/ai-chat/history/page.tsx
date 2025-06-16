"use client";
import { useState, useRef, useEffect } from "react";
import CoachChatHistory from "@/app/components/AIchat/CoachChatHistory";
import ProjectNavDropdownButton from "@/app/components/dashboard/ProjectNavDropdownButton";
import ProjectNavDropdownMenu from "@/app/components/dashboard/ProjectNavDropdown";

export default function AiChatHistoryPage() {
  const userId = "680e9586ff7aa4675f16343a"; // your MongoDB userId
  const [selectedConvoId, setSelectedConvoId] = useState<string | undefined>();
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
    <main>
      <header className="pt-20 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            AI Chat History
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
      <div className="flex flex-col items-center">
        <CoachChatHistory
          userId={userId}
          onSelect={setSelectedConvoId}
          selectedId={selectedConvoId}
        />
      </div>
    </main>
  );
}
