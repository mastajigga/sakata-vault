"use client";

import React, { useState, useEffect } from "react";
import { X, Search, User as UserIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  username: string | null;
  nickname: string | null;
  avatar_url: string | null;
}

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewChatModal({ isOpen, onClose }: NewChatModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setProfiles([]);
    } else {
      searchUsers("");
    }
  }, [isOpen]);

  const searchUsers = async (query: string) => {
    if (!user) return;
    setLoading(true);
    try {
      let req = supabase
        .from('profiles')
        .select('id, username, nickname, avatar_url')
        .neq('id', user.id)
        .limit(20);
        
      if (query) {
        req = req.or(`username.ilike.%${query}%,nickname.ilike.%${query}%`);
      }
      
      const { data, error } = await req;
      if (error) {
        console.error("Error searching users:", error);
      } else {
        setProfiles(data as Profile[] || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) searchUsers(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  const startConversation = async (targetUserId: string) => {
    if (!user || creating) return;
    setCreating(true);

    try {
      // 1. Check if a direct conversation already exists between these users
      const { data: existingParticipants, error: epError } = await supabase
        .from('chat_participants')
        .select('conversation_id');
        
      // For a robust query, ideally we need an RPC.
      // But we can just create a new one, or fetch my conversations and their participants.
      // Easiest is just to create a new one, worst case we have multiple DMs (which is okay, or we could handle it better)
      // Since it's a simple setup, we'll just create a new conversation.
      
      const { data: convData, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          type: 'direct',
          created_by: user.id
        })
        .select('id')
        .single();
        
      if (convError) throw convError;
      
      const convId = convData.id;
      
      // 2. Add both participants
      const { error: partError } = await supabase
        .from('chat_participants')
        .insert([
          { conversation_id: convId, user_id: user.id, role: 'admin' },
          { conversation_id: convId, user_id: targetUserId, role: 'member' }
        ]);
        
      if (partError) throw partError;
      
      // 3. Close & Redirect
      onClose();
      router.push(`/chat/${convId}`);
      
    } catch (e) {
      console.error("Failed to start conversation:", e);
      alert("Erreur lors de la création de la conversation.");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh] border border-stone-200 dark:border-stone-800">
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-white">Nouvelle discussion</h2>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition rounded-full hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-stone-100 dark:border-stone-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher un membre (pseudo)..."
              autoFocus
              className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center text-stone-500 text-sm">Recherche en cours...</div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm">
              Aucun membre trouvé.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => startConversation(p.id)}
                  disabled={creating}
                  className="flex items-center gap-3 p-3 w-full text-left rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center overflow-hidden shrink-0 border border-amber-200 dark:border-amber-800/50">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt={p.username || ""} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="text-amber-600 dark:text-amber-500 w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 dark:text-white truncate">
                      {p.username || "Membre anomyme"}
                    </p>
                    {p.nickname && (
                      <p className="text-xs text-stone-500 truncate">@{p.nickname}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
