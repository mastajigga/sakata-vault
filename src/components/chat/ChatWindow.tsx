"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, MoreVertical, Timer, TimerOff, Loader2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useMessages } from "@/hooks/chat/useMessages";
import { useTyping } from "@/hooks/chat/useTyping";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../AuthProvider";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  fileUrl?: string;
  fileType?: "audio" | "image" | "pdf";
  createdAt: string;
  createdAtRaw?: string;
  isMe: boolean;
  isRead?: boolean;
  expiresIn?: "24h" | "48h" | "7_days" | "30_days" | "never";
  maxViews?: 1 | 2;
  viewCount?: number;
  hasBeenViewedByMe?: boolean;
};

// Emoji → nombre d'utilisateurs ayant réagi
export type ReactionMap = Record<string, number>;
// Réactions par message: messageId → ReactionMap
type AllReactions = Record<string, ReactionMap>;
// Mes réactions par message: messageId → Set<emoji>
type MyReactions = Record<string, Set<string>>;

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
}

export function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { 
    messages, 
    loading, 
    hasMore, 
    loadingMore, 
    loadMore, 
    sendMessage, 
    readTimestamps,
    allReactions,
    myReactions,
    toggleReaction 
  } = useMessages(conversationId);
  const { typingUsers, updateTyping } = useTyping(conversationId);
  const [showMenu, setShowMenu] = useState(false);

  // Dynamic conversation name + initial
  const [conversationName, setConversationName] = useState("Conversation");
  const [conversationInitial, setConversationInitial] = useState("C");

  useEffect(() => {
    if (!conversationId || !user) return;
    let cancelled = false;
    async function loadConversationMeta() {
      const { data } = await supabase
        .from(DB_TABLES.CHAT_PARTICIPANTS)
        .select("profiles:user_id(nickname, username)")
        .eq("conversation_id", conversationId)
        .neq("user_id", user!.id)
        .limit(1)
        .maybeSingle();
      if (cancelled || !data) return;
      const profile = (data as any).profiles;
      const name: string = profile?.nickname || profile?.username || "Conversation";
      setConversationName(name);
      setConversationInitial(name.charAt(0).toUpperCase());
    }
    loadConversationMeta();
    return () => { cancelled = true; };
  }, [conversationId, user]);

  // Toggle réaction
  const handleReact = useCallback(async (messageId: string, emoji: string) => {
    await toggleReaction(messageId, emoji);
  }, [toggleReaction]);

  // Marquer les messages comme lus quand ils sont visibles (Throttle built-in logic)
  const markMessagesAsRead = useCallback(async (visibleTime: string) => {
    if (!user) return;
    // On n'update que si nécessaire (géré par useMessages via readTimestamps ideally)
    await withRetry(async () =>
      supabase
        .from(DB_TABLES.CHAT_PARTICIPANTS)
        .update({ last_read_at: visibleTime })
        .match({ conversation_id: conversationId, user_id: user.id })
    );
  }, [conversationId, user]);

  // IntersectionObserver pour détecter les messages visibles - STABLE REFERENCE
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!user || messages.length === 0) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        let latestVisibleTime: string | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const msgElement = entry.target as HTMLElement;
            const msgId = msgElement.getAttribute('data-message-id');
            const msg = messages.find(m => m.id === msgId);
            if (msg?.createdAtRaw) {
              if (!latestVisibleTime || new Date(msg.createdAtRaw) > new Date(latestVisibleTime)) {
                latestVisibleTime = msg.createdAtRaw;
              }
            }
          }
        }
        if (latestVisibleTime) {
          markMessagesAsRead(latestVisibleTime);
        }
      },
      { threshold: 0.1 }
    );

    // Observer tous les messages
    const messageElements = document.querySelectorAll('[data-message-id]');
    messageElements.forEach(el => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [messages.length, user, markMessagesAsRead]); // Only re-run if count changes or user changes

  // Trouver l'userId de l'interlocuteur principal (pour calculer isRead)
  const otherParticipantId = messages.find(m => !m.isMe)?.senderId;

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Ephemeral mode state
  const [isTemporaryConversation, setIsTemporaryConversation] = useState(false);
  const [temporaryDuration, setTemporaryDuration] = useState<"24h" | "48h">("24h");
  const [showEphemeralSubmenu, setShowEphemeralSubmenu] = useState(false);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = () => {
      setShowMenu(false);
      setShowEphemeralSubmenu(false);
    };
    if (showMenu) {
      document.addEventListener("click", handleClick, { capture: true, once: true });
    }
    return () => document.removeEventListener("click", handleClick, true);
  }, [showMenu]);

  const handleSendMessage = async (
    content: string,
    attachment?: File | null,
    expiresIn?: string,
    maxViews?: 1 | 2
  ) => {
    await sendMessage(content, attachment, expiresIn, maxViews);
  };

  const activateEphemeral = (duration: "24h" | "48h") => {
    setTemporaryDuration(duration);
    setIsTemporaryConversation(true);
    setShowEphemeralSubmenu(false);
    setShowMenu(false);
  };

  const deactivateEphemeral = () => {
    setIsTemporaryConversation(false);
    setShowEphemeralSubmenu(false);
    setShowMenu(false);
  };

  const handleMenuAction = async (action: "mute" | "save" | "delete") => {
    setShowMenu(false);
    if (action === "save") {
      const text = messages
        .map((m) => `[${m.createdAt}] ${m.senderName}: ${m.content}${m.fileUrl ? " [Pièce jointe]" : ""}`)
        .join("\n");
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sakata_chat_export.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else if (action === "mute") {
      alert("Conversation mise en sourdine. (Notifications désactivées)");
    } else if (action === "delete") {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation ?")) {
        try {
          if (!user) return;
          await supabase
            .from(DB_TABLES.CHAT_PARTICIPANTS)
            .delete()
            .match({ conversation_id: conversationId, user_id: user.id });
          window.location.reload();
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
          <button
            onClick={onBack}
            className="mr-3 p-2 -ml-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 md:hidden"
            aria-label="Retour aux conversations"
          >
            <ArrowLeft size={20} className="text-stone-700 dark:text-stone-300" />
          </button>
          <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white mr-3 shadow-md font-bold text-sm">
            {conversationInitial}
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 font-serif leading-tight">
              {conversationName}
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-500 opacity-90">En ligne</p>
          </div>
        </div>

        <div className="flex items-center text-stone-500 gap-1 md:gap-3 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
              setShowEphemeralSubmenu(false);
            }}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Options de la conversation"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div
              className="absolute top-full right-0 mt-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-lg overflow-visible flex flex-col w-52 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setShowEphemeralSubmenu(!showEphemeralSubmenu)}
                  className={`w-full p-3 text-sm text-left flex items-center justify-between gap-2 transition-colors ${
                    isTemporaryConversation
                      ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                      : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isTemporaryConversation ? <Timer size={15} className="text-amber-500" /> : <TimerOff size={15} />}
                    Mode temporaire
                    {isTemporaryConversation && (
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-semibold leading-none">
                        {temporaryDuration}
                      </span>
                    )}
                  </span>
                  <span className="text-stone-400 text-xs">›</span>
                </button>

                {showEphemeralSubmenu && (
                  <div className="absolute right-full top-0 mr-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-lg overflow-hidden flex flex-col w-40 z-50">
                    <div className="p-2 border-b border-stone-100 dark:border-stone-700 text-[10px] font-semibold text-stone-400 uppercase tracking-wider bg-stone-50 dark:bg-stone-900/50">
                      Durée éphémère
                    </div>
                    <button
                      onClick={() => activateEphemeral("24h")}
                      className={`p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 flex items-center gap-2 ${
                        isTemporaryConversation && temporaryDuration === "24h"
                          ? "text-amber-600 font-medium bg-amber-50 dark:bg-stone-700"
                          : "text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      🕛 24 heures
                    </button>
                    <button
                      onClick={() => activateEphemeral("48h")}
                      className={`p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 flex items-center gap-2 ${
                        isTemporaryConversation && temporaryDuration === "48h"
                          ? "text-amber-600 font-medium bg-amber-50 dark:bg-stone-700"
                          : "text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      🕑 48 heures
                    </button>
                    {isTemporaryConversation && (
                      <>
                        <div className="border-t border-stone-100 dark:border-stone-700" />
                        <button
                          onClick={deactivateEphemeral}
                          className="p-3 text-sm text-left hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                        >
                          <TimerOff size={14} />
                          Désactiver
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-stone-100 dark:border-stone-700" />
              <button
                onClick={() => handleMenuAction("mute")}
                className="p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 text-stone-700 dark:text-stone-300"
              >
                🔕 Mettre en sourdine
              </button>
              <button
                onClick={() => handleMenuAction("save")}
                className="p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 text-stone-700 dark:text-stone-300"
              >
                📥 Sauvegarder (Export)
              </button>
              <div className="border-t border-stone-100 dark:border-stone-700" />
              <button
                onClick={() => handleMenuAction("delete")}
                className="p-3 text-sm text-left hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 font-medium"
              >
                🗑 Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ephemeral mode banner */}
      {isTemporaryConversation && (
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/40">
          <Timer size={13} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            Mode éphémère — messages supprimés après {temporaryDuration}
          </p>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1">
        {/* Load More button */}
        {hasMore && (
          <div className="flex justify-center py-3">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-50"
              aria-label="Charger les messages précédents"
            >
              {loadingMore ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                "⬆ Messages précédents"
              )}
            </button>
          </div>
        )}

        <div className="text-center my-4">
          <span className="text-xs bg-stone-200/60 dark:bg-stone-800/60 text-stone-500 px-3 py-1 rounded-full backdrop-blur-sm">
            Début de la discussion
          </span>
        </div>

        {loading ? (
          <div className="text-center text-sm text-stone-500 py-8">
            <Loader2 size={20} className="animate-spin mx-auto mb-2 text-amber-600" />
            Chargement des messages...
          </div>
        ) : (
          messages.map((msg) => {
            // Calculer isRead: mon message est lu si last_read_at de l'interlocuteur > createdAtRaw
            let isRead = false;
            if (msg.isMe && msg.createdAtRaw && otherParticipantId) {
              const otherReadAt = readTimestamps[otherParticipantId];
              if (otherReadAt) {
                isRead = new Date(otherReadAt) >= new Date(msg.createdAtRaw);
              }
            }

            return (
              <MessageBubble
                key={msg.id}
                message={{ ...msg, isRead }}
                isTemporary={isTemporaryConversation}
                reactions={allReactions[msg.id]}
                myReactions={myReactions[msg.id]}
                onReact={handleReact}
              />
            );
          })
        )}
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 md:px-6 pb-2 text-xs italic text-stone-500 flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
          </div>
          <span>
            {typingUsers.join(", ")} {typingUsers.length > 1 ? "écrivent" : "écrit"}...
          </span>
        </div>
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        onTyping={updateTyping}
        isTemporaryConversation={isTemporaryConversation}
        temporaryDuration={temporaryDuration}
      />
    </div>
  );
}
