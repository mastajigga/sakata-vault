"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Auto-hide loading when route changes or after a safety timeout
  useEffect(() => {
    let safetyTimer: NodeJS.Timeout;

    if (isLoading) {
      // 1. Min display time for smooth feel (400ms)
      const timer = setTimeout(() => {
        // We only auto-hide if it's a "soft" loading from a link
        // Hard loading (manual) should be stopped by stopLoading()
      }, 400);

      // 2. Max safety timeout (4s) - NEVER stay stuck
      safetyTimer = setTimeout(() => {
        console.warn("LoadingProvider: Safety timeout reached. Forcing stop.");
        setIsLoading(false);
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearTimeout(safetyTimer);
      };
    }
  }, [pathname, isLoading]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

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
