"use client";

import React, { useEffect, useRef, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { TIMINGS } from "@/lib/constants/timings";
import { SESSION_KEYS } from "@/lib/constants/storage";

const AnalyticsContext = createContext({});

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { user } = useAuth();
  const lastTracked = useRef<{ path: string; time: number } | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounce: ignore rapid path changes (e.g., during prefetch or fast navigation)
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      // Deduplicate: don't re-track the same path within ANALYTICS_DEDUP_WINDOW ms
      const now = Date.now();
      if (
        lastTracked.current?.path === pathname &&
        now - lastTracked.current.time < TIMINGS.ANALYTICS_DEDUP_WINDOW
      ) {
        return;
      }

      lastTracked.current = { path: pathname, time: now };

      const trackVisit = async () => {
        // P2-A fix: localStorage (vs sessionStorage) → SESSION_ID partagé entre onglets
        // P3-A fix: Si l'utilisateur est connecté, on préfère son user.id comme session stable
        //           pour unifier les sessions cross-device dans les analytics.
        let sessionId: string | null = null;
        if (typeof window !== "undefined") {
          if (user?.id) {
            // Utilisateur authentifié → session stable = user.id
            sessionId = user.id;
          } else {
            // Visiteur anonyme → session persistée en localStorage (cross-tab)
            sessionId = localStorage.getItem(SESSION_KEYS.SESSION_ID);
            if (!sessionId) {
              sessionId = crypto.randomUUID();
              try {
                localStorage.setItem(SESSION_KEYS.SESSION_ID, sessionId);
              } catch { /* localStorage restreint (mode privé) */ }
            }
          }
        }

        const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

        try {
          // Parse UTM source if available for precise campaign tracking
          const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
          const utmSource = params?.get("utm_source");

          const payload = {
            path: pathname,
            user_id: user?.id || null,
            language: language,
            session_id: sessionId,
            referrer: utmSource ? `UTM: ${utmSource}` : (typeof document !== "undefined" ? document.referrer || "direct" : "server"),
            user_agent:
              typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
            metadata: {
              screen_width: typeof window !== "undefined" ? window.innerWidth : 0,
              screen_height: typeof window !== "undefined" ? window.innerHeight : 0,
              device_type: isMobile ? "mobile" : "desktop",
              timestamp: new Date().toISOString(),
            },
          };

          // Send to API Route to bypass AdBlockers and capture precise Geographic IP
          fetch("/api/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            // Use keepalive to ensure request finishes even if user navigates away rapidly
            keepalive: true
          });

        } catch {
          // Silent failure — analytics must never block the UI
        }
      };

      trackVisit();
    }, TIMINGS.ANALYTICS_DEBOUNCE);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [pathname, language, user?.id]);

  return (
    <AnalyticsContext.Provider value={{}}>
      {children}
    </AnalyticsContext.Provider>
  );
}
