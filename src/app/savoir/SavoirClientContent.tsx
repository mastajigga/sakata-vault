"use client";

import React, { useState } from "react";
import SectionCard from "@/components/SectionCard";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

interface Article {
  slug: string;
  title?: Record<string, string> | string;
  category?: string;
  summary?: Record<string, string> | string;
  featured_image?: string;
}

interface SavoirClientContentProps {
  articles: Article[];
}

export default function SavoirClientContent({ articles }: SavoirClientContentProps) {
  const { language, t } = useLanguage();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <>
      {/* Background Video with inward gradient mask */}
      <div className="absolute top-0 left-0 w-full h-[80vh] z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
            opacity: videoReady ? 0.6 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <source src="/videos/savoir_bg_4071.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Header Section */}
      <section className="relative z-10 pt-48 pb-24 px-8 md:px-24">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow mb-6 block" style={{ color: "var(--or-ancestral)" }}>
              {t("hero.eyebrow")}
            </span>
            <h1
              className="font-display font-bold leading-tight mb-8"
              style={{
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                color: "var(--ivoire-ancien)",
                letterSpacing: "-0.04em"
              }}
            >
              {t("hero.title").split(" la ")[0]} <span className="text-or-ancestral italic">{t("hero.title").split(" la ")[1] ? "la " + t("hero.title").split(" la ")[1] : ""}</span>
            </h1>
            <p
              className="font-body max-w-2xl text-lg opacity-60 leading-relaxed md:ml-24 border-l-2 border-or/20 pl-8"
              style={{ color: "var(--ivoire-ancien)" }}
            >
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section - Asymmetric Bento style */}
      <section className="relative z-10 px-8 md:px-24">
        <div className="max-w-[1400px] mx-auto">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {articles.map((article, index) => {
                const isLarge = index === 0 || index === 2;
                const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";
                const marginTop = index === 1 ? "md:mt-32" : "mt-0";

                const title = typeof article.title === 'string'
                  ? article.title
                  : article.title?.[language] || article.title?.fr || "Sans titre";

                const description = typeof article.summary === 'string'
                  ? article.summary
                  : article.summary?.[language] || article.summary?.fr || "";

                return (
                  <div key={article.slug} className={`${colSpan} ${marginTop}`}>
                    <SectionCard
                      title={title}
                      category={article.category || "Savoir"}
                      description={description}
                      image={article.featured_image || "/images/sakata_mask_detail.png"}
                      href={`/savoir/${article.slug}`}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="md:col-span-12 py-24 text-center">
              <p className="opacity-40 italic">{t("savoir.empty")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
