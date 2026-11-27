-- ==============================================================================
-- THE FCS GUYS: COMPREHENSIVE BACKEND DATABASE SCHEMA & RLS
-- Migration: 00001_initial_schema.sql (Production-Hardened, Zero Bypass & Schema Compatibility)
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- Schema compatibility for pre-existing profiles tables
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'contributor' CHECK (role IN ('superadmin', 'editor', 'contributor'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- ==============================================================================
-- 2. CATEGORIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- ==============================================================================
-- 3. TAGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. CONFERENCES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.conferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

ALTER TABLE public.conferences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- ==============================================================================
-- 5. SEASONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- ==============================================================================
-- 7. TEAM CONFERENCE HISTORICAL MEMBERSHIP
-- (Allows conference realignment without corrupting historical season records)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team_conference_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  conference_id UUID NOT NULL REFERENCES public.conferences(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  division_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (team_id, season_id)
);

-- ==============================================================================
-- 8. STANDINGS
-- (CRITICAL FIX 2: Default is_verified = false ensures new standings remain private until certified)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  is_verified BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (season_id, team_id)
);

-- Schema compatibility for pre-existing standings tables:
ALTER TABLE public.standings ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.standings ALTER COLUMN is_verified SET DEFAULT false;

-- ==============================================================================
-- 9. ARTICLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number >= 0),
  edition_title TEXT NOT NULL,
  ranking_date DATE NOT NULL,
  total_voters INT NOT NULL DEFAULT 26,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (season_id, week_number)
);

ALTER TABLE public.ranking_editions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- ==============================================================================
-- 12. RANKING ENTRIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ranking_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
-- 13. INDIVIDUAL VOTER BALLOTS (Certified Poll Transparency & Voter Auditing)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.voter_ballots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES public.ranking_editions(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  voter_name TEXT NOT NULL,
  affiliation TEXT,
  ballot_votes JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_certified BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (edition_id, voter_id)
);

ALTER TABLE public.voter_ballots ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());
ALTER TABLE public.voter_ballots ADD COLUMN IF NOT EXISTS is_certified BOOLEAN NOT NULL DEFAULT false;

-- ==============================================================================
-- 14. PLAYOFF EDITIONS (Bracketology Modeling)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.playoff_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  edition_date DATE NOT NULL,
  is_official BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.playoff_editions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
ALTER TABLE public.playoff_editions ADD COLUMN IF NOT EXISTS edition_date DATE;
ALTER TABLE public.playoff_editions ADD COLUMN IF NOT EXISTS is_official BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.playoff_editions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.playoff_editions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- ==============================================================================
-- 14. PLAYOFF ENTRIES (24 Field Teams)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.playoff_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

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
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_articles_updated_at ON public.articles;
CREATE TRIGGER trg_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_standings_updated_at ON public.standings;
CREATE TRIGGER trg_standings_updated_at BEFORE UPDATE ON public.standings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_ranking_editions_updated_at ON public.ranking_editions;
CREATE TRIGGER trg_ranking_editions_updated_at BEFORE UPDATE ON public.ranking_editions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_voter_ballots_updated_at ON public.voter_ballots;
CREATE TRIGGER trg_voter_ballots_updated_at BEFORE UPDATE ON public.voter_ballots FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_playoff_editions_updated_at ON public.playoff_editions;
CREATE TRIGGER trg_playoff_editions_updated_at BEFORE UPDATE ON public.playoff_editions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- CRITICAL FIX 1: SECURE AUTHORIZATION HELPER FUNCTIONS
-- Eliminates insecure function owner checks and role tampering
-- Relies exclusively on verified Supabase JWT auth.role() = 'service_role' or DB profiles.role
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT (auth.role() = 'service_role');
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role TEXT;
BEGIN
  -- 1. Genuine service_role token used by server-side backend operations
  IF auth.role() = 'service_role' THEN
    RETURN 'superadmin';
  END IF;

  -- 2. Authenticated user MUST be verified against database profile record
  IF auth.uid() IS NOT NULL THEN
    SELECT role INTO v_role
    FROM public.profiles
    WHERE id = auth.uid();
    RETURN COALESCE(v_role, 'contributor');
  END IF;

  -- 3. Anonymous visitor
  RETURN 'anonymous';
