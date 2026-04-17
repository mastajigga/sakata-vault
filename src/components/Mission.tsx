"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

const Mission = () => {
  const { t } = useLanguage();
  
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
          whileHover={{ scale: 1.06 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative overflow-hidden"
          style={{ borderRadius: "2rem", aspectRatio: "1 / 1.1" }}
        >
          <Image
            src="/images/sakata_heritage_hero.png"
            alt="Patrimoine vivant du peuple Sakata dans la region du Mai-Ndombe"
            fill
            className="object-cover"
            style={{ opacity: 0.85 }}
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
          <span className="eyebrow mb-8 block">{t("mission.eyebrow")}</span>

          <h2
            className="font-display mb-8 font-bold"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              lineHeight: 1.1,
              color: "var(--ivoire-ancien)",
            }}
          >
            {t("mission.title")}
          </h2>

          <div
            className="space-y-8 text-body"
            style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)", lineHeight: 1.8 }}
          >
            <p className="opacity-80">
              {t("mission.p1")}
            </p>
            <p className="opacity-80">
              {t("mission.p2")}
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
                {t("mission.stat1")}
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
                5
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
                {t("mission.stat2")}
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-mono font-bold"
                style={{
                  fontSize: "1.5rem",
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
                {t("mission.stat3")}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Mission;
