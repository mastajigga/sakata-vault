export const STORAGE_KEYS = {
  APP_VERSION: "sakata-app-version",
  LANG: "sakata-lang",
  // IMPORTANT: All keys MUST start with "sakata-" (dash, not underscore)
  // so the version-bump invalidation in AuthProvider can sweep them cleanly.
  WELCOME_SEEN: "sakata-welcome-seen-v2",
} as const;

/**
 * Returns the localStorage key for a given message ID's "viewed" flag.
 * MUST start with "sakata-msg-viewed-" so AuthProvider purge logic matches.
 */
export function msgViewedKey(id: string): string {
  return `sakata-msg-viewed-${id}`;
}

export const SESSION_KEYS = {
  SESSION_ID: "sakata_session_id",
} as const;
