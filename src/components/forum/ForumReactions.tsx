"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { DB_TABLES } from "@/lib/constants/db";

const REACTIONS = ["👍", "❤️", "🔥"] as const;
type ReactionType = typeof REACTIONS[number];

interface ReactionCount {
  reaction_type: ReactionType;
  count: number;
  userReacted: boolean;
}

interface ForumReactionsProps {
  postId: string;
}

export default function ForumReactions({ postId }: ForumReactionsProps) {
  const { user } = useAuth();
  const [counts, setCounts] = useState<ReactionCount[]>(
    REACTIONS.map((r) => ({ reaction_type: r, count: 0, userReacted: false }))
  );
  const [pending, setPending] = useState<ReactionType | null>(null);

  const fetchReactions = useCallback(async () => {
    const { data } = await supabase
      .from(DB_TABLES.FORUM_REACTIONS)
      .select("reaction_type, user_id")
      .eq("post_id", postId);

    if (!data) return;

    setCounts(
      REACTIONS.map((r) => ({
        reaction_type: r,
        count: data.filter((d: { reaction_type: string; user_id: string }) => d.reaction_type === r).length,
        userReacted: !!user && data.some((d: { reaction_type: string; user_id: string }) => d.reaction_type === r && d.user_id === user.id),
      }))
    );
  }, [postId, user]);

  useEffect(() => {
    fetchReactions();

    const channel = supabase
      .channel(`reactions_${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: DB_TABLES.FORUM_REACTIONS, filter: `post_id=eq.${postId}` },
        () => fetchReactions()
      )
      .subscribe((status: string, err?: Error) => {
        if (status === "CHANNEL_ERROR" || err) {
          console.error("[ForumReactions] Subscription error:", err || status);
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [postId, fetchReactions]);

  const handleReaction = async (reactionType: ReactionType) => {
    if (!user || pending) return;

    const existing = counts.find((c) => c.reaction_type === reactionType);
    setPending(reactionType);

    try {
      if (existing?.userReacted) {
        // Toggle off
        await supabase
          .from(DB_TABLES.FORUM_REACTIONS)
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .eq("reaction_type", reactionType);
      } else {
        // Toggle on
        await supabase
          .from(DB_TABLES.FORUM_REACTIONS)
          .insert({ post_id: postId, user_id: user.id, reaction_type: reactionType });
      }
      // Realtime will trigger fetchReactions; optimistically update too
      setCounts((prev) =>
        prev.map((c) =>
          c.reaction_type === reactionType
            ? {
                ...c,
                count: existing?.userReacted ? c.count - 1 : c.count + 1,
                userReacted: !existing?.userReacted,
              }
            : c
        )
      );
    } catch (err) {
      console.error("[ForumReactions] Toggle error:", err);
    } finally {
      setPending(null);
    }
  };

  const hasAnyReaction = counts.some((c) => c.count > 0);
  if (!hasAnyReaction && !user) return null;

  return (
    <div className="flex items-center gap-2 mt-4 flex-wrap">
      {counts.map(({ reaction_type, count, userReacted }) => (
        <button
          key={reaction_type}
          onClick={() => handleReaction(reaction_type)}
          disabled={!user || pending === reaction_type}
          title={user ? (userReacted ? "Retirer la réaction" : "Réagir") : "Connectez-vous pour réagir"}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all
            border disabled:cursor-default
            ${userReacted
              ? "bg-[var(--or-ancestral)]/20 border-[var(--or-ancestral)]/60 text-[var(--or-ancestral)]"
              : "bg-white/5 border-white/10 text-[var(--ivoire-ancien)]/60 hover:bg-white/10 hover:border-white/20"
            }
            ${!user ? "opacity-50" : ""}
          `}
        >
          <span>{reaction_type}</span>
          {count > 0 && (
            <span className="font-mono text-xs">{count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
