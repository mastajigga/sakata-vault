import { DELETED_USER_LABEL } from "@/lib/constants/business";

export type AnyProfileLike = {
  deleted_at?: string | null;
  banned_until?: string | null;
  username?: string | null;
  nickname?: string | null;
  avatar_url?: string | null;
  id?: string | null;
} | null | undefined;

export function isDeletedProfile(p: AnyProfileLike): boolean {
  return !!(p && p.deleted_at);
}

/** Returns a stable display name for a profile, or "Utilisateur supprimé" if soft-deleted. */
export function displayProfileName(p: AnyProfileLike, fallback = "—"): string {
  if (!p) return fallback;
  if (isDeletedProfile(p)) return DELETED_USER_LABEL;
  return p.nickname || p.username || fallback;
}

/** Should this profile's name be a link? (false if deleted) */
export function isProfileClickable(p: AnyProfileLike): boolean {
  return !!(p && !isDeletedProfile(p) && (p.username || p.id));
}

/** Avatar URL with deletion fallback (returns null when deleted to force initials/anon view) */
export function profileAvatarUrl(p: AnyProfileLike): string | null {
  if (!p || isDeletedProfile(p)) return null;
  return p.avatar_url || null;
}