END;
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT (public.get_current_user_role() IN ('superadmin', 'editor'));
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT (public.get_current_user_role() = 'superadmin');
$$;

-- Revoke dangerous permissions on security definer functions from public
REVOKE EXECUTE ON FUNCTION public.is_service_role() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_current_user_role() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_editor_or_superadmin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_superadmin() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_service_role() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_editor_or_superadmin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_superadmin() TO anon, authenticated, service_role;

-- ==============================================================================
-- CRITICAL FIX 1 & 3: SUPERADMIN ROLE PROTECTION TRIGGER
-- Prevents self-promotion, editor-to-superadmin elevation, and identity tampering
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.protect_profile_roles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Service role backend processes are authorized
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- If role is being modified, only verified superadmins can authorize it
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_superadmin() THEN
      RAISE EXCEPTION 'Security Violation: Only superadministrators are authorized to assign or modify profile roles.';
    END IF;
  END IF;

  -- Non-superadmins cannot modify their own email or ID
  IF NEW.id IS DISTINCT FROM OLD.id OR NEW.email IS DISTINCT FROM OLD.email THEN
    IF NOT public.is_superadmin() THEN
      RAISE EXCEPTION 'Security Violation: Account identity fields cannot be modified.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_roles ON public.profiles;
CREATE TRIGGER trg_protect_profile_roles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_roles();

-- ==============================================================================
-- CRITICAL FIX 2: ARTICLE PUBLISHING & OWNERSHIP PROTECTION TRIGGER
-- Enforces workflow rules: Contributors can ONLY create/edit drafts and CANNOT publish.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.enforce_article_publishing_rules()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_role TEXT;
BEGIN
  -- Service role operations are permitted
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  v_user_role := public.get_current_user_role();

  -- 1. On INSERT: Contributors can ONLY create 'draft' articles
  IF TG_OP = 'INSERT' THEN
    IF v_user_role = 'contributor' AND NEW.status != 'draft' THEN
      RAISE EXCEPTION 'Security Violation: Contributors are only authorized to save articles in draft status.';
    END IF;
  END IF;

  -- 2. On UPDATE:
  IF TG_OP = 'UPDATE' THEN
    -- Contributors cannot publish, archive, or alter article status from draft
    IF v_user_role = 'contributor' AND NEW.status != 'draft' THEN
      RAISE EXCEPTION 'Security Violation: Contributors cannot publish, archive, or alter article publication status.';
    END IF;

    -- Authors cannot reassign article ownership
    IF NEW.author_id IS DISTINCT FROM OLD.author_id THEN
      IF NOT public.is_editor_or_superadmin() THEN
        RAISE EXCEPTION 'Security Violation: Article authorship cannot be transferred by contributors.';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_article_publishing_rules ON public.articles;
CREATE TRIGGER trg_enforce_article_publishing_rules
  BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_article_publishing_rules();

-- ==============================================================================
-- CRITICAL FIX 2 (CONT): STANDINGS VERIFICATION TRIGGER
-- Enforces: Only editors and superadmins can mark standings verified.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.enforce_standings_verification_rules()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Service role is permitted
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- If standings are being marked verified on INSERT or UPDATE, check staff authorization
  IF NEW.is_verified = true THEN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (OLD.is_verified IS DISTINCT FROM true)) THEN
      IF NOT public.is_editor_or_superadmin() THEN
        RAISE EXCEPTION 'Security Violation: Only editors or superadmins can mark conference standings as verified.';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_standings_verification_rules ON public.standings;
CREATE TRIGGER trg_enforce_standings_verification_rules
  BEFORE INSERT OR UPDATE ON public.standings
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_standings_verification_rules();

