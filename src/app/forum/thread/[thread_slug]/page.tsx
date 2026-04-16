import { supabaseAdmin, supabasePublic } from "@/lib/supabase/admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import ThreadRepliesClient from "./ThreadRepliesClient";

export const revalidate = 60;

export default async function ThreadPage(props: { params: Promise<{ thread_slug: string }> }) {
  const params = await props.params;
  // Fetch Thread details with author and category
  const { data: thread, error: threadError } = await supabasePublic
    .from("forum_threads")
    .select(`
      *,
      profiles ( id, username, nickname, avatar_url, role ),
      forum_categories ( slug, name )
    `)
    .eq("slug", params.thread_slug)
    .is("deleted_at", null)
    .single();

  if (threadError || !thread) {
    console.error(`[ThreadPage] Error for slug ${params.thread_slug}:`, threadError);
    return (
      <div className="min-h-[100dvh] bg-[var(--foret-nocturne)] text-[var(--ivoire-ancien)] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl mb-4 font-light">Sujet introuvable</h1>
        <p className="text-[var(--ivoire-ancien)]/50 mb-8 max-w-md text-center">Le sujet "{params.thread_slug}" n'existe pas ou n'est plus accessible.</p>
        {threadError && <pre className="bg-black/30 p-4 rounded text-xs overflow-auto max-w-full">{JSON.stringify(threadError, null, 2)}</pre>}
        <Link href="/forum" className="mt-8 text-[var(--or-ancestral)] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Retour au forum
        </Link>
      </div>
    );
  }

  // Fetch initial posts associated with this thread
  const { data: initialPosts, error: postsError } = await supabasePublic
    .from("forum_posts")
    .select(`
      *,
      profiles ( id, username, nickname, avatar_url, role )
    `)
    .eq("thread_id", thread.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  // Increment views in background safely
  (async () => {
    try {
      await supabaseAdmin.rpc('increment_thread_views', { t_id: thread.id });
    } catch (err) {
      console.error('[ThreadPage] Failed to increment views:', err);
    }
  })().catch(() => {}); // Ignore any unhandled promise rejections

  // Fallback: direct update if RPC fails
  (async () => {
    try {
      await supabaseAdmin.from('forum_threads')
        .update({ views_count: (thread.views_count || 0) + 1 })
        .eq('id', thread.id);
    } catch (err) {
      console.error('[ThreadPage] Failed to update views count:', err);
    }
  })().catch(() => {});

  const formattedDate = new Date(thread.created_at).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const catName = typeof thread.forum_categories?.name === 'string' 
    ? JSON.parse(thread.forum_categories.name) 
    : thread.forum_categories?.name;

  return (
    <main className="min-h-[100dvh] bg-[var(--foret-nocturne)] text-[var(--ivoire-ancien)] flex flex-col font-sans selection:bg-[var(--or-ancestral)]/30">
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"></div>
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 sm:px-8 md:px-16 max-w-5xl mx-auto w-full z-10 flex-grow">
        <Link 
          href={`/forum/${thread.forum_categories?.slug}`} 
          className="inline-flex items-center text-[var(--or-ancestral)] hover:text-[var(--ivoire-ancien)] transition-colors mb-8 text-sm uppercase tracking-widest font-medium group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Retour à {catName?.fr || 'la catégorie'}
        </Link>
        
        {/* Thread Header */}
        <div className="border-b border-[var(--or-ancestral)]/20 pb-8 mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-[var(--ivoire-ancien)] mb-6 leading-tight">
            {thread.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--ivoire-ancien)]/50 font-light">
            <div className="flex items-center gap-2">
              {thread.profiles?.avatar_url ? (
                <img src={thread.profiles.avatar_url} alt="author" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[var(--or-ancestral)]/20 border border-[var(--or-ancestral)]/30"></div>
              )}
              <span className="text-[var(--ivoire-ancien)]/80 font-medium">{thread.profiles?.nickname || thread.profiles?.username || 'Anonyme'}</span>
            </div>
            <span className="flex items-center gap-1.5"><Clock size={16} /> {formattedDate}</span>
            <span className="flex items-center gap-1.5"><Eye size={16} /> {thread.views_count || 0} vues</span>
          </div>
        </div>

        {/* Realtime Replies Component */}
        <ThreadRepliesClient 
          threadId={thread.id} 
          initialPosts={initialPosts || []} 
          isLocked={thread.is_locked} 
        />
      </section>

      <Footer />
    </main>
  );
}
