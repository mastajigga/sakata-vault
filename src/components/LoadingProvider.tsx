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

    minDisplayTimer.current = setTimeout(() => {
      setIsLoading(false);
    }, TIMINGS.LOADING_MIN_DISPLAY);

    safetyTimer.current = setTimeout(() => {
      console.warn("LoadingProvider: Safety timeout reached. Forcing stop.");
      setIsLoading(false);
    }, TIMINGS.LOADING_SAFETY_TIMEOUT);
  }, [clearTimers]);

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

  const startLoading = () => {
    clearTimers();
    setIsLoading(true);

    safetyTimer.current = setTimeout(() => {
      console.warn("LoadingProvider: Safety timeout reached. Forcing stop.");
      setIsLoading(false);
    }, TIMINGS.LOADING_SAFETY_TIMEOUT);
  };

  const stopLoading = () => {
    clearTimers();
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
