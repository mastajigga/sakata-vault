"use client";

import React, { useEffect, useState } from "react";
import { supabase, useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface LikeButtonProps {
  articleId: string;
  initialLikes: number;
}

const LikeButton = ({ articleId, initialLikes }: LikeButtonProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const checkLikeStatus = async () => {
      const { data, error } = await supabase
        .from("article_likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) setIsLiked(true);
      setIsLoading(false);
    };

    checkLikeStatus();
  }, [articleId, user]);

  const toggleLike = async () => {
    if (!user) {
      // Could trigger a login modal here
      return;
    }

    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => Math.max(0, prev - 1));
      await supabase
        .from("article_likes")
        .delete()
        .eq("article_id", articleId)
        .eq("user_id", user.id);
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
      await supabase
        .from("article_likes")
        .insert({ article_id: articleId, user_id: user.id });
    }
  };

  if (isLoading) return <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />;

  return (
    <div className="flex items-center gap-4">
      <motion.button
        onClick={toggleLike}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`relative p-3 rounded-full transition-colors border ${
          isLiked 
            ? "bg-red-500/10 border-red-500/50 text-red-500" 
            : "bg-white/5 border-white/10 text-ivoire-ancien hover:border-white/20"
        }`}
      >
        <Heart 
          size={24} 
          fill={isLiked ? "currentColor" : "none"} 
          className={isLiked ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : ""}
        />
        
        <AnimatePresence>
          {isLiked && (
            <motion.span
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500 rounded-full"
            />
          )}
        </AnimatePresence>
      </motion.button>
      
      <div className="flex flex-col">
        <span className="text-2xl font-display font-bold text-ivoire-ancien">
          {likes}
        </span>
        <span className="text-[10px] uppercase tracking-widest opacity-40">
          {t("article.likes")}
        </span>
      </div>
    </div>
  );
};

export default LikeButton;
