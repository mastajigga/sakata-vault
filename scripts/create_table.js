const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sql = `
    CREATE TABLE IF NOT EXISTS forum_reports (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
      reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
      moderator_id UUID REFERENCES profiles(id)
    );
    CREATE INDEX IF NOT EXISTS idx_forum_reports_status ON forum_reports(status);
  `;

  console.log("Tentative de création de la table via RPC 'exec_sql'...");
  const { data, error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    console.error("L'appel RPC 'exec_sql' a échoué (elle n'existe probablement pas) :", error.message);
    console.log("Veuillez exécuter le SQL manuellement dans le dashboard Supabase.");
  } else {
    console.log("Table 'forum_reports' créée avec succès !");
  }
}

run();
