"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AngleTriangle() {
  const [angleA, setAngleA] = useState(60);
  const [angleB, setAngleB] = useState(60);

  // Third angle always adjusts to make sum = 180
  const angleC = Math.max(1, Math.min(179, 180 - angleA - angleB));

  const size = 300;
  const padding = 40;
  const centerX = size / 2;
  const centerY = size / 2 + 30;

  // Triangle vertices (isoceles-ish for visual clarity)
  const vertexA = { x: centerX - 80, y: centerY + 80 };
  const vertexB = { x: centerX + 80, y: centerY + 80 };
  const vertexC = { x: centerX, y: centerY - 100 };

  // Helper to draw an arc for angle
  const drawAngleArc = (
    vertex: { x: number; y: number },
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = vertex.x + radius * Math.cos(startRad);
    const y1 = vertex.y + radius * Math.sin(startRad);
    const x2 = vertex.x + radius * Math.cos(endRad);
    const y2 = vertex.y + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Calculate angles for visualization (in screen coordinates)
  const getAngleForVertex = (v1: { x: number; y: number }, vertex: { x: number; y: number }, v2: { x: number; y: number }) => {
    const angle1 = Math.atan2(v1.y - vertex.y, v1.x - vertex.x) * (180 / Math.PI);
    const angle2 = Math.atan2(v2.y - vertex.y, v2.x - vertex.x) * (180 / Math.PI);
    return { start: Math.min(angle1, angle2), end: Math.max(angle1, angle2) };
  };

  const arcA = getAngleForVertex(vertexB, vertexA, vertexC);
  const arcB = getAngleForVertex(vertexA, vertexB, vertexC);
  const arcC = getAngleForVertex(vertexA, vertexC, vertexB);

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
            Angles d'un triangle
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            α + β + γ = 180° toujours, quelle que soit la forme du triangle
          </p>
        </div>

        {/* SVG Canvas */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-4">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="border border-[rgba(196,160,53,0.15)]">
            {/* Triangle sides */}
            <motion.line
              x1={vertexA.x}
              y1={vertexA.y}
              x2={vertexB.x}
              y2={vertexB.y}
              stroke="var(--or-ancestral)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.line
              x1={vertexB.x}
              y1={vertexB.y}
              x2={vertexC.x}
              y2={vertexC.y}
              stroke="var(--or-ancestral)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            />
            <motion.line
              x1={vertexC.x}
              y1={vertexC.y}
              x2={vertexA.x}
              y2={vertexA.y}
              stroke="var(--or-ancestral)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            />

            {/* Angle arcs */}
            <motion.path
              d={drawAngleArc(vertexA, 25, arcA.start, arcA.end)}
              stroke="#4dd0e1"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            />
            <motion.path
              d={drawAngleArc(vertexB, 25, arcB.start, arcB.end)}
              stroke="#b39ddb"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            />
            <motion.path
              d={drawAngleArc(vertexC, 25, arcC.start, arcC.end)}
              stroke="#81c784"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            />

            {/* Vertex labels */}
            <motion.text
              x={vertexA.x - 25}
              y={vertexA.y + 20}
              fontSize="16"
              fontWeight="bold"
              fill="var(--or-ancestral)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              α
            </motion.text>
            <motion.text
              x={vertexB.x + 15}
              y={vertexB.y + 20}
              fontSize="16"
              fontWeight="bold"
              fill="var(--or-ancestral)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              β
            </motion.text>
            <motion.text
              x={vertexC.x - 15}
              y={vertexC.y - 15}
              fontSize="16"
              fontWeight="bold"
              fill="var(--or-ancestral)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              γ
            </motion.text>

            {/* Angle values */}
            <motion.text
              x={vertexA.x + 35}
              y={vertexA.y - 10}
              fontSize="12"
              fill="#4dd0e1"
              fontFamily="Geist Mono"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
            >
              {angleA.toFixed(0)}°
            </motion.text>
            <motion.text
              x={vertexB.x - 40}
              y={vertexB.y - 10}
              fontSize="12"
              fill="#b39ddb"
              fontFamily="Geist Mono"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
            >
              {angleB.toFixed(0)}°
            </motion.text>
            <motion.text
              x={vertexC.x + 10}
              y={vertexC.y + 20}
              fontSize="12"
              fill="#81c784"
              fontFamily="Geist Mono"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
            >
              {angleC.toFixed(0)}°
            </motion.text>
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Angle A slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Angle α
              </label>
              <motion.span
                key={angleA}
                className="text-sm font-bold text-[#4dd0e1]"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {angleA.toFixed(0)}°
              </motion.span>
            </div>
            <input
              type="range"
              min="10"
              max={Math.min(170, 180 - angleB - 1)}
              step="1"
              value={angleA}
              onChange={(e) => setAngleA(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(77,208,225,0.2)] rounded-lg appearance-none cursor-pointer accent-[#4dd0e1]"
            />
          </div>

          {/* Angle B slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Angle β
              </label>
              <motion.span
                key={angleB}
                className="text-sm font-bold text-[#b39ddb]"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {angleB.toFixed(0)}°
              </motion.span>
            </div>
            <input
              type="range"
              min="10"
              max={Math.min(170, 180 - angleA - 1)}
              step="1"
              value={angleB}
              onChange={(e) => setAngleB(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(179,157,219,0.2)] rounded-lg appearance-none cursor-pointer accent-[#b39ddb]"
            />
          </div>

          {/* Angle C (automatic) */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Angle γ (automatique)
              </label>
              <motion.span
                key={angleC}
                className="text-sm font-bold text-[#81c784]"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {angleC.toFixed(0)}°
              </motion.span>
            </div>
            <div className="w-full h-2 bg-[rgba(129,199,132,0.2)] rounded-lg"></div>
          </div>
        </div>

        {/* Sum display */}
        <motion.div
          className="bg-[rgba(196,160,53,0.1)] rounded-lg p-4 border border-[rgba(196,160,53,0.2)]"
          key={angleA + angleB}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <p className="font-geist-mono text-sm text-[var(--ivoire-ancien)]">
            α + β + γ = {angleA.toFixed(0)}° + {angleB.toFixed(0)}° + {angleC.toFixed(0)}° = {(angleA + angleB + angleC).toFixed(0)}°
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
