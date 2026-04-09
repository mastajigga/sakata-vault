"use client";

import { motion } from "framer-motion";
import { BookText, Landmark, Sigma } from "lucide-react";
import type { KnowledgeRiver } from "../data/mathematics-curriculum";

const riverIcons = {
  langue: BookText,
  mathematiques: Sigma,
  histoire: Landmark,
} as const;

interface KnowledgeRiversProps {
  rivers: KnowledgeRiver[];
}

export default function KnowledgeRivers({ rivers }: KnowledgeRiversProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      {rivers.map((river, index) => {
        const Icon = riverIcons[river.slug as keyof typeof riverIcons] ?? Sigma;
        const spanClass =
          index === 0 ? "md:col-span-5" : index === 1 ? "md:col-span-4 md:translate-y-10" : "md:col-span-3";

        return (
          <motion.article
            key={river.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`${spanClass} mist-panel rounded-[2rem] p-6 md:p-8`}
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(196,160,53,0.24)] bg-[rgba(196,160,53,0.1)]">
              <Icon className="h-5 w-5 text-[var(--or-ancestral)]" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(212,221,215,0.58)]">
              {river.subtitle}
            </p>
            <h3 className="mt-3 font-display text-3xl leading-tight tracking-[-0.04em] text-[var(--ivoire-ancien)]">
              {river.title}
            </h3>
            <p className="mt-4 text-sm leading-8 text-[rgba(212,221,215,0.76)]">{river.summary}</p>
            <div className="mt-6 rounded-[1.4rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.45)] p-4">
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[var(--amber-light)]">Promesse</p>
              <p className="mt-3 text-sm leading-7 text-[rgba(240,237,229,0.82)]">{river.highlight}</p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
