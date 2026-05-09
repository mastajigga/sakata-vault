"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, BookOpen, Feather, ScrollText, Lock, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ArticleType = "summary" | "poetic" | "philosophical";

interface ArticleTypeMeta {
  value: ArticleType;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** True when this type is gated by Premium subscription. */
  premium: boolean;
  tone: { text: string; bg: string; border: string };
}

const META: Record<ArticleType, ArticleTypeMeta> = {
  summary: {
    value: "summary",
    label: "Résumé",
    short: "Libre",
    description: "Lisible par tous, même sans inscription",
    icon: Globe,
    premium: false,
    tone: {
      text: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
  },
  poetic: {
    value: "poetic",
    label: "Poétique",
    short: "Premium",
    description: "Article narratif réservé aux abonnés Premium",
    icon: Feather,
    premium: true,
    tone: {
      text: "text-or-ancestral",
      bg: "bg-or-ancestral/15",
      border: "border-or-ancestral/35",
    },
  },
  philosophical: {
    value: "philosophical",
    label: "Philosophique",
    short: "Premium",
    description: "Réflexion approfondie, accès Premium",
    icon: ScrollText,
    premium: true,
    tone: {
      text: "text-or-ancestral",
      bg: "bg-or-ancestral/15",
      border: "border-or-ancestral/35",
    },
  },
};

interface Props {
  value: ArticleType | null | undefined;
  onChange: (next: ArticleType) => void | Promise<void>;
  disabled?: boolean;
  size?: "sm" | "md";
}

export default function ArticleTypePicker({ value, onChange, disabled, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<ArticleType | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const current = (value || "summary") as ArticleType;
  const currentMeta = META[current];
  const Icon = currentMeta.icon;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handle = async (t: ArticleType) => {
    if (t === current) { setOpen(false); return; }
    try {
      setPending(t);
      await onChange(t);
      setOpen(false);
    } finally {
      setPending(null);
    }
  };

  const triggerSize = size === "sm"
    ? "px-2.5 py-1 text-[10px]"
    : "px-3 py-1.5 text-[11px]";

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!disabled) setOpen((o) => !o); }}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-widest font-bold transition-all
          ${currentMeta.tone.bg} ${currentMeta.tone.border} ${currentMeta.tone.text}
          ${triggerSize}
          ${disabled ? "opacity-40 cursor-not-allowed" : "hover:brightness-110"}
          ${open ? "ring-1 ring-or-ancestral/50" : ""}`}
        title={currentMeta.description}
      >
        <Icon className="w-3 h-3" />
        <span className="whitespace-nowrap">{currentMeta.label}</span>
        {currentMeta.premium && <Lock className="w-2.5 h-2.5 opacity-70" />}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="opacity-60">
          <ChevronDown className="w-3 h-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[80] right-0 mt-2 w-72 origin-top-right rounded-2xl p-1.5"
            style={{
              background: "linear-gradient(135deg, rgba(242,238,221,0.10), rgba(242,238,221,0.02))",
              border: "1px solid rgba(242,238,221,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 20px 50px -12px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-foret-nocturne/95 rounded-[0.95rem] py-2">
              <div className="px-3 pt-2 pb-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.22em] opacity-40">Type d'article</span>
              </div>
              <ul className="space-y-0.5 px-1.5 pb-1.5" role="listbox">
                {(["summary", "poetic", "philosophical"] as ArticleType[]).map((t, i) => {
                  const m = META[t];
                  const RowIcon = m.icon;
                  const isCurrent = t === current;
                  const isPending = pending === t;
                  return (
                    <motion.li
                      key={t}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={isCurrent}
                        onClick={(e) => { e.preventDefault(); handle(t); }}
                        className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all relative
                          ${isCurrent
                            ? `${m.tone.bg} ${m.tone.border} border`
                            : "hover:bg-white/5 border border-transparent"}`}
                      >
                        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${m.tone.bg} ${m.tone.border}`}>
                          <RowIcon className={`w-3.5 h-3.5 ${m.tone.text}`} />
                        </span>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className={`text-xs font-bold ${isCurrent ? m.tone.text : "text-ivoire-ancien"}`}>{m.label}</p>
                            <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                              m.premium ? "bg-or-ancestral/20 text-or-ancestral" : "bg-emerald-500/15 text-emerald-300"
                            }`}>
                              {m.short}
                            </span>
                          </div>
                          <p className="text-[10px] text-ivoire-ancien/40 leading-snug">{m.description}</p>
                        </div>
                        <span className="flex-shrink-0 self-center w-5 h-5 flex items-center justify-center">
                          {isPending ? (
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                              className="w-3 h-3 border-2 border-or-ancestral/40 border-t-or-ancestral rounded-full"
                            />
                          ) : isCurrent ? (
                            <Check className={`w-3.5 h-3.5 ${m.tone.text}`} />
                          ) : null}
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="border-t border-white/5 mt-1 pt-2 px-3 pb-2">
                <p className="text-[9px] text-ivoire-ancien/30 italic leading-relaxed">
                  Les articles "Poétique" et "Philosophique" sont automatiquement gardés derrière la paywall Premium.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
