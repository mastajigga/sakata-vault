"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useMessages } from "@/hooks/chat/useMessages";
import { useTyping } from "@/hooks/chat/useTyping";
import { supabase } from "@/lib/supabase";

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
  const { typingUsers, updateTyping } = useTyping(conversationId);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string, attachment?: File | null, expiresIn?: string) => {
    await sendMessage(content, attachment, expiresIn);
  };

  const handleMenuAction = async (action: 'mute' | 'save' | 'delete') => {
    setShowMenu(false);
    if (action === 'save') {
      const text = messages.map(m => `[${m.createdAt}] ${m.senderName}: ${m.content}${m.fileUrl ? ' [Pièce jointe]' : ''}`).join('\\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `sakata_chat_export.txt`;
      a.click();
    } else if (action === 'mute') {
      alert("Conversation mise en sourdine. (Notifications désactivées)");
    } else if (action === 'delete') {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation définitivement ?")) {
        try {
          // Delete from database
          const { error } = await supabase
            .from('chat_conversations')
            .delete()
            .eq('id', conversationId);

          if (error) throw error;
          
          // Go back to the conversation list
          onBack();
        } catch (error) {
          console.error("Error deleting conversation:", error);
          alert("Une erreur est survenue lors de la suppression de la conversation.");
        }
      }
    }
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
        
        <div className="flex items-center text-stone-500 gap-1 md:gap-3 relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-lg overflow-hidden flex flex-col w-48 z-50">
              <button onClick={() => handleMenuAction('mute')} className="p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 text-stone-700 dark:text-stone-300">
                🔕 Mettre en sourdine
              </button>
              <button onClick={() => handleMenuAction('save')} className="p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 text-stone-700 dark:text-stone-300">
                📥 Sauvegarder (Export)
              </button>
              <div className="border-t border-stone-100 dark:border-stone-700"></div>
              <button onClick={() => handleMenuAction('delete')} className="p-3 text-sm text-left hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 font-medium">
                🗑 Supprimer
              </button>
            </div>
          )}
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

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 md:px-6 pb-2 text-xs italic text-stone-500 flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></div>
          </div>
          <span>{typingUsers.join(', ')} {typingUsers.length > 1 ? 'écrivent' : 'écrit'}...</span>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={handleSendMessage} onTyping={updateTyping} />
    </div>
  );
}
