"use client";

import Link from "next/link";
import Image from "next/image";
import { Pin, Lock, MessageSquare, Eye, Clock } from "lucide-react";
import { MemberImage } from "@/components/MemberImage";
import { motion } from "framer-motion";
import { VARIANTS } from "@/lib/constants/animations";

interface ThreadCardProps {
  thread: any;
  author: any;
  postsCount: number;
  categorySlug: string;
}

export function ThreadCard({ thread, author, postsCount, categorySlug }: ThreadCardProps) {
  // Safe date formatting
  const formattedDate = thread.updated_at 
    ? new Date(thread.updated_at).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Récemment';

  return (
    <motion.div
      variants={VARIANTS.slideUp}
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      <Link 
        href={`/forum/thread/${thread.slug}`}
        className={`group block bg-[var(--eau-sombre)]/50 border rounded-xl p-5 md:p-6 transition-all duration-300 hover:bg-[var(--eau-sombre)] ${
          thread.is_pinned ? 'border-[var(--or-ancestral)]/40' : 'border-[var(--or-ancestral)]/10 hover:border-[var(--or-ancestral)]/30'
        }`}
      >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-grow pr-4">
          <div className="flex items-center space-x-3 mb-2">
            {thread.is_pinned && (
              <span className="flex items-center text-[var(--or-ancestral)] text-xs font-semibold uppercase tracking-wider bg-[var(--or-ancestral)]/10 px-2 py-1 rounded">
                <Pin size={12} className="mr-1" /> Épinglé
              </span>
            )}
            {thread.is_locked && (
              <span className="flex items-center text-red-400/80 text-xs font-semibold uppercase tracking-wider bg-red-400/10 px-2 py-1 rounded">
                <Lock size={12} className="mr-1" /> Fermé
              </span>
            )}
            {thread.article_id && (
              <span className="flex items-center text-[var(--or-ancestral)] text-[10px] font-bold uppercase tracking-widest bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/30 px-2 py-0.5 rounded-full">
                Savoir
              </span>
            )}
            <h3 className="text-xl md:text-2xl font-light text-[var(--ivoire-ancien)] group-hover:text-[var(--or-ancestral)] transition-colors line-clamp-1">
              {thread.title}
            </h3>
          </div>
          
          <div className="flex items-center text-sm text-[var(--ivoire-ancien)]/50 gap-4 mt-2 font-light">
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <MemberImage profile={author} priority={false} />
              </div>
              <span className="text-[var(--ivoire-ancien)]/70">{author?.nickname || author?.username || 'Villageois Anonyme'}</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-[var(--ivoire-ancien)]/40 text-sm border-t md:border-t-0 md:border-l border-[var(--or-ancestral)]/10 pt-4 md:pt-0 md:pl-6">
          <div className="flex flex-col items-center">
            <MessageSquare size={18} className="mb-1" />
            <span className="font-medium text-[var(--ivoire-ancien)]/70">{postsCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <Eye size={18} className="mb-1" />
            <span className="font-medium text-[var(--ivoire-ancien)]/70">{thread.views_count || 0}</span>
          </div>
        </div>
      </div>
      </Link>
    </motion.div>
  );
}
