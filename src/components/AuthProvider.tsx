"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { withRetry } from "@/lib/supabase-retry";
import { APP_VERSION, SUBSCRIPTION_TIERS } from "@/lib/constants/business";
import { STORAGE_KEYS, SESSION_KEYS } from "@/lib/constants/storage";

export type UserRole = "admin" | "manager" | "contributor" | "user";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  subscriptionTier: string | null;
  contributorStatus: "none" | "pending" | "approved" | "rejected";
  nickname: string | null;
  username: string | null;
  isLoading: boolean;
  isStalled: boolean;
  connectionError: string | null;
  sessionExpired: boolean;
  /** P2-B: true pendant les ~30-60s de rotation de token JWT. Les mutations critiques
   * doivent attendre ou afficher un indicateur pendant cette fenêtre. */
  tokenRefreshPending: boolean;
  refreshConnection: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Whitelist exhaustive des clés localStorage légitimes.
// Toute clé "sakata-*" NON listée ici sera supprimée lors d'un version bump.
// RÈGLE : Toute nouvelle clé doit être ajoutée ici ET dans storage.ts.
// ---------------------------------------------------------------------------
const SAKATA_KEY_WHITELIST = new Set<string>([
  STORAGE_KEYS.APP_VERSION,         // "sakata-app-version"
  STORAGE_KEYS.LANG,                 // "sakata-lang"
  STORAGE_KEYS.WELCOME_SEEN,         // "sakata-welcome-seen-v2"
  SESSION_KEYS.SESSION_ID,           // "sakata-session-id"
  "sakata-msg-viewed-last-purge",    // timestamp de la dernière purge des clés msg-viewed
]);

