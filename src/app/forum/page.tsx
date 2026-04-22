import { supabasePublic } from "@/lib/supabase/admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
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
      <Navbar />

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories?.map((cat) => {
            const IconComponent = cat.icon ? IconMap[cat.icon as string] || MessageSquare : MessageSquare;
            // Handle JSONB multilingual data safely
            const name = typeof cat.name === 'string' ? JSON.parse(cat.name) : cat.name;
            const description = typeof cat.description === 'string' ? JSON.parse(cat.description) : cat.description;
            
            // Get count from the joined data (Supabase returns an array for joins, or a count inside an object)
            const threadsCount = cat.forum_threads?.[0]?.count || 0;

            return (
              <Link 
                key={cat.id} 
                href={`/forum/${cat.slug}`}
                className="group relative bg-[var(--foret-nocturne)]/50 border border-[var(--or-ancestral)]/20 rounded-2xl p-8 backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-[var(--foret-nocturne)]/80 hover:border-[var(--or-ancestral)]/50 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--or-ancestral)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex items-start gap-4 mb-4">
                  <div className="p-3 bg-[var(--or-ancestral)]/10 rounded-xl text-[var(--or-ancestral)] group-hover:scale-110 transition-transform duration-500">
                    <IconComponent size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-[var(--ivoire-ancien)] mb-2">{name?.fr || 'Catégorie'}</h2>
                    <p className="text-[var(--ivoire-ancien)]/60 text-sm font-light leading-relaxed">
                      {description?.fr || ''}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-auto pt-6 flex items-center justify-between border-t border-[var(--or-ancestral)]/10">
                  <div className="flex space-x-4 text-sm text-[var(--or-ancestral)]/70">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={16} /> 
                      {threadsCount} {threadsCount > 1 ? 'Sujets' : 'Sujet'}
                    </span>
                  </div>
                  <span className="text-[var(--or-ancestral)] text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 flex items-center">
                    Explorer <span className="ml-2">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
