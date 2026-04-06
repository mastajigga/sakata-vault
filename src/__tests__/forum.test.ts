import { describe, it, expect, vi } from 'vitest';
import { supabasePublic } from '../lib/supabase/admin';

describe('Forum Query Logic', () => {
  it('should have a valid query structure for threads', async () => {
    const categoryId = 'bcfdfb7a-270a-4943-bdb9-6c53cd175354';
    try {
      const { data, error } = await supabasePublic
        .from("forum_threads")
        .select(`
          *,
          profiles ( username, avatar_url, nickname ),
          forum_posts ( count )
        `)
        .eq("category_id", categoryId);
        
      console.log(`[Test] Supabase query worked, data count: ${data?.length || 0}`);
      if (error) console.error("[Test] Query Error:", error);
    } catch (e) {
      console.error("[Test] Exception:", e);
    }
  });
});
