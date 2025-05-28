"use client";
import { useState } from "react";
import CoachChat from "@/app/components/AIchat/CoachChat";
import ProjectNavDropdown from "@/app/components/dashboard/ProjectNavDropdown";

export default function CoachChatDashboardPage() {
  const userEmail = "testuser@gmail.com";

  return (
    <main>
      <ProjectNavDropdown />
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
        AI Chat
      </h1>
      <p className="text-xs text-gray-400">
        Ask anything about content strategy, tips, or growth.
      </p>
      <div className="flex flex-col items-center">
        <div className="flex-1 w-full max-w-2xl">
          <CoachChat
            email={userEmail}
            latestContentInfo={""}
            // Remove initialConversationId since you're not using sidebar
          />
        </div>
      </div>
    </main>
  );
}
