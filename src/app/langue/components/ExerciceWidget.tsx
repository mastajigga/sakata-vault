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
  // === Goutte de Rosée ===
  salutations: [
    { type: "word-match", question: "Quel mot Kisakata signifie « Bonjour » ?", options: ["Mbóte", "Tókó", "Lóbí", "Tatá"], correctIndex: 0, pair: { kisakata: "Mbóte", francais: "Bonjour", emoji: "👋" } },
    { type: "translation", question: "Comment dit-on « Ça va / D'accord » en Kisakata ?", options: ["Lóbí", "Tókó", "Mbóte", "Mamá"], correctIndex: 1, pair: { kisakata: "Tókó", francais: "Ça va", emoji: "👍" } },
    { type: "word-match", question: "Que signifie « Lóbí » ?", options: ["Bonjour", "À demain / Salut", "Maman", "Forêt"], correctIndex: 1, pair: { kisakata: "Lóbí", francais: "À demain", emoji: "☀️" } },
    { type: "word-match", question: "Comment dit-on « Merci beaucoup » ?", options: ["Mélá míngi", "Mbóte", "Nzéngá", "Tókó"], correctIndex: 0, pair: { kisakata: "Mélá míngi", francais: "Merci beaucoup", emoji: "🙏" } },
  ],
  famille: [
    { type: "word-match", question: "Comment dit-on « Papa » en Kisakata ?", options: ["Mamá", "Tatá", "Nkókó", "Kókó"], correctIndex: 1, pair: { kisakata: "Tatá", francais: "Papa", emoji: "👨" } },
    { type: "translation", question: "« Nkókó » signifie...", options: ["Grand-mère", "Papa", "Grand-père / Ancêtre", "Enfant"], correctIndex: 2, pair: { kisakata: "Nkókó", francais: "Grand-père", emoji: "👴" } },
    { type: "word-match", question: "Quel mot désigne « Grand-mère » ?", options: ["Tatá", "Nkókó", "Mamá", "Kókó"], correctIndex: 3, pair: { kisakata: "Kókó", francais: "Grand-mère", emoji: "👵" } },
    { type: "word-match", question: "« Ndéko » veut dire...", options: ["Papa", "Grand-mère", "Frère / Sœur", "Enfant"], correctIndex: 2, pair: { kisakata: "Ndéko", francais: "Frère / Sœur", emoji: "👫" } },
  ],
  "se-presenter": [
    { type: "word-match", question: "« Nkómbó » signifie...", options: ["Village", "Nom", "Je", "Eau"], correctIndex: 1, pair: { kisakata: "Nkómbó", francais: "Nom", emoji: "📛" } },
    { type: "translation", question: "Comment dit-on « Je / Moi » en Kisakata ?", options: ["Yó", "Mbóka", "Ngáí", "Éé"], correctIndex: 2, pair: { kisakata: "Ngáí", francais: "Moi / Je", emoji: "🙋" } },
    { type: "word-match", question: "« Naútí » veut dire...", options: ["Je viens de...", "Je mange", "Je dors", "Je parle"], correctIndex: 0, pair: { kisakata: "Naútí", francais: "Je viens de...", emoji: "📍" } },
    { type: "word-match", question: "« Mbóka » désigne...", options: ["Forêt", "Rivière", "Village", "Maison"], correctIndex: 2, pair: { kisakata: "Mbóka", francais: "Village", emoji: "🏘️" } },
  ],

  // === Ruisseau ===
  nourriture: [
    { type: "word-match", question: "« Mákémbá » c'est...", options: ["Poisson", "Poulet", "Bananes plantains", "Manioc"], correctIndex: 2, pair: { kisakata: "Mákémbá", francais: "Bananes plantains", emoji: "🍌" } },
    { type: "translation", question: "Comment dit-on « Poisson » en Kisakata ?", options: ["Nsósó", "Mbísi", "Mái", "Ntóndó"], correctIndex: 1, pair: { kisakata: "Mbísi", francais: "Poisson", emoji: "🐟" } },
    { type: "word-match", question: "« Nsósó » c'est...", options: ["Poisson", "Eau", "Poulet", "Manioc"], correctIndex: 2, pair: { kisakata: "Nsósó", francais: "Poulet", emoji: "🍗" } },
    { type: "translation", question: "« Mái » signifie...", options: ["Poisson", "Feu", "Eau", "Air"], correctIndex: 2, pair: { kisakata: "Mái", francais: "Eau", emoji: "💧" } },
  ],
  couleurs: [
    { type: "word-match", question: "« Ntáne » c'est quelle couleur ?", options: ["Blanc", "Rouge", "Noir", "Bleu"], correctIndex: 1, pair: { kisakata: "Ntáne", francais: "Rouge", emoji: "🔴" } },
    { type: "translation", question: "Comment dit-on « Blanc » en Kisakata ?", options: ["Ngóla", "Ntáne", "Mbwé", "Zámba"], correctIndex: 2, pair: { kisakata: "Mbwé", francais: "Blanc", emoji: "⚪" } },
    { type: "word-match", question: "« Zámba » comme couleur signifie...", options: ["Rouge", "Noir", "Vert (forêt)", "Jaune"], correctIndex: 2, pair: { kisakata: "Zámba", francais: "Vert", emoji: "🟢" } },
    { type: "word-match", question: "« Mosé » c'est...", options: ["Rouge", "Bleu", "Blanc", "Jaune / Or"], correctIndex: 3, pair: { kisakata: "Mosé", francais: "Jaune / Or", emoji: "🟡" } },
  ],
  nombres: [
    { type: "word-match", question: "« Mókó » c'est quel nombre ?", options: ["2", "1", "3", "5"], correctIndex: 1, pair: { kisakata: "Mókó", francais: "Un", emoji: "1️⃣" } },
    { type: "translation", question: "Comment dit-on « Trois » en Kisakata ?", options: ["Íbalé", "Ínéí", "Ísátó", "Ítánó"], correctIndex: 2, pair: { kisakata: "Ísátó", francais: "Trois", emoji: "3️⃣" } },
    { type: "word-match", question: "« Ítánó » c'est...", options: ["4", "5", "6", "3"], correctIndex: 1, pair: { kisakata: "Ítánó", francais: "Cinq", emoji: "5️⃣" } },
    { type: "translation", question: "Quel est le nombre « Ísámbá » ?", options: ["5", "3", "6", "2"], correctIndex: 2, pair: { kisakata: "Ísámbá", francais: "Six", emoji: "6️⃣" } },
  ],

  // === Rivière ===
  actions: [
    { type: "word-match", question: "« Kotámbola » veut dire...", options: ["Manger", "Dormir", "Marcher", "Parler"], correctIndex: 2, pair: { kisakata: "Kotámbola", francais: "Marcher", emoji: "🚶" } },
    { type: "translation", question: "Comment dit-on « Dormir » en Kisakata ?", options: ["Kolía", "Kolála", "Koloba", "Komóna"], correctIndex: 1, pair: { kisakata: "Kolála", francais: "Dormir", emoji: "😴" } },
    { type: "word-match", question: "« Koyóka » signifie...", options: ["Voir", "Parler", "Écouter / Comprendre", "Marcher"], correctIndex: 2, pair: { kisakata: "Koyóka", francais: "Écouter / Comprendre", emoji: "👂" } },
    { type: "word-match", question: "Le préfixe de l'infinitif en Kisakata est...", options: ["Ma-", "Ki-", "Ko-", "Na-"], correctIndex: 2 },
  ],
  temps: [
    { type: "word-match", question: "« Lélo » signifie...", options: ["Demain", "Hier", "Aujourd'hui", "Nuit"], correctIndex: 2, pair: { kisakata: "Lélo", francais: "Aujourd'hui", emoji: "☀️" } },
    { type: "translation", question: "Comment dit-on « Nuit » en Kisakata ?", options: ["Mokóló", "Butú", "Siká", "Ntángo"], correctIndex: 1, pair: { kisakata: "Butú", francais: "Nuit", emoji: "🌃" } },
    { type: "word-match", question: "« Ntángo » veut dire...", options: ["Jour", "Nuit", "Temps / Moment", "Maintenant"], correctIndex: 2, pair: { kisakata: "Ntángo", francais: "Temps / Moment", emoji: "⏰" } },
    { type: "word-match", question: "Quel mot peut signifier à la fois 'demain' et 'hier' ?", options: ["Lélo", "Lóbí", "Siká", "Butú"], correctIndex: 1 },
  ],
  lieux: [
    { type: "word-match", question: "« Zámba » désigne...", options: ["Rivière", "Forêt", "Village", "Maison"], correctIndex: 1, pair: { kisakata: "Zámba", francais: "Forêt", emoji: "🌳" } },
    { type: "translation", question: "Comment dit-on « Rivière » en Kisakata ?", options: ["Zámba", "Mbóka", "Ebale", "Ndáko"], correctIndex: 2, pair: { kisakata: "Ebale", francais: "Rivière", emoji: "🌊" } },
    { type: "word-match", question: "« Ndáko » signifie...", options: ["Village", "Route", "Ciel", "Maison"], correctIndex: 3, pair: { kisakata: "Ndáko", francais: "Maison", emoji: "🏠" } },
    { type: "word-match", question: "« Likoló » veut dire...", options: ["Terre", "Ciel / En haut", "Eau", "Feu"], correctIndex: 1, pair: { kisakata: "Likoló", francais: "Ciel / En haut", emoji: "☁️" } },
  ],

  // === Lukenie ===
  proverbes: [
    { type: "word-match", question: "« Ebale eké mokémbá » — que signifie ce proverbe ?", options: ["La rivière est profonde", "La rivière n'oublie pas sa source", "L'eau coule toujours", "La rivière est belle"], correctIndex: 1 },
    { type: "translation", question: "« Nkókó akúfí, maloba maké » exprime...", options: ["L'ancêtre est mort, tout est fini", "L'ancêtre est parti, mais ses paroles restent", "L'ancêtre reviendra", "Les ancêtres sont nombreux"], correctIndex: 1 },
    { type: "word-match", question: "Quel proverbe parle d'union et de force collective ?", options: ["Ebale eké mokémbá", "Zámba íbale míbalé", "Lobóko lókó loké kolála", "Mái ma mbúla maké kosíla"], correctIndex: 2 },
    { type: "word-match", question: "« Mái ma mbúla maké kosíla » — quel est le message ?", options: ["La pluie est forte", "L'eau de pluie ne finit jamais (la connaissance est infinie)", "La pluie détruit tout", "L'eau est précieuse"], correctIndex: 1 },
  ],
  recits: [
    { type: "word-match", question: "Comment dit-on « Il était une fois » en Kisakata ?", options: ["Mókó", "Kala kala", "Lisapo", "Ekosíla"], correctIndex: 1, pair: { kisakata: "Kala kala", francais: "Il était une fois", emoji: "📖" } },
    { type: "translation", question: "La réponse rituelle de l'auditoire pendant un conte est...", options: ["Mbóte", "Mókó", "Tókó", "Lóbí"], correctIndex: 1, pair: { kisakata: "Mókó", francais: "Oui, j'écoute", emoji: "👂" } },
    { type: "word-match", question: "« Ekosíla » signifie...", options: ["Commencement", "Milieu du conte", "C'est fini (fin du conte)", "Le héros"], correctIndex: 2, pair: { kisakata: "Ekosíla", francais: "C'est fini", emoji: "🏁" } },
    { type: "word-match", question: "« Lisapo » c'est...", options: ["Chant", "Proverbe", "Conte / Histoire", "Danse"], correctIndex: 2, pair: { kisakata: "Lisapo", francais: "Conte / Histoire", emoji: "📚" } },
  ],
  chant: [
    { type: "word-match", question: "« Loyémbo » signifie...", options: ["Danse", "Chant / Chanson", "Tambour", "Amour"], correctIndex: 1, pair: { kisakata: "Loyémbo", francais: "Chant / Chanson", emoji: "🎵" } },
    { type: "translation", question: "Comment dit-on « Tambour » en Kisakata ?", options: ["Loyémbo", "Mabína", "Ngóma", "Bosémbo"], correctIndex: 2, pair: { kisakata: "Ngóma", francais: "Tam-tam / Tambour", emoji: "🥁" } },
    { type: "word-match", question: "« Mabína » c'est...", options: ["Chant", "Joie", "Danse", "Amour"], correctIndex: 2, pair: { kisakata: "Mabína", francais: "Danse", emoji: "💃" } },
    { type: "word-match", question: "« Bosémbo » exprime...", options: ["Tristesse", "Colère", "Joie / Bonheur", "Peur"], correctIndex: 2, pair: { kisakata: "Bosémbo", francais: "Joie / Bonheur", emoji: "😊" } },
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
