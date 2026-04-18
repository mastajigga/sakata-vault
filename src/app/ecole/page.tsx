import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookDashed,
  Database,
  RadioTower,
  Sigma,
  Waves,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import EcoleHero from "./components/EcoleHero";
import StudentSummary from "./components/StudentSummary";
import KnowledgeRivers from "./components/KnowledgeRivers";
import MathCurriculumSwitcher from "./components/MathCurriculumSwitcher";
import PremiereAnneeIntro from "./content/premiere-annee-intro.mdx";
import {
  knowledgeRivers,
  primaryPrograms,
  secondairePrograms,
} from "./data/mathematics-curriculum";

export const metadata: Metadata = {
  title: "L'Ecole de la Brume | Kisakata",
  description:
    "L'Ecole de la Brume prolonge Kisakata avec une pedagogie Sakata pour la langue, les mathematiques du primaire congolais et l'histoire precoloniale.",
};

const stackCards = [
  {
    icon: Sigma,
    title: "KaTeX + MathLive",
    body: "Rendu mathematique propre, saisie naturelle, indices et correction immediate.",
  },
  {
    icon: Database,
    title: "Supabase",
    body: "Sauvegarde des progres, comptes eleves et synchronisation temps reel.",
  },
  {
    icon: BookDashed,
    title: "MDX",
    body: "Lecons redigees comme des cahiers vivants, faciles a enrichir par annee.",
  },
  {
    icon: RadioTower,
    title: "Extensions communautaires",
    body: "Commentaires enseignants, defis de classe et suivi collectif a brancher ensuite.",
  },
];

export default function EcolePage() {
  return (
    <main className="grain-overlay min-h-[100dvh] bg-[var(--foret-nocturne)]">
      <Navbar />
      <EcoleHero />
      
      <section className="section-container relative z-10 -mt-12 mb-10">
        <StudentSummary />
      </section>

      <section className="section-container py-20 md:py-28">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
          <div className="mist-panel rounded-[2rem] p-6 md:p-8">
            <span className="eyebrow">Vision scolaire</span>
            <h2 className="mt-6 font-display text-4xl tracking-[-0.05em] text-[var(--ivoire-ancien)] md:text-6xl">
              Une ecole faite de souffle, de methode et de memoire.
            </h2>
            <p className="mt-5 text-base leading-8 text-[rgba(240,237,229,0.82)] md:text-lg">
              L&apos;Ecole de la Brume n&apos;est pas une annexe technique. C&apos;est une
              extension naturelle du site, un espace ou le savoir scolaire et la
              transmission culturelle avancent ensemble. Les enfants y apprennent
              a compter, lire et raisonner avec des images du territoire, des
              gestes du quotidien et des recits qui les relient a la Lukenie.
            </p>
            <p className="mt-4 text-base leading-8 text-[rgba(212,221,215,0.72)]">
              La structure est volontairement calme, aeree et lisible. Elle
              respecte la gravite patrimoniale du projet tout en introduisant une
              experience interactive de niveau moderne.
            </p>
          </div>

          <div className="mist-panel rounded-[2rem] p-6 md:p-8">
            <div className="flex items-center gap-3 text-[var(--amber-light)]">
              <Waves className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Ce que la page apporte
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {[
                "Une route /ecole integree a la navigation existante.",
                "Un parcours primaire complet : 6 annees du degre elementaire au degre terminal.",
                "Une premiere annee deja demonstrable avec contenu et exercices.",
                "Une base Supabase prete pour la progression, les tentatives et le temps reel.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.48)] px-4 py-4 text-sm leading-7 text-[rgba(240,237,229,0.8)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-container py-10 md:py-16">
        <div className="mb-10 max-w-3xl">
          <span className="eyebrow">Trois rivieres de savoir</span>
          <h2 className="mt-6 font-display text-4xl tracking-[-0.05em] text-[var(--ivoire-ancien)] md:text-6xl">
            Trois rivieres de savoir, une meme maison d apprentissage.
          </h2>
          <p className="mt-5 text-base leading-8 text-[rgba(212,221,215,0.76)] md:text-lg">
            La page pose un cadre complet, mais donne la priorite explicite aux
            mathematiques, avec une progression type Brilliant adaptee au
            contexte Congolais et a la vie Basakata.
          </p>
        </div>
        <KnowledgeRivers rivers={knowledgeRivers} />
      </section>

      <section className="section-container py-20 md:py-24">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
          <article className="mist-panel rounded-[2rem] p-6 md:p-8">
            <span className="eyebrow">Demo premiere annee</span>
            <h2 className="mt-6 font-display text-4xl tracking-[-0.05em] text-[var(--ivoire-ancien)] md:text-5xl">
              Une experience guidee, locale, progressive.
            </h2>
            <p className="mt-5 text-base leading-8 text-[rgba(212,221,215,0.76)] md:text-lg">
              Le contenu MDX permet de gerer les lecons comme un corpus vivant.
              Ci-dessous, la premiere annee montre deja le ton pedagogique, les
              exemples situes et le rendu mathematique.
            </p>

            <div className="mt-8 rounded-[1.8rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.42)] p-5 md:p-6">
              <article className="mdx-lesson">
                <PremiereAnneeIntro />
              </article>
            </div>
          </article>

          <aside className="space-y-4">
            {stackCards.map((card) => (
              <div
                key={card.title}
                className="mist-panel rounded-[1.75rem] p-5 md:p-6"
              >
                <div className="flex items-center gap-3 text-[var(--amber-light)]">
                  <card.icon className="h-5 w-5" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--amber-light)]">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-[rgba(240,237,229,0.78)]">
                  {card.body}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <MathCurriculumSwitcher
        primaryPrograms={primaryPrograms}
        secondaryPrograms={secondairePrograms}
      />

      <section className="section-container pb-24 pt-8 md:pb-32">
        <div className="mist-panel rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:items-end">
            <div>
              <span className="eyebrow">Integration continue</span>
              <h2 className="mt-6 font-display text-4xl tracking-[-0.05em] text-[var(--ivoire-ancien)] md:text-5xl">
                La suite naturelle du site, sans rompre la brume.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[rgba(212,221,215,0.78)] md:text-lg">
                La page est concue pour rester coherente avec la palette, la
                respiration et les composants de Kisakata. Elle peut maintenant
                etre enrichie avec davantage de contenu MDX, des parcours langue
                et histoire, puis des fonctions sociales autour du suivi des
                classes.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                href="/forum"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,221,215,0.12)] px-6 py-3 text-sm font-medium text-[rgba(212,221,215,0.84)] transition-all duration-300 active:scale-[0.98]"
              >
                Ouvrir la communaute
              </Link>
              <Link
                href="/profil"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(196,160,53,0.3)] px-6 py-3 text-sm font-semibold text-[var(--or-ancestral)] transition-all duration-300 active:scale-[0.98]"
              >
                Continuer sur le profil
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
