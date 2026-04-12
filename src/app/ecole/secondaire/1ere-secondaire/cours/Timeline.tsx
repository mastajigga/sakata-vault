"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    year: 2000,
    title: "Événement 1",
    description: "Le commencement d'une histoire remarquable",
  },
  {
    year: 2005,
    title: "Événement 2",
    description: "Une étape importante dans le développement",
  },
  {
    year: 2010,
    title: "Événement 3",
    description: "Un tournant décisif qui change tout",
  },
  {
    year: 2015,
    title: "Événement 4",
    description: "La consolidation des acquis précédents",
  },
  {
    year: 2020,
    title: "Événement 5",
    description: "L'arrivée d'une nouvelle ère transformatrice",
  },
];

export default function Timeline({
  events = DEFAULT_EVENTS,
}: {
  events?: TimelineEvent[];
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

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
            Ligne de temps — Séquences et chronologie
          </h3>
          <p className="text-sm text-[rgba(212,221,215,0.7)]">
            Organisez les événements dans l'ordre chronologique
          </p>
        </div>

        {/* Timeline visualization */}
        <div className="space-y-4">
          {/* Horizontal timeline line */}
          <div className="relative h-2 bg-[rgba(196,160,53,0.15)] rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-[rgba(196,160,53,0.4)]"
              initial={{ width: 0 }}
              whileInView={{ width: `${((expandedIndex || 0) + 1) / events.length * 100}%` }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />
          </div>

          {/* Timeline markers and content */}
          <div className="space-y-3 mt-8">
            {events.map((event, index) => (
              <motion.div key={index} layout>
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-4">
                    {/* Marker */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                      }}
                      viewport={{ once: true }}
                      className="relative flex-shrink-0 mt-1"
                    >
                      <div
                        className={`w-3 h-3 rounded-full border-2 transition-all ${
                          expandedIndex === index
                            ? "bg-[var(--or-ancestral)] border-[var(--or-ancestral)] w-5 h-5"
                            : "bg-[rgba(196,160,53,0.3)] border-[rgba(196,160,53,0.5)]"
                        }`}
                      />
                      {index < events.length - 1 && (
                        <div className="absolute top-5 left-1.5 w-0.5 h-6 bg-[rgba(196,160,53,0.2)]" />
                      )}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--or-ancestral)]">
                          {event.year}
                        </span>
                        <h4 className="text-sm font-semibold text-[rgba(212,221,215,0.85)]">
                          {event.title}
                        </h4>
                      </div>

                      {/* Expanded description */}
                      <AnimatePresence>
                        {expandedIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2"
                          >
                            <p className="text-xs text-[rgba(212,221,215,0.7)] bg-[rgba(196,160,53,0.08)] border-l-2 border-[rgba(196,160,53,0.3)] pl-3 py-2 rounded">
                              {event.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.2)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgba(212,221,215,0.6)]">
              Progression chronologique
            </span>
            <span className="text-sm font-semibold text-[var(--or-ancestral)]">
              {expandedIndex !== null ? `${expandedIndex + 1}/${events.length}` : "−"}
            </span>
          </div>
          <div className="mt-3 w-full bg-[rgba(212,221,215,0.1)] rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-[var(--or-ancestral)]"
              initial={{ width: 0 }}
              animate={{
                width:
                  expandedIndex !== null
                    ? `${((expandedIndex + 1) / events.length) * 100}%`
                    : 0,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Instructions */}
        <p className="text-xs text-[rgba(212,221,215,0.6)]">
          Cliquez sur les événements pour explorer la chronologie. Les événements sont arrangés du plus ancien au plus récent.
        </p>
      </div>
    </motion.div>
  );
}
