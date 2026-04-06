import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching threads for category...");
  const categoryId = 'bcfdfb7a-270a-4943-bdb9-6c53cd175354';
  const { data: threads, error: threadsError } = await supabaseAdmin
    .from("forum_threads")
    .select(`
      *,
      profiles ( display_name, avatar_url ),
      forum_posts ( count )
    `)
    .eq("category_id", categoryId)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (threadsError) {
    console.error("ERROR FROM SUPABASE:", threadsError);
  } else {
    console.log(`Found ${threads?.length || 0} threads.`);
    if (threads && threads.length > 0) {
      console.log("First thread:", JSON.stringify(threads[0], null, 2));
    }
  }
}

run();
