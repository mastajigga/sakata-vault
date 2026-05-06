"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Volume2, BookOpen, TreePine, Waves } from "lucide-react";

/**
 * Canvas animé de brume — particules qui flottent comme la brume
 * matinale sur la rivière Lukenie.
 */
function BrumeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    const particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      alphaDir: number;
    }[] = [];

    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
    }

    function initParticles(count: number) {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 120 + 40,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2 - 0.15,
          alpha: Math.random() * 0.12,
          alphaDir: Math.random() > 0.5 ? 0.0003 : -0.0003,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;

        if (p.alpha > 0.14 || p.alpha < 0.02) p.alphaDir *= -1;
        if (p.x < -200) p.x = w + 200;
        if (p.x > w + 200) p.x = -200;
        if (p.y < -200) p.y = h + 200;
        if (p.y > h + 200) p.y = -200;

        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gradient.addColorStop(0, `rgba(212, 221, 215, ${p.alpha})`);
        gradient.addColorStop(0.5, `rgba(196, 160, 53, ${p.alpha * 0.4})`);
        gradient.addColorStop(1, "rgba(212, 221, 215, 0)");

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      }

      // Lignes de courant légères entre particules proches
      ctx!.strokeStyle = "rgba(196, 160, 53, 0.04)";
      ctx!.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < 40000) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    initParticles(18);
    draw();

    window.addEventListener("resize", () => {
      resize();
      initParticles(18);
    });

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

const features = [
  {
    icon: TreePine,
    title: "Les Mots de la Forêt",
    desc: "Vocabulaire illustré par la nature Sakata — arbres, rivières, animaux sacrés.",
  },
  {
    icon: Volume2,
    title: "La Voix des Anciens",
    desc: "Prononciation guidée, tons et rythmes du Kisakata authentique.",
  },
  {
    icon: Waves,
    title: "La Rivière des Phrases",
    desc: "Construction progressive, du mot simple à la phrase chantée.",
  },
  {
    icon: BookOpen,
    title: "Proverbes & Sagesses",
    desc: "Les dictons qui portent la mémoire du peuple Basakata.",
  },
];

const niveaux = [
  {
    nom: "Goutte de Rosée",
    slug: "goutte-rosee",
    description: "Premiers sons, salutations, les membres de la famille.",
    mots: "~50 mots",
    couleur: "#C4A035",
  },
  {
    nom: "Ruisseau",
    slug: "ruisseau",
    description: "Phrases simples, couleurs, chiffres, aliments.",
    mots: "~150 mots",
    couleur: "#B59551",
  },
  {
    nom: "Rivière",
    slug: "riviere",
    description: "Conversations, temps, lieux, actions quotidiennes.",
    mots: "~400 mots",
    couleur: "#E9C46A",
  },
  {
    nom: "Lukenie",
    slug: "lukenie",
    description: "Récits, proverbes, narration, langue soutenue.",
    mots: "~800 mots",
    couleur: "#E8C670",
  },
];

