"use client";

import React, { useEffect, useRef } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useMessages } from "@/hooks/chat/useMessages";

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  fileUrl?: string;
  fileType?: "audio" | "image" | "pdf";
  createdAt: string;
  isMe: boolean;
  expiresIn?: "7_days" | "30_days" | "never";
};

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
}

export function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage } = useMessages(conversationId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string, attachment?: File | null, expiresIn?: string) => {
    await sendMessage(content, attachment, expiresIn);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f7f5] dark:bg-stone-950">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm z-10 w-full">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3 p-2 -ml-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 md:hidden">
            <ArrowLeft size={20} className="text-stone-700 dark:text-stone-300" />
          </button>
          <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white mr-3 shadow-md">
            C
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 font-serif leading-tight">Conversation</h3>
            <p className="text-xs text-amber-600 dark:text-amber-500 opacity-90">En ligne</p>
          </div>
        </div>
        
        <div className="flex items-center text-stone-500 gap-1 md:gap-3">
          <button className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
      >
        <div className="text-center my-4">
          <span className="text-xs bg-stone-200/60 dark:bg-stone-800/60 text-stone-500 px-3 py-1 rounded-full backdrop-blur-sm">
            Début de la discussion
          </span>
        </div>
        
        {loading ? (
          <div className="text-center text-sm text-stone-500">Chargement des messages...</div>
        ) : messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