-- ==============================================================================
-- CRITICAL FIX: VOTER BALLOT INTEGRITY & CERTIFICATION TRIGGER
-- Enforces:
-- 1. Non-staff voters CANNOT set or alter is_certified (certification is restricted to editors/superadmins).
-- 2. Non-staff voters CANNOT modify edition_id or voter_id on existing ballots.
-- 3. Non-staff voters CANNOT modify ballots once they have been certified.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.enforce_voter_ballot_rules()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Service role operations are permitted
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- 1. On INSERT:
  IF TG_OP = 'INSERT' THEN
    -- Non-staff voters cannot insert pre-certified ballots
    IF NEW.is_certified = true THEN
      IF NOT public.is_editor_or_superadmin() THEN
        RAISE EXCEPTION 'Security Violation: Only editors or superadmins can certify voter ballots.';
      END IF;
    END IF;
    -- Non-staff voters can only insert a ballot for their own auth.uid()
    IF NEW.voter_id IS DISTINCT FROM auth.uid() THEN
      IF NOT public.is_editor_or_superadmin() THEN
        RAISE EXCEPTION 'Security Violation: Voters can only submit ballots for their own account.';
      END IF;
    END IF;
  END IF;

  -- 2. On UPDATE:
  IF TG_OP = 'UPDATE' THEN
    -- If ballot is already certified, non-staff cannot alter it
    IF OLD.is_certified = true AND NOT public.is_editor_or_superadmin() THEN
      RAISE EXCEPTION 'Security Violation: Certified voter ballots are locked and cannot be modified by voters.';
    END IF;

    -- Only editors or superadmins can change is_certified status
    IF NEW.is_certified IS DISTINCT FROM OLD.is_certified THEN
      IF NOT public.is_editor_or_superadmin() THEN
        RAISE EXCEPTION 'Security Violation: Only editors or superadmins can certify or uncertify voter ballots.';
      END IF;
    END IF;

    -- Non-staff voters cannot reassign voter_id or edition_id
    IF NEW.voter_id IS DISTINCT FROM OLD.voter_id OR NEW.edition_id IS DISTINCT FROM OLD.edition_id THEN
      IF NOT public.is_editor_or_superadmin() THEN
        RAISE EXCEPTION 'Security Violation: Voter ballot ownership and ranking edition cannot be altered.';
      END IF;
    END IF;
  END IF;

  -- 3. On DELETE:
  IF TG_OP = 'DELETE' THEN
    IF OLD.is_certified = true AND NOT public.is_editor_or_superadmin() THEN
      RAISE EXCEPTION 'Security Violation: Certified voter ballots cannot be deleted by voters.';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_voter_ballot_rules ON public.voter_ballots;
CREATE TRIGGER trg_enforce_voter_ballot_rules
  BEFORE INSERT OR UPDATE OR DELETE ON public.voter_ballots
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_voter_ballot_rules();

-- ==============================================================================
-- CRITICAL FIX 4: SECURE PUBLIC AUTHOR PROFILE VIEW
-- Exposes ONLY public metadata (id, full_name, avatar_url, bio) for published authors.
-- Zero exposure of email or private account attributes.
-- Uses security_barrier = true without CASCADE to preserve database dependencies.
-- Runs with security definer view semantics (security_invoker = false) owned by postgres/creator
-- so anonymous and authenticated readers can view public author cards without granting direct
-- public table SELECT access to the private profiles table.
-- ==============================================================================
CREATE OR REPLACE VIEW public.public_author_profiles
WITH (security_barrier = true)
AS
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  p.bio
FROM public.profiles p
WHERE EXISTS (
  SELECT 1 FROM public.articles a
  WHERE a.author_id = p.id
    AND a.status = 'published'
    AND a.published_at <= timezone('utc'::text, now())
);

-- ==============================================================================
-- PROFILES PERMISSION & ACCESS CONTROL ARCHITECTURE
-- Intended Security Model:
-- 1. Anonymous (`anon`) role:
--    - Zero table-level SELECT on `public.profiles`. Cannot query `public.profiles` directly.
--    - Granted SELECT ONLY on `public.public_author_profiles` view, which exposes strictly
--      non-sensitive author metadata (id, full_name, avatar_url, bio) for published authors.
-- 2. Authenticated (`authenticated`) role:
--    - Granted table-level SELECT on `public.profiles` so PostgreSQL can evaluate RLS.
--    - Bound strictly by RLS:
--      * "Users can view own full profile" restricts regular users to `auth.uid() = id`.
--      * "Staff can view all profiles" permits editors and superadmins to view staff profiles.
-- 3. PUBLIC role:
--    - Revoked all table-level SELECT privileges to prevent unauthenticated inheritance.
-- ==============================================================================
REVOKE ALL ON TABLE public.profiles FROM PUBLIC;
REVOKE SELECT ON TABLE public.profiles FROM anon;
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

