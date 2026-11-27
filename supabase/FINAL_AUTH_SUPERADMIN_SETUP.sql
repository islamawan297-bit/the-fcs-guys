-- ==============================================================================
-- THE FCS GUYS — PRODUCTION AUTH-TO-PROFILE SYNC & SUPERADMIN BOOTSTRAP SCRIPT
-- Script: supabase/FINAL_AUTH_SUPERADMIN_SETUP.sql
-- Target Superadmin Email: islamawan297@gmail.com
-- Database: PostgreSQL 15+ (Supabase Managed Engine)
-- Security: SECURITY DEFINER with fixed search_path = public, pg_temp
-- ==============================================================================
-- INSTRUCTIONS FOR SUPABASE SQL EDITOR:
-- 1. Ensure 'islamawan297@gmail.com' is registered in Supabase Auth (Dashboard -> Authentication -> Users).
-- 2. Execute the entire script in Supabase Dashboard -> SQL Editor -> New Query.
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- PART 2: SECURE AUTH-TO-PROFILE SYNCHRONIZATION
-- ==============================================================================
-- Architectural Guarantees:
-- 1. Fires AFTER INSERT ON auth.users.
-- 2. Hardcodes role = 'contributor' unconditionally for all new signups.
-- 3. NEVER reads role from raw_user_meta_data or raw_app_meta_data.
-- 4. Extracts full_name and avatar_url safely from metadata with null coalescing.
-- 5. Uses ON CONFLICT (id) DO UPDATE strictly for non-privileged fields (email,
--    full_name, avatar_url, updated_at). NEVER updates role on conflict.
-- 6. SECURITY DEFINER with safe search_path = public, pg_temp ensures trigger
--    can insert into public.profiles without exposing broader table privileges.
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
  -- Extract full_name safely from user metadata or fallback to email prefix or 'Contributor'
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
    -- NOTE: 'role' is intentionally omitted from the UPDATE statement to prevent role downgrades/overwrites.

  RETURN NEW;
END;
$$;

-- Secure function permissions: revoke execution from public, grant to supabase_auth_admin
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin, service_role;

-- Attach trigger to auth.users safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure service_role and supabase_auth_admin have INSERT and UPDATE rights on public.profiles
GRANT INSERT, SELECT, UPDATE ON TABLE public.profiles TO supabase_auth_admin;
GRANT ALL ON TABLE public.profiles TO service_role;

-- ==============================================================================
-- PART 3: SUPERADMIN BOOTSTRAP
-- ==============================================================================
-- Context & Trigger Compatibility:
-- The profiles table has `trg_protect_profile_roles` (BEFORE UPDATE) which checks:
--   IF NEW.role IS DISTINCT FROM OLD.role THEN
--     IF NOT public.is_superadmin() THEN RAISE EXCEPTION 'Security Violation...';
-- During initial system setup, executing from the Supabase SQL Editor runs as
-- role `postgres` without an active Supabase Auth JWT (auth.role() and auth.uid()
-- evaluate to NULL).
-- Therefore, to promote the designated superadmin without weakening RLS or modifying
-- the trigger code, we temporarily disable `trg_protect_profile_roles`, perform the
-- atomic promotion and verification, and immediately re-enable `trg_protect_profile_roles`
-- in the SAME atomic transaction block.
-- ==============================================================================

DO $$
DECLARE
  -- Target superadmin account
  v_target_email CONSTANT text := 'islamawan297@gmail.com';

  v_user_id UUID;
  v_user_raw_meta JSONB;
  v_resolved_name TEXT;
  v_resolved_avatar TEXT;
  v_current_role TEXT;
  v_row_count INT;
