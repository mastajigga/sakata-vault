"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";

interface VoteState {
  myVote: 1 | -1 | null;
  likeCount: number;
  dislikeCount: number;
}

export function useForumVotes(initial: VoteState) {
  const [state, setState] = useState<VoteState>(initial);
  const [pending, setPending] = useState(false);

  const setVote = useCallback(
    async (newVote: 1 | -1 | 0) => {
      if (pending) return;

      // Optimistic update
      const prevState = state;
      setState((s) => {
        let likeCount = s.likeCount;
        let dislikeCount = s.dislikeCount;

        // Remove previous
        if (s.myVote === 1) likeCount = Math.max(0, likeCount - 1);
        if (s.myVote === -1) dislikeCount = Math.max(0, dislikeCount - 1);
        // Add new
        if (newVote === 1) likeCount += 1;
        if (newVote === -1) dislikeCount += 1;

        return {
          myVote: newVote === 0 ? null : newVote,
          likeCount,
          dislikeCount,
        };
      });

      setPending(true);
      try {
        const res = await fetch("/api/forum/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: (state as any).postId, // injected via init
            vote: newVote,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        console.error("[useForumVotes] failed", err);
        // Rollback
        setState(prevState);
      } finally {
        setPending(false);
      }
    },
    [state, pending]
  );

  const toggle = useCallback(
    (type: "like" | "dislike") => {
      const target = type === "like" ? 1 : -1;
      const newVote: 1 | -1 | 0 = state.myVote === target ? 0 : target;
      return setVote(newVote);
    },
    [state.myVote, setVote]
  );

  return { ...state, toggle, pending };
}

/**
 * Helper for components: bind vote state to a specific postId.
 */
export function useForumVotesForPost(
  postId: string,
  initial: VoteState
) {
  const [state, setState] = useState<VoteState>(initial);
  const [pending, setPending] = useState(false);

  const setVote = useCallback(
    async (newVote: 1 | -1 | 0) => {
      if (pending) return;

      const prevState = state;
      setState((s) => {
        let likeCount = s.likeCount;
        let dislikeCount = s.dislikeCount;
        if (s.myVote === 1) likeCount = Math.max(0, likeCount - 1);
        if (s.myVote === -1) dislikeCount = Math.max(0, dislikeCount - 1);
        if (newVote === 1) likeCount += 1;
        if (newVote === -1) dislikeCount += 1;
        return {
          myVote: newVote === 0 ? null : newVote,
          likeCount,
          dislikeCount,
        };
      });

      setPending(true);
      try {
        const res = await fetch("/api/forum/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, vote: newVote }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        console.error("[useForumVotes] failed", err);
        setState(prevState);
      } finally {
        setPending(false);
      }
    },
    [postId, state, pending]
  );

  const toggleLike = useCallback(() => {
    return setVote(state.myVote === 1 ? 0 : 1);
  }, [state.myVote, setVote]);

  const toggleDislike = useCallback(() => {
    return setVote(state.myVote === -1 ? 0 : -1);
  }, [state.myVote, setVote]);

  return {
    ...state,
    toggleLike,
    toggleDislike,
    pending,
    /** External setter for realtime sync */
    syncCounts: (likeCount: number, dislikeCount: number) =>
      setState((s) => ({ ...s, likeCount, dislikeCount })),
  };
}
