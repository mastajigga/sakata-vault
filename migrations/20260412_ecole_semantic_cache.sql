-- Migration: ecole_semantic_cache
-- Purpose: Cache Pinecone semantic enrichment results per course chapter
-- TTL enforced at application layer (24h)
-- Date: 2026-04-12

CREATE TABLE IF NOT EXISTS ecole_semantic_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  query text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ecole_semantic_cache_chapter
  ON ecole_semantic_cache(chapter_id);

ALTER TABLE ecole_semantic_cache ENABLE ROW LEVEL SECURITY;

-- Public read: cached enrichment content is not sensitive
CREATE POLICY "public_read_semantic_cache"
  ON ecole_semantic_cache
  FOR SELECT
  USING (true);

-- Service role only for writes (API route uses supabaseAdmin)
CREATE POLICY "service_write_semantic_cache"
  ON ecole_semantic_cache
  FOR ALL
  USING (auth.role() = 'service_role');
