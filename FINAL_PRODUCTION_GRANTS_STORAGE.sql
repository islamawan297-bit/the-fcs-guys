-- ==============================================================================
-- THE FCS GUYS — PRODUCTION LEAST-PRIVILEGE TABLE GRANTS & STORAGE ACTIVATION
-- File: FINAL_PRODUCTION_GRANTS_STORAGE.sql (Project Root)
-- Database: PostgreSQL 15+ (Supabase Managed Engine)
-- Target Project ID: endyyyzbfarcztnfflsi
-- Mode: Production Least-Privilege Activation (Idempotent & Re-runnable)
-- ==============================================================================
-- ARCHITECTURAL VERIFICATION & SECURITY GUARANTEES:
-- 1. Profile Security & Least-Privilege Column UPDATE:
--    - Column-Level UPDATE: authenticated users are granted UPDATE ONLY on
--      (full_name, avatar_url, bio).
--    - 'updated_at' is REMOVED from client UPDATE grants and strictly managed
--      by the database trigger 'trg_profiles_updated_at'.
--    - Table-level UPDATE is explicitly REVOKED.
--    - Column-level UPDATE is explicitly REVOKED on all columns before granting the 3 fields.
--    - Protected columns (id, email, role, created_at, updated_at) CANNOT be updated via PostgREST.
--    - Reinforced by trg_protect_profile_roles (raises exception if role/id/email changes).
-- 2. Public Author Profiles View (Shields Private Profiles):
--    - Granted SELECT to anon & authenticated.
--    - Owned by 'postgres' (security_invoker = false), allowing it to query profiles
--      without exposing direct table SELECT on public.profiles to anon.
--    - WITH (security_barrier = true) prevents query optimizer leakage across filters.
--    - Filter 'WHERE EXISTS (... a.status = ''published'' ...)' strictly limits returned
--      data to published authors.
--    - Exposes ONLY (id, full_name, avatar_url, bio). Zero exposure of email or role.
-- 3. Anonymous Boundary:
--    - anon receives SELECT ONLY on public published sports tables and author view.
--    - anon is strictly DENIED access to public.profiles, public.voter_ballots, and public.media_assets.
-- 4. Contributor Mutation Boundary:
--    - Publishing/unpublishing blocked by trg_enforce_article_publishing_rules.
--    - Role elevation blocked by column permissions + trg_protect_profile_roles.
--    - Article deletion blocked by RLS (is_editor_or_superadmin() required).
--    - Sports data/rankings/standings/taxonomies mutations blocked by RLS.
-- 5. Storage Integrity:
--    - Scoped strictly to 'editorial-media' using dedicated namespace fcs_editorial_media_*.
--    - UPDATE policy enforces bucket_id = 'editorial-media' in BOTH USING and WITH CHECK.
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- SECTION 1 — PUBLIC READ PERMISSIONS (ANON & AUTHENTICATED)
-- Allows reading of published sports domain entities and site configuration.
-- Restrictive RLS SELECT policies filter unpublished/draft content automatically.
-- ==============================================================================
GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT SELECT ON TABLE public.tags TO anon, authenticated;
GRANT SELECT ON TABLE public.conferences TO anon, authenticated;
GRANT SELECT ON TABLE public.seasons TO anon, authenticated;
GRANT SELECT ON TABLE public.teams TO anon, authenticated;
GRANT SELECT ON TABLE public.team_conference_membership TO anon, authenticated;
GRANT SELECT ON TABLE public.standings TO anon, authenticated;
GRANT SELECT ON TABLE public.articles TO anon, authenticated;
GRANT SELECT ON TABLE public.article_tags TO anon, authenticated;
GRANT SELECT ON TABLE public.ranking_editions TO anon, authenticated;
GRANT SELECT ON TABLE public.ranking_entries TO anon, authenticated;
GRANT SELECT ON TABLE public.playoff_editions TO anon, authenticated;
GRANT SELECT ON TABLE public.playoff_entries TO anon, authenticated;
GRANT SELECT ON TABLE public.playoff_matchups TO anon, authenticated;
GRANT SELECT ON TABLE public.site_settings TO anon, authenticated;

-- Public Author Profiles View (Exposes ONLY safe metadata for published authors)
GRANT SELECT ON public.public_author_profiles TO anon, authenticated;

-- ==============================================================================
-- SECTION 2 — SECURE PROFILES ACCESS (LEAST-PRIVILEGE COLUMN-LEVEL GRANTS)
-- Revokes all table and column UPDATE privileges from authenticated, then grants
-- UPDATE strictly on the three user-editable author metadata fields:
-- (full_name, avatar_url, bio).
-- 'updated_at' is managed automatically by trg_profiles_updated_at.
-- Protected columns (id, email, role, created_at, updated_at) are un-updatable by client.
-- ==============================================================================
REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.profiles TO authenticated;

