"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleHelp, Lightbulb, Sparkles } from "lucide-react";
import type { GuidedExercise } from "../data/mathematics-curriculum";
import { isMathAnswerCorrect } from "../lib/assessment";
import MathExpression from "./MathExpression";
import MathFieldInput from "./MathFieldInput";

interface MathExerciseCardProps {
  yearSlug: string;
  exercise: GuidedExercise;
  completed: boolean;
  onComplete: (exerciseId: string) => Promise<void> | void;
  onAttempt: (attempt: {
    yearSlug: string;
    exerciseId: string;
    submittedAnswer: string;
    isCorrect: boolean;
  }) => Promise<void> | void;
}

export default function MathExerciseCard({
  yearSlug,
  exercise,
  completed,
  onComplete,
  onAttempt,
}: MathExerciseCardProps) {
  const [answer, setAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const responseValue = exercise.answerType === "choice" ? selectedChoice : answer;

  const handleSubmit = async () => {
    const isCorrect = isMathAnswerCorrect(responseValue, exercise.expectedAnswer);
    setFeedback(isCorrect ? "correct" : "incorrect");

    await onAttempt({
      yearSlug,
      exerciseId: exercise.id,
      submittedAnswer: responseValue,
      isCorrect,
    });

    if (isCorrect && !completed) {
      await onComplete(exercise.id);
    }
  };

  return (
    <motion.article
      layout
      className="mist-panel rounded-[1.75rem] p-5 md:p-7"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-[rgba(196,160,53,0.26)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--amber-light)]">
          {exercise.title}
        </span>
        <span className="rounded-full bg-[rgba(212,221,215,0.08)] px-3 py-1 text-[0.7rem] text-[rgba(212,221,215,0.78)]">
          {exercise.challenge}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-[rgba(240,237,229,0.76)]">{exercise.context}</p>
      <h4 className="mt-4 font-display text-2xl tracking-tight text-[var(--ivoire-ancien)]">{exercise.prompt}</h4>

      {exercise.equation ? (
        <div className="mt-5">
          <MathExpression expression={exercise.equation} displayMode />
        </div>
      ) : null}

      <div className="mt-5">
        {exercise.answerType === "choice" ? (
          <div className="grid gap-3 md:grid-cols-3">
            {exercise.choices?.map((choice) => {
              const isSelected = selectedChoice === choice.value;
              return (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() => setSelectedChoice(choice.value)}
                  className="rounded-2xl border px-4 py-4 text-left transition-all duration-300 active:scale-[0.98]"
                  style={{
                    borderColor: isSelected ? "rgba(196, 160, 53, 0.45)" : "rgba(212, 221, 215, 0.08)",
                    background: isSelected ? "rgba(196, 160, 53, 0.12)" : "rgba(4, 17, 13, 0.5)",
                  }}
                >
                  <span className="text-sm font-medium text-[var(--ivoire-ancien)]">{choice.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <MathFieldInput value={answer} onChange={setAnswer} placeholder="Écris ton calcul ou ton nombre" />
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!responseValue}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(196,160,53,0.28)] px-5 py-3 text-sm font-semibold text-[var(--or-ancestral)] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
        >
          <CheckCircle2 className="h-4 w-4" />
          Vérifier ma réponse
        </button>

        <button
          type="button"
          onClick={() => setRevealedHints((previous) => Math.min(previous + 1, exercise.hintSteps.length))}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,221,215,0.12)] px-5 py-3 text-sm font-medium text-[rgba(212,221,215,0.82)] transition-all duration-300 active:scale-[0.98]"
        >
          <Lightbulb className="h-4 w-4" />
          Montrer un indice
        </button>

        <button
          type="button"
          onClick={() => setShowSolution((previous) => !previous)}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,221,215,0.12)] px-5 py-3 text-sm font-medium text-[rgba(212,221,215,0.82)] transition-all duration-300 active:scale-[0.98]"
        >
          <CircleHelp className="h-4 w-4" />
          {showSolution ? "Masquer la solution" : "Voir la solution guidée"}
        </button>
      </div>

      {feedback !== "idle" ? (
        <div
          className="mt-5 rounded-2xl border px-4 py-4"
          style={{
            borderColor:
              feedback === "correct" ? "rgba(120, 197, 133, 0.28)" : "rgba(196, 160, 53, 0.22)",
            background:
              feedback === "correct" ? "rgba(49, 93, 59, 0.35)" : "rgba(70, 45, 16, 0.2)",
          }}
        >
          <p className="text-sm font-medium text-[var(--ivoire-ancien)]">
            {feedback === "correct"
              ? "Réponse juste. La rivière avance avec toi."
              : "Essaie encore. Reprends l'histoire, puis compte pas à pas."}
          </p>
        </div>
      ) : null}

      {revealedHints > 0 ? (
        <div className="mt-5 rounded-2xl border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.45)] px-4 py-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--amber-light)]">
            <Sparkles className="h-4 w-4" />
            Indices
          </div>
          <ol className="mt-3 space-y-2 text-sm text-[rgba(240,237,229,0.8)]">
            {exercise.hintSteps.slice(0, revealedHints).map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {showSolution ? (
        <div className="mt-5 rounded-2xl border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.45)] px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--amber-light)]">Solution guidée</p>
          <ol className="mt-3 space-y-2 text-sm text-[rgba(240,237,229,0.8)]">
            {exercise.solutionSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {completed ? (
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(120,197,133,0.92)]">
          Exercice validé dans ta progression
        </p>
      ) : null}
    </motion.article>
  );
}
