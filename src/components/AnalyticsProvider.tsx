"use client";

import React, { useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";

const AnalyticsContext = createContext({});

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    // 1. Core Page View Tracking
    const trackVisit = async () => {
      // Get or generate a session ID
      let sessionId = typeof window !== 'undefined' ? sessionStorage.getItem("sakata_session_id") : null;
      if (!sessionId && typeof window !== 'undefined') {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem("sakata_session_id", sessionId);
      }

      const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
      const deviceType = isMobile ? "mobile" : "desktop";

      try {
        // Log to analytics table
        await supabase.from("site_analytics").insert({
          path: pathname,
          user_id: user?.id || null,
          language: language,
          session_id: sessionId,
          referrer: typeof document !== 'undefined' ? document.referrer || "direct" : "server",
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : "unknown",
          metadata: {
            screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
            screen_height: typeof window !== 'undefined' ? window.innerHeight : 0,
            device_type: deviceType,
            timestamp: new Date().toISOString()
          }
        });

        // 2. Specific Article Read Increment
        // If path is like /savoir/l-histoire-des-basakata, increment the reads_count
        if (pathname.startsWith("/savoir/") && pathname !== "/savoir") {
          const slug = pathname.replace("/savoir/", "");
          if (slug) {
            // Using rpc or set to increment atomically to avoid race conditions
            await supabase.rpc('increment_article_reads', { article_slug: slug });
          }
        }
      } catch (err) {
        // Silent failure for analytics to avoid blocking UI
        console.warn("Analytics sync paused.");
      }
    };

    trackVisit();
  }, [pathname, language, user?.id]);

  return (
    <AnalyticsContext.Provider value={{}}>
      {children}
    </AnalyticsContext.Provider>
  );
}
