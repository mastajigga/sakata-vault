-- Migration: Geography Community Tables (Phase 5)
-- Purpose: Create tables for community contributions, annotations, comments, and voting on the interactive map
-- Author: Kisakata Development Team
-- Date: 2026-04-07

-- =====================================================
-- TABLE: geographie_annotations
-- Purpose: Store user-contributed pins on the map
-- =====================================================
CREATE TABLE IF NOT EXISTS geographie_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  title TEXT NOT NULL,
  description TEXT,
  annotation_type TEXT NOT NULL CHECK (annotation_type IN (
    'photo',        -- Image upload
    'video',        -- Video/film clip
    'story',        -- Personal narrative
    'memory',       -- Childhood memory
    'question',     -- Community question
    'proverb',      -- Traditional proverb
    'historical'    -- Historical information
  )),

  -- Geolocation
  location GEOGRAPHY(POINT, 4326) NOT NULL,

  -- Context
  village_name TEXT,
  tribe_name TEXT,
  dialect_zone TEXT,
  clan_association TEXT,

  -- Media
  media_urls TEXT[] DEFAULT '{}',       -- Array of URLs to uploaded files
  media_types TEXT[] DEFAULT '{}',      -- Types: 'image', 'video', 'audio'
  media_metadata JSONB,                 -- EXIF, duration, dimensions, etc.

  -- Engagement
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0 NOT NULL,

  -- Status
  is_verified BOOLEAN DEFAULT FALSE,    -- Admin-validated contributions
  is_featured BOOLEAN DEFAULT FALSE,    -- Highlighted on homepage
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Metadata
  source_ip INET,                       -- For analytics
  browser_user_agent TEXT,
  language_code TEXT DEFAULT 'fr'
);

CREATE INDEX idx_geographie_annotations_location ON geographie_annotations USING GIST (location);
CREATE INDEX idx_geographie_annotations_user_id ON geographie_annotations(user_id);
CREATE INDEX idx_geographie_annotations_created_at ON geographie_annotations(created_at DESC);
CREATE INDEX idx_geographie_annotations_tribe ON geographie_annotations(tribe_name);
CREATE INDEX idx_geographie_annotations_status ON geographie_annotations(status);

-- =====================================================
-- TABLE: geographie_comments
-- Purpose: Threaded discussions on annotations
-- =====================================================
CREATE TABLE IF NOT EXISTS geographie_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  annotation_id UUID NOT NULL REFERENCES geographie_annotations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,

  -- Threading
  parent_id UUID REFERENCES geographie_comments(id) ON DELETE CASCADE,
  depth INT DEFAULT 0,  -- Nesting depth (0 = top-level)

  -- Engagement
  likes_count INT DEFAULT 0,

  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'deleted')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_geographie_comments_annotation_id ON geographie_comments(annotation_id);
CREATE INDEX idx_geographie_comments_user_id ON geographie_comments(user_id);
CREATE INDEX idx_geographie_comments_parent_id ON geographie_comments(parent_id);
CREATE INDEX idx_geographie_comments_created_at ON geographie_comments(created_at DESC);

-- =====================================================
-- TABLE: geographie_annotation_votes
-- Purpose: Like/vote system for annotations
-- =====================================================
CREATE TABLE IF NOT EXISTS geographie_annotation_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  annotation_id UUID NOT NULL REFERENCES geographie_annotations(id) ON DELETE CASCADE,
  vote_type TEXT DEFAULT 'like' CHECK (vote_type IN ('like', 'flag')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, annotation_id, vote_type)
);

CREATE INDEX idx_geographie_annotation_votes_annotation ON geographie_annotation_votes(annotation_id);
CREATE INDEX idx_geographie_annotation_votes_user ON geographie_annotation_votes(user_id);

-- =====================================================
-- TABLE: geographie_comment_votes
-- Purpose: Like system for comments
-- =====================================================
CREATE TABLE IF NOT EXISTS geographie_comment_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES geographie_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, comment_id)
);

