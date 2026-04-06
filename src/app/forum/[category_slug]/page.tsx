import { supabasePublic, supabaseAdmin } from "@/lib/supabase/admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThreadCard } from "@/components/forum/ThreadCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";

export const revalidate = 60; // 60 seconds

export default async function ForumCategoryPage(props: { params: Promise<{ category_slug: string }> }) {
  const params = await props.params;
  // 1. Fetch Category Details
  const { data: category, error: catError } = await supabasePublic
    .from("forum_categories")
    .select("*")
    .eq("slug", params.category_slug)
    .single();

  if (catError || !category) {
    return notFound();
  }

  // Handle multilingual names
  const catName = typeof category.name === 'string' ? JSON.parse(category.name) : category.name;
  const catDesc = typeof category.description === 'string' ? JSON.parse(category.description) : category.description;

  // 2. Fetch Threads in this category
  const { data: threads, error: threadsError } = await supabasePublic
    .from("forum_threads")
    .select(`
      *,
      profiles ( display_name, avatar_url ),
      forum_posts ( count )
    `)
    .eq("category_id", category.id)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (threadsError) {
    console.error("Error fetching threads:", threadsError);
  }

  return (
    <main className="min-h-[100dvh] bg-[#0A1F15] text-[#F2EEDD] flex flex-col font-sans selection:bg-[#B59551]/30">
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"></div>
      <Navbar />

      <section className="relative pt-32 pb-20 px-6 sm:px-12 md:px-24 max-w-5xl mx-auto w-full z-10 flex-grow">
        <Link 
          href="/forum" 
          className="inline-flex items-center text-[#B59551] hover:text-[#F2EEDD] transition-colors mb-8 text-sm uppercase tracking-widest font-medium group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Retour au Village
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#B59551]/20 pb-8 mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-[#F2EEDD] mb-4">
              {catName?.fr || 'Catégorie'}
            </h1>
            <p className="text-lg text-[#F2EEDD]/70 font-light max-w-2xl">
              {catDesc?.fr || ''}
            </p>
          </div>
          <Link 
            href={`/forum/${params.category_slug}/new`} 
            className="flex-shrink-0 inline-flex items-center justify-center space-x-2 bg-[#B59551] text-[#0A1F15] px-6 py-3 rounded-md font-medium transition-all hover:bg-[#F2EEDD]"
          >
            <MessageSquarePlus size={18} />
            <span>Nouveau Sujet</span>
          </Link>
        </div>

        <div className="space-y-4">
          {(!threads || threads.length === 0) ? (
            <div className="text-center py-20 bg-[#122A1E]/30 border border-[#B59551]/10 rounded-2xl">
              <p className="text-[#F2EEDD]/50 text-lg font-light">Aucun sujet n'a encore été lancé ici.</p>
              <p className="text-[#B59551] mt-2">Soyez le premier à ouvrir la discussion !</p>
            </div>
          ) : (
            threads.map((thread) => {
               // forum_posts counts can be an array depending on supabase return structure
               const postsCount = thread.forum_posts?.[0]?.count || 0;
               return (
                <ThreadCard 
                  key={thread.id} 
                  thread={thread} 
                  author={thread.profiles} 
                  postsCount={postsCount} 
                  categorySlug={params.category_slug} 
                />
               );
            })
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
