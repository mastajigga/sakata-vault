import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const { data: data1, error: error1 } = await supabase
    .from('articles')
    .update({ 
      has_narrator: true,
      narrator_extension: 'mp3' 
    })
    .eq('slug', 'ngongo-philosophique')
    .select();

  const { data: data2, error: error2 } = await supabase
    .from('articles')
    .update({ 
      has_narrator: true,
      narrator_extension: 'mp3' 
    })
    .eq('slug', 'chefferie-equilibre-deux-mondes')
    .select();

  if (error1) console.error('Error updating ngongo:', error1.message);
  else console.log('Successfully updated ngongo-philosophique to mp3 in DB!', data1);

  if (error2) console.error('Error updating chefferie:', error2.message);
  else console.log('Successfully updated chefferie to mp3 in DB!', data2);
}

main();
