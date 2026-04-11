"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type HighlightMode = "none" | "A" | "B" | "intersection" | "union";

interface VennVisualizationProps {
  setA?: { label: string; elements: string[] };
  setB?: { label: string; elements: string[] };
  intersection?: string[];
}

const DEFAULT_SET_A = {
  label: "Lundi",
  elements: ["capitaine", "tilapia", "silure"],
};
const DEFAULT_SET_B = {
  label: "Mercredi",
  elements: ["tilapia", "carpe", "silure"],
};
const DEFAULT_INTERSECTION = ["tilapia", "silure"];

const MODES: { mode: HighlightMode; label: string }[] = [
  { mode: "A", label: "Ensemble A" },
  { mode: "B", label: "Ensemble B" },
  { mode: "intersection", label: "Intersection A∩B" },
  { mode: "union", label: "Union A∪B" },
];

export default function VennVisualization({
  setA = DEFAULT_SET_A,
  setB = DEFAULT_SET_B,
  intersection = DEFAULT_INTERSECTION,
}: VennVisualizationProps) {
  const [mode, setMode] = useState<HighlightMode>("none");

  const fillA = mode === "A" || mode === "union" ? 0.28 : 0;
  const fillB = mode === "B" || mode === "union" ? 0.28 : 0;
  const fillIntersection = mode === "intersection" || mode === "union" ? 0.42 : 0;

  const onlyA = setA.elements.filter((e) => !intersection.includes(e));
  const onlyB = setB.elements.filter((e) => !intersection.includes(e));

  return (
    <div className="rounded-[1.8rem] border border-[rgba(212,221,215,0.1)] bg-[rgba(4,17,13,0.55)] p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--amber-light)]">
        Diagramme de Venn
      </p>

      {/* SVG Venn */}
      <div className="mt-5 flex justify-center">
        <svg
          viewBox="0 0 340 200"
          className="w-full max-w-sm"
          aria-label="Diagramme de Venn"
        >
          {/* Set A fill */}
          <motion.ellipse
            cx="130" cy="100" rx="100" ry="70"
            fill="rgba(196,160,53,1)"
            animate={{ fillOpacity: fillA }}
            transition={{ duration: 0.35 }}
          />
          {/* Set B fill */}
          <motion.ellipse
            cx="210" cy="100" rx="100" ry="70"
            fill="rgba(196,160,53,1)"
            animate={{ fillOpacity: fillB }}
            transition={{ duration: 0.35 }}
          />

          {/* Intersection fill — drawn on top for highlight */}
          <motion.path
            d="M 170,38 A 100,70 0 0,1 170,162 A 100,70 0 0,1 170,38"
            fill="rgba(196,160,53,1)"
            animate={{ fillOpacity: fillIntersection }}
            transition={{ duration: 0.35 }}
          />

          {/* Set A border */}
          <ellipse
            cx="130" cy="100" rx="100" ry="70"
            fill="none"
            stroke="rgba(196,160,53,0.5)"
            strokeWidth="1.5"
          />
          {/* Set B border */}
          <ellipse
            cx="210" cy="100" rx="100" ry="70"
            fill="none"
            stroke="rgba(196,160,53,0.5)"
            strokeWidth="1.5"
          />

          {/* Label A */}
          <text
            x="90" y="30"
            textAnchor="middle"
            fill="rgba(196,160,53,0.9)"
            fontSize="11"
            fontFamily="'Outfit', sans-serif"
            fontWeight="600"
          >
            {setA.label}
          </text>

          {/* Label B */}
          <text
            x="250" y="30"
            textAnchor="middle"
            fill="rgba(196,160,53,0.9)"
            fontSize="11"
            fontFamily="'Outfit', sans-serif"
            fontWeight="600"
          >
            {setB.label}
          </text>

          {/* Only A elements */}
          {onlyA.map((el, i) => (
            <text
              key={el}
              x="95" y={78 + i * 18}
              textAnchor="middle"
              fill="rgba(240,237,229,0.72)"
              fontSize="10"
              fontFamily="'Geist Mono', monospace"
            >
              {el}
            </text>
          ))}

          {/* Intersection elements */}
          {intersection.map((el, i) => (
            <text
              key={el}
              x="170" y={90 + i * 18}
              textAnchor="middle"
              fill="rgba(240,237,229,0.85)"
              fontSize="10"
              fontFamily="'Geist Mono', monospace"
              fontWeight="600"
            >
              {el}
            </text>
          ))}

          {/* Only B elements */}
          {onlyB.map((el, i) => (
            <text
              key={el}
              x="245" y={78 + i * 18}
              textAnchor="middle"
              fill="rgba(240,237,229,0.72)"
              fontSize="10"
              fontFamily="'Geist Mono', monospace"
            >
              {el}
            </text>
          ))}
        </svg>
      </div>

      {/* Mode buttons */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {MODES.map(({ mode: m, label }) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode((prev) => (prev === m ? "none" : m))}
            className="rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95"
            style={{
              borderColor:
                mode === m
                  ? "rgba(196,160,53,0.5)"
                  : "rgba(212,221,215,0.12)",
              background:
                mode === m ? "rgba(196,160,53,0.15)" : "rgba(4,17,13,0.5)",
              color: mode === m ? "var(--or-ancestral)" : "rgba(212,221,215,0.6)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Description */}
      {mode !== "none" ? (
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-xs leading-6 text-[rgba(212,221,215,0.65)]"
        >
          {mode === "A" && `A = { ${setA.elements.join(", ")} } — ${setA.elements.length} éléments`}
          {mode === "B" && `B = { ${setB.elements.join(", ")} } — ${setB.elements.length} éléments`}
          {mode === "intersection" &&
            `A∩B = { ${intersection.join(", ")} } — ${intersection.length} éléments communs`}
          {mode === "union" &&
            `A∪B = { ${[...new Set([...setA.elements, ...setB.elements])].join(", ")} }`}
        </motion.p>
      ) : null}
    </div>
  );
}
