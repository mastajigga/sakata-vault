import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canModerate, isFullAdmin, getEffectiveRole, type UserRole } from "@/lib/constants/business";

export async function getCurrentAuthUser() {
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
