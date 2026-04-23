"use client";

import { motion } from "framer-motion";
import { VARIANTS } from "@/lib/constants/animations";
import Link from "next/link";
import { BookOpen, Flame, Users, MessageSquare } from "lucide-react";

// Lucide icon mapping for categories
const ICON_MAP: Record<string, React.ElementType> = {
  book: BookOpen,
  flame: Flame,
  users: Users,
  messages: MessageSquare
};

interface CategoryListClientProps {
  categories: any[];
}

export function CategoryListClient({ categories }: CategoryListClientProps) {
  return (
    <motion.div
      variants={VARIANTS.staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {categories.map((cat) => {
        const IconComponent = cat.icon ? ICON_MAP[cat.icon as string] || MessageSquare : MessageSquare;
        const name = typeof cat.name === 'string' ? JSON.parse(cat.name) : cat.name;
        const description = typeof cat.description === 'string' ? JSON.parse(cat.description) : cat.description;
        const threadsCount = cat.forum_threads?.[0]?.count || 0;

        return (
          <motion.div
            key={cat.id}
            variants={VARIANTS.slideUp}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link 
              href={`/forum/${cat.slug}`}
              className="group relative h-full bg-[var(--foret-nocturne)]/50 border border-[var(--or-ancestral)]/20 rounded-2xl p-8 backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-[var(--foret-nocturne)]/80 hover:border-[var(--or-ancestral)]/50 flex flex-col"
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
          </motion.div>
        );
      })}
    </motion.div>
  );
}
