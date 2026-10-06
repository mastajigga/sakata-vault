"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { withRetry } from "@/lib/supabase-retry";
import {
  APP_VERSION,
  SUBSCRIPTION_TIERS,
  UserRole,
  getEffectiveRole,
  isTempAdminActive,
} from "@/lib/constants/business";
import { STORAGE_KEYS, SESSION_KEYS } from "@/lib/constants/storage";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  /** Rôle "brut" stocké en DB (peut être 'temp_admin') */
  role: UserRole | null;
  /** Rôle effectif après application de la logique temp_admin
   * (renvoie 'admin' si temp_admin actif, sinon le vrai rôle ou original_role si expiré) */
  effectiveRole: UserRole | null;
  /** Date ISO d'expiration du grant temp_admin courant (null si pas de grant) */
  tempAdminExpiresAt: string | null;
  /** Le grant temp_admin est-il toujours actif (NOW() < expires_at) ? */
  isTempAdminActive: boolean;
  subscriptionTier: string | null;
  contributorStatus: "none" | "pending" | "approved" | "rejected";
  nickname: string | null;
  username: string | null;
  /** Date ISO d'expiration du bannissement (null = pas banni). Si dans le futur → bloqué. */
  bannedUntil: string | null;
  banReason: string | null;
  /** Date ISO de mise en corbeille (null = compte actif). Si non null → forcer logout. */
  deletedAt: string | null;
  isLoading: boolean;
  isSessionLoading: boolean;
  isProfileLoading: boolean;
  isStalled: boolean;
  connectionError: string | null;
  sessionExpired: boolean;
  /** P2-B: true pendant les ~30-60s de rotation de token JWT. */
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
  const [tempAdminExpiresAt, setTempAdminExpiresAt] = useState<string | null>(null);
  const [tempAdminOriginalRole, setTempAdminOriginalRole] = useState<UserRole | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [contributorStatus, setContributorStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");
  const [nickname, setNickname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [bannedUntil, setBannedUntil] = useState<string | null>(null);
  const [banReason, setBanReason] = useState<string | null>(null);
  const [deletedAt, setDeletedAt] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const isLoading = isSessionLoading || isProfileLoading;
  const sessionIdentity = useRef<{ userId: string | null; generation: number }>({ userId: null, generation: 0 });
  
  // Log désactivé ou réduit pour éviter de saturer la console
  // console.log(`[AuthProvider] Render (isLoading: ${isLoading}, hasUser: ${!!user})`);
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
  const profileFetchPromiseRef = useRef<{
    userId: string;
    generation: number;
    promise: Promise<void>;
  } | null>(null);

  const resetProfile = useCallback(() => {
    setRole(null);
    setTempAdminExpiresAt(null);
    setTempAdminOriginalRole(null);
    setSubscriptionTier(null);
    setContributorStatus("none");
    setNickname(null);
    setUsername(null);
    setBannedUntil(null);
    setBanReason(null);
    setDeletedAt(null);
    setConnectionError(null);
    setIsStalled(false);
  }, []);

  // -------------------------------------------------------------------------
  // Profile fetch avec retry et dédoublonnage
  // -------------------------------------------------------------------------
  // silent: rechargement du MÊME utilisateur (retour d'onglet, refreshProfile) —
  // ne repasse pas isLoading à true, sinon l'admin se démonte et perd ses brouillons.
  const fetchProfile = useCallback(async (userId: string, generation = sessionIdentity.current.generation, silent = false) => {
    const isCurrent = () => sessionIdentity.current.userId === userId
      && sessionIdentity.current.generation === generation;
    if (!isCurrent()) return;
    const pending = profileFetchPromiseRef.current;
    if (pending?.userId === userId && pending.generation === generation) {
      return pending.promise;
    }
    if (!silent) setIsProfileLoading(true);

    const promise = (async () => {
      console.log(`[AuthProvider] fetchProfile: DEBUT pour ${userId}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const { data, error } = await withRetry<any>(() =>
          supabase
            .from("profiles")
            .select(
              "role, subscription_tier, contributor_status, nickname, username, temp_admin_expires_at, temp_admin_original_role, banned_until, ban_reason, deleted_at"
            )
            .eq("id", userId)
            .limit(1)
            .abortSignal(controller.signal)
        );

        clearTimeout(timeoutId);
        if (!isCurrent()) return;

        const profile = (data && Array.isArray(data) && data.length > 0) ? data[0] : null;

        if (error) throw error;
        if (!profile) throw new Error("Profil introuvable.");

        if (profile) {
          setRole(profile.role as UserRole);
          setTempAdminExpiresAt(profile.temp_admin_expires_at ?? null);
          setTempAdminOriginalRole(profile.temp_admin_original_role ?? null);
          setSubscriptionTier(profile.subscription_tier || SUBSCRIPTION_TIERS.FREE);
          setContributorStatus((profile.contributor_status as "none" | "pending" | "approved" | "rejected") || "none");
          setNickname(profile.nickname);
          setUsername(profile.username);
          setBannedUntil(profile.banned_until ?? null);
          setBanReason(profile.ban_reason ?? null);
          setDeletedAt(profile.deleted_at ?? null);
        }
      } catch (err: any) {
        if (!isCurrent()) return;
        setConnectionError(err?.message || "Erreur lors du chargement du profil.");
        if (err.name === 'AbortError') {
          console.warn("[AuthProvider] fetchProfile: Timeout (8s) ou abandon.");
        } else {
          console.error("[AuthProvider] fetchProfile exception:", err);
        }
      } finally {
        clearTimeout(timeoutId);
        if (isCurrent()) {
          profileFetchPromiseRef.current = null;
          setIsProfileLoading(false);
          setIsStalled(false);
        }
        console.log(`[AuthProvider] fetchProfile: FIN pour ${userId}`);
      }
    })();

    profileFetchPromiseRef.current = { userId, generation, promise };
    return promise;
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const { error } = await supabase.from("profiles").select("id").limit(1).abortSignal(AbortSignal.timeout(5000));
      if (error) {
        console.error("[AuthProvider] Connection check failed:", error);
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
      await fetchProfile(user.id, sessionIdentity.current.generation, true);
    }
  }, [user?.id, fetchProfile]);

  // -------------------------------------------------------------------------
  // Core auth lifecycle
  // -------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;
    let authEventVersion = 0;
    const profileTimers = new Set<ReturnType<typeof setTimeout>>();

    const applySession = (newSession: Session | null) => {
      const userId = newSession?.user.id ?? null;
      // SIGNED_IN est réémis à chaque retour d'onglet et TOKEN_REFRESHED ~1×/h :
      // seul un changement de compte remet le profil en chargement.
      const identityChanged = sessionIdentity.current.userId !== userId;
      if (identityChanged) {
        sessionIdentity.current = { userId, generation: sessionIdentity.current.generation + 1 };
        profileFetchPromiseRef.current = null;
        resetProfile();
        setIsProfileLoading(!!userId);
      }
      const { generation } = sessionIdentity.current;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setSessionExpired(false);
      setTokenRefreshPending(false);
      setIsSessionLoading(false);
      if (userId) {
        // Sortir du callback auth pour ne pas attendre une requête sous le verrou Supabase.
        const timer = setTimeout(() => {
          profileTimers.delete(timer);
          if (mounted) void fetchProfile(userId, generation, !identityChanged);
        }, 0);
        profileTimers.add(timer);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, newSession: Session | null) => {
      if (!mounted) return;
      authEventVersion += 1;
      switch (event) {
        case "INITIAL_SESSION":
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          applySession(newSession);
          if (event !== "INITIAL_SESSION") router.refresh();
          break;
        case "SIGNED_OUT":
          applySession(null);
          setSessionExpired(true);
          break;
      }
    });

    const initVersion = authEventVersion;
    const init = async () => {
      try {
        const { data: { session: fetchedSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        // Un événement plus récent prime sur cette lecture initiale.
        if (mounted && authEventVersion === initVersion) applySession(fetchedSession);
      } catch (error) {
        console.error("[AuthProvider] Session initialization failed:", error);
        if (mounted && authEventVersion === initVersion) {
          setConnectionError("Erreur lors du chargement de la session.");
          setIsSessionLoading(false);
        }
      }
    };
    void init();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      profileTimers.forEach(clearTimeout);
      sessionIdentity.current = { userId: null, generation: sessionIdentity.current.generation + 1 };
      profileFetchPromiseRef.current = null;
    };
  }, [fetchProfile, resetProfile, router]);

  // Filet de sécurité : si l'init auth (« Auth Lock Stolen ») ou le profil ne répond
  // jamais, on force la résolution pour ne jamais rester bloqué sur un écran de chargement.
  // L'erreur reste visible via connectionError ; un profil arrivé plus tard s'appliquera normalement.
  useEffect(() => {
    if (!isLoading) {
      setIsStalled(false);
      return;
    }
    const timer = setTimeout(() => {
      console.error("[AuthProvider] Chargement bloqué depuis 15s — résolution forcée.");
      profileFetchPromiseRef.current = null; // permettre un nouvel essai (refreshProfile)
      setIsStalled(true);
      setConnectionError("Liaison instable avec le Grand Sanctuaire. Rechargez la page.");
      setIsSessionLoading(false);
      setIsProfileLoading(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // -------------------------------------------------------------------------
  // Sign out
  // -------------------------------------------------------------------------
  const signOut = async () => {
    try {
      setIsSessionLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/";
    } catch (error) {
      console.error("[AuthProvider] Sign out failed:", error);
      setConnectionError("Erreur lors de la déconnexion.");
      setIsSessionLoading(false);
    }
  };

  // ---- Compute effective role + temp_admin status (memoizable derivation) ----
  const profileShape = {
    role,
    temp_admin_expires_at: tempAdminExpiresAt,
    temp_admin_original_role: tempAdminOriginalRole,
  };
  const effectiveRole = getEffectiveRole(profileShape);
  const tempAdminActive = isTempAdminActive(profileShape);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        effectiveRole,
        tempAdminExpiresAt,
        isTempAdminActive: tempAdminActive,
        subscriptionTier,
        contributorStatus,
        nickname,
        username,
        bannedUntil,
        banReason,
        deletedAt,
        isLoading,
        isSessionLoading,
        isProfileLoading,
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

export type { UserRole } from "@/lib/constants/business";
