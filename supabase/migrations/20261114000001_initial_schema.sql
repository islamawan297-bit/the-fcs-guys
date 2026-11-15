-- ==============================================================================
-- THE FCS GUYS: COMPREHENSIVE BACKEND DATABASE SCHEMA & RLS
-- Migration: 00001_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES & ROLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'contributor' CHECK (role IN ('superadmin', 'editor', 'contributor')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 2. CATEGORIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. TAGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. CONFERENCES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.conferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,            -- e.g. 'mvfc', 'big-sky'
  name TEXT NOT NULL UNIQUE,            -- e.g. 'Missouri Valley Football Conference'
  short_name TEXT NOT NULL,             -- e.g. 'MVFC'
  hq_location TEXT,
  founded_year INT,
  banner_color TEXT DEFAULT '#FFD400',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. SEASONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INT NOT NULL UNIQUE,             -- e.g. 2026
  title TEXT NOT NULL,                  -- e.g. '2026-27 FCS Season'
  is_current BOOLEAN NOT NULL DEFAULT false,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. TEAMS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,                   -- e.g. 'North Dakota State'
  mascot TEXT NOT NULL,                 -- e.g. 'Bison'
  slug TEXT NOT NULL UNIQUE,            -- e.g. 'north-dakota-state'
  city TEXT,
  state TEXT,
  stadium_name TEXT,
  stadium_capacity INT,
  primary_color TEXT DEFAULT '#FFD400',
  secondary_color TEXT DEFAULT '#080808',
  logo_url TEXT,
  current_conference_id UUID REFERENCES public.conferences(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 7. TEAM CONFERENCE HISTORICAL MEMBERSHIP
-- (Allows conference realignment without corrupting historical season records)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team_conference_membership (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  conference_id UUID NOT NULL REFERENCES public.conferences(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  division_name TEXT,                   -- For conferences with divisions
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (team_id, season_id)
);

-- ==============================================================================
-- 8. STANDINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.standings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  conference_id UUID NOT NULL REFERENCES public.conferences(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  conference_wins INT NOT NULL DEFAULT 0 CHECK (conference_wins >= 0),
  conference_losses INT NOT NULL DEFAULT 0 CHECK (conference_losses >= 0),
  overall_wins INT NOT NULL DEFAULT 0 CHECK (overall_wins >= 0),
  overall_losses INT NOT NULL DEFAULT 0 CHECK (overall_losses >= 0),
  home_record TEXT DEFAULT '0-0',
  away_record TEXT DEFAULT '0-0',
  streak TEXT DEFAULT '-',
  position_rank INT NOT NULL DEFAULT 1,
  clinched_postseason BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (season_id, team_id)
);

-- ==============================================================================
-- 9. ARTICLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  conference_id UUID REFERENCES public.conferences(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  featured_image_url TEXT,
  image_caption TEXT,
  read_time_minutes INT NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 10. ARTICLE_TAGS (M2M)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- ==============================================================================
-- 11. RANKING EDITIONS (Preserves historical week-by-week ballots)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ranking_editions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number >= 0),
  edition_title TEXT NOT NULL,           -- e.g. 'Week 12 National Media Poll'
  ranking_date DATE NOT NULL,
  total_voters INT NOT NULL DEFAULT 26,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (season_id, week_number)
);

-- ==============================================================================
-- 12. RANKING ENTRIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ranking_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edition_id UUID NOT NULL REFERENCES public.ranking_editions(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  rank INT NOT NULL CHECK (rank BETWEEN 1 AND 25),
  previous_rank INT CHECK (previous_rank IS NULL OR previous_rank >= 1),
  first_place_votes INT NOT NULL DEFAULT 0 CHECK (first_place_votes >= 0),
  points INT NOT NULL DEFAULT 0 CHECK (points >= 0),
  trend TEXT NOT NULL DEFAULT 'same' CHECK (trend IN ('up', 'down', 'same')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (edition_id, rank),
  UNIQUE (edition_id, team_id)
);

-- ==============================================================================
-- 13. PLAYOFF EDITIONS (Bracketology Modeling)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.playoff_editions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,                   -- e.g. 'Road to Frisco - Week 12 Projection'
  edition_date DATE NOT NULL,
  is_official BOOLEAN NOT NULL DEFAULT false, -- Clearly marks projections vs official NCAA bracket
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 14. PLAYOFF ENTRIES (24 Field Teams)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.playoff_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edition_id UUID NOT NULL REFERENCES public.playoff_editions(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  seed INT CHECK (seed IS NULL OR (seed BETWEEN 1 AND 16)),
  bid_type TEXT NOT NULL CHECK (bid_type IN ('Auto Bid', 'At-Large')),
  host_status TEXT NOT NULL CHECK (host_status IN ('Host First Round Bye', 'First Round Host', 'Road Matchup')),
  analyst_commentary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (edition_id, team_id)
);

-- ==============================================================================
-- 15. PLAYOFF MATCHUPS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.playoff_matchups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  edition_id UUID NOT NULL REFERENCES public.playoff_editions(id) ON DELETE CASCADE,
  round TEXT NOT NULL CHECK (round IN ('First Round', 'Second Round', 'Quarterfinals', 'Semifinals', 'Championship')),
  game_number INT NOT NULL,
  location_name TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  team1_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  team2_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  projected_winner_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 16. MEDIA ASSETS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bucket_name TEXT NOT NULL DEFAULT 'editorial-media',
  storage_path TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 17. SITE SETTINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_conference ON public.articles(conference_id);

CREATE INDEX IF NOT EXISTS idx_standings_season_conf ON public.standings(season_id, conference_id, position_rank);
CREATE INDEX IF NOT EXISTS idx_ranking_editions_season ON public.ranking_editions(season_id, week_number);
CREATE INDEX IF NOT EXISTS idx_ranking_entries_edition ON public.ranking_entries(edition_id, rank);
CREATE INDEX IF NOT EXISTS idx_playoff_entries_edition ON public.playoff_entries(edition_id, seed);
CREATE INDEX IF NOT EXISTS idx_playoff_matchups_edition ON public.playoff_matchups(edition_id, round);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_standings_updated_at BEFORE UPDATE ON public.standings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_ranking_editions_updated_at BEFORE UPDATE ON public.ranking_editions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE OR REPLACE TRIGGER trg_playoff_editions_updated_at BEFORE UPDATE ON public.playoff_editions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_conference_membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playoff_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playoff_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playoff_matchups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check if current authenticated user has editor/superadmin privileges
CREATE OR REPLACE FUNCTION public.is_editor_or_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('superadmin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles RLS
CREATE POLICY "Public can view writer profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can edit own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Public Read Policies for Published Sports Content
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Public can view conferences" ON public.conferences FOR SELECT USING (true);
CREATE POLICY "Public can view seasons" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Public can view teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public can view team conference memberships" ON public.team_conference_membership FOR SELECT USING (true);
CREATE POLICY "Public can view standings" ON public.standings FOR SELECT USING (true);

CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  USING (status = 'published' AND published_at <= timezone('utc'::text, now()));

CREATE POLICY "Staff can view all articles"
  ON public.articles FOR SELECT
  USING (public.is_editor_or_superadmin() OR auth.uid() = author_id);

CREATE POLICY "Public can view article tags for published articles"
  ON public.article_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.articles
    WHERE articles.id = article_tags.article_id
      AND (articles.status = 'published' OR public.is_editor_or_superadmin())
  ));

CREATE POLICY "Public can view published ranking editions"
  ON public.ranking_editions FOR SELECT
  USING (status = 'published');

CREATE POLICY "Staff can view all ranking editions"
  ON public.ranking_editions FOR SELECT
  USING (public.is_editor_or_superadmin());

CREATE POLICY "Public can view ranking entries of published editions"
  ON public.ranking_entries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ranking_editions
    WHERE ranking_editions.id = ranking_entries.edition_id
      AND (ranking_editions.status = 'published' OR public.is_editor_or_superadmin())
  ));

