"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import SectionCard from "@/components/SectionCard";
import { ARTICLES } from "@/data/articles";
import { motion } from "framer-motion";

const SavoirIndex = () => {
  return (
    <main className="grain-overlay min-h-screen bg-foret-nocturne pb-24">
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
              Bibliothèque Ancestrale
            </span>
            <h1 
              className="font-display font-bold leading-tight mb-8"
              style={{ 
                fontSize: "clamp(3rem, 7vw, 5.5rem)", 
                color: "var(--ivoire-ancien)",
                letterSpacing: "-0.04em" 
              }}
            >
              Les Savoirs de <span className="text-or-ancestral italic">la Brume</span>
            </h1>
            <p 
              className="font-body max-w-2xl text-lg opacity-60 leading-relaxed md:ml-24 border-l-2 border-or/20 pl-8"
              style={{ color: "var(--ivoire-ancien)" }}
            >
              Plongez dans les profondeurs de notre héritage. Chaque article est un souffle, chaque mot est une trace laissée par nos pères pour guider la diaspora et les générations futures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section - Asymmetric Bento style */}
      <section className="px-8 md:px-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {ARTICLES.map((article, index) => {
              // Create an asymmetric rhythm
              const isLarge = index === 0 || index === 2;
              const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";
              const marginTop = index === 1 ? "md:mt-32" : "mt-0";

              return (
                <div key={article.slug} className={`${colSpan} ${marginTop}`}>
                  <SectionCard
                    title={article.title}
                    category={article.category}
                    description={article.summary}
                    image={article.image}
                    href={`/savoir/${article.slug}`}
                  />
                </div>
              );
            })}
            
            {/* Call to action for remaining 9 articles */}
            <div className="md:col-span-12 mt-24 text-center py-24 border-t border-white/5">
              <p className="font-display text-2xl opacity-20" style={{ color: "var(--ivoire-ancien)" }}>
                Plus de savoirs en cours de murmure... (9 articles à venir)
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SavoirIndex;
