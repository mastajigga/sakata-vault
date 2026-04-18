"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SectionCard from "@/components/SectionCard";
import Mission from "@/components/Mission";
import CommunityCallout from "@/components/CommunityCallout";
import { ARTICLES } from "@/data/articles";
import { useLanguage } from "@/components/LanguageProvider";

import { supabase } from "@/lib/supabase";

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
          .order("created_at", { ascending: false });
        
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
                    title={articles[0].title}
                    description={articles[0].summary}
                    href={`/savoir/${articles[0].slug}`}
                    image={articles[0].featured_image || articles[0].image}
                  />
                )}
              </div>
              <div className="md:col-span-5 md:mt-24">
                {articles[1] && (
                  <SectionCard
                    category={articles[1].category}
                    title={articles[1].title}
                    description={articles[1].summary}
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
                    title={articles[2].title}
                    description={articles[2].summary}
                    href={`/savoir/${articles[2].slug}`}
                    image={articles[2].featured_image || articles[2].image}
                  />
                )}
              </div>

              <div className="md:col-span-8 md:pl-12">
                <SectionCard
                  category="Communaute"
                  href="/forum"
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

      {/* ── Dernières mises à jour ─────────────────────────────────────────── */}
      <section
        className="section-container"
        style={{ paddingTop: "4rem", paddingBottom: "6rem" }}
      >
        <div className="mb-10">
          <span className="eyebrow mb-4 block">Plateforme</span>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              color: "var(--ivoire-ancien)",
            }}
          >
            Dernières mises à jour
          </h2>
          <p className="mt-3 text-sm opacity-60" style={{ color: "var(--brume-matinale)", maxWidth: "480px" }}>
            La plateforme évolue continuellement pour vous offrir une expérience plus riche et sécurisée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {[
            {
              icon: "🌍",
              title: "Calque Provinces RDC",
              date: "Avril 2026",
              desc: "Explorez les 26 provinces de la RDC. Focus spécial sur le Mai-Ndombe, terre ancestrale des Basakata, avec données administratives et culturelles.",
              span: "md:col-span-2 md:row-span-2",
              color: "rgba(193, 107, 52, 0.1)"
            },
            {
              icon: "📜",
              title: "Sagesse Ngongo",
              date: "Avril 2026",
              desc: "Nouveaux articles de fond sur les rites d'initiation Ngongo. Une recherche exhaustive de plus de 6000 mots sur la philosophie et la technique ancestrale.",
              span: "md:col-span-2",
              color: "rgba(233,196,106,0.1)"
            },
            {
              icon: "🖼️",
              title: "Mapbox GL JS v3",
              date: "Avril 2026",
              desc: "Mise à jour du moteur cartographique : Globe 3D, atmosphère dynamique et relief haute précision pour une immersion totale.",
              span: "md:col-span-1",
              color: "rgba(255,255,255,0.03)"
            },
            {
              icon: "⚡",
              title: "Performance v2.4",
              date: "Avril 2026",
              desc: "Optimisation du chargement des GeoJSON et synchronisation temps réel des calques géographiques.",
              span: "md:col-span-1",
              color: "rgba(255,255,255,0.03)"
            },
            {
              icon: "🔐",
              title: "Sécurité & Cache",
              date: "Avril 2026",
              desc: "Nouveau système de caching hybride et validation stricte des données pour une navigation fluide et protégée.",
              span: "md:col-span-2",
              color: "rgba(233,196,106,0.05)"
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`group rounded-3xl p-6 border transition-all duration-700 hover:scale-[1.02] flex flex-col justify-between ${item.span}`}
              style={{
                background: item.color,
                borderColor: "rgba(212, 221, 215, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">
                  {item.icon}
                </span>
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-or-ancestral/20"
                  style={{ color: "var(--or-ancestral)" }}
                >
                  {item.date}
                </span>
              </div>
              
              <div>
                <h3
                  className="text-base font-bold mb-2 text-ivoire-ancien group-hover:text-or-ancestral transition-colors"
                >
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-ivoire-ancien/40 line-clamp-3">
                  {item.desc}
                </p>
              </div>
              
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
                <div className="w-4 h-[1px] bg-or-ancestral/40" />
                <span className="text-[8px] uppercase tracking-widest text-or-ancestral">Détails</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      <CommunityCallout />
      <Footer />
    </main>
  );
}
