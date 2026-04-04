"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Deterministic particle data — avoids SSR/client hydration mismatch */
const PARTICLES = [
  { w: 4.2, op: 0.42, x: 15, y: 28, delay: 0.8, dur: 7.2 },
  { w: 5.8, op: 0.55, x: 32, y: 45, delay: 2.1, dur: 9.4 },
  { w: 3.5, op: 0.38, x: 58, y: 35, delay: 4.5, dur: 8.1 },
  { w: 6.1, op: 0.48, x: 75, y: 52, delay: 1.3, dur: 10.8 },
  { w: 4.8, op: 0.36, x: 22, y: 62, delay: 3.7, dur: 7.9 },
  { w: 3.2, op: 0.52, x: 48, y: 25, delay: 5.2, dur: 11.2 },
  { w: 5.4, op: 0.44, x: 65, y: 70, delay: 0.4, dur: 8.6 },
  { w: 4.0, op: 0.58, x: 85, y: 40, delay: 2.8, dur: 9.0 },
  { w: 6.5, op: 0.35, x: 40, y: 58, delay: 4.0, dur: 7.5 },
  { w: 3.8, op: 0.50, x: 55, y: 32, delay: 1.9, dur: 10.1 },
  { w: 5.1, op: 0.41, x: 28, y: 75, delay: 3.3, dur: 8.8 },
  { w: 4.5, op: 0.46, x: 72, y: 22, delay: 5.8, dur: 9.7 },
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      gsap.from(elements, {
        duration: 1.2,
        y: 60,
        opacity: 0,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.4,
      });

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
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover video-mask"
          style={{
            filter: "brightness(0.3) contrast(1.1)",
            willChange: "transform",
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
          className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-24 text-left z-10"
          style={{ maxWidth: "1400px", margin: "0 auto" }}
        >
          <span className="eyebrow mb-8">Patrimoine du Mai-Ndombe</span>

          <h1
            className="font-display mb-6 font-bold flex flex-wrap items-center gap-x-4"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "var(--ivoire-ancien)",
              letterSpacing: "-0.04em",
              maxWidth: "18ch",
              lineHeight: "1.1",
            }}
          >
            <span>La riviere</span>
            <span 
               className="inline-block w-[1.2em] h-[0.9em] rounded-full overflow-hidden border border-or/20 rotate-[-4deg] translate-y-[0.1em]"
               style={{ 
                 backgroundImage: 'url("/images/sakata_mask_detail.png")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}
            />
            <span>ne s&apos;arrete jamais de couler</span>
          </h1>

          <p
            className="font-body mb-12"
            style={{
              maxWidth: "48ch",
              opacity: 0.7,
              fontSize: "clamp(1rem, 1.2vw, 1.25rem)",
              color: "var(--ivoire-ancien)",
              lineHeight: "1.7",
            }}
          >
            Bienvenue sur le portail de transmission des savoirs du peuple
            Sakata. Histoire, langue et sagesse unies dans un espace ou la foret
            rencontre le monde moderne.
          </p>

          <a
            href="/savoir"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm transition-all border border-or"
            style={{
              background: "transparent",
              color: "var(--or-ancestral)",
              transitionDuration: "var(--duration-base)",
              transitionTimingFunction: "var(--ease-smooth)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--or-ancestral)";
              (e.currentTarget as HTMLElement).style.color = "var(--foret-nocturne)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--or-ancestral)";
            }}
          >
            Explorer le Savoir
          </a>
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
