export const USER_ROLES = {
  ADMIN: "admin",
  TEMP_ADMIN: "temp_admin",
  MANAGER: "manager",
  MODERATOR: "moderator",
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

export const APP_VERSION = "3.5.0"; // 2026-05-09 — Article tiers (summary/poetic/philosophical) + manual subscription grants
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
  moderator: 40, // entre manager et contributor — accès modération forum + logs
  contributor: 30,
  user: 10,
} as const;

// ─── Modération ──────────────────────────────────────────────────────────────
export const ARTICLE_TYPES = {
  SUMMARY: "summary",
  POETIC: "poetic",
  PHILOSOPHICAL: "philosophical",
} as const;
export type ArticleType = typeof ARTICLE_TYPES[keyof typeof ARTICLE_TYPES];

export const ARTICLE_TYPE_LABELS: Record<ArticleType, string> = {
  summary: "Résumé",
  poetic: "Poétique",
  philosophical: "Philosophique",
};

/** Article types accessible without a premium subscription */
export const FREE_ARTICLE_TYPES: readonly ArticleType[] = ["summary"];

export const SUBSCRIPTION_GRANT_DURATIONS = [
  { value: 7, label: "7 jours" },
  { value: 30, label: "30 jours" },
  { value: 90, label: "3 mois" },
  { value: 365, label: "1 an" },
  { value: null, label: "Illimité" },
] as const;
export type SubscriptionGrantDuration = typeof SUBSCRIPTION_GRANT_DURATIONS[number]["value"];

export const BAN_DURATIONS_HOURS = [24, 48, 72] as const;
export type BanDurationHours = typeof BAN_DURATIONS_HOURS[number];
/** Délai de purge automatique d'un compte mis à la corbeille (6 mois) */
export const SOFT_DELETE_GRACE_DAYS = 180;
export const DELETED_USER_LABEL = "Utilisateur supprimé";

export const MODERATION_ACTIONS = {
  DELETE_POST: "delete_post",
  DELETE_THREAD: "delete_thread",
  WARN_USER: "warn_user",
  BAN_USER: "ban_user",
  UNBAN_USER: "unban_user",
  SOFT_DELETE_USER: "soft_delete_user",
  RESTORE_USER: "restore_user",
  PERMANENT_DELETE_USER: "permanent_delete_user",
  RESOLVE_REPORT: "resolve_report",
  DISMISS_REPORT: "dismiss_report",
  ROLE_CHANGE: "role_change",
} as const;
export type ModerationAction = typeof MODERATION_ACTIONS[keyof typeof MODERATION_ACTIONS];

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

/** true si l'utilisateur peut modérer (admin, manager, moderator, temp_admin actif) */
export const canModerate = (
  roleOrProfile?: UserRole | string | ProfileTempAdminFields | null
): boolean => {
  const role =
    typeof roleOrProfile === "object" && roleOrProfile !== null
      ? getEffectiveRole(roleOrProfile)
      : (roleOrProfile as UserRole | string | null | undefined);
  return ["admin", "manager", "moderator"].includes(role ?? "");
};

/** true si l'utilisateur peut accéder à des actions admin réservées (suppression définitive, gestion rôles) */
export const isFullAdmin = (
  roleOrProfile?: UserRole | string | ProfileTempAdminFields | null
): boolean => {
  const role =
    typeof roleOrProfile === "object" && roleOrProfile !== null
      ? getEffectiveRole(roleOrProfile)
      : (roleOrProfile as UserRole | string | null | undefined);
  return role === "admin";
};

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
