"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
  const minDisplayTimer = useRef<NodeJS.Timeout | null>(null);
  const safetyTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-show loading on route change
  useEffect(() => {
    // Show loading when route changes
    setIsLoading(true);

    // Clear any existing timers
    if (minDisplayTimer.current) clearTimeout(minDisplayTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);

    // Min display time for smooth feel (600ms)
    minDisplayTimer.current = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    // Max safety timeout (5s) - NEVER stay stuck
    safetyTimer.current = setTimeout(() => {
      console.warn("LoadingProvider: Safety timeout reached. Forcing stop.");
      setIsLoading(false);
    }, 5000);

    return () => {
      if (minDisplayTimer.current) clearTimeout(minDisplayTimer.current);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, [pathname]);

  const startLoading = () => {
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    if (minDisplayTimer.current) clearTimeout(minDisplayTimer.current);
    setIsLoading(true);
  };

  const stopLoading = () => {
    if (minDisplayTimer.current) clearTimeout(minDisplayTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    setIsLoading(false);
  };

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