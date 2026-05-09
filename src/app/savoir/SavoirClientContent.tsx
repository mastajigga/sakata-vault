"use client";

import React, { useState } from "react";
import SectionCard from "@/components/SectionCard";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";

interface Article {
  slug: string;
  title?: Record<string, string> | string;
  category?: string;
  summary?: Record<string, string> | string;
  featured_image?: string;
  article_type?: "summary" | "poetic" | "philosophical" | null;
  is_premium?: boolean | null;
}

interface SavoirClientContentProps {
  articles: Article[];
}

export default function SavoirClientContent({ articles }: SavoirClientContentProps) {
  const { language, t } = useLanguage();
  const { user, nickname, username } = useAuth();
  const [videoReady, setVideoReady] = useState(false);

  const welcomeName = nickname || username || user?.email?.split('@')[0];

  // Anonymous visitors see only "summary" articles. Connected users see
  // everything (premium ones still hit the paywall on click via ArticleClient).
  const isPremiumArticle = (a: Article) => {
    if (a.article_type) return a.article_type !== "summary";
    return !!a.is_premium;
  };
  const visibleArticles = user ? articles : articles.filter((a) => !isPremiumArticle(a));
  const hiddenCount = user ? 0 : articles.length - visibleArticles.length;

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
              {user ? `${t("hero.eyebrow")} — Mbote, ${welcomeName}` : t("hero.eyebrow")}
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
          {visibleArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {visibleArticles.map((article, index) => {
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
                      image={article.featured_image || (article as any).image || "/images/sakata_mask_detail.png"}
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

          {/* Teaser for anonymous visitors when premium articles are hidden */}
          {hiddenCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-20 mx-auto max-w-2xl rounded-[2rem] p-1 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(181,149,81,0.18) 0%, rgba(242,238,221,0.04) 100%)",
                border: "1px solid rgba(181,149,81,0.18)",
              }}
            >
              <div className="bg-foret-nocturne/85 rounded-[1.9rem] p-8 md:p-10 backdrop-blur-md text-center space-y-4">
                <span className="eyebrow block" style={{ color: "var(--or-ancestral)" }}>
                  Au-delà des résumés
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-ivoire-ancien">
                  {hiddenCount} récit{hiddenCount > 1 ? "s" : ""} poétique{hiddenCount > 1 ? "s" : ""} et philosophique{hiddenCount > 1 ? "s" : ""} vous attend{hiddenCount > 1 ? "ent" : ""}
                </h3>
                <p className="text-sm md:text-base text-ivoire-ancien/65 leading-relaxed max-w-md mx-auto">
                  Les voix profondes du sanctuaire — chants ancestraux, méditations sur la dualité du pouvoir Sakata — sont réservées aux gardiens inscrits.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    href="/auth"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-or-ancestral text-foret-nocturne font-bold text-sm transition-all hover:brightness-110"
                    style={{ boxShadow: "0 8px 24px rgba(181, 149, 81, 0.25)" }}
                  >
                    Créer un compte
                  </a>
                  <a
                    href="/auth"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-or-ancestral/30 text-or-ancestral font-bold text-sm transition-all hover:bg-or-ancestral/10"
                  >
                    Se connecter
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
