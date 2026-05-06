"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";

interface MotSakata {
  id: string;
  kisakata: string;
  francais: string;
  emoji: string;
  phonetique: string;
  categorie: string;
}

const VOCABULAIRE: MotSakata[] = [
  {
    id: "mbote",
    kisakata: "Mbóte",
    francais: "Bonjour",
    emoji: "👋",
    phonetique: "m-BOH-teh",
    categorie: "Salutations",
  },
  {
    id: "toko",
    kisakata: "Tókó",
    francais: "Ça va / D'accord",
    emoji: "👍",
    phonetique: "TOH-koh",
    categorie: "Salutations",
  },
  {
    id: "nkoko",
    kisakata: "Nkókó",
    francais: "Grand-père / Ancêtre",
    emoji: "👴",
    phonetique: "n-KOH-koh",
    categorie: "Famille",
  },
  {
    id: "zamba",
    kisakata: "Zámba",
    francais: "Forêt",
    emoji: "🌳",
    phonetique: "ZAHM-bah",
    categorie: "Nature",
  },
  {
    id: "ebale",
    kisakata: "Ebale",
    francais: "Rivière",
    emoji: "🌊",
    phonetique: "eh-BAH-leh",
    categorie: "Nature",
  },
  {
    id: "mboka",
    kisakata: "Mbóka",
    francais: "Village",
    emoji: "🏘️",
    phonetique: "m-BOH-kah",
    categorie: "Lieux",
  },
  {
    id: "makemba",
    kisakata: "Mákémbá",
    francais: "Bananes",
    emoji: "🍌",
    phonetique: "MAH-kem-bah",
    categorie: "Nourriture",
  },
  {
    id: "lobi",
    kisakata: "Lóbí",
    francais: "Demain",
    emoji: "☀️",
    phonetique: "LOH-bee",
    categorie: "Temps",
  },
];

/**
 * Canvas p5.js en mode instance pour l'animation des cartes mémoire.
 * Les particules forment des vagues dorées, et les lettres du mot
 * apparaissent comme des lucioles dans la brume.
 */
