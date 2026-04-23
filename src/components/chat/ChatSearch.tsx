"use client";

import React, { useState, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";

interface SearchResult {
  id: string;
  content: string;
  created_at: string;
  profiles: { nickname: string | null; username: string | null } | null;
}

interface ChatSearchProps {
  conversationId: string;
  onClose: () => void;
  onJumpToMessage?: (messageId: string) => void;
}

export function ChatSearch({ conversationId, onClose, onJumpToMessage }: ChatSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(
    async (q: string) => {
      if (!q.trim() || q.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(DB_TABLES.CHAT_MESSAGES)
          .select(
            `id, content, created_at,
             profiles:sender_id ( nickname, username )`
          )
          .eq("conversation_id", conversationId)
          .eq("is_deleted", false)
          .ilike("content", `%${q}%`)
          .order("created_at", { ascending: false })
          .limit(20);

        if (!error && data) {
          setResults(data as unknown as SearchResult[]);
        }
      } catch (err) {
        console.error("[ChatSearch] Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [conversationId]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const highlight = (text: string, q: string): React.ReactNode => {
    if (!q.trim()) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-amber-200 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100 rounded px-0.5 not-italic">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 z-10">
      {/* Search input row */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        <Search size={16} className="text-stone-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Rechercher dans la conversation…"
          autoFocus
          className="flex-1 bg-transparent text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
          value={query}
          onChange={handleChange}
        />
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition"
          aria-label="Fermer la recherche"
        >
          <X size={16} />
        </button>
      </div>

      {/* Results dropdown */}
      {query.length >= 2 && (
        <div className="max-h-64 overflow-y-auto border-t border-stone-100 dark:border-stone-800">
          {loading ? (
            <div className="p-4 text-center text-xs text-stone-400">Recherche…</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-xs text-stone-400">
              Aucun résultat pour &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="divide-y divide-stone-50 dark:divide-stone-800/50">
              <div className="px-4 py-1.5 bg-stone-50 dark:bg-stone-800/50">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  {results.length} résultat{results.length > 1 ? "s" : ""}
                </span>
              </div>
              {results.map((r) => (
                <button
                  key={r.id}
                  className="w-full text-left px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition"
                  onClick={() => onJumpToMessage?.(r.id)}
                >
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      {(r.profiles as any)?.nickname ||
                        (r.profiles as any)?.username ||
                        "Inconnu"}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(r.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                    {highlight(r.content || "", query)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
