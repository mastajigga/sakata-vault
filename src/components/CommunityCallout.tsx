"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

const CommunityCallout = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Video parallax and blur on scroll
      gsap.to(videoRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: "20%",
        scale: 1.1,
        filter: "blur(4px) brightness(0.4)",
      });

      // Content reveal
      const elements = contentRef.current!.children;
      gsap.from(elements, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        duration: 1.2,
        y: 60,
        opacity: 0,
        stagger: 0.2,
        ease: "power4.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        background: "var(--foret-nocturne)",
        padding: "10rem 0",
      }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "brightness(0.5) contrast(1.1)",
            willChange: "transform",
          }}
        >
          <source src="/videos/wan-iluo-into-the-eyes.mp4" type="video/mp4" />
        </video>

        {/* Inward Radial Mask */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              circle at center,
              transparent 0%,
              rgba(10, 31, 21, 0.4) 40%,
              #0A1F15 90%
            )`,
          }}
        />

        {/* Edge Transitions */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "20%",
            background: "linear-gradient(to bottom, #0A1F15 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "20%",
            background: "linear-gradient(to top, #0A1F15 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Content Layer - Asymmetric Layout (Stitch Taste) */}
      <div
        className="relative z-10 w-full px-8 md:px-24 mx-auto"
        style={{ maxWidth: "1400px" }}
      >
        <div 
          ref={contentRef}
          className="max-w-[600px] md:ml-[10%]"
        >
          <span className="eyebrow mb-6 block" style={{ color: "var(--or-ancestral)" }}>
            {t("community.eyebrow")}
          </span>
          
          <h2
            className="font-display mb-8 font-bold leading-tight"
            style={{ 
              fontSize: "clamp(2.5rem, 5vw, 4rem)", 
              color: "var(--ivoire-ancien)",
              letterSpacing: "-0.03em"
            }}
          >
            {t("community.title")}
          </h2>
          
          <p
            className="font-body mb-12"
            style={{
              fontSize: "clamp(1.1rem, 1.3vw, 1.4rem)",
              lineHeight: "1.6",
              opacity: 0.8,
              color: "var(--ivoire-ancien)",
              maxWidth: "45ch"
            }}
          >
            {t("community.p")}
          </p>

          <button
            className="group glass-card inline-flex items-center gap-4 px-10 py-5 rounded-full font-bold transition-all border border-or/30 shadow-lg"
            style={{
              background: "rgba(242, 238, 221, 0.03)",
              color: "var(--or-ancestral)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--or-ancestral)";
              (e.currentTarget as HTMLElement).style.color = "var(--foret-nocturne)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(242, 238, 221, 0.03)";
              (e.currentTarget as HTMLElement).style.color = "var(--or-ancestral)";
            }}
          >
            {t("community.cta")}
            <ArrowRight
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunityCallout;
