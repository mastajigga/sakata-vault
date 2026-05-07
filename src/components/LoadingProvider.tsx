"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import { TIMINGS } from "@/lib/constants/timings";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

function shouldIgnoreNavigationClick(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (event.defaultPrevented) return true;
  if (event.button !== 0) return true;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return true;
  if (anchor.target && anchor.target !== "_self") return true;
  if (anchor.hasAttribute("download")) return true;

  const href = anchor.getAttribute("href");
  if (!href) return true;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return true;

  let targetUrl: URL;
  try {
    targetUrl = new URL(anchor.href, window.location.href);
  } catch {
    return true;
  }

  if (targetUrl.origin !== window.location.origin) return true;

  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;

  // Même page + ancre : laisser le scroll natif, pas de loader plein écran.
  if (
    targetUrl.pathname === currentPath &&
    targetUrl.search === currentSearch &&
    targetUrl.hash
  ) {
    return true;
  }

  // Même URL exacte : aucun changement attendu.
  if (
    targetUrl.pathname === currentPath &&
    targetUrl.search === currentSearch &&
    targetUrl.hash === window.location.hash
  ) {
    return true;
  }

  return false;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const minDisplayTimer = useRef<NodeJS.Timeout | null>(null);
  const safetyTimer = useRef<NodeJS.Timeout | null>(null);
  const previousPathname = useRef(pathname);

  const clearTimers = useCallback(() => {
    if (minDisplayTimer.current) clearTimeout(minDisplayTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
  }, []);

  const scheduleStop = useCallback(() => {
    clearTimers();
    // Laisse la brume exister assez longtemps pour éviter un flash sec,
    // puis révèle la page montée par Next.js.
    minDisplayTimer.current = setTimeout(() => {
      setIsLoading(false);
    }, TIMINGS.LOADING_MIN_DISPLAY);
  }, [clearTimers]);

  const startLoading = useCallback(() => {
    clearTimers();
    setIsLoading(true);

    safetyTimer.current = setTimeout(() => {
      console.warn("LoadingProvider: Safety timeout reached. Forcing stop.");
      setIsLoading(false);
    }, TIMINGS.LOADING_SAFETY_TIMEOUT);
  }, [clearTimers]);

  const stopLoading = useCallback(() => {
    clearTimers();
    setIsLoading(false);
  }, [clearTimers]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (shouldIgnoreNavigationClick(event, anchor)) return;

      startLoading();
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [startLoading]);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;
    scheduleStop();

    return () => {
      clearTimers();
    };
  }, [pathname, scheduleStop, clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      <LoadingScreen isLoading={isLoading} />
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within a LoadingProvider");
  return context;
};
