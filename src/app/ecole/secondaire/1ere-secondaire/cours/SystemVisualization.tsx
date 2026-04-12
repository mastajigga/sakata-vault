"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function SystemVisualization() {
  const [showIntersection, setShowIntersection] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const canvasSize = 400;
  const gridSpacing = 40;
  const origin = canvasSize / 2;

  // System: x + y = 10 (line 1) and x - y = 2 (line 2)
  // From x + y = 10: y = 10 - x
  // From x - y = 2: y = x - 2
  // Intersection: x + y = 10 and x - y = 2
  // Adding: 2x = 12 → x = 6, y = 4

  const getY1 = (x: number) => 10 - x; // x + y = 10
  const getY2 = (x: number) => x - 2; // x - y = 2

  const toSvg = (x: number, y: number) => ({
    sx: origin + x * gridSpacing,
    sy: origin - y * gridSpacing,
  });

  const xStart = -2;
  const xEnd = 12;

  // Line 1: y = 10 - x
  const p1_1 = toSvg(xStart, getY1(xStart));
  const p1_2 = toSvg(xEnd, getY1(xEnd));
  const line1Path = `M ${p1_1.sx} ${p1_1.sy} L ${p1_2.sx} ${p1_2.sy}`;

  // Line 2: y = x - 2
  const p2_1 = toSvg(xStart, getY2(xStart));
  const p2_2 = toSvg(xEnd, getY2(xEnd));
  const line2Path = `M ${p2_1.sx} ${p2_1.sy} L ${p2_2.sx} ${p2_2.sy}`;

  // Intersection point (6, 4)
  const intersectionPoint = toSvg(6, 4);

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
            Système: x + y = 10 et x − y = 2
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Les deux droites se croisent à un unique point solution
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
              x={origin + gridSpacing * 9}
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

            {/* Line 1: x + y = 10 (blue/teal) */}
            <motion.path
              d={line1Path}
              stroke="#4dd0e1"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0 }}
              viewport={{ once: true }}
            />

            {/* Line 2: x - y = 2 (purple) */}
            <motion.path
              d={line2Path}
              stroke="#b39ddb"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />

            {/* Intersection point */}
            {showIntersection && (
              <>
                <motion.circle
                  cx={intersectionPoint.sx}
                  cy={intersectionPoint.sy}
                  r="8"
                  fill="var(--or-ancestral)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.circle
                  cx={intersectionPoint.sx}
                  cy={intersectionPoint.sy}
                  r="8"
                  fill="none"
                  stroke="var(--or-ancestral)"
                  strokeWidth="2"
                  initial={{ r: 8, opacity: 1 }}
                  animate={{ r: 14, opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <text
                  x={intersectionPoint.sx + 15}
                  y={intersectionPoint.sy - 10}
                  fontSize="12"
                  fill="var(--or-ancestral)"
                  fontFamily="Geist Mono"
                  fontWeight="bold"
                >
                  (6, 4)
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-[#4dd0e1]"></div>
            <span className="text-[rgba(212,221,215,0.7)] font-geist-mono">x + y = 10</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-[#b39ddb]"></div>
            <span className="text-[rgba(212,221,215,0.7)] font-geist-mono">x − y = 2</span>
          </div>
        </div>

        {/* Toggle button */}
        <motion.button
          onClick={() => setShowIntersection(!showIntersection)}
          className="w-full py-3 px-4 rounded-lg border border-[rgba(196,160,53,0.3)] bg-[rgba(196,160,53,0.1)] text-[var(--ivoire-ancien)] font-geist-mono text-sm hover:bg-[rgba(196,160,53,0.2)] transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showIntersection ? "Masquer la solution (6, 4)" : "Montrer la solution"}
        </motion.button>

        {/* Solution explanation */}
        {showIntersection && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgba(196,160,53,0.1)] rounded-lg p-4 border border-[rgba(196,160,53,0.2)]"
          >
            <p className="text-sm text-[rgba(212,221,215,0.8)] mb-2">
              <strong>Vérification:</strong>
            </p>
            <p className="text-sm font-geist-mono text-[var(--ivoire-ancien)]">
              6 + 4 = 10 ✓<br />
              6 − 4 = 2 ✓
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
