"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface LikeButtonProps {
  articleId: string;
  initialLikes: number;
}

const LikeButton = ({ articleId, initialLikes }: LikeButtonProps) => {
  const { user } = useAuth();
  return <AccountLikeButton key={`${articleId}/${user?.id ?? "anonymous"}`} articleId={articleId} initialLikes={initialLikes} />;
};

const AccountLikeButton = ({ articleId, initialLikes }: LikeButtonProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusLoaded, setStatusLoaded] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const mutationRef = useRef(false);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const checkLikeStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("article_likes")
          .select("id")
          .eq("article_id", articleId)
          .eq("user_id", user.id)
          .maybeSingle();
        if (error) throw error;
        if (active) {
          setIsLiked(!!data);
          setStatusLoaded(true);
        }
      } catch (error) {
        console.error("[likes] Lecture impossible:", error);
        if (active) setErrorMessage("Impossible de charger votre J’aime. Rechargez la page.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void checkLikeStatus();
    return () => { active = false; };
  }, [articleId, user]);

  const toggleLike = async () => {
    if (!user || !statusLoaded || isLoading || mutationRef.current) return;
    mutationRef.current = true;
    setIsMutating(true);
    setErrorMessage(null);
    const previousLiked = isLiked;
    const previousLikes = likes;
    setIsLiked(!previousLiked);
    setLikes(previousLiked ? Math.max(0, previousLikes - 1) : previousLikes + 1);
    try {
      const { data, error } = previousLiked
        ? await supabase.from("article_likes").delete()
            .eq("article_id", articleId).eq("user_id", user.id).select("id")
        : await supabase.from("article_likes")
            .insert({ article_id: articleId, user_id: user.id }).select("id");
      if (error) throw error;
      if (!previousLiked && !data?.length) throw new Error("Aucune ligne modifiée");
      // DELETE à zéro ligne : le retrait a déjà été effectué dans un autre onglet.
    } catch (error) {
      console.error("[likes] Écriture impossible:", error);
      setIsLiked(previousLiked);
      setLikes(previousLikes);
      setErrorMessage("Votre J’aime n'a pas été enregistré. Réessayez.");
    } finally {
      try {
        const [status, count] = await Promise.all([
          supabase.from("article_likes").select("id")
            .eq("article_id", articleId).eq("user_id", user.id).maybeSingle(),
          supabase.from("article_likes").select("id", { count: "exact", head: true })
            .eq("article_id", articleId),
        ]);
        if (status.error) throw status.error;
        if (count.error) throw count.error;
        setIsLiked(!!status.data);
        setLikes(count.count ?? 0);
      } catch (error) {
        console.error("[likes] Relecture impossible:", error);
        setStatusLoaded(false);
        setErrorMessage("Impossible de vérifier vos J’aime. Rechargez la page.");
      }
      mutationRef.current = false;
      setIsMutating(false);
    }
  };

  if (isLoading) return <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />;

  return (
    <div className="flex items-center gap-4">
      <motion.button
        onClick={toggleLike}
        disabled={isMutating || !user || !statusLoaded}
        aria-busy={isMutating}
        aria-pressed={isLiked}
        aria-label={t("article.likes")}
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
      {errorMessage && <p role="alert" className="text-sm text-red-400">{errorMessage}</p>}
    </div>
  );
};

export default LikeButton;