CREATE POLICY "Public can view published playoff editions"
  ON public.playoff_editions FOR SELECT
  USING (status = 'published');

CREATE POLICY "Staff can view all playoff editions"
  ON public.playoff_editions FOR SELECT
  USING (public.is_editor_or_superadmin());

CREATE POLICY "Public can view playoff entries of published editions"
  ON public.playoff_entries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.playoff_editions
    WHERE playoff_editions.id = playoff_entries.edition_id
      AND (playoff_editions.status = 'published' OR public.is_editor_or_superadmin())
  ));

CREATE POLICY "Public can view playoff matchups of published editions"
  ON public.playoff_matchups FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.playoff_editions
    WHERE playoff_editions.id = playoff_matchups.edition_id
      AND (playoff_editions.status = 'published' OR public.is_editor_or_superadmin())
  ));

CREATE POLICY "Public can view media assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Public can view public site settings" ON public.site_settings FOR SELECT USING (true);

-- 3. Administrator / Editor Write Policies (Full Mutability)
CREATE POLICY "Staff can insert articles" ON public.articles FOR INSERT WITH CHECK (public.is_editor_or_superadmin() AND auth.uid() = author_id);
CREATE POLICY "Staff can update articles" ON public.articles FOR UPDATE USING (public.is_editor_or_superadmin() OR auth.uid() = author_id);
CREATE POLICY "Staff can delete articles" ON public.articles FOR DELETE USING (public.is_editor_or_superadmin());

CREATE POLICY "Staff can manage categories" ON public.categories FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage tags" ON public.tags FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage article_tags" ON public.article_tags FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage conferences" ON public.conferences FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage seasons" ON public.seasons FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage teams" ON public.teams FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage memberships" ON public.team_conference_membership FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage standings" ON public.standings FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage ranking editions" ON public.ranking_editions FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage ranking entries" ON public.ranking_entries FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage playoff editions" ON public.playoff_editions FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage playoff entries" ON public.playoff_entries FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage playoff matchups" ON public.playoff_matchups FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage media assets" ON public.media_assets FOR ALL USING (public.is_editor_or_superadmin());
CREATE POLICY "Staff can manage site settings" ON public.site_settings FOR ALL USING (public.is_editor_or_superadmin());

-- ==============================================================================
-- STORAGE CONFIGURATION (bucket: editorial-media)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'editorial-media',
  'editorial-media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- Storage RLS
CREATE POLICY "Public Access for Editorial Media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'editorial-media');

CREATE POLICY "Staff can upload editorial media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'editorial-media' AND public.is_editor_or_superadmin());

CREATE POLICY "Staff can delete editorial media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'editorial-media' AND public.is_editor_or_superadmin());