-- Grant SELECT on public view to anon, authenticated, and service_role
GRANT SELECT ON public.public_author_profiles TO anon, authenticated, service_role;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — IDEMPOTENT (DROP IF EXISTS)
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
ALTER TABLE public.voter_ballots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playoff_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playoff_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playoff_matchups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES RLS
-- Private account rows (containing email, roles, etc.) are strictly shielded.
-- Anonymous visitors and PUBLIC are granted NO direct SELECT policies on profiles.
DROP POLICY IF EXISTS "Public can view writer profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view published author cards" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own full profile" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can edit own profile" ON public.profiles;
DROP POLICY IF EXISTS "Superadmin can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;

CREATE POLICY "Users can view own full profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_editor_or_superadmin());

CREATE POLICY "Users can edit own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Superadmin can manage profiles"
  ON public.profiles FOR ALL
  USING (public.is_superadmin());

CREATE POLICY "Service role can manage all profiles"
  ON public.profiles FOR ALL
  USING (auth.role() = 'service_role');

-- 2. PUBLIC READ POLICIES
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view tags" ON public.tags;
CREATE POLICY "Public can view tags" ON public.tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view conferences" ON public.conferences;
CREATE POLICY "Public can view conferences" ON public.conferences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view seasons" ON public.seasons;
CREATE POLICY "Public can view seasons" ON public.seasons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view teams" ON public.teams;
CREATE POLICY "Public can view teams" ON public.teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view team conference memberships" ON public.team_conference_membership;
CREATE POLICY "Public can view team conference memberships" ON public.team_conference_membership FOR SELECT USING (true);

-- CRITICAL FIX 2 & 4: Public can ONLY view verified standings!
DROP POLICY IF EXISTS "Public can view standings" ON public.standings;
DROP POLICY IF EXISTS "Staff can view all standings" ON public.standings;

CREATE POLICY "Public can view standings"
  ON public.standings FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Staff can view all standings"
  ON public.standings FOR SELECT
  USING (public.is_editor_or_superadmin());

-- Articles: Draft and review articles are strictly hidden from public visitors
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Staff can view all articles" ON public.articles;

CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  USING (status = 'published' AND published_at <= timezone('utc'::text, now()));

CREATE POLICY "Staff can view all articles"
  ON public.articles FOR SELECT
  USING (public.is_editor_or_superadmin() OR auth.uid() = author_id);

-- Article tags: Only accessible for published articles (status = 'published' AND published_at <= now()) or staff
DROP POLICY IF EXISTS "Public can view article tags for published articles" ON public.article_tags;
DROP POLICY IF EXISTS "Staff can view all article tags" ON public.article_tags;

CREATE POLICY "Public can view article tags for published articles"
  ON public.article_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.articles
    WHERE articles.id = article_tags.article_id
      AND articles.status = 'published'
      AND articles.published_at <= timezone('utc'::text, now())
  ));

CREATE POLICY "Staff can view all article tags"
  ON public.article_tags FOR SELECT
  USING (public.is_editor_or_superadmin());

-- Rankings: Draft editions are strictly hidden from public visitors
DROP POLICY IF EXISTS "Public can view published ranking editions" ON public.ranking_editions;
DROP POLICY IF EXISTS "Staff can view all ranking editions" ON public.ranking_editions;

CREATE POLICY "Public can view published ranking editions"
  ON public.ranking_editions FOR SELECT
  USING (status = 'published');

CREATE POLICY "Staff can view all ranking editions"
  ON public.ranking_editions FOR SELECT
  USING (public.is_editor_or_superadmin());

-- Ranking entries
DROP POLICY IF EXISTS "Public can view ranking entries of published editions" ON public.ranking_entries;
CREATE POLICY "Public can view ranking entries of published editions"
  ON public.ranking_entries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ranking_editions
    WHERE ranking_editions.id = ranking_entries.edition_id
      AND (ranking_editions.status = 'published' OR public.is_editor_or_superadmin())
  ));

