"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PlaceValueGrid() {
  const [tens, setTens] = useState(2);
  const [ones, setOnes] = useState(7);

  const total = tens * 10 + ones;

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
            Grille de valeurs — Dizaines et unités
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Comprenez la structure des nombres à deux chiffres avec des groupes de 10
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] block mb-3">
              Dizaines: {tens}
            </label>
            <input
              type="range"
              min="0"
              max="9"
              value={tens}
              onChange={(e) => setTens(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none bg-[rgba(212,221,215,0.2)] cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] block mb-3">
              Unités: {ones}
            </label>
            <input
              type="range"
              min="0"
              max="9"
              value={ones}
              onChange={(e) => setOnes(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none bg-[rgba(212,221,215,0.2)] cursor-pointer"
            />
          </div>
        </div>

        {/* Visualization */}
        <div className="space-y-6">
          {/* Tens section */}
          <div className="bg-[rgba(20,44,35,0.6)] rounded-lg p-6">
            <h4 className="text-sm font-semibold text-[rgba(212,221,215,0.7)] mb-4 uppercase tracking-[0.15em]">
              Dizaines ({tens} × 10 = {tens * 10})
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: i < tens ? 1 : 0.2, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className={`aspect-square rounded-md border-2 border-[rgba(196,160,53,0.4)] flex items-end justify-center p-1 ${
                    i < tens ? "bg-[rgba(196,160,53,0.25)]" : "bg-[rgba(212,221,215,0.05)]"
                  }`}
                >
                  {i < tens && (
                    <div className="grid grid-cols-2 gap-0.5 w-full h-full">
                      {Array.from({ length: 10 }).map((_, j) => (
                        <div
                          key={j}
                          className="bg-[rgba(196,160,53,0.5)] rounded-sm"
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ones section */}
          <div className="bg-[rgba(20,44,35,0.6)] rounded-lg p-6">
            <h4 className="text-sm font-semibold text-[rgba(212,221,215,0.7)] mb-4 uppercase tracking-[0.15em]">
              Unités ({ones})
            </h4>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: i < ones ? 1 : 0.2, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className={`aspect-square rounded-md border-2 border-[rgba(196,160,53,0.4)] ${
                    i < ones ? "bg-[rgba(196,160,53,0.4)]" : "bg-[rgba(212,221,215,0.05)]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Result display */}
          <div className="bg-[rgba(196,160,53,0.1)] border border-[rgba(196,160,53,0.3)] rounded-lg p-6">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)] mb-2">
                Total
              </div>
              <div className="text-4xl font-bold text-[var(--or-ancestral)] font-outfit">
                {total}
              </div>
              <div className="text-sm text-[rgba(212,221,215,0.65)] mt-3 space-y-1">
                <div>{tens} dizaines + {ones} unité{ones !== 1 ? "s" : ""}</div>
                <div className="text-[var(--or-ancestral)] font-semibold">
                  {tens} × 10 + {ones} = {total}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
