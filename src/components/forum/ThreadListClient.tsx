"use client";

import { motion } from "framer-motion";
import { VARIANTS } from "@/lib/constants/animations";
import { ThreadCard } from "./ThreadCard";

interface ThreadListClientProps {
  threads: any[];
  categorySlug: string;
}

export function ThreadListClient({ threads, categorySlug }: ThreadListClientProps) {
  return (
    <motion.div
      variants={VARIANTS.staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {threads.map((thread) => {
        const postsCount = thread.forum_posts?.[0]?.count || 0;
        return (
          <ThreadCard 
            key={thread.id} 
            thread={thread} 
            author={thread.profiles} 
            postsCount={postsCount} 
            categorySlug={categorySlug} 
          />
        );
      })}
    </motion.div>
  );
}
