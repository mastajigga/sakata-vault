"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, Trophy, ChevronRight } from "lucide-react";
import type { GuidedExercise } from "@/app/ecole/data/mathematics-curriculum";
import { supabase } from "@/lib/supabase";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";
import { useAuth } from "@/components/AuthProvider";

interface GameModeProps {
  exercises: GuidedExercise[];
  chapterId: string;
  onComplete: (score: number, maxScore: number) => void;
  onClose: () => void;
}

type QuestionState = "idle" | "correct" | "wrong" | "wrong-retry";

const MAX_ATTEMPTS = 2;
const POINTS_FIRST = 10;
const POINTS_SECOND = 5;

export default function GameMode({ exercises, chapterId, onComplete, onClose }: GameModeProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [questionState, setQuestionState] = useState<QuestionState>("idle");
  const [attemptCount, setAttemptCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const maxScore = exercises.length * POINTS_FIRST;
  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex) / exercises.length) * 100;

  const saveScore = useCallback(
    async (finalScore: number) => {
      if (!user) return;
      setIsSaving(true);
      try {
        await withRetry(async () =>
          await supabase.from(DB_TABLES.ECOLE_SCORES ?? "ecole_scores").upsert(
            {
              user_id: user.id,
              chapter_id: chapterId,
              exercise_id: `${chapterId}-session`,
              score: finalScore,
              max_score: maxScore,
              attempts: exercises.length,
              completed_at: new Date().toISOString(),
            },
            { onConflict: "user_id,chapter_id,exercise_id" }
          )
        );
      } catch {
        // score save failure is non-critical
      } finally {
        setIsSaving(false);
      }
    },
    [user, chapterId, maxScore, exercises.length]
  );

  const checkAnswer = useCallback(() => {
    if (!currentExercise) return;
    const raw = currentExercise.answerType === "choice" ? selectedChoice ?? "" : inputValue.trim();
    const expected = currentExercise.expectedAnswer;
    const normalized = raw.toLowerCase().replace(/\s+/g, "");

    let isCorrect = false;
    if (Array.isArray(expected)) {
      isCorrect = expected.some(
        (e) => normalized === e.toLowerCase().replace(/\s+/g, "")
      );
    } else {
      isCorrect = normalized === String(expected).toLowerCase().replace(/\s+/g, "");
    }

    if (isCorrect) {
      const pts = attemptCount === 0 ? POINTS_FIRST : POINTS_SECOND;
      setScore((prev) => prev + pts);
      setQuestionState("correct");
    } else {
      const nextAttempt = attemptCount + 1;
      setAttemptCount(nextAttempt);
      if (nextAttempt >= MAX_ATTEMPTS) {
        setQuestionState("wrong");
      } else {
        setQuestionState("wrong-retry");
      }
    }
  }, [currentExercise, inputValue, selectedChoice, attemptCount]);

  const goNext = useCallback(async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= exercises.length) {
      await saveScore(score);
      setIsFinished(true);
      onComplete(score, maxScore);
    } else {
      setCurrentIndex(nextIndex);
      setInputValue("");
      setSelectedChoice(null);
      setQuestionState("idle");
      setAttemptCount(0);
    }
  }, [currentIndex, exercises.length, score, maxScore, saveScore, onComplete]);

  const scorePercent = Math.round((score / maxScore) * 100);

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,18,12,0.95)] p-4 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md rounded-[2rem] border border-[rgba(196,160,53,0.25)] bg-[var(--foret-nocturne)] p-8 text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(196,160,53,0.12)] text-[var(--or-ancestral)]"
          >
            <Trophy size={40} />
          </motion.div>
          <h2 className="font-display text-3xl tracking-tight text-[var(--ivoire-ancien)]">
            Parcours accompli
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[rgba(212,221,215,0.5)]">
            Mode Exercice terminé
          </p>
          <div className="mt-8 rounded-2xl border border-[rgba(196,160,53,0.2)] bg-[rgba(196,160,53,0.06)] p-6">
            <p className="text-5xl font-bold text-[var(--or-ancestral)]">{score}</p>
            <p className="mt-1 text-sm text-[rgba(212,221,215,0.6)]">points sur {maxScore}</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[rgba(212,221,215,0.08)]">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(196,160,53,0.9),rgba(212,221,215,0.7))]"
                initial={{ width: 0 }}
                animate={{ width: `${scorePercent}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="mt-2 text-xs text-[rgba(212,221,215,0.4)]">{scorePercent} %</p>
          </div>
          {isSaving && (
            <p className="mt-4 text-xs text-[rgba(212,221,215,0.4)]">Sauvegarde en cours...</p>
          )}
          <button
            onClick={onClose}
            className="mt-8 w-full rounded-2xl bg-[rgba(196,160,53,0.15)] py-3 text-sm font-medium text-[var(--or-ancestral)] transition-colors hover:bg-[rgba(196,160,53,0.25)] focus:outline-none focus:ring-2 focus:ring-[var(--or-ancestral)]"
          >
            Fermer
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentExercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[rgba(10,18,12,0.97)] backdrop-blur-md">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[rgba(212,221,215,0.08)] px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.18em] text-[rgba(212,221,215,0.5)]">
            Mode Exercice
          </span>
          <span className="rounded-full bg-[rgba(196,160,53,0.12)] px-3 py-0.5 text-xs font-medium text-[var(--or-ancestral)]">
            {score} pts
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer le mode exercice"
          className="rounded-full p-2 text-[rgba(212,221,215,0.5)] transition-colors hover:bg-[rgba(212,221,215,0.08)] hover:text-[var(--ivoire-ancien)]"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-[rgba(212,221,215,0.05)]">
        <motion.div
          className="h-full bg-[var(--or-ancestral)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Question counter */}
      <div className="shrink-0 px-4 py-2 text-center md:px-6">
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.35)]">
          Question {currentIndex + 1} / {exercises.length}
        </span>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl"
          >
            {/* Context */}
            <div className="mb-6 rounded-2xl border border-[rgba(212,221,215,0.08)] bg-[rgba(212,221,215,0.03)] p-5">
              <p className="mb-1 text-[0.65rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.4)]">
                Contexte
              </p>
              <p className="text-sm leading-relaxed text-[rgba(212,221,215,0.75)]">
                {currentExercise.context}
              </p>
            </div>

            {/* Question */}
            <h2 className="mb-6 font-display text-xl leading-snug text-[var(--ivoire-ancien)] md:text-2xl">
              {currentExercise.prompt}
            </h2>

            {/* Answer input */}
            {currentExercise.answerType === "choice" && currentExercise.choices ? (
              <div className="space-y-3">
                {currentExercise.choices.map((choice) => {
                  const isSelected = selectedChoice === choice.value;
                  const isCorrectChoice =
                    questionState !== "idle" &&
                    questionState !== "wrong-retry" &&
                    choice.value === (
                      Array.isArray(currentExercise.expectedAnswer)
                        ? currentExercise.expectedAnswer[0]
                        : currentExercise.expectedAnswer
                    );
                  const isWrongSelection =
                    (questionState === "wrong" || questionState === "wrong-retry") &&
                    isSelected &&
                    !isCorrectChoice;

                  return (
                    <button
                      key={choice.value}
                      onClick={() => {
                        if (questionState === "idle" || questionState === "wrong-retry") {
                          setSelectedChoice(choice.value);
                        }
                      }}
                      disabled={questionState === "correct" || questionState === "wrong"}
                      className={[
                        "w-full rounded-2xl border px-5 py-4 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--or-ancestral)]",
                        isCorrectChoice
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                          : isWrongSelection
                          ? "border-red-500/50 bg-red-500/10 text-red-300"
                          : isSelected
                          ? "border-[rgba(196,160,53,0.5)] bg-[rgba(196,160,53,0.1)] text-[var(--or-ancestral)]"
                          : "border-[rgba(212,221,215,0.12)] bg-[rgba(212,221,215,0.03)] text-[rgba(212,221,215,0.75)] hover:border-[rgba(212,221,215,0.25)] hover:bg-[rgba(212,221,215,0.06)]",
                      ].join(" ")}
                    >
                      {choice.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && questionState === "idle") checkAnswer();
                  if (e.key === "Enter" && questionState === "wrong-retry") {
                    setQuestionState("idle");
                    setInputValue("");
                  }
                }}
                disabled={questionState === "correct" || questionState === "wrong"}
                placeholder="Votre réponse..."
                className="w-full rounded-2xl border border-[rgba(212,221,215,0.15)] bg-[rgba(212,221,215,0.04)] px-5 py-4 text-[var(--ivoire-ancien)] placeholder-[rgba(212,221,215,0.25)] outline-none transition-colors focus:border-[rgba(196,160,53,0.4)] focus:bg-[rgba(196,160,53,0.04)]"
              />
            )}

            {/* Feedback */}
            <AnimatePresence>
              {questionState !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={[
                    "mt-5 flex items-start gap-3 rounded-2xl border p-4",
                    questionState === "correct"
                      ? "border-emerald-500/30 bg-emerald-500/8"
                      : questionState === "wrong-retry"
                      ? "border-amber-500/30 bg-amber-500/8"
                      : "border-red-500/30 bg-red-500/8",
                  ].join(" ")}
                >
                  {questionState === "correct" ? (
                    <CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
                  )}
                  <div className="text-sm leading-relaxed">
                    {questionState === "correct" && (
                      <p className="font-medium text-emerald-300">
                        Correct ! +{attemptCount === 0 ? POINTS_FIRST : POINTS_SECOND} pts
                      </p>
                    )}
                    {questionState === "wrong-retry" && (
                      <p className="text-amber-300">
                        Essaie encore — il te reste une tentative (+{POINTS_SECOND} pts possible).
                      </p>
                    )}
                    {questionState === "wrong" && (
                      <>
                        <p className="font-medium text-red-300">Réponse incorrecte</p>
                        <p className="mt-1 text-[rgba(212,221,215,0.6)]">
                          Bonne réponse :{" "}
                          <span className="font-mono text-[var(--or-ancestral)]">
                            {Array.isArray(currentExercise.expectedAnswer)
                              ? currentExercise.expectedAnswer[0]
                              : currentExercise.expectedAnswer}
                          </span>
                        </p>
                        {currentExercise.solutionSteps.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {currentExercise.solutionSteps.map((step, i) => (
                              <li key={i} className="text-[rgba(212,221,215,0.55)]">
                                {i + 1}. {step}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer actions */}
      <div className="shrink-0 border-t border-[rgba(212,221,215,0.08)] px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-xl justify-between gap-3">
          {(questionState === "idle" || questionState === "wrong-retry") ? (
            <button
              onClick={() => {
                if (questionState === "wrong-retry") {
                  setQuestionState("idle");
                  setInputValue("");
                  setSelectedChoice(null);
                } else {
                  checkAnswer();
                }
              }}
              disabled={
                currentExercise.answerType === "choice"
                  ? !selectedChoice
                  : !inputValue.trim()
              }
              className="ml-auto flex items-center gap-2 rounded-2xl bg-[rgba(196,160,53,0.15)] px-6 py-3 text-sm font-medium text-[var(--or-ancestral)] transition-all hover:bg-[rgba(196,160,53,0.25)] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--or-ancestral)]"
            >
              {questionState === "wrong-retry" ? "Réessayer" : "Valider"}
            </button>
          ) : (
            <button
              onClick={goNext}
              className="ml-auto flex items-center gap-2 rounded-2xl bg-[rgba(196,160,53,0.15)] px-6 py-3 text-sm font-medium text-[var(--or-ancestral)] transition-all hover:bg-[rgba(196,160,53,0.25)] focus:outline-none focus:ring-2 focus:ring-[var(--or-ancestral)]"
            >
              {currentIndex + 1 >= exercises.length ? "Voir le résultat" : "Suivant"}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