CREATE INDEX idx_geographie_comment_votes_comment ON geographie_comment_votes(comment_id);

-- =====================================================
-- TABLE: geographie_layers_metadata
-- Purpose: Configuration and description of map layers
-- =====================================================
CREATE TABLE IF NOT EXISTS geographie_layers_metadata (
  id TEXT PRIMARY KEY,  -- 'hydro', 'forest', 'subtribes', 'dialects', 'villages', 'chiefdoms', 'clans'

  -- Labels
  name_fr TEXT NOT NULL,
  name_skt TEXT,

  -- Descriptions
  description_fr TEXT,
  description_skt TEXT,

  -- Display
  is_default_visible BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  icon_name TEXT,  -- Lucide icon name
  color_hex TEXT,  -- Hex color for legend

  -- Metadata
  data_source TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  attribution TEXT
);

-- =====================================================
-- TABLE: geographie_terrain_metadata
-- Purpose: Elevation and terrain data statistics
-- =====================================================
CREATE TABLE IF NOT EXISTS geographie_terrain_metadata (
  id TEXT PRIMARY KEY DEFAULT 'kutu',

  -- Territory bounds
  min_elevation_m INT,
  max_elevation_m INT,
  mean_elevation_m INT,

  -- Lake/Water
  lake_area_km2 DECIMAL,
  lake_min_elevation_m INT,

  -- Forest
  forest_coverage_percent DECIMAL,
  deforestation_rate_percent_per_year DECIMAL,

  -- Population
  population_estimate INT,
  population_density_per_km2 DECIMAL,

  -- Climate
  rainfall_mm_per_year INT,
  dry_season_duration_months INT,
  wet_season_duration_months INT,

  -- Updates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE geographie_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographie_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographie_annotation_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographie_comment_votes ENABLE ROW LEVEL SECURITY;

-- Annotations: Public read, authenticated write
CREATE POLICY "Annotations are publicly readable"
  ON geographie_annotations
  FOR SELECT
  USING (status = 'published' OR user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
  ));

CREATE POLICY "Users can create annotations"
  ON geographie_annotations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own annotations"
  ON geographie_annotations
  FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
  ));

CREATE POLICY "Users can delete own annotations"
  ON geographie_annotations
  FOR DELETE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Comments: Public read, authenticated write
CREATE POLICY "Comments are publicly readable"
  ON geographie_comments
  FOR SELECT
  USING (status = 'published' OR user_id = auth.uid());

CREATE POLICY "Users can create comments"
  ON geographie_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON geographie_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Votes: Authenticated only
CREATE POLICY "Users can vote on annotations"
  ON geographie_annotation_votes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view votes"
  ON geographie_annotation_votes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can remove own votes"
  ON geographie_annotation_votes
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can vote on comments"
  ON geographie_comment_votes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own comment votes"
  ON geographie_comment_votes
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update annotation's likes_count when votes change
CREATE OR REPLACE FUNCTION update_annotation_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.vote_type = 'like' THEN
    UPDATE geographie_annotations SET likes_count = likes_count + 1
    WHERE id = NEW.annotation_id;
  ELSIF TG_OP = 'DELETE' AND OLD.vote_type = 'like' THEN
    UPDATE geographie_annotations SET likes_count = likes_count - 1
    WHERE id = OLD.annotation_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_annotation_likes_count
AFTER INSERT OR DELETE ON geographie_annotation_votes
FOR EACH ROW
EXECUTE FUNCTION update_annotation_likes_count();

-- Update comment's likes_count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE geographie_comments SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE geographie_comments SET likes_count = likes_count - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_comment_likes_count
AFTER INSERT OR DELETE ON geographie_comment_votes
FOR EACH ROW
EXECUTE FUNCTION update_comment_likes_count();

-- Update annotation's comments_count when comments are added
CREATE OR REPLACE FUNCTION update_annotation_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
    UPDATE geographie_annotations SET comments_count = comments_count + 1
    WHERE id = NEW.annotation_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'published' THEN
    UPDATE geographie_annotations SET comments_count = comments_count - 1
    WHERE id = OLD.annotation_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_annotation_comments_count
