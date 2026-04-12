"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Users, User, Plus } from "lucide-react";
import { useConversations } from "@/hooks/chat/useConversations";
import { NewChatModal } from "./NewChatModal";

interface ChatSidebarProps {
  activeId: string | null;
}

export type ConversationItem = {
  id: string;
  type: "direct" | "group";
  name?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
};

export function ChatSidebar({ activeId }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { conversations, loading } = useConversations();

  const filtered = conversations.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-stone-50 dark:bg-stone-900/50">
      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* Header */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-900">
        <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">Discussions</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-stone-500 text-sm">Chargement...</div>
        ) : filtered.map(chat => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={`w-full flex items-center p-4 py-3 hover:bg-white dark:hover:bg-stone-800 border-b border-stone-100 dark:border-stone-800/50 transition ${
              activeId === chat.id ? "bg-white dark:bg-stone-800 shadow-sm" : ""
            }`}
          >
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white ${chat.type === 'group' ? 'bg-amber-600' : 'bg-emerald-600'}`}>
              {chat.type === 'group' ? <Users size={20} /> : <User size={20} />}
            </div>
            
            <div className="ml-3 flex-1 text-left overflow-hidden">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-stone-900 dark:text-stone-100 truncate">{chat.name}</span>
                <span className="text-xs text-stone-500">{new Date(chat.lastMessageAt || "").toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <span className="text-sm text-stone-500 dark:text-stone-400 truncate max-w-[180px]">
                  {chat.lastMessage}
                </span>
                {chat.unreadCount > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center text-[10px] text-white font-bold ml-2">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="p-4 text-center text-stone-500 text-sm">
            Aucune conversation trouvée.
          </div>
        )}
      </div>
    </div>
  );
}
