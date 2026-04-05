"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, notFound } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/components/AuthProvider";
import { ARTICLES } from "@/data/articles";
import StructuredData from "@/components/StructuredData";
import LikeButton from "@/components/LikeButton";
import { Eye } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ArticlePage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      console.log(`Fetching article for slug: ${slug}...`);
      try {
        // TEMP: Force static long version for Ngongo (user request: long version now)
        if (slug === 'rite-ngongo-sagesse') {
          const staticArticle = ARTICLES.find(a => a.slug === slug);
          if (staticArticle) {
            console.log("Using long static version for rite-ngongo-sagesse");
            setArticle(staticArticle);
            setLoading(false);
            return;
          }
        }

        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (error) {
          console.warn("Supabase Error or missing row:", error.message);
          // Fallback to static data
          const staticArticle = ARTICLES.find(a => a.slug === slug);
          if (staticArticle) {
            console.log("Found article in static data fallback.");
            setArticle(staticArticle);
          }
        } else if (data) {
          console.log("Article loaded from DB.");
          setArticle(data);
        }
      } catch (err) {
        console.error("Fetch exception:", err);
        // Fallback to static data
        const staticArticle = ARTICLES.find(a => a.slug === slug);
        if (staticArticle) {
          setArticle(staticArticle);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

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
      if (videoRef.current) {
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
      }
    });

    return () => ctx.revert();
  }, [article, language]);

  // Read tracking
  useEffect(() => {
    if (!article || !article.id) return;
    
    const trackRead = async () => {
      // Increment reads_count in Supabase
      const { error } = await supabase.rpc('increment_article_reads', { article_id: article.id });
      if (error) {
        // Fallback if RPC not defined yet (I'll define it in next step or use simple update)
        await supabase
          .from("articles")
          .update({ reads_count: (article.reads_count || 0) + 1 })
          .eq("id", article.id);
      }
    };
    
    // Only track if it looks like a real read (stay 2s)
    const timer = setTimeout(trackRead, 2000);
    return () => clearTimeout(timer);
  }, [article?.id]);

  if (loading) return (
    <div className="min-h-[100dvh] bg-foret-nocturne flex items-center justify-center">
      <div className="animate-pulse text-or-ancestral font-mono tracking-widest uppercase">
        Invocation du récit...
      </div>
    </div>
  );

  if (!article) return notFound();

  const displayTitle = article.title[language] || article.title.fr || "";
  const displayContent = article.content[language] || article.content.fr || "";
  const displaySummary = article.summary[language] || article.summary.fr || "";

  // SVG Icons in site style (ancestral forest theme)
  const OralIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-or-ancestral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-.5-15a3.5 3.5 0 10-7 0v4a3.5 3.5 0 007 0V6z" /></svg>`;
  const EcritIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-or-ancestral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18 9.246 18 10.832 18.477 12 19.253zm0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18 14.754 18 13.168 18.477 12 19.253z" /></svg>`;
  const TerrainIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-or-ancestral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1v-5m10-10l2 2m-2-2v10a1 1 0 01-1 1v-5m-6 0a1 1 0 001-1v5" /></svg>`;

  return (
    <main className="grain-overlay min-h-[100dvh] bg-foret-nocturne">
      <Navbar />
      
      <StructuredData 
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": displayTitle,
          "description": displaySummary,
          "image": article.featured_image || "",
          "author": {
            "@type": "Organization",
            "name": "Kisakata.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Sakata Digital Hub",
            "logo": {
              "@type": "ImageObject",
              "url": "https://kisakata.com/logo.png"
            }
          },
          "datePublished": article.created_at,
          "inLanguage": language
        }}
      />
      
      {/* Article Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0A1F15]">
           {article.featured_image ? (
             <img 
               src={article.featured_image} 
               alt={displayTitle}
               className="absolute inset-0 w-full h-full object-cover opacity-40"
               style={{ filter: "brightness(0.6) contrast(1.1)" }}
             />
           ) : (
             <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                style={{ filter: "brightness(0.6) contrast(1.1)" }}
              >
                <source src="/videos/hero-bg.mp4" type="video/mp4" />
              </video>
           )}
        </div>
        
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
            {displayTitle.split("").map((char: string, i: number) => (
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
              className="font-body prose prose-invert max-w-none space-y-12"
              style={{ color: "rgba(242, 238, 221, 0.82)" }}
              dangerouslySetInnerHTML={{ 
                __html: displayContent
                  .replace(/## (.*)/g, '<h2 class="font-display text-3xl font-bold mt-16 mb-6 text-ivoire-ancien border-b border-white/5 pb-4">$1</h2>')
                  .replace(/\*\*(.*)\*\*/g, '<strong class="text-or-ancestral font-bold">$1</strong>')
                  .replace(/\n\n/g, '<div class="h-8"></div>')
                  .replace(/\n/g, "<br />")
              }}
            />

          </div>

          {/* Sidebar / Image Column (Asymmetric) - 2 images */}
          <div className="md:col-span-5 lg:col-span-4 md:sticky md:top-32 h-fit space-y-8">
            {/* First image - Mask / Ritual */}
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
                src={(article.featured_image || "").replace('/articles/media/', '/media/') || "/media/Image/flore/ngongo-mask.jpg"} 
                alt={displayTitle}
                className="w-full h-auto rounded-[1.8rem]"
                onError={(e) => {
                  e.currentTarget.src = "/images/sakata_mask_detail.png";
                }}
              />
            </div>

            {/* Second image - Forest / Initiation */}
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
                src="/images/forest-river.jpg" 
                alt="Forêt sacrée du Mai-Ndombe"
                className="w-full h-auto rounded-[1.8rem]"
                onError={(e) => {
                  e.currentTarget.src = "/images/sakata_mask_detail.png";
                }}
              />
            </div>

            <div className="p-8 bg-[#0A1F15]/60 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-or-ancestral">
                   <Eye size={16} />
                   <span className="text-sm font-mono">{article.reads_count || 0}</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest opacity-40">
                  {t("article.reads")}
                </span>
              </div>
              
              <LikeButton 
                articleId={article.id} 
                initialLikes={article.likes_count || 0} 
              />

              <div className="pt-4 mt-4 border-t border-white/5">
                <p className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
                  Contexte Culturel
                </p>
                <p className="text-sm opacity-60 leading-relaxed italic">
                  &quot;{displaySummary}&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Nav */}
      <section className="py-24 text-center border-t border-white/5 bg-[#0A1F15]">
        <a 
          href="/savoir"
          className="font-display text-2xl hover:text-or transition-colors flex items-center justify-center gap-4 group"
          style={{ color: "var(--ivoire-ancien)" }}
        >
          <span className="opacity-40 text-sm group-hover:translate-x-[-10px] transition-transform">←</span>
          {t("common.back")}
        </a>
      </section>
    </main>
  );
};

export default ArticlePage;
