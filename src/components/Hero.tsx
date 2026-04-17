"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Deterministic particle data — avoids SSR/client hydration mismatch */
const PARTICLES = [
  { w: 4.2, op: 0.42, x: 15, y: 28, delay: 0.8, dur: 7.2 },
  { w: 5.8, op: 0.55, x: 32, y: 45, delay: 2.1, dur: 9.4 },
  { w: 3.5, op: 0.38, x: 58, y: 35, delay: 4.5, dur: 8.1 },
  { w: 6.1, op: 0.48, x: 75, y: 52, delay: 1.3, dur: 10.8 },
  { w: 4.8, op: 0.36, x: 22, y: 62, delay: 3.7, dur: 7.9 },
  { w: 3.2, op: 0.52, x: 48, y: 25, delay: 5.2, dur: 11.2 },
  { w: 4.4, op: 0.44, x: 65, y: 70, delay: 0.4, dur: 8.6 },
  { w: 4.0, op: 0.58, x: 85, y: 40, delay: 2.8, dur: 9.0 },
  { w: 6.5, op: 0.35, x: 40, y: 58, delay: 4.0, dur: 7.5 },
  { w: 3.8, op: 0.50, x: 55, y: 32, delay: 1.9, dur: 10.1 },
  { w: 5.1, op: 0.41, x: 28, y: 75, delay: 3.3, dur: 8.8 },
  { w: 4.5, op: 0.46, x: 72, y: 22, delay: 5.8, dur: 9.7 },
];

const Hero = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = React.useState(false);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(videoRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        scale: 1.15,
        filter: "blur(8px) brightness(0.2)",
      });

      const elements = contentRef.current!.children;
      gsap.fromTo(elements, 
        { y: 60, opacity: 0 },
        {
          duration: 1.2,
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.4,
        }
      );

      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "20% top",
          end: "60% top",
          scrub: 1,
        },
        y: -80,
        opacity: 0,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "180vh" }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* Dark placeholder — visible until video is ready to play */}
        {!videoReady && (
          <div className="absolute inset-0 bg-[var(--foret-nocturne)]" />
        )}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover video-mask"
          style={{
            filter: "brightness(0.3) contrast(1.1)",
            willChange: "transform",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <source src="/videos/iluo-into-the-eyes.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse 70% 70% at center,
              transparent 30%,
              rgba(10, 31, 21, 0.5) 60%,
              #0A1F15 100%
            )`,
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "40%",
            background: "linear-gradient(to top, #0A1F15 0%, transparent 100%)",
          }}
        />

        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-24 text-left z-10 pb-[env(safe-area-inset-bottom,2rem)] md:pb-0"
          style={{ maxWidth: "1400px", margin: "0 auto" }}
        >
          <span className="eyebrow mb-6 text-white/50 text-[10px] md:text-sm tracking-[0.3em] uppercase">{t("hero.eyebrow")}</span>

          <h1
            className="font-display mb-6 font-bold flex flex-wrap items-center gap-x-4"
            style={{
              fontSize: "clamp(2.25rem, 8vw, 4.5rem)",
              color: "var(--ivoire-ancien)",
              letterSpacing: "-0.04em",
              maxWidth: "18ch",
              lineHeight: "1.05",
            }}
          >
            {t("hero.title")}
          </h1>

          <p
            className="font-body mb-10 text-balance"
            style={{
              maxWidth: "40ch",
              opacity: 0.6,
              fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)",
              color: "var(--ivoire-ancien)",
              lineHeight: "1.6",
            }}
          >
            {t("hero.subtitle")}
          </p>

          <Link
            href="/savoir"
            className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all overflow-hidden"
            style={{
              border: "1px solid rgba(233, 196, 106, 0.3)",
              color: "var(--or-ancestral)",
            }}
          >
            <div className="absolute inset-0 bg-or-ancestral translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="relative z-10 group-hover:text-[#0A1F15] transition-colors duration-500">
              {t("hero.cta")}
            </span>
            <svg 
              width="14" height="14" viewBox="0 0 14 14" fill="none" 
              className="relative z-10 stroke-or-ancestral group-hover:stroke-[#0A1F15] transition-all duration-500 group-hover:translate-x-1"
            >
              <path d="M1 7h12M9 3l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${p.w}px`,
                height: `${p.w}px`,
                background: `radial-gradient(circle, var(--or-ancestral), transparent)`,
                opacity: p.op,
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
