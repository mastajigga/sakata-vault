"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ProportionVisualization() {
  const [stickHeight, setStickHeight] = useState(1);
  const [treeHeight, setTreeHeight] = useState(8);

  // Shadows are proportional
  const stickShadow = stickHeight * 0.8;
  const treeShadow = treeHeight * 0.8;

  // Ratio check
  const ratio1 = stickHeight / stickShadow;
  const ratio2 = treeHeight / treeShadow;
  const ratiosMatch = Math.abs(ratio1 - ratio2) < 0.01;

  const svgWidth = 500;
  const svgHeight = 320;

  // Ground line
  const groundY = 280;

  // Stick position
  const stickX = 100;
  const stickTopY = groundY - stickHeight * 20;
  const stickShadowEnd = stickX + stickShadow * 20;

  // Tree position
  const treeX = 350;
  const treeTopY = groundY - treeHeight * 20;
  const treeShadowEnd = treeX + treeShadow * 20;

  // Sun ray angles
  const sunAngle = Math.atan((stickHeight * 20) / (stickShadow * 20));

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
            Triangles semblables — Mesurer sans accéder
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Le bâton et l'arbre forment deux triangles semblables avec le soleil
          </p>
        </div>

        {/* SVG Canvas */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-4">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="border border-[rgba(196,160,53,0.15)]">
            {/* Sky gradient background */}
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(196,160,53,0.1)" />
                <stop offset="100%" stopColor="rgba(196,160,53,0.05)" />
              </linearGradient>
            </defs>
            <rect width={svgWidth} height={svgHeight} fill="url(#skyGradient)" />

            {/* Sun */}
            <motion.circle
              cx={50}
              cy={30}
              r="15"
              fill="var(--or-ancestral)"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />

            {/* Sun rays */}
            <motion.line
              x1={50}
              y1={30}
              x2={stickX}
              y2={stickTopY}
              stroke="var(--or-ancestral)"
              strokeWidth="1.5"
              opacity="0.4"
              strokeDasharray="4,4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            />
            <motion.line
              x1={50}
              y1={30}
              x2={treeX}
              y2={treeTopY}
              stroke="var(--or-ancestral)"
              strokeWidth="1.5"
              opacity="0.4"
              strokeDasharray="4,4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            />

            {/* Ground line */}
            <line x1="0" y1={groundY} x2={svgWidth} y2={groundY} stroke="rgba(196,160,53,0.3)" strokeWidth="2" />

            {/* Stick */}
            <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}>
              {/* Stick pole */}
              <line x1={stickX} y1={stickTopY} x2={stickX} y2={groundY} stroke="#8b5a3c" strokeWidth="3" />
              {/* Stick shadow */}
              <line x1={stickX} y1={groundY} x2={stickShadowEnd} y2={groundY} stroke="#d4a574" strokeWidth="3" />
              {/* Stick top dot */}
              <circle cx={stickX} cy={stickTopY} r="4" fill="#8b5a3c" />
            </motion.g>

            {/* Tree */}
            <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}>
              {/* Tree trunk */}
              <line x1={treeX} y1={treeTopY} x2={treeX} y2={groundY} stroke="#2e7d32" strokeWidth="5" />
              {/* Tree canopy */}
              <circle cx={treeX} cy={treeTopY - 15} r="25" fill="rgba(46,125,50,0.6)" />
              {/* Tree shadow */}
              <line x1={treeX} y1={groundY} x2={treeShadowEnd} y2={groundY} stroke="rgba(46,125,50,0.5)" strokeWidth="5" />
            </motion.g>

            {/* Triangle outline for stick */}
            <motion.polygon
              points={`${stickX},${stickTopY} ${stickShadowEnd},${groundY} ${stickX},${groundY}`}
              fill="rgba(139,90,60,0.1)"
              stroke="#8b5a3c"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            />

            {/* Triangle outline for tree */}
            <motion.polygon
              points={`${treeX},${treeTopY} ${treeShadowEnd},${groundY} ${treeX},${groundY}`}
              fill="rgba(46,125,50,0.1)"
              stroke="#2e7d32"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            />

            {/* Height labels */}
            <motion.text
              x={stickX - 40}
              y={stickTopY + stickHeight * 10}
              fontSize="11"
              fill="var(--ivoire-ancien)"
              fontFamily="Geist Mono"
              textAnchor="end"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
            >
              {stickHeight.toFixed(1)}m
            </motion.text>
            <motion.text
              x={treeX - 40}
              y={treeTopY + treeHeight * 10}
              fontSize="11"
              fill="var(--ivoire-ancien)"
              fontFamily="Geist Mono"
              textAnchor="end"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
            >
              {treeHeight.toFixed(1)}m
            </motion.text>

            {/* Shadow labels */}
            <text x={stickShadowEnd / 2} y={groundY + 18} fontSize="10" fill="var(--or-ancestral)" fontFamily="Geist Mono" textAnchor="middle">
              {stickShadow.toFixed(1)}m
            </text>
            <text x={(treeX + treeShadowEnd) / 2} y={groundY + 18} fontSize="10" fill="var(--or-ancestral)" fontFamily="Geist Mono" textAnchor="middle">
              {treeShadow.toFixed(1)}m
            </text>
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Stick height slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Hauteur du bâton
              </label>
              <span className="text-sm font-bold text-[#8b5a3c]">
                {stickHeight.toFixed(1)}m
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={stickHeight}
              onChange={(e) => setStickHeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(139,90,60,0.2)] rounded-lg appearance-none cursor-pointer accent-[#8b5a3c]"
            />
          </div>

          {/* Tree height slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-[rgba(212,221,215,0.7)] font-geist-mono">
                Hauteur de l'arbre
              </label>
              <span className="text-sm font-bold text-[#2e7d32]">
                {treeHeight.toFixed(1)}m
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              step="0.1"
              value={treeHeight}
              onChange={(e) => setTreeHeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-[rgba(46,125,50,0.2)] rounded-lg appearance-none cursor-pointer accent-[#2e7d32]"
            />
          </div>
        </div>

        {/* Ratio check */}
        <motion.div
          className={`rounded-lg p-4 border ${
            ratiosMatch
              ? "bg-[rgba(129,199,132,0.1)] border-[rgba(129,199,132,0.3)]"
              : "bg-[rgba(196,160,53,0.1)] border-[rgba(196,160,53,0.2)]"
          }`}
          key={`${stickHeight}-${treeHeight}`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <p className="text-sm font-geist-mono text-[var(--ivoire-ancien)] mb-2">
            Ratio hauteur/ombre:
          </p>
          <p className="text-sm font-geist-mono text-[rgba(212,221,215,0.8)]">
            Bâton: {ratio1.toFixed(3)} | Arbre: {ratio2.toFixed(3)}
          </p>
          {ratiosMatch && (
            <p className="text-xs text-[#81c784] mt-2">
              ✓ Les ratios sont égaux! Les triangles sont semblables.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
