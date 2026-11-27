-- ==============================================================================
-- THE FCS GUYS — AUTH-TO-PROFILE SYNC TRIGGER SETUP & MISSING PROFILE BACKFILL
-- Script: supabase/FINAL_PROFILE_SYNC_FIX.sql
-- Database: PostgreSQL 15+ (Supabase Managed Engine)
-- Target Backfill User: islamawan297@gmail.com (19afc629-7bc7-47e9-be1e-d5e1d1ab4b8f)
-- Role Assigned: 'contributor' (Standard Base Role - Superadmin promotion deferred)
-- Security: SECURITY DEFINER with fixed search_path = public, pg_temp
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. SECURE AUTH-TO-PROFILE SYNCHRONIZATION FUNCTION
-- ==============================================================================
-- Architectural Guarantees:
-- - Hardcodes role = 'contributor' unconditionally.
-- - NEVER reads role from raw_user_meta_data or raw_app_meta_data.
-- - Safely resolves full_name and avatar_url from metadata, fallback to email prefix.
-- - Uses ON CONFLICT (id) DO UPDATE strictly for identity fields (email, full_name,
--   avatar_url, updated_at). NEVER touches or overwrites role on conflict.
-- - Declared SECURITY DEFINER with search_path = public, pg_temp to prevent
--   search_path injection attacks while running with elevated system privileges.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_full_name TEXT;
  v_avatar_url TEXT;
BEGIN
  -- Extract full_name safely from user metadata or fallback to email prefix
  v_full_name := NULLIF(
    TRIM(
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1),
        'Contributor'
      )
    ),
    ''
  );

  -- Extract avatar_url safely from user metadata
  v_avatar_url := NULLIF(
    TRIM(
      COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
        ''
      )
    ),
    ''
  );

  -- Fallback if full_name resolved to null
  IF v_full_name IS NULL THEN
    v_full_name := 'Contributor';
  END IF;

  -- Insert profile with strictly hardcoded 'contributor' role.
  -- On conflict (re-registration or email confirmation triggers), never touch role or bio.
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    avatar_url,
    bio,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    'contributor', -- HARDCODED: NEVER read role from metadata
    v_avatar_url,
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE 
      WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = 'Contributor' 
      THEN EXCLUDED.full_name 
      ELSE public.profiles.full_name 
    END,
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = timezone('utc'::text, now());
    -- NOTE: 'role' is intentionally omitted from UPDATE to prevent role overwriting/downgrading.

  RETURN NEW;
END;
$$;

-- Revoke execution from PUBLIC, grant exclusively to system auth admin and service_role
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin, service_role;

-- ==============================================================================
-- 2. ATTACH TRIGGER TO auth.users (IDEMPOTENT)
-- ==============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure auth system and service roles have required table access for profile inserts
GRANT INSERT, SELECT, UPDATE ON TABLE public.profiles TO supabase_auth_admin;
GRANT ALL ON TABLE public.profiles TO service_role;

-- ==============================================================================
-- 3. DETERMINISTIC PROFILE BACKFILL FOR EXISTING USER
-- ==============================================================================
-- User ID: 19afc629-7bc7-47e9-be1e-d5e1d1ab4b8f
-- Email: islamawan297@gmail.com
-- Assigns base role 'contributor' (superadmin promotion will follow in a separate step).
-- ==============================================================================

DO $$
DECLARE
  c_target_id CONSTANT UUID := '19afc629-7bc7-47e9-be1e-d5e1d1ab4b8f'::uuid;
  c_target_email CONSTANT TEXT := 'islamawan297@gmail.com';
  
  v_auth_user_id UUID;
  v_auth_email TEXT;
  v_raw_meta JSONB;
  v_full_name TEXT;
  v_avatar_url TEXT;
  v_row_count INT;
BEGIN
  RAISE NOTICE '=== Starting Backfill for User ID % (%) ===', c_target_id, c_target_email;

  -- 1. Verify existence of the auth.users record
  SELECT id, email, raw_user_meta_data
  INTO v_auth_user_id, v_auth_email, v_raw_meta
  FROM auth.users
  WHERE id = c_target_id;

  IF v_auth_user_id IS NULL THEN
    -- Fallback lookup by email in case UUID changed during recreation
    SELECT id, email, raw_user_meta_data
    INTO v_auth_user_id, v_auth_email, v_raw_meta
    FROM auth.users
    WHERE LOWER(email) = LOWER(c_target_email);

    IF v_auth_user_id IS NULL THEN
      RAISE EXCEPTION 'Backfill Aborted: No account found in auth.users matching ID % or email %.', c_target_id, c_target_email;
    END IF;
  END IF;

  RAISE NOTICE 'Found matching auth.users entry: ID %, Email %', v_auth_user_id, v_auth_email;

  -- 2. Safely resolve name and avatar metadata
  v_full_name := NULLIF(
    TRIM(
      COALESCE(
        v_raw_meta->>'full_name',
        v_raw_meta->>'name',
        split_part(v_auth_email, '@', 1),
        'Contributor'
      )
    ),
    ''
  );
  IF v_full_name IS NULL THEN
    v_full_name := 'Contributor';
  END IF;

  v_avatar_url := NULLIF(
    TRIM(
      COALESCE(
        v_raw_meta->>'avatar_url',
        v_raw_meta->>'picture',
        ''
      )
    ),
    ''
  );

  -- 3. Insert or safely reconcile public.profiles record
  -- Role is hardcoded to 'contributor'.
  -- If profile already exists, role is preserved.
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    avatar_url,
    bio,
    created_at,
    updated_at
  )
  VALUES (
    v_auth_user_id,
    LOWER(v_auth_email),
    v_full_name,
    'contributor',
    v_avatar_url,
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE 
      WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = 'Contributor' 
      THEN EXCLUDED.full_name 
      ELSE public.profiles.full_name 
    END,
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = timezone('utc'::text, now());
    -- 'role' is intentionally omitted to avoid modifying any existing role

  GET DIAGNOSTICS v_row_count = ROW_COUNT;
  RAISE NOTICE 'Successfully reconciled public.profiles record for user % (Rows affected: %)', v_auth_user_id, v_row_count;
END $$;

COMMIT;

-- ==============================================================================
-- 4. READ-ONLY VERIFICATION QUERIES
-- ==============================================================================

-- Verification 1: Verify the backfilled profile record matches auth.users
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.avatar_url,
  p.created_at,
  p.updated_at,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.id = '19afc629-7bc7-47e9-be1e-d5e1d1ab4b8f'::uuid;

-- Verification 2: Verify trigger existence, attachment to auth.users, and enabled status
SELECT 
  t.tgname AS trigger_name,
  c.relname AS table_name,
  n.nspname AS schema_name,
  p.proname AS function_name,
  CASE t.tgenabled 
    WHEN 'O' THEN 'Enabled' 
    WHEN 'D' THEN 'Disabled' 
    WHEN 'A' THEN 'Always Enabled' 
    WHEN 'R' THEN 'Replica Only' 
    ELSE 'Unknown' 
  END AS status
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE t.tgname = 'on_auth_user_created'
  AND c.relname = 'users'
  AND n.nspname = 'auth';

-- Verification 3: Verify handle_new_user() security attributes
SELECT 
  p.proname AS function_name,
  pg_get_userbyid(p.proowner) AS owner,
  p.prosecdef AS is_security_definer,
  p.proconfig AS search_path_config
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' 
  AND p.proname = 'handle_new_user';
