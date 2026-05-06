"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, ArrowRight, Trophy, Flame } from "lucide-react";

type ExerciseType = "word-match" | "translation" | "listening";

interface WordPair {
  kisakata: string;
  francais: string;
  emoji: string;
}

interface ExerciseQuestion {
  type: ExerciseType;
  question: string;
  options: string[];
  correctIndex: number;
  pair?: WordPair;
}

const EXERCISES: Record<string, ExerciseQuestion[]> = {
  salutations: [
    {
      type: "word-match",
      question: "Quel mot Kisakata signifie « Bonjour » ?",
      options: ["Mbóte", "Tókó", "Lóbí", "Tatá"],
      correctIndex: 0,
      pair: { kisakata: "Mbóte", francais: "Bonjour", emoji: "👋" },
    },
    {
      type: "translation",
      question: "Comment dit-on « Ça va / D'accord » en Kisakata ?",
      options: ["Lóbí", "Tókó", "Mbóte", "Mamá"],
      correctIndex: 1,
      pair: { kisakata: "Tókó", francais: "Ça va", emoji: "👍" },
    },
    {
      type: "word-match",
      question: "Que signifie « Lóbí » ?",
      options: ["Bonjour", "À demain / Salut", "Maman", "Forêt"],
      correctIndex: 1,
      pair: { kisakata: "Lóbí", francais: "À demain", emoji: "☀️" },
    },
  ],
  famille: [
    {
      type: "word-match",
      question: "Comment dit-on « Papa » en Kisakata ?",
      options: ["Mamá", "Tatá", "Nkókó", "Kókó"],
      correctIndex: 1,
      pair: { kisakata: "Tatá", francais: "Papa", emoji: "👨" },
    },
    {
      type: "translation",
      question: "« Nkókó » signifie...",
      options: ["Grand-mère", "Papa", "Grand-père / Ancêtre", "Enfant"],
      correctIndex: 2,
      pair: { kisakata: "Nkókó", francais: "Grand-père", emoji: "👴" },
    },
    {
      type: "word-match",
      question: "Quel mot désigne « Grand-mère » ?",
      options: ["Tatá", "Nkókó", "Mamá", "Kókó"],
      correctIndex: 3,
      pair: { kisakata: "Kókó", francais: "Grand-mère", emoji: "👵" },
    },
  ],
};

interface ExerciceWidgetProps {
  leconSlug: string;
  onComplete?: (score: number) => void;
}

export default function ExerciceWidget({ leconSlug, onComplete }: ExerciceWidgetProps) {
  const questions = EXERCISES[leconSlug] || [];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const question = questions[currentQ];

  const handleAnswer = useCallback(
    (idx: number) => {
      if (status !== "idle") return;
      setSelected(idx);

      const isCorrect = idx === question.correctIndex;
      setStatus(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        setScore((s) => s + 10 + streak * 2);
        setTotalCorrect((c) => c + 1);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }

      setTimeout(() => {
        if (currentQ + 1 < questions.length) {
          setCurrentQ((q) => q + 1);
          setSelected(null);
          setStatus("idle");
        } else {
          setFinished(true);
          onComplete?.(score + (isCorrect ? 10 + streak * 2 : 0));
        }
      }, 1200);
    },
    [status, question, currentQ, questions.length, score, streak, onComplete]
  );

  if (!questions.length) {
    return (
      <div className="text-center py-8 text-[rgba(212,221,215,0.4)]">
        Aucun exercice disponible pour cette leçon.
      </div>
    );
  }

  if (finished) {
    const finalScore = score;
    const perfect = totalCorrect === questions.length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div
          className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            perfect
              ? "bg-[rgba(196,160,53,0.15)] border-2 border-[var(--or-ancestral)]"
              : "bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.3)]"
          }`}
        >
          {perfect ? (
            <Trophy className="w-10 h-10 text-[var(--or-ancestral)]" />
          ) : (
            <Sparkles className="w-8 h-8 text-[var(--or-ancestral)]" />
          )}
        </div>
        <h3 className="text-2xl font-display text-[var(--ivoire-ancien)] mb-2">
          {perfect ? "Parfait !" : "Bien joué !"}
        </h3>
        <p className="text-[rgba(212,221,215,0.6)] mb-4">
          {totalCorrect} / {questions.length} bonnes réponses
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-[var(--or-ancestral)]">
            <Trophy className="w-4 h-4" />
            <span className="font-bold">{finalScore} pts</span>
          </div>
          {streak > 2 && (
            <div className="flex items-center gap-2 text-[var(--amber-light)]">
              <Flame className="w-4 h-4" />
              <span>Série de {streak} !</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(10,31,21,0.5)] backdrop-blur-sm p-8">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs text-[rgba(212,221,215,0.4)]">
          Question {currentQ + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-4">
          {streak > 1 && (
            <span className="flex items-center gap-1 text-xs text-[var(--amber-light)]">
              <Flame className="w-3 h-3" />
              {streak}
            </span>
          )}
          <span className="text-xs text-[var(--or-ancestral)]">{score} pts</span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="h-1 rounded-full bg-[rgba(212,221,215,0.06)] mb-8 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--or-ancestral)] to-[var(--or-vif)]"
          animate={{ width: `${((currentQ) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {question.pair && (
            <div className="text-center mb-6">
              <span className="text-4xl">{question.pair.emoji}</span>
            </div>
          )}

          <h3 className="text-xl font-display text-[var(--ivoire-ancien)] text-center mb-8">
            {question.question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((option, idx) => {
              let buttonStyle =
                "border-[rgba(212,221,215,0.08)] hover:border-[rgba(196,160,53,0.3)] bg-[rgba(10,31,21,0.3)] text-[rgba(212,221,215,0.9)]";

              if (status === "correct" && idx === question.correctIndex) {
                buttonStyle =
                  "border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.1)] text-green-400";
              } else if (status === "wrong") {
                if (idx === selected) {
                  buttonStyle =
                    "border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.1)] text-red-400";
                } else if (idx === question.correctIndex) {
                  buttonStyle =
                    "border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.1)] text-green-400";
                }
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={status !== "idle"}
                  whileHover={status === "idle" ? { scale: 1.02 } : {}}
                  whileTap={status === "idle" ? { scale: 0.98 } : {}}
                  className={`relative flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all duration-300 disabled:cursor-default ${buttonStyle}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-[rgba(212,221,215,0.05)] flex items-center justify-center text-xs font-mono text-[rgba(212,221,215,0.4)] shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {status === "correct" && idx === question.correctIndex && (
                    <Check className="w-5 h-5 text-green-400 shrink-0" />
                  )}
                  {status === "wrong" && idx === selected && (
                    <X className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {status === "correct" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-center"
              >
                <span className="inline-flex items-center gap-2 text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  Correct ! +{10 + streak * 2} pts
                </span>
              </motion.div>
            )}
            {status === "wrong" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-center"
              >
                <span className="inline-flex items-center gap-2 text-red-400 text-sm">
                  <X className="w-4 h-4" />
                  La bonne réponse était : {question.options[question.correctIndex]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