-- Playoff editions: Draft projections are strictly hidden from public visitors
DROP POLICY IF EXISTS "Public can view published playoff editions" ON public.playoff_editions;
DROP POLICY IF EXISTS "Staff can view all playoff editions" ON public.playoff_editions;

CREATE POLICY "Public can view published playoff editions"
  ON public.playoff_editions FOR SELECT
  USING (status = 'published');

CREATE POLICY "Staff can view all playoff editions"
  ON public.playoff_editions FOR SELECT
  USING (public.is_editor_or_superadmin());

-- Playoff entries
DROP POLICY IF EXISTS "Public can view playoff entries of published editions" ON public.playoff_entries;
CREATE POLICY "Public can view playoff entries of published editions"
  ON public.playoff_entries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.playoff_editions
    WHERE playoff_editions.id = playoff_entries.edition_id
      AND (playoff_editions.status = 'published' OR public.is_editor_or_superadmin())
  ));

-- Playoff matchups
DROP POLICY IF EXISTS "Public can view playoff matchups of published editions" ON public.playoff_matchups;
CREATE POLICY "Public can view playoff matchups of published editions"
  ON public.playoff_matchups FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.playoff_editions
    WHERE playoff_editions.id = playoff_matchups.edition_id
      AND (playoff_editions.status = 'published' OR public.is_editor_or_superadmin())
  ));

-- 13. INDIVIDUAL VOTER BALLOTS POLICIES (Strict Principle of Least Privilege)
DROP POLICY IF EXISTS "Public can view certified voter ballots" ON public.voter_ballots;
DROP POLICY IF EXISTS "Certified voter ballots are viewable by everyone" ON public.voter_ballots;
DROP POLICY IF EXISTS "Voters can view and edit own ballot" ON public.voter_ballots;
DROP POLICY IF EXISTS "Voters can view own ballot" ON public.voter_ballots;
DROP POLICY IF EXISTS "Voters can insert own ballot" ON public.voter_ballots;
DROP POLICY IF EXISTS "Voters can update own ballot" ON public.voter_ballots;
DROP POLICY IF EXISTS "Voters can delete own uncertified ballot" ON public.voter_ballots;
DROP POLICY IF EXISTS "Staff can manage voter ballots" ON public.voter_ballots;
DROP POLICY IF EXISTS "Staff can view all voter ballots" ON public.voter_ballots;

-- CRITICAL PRIVACY & CERTIFICATION FIX:
-- Anon has ZERO SELECT access to voter_ballots.
-- 1. SELECT: Voters can view ONLY their own ballot
CREATE POLICY "Voters can view own ballot"
  ON public.voter_ballots FOR SELECT
  USING (auth.uid() = voter_id);

-- 2. INSERT: Voters can insert a ballot ONLY for themselves with is_certified = false
CREATE POLICY "Voters can insert own ballot"
  ON public.voter_ballots FOR INSERT
  WITH CHECK (
    auth.uid() = voter_id 
    AND (is_certified = false OR is_certified IS NULL)
  );

-- 3. UPDATE: Voters can update ONLY their own ballot if NOT yet certified
CREATE POLICY "Voters can update own ballot"
  ON public.voter_ballots FOR UPDATE
  USING (auth.uid() = voter_id AND is_certified = false)
  WITH CHECK (
    auth.uid() = voter_id 
    AND (is_certified = false OR is_certified IS NULL)
  );

-- 4. DELETE: Voters can delete ONLY their own uncertified ballot
CREATE POLICY "Voters can delete own uncertified ballot"
  ON public.voter_ballots FOR DELETE
  USING (auth.uid() = voter_id AND is_certified = false);

-- 5. Staff permissions: Editors and superadmins can view and manage all ballots
CREATE POLICY "Staff can view all voter ballots"
  ON public.voter_ballots FOR SELECT
  USING (public.is_editor_or_superadmin());

CREATE POLICY "Staff can manage voter ballots"
  ON public.voter_ballots FOR ALL
  USING (public.is_editor_or_superadmin());

