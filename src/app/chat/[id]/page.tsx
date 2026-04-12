"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <ChatWindow 
      conversationId={params.id} 
      onBack={() => router.push('/chat')} 
    />
  );
}
