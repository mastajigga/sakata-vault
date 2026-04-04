"use client";

import React, { useEffect, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import { ARTICLES } from "@/data/articles";
import { motion } from "framer-motion";

const ArticlePage = () => {
  const { slug } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!article) return;

    const ctx = gsap.context(() => {
      // Fade in title with stagger
      gsap.from(".char", {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: "power4.out",
        delay: 0.5
      });
      
      // Video parallax
      gsap.to(videoRef.current, {
        scrollTrigger: {
          trigger: "section",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: "20%",
        scale: 1.1
      });
    });

    return () => ctx.revert();
  }, [article]);

  if (!article) return notFound();

  return (
    <main className="grain-overlay min-h-screen bg-foret-nocturne">
      <Navbar />
      
      {/* Article Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          style={{ filter: "brightness(0.6) contrast(1.1)" }}
        >
          <source src={article.videoBackground} type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F15] via-transparent to-[#0A1F15]/80" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="eyebrow mb-6 inline-block" style={{ color: "var(--or-ancestral)" }}>
            Savoir — {article.category}
          </span>
          <h1 
            ref={titleRef}
            className="font-display font-bold leading-tight"
            style={{ 
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)", 
              color: "var(--ivoire-ancien)",
              letterSpacing: "-0.04em" 
            }}
          >
            {article.title.split("").map((char, i) => (
              <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
            ))}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="relative py-24 px-8 md:px-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          
          {/* Main Column */}
          <div className="md:col-span-7 lg:col-span-8">
            <div 
              className="font-body prose prose-invert max-w-none space-y-8"
              style={{ color: "rgba(242, 238, 221, 0.82)" }}
              dangerouslySetInnerHTML={{ 
                __html: article.content
                  .replace(/## (.*)/g, '<h2 class="font-display text-2xl font-bold mt-12 mb-4 text-ivoire-ancien">$1</h2>')
                  .replace(/\*\*(.*)\*\*/g, '<strong class="text-or-ancestral font-bold">$1</strong>')
                  .replace(/\n/g, "<br />")
              }}
            />

          </div>

          {/* Sidebar / Image Column (Asymmetric) */}
          <div className="md:col-span-5 lg:col-span-4 md:sticky md:top-32 h-fit">
            <div 
              className="p-2 rounded-[2rem] overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.2)"
              }}
            >
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-auto rounded-[1.8rem] opacity-60"
              />
              <div className="p-8">
                <p className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
                  Contexte Culturel
                </p>
                <p className="text-sm opacity-60 leading-relaxed italic">
                   &quot;{article.summary}&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Nav */}
      <section className="py-24 text-center border-t border-white/5 bg-[#0A1F15]">
        <a 
          href="/#savoir"
          className="font-display text-2xl hover:text-or transition-colors flex items-center justify-center gap-4 group"
          style={{ color: "var(--ivoire-ancien)" }}
        >
          <span className="opacity-40 text-sm group-hover:translate-x-[-10px] transition-transform">←</span>
          Retour aux Savoirs
        </a>
      </section>
    </main>
  );
};

export default ArticlePage;
