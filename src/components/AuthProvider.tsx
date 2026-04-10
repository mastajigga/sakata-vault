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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!isMounted) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("role, subscription_tier")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data && isMounted) {
      setRole(data.role as UserRole);
      setSubscriptionTier(data.subscription_tier || 'free');
    }
  }, [isMounted]);

  const checkConnection = useCallback(async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

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
    setIsMounted(true);

    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session) {
          setSession(session);
          setUser(session.user);
          // Charger le profil avec await pour s'assurer que le state est mis à jour
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("Error getting session:", e);
      } finally {
        setIsLoading(false);
      }
    };

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
      }
      setIsLoading(false);
    });

    return () => {
      setIsMounted(false);
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