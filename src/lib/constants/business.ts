export const USER_ROLES = {
  ADMIN: "admin",
  TEMP_ADMIN: "temp_admin",
  MANAGER: "manager",
  CONTRIBUTOR: "contributor",
  USER: "user",
} as const;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const SUBSCRIPTION_TIERS = {
  FREE: "free",
  PREMIUM: "premium",
  ELITE: "elite",
} as const;
export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];

export const EXPIRY_DURATIONS = {
  NEVER: "never",
  H24: "24h",
  H48: "48h",
  DAYS_7: "7_days",
  DAYS_30: "30_days",
} as const;
export type ExpiryDuration = typeof EXPIRY_DURATIONS[keyof typeof EXPIRY_DURATIONS];

export const IMAGE_VIEW_MODES = {
  NORMAL: "normal",
  ONCE: "once",
  TWICE: "twice",
} as const;
export type ImageViewMode = typeof IMAGE_VIEW_MODES[keyof typeof IMAGE_VIEW_MODES];

export const MAX_VIEWS = {
  ONCE: 1,
  TWICE: 2,
} as const;

export const APP_VERSION = "3.2.0"; // 2026-04-28 — Forum Mboka 2.0 + Temp Admin role
export const PINECONE_DEFAULT_INDEX = "sakata-mathematics";

// ─── Temp Admin ─────────────────────────────────────────────────────────────
/** Durée par défaut d'un grant temp_admin */
export const TEMP_ADMIN_DURATION_HOURS = 24;
export const TEMP_ADMIN_DURATION_MS = TEMP_ADMIN_DURATION_HOURS * 60 * 60 * 1000;

// ─── Hiérarchie des rôles ────────────────────────────────────────────────────
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 100,
  temp_admin: 90, // entre admin et manager — actif uniquement si non expiré
  manager: 50,
  contributor: 30,
  user: 10,
} as const;

/**
 * Profil minimal utilisé par les helpers temp_admin.
 */
export interface ProfileTempAdminFields {
  role?: UserRole | string | null;
  temp_admin_expires_at?: string | null;
  temp_admin_original_role?: UserRole | string | null;
}

/**
 * Le grant temp_admin du profil est-il toujours actif ?
 */
export function isTempAdminActive(profile: ProfileTempAdminFields | null | undefined): boolean {
  if (!profile) return false;
  if (profile.role !== "temp_admin") return false;
  if (!profile.temp_admin_expires_at) return false;
  return new Date(profile.temp_admin_expires_at) > new Date();
}

/**
 * Retourne le rôle "effectif" pour les checks runtime :
 * - si role = 'temp_admin' actif → renvoie 'admin'
 * - si role = 'temp_admin' expiré → renvoie original_role (fallback 'user')
 * - sinon → role tel quel
 */
export function getEffectiveRole(
  profile: ProfileTempAdminFields | null | undefined
): UserRole | null {
  if (!profile?.role) return null;

  if (profile.role === "temp_admin") {
    if (isTempAdminActive(profile)) return "admin";
    return (profile.temp_admin_original_role as UserRole | undefined) || "user";
  }

  return profile.role as UserRole;
}

/** true si l'utilisateur peut gérer le contenu (admin, manager, ou temp_admin actif) */
export const canManageContent = (
  roleOrProfile?: UserRole | string | ProfileTempAdminFields | null
): boolean => {
  const role =
    typeof roleOrProfile === "object" && roleOrProfile !== null
      ? getEffectiveRole(roleOrProfile)
      : (roleOrProfile as UserRole | string | null | undefined);
  return ["admin", "manager"].includes(role ?? "");
};

/** true si l'utilisateur peut créer des articles */
export const canCreateArticles = (
  roleOrProfile?: UserRole | string | ProfileTempAdminFields | null
): boolean => {
  const role =
    typeof roleOrProfile === "object" && roleOrProfile !== null
      ? getEffectiveRole(roleOrProfile)
      : (roleOrProfile as UserRole | string | null | undefined);
  return ["admin", "manager", "contributor"].includes(role ?? "");
};

/** true si l'utilisateur peut modérer */
export const canModerate = canManageContent;

/** true si le rôle est >= au rôle minimum requis */
export const hasMinRole = (
  userRole: UserRole | null | undefined,
  minRole: UserRole
): boolean => {
  if (!userRole) return false;
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
};

/**
 * Peut-on supprimer ou modifier le rôle de la cible ?
 * - Vrai admin : OUI sur tous (sauf soi-même côté UI)
 * - Temp_admin actif : OUI sauf si la cible est un VRAI admin
 * - Autres : NON
 */
export function canModifyUser(
  actor: ProfileTempAdminFields | null | undefined,
  target: ProfileTempAdminFields | null | undefined
): boolean {
  if (!actor || !target) return false;
  // Vrai admin
  if (actor.role === "admin") return true;
  // Temp admin actif : interdiction de toucher aux vrais admins
  if (isTempAdminActive(actor) && target.role !== "admin") return true;
  return false;
}

/** Format human-readable du temps restant avant expiration */
export function formatTempAdminRemaining(expiresAt: string | null | undefined): string {
  if (!expiresAt) return "";
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "expiré";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
