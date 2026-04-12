"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type FractionType = "half" | "third" | "quarter" | "custom";

export default function FractionCircle() {
  const [fractionType, setFractionType] = useState<FractionType>("quarter");
  const [customNumerator, setCustomNumerator] = useState(1);

  const fractionConfig = {
    half: { numerator: 1, denominator: 2, label: "Moitié" },
    third: { numerator: 1, denominator: 3, label: "Tiers" },
    quarter: { numerator: 1, denominator: 4, label: "Quart" },
    custom: { numerator: customNumerator, denominator: 8, label: "Personnalisé" },
  };

  const config = fractionConfig[fractionType];
  const slices = config.denominator;
  const filled = config.numerator;
  const sliceAngle = 360 / slices;

  const generateSlicePath = (index: number, radius: number, innerRadius: number): string => {
    const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);

    const x1 = 150 + radius * Math.cos(startAngle);
    const y1 = 150 + radius * Math.sin(startAngle);
    const x2 = 150 + radius * Math.cos(endAngle);
    const y2 = 150 + radius * Math.sin(endAngle);

    const x3 = 150 + innerRadius * Math.cos(endAngle);
    const y3 = 150 + innerRadius * Math.sin(endAngle);
    const x4 = 150 + innerRadius * Math.cos(startAngle);
    const y4 = 150 + innerRadius * Math.sin(startAngle);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  };

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h3 className="text-[1.2rem] font-outfit font-bold text-[var(--ivoire-ancien)] mb-2">
            Cercle de fractions — Parts et touts
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Les fractions divisent un tout en parts égales
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] block mb-3">
              Type de fraction
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(["half", "third", "quarter", "custom"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFractionType(type)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    fractionType === type
                      ? "bg-[rgba(196,160,53,0.3)] text-[var(--or-ancestral)] border border-[rgba(196,160,53,0.5)]"
                      : "bg-[rgba(212,221,215,0.08)] text-[rgba(212,221,215,0.65)] border border-[rgba(212,221,215,0.15)]"
                  }`}
                >
                  {type === "half" && "1/2"}
                  {type === "third" && "1/3"}
                  {type === "quarter" && "1/4"}
                  {type === "custom" && "Custom"}
                </button>
              ))}
            </div>
          </div>

          {fractionType === "custom" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] block mb-3">
                Numérateur: {customNumerator} / 8
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={customNumerator}
                onChange={(e) => setCustomNumerator(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-[rgba(212,221,215,0.2)] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-8">
          <svg width="300" height="300" viewBox="0 0 300 300" className="border border-[rgba(196,160,53,0.15)] rounded-lg">
            {/* Circle slices */}
            {Array.from({ length: slices }).map((_, i) => (
              <motion.path
                key={i}
                d={generateSlicePath(i, 120, 40)}
                fill={i < filled ? "rgba(196,160,53,0.5)" : "rgba(212,221,215,0.1)"}
                stroke="rgba(196,160,53,0.4)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              />
            ))}

            {/* Center circle */}
            <circle cx="150" cy="150" r="35" fill="rgba(20,44,35,0.8)" stroke="rgba(196,160,53,0.4)" strokeWidth="2" />

            {/* Fraction text in center */}
            <motion.text
              x="150"
              y="145"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill="var(--or-ancestral)"
              className="font-outfit"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {filled}
            </motion.text>
            <line x1="140" y1="155" x2="160" y2="155" stroke="var(--or-ancestral)" strokeWidth="1.5" />
            <motion.text
              x="150"
              y="170"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill="var(--or-ancestral)"
              className="font-outfit"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {slices}
            </motion.text>
          </svg>
        </div>

        {/* Explanation */}
        <div className="bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.2)] rounded-lg p-4">
          <div className="space-y-2">
            <p className="text-sm text-[rgba(212,221,215,0.75)]">
              <span className="font-semibold text-[var(--or-ancestral)]">
                {filled}/{slices} {config.label}
              </span>
            </p>
            <p className="text-xs text-[rgba(212,221,215,0.65)]">
              Le cercle est divisé en {slices} parts égales. {filled} partie{filled > 1 ? "s" : ""} {filled > 1 ? "sont" : "est"} coloriée{filled > 1 ? "s" : ""}.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
