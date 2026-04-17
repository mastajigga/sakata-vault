import { useEffect, useState, useRef } from "react";
import { STORAGE_KEYS } from "@/lib/constants/storage";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // ms
}

const CACHE_STORE = "sakata-cache-store";

function getCacheKey(endpoint: string): string {
  return `${CACHE_STORE}:${endpoint}`;
}

function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const entry: CacheEntry<T> = JSON.parse(item);
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setToLocalStorage<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    console.warn("Failed to cache to localStorage");
  }
}

interface UseCachedFetchOptions {
  ttl?: number; // milliseconds, default 5 minutes
  revalidateOnFocus?: boolean;
  skipCache?: boolean;
}

/**
 * Hybrid caching: localStorage + fetch + revalidation
 * - First render: return cached data if available
 * - Background: fetch fresh data from server
 * - On focus: revalidate if TTL expired
 */
export function useCachedFetch<T>(
  endpoint: string,
  options: UseCachedFetchOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    revalidateOnFocus = true,
    skipCache = false,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const fetchControllerRef = useRef<AbortController | null>(null);

  const cacheKey = getCacheKey(endpoint);

  const fetchData = async (skipLocalCache = false) => {
    if (!isMountedRef.current) return;

    // Check localStorage first (unless skipped)
    if (!skipLocalCache && !skipCache) {
      const cached = getFromLocalStorage<T>(cacheKey);
      if (cached) {
        setData(cached);
        setError(null);
        setIsLoading(false);
        return;
      }
    }

    // Fetch from server
    try {
      fetchControllerRef.current = new AbortController();
      const response = await fetch(endpoint, {
        signal: fetchControllerRef.current.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (isMountedRef.current) {
        setData(result);
        setError(null);
        if (!skipCache) {
          setToLocalStorage(cacheKey, result, ttl);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return; // Silently ignore abort
      }
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        // Fall back to cached data on error
        const cached = getFromLocalStorage<T>(cacheKey);
        if (cached) {
          setData(cached);
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    isMountedRef.current = true;
    fetchData(false);

    return () => {
      isMountedRef.current = false;
      fetchControllerRef.current?.abort();
    };
  }, [endpoint]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      const cached = getFromLocalStorage<T>(cacheKey);
      if (!cached) {
        // Cache expired, fetch fresh
        fetchData(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [cacheKey, revalidateOnFocus]);

  const mutate = (newData: T | null) => {
    setData(newData);
    if (newData !== null && !skipCache) {
      setToLocalStorage(cacheKey, newData, ttl);
    }
  };

  const refetch = () => fetchData(true);

  return {
    data,
    error,
    isLoading,
    mutate,
    refetch,
  };
}

/**
 * Client-side version of next/cache with ISR-like behavior
 * Use this in Server Components for revalidation
 */
export function useServerCacheRevalidate(tag: string) {
  return async () => {
    try {
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      });
    } catch (err) {
      console.error("Failed to revalidate cache:", err);
    }
  };
}
