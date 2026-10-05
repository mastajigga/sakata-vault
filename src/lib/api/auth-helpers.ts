import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { supabaseAdmin, supabasePublic } from "@/lib/supabase/admin";
import { canModerate, isFullAdmin, getEffectiveRole, type UserRole } from "@/lib/constants/business";

/**
 * Resolves the caller: `Authorization: Bearer <jwt>` first (mobile app),
 * then the Supabase session cookie (web). Same model as /api/stripe/checkout.
 * A present-but-invalid Bearer token does not fall back to the cookie.
 */
export async function getCurrentAuthUser() {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  const bearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (bearer) {
    const { data: { user }, error } = await supabasePublic.auth.getUser(bearer);
    return error ? null : user;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
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
