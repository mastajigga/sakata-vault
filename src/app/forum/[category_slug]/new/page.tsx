import { supabaseAdmin } from "@/lib/supabase/admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MessageSquarePlus } from "lucide-react";
import NewThreadClient from "./NewThreadClient";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function NewThreadPage({ params }: { params: { category_slug: string } }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth?redirect=/forum/${params.category_slug}/new`);
  }

  const { data: category } = await supabaseAdmin
    .from("forum_categories")
    .select("id, name, slug")
    .eq("slug", params.category_slug)
    .single();

  if (!category) {
    return notFound();
  }

  const catName = typeof category.name === 'string' ? JSON.parse(category.name) : category.name;

  return (
    <main className="min-h-screen bg-[#0A1F15] text-[#F2EEDD] flex flex-col font-sans selection:bg-[#B59551]/30">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <Navbar />

      <section className="relative pt-32 pb-20 px-6 sm:px-12 md:px-24 max-w-4xl mx-auto w-full z-10 flex-grow">
        <Link 
          href={`/forum/${category.slug}`} 
          className="inline-flex items-center text-[#B59551] hover:text-[#F2EEDD] transition-colors mb-8 text-sm uppercase tracking-widest font-medium group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Retour à {catName?.fr || category.slug}
        </Link>
        
        <div className="border-b border-[#B59551]/20 pb-8 mb-8">
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-[#F2EEDD] flex items-center gap-4">
            <MessageSquarePlus className="text-[#B59551]" size={40} />
            Lancer un Sujet
          </h1>
        </div>

        <NewThreadClient categoryId={category.id} categorySlug={category.slug} />
      </section>

      <Footer />
    </main>
  );
}
