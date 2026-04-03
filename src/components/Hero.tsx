"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Background video scroll-linked zoom effect
      gsap.to(videoRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        scale: 1.2,
        opacity: 0.5,
        filter: "blur(10px)",
      });

      // Majestic entrance for the title
      gsap.from(titleRef.current, {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: "power4.out",
        delay: 0.5,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200vh] w-full bg-[var(--background)]">
      {/* Video Container - Fixed for scrub effect */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover brightness-[0.4]"
        >
          {/* Using a high-quality placeholder for now */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-mountain-97-large.mp4" type="video/mp4" />
        </video>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
          <h1 ref={titleRef} className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-6">
            L'ÂME DU<br />
            <span className="text-gradient">MAI-NDOMBE</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl opacity-60 font-light leading-relaxed mb-12">
            Bienvenue sur le portail de transmission des savoirs du peuple Sakata. 
            Histoire, langue, spiritualité et communauté unies dans un espace 
            moderne dédié à notre héritage vivant.
          </p>
          
          <div className="flex gap-4">
            <button className="glass-card px-8 py-4 px-8 py-4 font-bold border border-[var(--sakata-gold)] text-[var(--sakata-gold)] hover:bg-[var(--sakata-gold)] hover:text-black transition-smooth">
              Explorer le Savoir
            </button>
          </div>
        </div>
        
        {/* Bottom indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-pulse">
           <span className="text-xs font-bold tracking-widest uppercase">Découvrir l'histoire</span>
           <div className="w-px h-12 bg-white"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
