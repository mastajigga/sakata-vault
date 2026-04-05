import { createClient } from "@supabase/supabase-js";

// Supabase Admin is used specifically for backend functionality where RLS bypass is necessary.
// Make sure this is ONLY used in Server Actions or API Routes, NEVER in client components.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
