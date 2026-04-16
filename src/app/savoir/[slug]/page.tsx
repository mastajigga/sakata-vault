"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, notFound } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { ARTICLES } from "@/data/articles";
import StructuredData from "@/components/StructuredData";
import LikeButton from "@/components/LikeButton";
import { Eye, Lock, MessageSquare } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const ArticlePage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { user, role, subscriptionTier } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .is("deleted_at", null)
          .single();

        if (error) {
          console.warn("Supabase Error or missing row:", error.message);
          // Fallback to static data
          const staticArticle = ARTICLES.find(a => a.slug === slug);
          if (staticArticle) {
            setArticle(staticArticle);
          }
        } else if (data) {
          setArticle(data);
        }
      } catch (err) {
        console.error("Fetch exception:", err);
        const staticArticle = ARTICLES.find(a => a.slug === slug);
        if (staticArticle) setArticle(staticArticle);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (!article) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".char", 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
          delay: 0.5
        }
      );
      
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
    if (!article || !slug) return;
    
    const trackRead = async () => {
      try {
        await supabase.rpc('increment_article_reads', { article_slug: slug });
      } catch (err) {
        console.warn('[ArticlePage] Failed to track read:', err);
      }
    };

    const timer = setTimeout(trackRead, 100);
    return () => clearTimeout(timer);
  }, [article?.id, slug]);

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

  // Paywall Logic
  const hasAccess = !article.is_premium || 
                    (role && ["admin", "manager", "contributor"].includes(role)) || 
                    (subscriptionTier && ["premium", "elite"].includes(subscriptionTier));

  let finalContent = displayContent;
  let showPaywall = false;

  if (!hasAccess && finalContent.length > 500) {
    finalContent = finalContent.substring(0, 500) + "...";
    showPaywall = true;
  }

  // Parse References
  const hasReferences = finalContent.includes("**Références**");
  let mainBody = finalContent;
  let referencesContent = "";

  if (hasReferences) {
    const parts = finalContent.split("**Références**");
    mainBody = parts[0];
    referencesContent = parts[parts.length - 1]; // Take the last part as references
  }

  const renderHtml = (text: string) => {
    return text
      .replace(/## (.*)/g, '<h2 class="font-display text-2xl md:text-3xl font-bold mt-16 mb-6 text-ivoire-ancien border-b border-white/5 pb-4">$1</h2>')
      .replace(/\*\*(.*)\*\*/g, '<strong class="text-or-ancestral font-bold">$1</strong>')
      .replace(/\n\n/g, '<div class="h-6 md:h-8"></div>')
      .replace(/\n/g, "<br />");
  };

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
          "author": { "@type": "Organization", "name": "Sakata.com" },
          "datePublished": article.created_at,
          "inLanguage": language
        }}
      />
      
      {/* Hero */}
      <section className="relative h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0A1F15]">
           {article.featured_image ? (
             <Image
               src={article.featured_image}
               alt={displayTitle}
               fill
               priority={false}
               className="absolute inset-0 object-cover opacity-40"
               style={{ filter: "brightness(0.5) contrast(1.1)" }}
             />
           ) : (
             <video
                ref={videoRef}
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                style={{ filter: "brightness(0.5) contrast(1.1)" }}
              >
                <source src="/videos/wan-iluo-into-the-eyes.mp4" type="video/mp4" />
              </video>
           )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F15] via-transparent to-[#0A1F15]/60" />
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-6 inline-block" 
            style={{ color: "var(--or-ancestral)" }}
          >
            Savoir — {article.category}
          </motion.span>
          <h1 
            ref={titleRef}
            className="font-display font-bold leading-tight"
            style={{ 
              fontSize: "clamp(2rem, 8vw, 4.5rem)", 
              color: "var(--ivoire-ancien)",
              letterSpacing: "-0.04em" 
            }}
          >
            {displayTitle.split("").map((char: string, i: number) => (
              <span key={`${char}-${i}`} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
            ))}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-12 md:py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          
          {/* Main Body */}
          <div className="lg:col-span-8">
            <div 
              className="font-body text-lg md:text-xl leading-relaxed space-y-8"
              style={{ color: "rgba(242, 238, 221, 0.85)" }}
              dangerouslySetInnerHTML={{ __html: renderHtml(mainBody) }}
            />

            {/* Structured References if parsed */}
            {referencesContent && (
              <div className="mt-20 pt-12 border-t border-white/10 space-y-8">
                <h3 className="font-display text-2xl font-bold text-ivoire-ancien flex items-center gap-4">
                   <div className="w-8 h-[1px] bg-or-ancestral/50" />
                   Références
                </h3>
                <div 
                  className="text-sm md:text-base opacity-50 space-y-4 font-light italic"
                  dangerouslySetInnerHTML={{ __html: renderHtml(referencesContent) }}
                />
              </div>
            )}

            {/* Paywall Overlay */}
            {showPaywall && (
              <div className="relative mt-0 pt-32 pb-12 rounded-b-[2rem] text-center overflow-hidden -translate-y-24">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--foret-nocturne)] via-[var(--foret-nocturne)] to-transparent pointer-events-none" />
                <div className="relative z-10 px-8 py-10 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-3xl mt-12 shadow-2xl mx-auto max-w-xl">
                   <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-or-ancestral/10 flex items-center justify-center border border-or-ancestral/30 shadow-[0_0_20px_rgba(181,149,81,0.2)]">
                     <Lock className="w-8 h-8 text-or-ancestral" />
                   </div>
                   <h3 className="text-2xl font-display font-bold text-or-ancestral mb-3 tracking-tight">Archives Sacrées (Premium)</h3>
                   <p className="text-ivoire-ancien/60 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                     Cette chronique détaillée est réservée aux initiés. Accédez au savoir traditionnel approfondi.
                   </p>
                   <a href="/auth" className="inline-block px-8 py-3.5 rounded-full bg-or-ancestral text-foret-nocturne font-bold uppercase tracking-widest text-xs transition-all hover:scale-[1.05]">
                      S'authentifier
                   </a>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="sticky top-32 space-y-8">
              {/* Dual image stack */}
              <div className="space-y-4">
                 <motion.div
                   whileHover={{ scale: 1.02 }}
                   className="p-1 rounded-[2.5rem] bg-white/5 border border-white/10 overflow-hidden shadow-2xl shadow-black/40"
                 >
                    <Image
                      src={article.featured_image || "/images/sakata_mask_detail.png"}
                      alt={displayTitle}
                      width={400}
                      height={500}
                      className="w-full h-auto object-cover rounded-[2.3rem]"
                    />
                 </motion.div>
                 
                 <motion.div
                   whileHover={{ scale: 1.02 }}
                   className="p-1 rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden hidden md:block opacity-60 hover:opacity-100 transition-opacity"
                 >
                    <Image
                      src="/images/sakata_heritage_hero.png"
                      alt="Ambiance"
                      width={400}
                      height={225}
                      className="w-full h-auto object-cover rounded-[1.8rem]"
                    />
                 </motion.div>
              </div>

              {/* Stats Card */}
              <div className="p-8 bg-[#0D241A] rounded-[2.5rem] border border-white/5 shadow-xl">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <Eye size={20} className="text-or-ancestral" />
                       <span className="text-xl font-mono text-ivoire-ancien">{article.reads_count || 0}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Lectures</span>
                 </div>
                 
                 <LikeButton 
                   articleId={article.id} 
                   initialLikes={article.likes_count || 0} 
                 />

                 <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4 text-or-ancestral">Contexte Culturel</p>
                    <p className="text-base text-ivoire-ancien/60 italic leading-relaxed">
                       &quot;{displaySummary}&quot;
                    </p>
                 </div>
              </div>

              {/* Forum Link */}
              <Link 
                href={`/forum/thread/${slug}`}
                className="block p-1 rounded-full bg-gradient-to-r from-or-ancestral/20 to-transparent border border-or-ancestral/30 hover:from-or-ancestral/40 transition-all group"
              >
                 <div className="flex items-center justify-between px-6 py-4">
                    <span className="text-xs font-bold text-or-ancestral uppercase tracking-widest">Rejoindre la palabre</span>
                 </div>
              </Link>
            </div>
          </aside>

        </div>
      </section>

      {/* Footer Nav */}
      <section className="py-24 text-center border-t border-white/5 bg-[#071610]">
        <Link 
          href="/savoir"
          className="font-display text-2xl hover:text-or-ancestral transition-colors flex items-center justify-center gap-6 group text-ivoire-ancien"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-or-ancestral transition-colors">
             <span className="group-hover:translate-x-[-2px] transition-transform">←</span>
          </div>
          Retour aux Savoirs
        </Link>
      </section>
    </main>
  );
};

export default ArticlePage;
