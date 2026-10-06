import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseForUser } from "@/lib/supabase/user";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canModerate, isFullAdmin, getEffectiveRole, type UserRole } from "@/lib/constants/business";

type AuthContext = { user: User | null; supabase: SupabaseClient };
type AuthOptions = { withClient: true; writeCookies?: boolean };

/**
 * Bearer first (mobile), then cookie (web). Invalid/empty Bearer never falls
 * back to cookies. withClient returns the same session's client for RLS queries.
 */
export function getCurrentAuthUser(): Promise<User | null>;
export function getCurrentAuthUser(options: AuthOptions): Promise<AuthContext>;
export async function getCurrentAuthUser(options?: AuthOptions): Promise<User | null | AuthContext> {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (/^Bearer(?:\s|$)/i.test(authHeader ?? "")) {
    const bearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
    const supabase = createSupabaseForUser(bearer ?? "");
    let user: User | null = null;
    if (bearer) {
      const { data, error } = await supabase.auth.getUser(bearer);
      user = error ? null : data.user;
    }
    return options?.withClient ? { user, supabase } : user;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (updates) => {
          if (options?.writeCookies) {
            updates.forEach(({ name, value, options: cookieOptions }) =>
              cookieStore.set(name, value, cookieOptions)
            );
          }
        },
      },
    }
  );
  const { data, error } = await supabase.auth.getUser();
  const user = error ? null : data.user;
  return options?.withClient ? { user, supabase } : user;
}

export async function requireModerator() {
  const user = await getCurrentAuthUser();
  if (!user) return { error: "Non autorisé", status: 401 as const };

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, role, temp_admin_expires_at, temp_admin_original_role")
    .eq("id", user.id)
    .single();

  if (!profile || !canModerate(profile)) {
    return { error: "Permissions insuffisantes", status: 403 as const };
  }
  const effectiveRole = getEffectiveRole(profile) as UserRole;
  return { user, profile, effectiveRole };
}

export async function requireFullAdmin() {
  const user = await getCurrentAuthUser();
  if (!user) return { error: "Non autorisé", status: 401 as const };

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, role, temp_admin_expires_at, temp_admin_original_role")
    .eq("id", user.id)
    .single();

  if (!profile || !isFullAdmin(profile)) {
    return { error: "Réservé aux administrateurs", status: 403 as const };
  }
  return { user, profile };
}