function VocabulaireCanvas({
  mot,
  flipped,
  onFlip,
}: {
  mot: MotSakata;
  flipped: boolean;
  onFlip: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    // Nettoyage
    return () => cancelAnimationFrame(animRef.current);
  }, [mot.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    interface Particule {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      seed: number;
    }

    const particles: Particule[] = [];
    const PARTICLE_COUNT = 40;

    function resize() {
      const rect = container!.getBoundingClientRect();
      w = canvas!.width = rect.width;
      h = canvas!.height = rect.height;
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 3 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.3 - 0.5,
          alpha: Math.random() * 0.5 + 0.3,
          seed: Math.random() * 100,
        });
      }
    }

    resize();
    initParticles();

    function draw() {
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx!.clearRect(0, 0, w, h);

      // Fond brumeux
      const bgGrad = ctx!.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      bgGrad.addColorStop(0, "rgba(196, 160, 53, 0.06)");
      bgGrad.addColorStop(1, "rgba(10, 31, 21, 0.3)");
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, w, h);

      // Particules lucioles
      for (const p of particles) {
        p.x += p.vx + Math.sin(t * 0.5 + p.seed) * 0.3;
        p.y += p.vy + Math.cos(t * 0.7 + p.seed) * 0.2;

        if (p.y < -50) p.y = h + 50;
        if (p.y > h + 50) p.y = -50;
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;

        const pulse = Math.sin(t * 2 + p.seed) * 0.3 + 0.7;
        const alpha = p.alpha * pulse;

        const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `rgba(233, 196, 106, ${alpha})`);
        glow.addColorStop(0.5, `rgba(196, 160, 53, ${alpha * 0.5})`);
        glow.addColorStop(1, "rgba(196, 160, 53, 0)");

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();
      }

      // Mot Kisakata en grand — avec glow animé
      if (!flipped) {
        const wordGlow = Math.sin(t * 1.5) * 0.4 + 0.6;
        ctx!.save();
        ctx!.font = `bold ${Math.min(w * 0.16, 64)}px "Outfit", system-ui, sans-serif`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";

        // Glow
        ctx!.shadowColor = `rgba(196, 160, 53, ${wordGlow})`;
        ctx!.shadowBlur = 30;
        ctx!.fillStyle = "#F0EDE5";
        ctx!.fillText(mot.kisakata, w / 2, h / 2 - 20);
        ctx!.shadowBlur = 0;

        // Sous-titre
        ctx!.font = `${Math.min(w * 0.04, 16)}px "Outfit", system-ui, sans-serif`;
        ctx!.fillStyle = "rgba(212, 221, 215, 0.5)";
        ctx!.fillText("Cliquez pour révéler →", w / 2, h / 2 + 40);

        // Emoji flottant
        ctx!.font = `${Math.min(w * 0.14, 56)}px sans-serif`;
        ctx!.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx!.fillText(mot.emoji, w / 2, h / 2 + 80);
      } else {
        // Carte retournée — traduction
        ctx!.save();
        ctx!.font = `bold ${Math.min(w * 0.16, 64)}px "Outfit", system-ui, sans-serif`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillStyle = "#C4A035";
        ctx!.fillText(mot.francais, w / 2, h / 2 - 30);

        ctx!.font = `${Math.min(w * 0.05, 20)}px "Outfit", system-ui, sans-serif`;
        ctx!.fillStyle = "rgba(212, 221, 215, 0.7)";
        ctx!.fillText(mot.phonetique, w / 2, h / 2 + 20);

        ctx!.font = `${Math.min(w * 0.1, 40)}px sans-serif`;
        ctx!.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx!.fillText(mot.emoji, w / 2, h / 2 + 70);
        ctx!.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [mot, flipped]);

  return (
    <div
      ref={containerRef}
      onClick={onFlip}
      className="relative w-full aspect-[4/3] rounded-[2rem] border border-[rgba(212,221,215,0.08)] overflow-hidden cursor-pointer group"
      style={{ background: "rgba(10, 31, 21, 0.9)" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Indicateur de clic */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[rgba(212,221,215,0.3)] group-hover:text-[rgba(212,221,215,0.6)] transition-colors">
        {flipped ? "Cliquez pour voir le mot →" : "← Cliquez pour la traduction"}
      </div>
    </div>
  );
}

/** Composant principal : vocabulaire interactif */
export default function VocabulaireSection() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const mot = VOCABULAIRE[index];

  const nextWord = useCallback(() => {
    setIndex((i) => (i + 1) % VOCABULAIRE.length);
    setFlipped(false);
  }, []);

  const prevWord = useCallback(() => {
    setIndex((i) => (i - 1 + VOCABULAIRE.length) % VOCABULAIRE.length);
    setFlipped(false);
  }, []);

  const randomWord = useCallback(() => {
    let newIdx;
    do {
      newIdx = Math.floor(Math.random() * VOCABULAIRE.length);
    } while (newIdx === index && VOCABULAIRE.length > 1);
    setIndex(newIdx);
    setFlipped(false);
  }, [index]);

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,31,21,0.9),transparent_70%)]" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/20 text-[var(--or-ancestral)] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" />
            Démo interactive
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--ivoire-ancien)]">
            Les Mots de la Brume
          </h2>
          <p className="mt-4 text-[rgba(212,221,215,0.72)] max-w-xl mx-auto">
            Cartes mémoire interactives. Chaque mot est une luciole qui brille
            dans la nuit de la forêt. Cliquez pour révéler, glissez pour naviguer.
          </p>
        </motion.div>

        <div className="max-w-lg mx-auto">
          {/* Carte */}
          <motion.div
            key={mot.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <VocabulaireCanvas
              mot={mot}
              flipped={flipped}
              onFlip={() => setFlipped(!flipped)}
            />
          </motion.div>

          {/* Catégorie */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(196,160,53,0.08)] border border-[rgba(196,160,53,0.15)] text-[var(--or-ancestral)] text-xs">
              {mot.categorie}
            </span>
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevWord}
              className="w-10 h-10 rounded-full border border-[rgba(212,221,215,0.1)] flex items-center justify-center text-[rgba(212,221,215,0.7)] hover:border-[rgba(196,160,53,0.3)] hover:text-[var(--or-ancestral)] transition-all"
            >
              ←
            </button>

            <button
              onClick={randomWord}
              className="w-10 h-10 rounded-full border border-[rgba(212,221,215,0.1)] flex items-center justify-center text-[rgba(212,221,215,0.5)] hover:border-[rgba(196,160,53,0.3)] hover:text-[var(--or-ancestral)] transition-all"
              title="Mot aléatoire"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={nextWord}
              className="w-10 h-10 rounded-full border border-[rgba(212,221,215,0.15)] flex items-center justify-center text-[rgba(212,221,215,0.8)] hover:border-[rgba(196,160,53,0.4)] hover:text-[var(--or-ancestral)] transition-all"
            >
              →
            </button>
          </div>

          {/* Compteur */}
          <p className="text-center text-xs text-[rgba(212,221,215,0.3)] mt-4">
            {index + 1} / {VOCABULAIRE.length}
          </p>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="#niveaux"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/30 text-[var(--or-ancestral)] text-sm font-semibold hover:bg-[var(--or-ancestral)]/20 transition-all"
          >
            Accéder au cours complet
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
