import React from "react";
import { Metadata } from "next";
import { ChatLayout } from "@/components/chat/ChatLayout";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Messagerie | Sakata",
  description: "Discussions privées et groupes thématiques de la communauté Sakata.",
};

export default function ChatRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex-1 overflow-hidden relative md:pt-[80px]">
        <ChatLayout>
          {children}
        </ChatLayout>
      </div>
    </div>
  );
}
