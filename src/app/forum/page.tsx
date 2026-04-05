import { supabaseAdmin } from "@/lib/supabase/admin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BookOpen, Flame, Users, MessageSquare } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mboka (Forum) | Kisakata",
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
  const { data: categories, error } = await supabaseAdmin
    .from("forum_categories")
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
    console.error("Error fetching forum categories:", error);
  }

  return (
    <main className="min-h-screen bg-[#0A1F15] text-[#F2EEDD] flex flex-col font-sans selection:bg-[#B59551]/30">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      <Navbar />

      <section className="relative pt-32 pb-20 px-6 sm:px-12 md:px-24 max-w-7xl mx-auto w-full z-10 flex-grow">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#F2EEDD] mb-6">
            Mboka
            <span className="block text-2xl md:text-3xl font-serif text-[#B59551] mt-2 italic">Le Village</span>
          </h1>
          <p className="text-lg text-[#F2EEDD]/70 leading-relaxed font-light">
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
                className="group relative bg-[#122A1E]/50 border border-[#B59551]/20 rounded-2xl p-8 backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-[#122A1E]/80 hover:border-[#B59551]/50 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#B59551]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex items-start gap-4 mb-4">
                  <div className="p-3 bg-[#B59551]/10 rounded-xl text-[#B59551] group-hover:scale-110 transition-transform duration-500">
                    <IconComponent size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-[#F2EEDD] mb-2">{name?.fr || 'Catégorie'}</h2>
                    <p className="text-[#F2EEDD]/60 text-sm font-light leading-relaxed">
                      {description?.fr || ''}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-auto pt-6 flex items-center justify-between border-t border-[#B59551]/10">
                  <div className="flex space-x-4 text-sm text-[#B59551]/70">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={16} /> 
                      {threadsCount} {threadsCount > 1 ? 'Sujets' : 'Sujet'}
                    </span>
                  </div>
                  <span className="text-[#B59551] text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 flex items-center">
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
