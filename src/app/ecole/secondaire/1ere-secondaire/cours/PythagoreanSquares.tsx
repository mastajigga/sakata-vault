"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PythagoreanSquares() {
  const [sideA, setSideA] = useState(3);
  const [sideB, setSideB] = useState(4);

  // Calculate hypotenuse
  const sideC = Math.sqrt(sideA * sideA + sideB * sideB);

  const svgWidth = 500;
  const svgHeight = 400;
  const scale = 25; // pixels per unit

  // Triangle vertices
  const A = { x: 150, y: 320 };
  const B = { x: 150 + sideB * scale, y: 320 };
  const C = { x: 150, y: 320 - sideA * scale };

  // Right angle indicator
  const rightAngleSize = 15;

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
            Théorème de Pythagore — Visualisation
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            a² + b² = c² — La somme des aires des carrés sur les cathètes égale l'aire du carré sur l'hypoténuse
          </p>
        </div>

        {/* SVG Canvas */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-4">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="border border-[rgba(196,160,53,0.15)]">
            {/* Grid background */}
            {Array.from({ length: 20 }).map((_, i) => {
              const x = i * 25;
              return (
                <line key={`vgrid-${i}`} x1={x} y1="0" x2={x} y2={svgHeight} stroke="rgba(196,160,53,0.05)" strokeWidth="1" />
              );
            })}
            {Array.from({ length: 16 }).map((_, i) => {
              const y = i * 25;
              return (
                <line key={`hgrid-${i}`} x1="0" y1={y} x2={svgWidth} y2={y} stroke="rgba(196,160,53,0.05)" strokeWidth="1" />
              );
            })}

            {/* Triangle */}
            <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0 }} viewport={{ once: true }}>
              {/* Triangle sides */}
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--or-ancestral)" strokeWidth="2.5" />
              <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="var(--or-ancestral)" strokeWidth="2.5" />
              <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} stroke="var(--or-ancestral)" strokeWidth="2.5" />

              {/* Right angle indicator */}
              <rect
                x={A.x}
                y={A.y - rightAngleSize}
                width={rightAngleSize}
                height={rightAngleSize}
                fill="none"
                stroke="var(--or-ancestral)"
                strokeWidth="1.5"
              />

              {/* Vertex labels */}
              <text x={A.x - 15} y={A.y + 18} fontSize="14" fontWeight="bold" fill="var(--or-ancestral)">
                A
              </text>
              <text x={B.x + 8} y={B.y + 18} fontSize="14" fontWeight="bold" fill="var(--or-ancestral)">
                B
              </text>
              <text x={C.x - 15} y={C.y - 10} fontSize="14" fontWeight="bold" fill="var(--or-ancestral)">
                C
              </text>

              {/* Side labels */}
              <text x={A.x - 30} y={A.y - sideA * scale / 2} fontSize="11" fill="var(--or-ancestral)" fontFamily="Geist Mono">
                a = {sideA}
              </text>
              <text x={A.x + sideB * scale / 2} y={A.y + 18} fontSize="11" fill="var(--or-ancestral)" fontFamily="Geist Mono" textAnchor="middle">
                b = {sideB}
              </text>
              <text x={B.x / 2 + C.x / 2 + 20} y={A.y / 2 + C.y / 2} fontSize="11" fill="var(--or-ancestral)" fontFamily="Geist Mono">
                c = {sideC.toFixed(2)}
              </text>
            </motion.g>

            {/* Square on side a (vertical) */}
            <motion.g initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
              <rect
                x={A.x - sideA * scale}
                y={A.y - sideA * scale}
                width={sideA * scale}
                height={sideA * scale}
                fill="rgba(77, 208, 225, 0.2)"
                stroke="#4dd0e1"
                strokeWidth="2"
              />
              <text
                x={A.x - sideA * scale / 2}
                y={A.y - sideA * scale / 2 + 5}
                fontSize="13"
                fontWeight="bold"
                fill="#4dd0e1"
                fontFamily="Geist Mono"
                textAnchor="middle"
              >
                a²={(sideA * sideA).toFixed(0)}
              </text>
            </motion.g>

            {/* Square on side b (horizontal) */}
            <motion.g initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
              <rect
                x={B.x}
                y={B.y}
                width={sideB * scale}
                height={sideB * scale}
                fill="rgba(179, 157, 219, 0.2)"
                stroke="#b39ddb"
                strokeWidth="2"
              />
              <text
                x={B.x + sideB * scale / 2}
                y={B.y + sideB * scale / 2 + 5}
                fontSize="13"
                fontWeight="bold"
                fill="#b39ddb"
                fontFamily="Geist Mono"
                textAnchor="middle"
              >
                b²={(sideB * sideB).toFixed(0)}
              </text>
            </motion.g>

            {/* Square on side c (hypotenuse) */}
            <motion.g initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.5 }} viewport={{ once: true }}>
              {/* This is trickier — we need to rotate a square around the hypotenuse */}
              <g
                transform={`translate(${B.x},${C.y}) rotate(${Math.atan2(A.y - C.y, B.x - C.x) * (180 / Math.PI)})`}
              >
                <rect
                  x="0"
                  y="0"
                  width={sideC * scale}
                  height={sideC * scale}
                  fill="rgba(129, 199, 132, 0.2)"
                  stroke="#81c784"
                  strokeWidth="2"
                />
                <text
                  x={sideC * scale / 2}
                  y={sideC * scale / 2 + 5}
                  fontSize="13"
                  fontWeight="bold"
                  fill="#81c784"
                  fontFamily="Geist Mono"
                  textAnchor="middle"
                >
                  c²={(sideC * sideC).toFixed(0)}
                </text>
              </g>
            </motion.g>
          </svg>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          {/* Side a */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Cathète a (vertical)
              </label>
              <span className="text-sm font-bold text-[#4dd0e1]">{sideA}</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={sideA}
              onChange={(e) => setSideA(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(77,208,225,0.2)] rounded-lg appearance-none cursor-pointer accent-[#4dd0e1]"
            />
          </div>

          {/* Side b */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Cathète b (horizontal)
              </label>
              <span className="text-sm font-bold text-[#b39ddb]">{sideB}</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={sideB}
              onChange={(e) => setSideB(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(179,157,219,0.2)] rounded-lg appearance-none cursor-pointer accent-[#b39ddb]"
            />
          </div>
        </div>

        {/* Formula display */}
        <motion.div
          key={`${sideA}-${sideB}`}
          className="bg-[rgba(196,160,53,0.1)] rounded-lg p-4 border border-[rgba(196,160,53,0.2)]"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <p className="font-geist-mono text-sm text-[var(--ivoire-ancien)] mb-3">
            a² + b² = c²
          </p>
          <p className="font-geist-mono text-sm text-[rgba(212,221,215,0.8)]">
            {(sideA * sideA).toFixed(0)} + {(sideB * sideB).toFixed(0)} = {(sideC * sideC).toFixed(2)}
          </p>
          <p className="font-geist-mono text-sm text-[rgba(212,221,215,0.8)]">
            c = √{(sideC * sideC).toFixed(2)} = {sideC.toFixed(3)}
          </p>
        </motion.div>

        {/* Triplet check */}
        {Math.abs(sideC - Math.round(sideC)) < 0.01 && (
          <motion.div
            className="bg-[rgba(129,199,132,0.1)] rounded-lg p-3 border border-[rgba(129,199,132,0.3)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-[#81c784] font-geist-mono">
              ✓ Triplet pythagoricien: ({sideA.toFixed(0)}, {sideB.toFixed(0)}, {Math.round(sideC)})
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
