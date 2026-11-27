-- ==============================================================================
-- THE FCS GUYS — FINAL SUPERADMIN PROMOTION SCRIPT
-- Script: supabase/FINAL_SUPERADMIN_PROMOTION.sql
-- Target Superadmin: islamawan297@gmail.com (19afc629-7bc7-47e9-be1e-d5e1d1ab4b8f)
-- Database: PostgreSQL 15+ (Supabase Managed Engine)
-- ==============================================================================
-- Context:
-- Profile for this user now exists (created via FINAL_PROFILE_SYNC_FIX.sql).
-- The profiles table has `trg_protect_profile_roles` (BEFORE UPDATE) which prevents
-- unauthorized role changes. In Supabase SQL Editor (running as postgres), we
-- safely disable `trg_protect_profile_roles` inside an atomic transaction, promote
-- the profile to 'superadmin', re-enable the trigger, and verify the result.
-- ==============================================================================

BEGIN;

DO $$
DECLARE
  c_target_id CONSTANT UUID := '19afc629-7bc7-47e9-be1e-d5e1d1ab4b8f'::uuid;
  c_target_email CONSTANT TEXT := 'islamawan297@gmail.com';
  
  v_current_role TEXT;
  v_row_count INT;
BEGIN
  RAISE NOTICE '=== Starting Superadmin Promotion for: % (ID: %) ===', c_target_email, c_target_id;

  -- 1. Verify matching profile row exists
  SELECT role INTO v_current_role
  FROM public.profiles
  WHERE id = c_target_id;

  IF v_current_role IS NULL THEN
    RAISE EXCEPTION 'Promotion Aborted: No profile row found in public.profiles for ID %. Please run FINAL_PROFILE_SYNC_FIX.sql first.', c_target_id;
  END IF;

  RAISE NOTICE 'Current profile found with role: "%"', v_current_role;

  -- 2. Temporarily disable trg_protect_profile_roles for atomic bootstrap
  ALTER TABLE public.profiles DISABLE TRIGGER trg_protect_profile_roles;

  -- 3. Promote profile to superadmin
  UPDATE public.profiles
  SET 
    role = 'superadmin',
    updated_at = timezone('utc'::text, now())
  WHERE id = c_target_id;

  GET DIAGNOSTICS v_row_count = ROW_COUNT;
  IF v_row_count <> 1 THEN
    -- Re-enable trigger before aborting
    ALTER TABLE public.profiles ENABLE TRIGGER trg_protect_profile_roles;
    RAISE EXCEPTION 'Promotion Failed: Expected to update exactly 1 row, affected % rows.', v_row_count;
  END IF;

  -- 4. Immediately re-enable trg_protect_profile_roles
  ALTER TABLE public.profiles ENABLE TRIGGER trg_protect_profile_roles;

  -- 5. Final assertion check
  SELECT role INTO v_current_role
  FROM public.profiles
  WHERE id = c_target_id;

  IF v_current_role <> 'superadmin' THEN
    RAISE EXCEPTION 'Verification Failed: Profile role is "%" instead of "superadmin".', v_current_role;
  END IF;

  RAISE NOTICE 'SUCCESS: Profile for % (ID: %) successfully promoted to "superadmin".', c_target_email, c_target_id;
END $$;

COMMIT;

-- ==============================================================================
-- VERIFICATION QUERIES
-- ==============================================================================

-- 1. Verify User Profile & Role in public.profiles
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.avatar_url,
  p.created_at,
  p.updated_at
FROM public.profiles p
WHERE p.id = '19afc629-7bc7-47e9-be1e-d5e1d1ab4b8f'::uuid;

-- 2. Verify Security Trigger is Enabled
SELECT 
  t.tgname AS trigger_name,
  c.relname AS table_name,
  CASE t.tgenabled 
    WHEN 'O' THEN 'Enabled' 
    WHEN 'D' THEN 'Disabled' 
    ELSE 'Unknown' 
  END AS status
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
WHERE t.tgname = 'trg_protect_profile_roles';
