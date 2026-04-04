"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionCard from "@/components/SectionCard";
import Mission from "@/components/Mission";
import CommunityCallout from "@/components/CommunityCallout";
import { ARTICLES } from "@/data/articles";
import { useLanguage } from "@/components/LanguageProvider";

import { supabase } from "@/components/AuthProvider";

export default function Home() {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      console.log("Fetching articles from Supabase...");
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: true });
        
        if (error) throw error;

        if (data && data.length > 0) {
          console.log("Articles loaded from DB:", data.length);
          setArticles(data);
        } else {
          console.warn("DB returned no articles, falling back to static data.");
          setArticles(ARTICLES);
        }
      } catch (error) {
        console.error("Supabase Connection Error:", error);
        console.warn("Using static fallback data due to connection issues.");
        setArticles(ARTICLES);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Map slugs to ensure we link to existing data
  const getArticleBySlug = (slug: string) => articles.find((a: any) => a.slug === slug);

  return (
    <main className="grain-overlay">
      <Navbar />
      <Hero />
      <Mission />

      {/* Knowledge Grid */}
      <section
        id="savoir"
        className="section-container"
        style={{ paddingTop: "6rem", paddingBottom: "8rem" }}
      >
        <div className="mb-16">
          <span className="eyebrow mb-6 block">
            {t("home.gridEyebrow")}
          </span>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--ivoire-ancien)",
            }}
          >
            {t("home.gridTitle")}
          </h2>
        </div>

        {loading ? (
          <div className="py-24 text-center animate-pulse text-or-ancestral font-mono tracking-widest uppercase">
            Éveil des mémoires...
          </div>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(1, 1fr)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7">
                {articles[0] && (
                  <SectionCard
                    category={articles[0].category}
                    title={articles[0].title[language] || articles[0].title.fr}
                    description={articles[0].summary[language] || articles[0].summary.fr}
                    href={`/savoir/${articles[0].slug}`}
                    image={articles[0].featured_image || articles[0].image}
                  />
                )}
              </div>
              <div className="md:col-span-5 md:mt-24">
                {articles[1] && (
                  <SectionCard
                    category={articles[1].category}
                    title={articles[1].title[language] || articles[1].title.fr}
                    description={articles[1].summary[language] || articles[1].summary.fr}
                    href={`/savoir/${articles[1].slug}`}
                    image={articles[1].featured_image || articles[1].image}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-12">
              <div className="md:col-span-4">
                {articles[2] && (
                  <SectionCard
                    category={articles[2].category}
                    title={articles[2].title[language] || articles[2].title.fr}
                    description={articles[2].summary[language] || articles[2].summary.fr}
                    href={`/savoir/${articles[2].slug}`}
                    image={articles[2].featured_image || articles[2].image}
                  />
                )}
              </div>

              <div className="md:col-span-8 md:pl-12">
                <SectionCard
                  category="Communaute"
                  title={{
                    fr: "Le Forum des Enfants du Village",
                    skt: "Mboka ya bana ya mboka",
                    lin: "Lisanga ya bana ya mboka",
                    swa: "Jukwaa la Watoto wa Kijiji",
                    tsh: "Tshisumbu tshi bana ba mu musoko",
                  }}
                  description={{
                    fr: "Un lieu de rencontre pour les descendants, chercheurs et passionnés. Partagez vos souvenirs, vos questions et vos savoirs.",
                    skt: "Esika ya kokutana mpo na bakoko, balukiluki na ba lobi. Kabola makanisi, mituna na mayele.",
                    lin: "Esika ya kokutana mpo na bakoko, balukiluki na ba lobi. Kabola makanisi, mituna na mayele.",
                    swa: "Mahali pa kukutania kwa wazalendo, watafiti na wenye shauku. Shiriki kumbukumbu, maswali na maarifa yako.",
                    tsh: "Muaba wa kumpanyina manyinu a kale, meji ne nkonko yenu yonso mpo na kudianyina.",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <CommunityCallout />
      <Footer />
    </main>
  );
}

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer
      className="section-container"
      style={{
        paddingTop: "4rem",
        paddingBottom: "4rem",
        borderTop: "1px solid var(--bordure-brume)",
        background: "var(--foret-nocturne)",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-display font-bold text-xl" style={{ color: "var(--or-ancestral)" }}>
            KISAKATA
          </span>
          <p className="font-body text-xs opacity-40" style={{ color: "var(--ivoire-ancien)" }}>
            {t("footer.rights")}
          </p>
        </div>
        <div className="flex gap-8">
          {["CULTURE", "LANGUE", "HISTOIRE", "FORUM"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-mono text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-opacity hover:text-or"
              style={{ color: "var(--ivoire-ancien)" }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
