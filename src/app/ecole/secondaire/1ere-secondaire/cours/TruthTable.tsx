"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const ELEMENTS = [
  { id: "e1", label: "Pêcheur", emoji: "🎣" },
  { id: "e2", label: "Pirogue", emoji: "🚣" },
  { id: "e3", label: "Filet", emoji: "🥅" },
  { id: "e4", label: "Marchand", emoji: "🛒" },
  { id: "e5", label: "Tambour", emoji: "🥁" },
  { id: "e6", label: "Rivière", emoji: "🌊" },
];

export default function TruthTable() {
  const [inA, setInA] = useState<Set<string>>(new Set(["e1", "e2", "e3"]));
  const [inB, setInB] = useState<Set<string>>(new Set(["e2", "e3", "e4", "e5"]));

  const toggle = (set: Set<string>, setFn: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setFn(next);
  };

  return (
    <motion.div
      className="rounded-[1.8rem] border border-[rgba(196,160,53,0.22)] bg-[rgba(20,44,35,0.4)] p-6 md:p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} viewport={{ once: true }}
    >
      <h3 className="text-[1.1rem] font-bold text-[var(--ivoire-ancien)] mb-1">Table d'appartenance</h3>
      <p className="text-sm text-[rgba(212,221,215,0.6)] mb-5">Coche les éléments de A et B — l'intersection et l'union se calculent automatiquement</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 text-[rgba(212,221,215,0.6)] font-normal border-b border-[rgba(196,160,53,0.1)]">Élément</th>
              <th className="p-2 text-center text-[rgba(80,140,200,0.8)] border-b border-[rgba(196,160,53,0.1)]">∈ A</th>
              <th className="p-2 text-center text-[rgba(100,180,120,0.8)] border-b border-[rgba(196,160,53,0.1)]">∈ B</th>
              <th className="p-2 text-center text-[var(--or-ancestral)] border-b border-[rgba(196,160,53,0.1)]">A ∩ B</th>
              <th className="p-2 text-center text-[rgba(196,130,53,0.9)] border-b border-[rgba(196,160,53,0.1)]">A ∪ B</th>
            </tr>
          </thead>
          <tbody>
            {ELEMENTS.map((el, i) => {
              const a = inA.has(el.id), b = inB.has(el.id);
              return (
                <motion.tr key={el.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                  className="border-b border-[rgba(196,160,53,0.06)] hover:bg-[rgba(196,160,53,0.04)]">
                  <td className="p-2 text-[var(--ivoire-ancien)]">{el.emoji} {el.label}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => toggle(inA, setInA, el.id)}
                      className={`w-6 h-6 rounded-md border transition-all text-xs ${a ? "bg-[rgba(80,140,200,0.3)] border-[rgba(80,140,200,0.6)] text-[rgba(80,140,200,0.9)]" : "border-[rgba(212,221,215,0.15)] text-[rgba(212,221,215,0.3)]"}`}>
                      {a ? "✓" : "·"}
                    </button>
                  </td>
                  <td className="p-2 text-center">
                    <button onClick={() => toggle(inB, setInB, el.id)}
                      className={`w-6 h-6 rounded-md border transition-all text-xs ${b ? "bg-[rgba(100,180,120,0.3)] border-[rgba(100,180,120,0.6)] text-[rgba(100,180,120,0.9)]" : "border-[rgba(212,221,215,0.15)] text-[rgba(212,221,215,0.3)]"}`}>
                      {b ? "✓" : "·"}
                    </button>
                  </td>
                  <td className="p-2 text-center text-sm font-bold">
                    <span className={a && b ? "text-[var(--or-ancestral)]" : "text-[rgba(212,221,215,0.2)]"}>{a && b ? "✓" : "—"}</span>
                  </td>
                  <td className="p-2 text-center text-sm font-bold">
                    <span className={a || b ? "text-[rgba(196,130,53,0.9)]" : "text-[rgba(212,221,215,0.2)]"}>{a || b ? "✓" : "—"}</span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[rgba(196,160,53,0.07)] border border-[rgba(196,160,53,0.15)] p-3 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[rgba(212,221,215,0.4)] mb-1">A ∩ B</p>
          <p className="text-sm font-bold text-[var(--or-ancestral)]">
            {ELEMENTS.filter(e => inA.has(e.id) && inB.has(e.id)).map(e => e.label).join(", ") || "∅ (vide)"}
          </p>
        </div>
        <div className="rounded-xl bg-[rgba(196,130,53,0.07)] border border-[rgba(196,130,53,0.15)] p-3 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[rgba(212,221,215,0.4)] mb-1">A ∪ B</p>
          <p className="text-sm font-bold text-[rgba(196,130,53,0.9)]">
            {ELEMENTS.filter(e => inA.has(e.id) || inB.has(e.id)).length} élément(s)
          </p>
        </div>
      </div>
    </motion.div>
  );
}
