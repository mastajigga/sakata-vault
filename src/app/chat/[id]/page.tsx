"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function ChatConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <ChatWindow 
      conversationId={id} 
      onBack={() => router.push('/chat')} 
    />
  );
}
