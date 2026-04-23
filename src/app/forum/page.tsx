import { supabasePublic } from "@/lib/supabase/admin";
import { CategoryListClient } from "@/components/forum/CategoryListClient";
import { BookOpen, Flame, Users, MessageSquare } from "lucide-react";
import { Metadata } from "next";
import { DB_TABLES } from "@/lib/constants/db";

export const metadata: Metadata = {
  title: "Mboka (Forum) | Sakata",
  description: "Rejoignez le village virtuel pour échanger sur la culture Sakata.",
};

// Lucide icon mapping
const IconMap: Record<string, React.ElementType> = {
  book: BookOpen,
  flame: Flame,
  users: Users,
  messages: MessageSquare
};

export const revalidate = 60; // Revalidate every 60s

export default async function ForumIndex() {
  const { data: categories, error } = await supabasePublic
    .from(DB_TABLES.FORUM_CATEGORIES)
    .select(`
      id,
      name,
      description,
      slug,
      icon,
      forum_threads ( count )
    `)
    .order("order", { ascending: true });

  if (error) {
    console.error("[ForumIndex] Supabase Error:", error);
  }

  return (
    <main className="min-h-[100dvh] bg-[var(--foret-nocturne)] text-[var(--ivoire-ancien)] flex flex-col font-sans selection:bg-[var(--or-ancestral)]/30">
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"></div>
      <section className="relative pt-32 pb-20 px-6 sm:px-12 md:px-24 max-w-7xl mx-auto w-full z-10 flex-grow">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[var(--ivoire-ancien)] mb-6">
            Mboka
            <span className="block text-2xl md:text-3xl font-serif text-[var(--or-ancestral)] mt-2 italic">Le Village</span>
          </h1>
          <p className="text-lg text-[var(--ivoire-ancien)]/70 leading-relaxed font-light">
            Bienvenue sur le forum de la communauté Sakata. Un espace d'échange, de transmission et de débats autour de notre héritage ancestral et de notre avenir.
          </p>
        </div>

        <CategoryListClient categories={categories || []} iconMap={IconMap} />
      </section>
    </main>
  );
}
