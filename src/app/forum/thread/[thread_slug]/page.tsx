import { supabaseAdmin, supabasePublic } from "@/lib/supabase/admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import ThreadRepliesClient from "./ThreadRepliesClient";

export const revalidate = 60;

export default async function ThreadPage({ params }: { params: { thread_slug: string } }) {
  // Fetch Thread details with author and category
  const { data: thread, error: threadError } = await supabasePublic
    .from("forum_threads")
    .select(`
      *,
      profiles:created_by ( id, display_name, avatar_url, role ),
      forum_categories ( slug, name )
    `)
    .eq("slug", params.thread_slug)
    .single();

  if (threadError || !thread) {
    return notFound();
  }

  // Fetch initial posts associated with this thread
  const { data: initialPosts, error: postsError } = await supabasePublic
    .from("forum_posts")
    .select(`
      *,
      profiles:author_id ( id, display_name, avatar_url, role )
    `)
    .eq("thread_id", thread.id)
    .order("created_at", { ascending: true });

  // Increment views in background safely
  supabaseAdmin.rpc('increment_thread_views', { t_id: thread.id }).then(); 
  // Note: if `increment_thread_views` RPC doesn't exist, we can ignore or update directly via an API route. 
  // Assuming a direct update for simplicity if we can't guarantee RPC.
  supabaseAdmin.from('forum_threads').update({ views_count: (thread.views_count || 0) + 1 }).eq('id', thread.id).then();

  const formattedDate = new Date(thread.created_at).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const catName = typeof thread.forum_categories?.name === 'string' 
    ? JSON.parse(thread.forum_categories.name) 
    : thread.forum_categories?.name;

  return (
    <main className="min-h-screen bg-[#0A1F15] text-[#F2EEDD] flex flex-col font-sans selection:bg-[#B59551]/30">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 sm:px-8 md:px-16 max-w-5xl mx-auto w-full z-10 flex-grow">
        <Link 
          href={`/forum/${thread.forum_categories?.slug}`} 
          className="inline-flex items-center text-[#B59551] hover:text-[#F2EEDD] transition-colors mb-8 text-sm uppercase tracking-widest font-medium group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Retour à {catName?.fr || 'la catégorie'}
        </Link>
        
        {/* Thread Header */}
        <div className="border-b border-[#B59551]/20 pb-8 mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-[#F2EEDD] mb-6 leading-tight">
            {thread.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#F2EEDD]/50 font-light">
            <div className="flex items-center gap-2">
              {thread.profiles?.avatar_url ? (
                <img src={thread.profiles.avatar_url} alt="author" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#B59551]/20 border border-[#B59551]/30"></div>
              )}
              <span className="text-[#F2EEDD]/80 font-medium">{thread.profiles?.display_name || 'Anonyme'}</span>
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