function isKnownSakataKey(key: string): boolean {
  if (SAKATA_KEY_WHITELIST.has(key)) return true;
  if (key.startsWith("sakata-msg-viewed-")) return true;     // vues éphémères — purgées cycliquement
  if (key.startsWith("sakata-ecole-progress-")) return true; // progression école par namespace
  return false;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [contributorStatus, setContributorStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");
  const [nickname, setNickname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log(`[AuthProvider] Render (isLoading: ${isLoading}, hasUser: ${!!user})`);
  const [isStalled, setIsStalled] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  // P2-B: flag pendant la fenêtre de rotation de token (TOKEN_REFRESHED event)
  const [tokenRefreshPending, setTokenRefreshPending] = useState(false);

  // -------------------------------------------------------------------------
  // Version-based localStorage invalidation
  // Si APP_VERSION a changé depuis la dernière visite :
  //   1. Supprimer toutes les clés "sakata-*" inconnues (pas dans la whitelist)
  //   2. Supprimer les clés orphelines sans préfixe sakata- (anciens bugs)
  // -------------------------------------------------------------------------
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(STORAGE_KEYS.APP_VERSION);
      if (storedVersion !== APP_VERSION) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;

          // Supprimer toute clé sakata-* NON whitelistée (vieilles clés stale)
          if (key.startsWith("sakata-") && !isKnownSakataKey(key)) {
            keysToRemove.push(key);
          }

          // Supprimer les vieilles clés sans préfixe sakata- créées par d'anciens bugs
          // (ex: "msg-viewed-xxx" au lieu de "sakata-msg-viewed-xxx")
          if (key.startsWith("msg-viewed-")) {
            keysToRemove.push(key);
          }

          // Supprimer les vieilles clés avec underscore (ex: "sakata_welcome_seen_v2")
          if (key.startsWith("sakata_")) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach((k) => {
          try { localStorage.removeItem(k); } catch { /* ignore */ }
        });
        localStorage.setItem(STORAGE_KEYS.APP_VERSION, APP_VERSION);

        if (keysToRemove.length > 0) {
          console.info(`[AuthProvider] Version bump ${storedVersion} → ${APP_VERSION}. ${keysToRemove.length} clés stale supprimées.`);
        }
      }

      // -----------------------------------------------------------------------
      // Purge cyclique des clés "sakata-msg-viewed-*"
      // Ces clés s'accumulent à chaque image éphémère vue.
      // Purge déclenchée si > 100 clés OU si > 7 jours depuis la dernière purge.
      // -----------------------------------------------------------------------
      const MSG_VIEWED_PREFIX = "sakata-msg-viewed-";
      const MSG_VIEWED_TS_KEY = "sakata-msg-viewed-last-purge";
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
      const MAX_MSG_VIEWED_KEYS = 100; // Réduit de 200 → 100 pour marge de sécurité

      const lastPurge = parseInt(localStorage.getItem(MSG_VIEWED_TS_KEY) || "0", 10);
      const msgViewedKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(MSG_VIEWED_PREFIX)) msgViewedKeys.push(key);
      }

      const shouldPurge =
        msgViewedKeys.length > MAX_MSG_VIEWED_KEYS ||
        (lastPurge > 0 && Date.now() - lastPurge > SEVEN_DAYS_MS);

      if (shouldPurge && msgViewedKeys.length > 0) {
        msgViewedKeys.forEach((k) => {
          try { localStorage.removeItem(k); } catch { /* ignore */ }
        });
        localStorage.setItem(MSG_VIEWED_TS_KEY, String(Date.now()));
        console.info(`[AuthProvider] Purge msg-viewed: ${msgViewedKeys.length} clés supprimées.`);
      }

      // -----------------------------------------------------------------------
      // P4-B: Monitoring du quota localStorage
      // On estime la taille totale en sérialisant toutes les clés+valeurs.
      // Si on dépasse 80% du quota estimé (~4MB sur 5MB), on log un avertissement.
      // -----------------------------------------------------------------------
      try {
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            totalSize += key.length + (localStorage.getItem(key)?.length || 0);
          }
        }
        const estimatedBytes = totalSize * 2; // UTF-16 = 2 bytes par caractère
        const quotaWarningThreshold = 4 * 1024 * 1024; // 4MB = 80% de 5MB
        if (estimatedBytes > quotaWarningThreshold) {
          console.warn(`[AuthProvider] ⚠️ localStorage approche du quota: ~${Math.round(estimatedBytes / 1024)}KB utilisés`);
        }
      } catch { /* ignore */ }

    } catch {
      // localStorage peut être restreint (mode privé Safari)
    }
  }, []);

  // -------------------------------------------------------------------------
  // Profile fetch avec retry
  // -------------------------------------------------------------------------
  // Réf pour dédoublonner les appels fetchProfile (anti-saturation)
  const profileFetchPromiseRef = useRef<Promise<void> | null>(null);

  // -------------------------------------------------------------------------
  // Profile fetch avec retry et dédoublonnage
  // -------------------------------------------------------------------------
  const fetchProfile = useCallback(async (userId: string) => {
    // Si un fetch est déjà en cours pour cet utilisateur, on attend sa résolution
    if (profileFetchPromiseRef.current) {
      console.log(`[AuthProvider] fetchProfile: Déjà en cours, attente...`);
      return profileFetchPromiseRef.current;
    }

    const promise = (async () => {
      console.log(`[AuthProvider] fetchProfile: DEBUT pour ${userId}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role, subscription_tier, contributor_status, nickname, username")
          .eq("id", userId)
          .limit(1)
          .abortSignal(controller.signal);
        
        clearTimeout(timeoutId);

        const profile = data && data.length > 0 ? data[0] : null;

        if (!error && profile) {
          setRole(profile.role as UserRole);
          setSubscriptionTier(profile.subscription_tier || SUBSCRIPTION_TIERS.FREE);
          setContributorStatus((profile.contributor_status as "none" | "pending" | "approved" | "rejected") || "none");
          setNickname(profile.nickname);
          setUsername(profile.username);
        } else if (error) {
          console.error("[AuthProvider] fetchProfile query error:", error.message);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.warn("[AuthProvider] fetchProfile: Timeout (8s) ou abandon.");
        } else {
          console.error("[AuthProvider] fetchProfile exception:", err);
        }
      } finally {
        clearTimeout(timeoutId);
        profileFetchPromiseRef.current = null;
        console.log(`[AuthProvider] fetchProfile: FIN pour ${userId}`);
      }
    })();

    profileFetchPromiseRef.current = promise;
    return promise;
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const { error } = await supabase.from("profiles").select("id").limit(1).abortSignal(AbortSignal.timeout(5000));
      if (error && error.message?.includes("Failed to fetch")) {
        setConnectionError("Liaison instable avec le Grand Sanctuaire.");
      } else {
        setConnectionError(null);
      }
    } catch {
      setConnectionError("Erreur de liaison spirituelle.");
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  // -------------------------------------------------------------------------
  // Core auth lifecycle
  // -------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      console.log("[AuthProvider] init: START");
      try {
        // Timeout de sécurité sur getSession (parfois capricieux sur certains navigateurs)
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{data: {session: null}, error: any}>((_, reject) => 
          setTimeout(() => reject(new Error("Timeout getSession")), 10000)
        );

        console.log("[AuthProvider] init: getSession start...");
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error("[AuthProvider] init: getSession error:", error);
        }
        
        if (mounted && session) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("[AuthProvider] init: EXCEPTION:", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Décaler légèrement le check de connexion pour laisser la priorité au getSession
    setTimeout(() => {
      if (mounted) checkConnection().catch(console.error);
    }, 1500);

    // Safety Timeout : Force isLoading=false après 15s (ultime recours)
    const safetyTimer = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("[AuthProvider] TIMEOUT DE SÉCURITÉ (15s) atteint.");
        setIsStalled(true);
        setIsLoading(false);
      }
    }, 15000);

    init().finally(() => {
      if (mounted) {
        clearTimeout(safetyTimer);
        setIsStalled(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, newSession: any) => {
      if (!mounted) return;

      switch (event) {
        case "INITIAL_SESSION":
          // Géré par init() ci-dessus — on ignore pour éviter le double fetch
          break;

        case "TOKEN_REFRESHED":
          // Nouveau JWT émis (rotation depuis un autre device)
          // P2-B: on désactive le flag pending dès que le token est prêt
          setTokenRefreshPending(false);
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) await fetchProfile(newSession.user.id);
          router.refresh(); // Invalide le Next.js Router Cache
          break;

        case "SIGNED_IN":
          setSessionExpired(false);
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) await fetchProfile(newSession.user.id);
          router.refresh();
          setIsLoading(false);
          break;

        case "SIGNED_OUT":
          setSession(null);
          setUser(null);
          setRole(null);
          setSubscriptionTier(null);
          setContributorStatus("none");
          setNickname(null);
          setUsername(null);
          setIsLoading(false);
          // Si un utilisateur était connecté, c'est probablement une invalidation forcée
          setSessionExpired(true);
          break;
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, checkConnection]);

  // -------------------------------------------------------------------------
  // Sign out
  // -------------------------------------------------------------------------
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
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
        contributorStatus,
        nickname,
        username,
        isLoading,
        isStalled,
        connectionError,
        sessionExpired,
        tokenRefreshPending,
        refreshConnection: checkConnection,
        refreshProfile,
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
