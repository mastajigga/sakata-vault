import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Client anon par requête portant le JWT de l'utilisateur : PostgREST s'exécute
// en rôle `authenticated` avec auth.uid() = user.id, donc la RLS s'applique.
// À utiliser dans les API Routes recevant un `Authorization: Bearer <token>`.
// NE PAS remplacer par supabaseAdmin (service role) : cela contournerait la RLS.
export function createSupabaseForUser(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