BEGIN
  RAISE NOTICE '=== Starting Superadmin Promotion for: % ===', v_target_email;

  -- 1. Verify auth.users entry exists for the target email
  SELECT id, raw_user_meta_data
  INTO v_user_id, v_user_raw_meta
  FROM auth.users
  WHERE LOWER(email) = LOWER(v_target_email);

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Target User Not Found: No account exists in auth.users with email "%". Please create/confirm your account first in Supabase Dashboard (Authentication -> Users -> Add User) or sign up via your application, then re-run this script.', v_target_email;
  END IF;

  RAISE NOTICE 'Resolved auth.users record: User ID %', v_user_id;

  -- 2. Resolve metadata for full_name and avatar_url fallback
  v_resolved_name := NULLIF(
    TRIM(
      COALESCE(
        v_user_raw_meta->>'full_name',
        v_user_raw_meta->>'name',
        split_part(v_target_email, '@', 1),
        'Super Administrator'
      )
    ),
    ''
  );
  IF v_resolved_name IS NULL THEN
    v_resolved_name := 'Super Administrator';
  END IF;

  v_resolved_avatar := NULLIF(
    TRIM(
      COALESCE(
        v_user_raw_meta->>'avatar_url',
        v_user_raw_meta->>'picture',
        ''
      )
    ),
    ''
  );

  -- 3. Temporarily disable trg_protect_profile_roles to allow bootstrap promotion
  --    This runs strictly inside this atomic transaction block.
  ALTER TABLE public.profiles DISABLE TRIGGER trg_protect_profile_roles;

  -- 4. Insert profile if missing, or update existing profile to superadmin
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
    v_user_id,
    LOWER(v_target_email),
    v_resolved_name,
    'superadmin',
    v_resolved_avatar,
    'Primary System Superadministrator',
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'superadmin',
    updated_at = timezone('utc'::text, now())
  WHERE public.profiles.id = v_user_id;

  GET DIAGNOSTICS v_row_count = ROW_COUNT;
  IF v_row_count <> 1 THEN
    -- Re-enable trigger before aborting
    ALTER TABLE public.profiles ENABLE TRIGGER trg_protect_profile_roles;
    RAISE EXCEPTION 'Promotion Failed: Expected to upsert exactly 1 profile row for user ID %, affected % rows.', v_user_id, v_row_count;
  END IF;

  -- 5. Immediately re-enable trg_protect_profile_roles
  ALTER TABLE public.profiles ENABLE TRIGGER trg_protect_profile_roles;

  -- 6. Verify the resulting profile state
  SELECT role INTO v_current_role
  FROM public.profiles
  WHERE id = v_user_id;

  IF v_current_role <> 'superadmin' THEN
    RAISE EXCEPTION 'Verification Failed: Profile for % exists but role is "%" instead of "superadmin".', v_target_email, v_current_role;
  END IF;

  RAISE NOTICE 'SUCCESS: User % (ID: %) successfully promoted to "superadmin". All security triggers active.', v_target_email, v_user_id;
END $$;

COMMIT;

-- ==============================================================================
-- PART 4: READ-ONLY SYSTEM & SECURITY VERIFICATION
-- ==============================================================================
-- Execute these read queries to inspect your auth trigger, role protection trigger,
-- RLS policies, function configurations, and current user profile status.
-- ==============================================================================

-- 1. Check Profiles Table and Promoted Role Status for islamawan297@gmail.com
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.avatar_url,
  p.created_at,
  p.updated_at,
  u.last_sign_in_at,
  u.email_confirmed_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE LOWER(p.email) = 'islamawan297@gmail.com'
ORDER BY p.created_at ASC;

-- 2. Verify Auth and Profile Triggers are Present and Enabled
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
WHERE t.tgname IN ('on_auth_user_created', 'trg_protect_profile_roles')
ORDER BY c.relname, t.tgname;

-- 3. Verify RLS is Enabled and All Profiles Security Policies Exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- 4. Verify SECURITY DEFINER Functions and search_path Settings
SELECT 
  p.proname AS function_name,
  pg_get_userbyid(p.proowner) AS owner,
  p.prosecdef AS is_security_definer,
  p.proconfig AS configuration_parameters
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' 
  AND p.proname IN (
    'handle_new_user',
    'protect_profile_roles',
    'get_current_user_role',
    'is_superadmin',
    'is_editor_or_superadmin',
    'is_service_role'
  )
ORDER BY p.proname;

-- 5. Audit Check: Confirm No Non-Superadmin Can Assign Themselves Roles
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_class cl ON cl.oid = c.conrelid
JOIN pg_namespace n ON n.oid = cl.relnamespace
WHERE n.nspname = 'public' AND cl.relname = 'profiles' AND c.contype = 'c';
