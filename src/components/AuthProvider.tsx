"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { APP_VERSION, SUBSCRIPTION_TIERS } from "@/lib/constants/business";
import { STORAGE_KEYS } from "@/lib/constants/storage";

export type UserRole = "admin" | "manager" | "contributor" | "user";

// Version key — bump APP_VERSION in business.ts on each deploy to auto-invalidate stale localStorage entries
const VERSION_KEY = STORAGE_KEYS.APP_VERSION;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  subscriptionTier: string | null;
  isLoading: boolean;
  connectionError: string | null;
  sessionExpired: boolean;
  refreshConnection: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  // Signals that the user was silently logged out due to token rotation (multi-device)
  const [sessionExpired, setSessionExpired] = useState(false);
  const refreshInProgress = useRef(false);

  // ------------------------------------------------------------------
  // Version-based localStorage invalidation
  // If the app version changed since last visit, clear all sakata-* keys
  // ------------------------------------------------------------------
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(VERSION_KEY);
      if (storedVersion !== APP_VERSION) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("sakata-") && key !== STORAGE_KEYS.APP_VERSION) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        localStorage.setItem(VERSION_KEY, APP_VERSION);
      }
    } catch {
      // localStorage may be restricted (private mode)
    }
  }, []);

  // ------------------------------------------------------------------
  // Profile fetch
  // ------------------------------------------------------------------
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role, subscription_tier")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data) {
      setRole(data.role as UserRole);
      setSubscriptionTier(data.subscription_tier || SUBSCRIPTION_TIERS.FREE);
    }
  }, []);

  // ------------------------------------------------------------------
  // Connection health check
  // ------------------------------------------------------------------
  const checkConnection = useCallback(async () => {
    try {
      const { error } = await supabase.from("profiles").select("id").limit(1);
      if (error && error.message.includes("Failed to fetch")) {
        setConnectionError("Impossible de contacter le Grand Sanctuaire (Problème de connexion ou DNS).");
      } else {
        setConnectionError(null);
      }
    } catch {
      setConnectionError("Erreur de liaison spirituelle (Réseau défaillant).");
    }
  }, []);

  // ------------------------------------------------------------------
  // Core auth lifecycle
  // ------------------------------------------------------------------
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("AuthProvider: getSession error", error);
        }
        if (session) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("AuthProvider: init error", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection().catch(console.error);
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // TOKEN_REFRESHED — a new JWT was issued (e.g., token rotated from another device)
      if (event === "TOKEN_REFRESHED") {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) await fetchProfile(session.user.id);
        // Bust Next.js Router Cache so server components re-render with fresh session
        router.refresh();
        return;
      }

      // SIGNED_IN — user authenticated (new login or cross-tab sync)
      if (event === "SIGNED_IN") {
        setSessionExpired(false);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) await fetchProfile(session.user.id);
        router.refresh();
        setIsLoading(false);
        return;
      }

      // SIGNED_OUT — could be voluntary or due to token rotation failure (multi-device)
      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setRole(null);
        setSubscriptionTier(null);
        setIsLoading(false);
        // If there was previously a user, this is likely a forced token invalidation
        // Show a "session expired" notice rather than just silently logging out
        setSessionExpired(true);
        router.refresh();
        return;
      }

      // Default fallback for other events (PASSWORD_RECOVERY, USER_UPDATED, etc.)
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setRole(null);
        setSubscriptionTier(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, checkConnection, router]);

  // ------------------------------------------------------------------
  // Cross-tab / cross-window session sync via storage event
  // When Supabase updates the auth token in localStorage on another tab,
  // this listener picks it up and re-syncs the React state.
  // ------------------------------------------------------------------
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      // Supabase stores auth data under keys starting with "sb-"
      if (!e.key || !e.key.startsWith("sb-")) return;
      if (refreshInProgress.current) return;

      refreshInProgress.current = true;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
          setSessionExpired(false);
        } else {
          setRole(null);
          setSubscriptionTier(null);
          setSessionExpired(true);
        }
        router.refresh();
      } catch (err) {
        console.error("AuthProvider: cross-tab sync error", err);
      } finally {
        refreshInProgress.current = false;
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchProfile, router]);

  // ------------------------------------------------------------------
  // Sign out
  // ------------------------------------------------------------------
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      // Force whole-page refresh to purge Next.js Router Cache and all internal states
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        subscriptionTier,
        isLoading,
        connectionError,
        sessionExpired,
        refreshConnection: checkConnection,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
