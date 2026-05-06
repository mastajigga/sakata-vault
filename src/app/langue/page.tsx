"use client";

import LangueHero from "./components/LangueHero";
import RiviereLangue from "./components/RiviereLangue";
import VocabulaireSection from "./components/VocabulaireSection";

export default function LanguePage() {
  return (
    <main className="min-h-screen bg-[var(--foret-nocturne)] font-sans selection:bg-[var(--or-ancestral)]/30 selection:text-[var(--ivoire-ancien)]">
      <LangueHero />
      <RiviereLangue />
      <VocabulaireSection />

      {/* Infographie */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,160,53,0.04),transparent_70%)]" />
        <div className="relative section-container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-[var(--ivoire-ancien)]">
              Les bases du Kisakata
            </h2>
            <p className="mt-2 text-[rgba(212,221,215,0.5)] text-sm">
              Une vue d&apos;ensemble pour comprendre la structure de la langue
            </p>
          </div>
          <div className="max-w-3xl mx-auto rounded-[2rem] border border-[rgba(212,221,215,0.08)] overflow-hidden">
            <img
              src="/infographies/langue-kisakata-bases.png"
              alt="Infographie — Les bases du Kisakata"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Footer citation */}
      <section className="relative py-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(196,160,53,0.06),transparent_70%)]" />
        <div className="relative section-container">
          <p className="text-[rgba(212,221,215,0.4)] italic text-lg max-w-2xl mx-auto">
            « La langue est la rivière qui relie les vivants aux ancêtres.
            Chaque mot prononcé est une offrande. »
          </p>
          <p className="mt-4 text-xs text-[rgba(212,221,215,0.25)]">
            — Sagesse Basakata
          </p>
        </div>
      </section>
    </main>
  );
}
