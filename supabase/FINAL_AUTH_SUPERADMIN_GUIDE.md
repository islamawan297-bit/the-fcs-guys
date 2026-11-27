# THE FCS GUYS — Supabase Auth & Superadmin Execution Guide

This guide provides step-by-step instructions for running [FINAL_AUTH_SUPERADMIN_SETUP.sql](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/supabase/FINAL_AUTH_SUPERADMIN_SETUP.sql) in your production Supabase database.

---

## 1. Prerequisites (Must You Sign Up First?)

**YES, you MUST create your Supabase Auth account before running the promotion block.**

The script does not forge or directly insert into `auth.users` with arbitrary passwords because password hashing and Supabase GoTrue authentication lifecycle hooks are managed internally by Supabase Auth.

### How to Sign Up First:
You have two easy ways to register your account:
1. **Via Supabase Dashboard**:
   - Go to **Authentication** &rarr; **Users** &rarr; **Add User** &rarr; **Create User**.
   - Enter your email and a strong password. Toggle **"Auto Confirm User"** to ON.
2. **Via Application Sign-Up / Login**:
   - Register through your app's authentication flow or GoTrue client.

---

## 2. Configuration & Email Placeholder

Open [FINAL_AUTH_SUPERADMIN_SETUP.sql](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/supabase/FINAL_AUTH_SUPERADMIN_SETUP.sql) and locate **PART 3**:

```sql
c_target_email CONSTANT TEXT := 'islamawan297@gmail.com';
```

Replace `[YOUR_REGISTERED_EMAIL@example.com]` with the exact registered email address, for example:
```sql
c_target_email CONSTANT TEXT := 'admin@thefcsguys.com';
```

> [!IMPORTANT]
> Keep the single quotes `'...'` intact. The script will automatically trim whitespace and normalize the email to lowercase.

---

## 3. Order of Execution in Supabase SQL Editor

1. Open your **Supabase Dashboard**.
2. Select your project **The FCS Guys**.
3. In the left navigation, click **SQL Editor**.
4. Click **New Query**.
5. Paste the entire contents of [FINAL_AUTH_SUPERADMIN_SETUP.sql](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/supabase/FINAL_AUTH_SUPERADMIN_SETUP.sql).
6. Click **Run** (or press `Ctrl + Enter` / `Cmd + Enter`).

The script is structured into an atomic transaction (`BEGIN; ... COMMIT;`) followed by non-destructive read-only verification queries:
1. **PART 2**: Creates `public.handle_new_user()` and the `on_auth_user_created` trigger on `auth.users` with strict role isolation (`contributor` only).
2. **PART 3**: Promotes your registered user to `superadmin` safely inside the transaction, handling `trg_protect_profile_roles` atomically.
3. **PART 4**: Runs 5 verification queries to inspect profile roles, triggers, RLS policies, and function security configurations.

---

## 4. What Success Messages to Expect

In the Supabase SQL Editor **Results** or **Messages** pane, you should see:

```text
NOTICE:  === Starting Superadmin Promotion for: admin@thefcsguys.com ===
NOTICE:  Resolved auth.users record: User ID 3a7b8e12-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTICE:  SUCCESS: User admin@thefcsguys.com (ID: 3a7b8e12-xxxx-xxxx-xxxx-xxxxxxxxxxxx) successfully promoted to "superadmin". All security triggers active.
Success. No rows returned (or queries 1-5 displayed below)
```

The Results tabs below the query runner will display the 5 read-only verification result sets:
1. **Profiles Table**: Verifying `role = 'superadmin'` for your account.
2. **Triggers**: Showing `on_auth_user_created` and `trg_protect_profile_roles` both with status `Enabled`.
3. **RLS Policies**: Showing all profiles policies including `"Users can view own full profile"`, `"Staff can view all profiles"`, `"Users can edit own profile"`, `"Superadmin can manage profiles"`, and `"Service role can manage all profiles"`.
4. **Function Inspection**: Confirming `handle_new_user` and `protect_profile_roles` have `is_security_definer = true` and `proconfig = {search_path=public,pg_temp}`.
5. **Constraint Check**: Confirming the `profiles_role_check` constraint `CHECK (role IN ('superadmin', 'editor', 'contributor'))`.

---

## 5. Architectural Explanation: Why Bootstrap Disables the Trigger Temporarily

In `supabase/FINAL_SCHEMA.sql`, the `trg_protect_profile_roles` trigger is defined as:
```sql
CREATE TRIGGER trg_protect_profile_roles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_roles();
```
And its function enforces:
```sql
IF auth.role() = 'service_role' THEN
  RETURN NEW;
END IF;

IF NEW.role IS DISTINCT FROM OLD.role THEN
  IF NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'Security Violation: Only superadministrators are authorized to assign or modify profile roles.';
  END IF;
END IF;
```

### The Catch-22:
When executing queries in the Supabase SQL Editor:
- The session executes as the PostgreSQL superuser role (`postgres`), **NOT** with a Supabase Auth JWT (`auth.role()` returns `null` or `anon`, and `auth.uid()` returns `null`).
- Because `auth.role()` is not `'service_role'`, and `public.is_superadmin()` looks up `auth.uid()` in `public.profiles` (which returns `false` since there is no active JWT and no existing superadmin), any ordinary `UPDATE profiles SET role = 'superadmin'` would be blocked by `trg_protect_profile_roles`.
- Setting `request.jwt.claim.role` via `SET LOCAL` is unreliable across Supabase dashboard connection pooling configurations.

### The Secure Solution:
Because the SQL Editor executes with `postgres` database ownership privileges:
1. We run inside an atomic transaction (`BEGIN; ... COMMIT;`).
2. We run `ALTER TABLE public.profiles DISABLE TRIGGER trg_protect_profile_roles;`.
3. We execute the promotion upsert.
4. We run `ALTER TABLE public.profiles ENABLE TRIGGER trg_protect_profile_roles;`.
5. We verify the role is `'superadmin'` before committing.

This cleanly solves the bootstrap problem with zero changes to schema security, zero risk to live users, and guaranteed trigger reactivation.

---

## 6. How to Log Into `/admin`

1. Navigate to `/admin/login` in your local development (`http://localhost:3000/admin/login`) or production site (`https://yourdomain.com/admin/login`).
2. Enter your superadmin email and password.
3. Click **Sign In**.
4. The client will authenticate with Supabase Auth, store the session cookie via `@supabase/ssr`, and redirect to `/admin`.
5. The `src/middleware.ts` will verify the session, and `src/services/auth.service.ts` (`requireStaffSession()`) will query `public.profiles` and verify `role = 'superadmin'`.

---

## 7. Troubleshooting & Error Recovery

| Error Message | Cause | Resolution |
| :--- | :--- | :--- |
| `Setup Halted: Please replace '[YOUR_REGISTERED_EMAIL@example.com]'...` | The placeholder was not changed in PART 3. | Edit line 118 of the script and put your actual email in `c_target_email CONSTANT TEXT := 'your-email@example.com';`. |
| `Target User Not Found: No account exists in auth.users with email...` | The email has not been registered in Supabase Auth yet. | Sign up or create the user in **Supabase Dashboard &rarr; Authentication &rarr; Users** first, then re-run the script. |
| `relation "auth.users" does not exist` | Query run outside of Supabase or in wrong schema. | Ensure you are connected to your Supabase PostgreSQL database where the `auth` schema exists. |
| `permission denied for table profiles` | Run with insufficient privileges. | Ensure you are running the script in Supabase Dashboard SQL Editor (which operates as `postgres`). |