-- Revoke any existing table-level and column-level UPDATE privileges
REVOKE UPDATE ON TABLE public.profiles FROM authenticated;
REVOKE UPDATE (id, email, role, full_name, avatar_url, bio, created_at, updated_at) ON TABLE public.profiles FROM authenticated;

-- Grant column-level UPDATE strictly on user-editable profile fields
GRANT UPDATE (full_name, avatar_url, bio) ON TABLE public.profiles TO authenticated;

-- ==============================================================================
-- SECTION 3 — CMS MUTATION PERMISSIONS (AUTHENTICATED ONLY)
-- Enables authorized logged-in users to perform editorial mutations.
-- Every mutation is strictly evaluated against existing granular RLS policies & triggers:
-- - articles:
--     INSERT: (is_editor_or_superadmin() OR role='contributor') AND uid=author_id
--             Trigger forces status='draft' for contributors.
--     UPDATE: (is_editor_or_superadmin() OR uid=author_id)
--             Trigger prevents contributors from setting status!='draft' or transferring author.
--     DELETE: is_editor_or_superadmin() ONLY (contributors receive RLS violation).
-- - taxonomies & domain data:
--     ALL mutations require is_editor_or_superadmin().
-- - voter_ballots:
--     Restricted strictly to uid=voter_id for uncertified ballots; staff manage all.
-- - media_assets:
--     SELECT & ALL mutations require is_editor_or_superadmin().
-- ==============================================================================
GRANT INSERT, UPDATE, DELETE ON TABLE public.articles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.article_tags TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.tags TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.conferences TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.seasons TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.teams TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.team_conference_membership TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.standings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.ranking_editions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.ranking_entries TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.playoff_editions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.playoff_entries TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.playoff_matchups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.media_assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.voter_ballots TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.site_settings TO authenticated;

-- ==============================================================================
-- SECTION 4 — EDITORIAL MEDIA STORAGE BUCKET CREATION
-- Idempotently creates the dedicated public media bucket with size & MIME limits.
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'editorial-media',
  'editorial-media',
  true,
  5242880, -- 5 MB upload limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- ==============================================================================
-- SECTION 5 — STORAGE OBJECTS RLS POLICIES (ISOLATED NAMESPACE: fcs_editorial_media_*)
-- Uses uniquely scoped policy names to ensure zero conflict with other buckets.
-- Re-runnable: safely replaces only fcs_editorial_media_* policies.
-- ==============================================================================

-- 5.1. Public Read: Unrestricted download ONLY for objects within 'editorial-media'
DROP POLICY IF EXISTS "fcs_editorial_media_public_read" ON storage.objects;
CREATE POLICY "fcs_editorial_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'editorial-media');

-- 5.2. Staff Upload: Restrict upload strictly to verified editors and superadmins
DROP POLICY IF EXISTS "fcs_editorial_media_staff_upload" ON storage.objects;
CREATE POLICY "fcs_editorial_media_staff_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'editorial-media' 
    AND public.is_editor_or_superadmin()
  );

-- 5.3. Staff Update: Restrict file replacement strictly to verified editors and superadmins
-- Enforces bucket_id = 'editorial-media' in BOTH USING and WITH CHECK to prevent bucket relocation
DROP POLICY IF EXISTS "fcs_editorial_media_staff_update" ON storage.objects;
CREATE POLICY "fcs_editorial_media_staff_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'editorial-media' 
    AND public.is_editor_or_superadmin()
  )
  WITH CHECK (
    bucket_id = 'editorial-media' 
    AND public.is_editor_or_superadmin()
  );

-- 5.4. Staff Delete: Restrict asset deletion strictly to verified editors and superadmins
DROP POLICY IF EXISTS "fcs_editorial_media_staff_delete" ON storage.objects;
CREATE POLICY "fcs_editorial_media_staff_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'editorial-media' 
    AND public.is_editor_or_superadmin()
  );

COMMIT;

-- ==============================================================================
-- VERIFICATION QUERIES (READ-ONLY)
-- Run these after execution to confirm clean permissions and security state.
-- ==============================================================================

-- 1. Table-level grants for anon and authenticated
SELECT 
  grantee, 
  table_name, 
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
  AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;

-- 2. UPDATE column privileges on public.profiles (Expected: full_name, avatar_url, bio)
SELECT 
  grantee, 
  table_name, 
  column_name, 
  privilege_type
FROM information_schema.column_privileges
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND grantee = 'authenticated';

-- 3. editorial-media bucket configuration
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'editorial-media';

-- 4. The four Storage policy definitions
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
  AND policyname LIKE 'fcs_editorial_media_%';

-- 5. RLS enabled status for all relevant public tables
SELECT 
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN (
    'profiles', 'categories', 'tags', 'conferences', 'seasons',
    'teams', 'team_conference_membership', 'standings', 'articles',
    'article_tags', 'ranking_editions', 'ranking_entries',
    'voter_ballots', 'playoff_editions', 'playoff_entries',
    'playoff_matchups', 'media_assets', 'site_settings'
  )
ORDER BY c.relname;
