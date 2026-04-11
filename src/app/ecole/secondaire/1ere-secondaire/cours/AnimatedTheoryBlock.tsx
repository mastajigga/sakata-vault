"use client";

import { motion } from "framer-motion";
import { BookOpen, Leaf, Microscope } from "lucide-react";
import MathExpression from "@/app/ecole/components/MathExpression";
import type { SemanticEnrichment } from "@/app/api/ecole/semantic-content/route";
import type { CourseChapter, TheoryBlock } from "@/app/ecole/data/mathematics-curriculum";

interface AnimatedTheoryBlockProps {
  chapter: CourseChapter;
  theoryBlocks: TheoryBlock[];
  enrichment: SemanticEnrichment | null;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.05 },
  },
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const stepVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

export default function AnimatedTheoryBlock({
  chapter,
  theoryBlocks,
  enrichment,
}: AnimatedTheoryBlockProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      className="space-y-5"
    >
      {/* Cultural context card */}
      <motion.div
        variants={stepVariants}
        className="rounded-[1.6rem] border border-[rgba(34,197,94,0.18)] bg-[rgba(34,197,94,0.06)] p-5"
      >
        <div className="flex items-center gap-3 text-[rgba(134,239,172,0.9)]">
          <Leaf className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            Contexte Basakata
          </p>
        </div>
        <p className="mt-3 text-sm leading-7 text-[rgba(212,221,215,0.82)]">
          {chapter.sakataContext}
        </p>
      </motion.div>

      {/* Theory blocks from curriculum */}
      {theoryBlocks.map((block) => (
        <motion.article
          key={block.title}
          variants={stepVariants}
          className="mist-panel rounded-[1.8rem] p-5 md:p-6"
        >
          <div className="flex items-center gap-3 text-[var(--amber-light)]">
            <BookOpen className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
              Théorie guidée
            </p>
          </div>

          <h4 className="mt-4 font-display text-2xl tracking-tight text-[var(--ivoire-ancien)]">
            {block.title}
          </h4>

          <p className="mt-4 text-sm leading-7 text-[rgba(240,237,229,0.8)]">
            {block.explanation}
          </p>

          {block.formula ? (
            <motion.div
              variants={stepVariants}
              className="mt-5 rounded-[1.2rem] border border-[rgba(212,221,215,0.1)] bg-[rgba(4,17,13,0.55)] p-4"
            >
              <MathExpression expression={block.formula} displayMode />
            </motion.div>
          ) : null}

          {block.example ? (
            <motion.div
              variants={stepVariants}
              className="mt-4 rounded-[1.2rem] border border-[rgba(196,160,53,0.14)] bg-[rgba(196,160,53,0.06)] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--amber-light)]">
                Exemple local
              </p>
              <p className="mt-2 text-sm leading-7 text-[rgba(240,237,229,0.78)]">
                {block.example}
              </p>
            </motion.div>
          ) : null}
        </motion.article>
      ))}

      {/* Pinecone-enriched insight (shows when enrichment is loaded) */}
      {enrichment ? (
        <>
          <motion.div
            key="enriched-context"
            variants={stepVariants}
            className="rounded-[1.6rem] border border-[rgba(196,160,53,0.16)] bg-[rgba(196,160,53,0.05)] p-5"
          >
            <div className="flex items-center gap-3 text-[var(--amber-light)]">
              <Microscope className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Savoir académique
              </p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[rgba(212,221,215,0.82)]">
              {enrichment.enrichedContext}
            </p>
          </motion.div>

          {enrichment.mathInsights.length > 0 ? (
            <motion.div key="math-insights" variants={stepVariants} className="mist-panel rounded-[1.6rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(212,221,215,0.56)]">
                Points clés
              </p>
              <ul className="mt-3 space-y-2">
                {enrichment.mathInsights.map((insight) => (
                  <li key={insight} className="flex gap-3 text-sm leading-7 text-[rgba(240,237,229,0.8)]">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--amber-light)]" />
                    {insight}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </>
      ) : null}
    </motion.div>
  );
}
