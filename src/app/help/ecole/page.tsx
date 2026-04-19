"use client";

import React from "react";
import { BookDashed, Database, RadioTower, Sigma, Waves } from "lucide-react";
import Link from "next/link";

const stackCards = [
  {
    icon: Sigma,
    title: "KaTeX + MathLive",
    body: "Rendu mathématique propre, saisie naturelle, indices et correction immédiate.",
  },
  {
    icon: Database,
    title: "Supabase",
    body: "Sauvegarde des progrès, comptes élèves et synchronisation temps réel.",
  },
  {
    icon: BookDashed,
    title: "MDX",
    body: "Leçons rédigées comme des cahiers vivants, faciles à enrichir par année.",
  },
  {
    icon: RadioTower,
    title: "Extensions communautaires",
    body: "Commentaires enseignants, défis de classe et suivi collectif à brancher ensuite.",
  },
];

export default function EcoleHelpPage() {
  return (
    <div className="space-y-12 pb-20">
      <section>
        <span className="eyebrow">Philosophie & Vision</span>
        <h1 className="mt-6 font-display text-4xl tracking-tight text-[var(--ivoire-ancien)] md:text-5xl">
          L'École de la Brume : Fondations
        </h1>
        <div className="mt-8 space-y-6 text-lg leading-8 text-[rgba(212,221,215,0.76)]">
          <p>
            L'École de la Brume n'est pas une annexe technique. C'est une
            extension naturelle du site, un espace où le savoir scolaire et la
            transmission culturelle avancent ensemble. Les enfants y apprennent
            à compter, lire et raisonner avec des images du territoire, des
            gestes du quotidien et des récits qui les relient à la Lukenie.
          </p>
          <p>
            La structure est volontairement calme, aérée et lisible. Elle
            respecte la gravité patrimoniale du projet tout en introduisant une
            expérience interactive de niveau moderne.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 text-[var(--amber-light)] mb-8">
          <Waves className="h-6 w-6" />
          <h2 className="text-xl font-display text-[var(--ivoire-ancien)]">
            Infrastructure & Pédagogie
          </h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {stackCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(212,221,215,0.03)] p-6 md:p-8"
            >
              <div className="flex items-center gap-4 text-[var(--amber-light)]">
                <card.icon className="h-6 w-6 text-[var(--or-ancestral)]" />
                <h3 className="text-lg font-display text-[var(--ivoire-ancien)]">
                  {card.title}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-[rgba(212,221,215,0.68)]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] bg-[var(--or-ancestral)]/10 p-8 md:p-12 border border-[var(--or-ancestral)]/20">
        <h2 className="font-display text-2xl text-[var(--ivoire-ancien)]">
          Besoin d'aide pour votre classe ?
        </h2>
        <p className="mt-4 text-sm leading-7 text-[rgba(212,221,215,0.76)] max-w-2xl">
          Si vous êtes enseignant ou parent et que vous souhaitez des informations sur l'intégration du curriculum Sakata dans votre programme, contactez la communauté sur le forum.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/forum"
            className="inline-flex items-center px-6 py-3 rounded-full bg-[var(--or-ancestral)] text-[var(--foret-nocturne)] font-semibold text-sm transition-all hover:scale-[1.02]"
          >
            Rejoindre le Forum
          </Link>
          <Link
            href="/ecole"
            className="inline-flex items-center px-6 py-3 rounded-full border border-[rgba(212,221,215,0.2)] text-[var(--ivoire-ancien)] font-medium text-sm transition-all hover:bg-white/5"
          >
            Retour à l'École
          </Link>
        </div>
      </section>
    </div>
  );
}