-- Media assets & settings
-- CRITICAL LEAST PRIVILEGE FIX: media_assets and site_settings public read access is explicitly restricted
DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
DROP POLICY IF EXISTS "Staff can view media assets" ON public.media_assets;
-- Editorial media assets are referenced publicly via direct storage URL. The metadata table is restricted to staff.
CREATE POLICY "Staff can view media assets" ON public.media_assets FOR SELECT USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Public can view public site settings" ON public.site_settings;
-- Site settings: Only public configuration keys are viewable by anon/public; sensitive settings remain shielded
CREATE POLICY "Public can view public site settings" ON public.site_settings FOR SELECT USING (key LIKE 'public_%');

-- 3. STAFF / ADMIN MUTATION POLICIES (Idempotent)
DROP POLICY IF EXISTS "Staff can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Staff can update articles" ON public.articles;
DROP POLICY IF EXISTS "Staff can delete articles" ON public.articles;

CREATE POLICY "Staff can insert articles" 
  ON public.articles FOR INSERT 
  WITH CHECK (
    (public.is_editor_or_superadmin() OR public.get_current_user_role() = 'contributor') 
    AND auth.uid() = author_id
  );

CREATE POLICY "Staff can update articles" 
  ON public.articles FOR UPDATE 
  USING (public.is_editor_or_superadmin() OR auth.uid() = author_id);

CREATE POLICY "Staff can delete articles" 
  ON public.articles FOR DELETE 
  USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage categories" ON public.categories;
CREATE POLICY "Staff can manage categories" ON public.categories FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage tags" ON public.tags;
CREATE POLICY "Staff can manage tags" ON public.tags FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage article_tags" ON public.article_tags;
CREATE POLICY "Staff can manage article_tags" ON public.article_tags FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage conferences" ON public.conferences;
CREATE POLICY "Staff can manage conferences" ON public.conferences FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage seasons" ON public.seasons;
CREATE POLICY "Staff can manage seasons" ON public.seasons FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage teams" ON public.teams;
CREATE POLICY "Staff can manage teams" ON public.teams FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage memberships" ON public.team_conference_membership;
CREATE POLICY "Staff can manage memberships" ON public.team_conference_membership FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage standings" ON public.standings;
CREATE POLICY "Staff can manage standings" ON public.standings FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage ranking editions" ON public.ranking_editions;
CREATE POLICY "Staff can manage ranking editions" ON public.ranking_editions FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage ranking entries" ON public.ranking_entries;
CREATE POLICY "Staff can manage ranking entries" ON public.ranking_entries FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage playoff editions" ON public.playoff_editions;
CREATE POLICY "Staff can manage playoff editions" ON public.playoff_editions FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage playoff entries" ON public.playoff_entries;
CREATE POLICY "Staff can manage playoff entries" ON public.playoff_entries FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage playoff matchups" ON public.playoff_matchups;
CREATE POLICY "Staff can manage playoff matchups" ON public.playoff_matchups FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage media assets" ON public.media_assets;
CREATE POLICY "Staff can manage media assets" ON public.media_assets FOR ALL USING (public.is_editor_or_superadmin());

DROP POLICY IF EXISTS "Staff can manage site settings" ON public.site_settings;
CREATE POLICY "Staff can manage site settings" ON public.site_settings FOR ALL USING (public.is_editor_or_superadmin());

-- ==============================================================================
-- 4. STORAGE CONFIGURATION & SECURITY
-- Safe MIME types (Only secure raster formats: JPEG, PNG, WEBP — SVG excluded to eliminate stored XSS)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'editorial-media',
  'editorial-media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS Policies (Idempotent DROP IF EXISTS)
DROP POLICY IF EXISTS "Public Access for Editorial Media" ON storage.objects;
DROP POLICY IF EXISTS "Staff can upload editorial media" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update editorial media" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete editorial media" ON storage.objects;

-- Public can read assets from the editorial-media bucket
CREATE POLICY "Public Access for Editorial Media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'editorial-media');

-- Only authorized editors and superadmins can upload media assets
CREATE POLICY "Staff can upload editorial media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'editorial-media' 
    AND public.is_editor_or_superadmin()
  );

-- Only authorized staff can update assets
CREATE POLICY "Staff can update editorial media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'editorial-media' 
    AND public.is_editor_or_superadmin()
  );

-- Only authorized staff can delete assets
CREATE POLICY "Staff can delete editorial media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'editorial-media' 
    AND public.is_editor_or_superadmin()
  );
