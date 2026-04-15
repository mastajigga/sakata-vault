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

export const APP_VERSION = "2.2.0"; // Bumped 2026-04-15 — fix localStorage key prefix mismatch (P1-A/B)
export const PINECONE_DEFAULT_INDEX = "sakata-mathematics";