export default function LangueHero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* Canvas Brume */}
      <BrumeCanvas />

      {/* Fond dégradé */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,160,53,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(10,31,21,0.9),transparent_70%)]" />

      {/* Orbes flottants décoratifs */}
      <div className="absolute top-[15%] left-[8%] w-64 h-64 rounded-full bg-[rgba(196,160,53,0.06)] blur-3xl" />
      <div className="absolute bottom-[20%] right-[5%] w-80 h-80 rounded-full bg-[rgba(212,221,215,0.04)] blur-3xl" />

      <div className="relative section-container flex min-h-[100dvh] flex-col justify-center py-32">
        <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
          {/* Colonne gauche — Texte */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/20 text-[var(--or-ancestral)] text-xs font-bold uppercase tracking-widest mb-6">
              <Volume2 className="w-3 h-3" />
              Murmures de la Lukenie
            </span>

            <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-[var(--ivoire-ancien)]">
              La Langue
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--or-ancestral)] via-[var(--or-vif)] to-[var(--amber-light)]">
                Kisakata
              </span>
            </h1>

            <p className="mt-6 max-w-[56ch] text-lg leading-8 text-[rgba(240,237,229,0.82)] md:text-xl">
              Chaque mot est une graine plantée par les anciens. Chaque phrase est
              une rivière qui relie les générations. Apprenez le Kisakata comme on
              apprend à marcher dans la forêt : en écoutant, en répétant, en vivant.
            </p>

            <p className="mt-4 max-w-[54ch] text-base leading-8 text-[rgba(212,221,215,0.72)]">
              Des premières salutations aux proverbes profonds, ce cours vous guide
              à travers 4 niveaux, de la Goutte de Rosée au fleuve Lukenie.
            </p>

            {/* Boutons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#niveaux"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(196,160,53,0.4)] bg-[rgba(196,160,53,0.08)] px-6 py-3 text-sm font-semibold text-[var(--or-ancestral)] transition-all duration-300 hover:bg-[rgba(196,160,53,0.16)] active:scale-[0.98]"
              >
                Commencer le voyage
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#methode"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,221,215,0.1)] px-6 py-3 text-sm font-medium text-[rgba(212,221,215,0.84)] transition-all duration-300 hover:border-[rgba(212,221,215,0.2)] active:scale-[0.98]"
              >
                Notre méthode
              </Link>
            </div>
          </motion.div>

          {/* Colonne droite — Carte des piliers */}
          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(10,31,21,0.6)] backdrop-blur-xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 text-[var(--amber-light)]">
              <TreePine className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Les 4 Piliers de l&apos;Apprentissage
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-[1.5rem] border border-[rgba(212,221,215,0.06)] bg-[rgba(4,17,13,0.48)] p-4 hover:border-[rgba(196,160,53,0.2)] transition-all duration-500 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(196,160,53,0.12)] flex items-center justify-center group-hover:bg-[rgba(196,160,53,0.2)] transition-colors">
                      <f.icon className="h-5 w-5 text-[var(--or-ancestral)]" />
                    </div>
                    <h2 className="font-display text-lg text-[var(--ivoire-ancien)]">{f.title}</h2>
                  </div>
                  <p className="mt-3 ml-[52px] text-sm leading-7 text-[rgba(212,221,215,0.72)]">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>

        {/* Niveaux — barre de progression */}
        <motion.div
          id="niveaux"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24"
        >
          <h2 className="text-center font-display text-2xl text-[var(--ivoire-ancien)] mb-10">
            Votre voyage sur la rivière
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {niveaux.map((niveau, idx) => (
              <Link
                key={niveau.slug}
                href={`/langue/lecon/${niveau.slug}`}
                className="group relative rounded-[1.5rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(10,31,21,0.5)] backdrop-blur-sm p-6 hover:border-[rgba(196,160,53,0.3)] transition-all duration-500 overflow-hidden"
              >
                {/* Fond animé au hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${niveau.couleur}10, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Numéro */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-4 text-sm font-bold"
                    style={{
                      background: `${niveau.couleur}20`,
                      color: niveau.couleur,
                      border: `1px solid ${niveau.couleur}40`,
                    }}
                  >
                    {idx + 1}
                  </div>

                  <h3 className="text-lg font-display text-[var(--ivoire-ancien)] group-hover:text-[var(--or-ancestral)] transition-colors">
                    {niveau.nom}
                  </h3>
                  <p className="mt-2 text-sm text-[rgba(212,221,215,0.68)] leading-relaxed">
                    {niveau.description}
                  </p>
                  <p className="mt-3 text-xs text-[rgba(196,160,53,0.7)] font-mono">
                    {niveau.mots}
                  </p>

                  {/* Flèche */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-[rgba(196,160,53,0.5)] group-hover:text-[var(--or-ancestral)] transition-colors">
                    <span>Explorer</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
