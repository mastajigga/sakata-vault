"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, GraduationCap, Sigma } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const metrics = [
  { label: "Rivières de savoir", value: "3" },
  { label: "Années couvertes", value: "6" },
  { label: "Progression sauvegardée", value: "Supabase + local" },
];

export default function EcoleHero() {
  const { user, profile } = useAuth();
  const [videoReady, setVideoReady] = useState(false);

  const studentName = profile?.nickname || profile?.username || user?.email?.split('@')[0];

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* Background Video with inward gradient mask */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
          style={{
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
            opacity: videoReady ? 0.5 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <source src="/videos/ecole_bg_587.mp4" type="video/mp4" />
        </video>
        {/* Color overlay to merge smoothly with the site's dark forest background below */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,221,215,0.1),transparent_28%),radial-gradient(circle_at_right,rgba(196,160,53,0.1),transparent_22%),linear-gradient(180deg,transparent_0%,#0A1F15_82%,#081811_100%)] mix-blend-multiply" />
      </div>
      <div className="river-curve left-[-10%] top-[18%] h-[18rem] w-[44rem]" />
      <div className="river-curve right-[-14%] top-[34%] h-[22rem] w-[52rem]" />
      <div className="river-curve left-[12%] bottom-[8%] h-[12rem] w-[30rem]" />
      <div className="absolute right-[8%] top-[18%] h-48 w-48 rounded-full bg-[rgba(212,221,215,0.1)] blur-3xl" />
      <div className="absolute left-[10%] bottom-[16%] h-48 w-56 rounded-full bg-[rgba(196,160,53,0.12)] blur-3xl" />

      <div className="relative section-container flex min-h-[100dvh] flex-col justify-center py-32">
        <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow">
              {user ? `Bienvenue, ${studentName}` : "Sanctuaire vivant de transmission"}
            </span>
            <h1 className="mt-8 max-w-[12ch] font-display text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.92] tracking-[-0.06em] text-[var(--ivoire-ancien)]">
              L’École de la Brume
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-8 text-[rgba(240,237,229,0.82)] md:text-xl">
              Où la langue Kisakata, les mathématiques du pays et l’histoire précoloniale coulent comme la Lukenie pour nourrir les générations futures.
            </p>
            <p className="mt-6 max-w-[58ch] text-base leading-8 text-[rgba(212,221,215,0.74)]">
              L’école est pensée comme une maison de brume calme, ouverte aux enfants, aux familles et aux gardiens du savoir. On y apprend avec la main, la voix, la mémoire et le raisonnement, dans une esthétique douce qui respecte le souffle du territoire Sakata.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#mathematiques"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(196,160,53,0.3)] px-6 py-3 text-sm font-semibold text-[var(--or-ancestral)] transition-all duration-300 active:scale-[0.98]"
              >
                {user ? "Continuer mon apprentissage" : "Entrer dans l’atelier mathématique"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {!user && (
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,221,215,0.12)] px-6 py-3 text-sm font-medium text-[rgba(212,221,215,0.84)] transition-all duration-300 active:scale-[0.98]"
                >
                  Créer un compte pour sauvegarder sa progression
                </Link>
              )}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mist-panel rounded-[2rem] p-6 md:p-8"
          >
            <div className="flex items-center gap-3 text-[var(--amber-light)]">
              <GraduationCap className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Programme poétique et rigoureux</p>
            </div>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: BookOpenText,
                  title: "Langue",
                  body: "Lecture, oralité, lexiques de la rivière, proverbes et diction claire.",
                },
                {
                  icon: Sigma,
                  title: "Mathématiques",
                  body: "Théorie guidée, exercices interactifs, indices, correction immédiate.",
                },
                {
                  icon: GraduationCap,
                  title: "Histoire",
                  body: "Chefferies, repères de temps, mémoire précoloniale et transmission orale.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.48)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-[var(--or-ancestral)]" />
                    <h2 className="font-display text-xl text-[var(--ivoire-ancien)]">{item.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[rgba(212,221,215,0.76)]">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.35rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(4,17,13,0.48)] px-4 py-4"
                >
                  <p className="font-display text-xl text-[var(--ivoire-ancien)]">{metric.value}</p>
                  <p className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-[rgba(212,221,215,0.54)]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
