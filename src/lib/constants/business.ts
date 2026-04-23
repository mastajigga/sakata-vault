export const USER_ROLES = {
  ADMIN: "admin",
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

export const APP_VERSION = "2.7.3"; // Bumped 2026-04-23 — Auth Lock Stolen Fix
export const PINECONE_DEFAULT_INDEX = "sakata-mathematics";

// ─── Hiérarchie des rôles ────────────────────────────────────────────────────
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  manager: 3,
  contributor: 2,
  user: 1,
} as const;

/** true si l'utilisateur peut gérer le contenu (admin ou manager) */
export const canManageContent = (role?: UserRole | null): boolean =>
  ["admin", "manager"].includes(role ?? "");

/** true si l'utilisateur peut créer des articles (admin, manager, contributor) */
export const canCreateArticles = (role?: UserRole | null): boolean =>
  ["admin", "manager", "contributor"].includes(role ?? "");

/** true si l'utilisateur peut modérer (admin ou manager) */
export const canModerate = (role?: UserRole | null): boolean =>
  ["admin", "manager"].includes(role ?? "");

/** true si le rôle de l'utilisateur est >= au rôle minimum requis */
export const hasMinRole = (
  userRole: UserRole | null | undefined,
  minRole: UserRole
): boolean => {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
};
