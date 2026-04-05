"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

  const checkConnection = async () => {
    try {
      const { error } = await supabase.from("profiles").select("id").limit(1);
      if (error && error.message.includes("Failed to fetch")) {
        setConnectionError("Impossible de contacter le Grand Sanctuaire (Problème de connexion ou DNS).");
      } else {
        setConnectionError(null);
      }
    } catch (e) {
      setConnectionError("Erreur de liaison spirituelle (Réseau défaillant).");
    }
  };

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role, subscription_tier")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setRole(data.role as UserRole);
        setSubscriptionTier(data.subscription_tier || 'free');
      }
    };

    const setData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setIsLoading(false);
    };

    checkConnection();
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
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
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
