"use client";

import React, { useEffect, useRef, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";

const AnalyticsContext = createContext({});

// Minimum delay between analytics calls for the same path (ms)
const ANALYTICS_DEBOUNCE_MS = 1500;

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
      // Deduplicate: don't re-track the same path within 10 seconds
      const now = Date.now();
      if (
        lastTracked.current?.path === pathname &&
        now - lastTracked.current.time < 10_000
      ) {
        return;
      }

      lastTracked.current = { path: pathname, time: now };

      const trackVisit = async () => {
        let sessionId =
          typeof window !== "undefined"
            ? sessionStorage.getItem("sakata_session_id")
            : null;
        if (!sessionId && typeof window !== "undefined") {
          sessionId = crypto.randomUUID();
          sessionStorage.setItem("sakata_session_id", sessionId);
        }

        const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

        try {
          const payload = {
            path: pathname,
            user_id: user?.id || null,
            language: language,
            session_id: sessionId,
            referrer:
              typeof document !== "undefined"
                ? document.referrer || "direct"
                : "server",
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
    }, ANALYTICS_DEBOUNCE_MS);

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
