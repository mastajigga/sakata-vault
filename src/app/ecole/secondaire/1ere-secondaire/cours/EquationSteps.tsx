"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { label: "Équation initiale", eq: "2x + 5 = 13", expl: "On cherche la valeur de x." },
  { label: "Soustraire 5 des deux côtés", eq: "2x + 5 − 5 = 13 − 5", expl: "On garde l'équilibre en faisant la même opération des deux côtés." },
  { label: "Simplifier", eq: "2x = 8", expl: "5 − 5 = 0, donc il reste 2x à gauche." },
  { label: "Diviser par 2", eq: "x = 8 ÷ 2", expl: "On isole x en divisant les deux côtés par 2." },
  { label: "Solution", eq: "x = 4", expl: "Vérification : 2×4 + 5 = 8 + 5 = 13 ✓" },
];

export default function EquationSteps() {
  const [step, setStep] = useState(0);

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Résolution pas à pas</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-6">Chaque étape maintient l'équilibre des deux côtés</p>

      {/* Barre de progression */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-[var(--or-ancestral)]" : "bg-[rgba(196,160,53,0.15)]"}`}
          />
        ))}
      </div>

      {/* Étape courante */}
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-[rgba(196,160,53,0.25)] bg-[rgba(196,160,53,0.07)] p-6 mb-4"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--or-ancestral)] mb-3">
            Étape {step + 1} / {STEPS.length} — {STEPS[step].label}
          </p>
          <p className="font-mono text-2xl text-[var(--ivoire-ancien)] mb-4">{STEPS[step].eq}</p>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">{STEPS[step].expl}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="flex-1 rounded-xl border border-[rgba(212,221,215,0.12)] py-2 text-sm text-[rgba(212,221,215,0.6)] disabled:opacity-30 hover:border-[rgba(196,160,53,0.3)] transition-all">
          ← Précédent
        </button>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
          className="flex-1 rounded-xl bg-[rgba(196,160,53,0.12)] border border-[rgba(196,160,53,0.3)] py-2 text-sm text-[var(--or-ancestral)] disabled:opacity-30 hover:bg-[rgba(196,160,53,0.2)] transition-all">
          Étape suivante →
        </button>
      </div>
    </motion.div>
  );
}
