"use client";

import React, { useState, useEffect } from "react";
import { X, Search, User as UserIcon, Users, Check } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { DB_TABLES } from "@/lib/constants/db";

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

  // Multi-select for group chat
  const [selectedUsers, setSelectedUsers] = useState<Profile[]>([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setProfiles([]);
      setSelectedUsers([]);
      setGroupName("");
    } else {
      searchUsers("");
    }
  }, [isOpen]);

  const searchUsers = async (query: string) => {
    if (!user) return;
    setLoading(true);
    try {
      let req = supabase
        .from(DB_TABLES.PROFILES)
        .select("id, username, nickname, avatar_url")
        .neq("id", user.id)
        .limit(20);

      if (query) {
        req = req.or(`username.ilike.%${query}%,nickname.ilike.%${query}%`);
      }

      const { data, error } = await req;
      if (error) {
        console.error("Error searching users:", error);
      } else {
        setProfiles((data as Profile[]) || []);
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

  const toggleUserSelection = (p: Profile) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === p.id);
      if (isSelected) return prev.filter((u) => u.id !== p.id);
      return [...prev, p];
    });
  };

  const isSelected = (id: string) => selectedUsers.some((u) => u.id === id);

  const startConversation = async () => {
    if (!user || creating || selectedUsers.length === 0) return;
    setCreating(true);

    const isGroup = selectedUsers.length > 1;

    try {
      const { data: convData, error: convError } = await supabase
        .from("chat_conversations")
        .insert({
          type: isGroup ? "group" : "direct",
          name: isGroup ? (groupName.trim() || `Groupe (${selectedUsers.length + 1})`) : null,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (convError) throw convError;

      const convId = convData.id;

      // Add all participants
      const participants = [
        { conversation_id: convId, user_id: user.id, role: "admin" },
        ...selectedUsers.map((p) => ({
          conversation_id: convId,
          user_id: p.id,
          role: "member",
        })),
      ];

      const { error: partError } = await supabase
        .from("chat_participants")
        .insert(participants);

      if (partError) throw partError;

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

  const isGroup = selectedUsers.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] border border-stone-200 dark:border-stone-800">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-white">
            Nouvelle discussion
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected users chips */}
        {selectedUsers.length > 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-stone-100 dark:border-stone-800">
            {selectedUsers.map((p) => (
              <span
                key={p.id}
                className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {p.nickname || p.username}
                <button
                  type="button"
                  onClick={() => toggleUserSelection(p)}
                  className="opacity-60 hover:opacity-100 transition"
                  aria-label={`Retirer ${p.nickname || p.username}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Group name input — only when 2+ selected */}
        {isGroup && (
          <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
            <input
              type="text"
              placeholder="Nom du groupe (optionnel)"
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={50}
            />
          </div>
        )}

        {/* Search bar */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              autoFocus={selectedUsers.length === 0}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Profile list */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center text-stone-500 text-sm">
              Recherche en cours...
            </div>
          ) : profiles.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-sm">
              Aucun membre trouvé.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {profiles.map((p) => {
                const selected = isSelected(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleUserSelection(p)}
                    disabled={creating}
                    className={`flex items-center gap-3 p-3 w-full text-left rounded-xl transition disabled:opacity-50 ${
                      selected
                        ? "bg-amber-50 dark:bg-amber-900/20"
                        : "hover:bg-stone-50 dark:hover:bg-stone-800"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center overflow-hidden shrink-0 border border-amber-200 dark:border-amber-800/50 relative">
                      {p.avatar_url ? (
                        <Image
                          src={p.avatar_url}
                          alt={p.username || ""}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <UserIcon className="text-amber-600 dark:text-amber-500 w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 dark:text-white truncate text-sm">
                        {p.nickname || p.username || "Membre anonyme"}
                      </p>
                      {p.nickname && p.username && (
                        <p className="text-xs text-stone-500 truncate">@{p.username}</p>
                      )}
                    </div>
                    {/* Selection indicator */}
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected
                          ? "bg-amber-600 border-amber-600"
                          : "border-stone-300 dark:border-stone-600"
                      }`}
                    >
                      {selected && <Check size={12} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action button */}
        {selectedUsers.length > 0 && (
          <div className="p-4 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={startConversation}
              disabled={creating}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-amber-700 transition active:scale-[0.98] disabled:opacity-60"
            >
              {creating ? (
                "Création..."
              ) : isGroup ? (
                <>
                  <Users size={16} />
                  Créer le groupe ({selectedUsers.length + 1} membres)
                </>
              ) : (
                <>
                  <Check size={16} />
                  Démarrer la discussion
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