AFTER INSERT OR DELETE ON geographie_comments
FOR EACH ROW
EXECUTE FUNCTION update_annotation_comments_count();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_annotations_updated_at
BEFORE UPDATE ON geographie_annotations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_comments_updated_at
BEFORE UPDATE ON geographie_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert layer metadata
INSERT INTO geographie_layers_metadata (id, name_fr, name_skt, description_fr, is_default_visible, sort_order, icon_name, color_hex) VALUES
  ('hydro', 'Rivières & Lac', 'Mbela & Iyâ', 'Réseau hydrographique et lacs', true, 1, 'droplets', '#0C2920'),
  ('forest', 'Forêt & Savane', 'Mpunga & Etale', 'Couverture forestière', false, 2, 'trees', '#0F2C24'),
  ('subtribes', 'Sous-tribus', 'Bikolo', 'Territoires ethniques', true, 3, 'users', '#1A3528'),
  ('dialects', 'Dialectes', 'Ndinga', 'Zones linguistiques', false, 4, 'languages', '#0D2419'),
  ('villages', 'Villages & Ports', 'Mboka', 'Localités et sites historiques', true, 5, 'map-pin', '#163024'),
  ('chiefdoms', 'Chefferies', 'Dikundo', 'Entités administratives historiques', false, 6, 'crown', '#1B2838'),
  ('clans', 'Clans', 'Bikenge', 'Groupes de parenté totemiques', false, 7, 'shield', '#2A1810');

-- Insert terrain metadata for Kutu
INSERT INTO geographie_terrain_metadata (
  id, min_elevation_m, max_elevation_m, mean_elevation_m,
  lake_area_km2, lake_min_elevation_m,
  forest_coverage_percent, deforestation_rate_percent_per_year,
  population_estimate, population_density_per_km2,
  rainfall_mm_per_year, dry_season_duration_months, wet_season_duration_months
) VALUES (
  'kutu',
  300,      -- min elevation
  450,      -- max elevation
  360,      -- mean elevation
  2300,     -- Lake Mai-Ndombe area
  330,      -- lake elevation
  75.0,     -- forest coverage
  1.2,      -- deforestation rate
  130000,   -- population estimate
  7.2,      -- density
  2100,     -- rainfall
  4,        -- dry season duration
  8         -- wet season duration
);

-- =====================================================
-- FUNCTIONS FOR COMMUNITY FEATURES
-- =====================================================

-- Get trending annotations (most liked recently)
CREATE OR REPLACE FUNCTION get_trending_annotations(limit_count INT DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  likes_count INT,
  comments_count INT,
  created_at TIMESTAMPTZ,
  user_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.likes_count,
    a.comments_count,
    a.created_at,
    a.user_id
  FROM geographie_annotations a
  WHERE a.status = 'published'
  ORDER BY a.likes_count DESC, a.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Get annotations within a geographic radius (in km)
CREATE OR REPLACE FUNCTION get_annotations_by_radius(
  center_lat FLOAT,
  center_lon FLOAT,
  radius_km FLOAT DEFAULT 5.0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  location GEOGRAPHY,
  distance_km NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.location,
    ST_Distance(a.location, ST_MakePoint(center_lon, center_lat)::geography) / 1000 AS distance_km
  FROM geographie_annotations a
  WHERE a.status = 'published'
    AND ST_DWithin(a.location, ST_MakePoint(center_lon, center_lat)::geography, radius_km * 1000)
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Get annotations by tribe/dialect zone
CREATE OR REPLACE FUNCTION get_annotations_by_tribe(tribe_name TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ,
  likes_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.description,
    a.created_at,
    a.likes_count
  FROM geographie_annotations a
  WHERE a.status = 'published'
    AND (a.tribe_name = tribe_name OR a.dialect_zone = tribe_name)
  ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql;
