"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MathematicsProgramYear } from "@/app/ecole/data/mathematics-curriculum";
import type { SemanticEnrichment } from "@/app/api/ecole/semantic-content/route";
import ChapterNav from "./ChapterNav";
import AnimatedTheoryBlock from "./AnimatedTheoryBlock";
import BalanceVisualization from "./BalanceVisualization";
import VennVisualization from "./VennVisualization";

interface CoursPageProps {
  program: MathematicsProgramYear;
}

export default function CoursPage({ program }: CoursPageProps) {
  const chapters = program.courseChapters ?? [];
  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id ?? "");
  const [completedChapterIds, setCompletedChapterIds] = useState<Set<string>>(new Set());
  const [enrichments, setEnrichments] = useState<Record<string, SemanticEnrichment | null>>({});

  const activeChapter = chapters.find((c) => c.id === activeChapterId) ?? chapters[0];
  const activeChapterIndex = chapters.findIndex((c) => c.id === activeChapterId);

  // Fetch enrichment for the active chapter
  const fetchEnrichment = useCallback(async (chapterId: string) => {
    if (enrichments[chapterId] !== undefined) return;
    // Optimistically set null (loading)
    setEnrichments((prev) => ({ ...prev, [chapterId]: null }));

    try {
      const res = await fetch("/api/ecole/semantic-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter: chapterId }),
      });
      if (res.ok) {
        const data = (await res.json()) as SemanticEnrichment;
        setEnrichments((prev) => ({ ...prev, [chapterId]: data }));
      }
    } catch {
      // Silent fail — static content already shown
    }
  }, [enrichments]);

  useEffect(() => {
    if (activeChapterId) fetchEnrichment(activeChapterId);
  }, [activeChapterId, fetchEnrichment]);

  if (!activeChapter) return null;

  // Theory blocks that belong to this chapter (match by position in array)
  const chapterIndex = chapters.indexOf(activeChapter);
  const theoryBlock = program.theoryBlocks[chapterIndex] ? [program.theoryBlocks[chapterIndex]] : program.theoryBlocks;

  const handleChapterComplete = () => {
    setCompletedChapterIds((prev) => new Set([...prev, activeChapterId]));
  };

  const goToNext = () => {
    if (activeChapterIndex < chapters.length - 1) {
      handleChapterComplete();
      setActiveChapterId(chapters[activeChapterIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="section-container py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.45)]">
        <Link href="/ecole" className="transition-colors hover:text-[rgba(212,221,215,0.7)]">
          École
        </Link>
        <span>›</span>
        <Link href="/ecole#mathematiques-secondaire" className="transition-colors hover:text-[rgba(212,221,215,0.7)]">
          Secondaire
        </Link>
        <span>›</span>
        <span className="text-[rgba(212,221,215,0.65)]">{program.title}</span>
        <span>›</span>
        <span className="text-[var(--or-ancestral)]">Cours complet</span>
      </nav>

      {/* Hero strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mist-panel mb-10 rounded-[2rem] p-6 md:p-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="eyebrow">{program.title}</span>
          <span className="rounded-full border border-[rgba(212,221,215,0.12)] px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.6)]">
            {program.degree}
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl tracking-[-0.04em] text-[var(--ivoire-ancien)] md:text-5xl">
          {program.focus}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-[rgba(212,221,215,0.76)]">
          {program.overview}
        </p>

        {/* Progress ring */}
        <div className="mt-5 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-full border-2"
              style={{
                borderColor: "rgba(196,160,53,0.4)",
                background: `conic-gradient(rgba(196,160,53,0.7) ${(completedChapterIds.size / chapters.length) * 100}%, rgba(212,221,215,0.06) 0%)`,
              }}
            />
            <span className="text-sm text-[rgba(212,221,215,0.65)]">
              {completedChapterIds.size}/{chapters.length} chapitres
            </span>
          </div>
        </div>
      </motion.div>

      {/* Chapter nav pills (mobile — shown above content) */}
      <ChapterNav
        chapters={chapters}
        activeChapterId={activeChapterId}
        completedChapterIds={completedChapterIds}
        onSelect={setActiveChapterId}
      />

      {/* Main grid */}
      <div className="mt-8 grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
        {/* Sidebar — desktop only (ChapterNav renders aside inside) */}
        <ChapterNav
          chapters={chapters}
          activeChapterId={activeChapterId}
          completedChapterIds={completedChapterIds}
          onSelect={setActiveChapterId}
        />

        {/* Content */}
        <motion.div
          key={activeChapterId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Chapter header */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--amber-light)]">
              Chapitre {activeChapterIndex + 1} / {chapters.length}
            </span>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-[var(--ivoire-ancien)] md:text-4xl">
              {activeChapter.title}
            </h2>
            <p className="mt-2 text-base text-[rgba(212,221,215,0.65)]">
              {activeChapter.subtitle}
            </p>
          </div>

          {/* Animated theory blocks */}
          <AnimatedTheoryBlock
            chapter={activeChapter}
            theoryBlocks={theoryBlock}
            enrichment={enrichments[activeChapterId] ?? null}
          />

          {/* Interactive visualization */}
          {activeChapter.visualizationType === "balance" ? (
            <BalanceVisualization />
          ) : activeChapter.visualizationType === "venn" ? (
            <VennVisualization />
          ) : null}

          {/* Chapter footer: practice + navigation */}
          <div className="rounded-[1.8rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.45)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(212,221,215,0.5)]">
              Pratiquer ce chapitre
            </p>
            <p className="mt-2 text-sm leading-7 text-[rgba(212,221,215,0.72)]">
              Mettez en pratique les concepts de ce chapitre avec des exercices contextualisés.
              {activeChapter.exerciseIds.length === 0
                ? " Des exercices seront ajoutés prochainement."
                : ""}
            </p>
            {activeChapter.exerciseIds.length > 0 ? (
              <Link
                href={`/ecole/secondaire/1ere-secondaire/exercices?chapter=${activeChapter.id}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(196,160,53,0.3)] bg-[rgba(196,160,53,0.08)] px-5 py-2.5 text-sm font-semibold text-[var(--or-ancestral)] transition-all duration-300 hover:bg-[rgba(196,160,53,0.15)] active:scale-[0.98]"
              >
                Pratiquer ce chapitre
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4 pt-2">
            {activeChapterIndex > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setActiveChapterId(chapters[activeChapterIndex - 1].id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 rounded-full border border-[rgba(212,221,215,0.12)] px-5 py-2.5 text-sm text-[rgba(212,221,215,0.65)] transition-all duration-200 hover:border-[rgba(212,221,215,0.25)] active:scale-[0.98]"
              >
                <ArrowLeft className="h-4 w-4" />
                Chapitre précédent
              </button>
            ) : (
              <div />
            )}

            {activeChapterIndex < chapters.length - 1 ? (
              <button
                type="button"
                onClick={goToNext}
                className="flex items-center gap-2 rounded-full border border-[rgba(196,160,53,0.3)] bg-[rgba(196,160,53,0.1)] px-5 py-2.5 text-sm font-semibold text-[var(--or-ancestral)] transition-all duration-200 hover:bg-[rgba(196,160,53,0.18)] active:scale-[0.98]"
              >
                Chapitre suivant
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href="/ecole/secondaire/1ere-secondaire/exercices"
                onClick={handleChapterComplete}
                className="flex items-center gap-2 rounded-full border border-[rgba(196,160,53,0.4)] bg-[rgba(196,160,53,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--or-ancestral)] transition-all duration-200 hover:bg-[rgba(196,160,53,0.22)] active:scale-[0.98]"
              >
                Tous les exercices
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
