import React from "react";
import { Metadata } from "next";
import { ChatLayout } from "@/components/chat/ChatLayout";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Messagerie | Kisakata",
  description: "Discussions privées et groupes thématiques de la communauté Sakata.",
};

export default function ChatRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="hidden md:block flex-shrink-0">
        <Navbar />
      </div>
      <div className="flex-1 overflow-hidden relative">
        <ChatLayout>
          {children}
        </ChatLayout>
      </div>
    </div>
  );
}
