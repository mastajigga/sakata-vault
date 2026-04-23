"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { MarkdownEditor } from "@/components/forum/MarkdownEditor";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/components/AuthProvider";
import { MemberImage } from "@/components/MemberImage";
import { DB_TABLES } from "@/lib/constants/db";

interface Post {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  profiles?: {
    id: string;
    username: string;
    nickname: string | null;
    avatar_url: string | null;
    role: string;
  };
}

interface ThreadRepliesClientProps {
  threadId: string;
  initialPosts: Post[];
  isLocked: boolean;
}

export default function ThreadRepliesClient({ threadId, initialPosts, isLocked }: ThreadRepliesClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  
  const endOfPostsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`thread_${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_posts',
          filter: `thread_id=eq.${threadId}`
        },
        async (payload: any) => {
          const newPost = payload.new as Post;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, username, nickname, avatar_url, role')
            .eq('id', newPost.author_id)
            .single();
            
          setPosts(prev => {
            if (prev.find(p => p.id === newPost.id)) return prev;
            return [...prev, { ...newPost, profiles: (profile || undefined) as any }];
          });
          
          setTimeout(() => {
            endOfPostsRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      )
      .subscribe((status: any, err: any) => {
        if (status === "CHANNEL_ERROR" || err) {
          console.error("[ThreadReplies] Subscription error:", err || status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || isLocked) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (!currentUser) throw new Error("Vous devez être connecté pour répondre.");

      const { error: postError } = await supabase
        .from('forum_posts')
        .insert({
          thread_id: threadId,
          author_id: currentUser.id,
          content: replyContent.trim()
        });

      if (postError) throw postError;

      setReplyContent("");
      // Realtime subscription will handle adding to the list.
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de la réponse.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-6">
        {posts.map((post, idx) => {
          const isFirst = idx === 0;
          return (
            <div 
              key={post.id} 
              className={`bg-[var(--eau-sombre)]/80 border border-[var(--or-ancestral)]/20 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg ${
                isFirst ? 'border-[var(--or-ancestral)]/50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-6 border-b border-[var(--or-ancestral)]/10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--or-ancestral)]/40">
                     <MemberImage profile={post.profiles || {}} priority={false} />
                  </div>
                  <div>
                    <h4 className="text-[var(--ivoire-ancien)] font-medium flex items-center gap-2">
                      {post.profiles?.nickname || post.profiles?.username || 'Villageois Anonyme'}
                      {['admin', 'manager'].includes(post.profiles?.role || '') && (
                        <span className="text-[10px] uppercase tracking-widest bg-[var(--or-ancestral)]/20 text-[var(--or-ancestral)] px-2 py-0.5 rounded-full">
                          {post.profiles?.role}
                        </span>
                      )}
                    </h4>
                    <span className="text-sm text-[var(--ivoire-ancien)]/40 font-light">
                      {new Date(post.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-invert prose-p:text-[var(--ivoire-ancien)]/80 prose-headings:text-[var(--ivoire-ancien)] prose-a:text-[var(--or-ancestral)] prose-strong:text-[var(--or-ancestral)] max-w-none font-light text-lg leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
              </div>
            </div>
          );
        })}
        <div ref={endOfPostsRef} />
      </div>

      {isLocked ? (
        <div className="mt-8 text-center py-10 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <p className="text-red-400 font-light">Ce sujet est fermé. Vous ne pouvez plus y répondre.</p>
        </div>
      ) : currentUser ? (
        <form onSubmit={handleReplySubmit} className="mt-8 bg-[var(--eau-sombre)]/30 border border-[var(--or-ancestral)]/20 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <h3 className="text-xl font-light text-[var(--ivoire-ancien)] mb-6">Ajouter une réponse</h3>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center justify-between">
              <p>{error}</p>
              <button type="button" onClick={() => setError(null)} className="text-red-400">✕</button>
            </div>
          )}

          <MarkdownEditor value={replyContent} onChange={setReplyContent} minHeight="min-h-[200px]" />
          
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !replyContent.trim()}
              className="bg-[var(--or-ancestral)] text-[var(--foret-nocturne)] px-8 py-3 rounded-xl font-medium transition-all hover:bg-[var(--ivoire-ancien)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Publication...
                </>
              ) : (
                "Répondre"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 text-center py-10 bg-[var(--eau-sombre)]/30 border border-[var(--or-ancestral)]/20 rounded-2xl">
          <p className="text-[var(--ivoire-ancien)]/50 font-light mb-4">Vous devez être connecté pour participer à la discussion.</p>
          <a href={`/auth?redirect=/forum/thread/${threadId}`} className="inline-block bg-[var(--or-ancestral)]/10 text-[var(--or-ancestral)] border border-[var(--or-ancestral)]/30 px-6 py-2 rounded-xl transition-all hover:bg-[var(--or-ancestral)]/20">
            Se connecter
          </a>
        </div>
      )}
    </div>
  );
}
