"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SectionCard from "@/components/SectionCard";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/LanguageProvider";

import { ARTICLES } from "@/data/articles";

const SavoirIndex = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchArticles = async () => {
      console.log("Fetching all articles from Supabase...");
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          console.log("Articles loaded from DB:", data.length);
          setArticles(data);
        } else {
          console.warn("No articles in DB, using static data.");
          setArticles(ARTICLES);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setArticles(ARTICLES);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <main className="grain-overlay min-h-[100dvh] bg-foret-nocturne pb-24">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-48 pb-24 px-8 md:px-24">
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
      <section className="px-8 md:px-24">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="text-center py-24 animate-pulse text-or-ancestral font-mono tracking-widest uppercase">
              {t("loading.message")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {articles.map((article, index) => {
                const isLarge = index === 0 || index === 2;
                const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";
                const marginTop = index === 1 ? "md:mt-32" : "mt-0";

                return (
                  <div key={article.slug} className={`${colSpan} ${marginTop}`}>
                    <SectionCard
                      title={article.title?.[language] || article.title?.fr || article.title || "Sans titre"}
                      category={article.category}
                      description={article.summary?.[language] || article.summary?.fr || article.summary || ""}
                      image={article.featured_image || "/images/sakata_mask_detail.png"}
                      href={`/savoir/${article.slug}`}
                    />
                  </div>
                );
              })}
              
              {articles.length === 0 && (
                <div className="md:col-span-12 py-24 text-center">
                  <p className="opacity-40 italic">{t("savoir.empty")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SavoirIndex;
