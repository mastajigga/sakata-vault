"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AreaRectangle() {
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(5);

  const area = width * height;

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
            Surface rectangulaire — Visualiser la multiplication
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            La multiplication est le nombre de carreaux dans un rectangle
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] block mb-3">
              Largeur: {width}
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none bg-[rgba(212,221,215,0.2)] cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] block mb-3">
              Hauteur: {height}
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none bg-[rgba(212,221,215,0.2)] cursor-pointer"
            />
          </div>
        </div>

        {/* Visualization */}
        <div className="flex justify-center bg-[rgba(20,44,35,0.6)] rounded-lg p-8">
          <div className="space-y-6">
            {/* Grid */}
            <div
              className="inline-block gap-1 p-4 rounded-lg border border-[rgba(196,160,53,0.2)]"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
                gap: "0.25rem",
              }}
            >
              {Array.from({ length: width * height }).map((_, i) => {
                const col = i % width;
                const row = Math.floor(i / width);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: (row + col) * 0.02,
                    }}
                    viewport={{ once: true }}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-[rgba(196,160,53,0.3)] border border-[rgba(196,160,53,0.5)] flex items-center justify-center"
                  >
                    <span className="text-xs text-[rgba(196,160,53,0.7)] font-mono font-bold">
                      1
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Dimension labels */}
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] mb-2">
                  Largeur
                </div>
                <div className="text-2xl font-bold text-[var(--or-ancestral)] font-outfit">
                  {width}
                </div>
              </div>

              <div className="text-2xl font-bold text-[rgba(196,160,53,0.6)]">
                ×
              </div>

              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] mb-2">
                  Hauteur
                </div>
                <div className="text-2xl font-bold text-[var(--or-ancestral)] font-outfit">
                  {height}
                </div>
              </div>

              <div className="text-2xl font-bold text-[rgba(196,160,53,0.6)]">
                =
              </div>

              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] mb-2">
                  Surface
                </div>
                <div className="text-2xl font-bold text-[var(--or-ancestral)] font-outfit">
                  {area}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.2)] rounded-lg p-4">
          <p className="text-sm text-[rgba(212,221,215,0.75)]">
            <span className="font-semibold text-[var(--or-ancestral)]">
              {width} × {height} = {area}
            </span>
            {" "}— Chaque carré représente une unité. Le rectangle contient {area} carreaux au total.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
