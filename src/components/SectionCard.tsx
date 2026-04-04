"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { TranslatedText } from "@/types/i18n";

interface SectionCardProps {
  title: TranslatedText;
  category: string;
  description: TranslatedText;
  image?: string;
  href?: string;
}

const SectionCard = ({
  title,
  category,
  description,
  image,
  href = "#",
}: SectionCardProps) => {
  const { language, t } = useLanguage();
  
  const displayTitle = title[language] || title.fr || "";
  const displayDesc = description[language] || description.fr || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      className="group block overflow-hidden"
      style={{ borderRadius: "1.5rem" }}
    >
      <Link href={href} className="block cursor-pointer">

      <div
        className="overflow-hidden"
        style={{
          padding: "6px",
          borderRadius: "1.5rem",
          background: "rgba(212, 221, 215, 0.04)",
          border: "1px solid var(--bordure-brume)",
          transition: "border-color var(--duration-base) var(--ease-smooth)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "var(--or-ancestral)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "var(--bordure-brume)";
        }}
      >
        <div
          className="overflow-hidden flex flex-col"
          style={{
            borderRadius: "calc(1.5rem - 6px)",
            background: "var(--verre-forestier)",
            backdropFilter: "blur(16px)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{ height: "240px" }}
          >
            {image ? (
              <img
                src={image.replace('/articles/media/', '/media/')}
                alt={displayTitle}
                className="w-full h-full object-cover transition-transform"
                style={{
                  opacity: 0.7,
                  transitionDuration: "1s",
                  transitionTimingFunction:
                    "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onError={(e) => {
                  e.currentTarget.src = "/images/sakata_mask_detail.png";
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: "var(--foret-nocturne)",
                  opacity: 0.5,
                }}
              >
                <span
                  className="font-display"
                  style={{ fontSize: "2rem", opacity: 0.15 }}
                >
                  {category}
                </span>
              </div>
            )}

            <div
              className="absolute top-4 left-4"
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "0.5rem",
                fontSize: "0.6rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                background: "var(--or-ancestral)",
                color: "var(--foret-nocturne)",
              }}
            >
              {category}
            </div>

            <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, var(--foret-nocturne) 0%, transparent 50%)",
            }}
          />
          </div>

          <div
            style={{
              padding: "1.75rem 2rem 2rem",
            }}
          >
            <h3
              className="font-display mb-3 font-bold"
              style={{ fontSize: "1.35rem", color: "var(--ivoire-ancien)" }}
            >
              {displayTitle}
            </h3>
            <p
              className="font-body mb-6"
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.65,
                opacity: 0.8,
                color: "var(--ivoire-ancien)",
              }}
            >
              {displayDesc}
            </p>

            <div
              className="flex items-center gap-2 pt-5"
              style={{
                borderTop: "1px solid var(--bordure-brume)",
              }}
            >
              <span
                className="font-semibold transition-all"
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--or-ancestral)",
                }}
              >
                {t("common.explore")}
              </span>
              <span
                className="inline-flex items-center justify-center rounded-full transition-transform"
                style={{
                  width: "22px",
                  height: "22px",
                  background: "rgba(233, 196, 106, 0.15)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="var(--amber-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 13L13 1M13 1H3M13 1V11" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

export default SectionCard;
