"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Sigma } from "lucide-react";
import type { MathematicsProgramYear } from "../data/mathematics-curriculum";
import MathCurriculumStudio from "./MathCurriculumStudio";

type CurriculumLevel = "primaire" | "secondaire";

interface MathCurriculumSwitcherProps {
  primaryPrograms: MathematicsProgramYear[];
  secondaryPrograms: MathematicsProgramYear[];
}

const curriculumOptions: Array<{
  level: CurriculumLevel;
  title: string;
  description: string;
  icon: typeof Sigma;
}> = [
  {
    level: "primaire",
    title: "Primaire",
    description: "Six annees fondamentales pour compter, mesurer et raisonner.",
    icon: GraduationCap,
  },
  {
    level: "secondaire",
    title: "Secondaire",
    description: "Premier cycle et tronc commun avec algebre, geometrie et analyse.",
    icon: Sigma,
  },
];

function resolveLevelFromHash(hash: string): CurriculumLevel {
  return hash === "#mathematiques-secondaire" ? "secondaire" : "primaire";
}

export default function MathCurriculumSwitcher({
  primaryPrograms,
  secondaryPrograms,
}: MathCurriculumSwitcherProps) {
  const [activeLevel, setActiveLevel] = useState<CurriculumLevel>("primaire");

  useEffect(() => {
    const syncLevelWithHash = () => {
      setActiveLevel(resolveLevelFromHash(window.location.hash));
    };

    syncLevelWithHash();
    window.addEventListener("hashchange", syncLevelWithHash);

    return () => window.removeEventListener("hashchange", syncLevelWithHash);
  }, []);

  const activePrograms = useMemo(
    () => (activeLevel === "primaire" ? primaryPrograms : secondaryPrograms),
    [activeLevel, primaryPrograms, secondaryPrograms]
  );

  const handleLevelChange = (level: CurriculumLevel) => {
    setActiveLevel(level);
    const hash =
      level === "secondaire" ? "#mathematiques-secondaire" : "#mathematiques";
    window.history.replaceState(null, "", hash);
  };

  return (
    <section className="relative py-16 md:py-20">
      <div
        id="mathematiques"
        className="pointer-events-none absolute -top-24 h-px w-px opacity-0"
        aria-hidden="true"
      />
      <div
        id="mathematiques-secondaire"
        className="pointer-events-none absolute -top-24 h-px w-px opacity-0"
        aria-hidden="true"
      />

      <div className="section-container">
        <div className="mb-8 max-w-4xl">
          <span className="eyebrow">Parcours mathematiques</span>
          <h2 className="mt-6 font-display text-4xl tracking-[-0.05em] text-[var(--ivoire-ancien)] md:text-6xl">
            Choisir un cycle avant d&apos;entrer dans le studio.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[rgba(212,221,215,0.76)] md:text-lg">
            Le primaire et le secondaire ont maintenant chacun leur espace.
            Vous choisissez le niveau, puis la progression n&apos;affiche que les
            programmes, cours et chapitres de ce cycle.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {curriculumOptions.map((option) => {
            const Icon = option.icon;
            const isActive = option.level === activeLevel;

            return (
              <button
                key={option.level}
                type="button"
                onClick={() => handleLevelChange(option.level)}
                className="group rounded-[1.75rem] border px-5 py-5 text-left transition-all duration-300 active:scale-[0.99]"
                style={{
                  borderColor: isActive
                    ? "rgba(196, 160, 53, 0.34)"
                    : "rgba(212, 221, 215, 0.12)",
                  background: isActive
                    ? "linear-gradient(180deg, rgba(196,160,53,0.16) 0%, rgba(4,17,13,0.72) 100%)"
                    : "rgba(4,17,13,0.45)",
                }}
                aria-pressed={isActive}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(196,160,53,0.18)] bg-[rgba(196,160,53,0.08)]">
                      <Icon className="h-5 w-5 text-[var(--or-ancestral)]" />
                    </div>
                    <h3 className="mt-4 font-display text-2xl tracking-tight text-[var(--ivoire-ancien)]">
                      {option.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-[rgba(212,221,215,0.12)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.72)]">
                    {isActive ? "Actif" : "Choisir"}
                  </span>
                </div>
                <p className="mt-3 max-w-[34ch] text-sm leading-7 text-[rgba(212,221,215,0.76)]">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <MathCurriculumStudio programs={activePrograms} level={activeLevel} />
    </section>
  );
}
