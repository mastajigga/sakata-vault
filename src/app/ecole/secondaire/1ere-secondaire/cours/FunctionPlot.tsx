"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function FunctionPlot() {
  const [a, setA] = useState(1.5); // slope
  const [b, setB] = useState(2); // y-intercept
  const svgRef = useRef<SVGSVGElement>(null);

  const canvasSize = 400;
  const gridSpacing = 40;
  const origin = canvasSize / 2;

  // Calculate points on the line y = ax + b
  const getY = (x: number) => a * x + b;

  // Canvas coordinates to SVG coordinates
  const toSvg = (x: number, y: number) => ({
    sx: origin + x * gridSpacing,
    sy: origin - y * gridSpacing, // SVG y-axis is inverted
  });

  // Generate line path from x = -5 to x = 5
  const xStart = -5;
  const xEnd = 5;
  const p1 = toSvg(xStart, getY(xStart));
  const p2 = toSvg(xEnd, getY(xEnd));
  const linePath = `M ${p1.sx} ${p1.sy} L ${p2.sx} ${p2.sy}`;

  // Key points to display on the line
  const keyPoints = [
    { x: 0, label: `(0, ${b.toFixed(1)})` },
    { x: 1, label: `(1, ${getY(1).toFixed(1)})` },
    { x: -1, label: `(-1, ${getY(-1).toFixed(1)})` },
  ].filter((p) => p.x >= xStart && p.x <= xEnd);

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
            Fonction affine: y = ax + b
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Ajuste les sliders pour voir comment le graphe change
          </p>
        </div>

        {/* SVG Canvas */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-4">
          <svg
            ref={svgRef}
            width={canvasSize}
            height={canvasSize}
            viewBox={`0 0 ${canvasSize} ${canvasSize}`}
            className="border border-[rgba(196,160,53,0.15)]"
          >
            {/* Grid lines */}
            {Array.from({ length: 11 }).map((_, i) => {
              const pos = i * gridSpacing;
              return (
                <g key={`grid-${i}`} stroke="rgba(196,160,53,0.1)" strokeWidth="1">
                  <line x1={pos} y1="0" x2={pos} y2={canvasSize} />
                  <line x1="0" y1={pos} x2={canvasSize} y2={pos} />
                </g>
              );
            })}

            {/* Axes */}
            <line
              x1={origin}
              y1="0"
              x2={origin}
              y2={canvasSize}
              stroke="rgba(196,160,53,0.4)"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1={origin}
              x2={canvasSize}
              y2={origin}
              stroke="rgba(196,160,53,0.4)"
              strokeWidth="2"
            />

            {/* Axis labels */}
            <text
              x={origin + gridSpacing * 4.5}
              y={origin + 20}
              fontSize="12"
              fill="rgba(196,160,53,0.6)"
            >
              x
            </text>
            <text
              x={origin - 20}
              y={20}
              fontSize="12"
              fill="rgba(196,160,53,0.6)"
            >
              y
            </text>

            {/* Function line */}
            <motion.path
              d={linePath}
              stroke="var(--or-ancestral)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />

            {/* Key points */}
            {keyPoints.map((point) => {
              const { sx, sy } = toSvg(point.x, getY(point.x));
              return (
                <g key={point.label}>
                  <motion.circle
                    cx={sx}
                    cy={sy}
                    r="5"
                    fill="var(--or-ancestral)"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  />
                  <text
                    x={sx + 12}
                    y={sy - 8}
                    fontSize="11"
                    fill="var(--ivoire-ancien)"
                    fontFamily="Geist Mono"
                  >
                    {point.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          {/* Slope slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Pente (a)
              </label>
              <span className="text-sm font-bold text-[var(--or-ancestral)]">
                {a.toFixed(2)}
              </span>
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
              {a > 0 ? "Fonction croissante" : a < 0 ? "Fonction décroissante" : "Droite horizontale"}
            </p>
          </div>

          {/* Y-intercept slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Ordonnée à l'origine (b)
              </label>
              <span className="text-sm font-bold text-[var(--or-ancestral)]">
                {b.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.1"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(196,160,53,0.2)] rounded-lg appearance-none cursor-pointer accent-[var(--or-ancestral)]"
            />
            <p className="text-xs text-[rgba(212,221,215,0.5)] mt-1">
              La droite croise l'axe y au point (0, {b.toFixed(1)})
            </p>
          </div>
        </div>

        {/* Equation display */}
        <div className="bg-[rgba(196,160,53,0.1)] rounded-lg p-4 border border-[rgba(196,160,53,0.2)]">
          <p className="font-geist-mono text-sm text-[var(--ivoire-ancien)]">
            y = {a > 0 && a !== 1 ? "" : a === 1 ? "" : a === -1 ? "−" : a.toFixed(2)}
            {a === 1 ? "x" : a === -1 ? "x" : `${a.toFixed(2)}x`}
            {b > 0 ? " + " : " − "}
            {Math.abs(b).toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
