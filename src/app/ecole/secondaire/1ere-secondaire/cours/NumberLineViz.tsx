"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NumberLineViz() {
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [startNum, setStartNum] = useState(3);
  const [operandNum, setOperandNum] = useState(5);

  const result = operation === "add" ? startNum + operandNum : startNum - operandNum;
  const maxNum = Math.max(result, 15);

  const svgWidth = 600;
  const svgHeight = 200;
  const startY = 100;
  const padding = 40;
  const availableWidth = svgWidth - 2 * padding;

  // Scale factor to fit numbers on line
  const scale = availableWidth / maxNum;

  // Calculate positions
  const startX = padding + startNum * scale;
  const endX = padding + result * scale;
  const arrowLength = Math.abs(endX - startX);

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
            Droite des nombres — Sauts et déplacements
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Visualisez l'addition et la soustraction comme des sauts sur une droite
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] block mb-2">
              Opération
            </label>
            <div className="flex gap-2">
              {["add", "subtract"].map((op) => (
                <button
                  key={op}
                  onClick={() => setOperation(op as typeof operation)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    operation === op
                      ? "bg-[rgba(196,160,53,0.3)] text-[var(--or-ancestral)] border border-[rgba(196,160,53,0.5)]"
                      : "bg-[rgba(212,221,215,0.08)] text-[rgba(212,221,215,0.65)] border border-[rgba(212,221,215,0.15)]"
                  }`}
                >
                  {op === "add" ? "Addition" : "Soustraction"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] block mb-2">
              Nombre de départ: {startNum}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={startNum}
              onChange={(e) => setStartNum(parseInt(e.target.value))}
              className="w-32 h-2 rounded-lg appearance-none bg-[rgba(212,221,215,0.2)] cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] block mb-2">
              Opérande: {operandNum}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={operandNum}
              onChange={(e) => setOperandNum(parseInt(e.target.value))}
              className="w-32 h-2 rounded-lg appearance-none bg-[rgba(212,221,215,0.2)] cursor-pointer"
            />
          </div>
        </div>

        {/* SVG Canvas */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-4">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="border border-[rgba(196,160,53,0.15)]"
          >
            {/* Number line */}
            <line
              x1={padding}
              y1={startY}
              x2={svgWidth - padding}
              y2={startY}
              stroke="rgba(212,221,215,0.3)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Tick marks and numbers */}
            {Array.from({ length: maxNum + 1 }).map((_, i) => {
              const x = padding + i * scale;
              const isStartOrEnd = i === startNum || i === result;
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={startY - 8}
                    x2={x}
                    y2={startY + 8}
                    stroke={isStartOrEnd ? "var(--or-ancestral)" : "rgba(212,221,215,0.3)"}
                    strokeWidth={isStartOrEnd ? "2" : "1"}
                  />
                  {i % 2 === 0 && (
                    <text
                      x={x}
                      y={startY + 25}
                      textAnchor="middle"
                      fill="rgba(212,221,215,0.6)"
                      fontSize="12"
                      className="font-mono"
                    >
                      {i}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Starting position indicator */}
            <motion.circle
              cx={startX}
              cy={startY}
              r="6"
              fill="rgba(196,160,53,0.8)"
              stroke="var(--or-ancestral)"
              strokeWidth="2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            />

            {/* Jump arrow */}
            <motion.g
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Arrow shaft */}
              <line
                x1={Math.min(startX, endX)}
                y1={startY - 40}
                x2={Math.max(startX, endX)}
                y2={startY - 40}
                stroke="var(--or-ancestral)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Arrowhead */}
              <polygon
                points={
                  endX > startX
                    ? `${endX},${startY - 40} ${endX - 8},${startY - 35} ${endX - 8},${startY - 45}`
                    : `${endX},${startY - 40} ${endX + 8},${startY - 35} ${endX + 8},${startY - 45}`
                }
                fill="var(--or-ancestral)"
              />

              {/* Operation label */}
              <text
                x={(startX + endX) / 2}
                y={startY - 50}
                textAnchor="middle"
                fill="var(--or-ancestral)"
                fontSize="14"
                fontWeight="bold"
                className="font-outfit"
              >
                {operation === "add" ? "+" : "−"} {operandNum}
              </text>
            </motion.g>

            {/* Result position indicator */}
            <motion.circle
              cx={endX}
              cy={startY}
              r="6"
              fill="rgba(196,160,53,0.4)"
              stroke="var(--or-ancestral)"
              strokeWidth="2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            />

            {/* Result label */}
            <motion.text
              x={endX}
              y={startY + 50}
              textAnchor="middle"
              fill="var(--or-ancestral)"
              fontSize="16"
              fontWeight="bold"
              className="font-outfit"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Résultat: {result}
            </motion.text>
          </svg>
        </div>

        {/* Explanation */}
        <div className="bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.2)] rounded-lg p-4">
          <p className="text-sm text-[rgba(212,221,215,0.75)]">
            <span className="font-semibold text-[var(--or-ancestral)]">
              {startNum} {operation === "add" ? "+" : "−"} {operandNum} = {result}
            </span>
            {" "}— Nous commençons à {startNum} et faisons un saut de {operandNum} {operation === "add" ? "vers la droite" : "vers la gauche"}.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
