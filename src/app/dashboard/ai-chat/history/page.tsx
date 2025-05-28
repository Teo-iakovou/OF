"use client";
import CoachChatHistory from "@/app/components/AIchat/CoachChatHistory";
import ProjectNavDropdown from "@/app/components/dashboard/ProjectNavDropdown";
import { useState } from "react";

export default function AiChatHistoryPage() {
  const userId = "680e9586ff7aa4675f16343a"; // your MongoDB userId
  const [selectedConvoId, setSelectedConvoId] = useState<string | undefined>();

  return (
    <main>
      <ProjectNavDropdown />
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
        AI Chat History
      </h1>
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
