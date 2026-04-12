import React from "react";
import { Metadata } from "next";
import { ChatLayout } from "@/components/chat/ChatLayout";

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
    <ChatLayout>
      {children}
    </ChatLayout>
  );
}
