"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "./LanguageProvider";
import { TranslatedText } from "@/types/i18n";

type TranslatedOrString = string | TranslatedText;

interface SectionCardProps {
  title: TranslatedOrString;
  category: string;
  description: TranslatedOrString;
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
  
  const getText = (field: TranslatedOrString, fallbackLang: string = "fr"): string => {
    if (typeof field === "string") return field;
    return (field as TranslatedText)[language] || (field as TranslatedText).fr || (field as any).toString() || "";
  };
  
  const displayTitle = getText(title);
  const displayDesc = getText(description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative"
    >
      <Link href={href} className="block cursor-pointer outline-none rounded-[2.5rem]">
        {/* Outer Bezel (Material Shell) */}
        <div 
          className="relative p-[1px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            borderRadius: "2.5rem",
            background: "linear-gradient(135deg, rgba(233, 196, 106, 0.1) 0%, rgba(10, 31, 21, 0.4) 100%)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Inner Core (Liquid Glass) - Double Bezel Effect */}
          <div
            className="relative overflow-hidden flex flex-col h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[0.99]"
            style={{
              borderRadius: "calc(2.5rem - 1px)",
              background: "var(--verre-forestier)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Visual Header */}
            <div className="relative aspect-[16/10] md:h-[240px] overflow-hidden">
              {image ? (
                <Image
                  src={image.replace('/articles/media/', '/media/')}
                  alt={displayTitle}
                  width={600}
                  height={240}
                  priority={false}
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: 0.8,
                    filter: "contrast(1.1) brightness(0.9)",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = "/images/sakata_mask_detail.png";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A1F15] to-black/40 flex items-center justify-center">
                  <span className="font-display text-4xl opacity-10 select-none">{category}</span>
                </div>
              )}

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F15] via-[#0A1F15]/20 to-transparent opacity-90" />
              
              {/* Category Tag (Floating) */}
              <div
                className="absolute top-4 md:top-6 left-4 md:left-6 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] z-20"
                style={{
                  background: "rgba(233, 196, 106, 0.1)",
                  color: "var(--or-ancestral)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(233, 196, 106, 0.2)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                {category}
              </div>
            </div>

            {/* Content Body */}
            <div className="relative p-6 md:p-8 pt-5 md:pt-6 flex flex-col grow min-h-[180px]">
              <h3
                className="font-display text-xl md:text-2xl mb-3 md:mb-4 font-bold text-[#E9DCC9] group-hover:text-[#E9C46A] transition-colors duration-500"
                style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                {displayTitle}
              </h3>
              
              <p
                className="font-body text-xs md:text-sm text-[#E9DCC9]/60 leading-relaxed grow line-clamp-3 mb-6 md:mb-8"
              >
                {displayDesc}
              </p>

              {/* Reveal Footer */}
              <div className="flex items-center justify-between pt-5 md:pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-6 md:w-8 h-[1px] bg-[#E9C46A]/40 group-hover:w-12 transition-all duration-700" />
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-[#E9C46A]">
                    {t("common.explore")}
                  </span>
                </div>
                
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-[#E9C46A] group-hover:border-[#E9C46A] transition-all duration-500">
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 14 14" 
                    fill="none" 
                    className="stroke-[#E9C46A] group-hover:stroke-[#0A1F15] transition-colors duration-500"
                  >
                    <path d="M1 13L13 1M13 1H3M13 1V11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SectionCard;
