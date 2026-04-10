"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  DatabaseZap,
  Flame,
  RadioTower,
  Sparkles,
} from "lucide-react";
import type { MathematicsProgramYear } from "../data/mathematics-curriculum";
import { useEcoleProgress } from "../hooks/useEcoleProgress";
import MathExpression from "./MathExpression";
import MathExerciseCard from "./MathExerciseCard";

interface MathCurriculumStudioProps {
  programs: MathematicsProgramYear[];
  level?: "primaire" | "secondaire";
}

const syncLabels = {
  cloud: "Progression reliee a Supabase.",
  syncing: "Mise a jour en cours...",
  local: "Progression gardee en local si besoin.",
} as const;

export default function MathCurriculumStudio({
  programs,
  level = "primaire",
}: MathCurriculumStudioProps) {
  const [selectedYear, setSelectedYear] = useState(programs[0]?.slug ?? "");
  const deferredSelectedYear = useDeferredValue(selectedYear);
  const {
    completeExercise,
    recordAttempt,
    getCompletedExercises,
    getYearProgress,
    overallProgress,
    syncStatus,
  } = useEcoleProgress(programs, level);

  const activeProgram = useMemo(
    () =>
      programs.find((program) => program.slug === deferredSelectedYear) ??
      programs[0],
    [deferredSelectedYear, programs]
  );

  if (!activeProgram) {
    return null;
  }

  return (
    <section
      id={level === "secondaire" ? "mathematiques-secondaire" : "mathematiques"}
      className="section-container relative py-24 md:py-32"
    >
      <div className="mb-12 max-w-3xl">
        <span className="eyebrow">
          {level === "secondaire" ? "Secondaire Basakata" : "Brilliant Basakata"}
        </span>
        <h2 className="mt-6 font-display text-4xl tracking-[-0.05em] text-[var(--ivoire-ancien)] md:text-6xl">
          {level === "secondaire"
            ? "Six annees de secondaire, du premier cycle au terminal."
            : "Un studio mathematique progressif, ancre dans la vie Sakata."}
        </h2>
        <p className="mt-5 text-base leading-8 text-[rgba(212,221,215,0.78)] md:text-lg">
          {level === "secondaire"
            ? "Algebre, geometrie, trigonometrie, analyse et probabilites : chaque niveau suit le programme RDC et l ancre dans les territoires, les rivières et les gestes du peuple Sakata."
            : "Chaque annee suit l esprit du programme national primaire de la RDC, puis le traduit en lecons guidees, calculs rendus avec KaTeX, saisie vivante avec MathLive et progression sauvegardee pour chaque eleve."}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-start">
        <aside className="xl:sticky xl:top-24">
          <div className="mist-panel rounded-[2rem] p-6 md:p-7">
            <div className="flex items-center gap-3 text-[var(--amber-light)]">
              <DatabaseZap className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Tableau de progression
              </p>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.45)] p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-[rgba(212,221,215,0.7)]">
                    Progression globale
                  </p>
                  <p className="mt-2 font-display text-4xl tracking-[-0.05em] text-[var(--ivoire-ancien)]">
                    {overallProgress}%
                  </p>
                </div>
                <div className="rounded-full border border-[rgba(196,160,53,0.25)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--amber-light)]">
                  {syncStatus}
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(212,221,215,0.08)]">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(196,160,53,0.86),rgba(212,221,215,0.7))]"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              <p className="mt-3 text-sm leading-7 text-[rgba(212,221,215,0.72)]">
                {syncLabels[syncStatus]}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {programs.map((program) => {
                const progress = getYearProgress(program);
                const isActive = activeProgram.slug === program.slug;

                return (
                  <button
                    key={program.slug}
                    type="button"
                    onClick={() => {
                      startTransition(() => setSelectedYear(program.slug));
                    }}
                    className="w-full rounded-[1.5rem] border px-4 py-4 text-left transition-all duration-300 active:scale-[0.99]"
                    style={{
                      borderColor: isActive
                        ? "rgba(196, 160, 53, 0.36)"
                        : "rgba(212, 221, 215, 0.08)",
                      background: isActive
                        ? "linear-gradient(180deg, rgba(196,160,53,0.16) 0%, rgba(4,17,13,0.6) 100%)"
                        : "rgba(4,17,13,0.45)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-xl tracking-tight text-[var(--ivoire-ancien)]">
                          {program.title}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[rgba(212,221,215,0.56)]">
                          {program.degree}
                        </p>
                      </div>
                      <div className="rounded-full bg-[rgba(212,221,215,0.08)] px-3 py-1 text-xs font-semibold text-[rgba(240,237,229,0.84)]">
                        {progress}%
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-[rgba(212,221,215,0.74)]">
                      {program.focus}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <motion.article
            key={activeProgram.slug}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mist-panel rounded-[2rem] p-6 md:p-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">{activeProgram.title}</span>
              <span className="rounded-full border border-[rgba(212,221,215,0.12)] px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.7)]">
                {activeProgram.degree}
              </span>
            </div>

            <h3 className="mt-6 font-display text-3xl tracking-[-0.04em] text-[var(--ivoire-ancien)] md:text-5xl">
              {activeProgram.focus}
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[rgba(212,221,215,0.78)] md:text-lg">
              {activeProgram.overview}
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="rounded-[1.6rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.48)] p-5">
                <div className="flex items-center gap-3 text-[var(--amber-light)]">
                  <BookOpenCheck className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Objectifs d&apos;apprentissage
                  </p>
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[rgba(240,237,229,0.82)]">
                  {activeProgram.learningObjectives.map((objective) => (
                    <li key={objective} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--amber-light)]" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.6rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.48)] p-5">
                <div className="flex items-center gap-3 text-[var(--amber-light)]">
                  <RadioTower className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Contextes Basakata
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeProgram.localContexts.map((context) => (
                    <span
                      key={context}
                      className="rounded-full border border-[rgba(212,221,215,0.08)] bg-[rgba(10,31,21,0.78)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[rgba(212,221,215,0.72)]"
                    >
                      {context}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.35rem] border border-[rgba(196,160,53,0.16)] bg-[rgba(196,160,53,0.08)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--amber-light)]">
                    Exercices valides
                  </p>
                  <p className="mt-2 font-display text-3xl tracking-tight text-[var(--ivoire-ancien)]">
                    {getCompletedExercises(activeProgram.slug).length}/
                    {activeProgram.exercises.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.article>

          <div className="grid gap-5 lg:grid-cols-2">
            {activeProgram.theoryBlocks.map((block) => (
              <motion.article
                key={block.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="mist-panel rounded-[1.8rem] p-5 md:p-6"
              >
                <div className="flex items-center gap-3 text-[var(--amber-light)]">
                  <Sparkles className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Theorie guidee
                  </p>
                </div>
                <h4 className="mt-4 font-display text-2xl tracking-tight text-[var(--ivoire-ancien)]">
                  {block.title}
                </h4>
                <p className="mt-4 text-sm leading-7 text-[rgba(240,237,229,0.8)]">
                  {block.explanation}
                </p>

                {block.formula ? (
                  <div className="mt-5">
                    <MathExpression expression={block.formula} displayMode />
                  </div>
                ) : null}

                {block.example ? (
                  <div className="mt-5 rounded-[1.35rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.45)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(212,221,215,0.56)]">
                      Exemple local
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[rgba(240,237,229,0.78)]">
                      {block.example}
                    </p>
                  </div>
                ) : null}
              </motion.article>
            ))}
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3 text-[var(--amber-light)]">
              <Flame className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Exercices interactifs et correction immediate
              </p>
            </div>

            {activeProgram.exercises.map((exercise) => (
              <MathExerciseCard
                key={exercise.id}
                yearSlug={activeProgram.slug}
                exercise={exercise}
                completed={getCompletedExercises(activeProgram.slug).includes(
                  exercise.id
                )}
                onAttempt={(attempt) =>
                  recordAttempt(
                    attempt.yearSlug,
                    attempt.exerciseId,
                    attempt.submittedAnswer,
                    attempt.isCorrect
                  )
                }
                onComplete={() =>
                  completeExercise(
                    activeProgram.slug,
                    exercise.id,
                    activeProgram.exercises.length
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
