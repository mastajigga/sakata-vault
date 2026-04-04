"use client";

import React from "react";
import { motion } from "framer-motion";

const Mission = () => {
  return (
    <section
      className="section-container"
      style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Visual — Left */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative overflow-hidden"
          style={{ borderRadius: "2rem", aspectRatio: "1 / 1.1" }}
        >
          <img
            src="/images/sakata_heritage_hero.png"
            alt="Patrimoine vivant du peuple Sakata dans la region du Mai-Ndombe"
            className="w-full h-full object-cover"
            style={{
              opacity: 0.85,
              transition: "transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1.06)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1)";
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, var(--foret-nocturne) 0%, transparent 50%)",
            }}
          />
        </motion.div>

        {/* Text — Right */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.15,
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="eyebrow mb-8 block">Notre Vision</span>

          <h2
            className="font-display mb-8 font-bold"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              lineHeight: 1.1,
              color: "var(--ivoire-ancien)",
            }}
          >
            Plus qu'une archive,
            <br />
            un heritage vivant.
          </h2>

          <div
            className="space-y-5 text-body"
            style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)" }}
          >
            <p>
              La langue <span style={{ color: "var(--or-ancestral)", fontStyle: "italic" }}>kisakata</span> est
              comme la riviere Lukenie — elle coule depuis la nuit des temps,
              elle contourne les obstacles, elle nourrit tout ce qu'elle
              touche. Si elle s'asseche, c'est tout le village qui a soif.
            </p>
            <p>
              Notre <span style={{ color: "var(--or-ancestral)", fontStyle: "italic" }}>mboka</span> (terroir)
              ne se limite pas a un point sur la carte. C'est un endroit
              ou la terre vous reconnait, ou les arbres connaissent votre
              nom. Kisakata.com est le pont entre cet heritage et le monde
              moderne.
            </p>
          </div>

          {/* Stats */}
          <div
            className="flex gap-10 mt-12 pt-10"
            style={{
              borderTop: "1px solid var(--bordure-brume)",
            }}
          >
            <div className="flex flex-col">
              <span
                className="font-mono font-bold"
                style={{
                  fontSize: "1.75rem",
                  color: "var(--or-ancestral)",
                }}
              >
                2026
              </span>
              <span
                style={{
                  fontSize: "0.625rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  opacity: 0.4,
                  color: "var(--brume-matinale)",
                }}
              >
                Fondation
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono font-bold"
                style={{
                  fontSize: "1.75rem",
                  color: "var(--or-ancestral)",
                }}
              >
                3+
              </span>
              <span
                style={{
                  fontSize: "0.625rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  opacity: 0.4,
                  color: "var(--brume-matinale)",
                }}
              >
                Langues
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono font-bold"
                style={{
                  fontSize: "1.75rem",
                  color: "var(--or-ancestral)",
                }}
              >
                Mai-Ndombe
              </span>
              <span
                style={{
                  fontSize: "0.625rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  opacity: 0.4,
                  color: "var(--brume-matinale)",
                }}
              >
                Berceau
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Mission;
