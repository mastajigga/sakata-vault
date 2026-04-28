"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import PostNode, { type ForumPost } from "@/components/forum/PostNode";
import ReplyComposer from "@/components/forum/ReplyComposer";

interface RawPost extends ForumPost {}

interface ThreadRepliesClientProps {
  threadId: string;
  initialPosts: RawPost[];
  isLocked: boolean;
}

/**
 * Build a tree from a flat list of posts using parent_post_id.
 * Sort: by score DESC then by created_at ASC (Reddit "best" lite).
 */
function buildTree(flat: RawPost[]): ForumPost[] {
  const byId = new Map<string, ForumPost>();
  flat.forEach((p) => byId.set(p.id, { ...p, replies: [] }));

  const roots: ForumPost[] = [];
  for (const p of byId.values()) {
    if (p.parent_post_id && byId.has(p.parent_post_id)) {
      const parent = byId.get(p.parent_post_id)!;
      parent.replies = parent.replies || [];
      parent.replies.push(p);
    } else {
      roots.push(p);
    }
  }

  const sortByScore = (a: ForumPost, b: ForumPost) => {
    const scoreA = a.like_count - a.dislike_count;
    const scoreB = b.like_count - b.dislike_count;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  };

  // Top-level: oldest first (the OP comes first)
  roots.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Recursively sort replies by score
  const sortReplies = (node: ForumPost) => {
    if (node.replies && node.replies.length > 0) {
      node.replies.sort(sortByScore);
      node.replies.forEach(sortReplies);
    }
  };
  roots.forEach(sortReplies);

  return roots;
}

export default function ThreadRepliesClient({
  threadId,
  initialPosts,
  isLocked,
}: ThreadRepliesClientProps) {
  const { user, role } = useAuth() as any;
  const [posts, setPosts] = useState<RawPost[]>(initialPosts);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user?.id]);

  // Load my votes for posts
  const [myVotes, setMyVotes] = useState<Record<string, 1 | -1>>({});

  const fetchMyVotes = useCallback(async () => {
    if (!user?.id || posts.length === 0) {
      setMyVotes({});
      return;
    }
    const { data } = await supabase
      .from("forum_post_votes")
      .select("post_id, vote")
      .eq("user_id", user.id)
      .in(
        "post_id",
        posts.map((p) => p.id)
      );

    if (data) {
      const map: Record<string, 1 | -1> = {};
      for (const row of data) {
        map[(row as any).post_id] = (row as any).vote as 1 | -1;
      }
      setMyVotes(map);
    }
  }, [user?.id, posts]);

  useEffect(() => {
    fetchMyVotes();
  }, [fetchMyVotes]);

  const refetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("forum_posts")
      .select(
        `
        *,
        profiles:author_id (id, username, nickname, avatar_url, role)
      `
      )
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setPosts(data as RawPost[]);
    }
  }, [threadId]);

  // Realtime: posts in this thread
  useEffect(() => {
    let isMounted = true;

    const channel = supabase
      .channel(`thread_v2_${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "forum_posts",
          filter: `thread_id=eq.${threadId}`,
        },
        () => {
          if (!isMounted) return;
          refetchPosts();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "forum_post_votes",
        },
        () => {
          if (!isMounted) return;
          // Vote count est mis à jour par triggers → refetch posts pour rafraîchir compteurs
          refetchPosts();
        }
      )
      .subscribe((status: string, err?: unknown) => {
        if (status === "CHANNEL_ERROR" || err) {
          console.error("[ThreadReplies v2] subscribe error", err || status);
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [threadId, refetchPosts]);

  // Tree avec myVote injecté
  const tree = useMemo(() => {
    const enriched = posts.map((p) => ({
      ...p,
      myVote: myVotes[p.id] ?? null,
    }));
    return buildTree(enriched);
  }, [posts, myVotes]);

  return (
    <div className="flex flex-col gap-4">
      {posts.length === 0 ? (
        <div className="bg-white/[0.02] border border-or-ancestral/15 rounded-3xl p-10 text-center">
          <p className="text-ivoire-ancien/40 font-light text-lg italic">
            Mboka attend votre voix. Soyez le premier à répondre.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tree.map((post, idx) => (
            <PostNode
              key={post.id}
              post={post}
              depth={0}
              threadId={threadId}
              isLocked={isLocked}
              currentUserId={userIdRef.current}
              currentUserRole={role || null}
              isFirst={idx === 0}
              onReply={() => {
                refetchPosts();
                fetchMyVotes();
              }}
            />
          ))}
        </div>
      )}

      {isLocked ? (
        <div className="mt-4 text-center py-8 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <p className="text-red-400/80 font-light text-sm">
            Ce sujet est fermé. Vous ne pouvez plus y répondre.
          </p>
        </div>
      ) : user ? (
        <div className="mt-4">
          <ReplyComposer
            threadId={threadId}
            authorId={user.id}
            onSubmitted={() => {
              refetchPosts();
            }}
          />
        </div>
      ) : (
        <div className="mt-4 text-center py-8 bg-white/[0.02] border border-or-ancestral/20 rounded-2xl">
          <p className="text-ivoire-ancien/50 font-light mb-3">
            Connectez-vous pour rejoindre la conversation.
          </p>
          <a
            href={`/auth?redirect=/forum/thread/${threadId}`}
            className="inline-block bg-or-ancestral/10 text-or-ancestral border border-or-ancestral/30 px-5 py-2 rounded-xl text-sm transition-all hover:bg-or-ancestral/20"
          >
            Se connecter
          </a>
        </div>
      )}
    </div>
  );
}
