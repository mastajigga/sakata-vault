"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MathExpression from "@/app/ecole/components/MathExpression";

type BalanceStep = "initial" | "isolating" | "solved";

interface BalanceVisualizationProps {
  equation?: string;
  steps?: {
    label: string;
    leftLabel: string;
    rightLabel: string;
    angle: number;
  }[];
}

const DEFAULT_STEPS = [
  {
    label: "État initial",
    leftLabel: "x + 3",
    rightLabel: "15",
    angle: -8,
  },
  {
    label: "On soustrait 3 des deux côtés",
    leftLabel: "x",
    rightLabel: "15 − 3",
    angle: 0,
  },
  {
    label: "Solution trouvée",
    leftLabel: "x = 12",
    rightLabel: "12",
    angle: 0,
  },
];

export default function BalanceVisualization({
  equation = "x + 3 = 15",
  steps = DEFAULT_STEPS,
}: BalanceVisualizationProps) {
  const [step, setStep] = useState<number>(0);

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  const beamAngle = currentStep.angle;
  const leftY = beamAngle < 0 ? 10 : beamAngle > 0 ? -10 : 0;
  const rightY = beamAngle < 0 ? -10 : beamAngle > 0 ? 10 : 0;

  return (
    <div className="rounded-[1.8rem] border border-[rgba(212,221,215,0.1)] bg-[rgba(4,17,13,0.55)] p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--amber-light)]">
        Visualisation interactive
      </p>

      <div className="mt-4 flex justify-center">
        <MathExpression expression={equation} displayMode />
      </div>

      {/* SVG Balance */}
      <div className="mt-6 flex justify-center">
        <svg
          viewBox="0 0 360 220"
          className="w-full max-w-sm"
          aria-label="Balance représentant une équation"
        >
          {/* Pivot post */}
          <line
            x1="180" y1="30" x2="180" y2="160"
            stroke="rgba(212,221,215,0.3)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Pivot circle */}
          <circle cx="180" cy="155" r="8" fill="rgba(196,160,53,0.4)" stroke="rgba(196,160,53,0.6)" strokeWidth="1.5" />

          {/* Beam — rotates around pivot */}
          <motion.g
            style={{ originX: "180px", originY: "155px" }}
            animate={{ rotate: beamAngle }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
          >
            <line
              x1="50" y1="155" x2="310" y2="155"
              stroke="rgba(212,221,215,0.5)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Left suspension string */}
            <line x1="80" y1="155" x2="80" y2="175" stroke="rgba(212,221,215,0.35)" strokeWidth="1.5" />

            {/* Right suspension string */}
            <line x1="280" y1="155" x2="280" y2="175" stroke="rgba(212,221,215,0.35)" strokeWidth="1.5" />
          </motion.g>

          {/* Left pan (moves with beam angle) */}
          <motion.g
            animate={{ y: leftY }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
          >
            <ellipse
              cx="80" cy="188" rx="38" ry="9"
              fill="rgba(196,160,53,0.12)"
              stroke="rgba(196,160,53,0.35)"
              strokeWidth="1.5"
            />
            <text
              x="80" y="185"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(240,237,229,0.9)"
              fontSize="12"
              fontFamily="'Geist Mono', monospace"
            >
              {currentStep.leftLabel}
            </text>
          </motion.g>

          {/* Right pan */}
          <motion.g
            animate={{ y: rightY }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
          >
            <ellipse
              cx="280" cy="188" rx="38" ry="9"
              fill="rgba(196,160,53,0.12)"
              stroke="rgba(196,160,53,0.35)"
              strokeWidth="1.5"
            />
            <text
              x="280" y="185"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(240,237,229,0.9)"
              fontSize="12"
              fontFamily="'Geist Mono', monospace"
            >
              {currentStep.rightLabel}
            </text>
          </motion.g>

          {/* Base */}
          <rect x="155" y="195" width="50" height="8" rx="4" fill="rgba(212,221,215,0.15)" />
        </svg>
      </div>

      {/* Step label */}
      <motion.p
        key={step}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center text-sm text-[rgba(212,221,215,0.7)]"
      >
        {currentStep.label}
      </motion.p>

      {/* Step indicator dots */}
      <div className="mt-4 flex justify-center gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === step ? "24px" : "8px",
              background:
                i === step
                  ? "var(--or-ancestral)"
                  : "rgba(212,221,215,0.2)",
            }}
            aria-label={`Étape ${i + 1}`}
          />
        ))}
      </div>

      {/* Next button */}
      <div className="mt-5 flex justify-center">
        {!isLast ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="rounded-full border border-[rgba(196,160,53,0.3)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--or-ancestral)] transition-all duration-200 hover:bg-[rgba(196,160,53,0.1)] active:scale-95"
          >
            Étape suivante →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded-full border border-[rgba(212,221,215,0.15)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(212,221,215,0.5)] transition-all duration-200 hover:border-[rgba(212,221,215,0.3)] active:scale-95"
          >
            Recommencer
          </button>
        )}
      </div>
    </div>
  );
}
