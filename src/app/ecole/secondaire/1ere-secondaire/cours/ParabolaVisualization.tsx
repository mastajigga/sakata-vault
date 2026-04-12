"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ParabolaVisualization() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);

  // Calculate discriminant
  const delta = b * b - 4 * a * c;

  // Calculate roots if they exist
  let roots: number[] = [];
  if (delta >= 0) {
    const root1 = (-b + Math.sqrt(delta)) / (2 * a);
    const root2 = (-b - Math.sqrt(delta)) / (2 * a);
    roots = [root1, root2].sort((x, y) => x - y);
  }

  // Vertex x-coordinate
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  const svgWidth = 440;
  const svgHeight = 380;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const scale = 30; // pixels per unit

  // Helper to convert graph coords to SVG
  const toSvg = (x: number, y: number) => ({
    x: centerX + x * scale,
    y: centerY - y * scale,
  });

  // Generate parabola path
  let parabolaPath = "";
  for (let x = -4; x <= 4; x += 0.1) {
    const y = a * x * x + b * x + c;
    const svg = toSvg(x, y);
    parabolaPath += (x === -4 ? "M" : "L") + ` ${svg.x} ${svg.y}`;
  }

  // Determine discriminant status
  const deltaStatus = delta > 0 ? "positive" : delta === 0 ? "zero" : "negative";

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
            Paraboles — Équations du 2nd degré
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Le discriminant Δ = b² − 4ac détermine si la parabole croise l'axe x
          </p>
        </div>

        {/* SVG Canvas */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-4">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="border border-[rgba(196,160,53,0.15)]"
          >
            {/* Grid */}
            {Array.from({ length: 9 }).map((_, i) => {
              const pos = centerX + (i - 4) * scale;
              return (
                <g key={`grid-${i}`} stroke="rgba(196,160,53,0.1)" strokeWidth="1">
                  <line x1={pos} y1="0" x2={pos} y2={svgHeight} />
                  <line x1="0" y1={centerY + (i - 4) * scale} x2={svgWidth} y2={centerY + (i - 4) * scale} />
                </g>
              );
            })}

            {/* Axes */}
            <line x1={centerX} y1="0" x2={centerX} y2={svgHeight} stroke="rgba(196,160,53,0.4)" strokeWidth="2" />
            <line x1="0" y1={centerY} x2={svgWidth} y2={centerY} stroke="rgba(196,160,53,0.4)" strokeWidth="2" />

            {/* Axis labels */}
            <text x={svgWidth - 20} y={centerY + 20} fontSize="12" fill="rgba(196,160,53,0.6)">
              x
            </text>
            <text x={centerX - 20} y={20} fontSize="12" fill="rgba(196,160,53,0.6)">
              y
            </text>

            {/* Parabola */}
            <motion.path
              d={parabolaPath}
              stroke="var(--or-ancestral)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />

            {/* Vertex */}
            <motion.circle
              cx={toSvg(vertexX, vertexY).x}
              cy={toSvg(vertexX, vertexY).y}
              r="5"
              fill="var(--or-ancestral)"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            />

            {/* Roots (if they exist) */}
            {roots.map((root, idx) => {
              const svg = toSvg(root, 0);
              return (
                <motion.g key={`root-${idx}`}>
                  <circle
                    cx={svg.x}
                    cy={svg.y}
                    r="6"
                    fill={deltaStatus === "positive" ? "#81c784" : deltaStatus === "zero" ? "#ffb74d" : "transparent"}
                    stroke={
                      deltaStatus === "positive" ? "#81c784" : deltaStatus === "zero" ? "#ffb74d" : "transparent"
                    }
                    strokeWidth="2"
                  />
                  <motion.text
                    x={svg.x}
                    y={svg.y - 15}
                    fontSize="11"
                    fill="var(--ivoire-ancien)"
                    fontFamily="Geist Mono"
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    x = {root.toFixed(2)}
                  </motion.text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Coefficient sliders */}
        <div className="space-y-4">
          {/* a slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Coefficient a
              </label>
              <span className="text-sm font-bold text-[var(--or-ancestral)]">{a.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
            />
            <p className="text-xs text-[rgba(212,221,215,0.5)] mt-1">
              {a > 0 ? "Parabole ouvre vers le haut ⬆" : "Parabole ouvre vers le bas ⬇"}
            </p>
          </div>

          {/* b slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Coefficient b
              </label>
              <span className="text-sm font-bold text-[var(--or-ancestral)]">{b.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
            />
          </div>

          {/* c slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Coefficient c
              </label>
              <span className="text-sm font-bold text-[var(--or-ancestral)]">{c.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
            />
          </div>
        </div>

        {/* Discriminant info */}
        <motion.div
          key={delta}
          className={`rounded-lg p-4 border ${
            deltaStatus === "positive"
              ? "bg-[rgba(129,199,132,0.1)] border-[rgba(129,199,132,0.3)]"
              : deltaStatus === "zero"
              ? "bg-[rgba(255,183,77,0.1)] border-[rgba(255,183,77,0.3)]"
              : "bg-[rgba(239,83,80,0.1)] border-[rgba(239,83,80,0.3)]"
          }`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <p className="font-geist-mono text-sm text-[var(--ivoire-ancien)] mb-2">
            Δ = b² − 4ac = {b}² − 4×{a}×{c} = {delta.toFixed(2)}
          </p>
          <p className={`text-sm font-geist-mono ${
            deltaStatus === "positive"
              ? "text-[#81c784]"
              : deltaStatus === "zero"
              ? "text-[#ffb74d]"
              : "text-[#ef5350]"
          }`}>
            {deltaStatus === "positive"
              ? `✓ Δ > 0 : Deux solutions réelles distinctes (${roots.length} racines)`
              : deltaStatus === "zero"
              ? `✓ Δ = 0 : Une solution double (1 racine)`
              : `✗ Δ < 0 : Pas de solution réelle (0 racines)`}
          </p>
        </motion.div>

        {/* Equation display */}
        <div className="bg-[rgba(196,160,53,0.1)] rounded-lg p-4 border border-[rgba(196,160,53,0.2)]">
          <p className="font-geist-mono text-sm text-[var(--ivoire-ancien)]">
            {a.toFixed(2)}x² {b >= 0 ? "+" : "−"} {Math.abs(b).toFixed(2)}x {c >= 0 ? "+" : "−"} {Math.abs(c).toFixed(2)} = 0
          </p>
        </div>
      </div>
    </motion.div>
  );
}
