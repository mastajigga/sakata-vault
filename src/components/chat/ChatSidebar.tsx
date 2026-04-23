"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Users, User, Plus, ArrowLeft, MessageSquare } from "lucide-react";
import { useConversations } from "@/hooks/chat/useConversations";
import { NewChatModal } from "./NewChatModal";
import { MemberImage } from "@/components/MemberImage";

interface ChatSidebarProps {
  activeId: string | null;
}

export type ConversationItem = {
  id: string;
  type: "direct" | "group";
  name?: string;
  avatar_url?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
};

export function ChatSidebar({ activeId }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { conversations, loading, markConversationRead } = useConversations();

  const filtered = conversations.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-stone-50 dark:bg-stone-900/50">
      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* Header */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-900">
        <div className="flex items-center gap-3">
          <Link 
            href="/membres" 
            className="md:hidden p-2 -ml-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Retour au site"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">Discussions</h2>
        </div>
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
        ) : conversations.length === 0 ? (
          /* Empty state — no conversations at all */
          <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <MessageSquare size={28} className="text-amber-600 dark:text-amber-500" />
            </div>
            <h3 className="text-stone-900 dark:text-white font-semibold mb-1 text-sm">Aucune discussion</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mb-4 leading-relaxed max-w-[180px]">
              Commencez une conversation avec un membre.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-full text-xs font-semibold hover:bg-amber-700 transition active:scale-95"
            >
              Nouvelle discussion
            </button>
          </div>
        ) : (
          <>
            {filtered.map(chat => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                onClick={() => markConversationRead(chat.id)}
                className={`w-full flex items-center p-4 py-3 hover:bg-white dark:hover:bg-stone-800 border-b border-stone-100 dark:border-stone-800/50 transition ${
                  activeId === chat.id ? "bg-white dark:bg-stone-800 shadow-sm" : ""
                }`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full overflow-hidden relative shadow-sm border border-stone-200 dark:border-stone-700`}>
                  {chat.type === 'direct' ? (
                    <MemberImage profile={{ avatar_url: chat.avatar_url, nickname: chat.name }} />
                  ) : (
                    <div className="w-full h-full bg-amber-600 flex items-center justify-center text-white">
                      <Users size={20} />
                    </div>
                  )}
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
                    {chat.unreadCount > 0 && activeId !== chat.id && (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center text-[10px] text-white font-bold ml-2">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            {filtered.length === 0 && searchQuery && (
              <div className="py-12 px-6 text-center">
                <Search size={20} className="text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">
                  Aucun résultat pour &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
