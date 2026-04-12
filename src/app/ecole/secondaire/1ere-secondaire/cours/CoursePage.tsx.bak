"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MathematicsProgramYear } from "@/app/ecole/data/mathematics-curriculum";
import type { SemanticEnrichment } from "@/app/api/ecole/semantic-content/route";
import ChapterNav from "./ChapterNav";
import AnimatedTheoryBlock from "./AnimatedTheoryBlock";
import VisualizationTabs from "./VisualizationTabs";

interface CoursPageProps { program: MathematicsProgramYear; }

export default function CoursePage({ program }: CoursPageProps) {
  const chapters = program.courseChapters ?? [];
  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id ?? "");
  const [completedChapterIds, setCompletedChapterIds] = useState<Set<string>>(new Set());
  const [enrichments, setEnrichments] = useState<Record<string, SemanticEnrichment | null>>({});
  const activeChapter = chapters.find((c) => c.id === activeChapterId) ?? chapters[0];
  const activeChapterIndex = chapters.findIndex((c) => c.id === activeChapterId);
  const fetchEnrichment = useCallback(async (chapterId: string) => {
    if (enrichments[chapterId] !== undefined) return;
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
    } catch {}
  }, [enrichments]);
  useEffect(() => {
    if (activeChapterId) fetchEnrichment(activeChapterId);
  }, [activeChapterId, fetchEnrichment]);
  if (!activeChapter) return null;
  const chapterIndex = chapters.indexOf(activeChapter);
  const theoryBlocks = program.theoryBlocks[chapterIndex] ? [program.theoryBlocks[chapterIndex]] : [];
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
      <nav className="mb-8 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.45)]">
        <Link href="/ecole">École</Link><span>›</span><Link href="/ecole#mathematiques-secondaire">Secondaire</Link><span>›</span>
        <span className="text-[rgba(212,221,215,0.65)]">{program.title}</span><span>›</span>
        <span className="text-[var(--or-ancestral)]">Cours complet</span>
      </nav>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="mist-panel mb-10 rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="eyebrow">{program.title}</span>
          <span className="rounded-full border border-[rgba(212,221,215,0.12)] px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.6)]">{chapters.length} chapitres</span>
        </div>
        <h1 className="heading-xl mt-3">Parcours animé — Cours complet</h1>
      </motion.div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr]">
        <ChapterNav chapters={chapters} activeChapterId={activeChapterId} completedChapterIds={completedChapterIds} onSelect={(id) => { handleChapterComplete(); setActiveChapterId(id); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        <div className="space-y-10">
          <AnimatedTheoryBlock key={`theory-${activeChapterId}`} chapter={activeChapter} theoryBlocks={theoryBlocks} enrichment={enrichments[activeChapterId] ?? null} />
          {activeChapter.visualizations && activeChapter.visualizations.length > 0 && (
            <motion.div key={`viz-${activeChapterId}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true, margin: "0px 0px -100px 0px" }}>
              <VisualizationTabs visualizations={activeChapter.visualizations} />
            </motion.div>
          )}
          <motion.div key={`nav-${activeChapterId}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 flex flex-col gap-4 border-t border-[rgba(196,160,53,0.15)] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {activeChapterIndex > 0 && (
                <button onClick={() => { setActiveChapterId(chapters[activeChapterIndex - 1].id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft size={16} /> Chapitre précédent
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-[rgba(212,221,215,0.5)]">Chapitre {activeChapterIndex + 1} / {chapters.length}</p>
            </div>
            <div className="flex gap-2">
              {activeChapterIndex < chapters.length - 1 && (
                <button onClick={goToNext} className="btn-primary flex items-center gap-2">
                  Chapitre suivant <ArrowRight size={16} />
                </button>
              )}
              {activeChapterIndex === chapters.length - 1 && (
                <Link href={`/ecole/secondaire/${program.courseSlug}/exercices`} className="btn-primary flex items-center gap-2">
                  Vers les exercices <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
