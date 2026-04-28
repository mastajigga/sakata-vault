"use client";

import { Heart, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface VoteButtonProps {
  type: "like" | "dislike";
  active: boolean;
  count: number;
  onToggle: () => void | Promise<void>;
  /** Si true, le compteur n'est pas affiché publiquement (cas dislike) */
  privateCount?: boolean;
  /** Si true, l'utilisateur peut voir le compteur même s'il est private (auteur ou modo) */
  canSeeCount?: boolean;
  disabled?: boolean;
}

export default function VoteButton({
  type,
  active,
  count,
  onToggle,
  privateCount = false,
  canSeeCount = false,
  disabled = false,
}: VoteButtonProps) {
  const [pulse, setPulse] = useState(0);

  const handleClick = async () => {
    if (disabled) return;
    setPulse((p) => p + 1);
    await onToggle();
  };

  const Icon = type === "like" ? Heart : ThumbsDown;
  const baseColor =
    type === "like"
      ? active
        ? "text-red-400 fill-red-400/30"
        : "text-ivoire-ancien/40 hover:text-red-400/70"
      : active
      ? "text-amber-500 fill-amber-500/20"
      : "text-ivoire-ancien/40 hover:text-amber-500/70";

  const showCount = !privateCount || canSeeCount;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all ${baseColor} disabled:opacity-30 disabled:cursor-not-allowed`}
      aria-label={
        type === "like"
          ? active
            ? "Retirer le j'aime"
            : "J'aime"
          : active
          ? "Retirer le je n'aime pas"
          : "Je n'aime pas"
      }
      title={
        type === "like"
          ? `${count} j'aime`
          : privateCount && !canSeeCount
          ? "Je n'aime pas"
          : `${count} je n'aime pas (privé)`
      }
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={pulse}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 15 }}
          className="inline-flex"
        >
          <Icon className="w-4 h-4" strokeWidth={active ? 2 : 1.5} />
        </motion.span>
      </AnimatePresence>
      {showCount && count > 0 && (
        <span className="text-xs font-medium tabular-nums">{count}</span>
      )}
      {privateCount && !canSeeCount && active && (
        <span className="text-[9px] uppercase tracking-wider opacity-70">
          privé
        </span>
      )}
    </button>
  );
}
