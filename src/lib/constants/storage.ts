export const STORAGE_KEYS = {
  APP_VERSION: "sakata-app-version",
  LANG: "sakata-lang",
  WELCOME_SEEN: "sakata_welcome_seen_v2",
} as const;

/** Returns the localStorage key for a given message ID's "viewed" flag */
export function msgViewedKey(id: string): string {
  return `msg-viewed-${id}`;
}

export const SESSION_KEYS = {
  SESSION_ID: "sakata_session_id",
} as const;
