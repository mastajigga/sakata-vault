"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Flame, X } from "lucide-react";
import type { GuidedExercise, MathematicsProgramYear } from "@/app/ecole/data/mathematics-curriculum";
import { useEcoleProgress } from "@/app/ecole/hooks/useEcoleProgress";
import MathExerciseCard from "@/app/ecole/components/MathExerciseCard";

interface ExercicesPageProps {
  program: MathematicsProgramYear;
}

/** Fisher-Yates shuffle — deterministic per session via useMemo */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExercicesPage({ program }: ExercicesPageProps) {
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapter");

  const {
    completeExercise,
    recordAttempt,
    getCompletedExercises,
  } = useEcoleProgress([program], "secondaire");

  const activeChapter = useMemo(
    () => program.courseChapters?.find((c) => c.id === chapterId) ?? null,
    [program.courseChapters, chapterId]
  );

  // Randomized exercise list — stable per render session
  const orderedExercises = useMemo<GuidedExercise[]>(() => {
    if (!activeChapter) return shuffle(program.exercises);

    const chapterExercises = program.exercises.filter((e) =>
      activeChapter.exerciseIds.includes(e.id)
    );
    const otherExercises = program.exercises.filter(
      (e) => !activeChapter.exerciseIds.includes(e.id)
    );
    return [...shuffle(chapterExercises), ...shuffle(otherExercises)];
  }, [program.exercises, activeChapter]);

  const completedIds = getCompletedExercises(program.slug);

  return (
    <div className="section-container py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.45)]">
        <Link href="/ecole" className="transition-colors hover:text-[rgba(212,221,215,0.7)]">
          École
        </Link>
        <span>›</span>
        <Link
          href="/ecole/secondaire/1ere-secondaire/cours"
          className="transition-colors hover:text-[rgba(212,221,215,0.7)]"
        >
          Cours complet
        </Link>
        <span>›</span>
        <span className="text-[var(--or-ancestral)]">Exercices</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/ecole/secondaire/1ere-secondaire/cours"
            className="flex items-center gap-2 rounded-full border border-[rgba(212,221,215,0.12)] px-4 py-2 text-xs text-[rgba(212,221,215,0.6)] transition-all duration-200 hover:border-[rgba(212,221,215,0.25)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au cours
          </Link>

          {/* Active chapter filter pill */}
          {activeChapter ? (
            <div className="flex items-center gap-2 rounded-full border border-[rgba(196,160,53,0.35)] bg-[rgba(196,160,53,0.1)] px-4 py-2">
              <BookOpen className="h-3.5 w-3.5 text-[var(--amber-light)]" />
              <span className="text-xs font-semibold text-[var(--or-ancestral)]">
                {activeChapter.title}
              </span>
              <Link
                href="/ecole/secondaire/1ere-secondaire/exercices"
                className="text-[rgba(212,221,215,0.5)] transition-colors hover:text-[rgba(212,221,215,0.8)]"
                aria-label="Supprimer le filtre"
              >
                <X className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : null}
        </div>

        <h1 className="mt-6 font-display text-3xl tracking-tight text-[var(--ivoire-ancien)] md:text-5xl">
          {activeChapter ? `Exercices — ${activeChapter.title}` : "Tous les exercices"}
        </h1>
        <p className="mt-3 text-base leading-8 text-[rgba(212,221,215,0.7)]">
          {activeChapter
            ? `Exercices du chapitre "${activeChapter.title}" en premier, suivis d'exercices complémentaires.`
            : "Tous les exercices de la 1ère secondaire, dans un ordre aléatoire à chaque visite."}
        </p>

        {/* Completion counter */}
        <div className="mt-4 flex items-center gap-3">
          <Flame className="h-4 w-4 text-[var(--amber-light)]" />
          <span className="text-sm text-[rgba(212,221,215,0.65)]">
            {completedIds.length}/{program.exercises.length} exercices validés
          </span>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-[rgba(212,221,215,0.08)]">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(196,160,53,0.8),rgba(212,221,215,0.6))]"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedIds.length / program.exercises.length) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </motion.div>

      {/* Exercise list */}
      <div className="space-y-5">
        {orderedExercises.map((exercise, i) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: Math.min(i * 0.07, 0.35),
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <MathExerciseCard
              yearSlug={program.slug}
              exercise={exercise}
              completed={completedIds.includes(exercise.id)}
              onAttempt={(attempt) =>
                recordAttempt(
                  attempt.yearSlug,
                  attempt.exerciseId,
                  attempt.submittedAnswer,
                  attempt.isCorrect
                )
              }
              onComplete={() =>
                completeExercise(program.slug, exercise.id, program.exercises.length)
              }
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
