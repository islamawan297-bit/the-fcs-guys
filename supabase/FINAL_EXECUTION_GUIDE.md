# THE FCS GUYS — SUPABASE PRODUCTION EXECUTION GUIDE

This document provides exact, step-by-step instructions for running the database migrations and verifying your production environment in Supabase.

---

## 1. Execution Order & Deliverables Summary

The repository provides three self-contained, production-hardened SQL files:

| File | Purpose | Execution Timing |
| :--- | :--- | :--- |
| **`supabase/FINAL_SCHEMA.sql`** | Core DDL: 18 tables, indexes, triggers, functions, views, RLS policies, storage bucket & storage policies. | **RUN FIRST** (Mandatory) |
| **`supabase/FINAL_SEED_DATA.sql`** | Baseline & Reference Data: Conferences, teams, memberships, categories, tags, demo season, unverified standings, and draft ranking edition. Logged in `_seed_provenance`. | **RUN SECOND** (Optional / Reference) |
| **`supabase/FINAL_ROLLBACK.sql`** | Dynamic Dependency-Checking Rollback: Audits foreign keys catalog and cleanly removes seed data without touching user data. | **ONLY IF NEEDED** (Emergency Rollback) |

---

## 2. Step-by-Step Execution in Supabase SQL Editor

### Step 1: Run `FINAL_SCHEMA.sql`
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project: **The FCS Guys**.
3. In the left navigation, click on **SQL Editor**.
4. Click **New Query**.
5. Copy the entire contents of [`supabase/FINAL_SCHEMA.sql`](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/supabase/FINAL_SCHEMA.sql) and paste them into the query editor.
6. Click **Run** (or press `Cmd/Ctrl + Enter`).
7. **Expected Result:**
   - Status: `Success. No rows returned` (or duration summary).
   - In the Messages pane, you should see:
     ```text
     NOTICE: The FCS Guys — Schema and Security Initialization Complete.
     ```

### Step 2: Post-Schema Verification Queries
In the same SQL Editor, open a new query and run these quick checks:

```sql
-- 1. Verify 18 tables exist with RLS enabled
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relnamespace = 'public'::regnamespace AND relkind = 'r'
ORDER BY relname;

-- 2. Verify all 10 triggers are active and enabled
SELECT c.relname AS table_name, t.tgname AS trigger_name, t.tgenabled = 'O' AS is_enabled
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
WHERE c.relnamespace = 'public'::regnamespace AND NOT t.tgisinternal
ORDER BY c.relname, t.tgname;
```

---

### Step 3: Run `FINAL_SEED_DATA.sql` (Optional Baseline Data)
If you wish to populate the database with initial FCS conferences, teams, taxonomies, and draft baseline structures:
1. In the Supabase **SQL Editor**, click **New Query**.
2. Copy the entire contents of [`supabase/FINAL_SEED_DATA.sql`](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/supabase/FINAL_SEED_DATA.sql) and paste them into the editor.
3. Click **Run**.
4. **Expected Result:**
   - Status: `Success. No rows returned`.
   - In the Messages pane:
     ```text
     NOTICE: The FCS Guys — Seed Demo Data Complete with Isolated Provenance.
     ```

---

### Step 4: Bootstrap the First Superadmin Account
Because the database is protected by `trg_protect_profile_roles` (which prevents unauthenticated role elevation):

1. **Sign Up:** Register your primary account through the application UI (`/admin/login`) or through **Authentication > Users** in Supabase Studio.
2. **Elevate to Superadmin:** In the Supabase SQL Editor, run this transaction-safe block, replacing `YOUR_ADMIN_EMAIL_HERE` with your registered email:

```sql
DO $$
DECLARE
  v_target_email CONSTANT text := 'YOUR_ADMIN_EMAIL_HERE';
  v_user_id      uuid;
  v_old_role     text;
  v_new_role     text;
  v_update_count int := 0;
BEGIN
  -- Simulate service_role context locally for this transaction
  PERFORM set_config('request.jwt.claim.role', 'service_role', true);

  -- Validate auth.users strictly (aborts on 0 or >1 matches)
  BEGIN
    SELECT id INTO STRICT v_user_id
    FROM auth.users
    WHERE email = v_target_email;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE EXCEPTION 'Bootstrap Aborted: User with email "%" not found in auth.users. Please sign up first.', v_target_email;
    WHEN TOO_MANY_ROWS THEN
      RAISE EXCEPTION 'Bootstrap Aborted: Multiple auth.users records found for email "%".', v_target_email;
  END;

  -- Validate public.profiles strictly
  BEGIN
    SELECT role INTO STRICT v_old_role
    FROM public.profiles
    WHERE id = v_user_id AND email = v_target_email;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE EXCEPTION 'Bootstrap Aborted: Profile row not found in public.profiles.';
    WHEN TOO_MANY_ROWS THEN
      RAISE EXCEPTION 'Bootstrap Aborted: Multiple profiles found for user ID % and email "%".', v_user_id, v_target_email;
  END;

  -- Atomic update with CTE RETURNING
  WITH updated_rows AS (
    UPDATE public.profiles
    SET role = 'superadmin',
        updated_at = timezone('utc'::text, now())
    WHERE id = v_user_id AND email = v_target_email
    RETURNING role
  )
  SELECT count(*), min(role) INTO v_update_count, v_new_role FROM updated_rows;

  IF v_update_count != 1 OR v_new_role != 'superadmin' THEN
    RAISE EXCEPTION 'Bootstrap Aborted: Verification failed. Transaction rolled back.';
  END IF;

  RAISE NOTICE 'SUCCESS: User "%" elevated from "%" to superadmin.', v_target_email, v_old_role;
END $$;
```

---

## 3. How to Safely Roll Back Seed Data (`FINAL_ROLLBACK.sql`)

If you ever need to purge the demo/seed data without affecting any production or user-created content:
1. Open the Supabase **SQL Editor**.
2. Copy and paste [`supabase/FINAL_ROLLBACK.sql`](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/supabase/FINAL_ROLLBACK.sql).
3. Click **Run**.
4. **Behavior:**
   - The script inspects PostgreSQL foreign key catalogs (`pg_constraint` join `pg_attribute`).
   - If any non-seed user record (e.g. real articles, custom standings, voter ballots) references seed parents, the script **halts with an exception and aborts without deleting any row**.
   - If no dependencies exist, it safely removes seed records in reverse dependency order.

---

## 4. What to Do If Any SQL Statement Fails

1. **Transaction Isolation:** All migrations are designed to run within transactional or DO-block scopes. If an error occurs, the changes in that block are rolled back.
2. **Read the Error Code:**
   - `42710` (Duplicate Object/Policy): All policies in `FINAL_SCHEMA.sql` feature preceding `DROP POLICY IF EXISTS`. Ensure you are running the exact file provided.
   - `42P01` (Undefined Table): Ensure `FINAL_SCHEMA.sql` was executed completely before running seed or verification scripts.
   - `P0001` (Raise Exception): Read the exception message in the editor. It will describe the exact missing parent key or constraint conflict.

---

## 5. Vercel & Application Deployment Considerations

- **Redeployment:** Once your Supabase database schema is applied and environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are populated in Vercel, trigger a fresh deployment or redeploy the latest commit in Vercel to invalidate cached Next.js ISR/SSG routes.
- **Cache Revalidation:** All dynamic routes and public tables (`/conferences`, `/news`, `/playoff-projections`, `/top-25`) will immediately read the live schema.
