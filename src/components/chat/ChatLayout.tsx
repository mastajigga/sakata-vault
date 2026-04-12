"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ChatSidebar } from "./ChatSidebar";

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const activeConversationId = params.id as string | undefined;

  return (
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
      {/* Sidebar - Hidden on mobile if a chat is active */}
      <div 
        className={`w-full md:w-80 flex-shrink-0 border-r border-stone-200 dark:border-stone-800 md:block ${
          activeConversationId ? "hidden" : "block"
        }`}
      >
        <ChatSidebar activeId={activeConversationId || null} />
      </div>

      {/* Main Chat Window - Hidden on mobile if NO chat is active */}
      <div 
        className={`flex-1 flex flex-col h-full bg-[#f8f7f5] dark:bg-stone-950 ${
          !activeConversationId ? "hidden md:flex" : "flex"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
