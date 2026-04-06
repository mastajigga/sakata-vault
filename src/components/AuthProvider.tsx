"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type UserRole = "admin" | "manager" | "contributor" | "user";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  subscriptionTier: string | null;
  isLoading: boolean;
  connectionError: string | null;
  refreshConnection: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache de session pour éviter les requêtes inutiles
let cachedProfile: { role: string; subscription_tier: string } | null = null;
let profileCacheTime = 0;
const PROFILE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    // Utiliser le cache si disponible et pas expiré
    const now = Date.now();
    if (cachedProfile && (now - profileCacheTime) < PROFILE_CACHE_DURATION) {
      setRole(cachedProfile.role as UserRole);
      setSubscriptionTier(cachedProfile.subscription_tier || 'free');
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role, subscription_tier")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data) {
      cachedProfile = { role: data.role, subscription_tier: data.subscription_tier || 'free' };
      profileCacheTime = now;
      setRole(data.role as UserRole);
      setSubscriptionTier(data.subscription_tier || 'free');
    }
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      // Utiliser un timeout pour éviter les blocages
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const { error } = await supabase
        .from("profiles")
        .select("id")
        .limit(1)
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);

      if (error && error.message.includes("Failed to fetch")) {
        setConnectionError("Impossible de contacter le Grand Sanctuaire (Problème de connexion ou DNS).");
      } else {
        setConnectionError(null);
      }
    } catch (e) {
      setConnectionError("Erreur de liaison spirituelle (Réseau défaillant).");
    }
  }, []);

  useEffect(() => {
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          // Charger le profil en arrière-plan sans bloquer
          fetchProfile(session.user.id).catch(console.error);
        }
      } catch (e) {
        console.error("Error getting session:", e);
      } finally {
        // Réduire le temps de chargement initial
        setIsLoading(false);
      }
    };

    // Vérification de connexion en arrière-plan (non bloquant)
    checkConnection().catch(console.error);
    setData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setRole(null);
        setSubscriptionTier(null);
        cachedProfile = null;
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, checkConnection]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      // Force whole-page refresh to purge Next.js Router Cache and all internal states
      window.location.href = "/";
    } catch (e) {
      console.error("Sign out error:", e);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      role, 
      subscriptionTier,
      isLoading, 
      connectionError, 
      refreshConnection: checkConnection,
      signOut 
    }}>
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