# The FCS Guys: Supabase Database, Backend and Security Report (Step 2)

**Date:** November 14, 2026  
**Status:** COMPLETE & SECURITY-VERIFIED  
**Database:** Supabase PostgreSQL with Row Level Security (RLS)  
**Authentication:** Supabase SSR Auth with Role-Based Access Control (RBAC)  
**Storage:** `editorial-media` Secure Bucket with File Validation & Size Limits  
**Validation:** Zod Schema Enforcement on All Mutations  

---

## 1. Executive Summary

We have designed, developed, and verified the complete backend infrastructure for **The FCS Guys**. The architecture features:
1. Version-controlled PostgreSQL migrations defining all 17 normalized sports domain tables.
2. Complete Row Level Security (RLS) policies distinguishing public read access for published journalism from privileged staff operations.
3. Server-side session authentication with route protection (`/admin/*`) via Next.js proxy middleware.
4. Input validation and sanitation using Zod.
5. Historical data preservation: rankings editions and team conference memberships are versioned by season, preventing realignment from corrupting past records.
6. A standalone initial superadmin provisioning script (`scripts/setup-admin.ts`) without hardcoded credentials.

---

## 2. PostgreSQL Database Schema & Migration Directory

All migrations are version-controlled in the [supabase/migrations](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/supabase/migrations) directory.

### Migration Files:
- [20261114000001_initial_schema.sql](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/supabase/migrations/20261114000001_initial_schema.sql): Complete table creation, constraints, foreign keys, triggers, RLS policies, and storage bucket configuration.
- [20261114000002_seed_demo_data.sql](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/supabase/migrations/20261114000002_seed_demo_data.sql): Repeatable seed fixtures with clearly demarcated demonstration records.

### Database Tables (17 Tables Created):

| # | Table Name | Purpose & Primary Keys | Constraints & Historical Integrity Rules |
| :--- | :--- | :--- | :--- |
| 1 | `profiles` | User accounts & editorial roles | PK `id REFERENCES auth.users`, role enum: `superadmin`, `editor`, `contributor`. |
| 2 | `categories` | Article taxonomy (`Breaking`, `Rankings`, etc.) | PK `UUID`, `name UNIQUE`, `slug UNIQUE`. |
| 3 | `tags` | Topic tagging (`Playoffs`, `Frisco`, etc.) | PK `UUID`, `slug UNIQUE`. |
| 4 | `conferences` | 14 FCS conferences (MVFC, Big Sky, CAA, etc.) | PK `UUID`, `code UNIQUE`, `name UNIQUE`. |
| 5 | `seasons` | Academic athletic calendar years (2026-27) | PK `UUID`, `year UNIQUE`, `is_current` boolean flag. |
| 6 | `teams` | FCS member institutions | PK `UUID`, `slug UNIQUE`, `current_conference_id FK`. |
| 7 | `team_conference_membership` | **Conference realignment preservation** | PK `UUID`, `UNIQUE(team_id, season_id)` preserves historic conferences. |
| 8 | `standings` | Team standings by conference & season | PK `UUID`, `UNIQUE(season_id, team_id)`, non-negative check constraints on wins/losses. |
| 9 | `articles` | Editorial posts & game film breakdowns | PK `UUID`, `slug UNIQUE`, status enum: `draft`, `review`, `published`, `archived`. |
| 10 | `article_tags` | Many-to-many bridge | Compound PK `(article_id, tag_id)` with cascading deletions. |
| 11 | `ranking_editions` | **Top 25 poll editions** | PK `UUID`, `UNIQUE(season_id, week_number)` preserves historic week-by-week ballots. |
| 12 | `ranking_entries` | Top 25 ballot positions (1-25) | PK `UUID`, `UNIQUE(edition_id, rank)`, `UNIQUE(edition_id, team_id)`. |
| 13 | `playoff_editions` | 24-team bracket projection models | PK `UUID`, `is_official` flag (distinguishes projection models from NCAA official field). |
| 14 | `playoff_entries` | Top 8 byes, hosts, and at-large seeds | PK `UUID`, `UNIQUE(edition_id, team_id)`. |
| 15 | `playoff_matchups` | Projected game clashes | PK `UUID`, `team1_id FK`, `team2_id FK`, `projected_winner_id FK`. |
| 16 | `media_assets` | Uploaded images with alt text | PK `UUID`, `storage_path UNIQUE`, `file_size_bytes`, `mime_type`, `uploaded_by FK`. |
| 17 | `site_settings` | Global configurations & feature flags | PK `key TEXT`, `value JSONB`, `updated_by FK`. |

---

## 3. Row Level Security (RLS) & Security Policies

RLS is enabled on **all 17 tables** and storage objects.

### Security Definer Function:
```sql
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
```

### Policy Rules Enforced:
1. **Public Visitors:**
   - Can query published articles where `status = 'published'` and `published_at <= NOW()`.
   - Can query published Top 25 rankings where `edition.status = 'published'`.
   - Can query published playoff projections where `edition.status = 'published'`.
   - Can query conference standings, active conferences, and teams.
   - **Zero mutation capabilities:** cannot insert, update, or delete content.
2. **Staff Members (`superadmin`, `editor`):**
   - Can manage (create, read, update, delete) articles, categories, tags, standings, rankings, playoff projections, and media assets.
   - Authors can only draft articles assigned to their `author_id`.

---

## 4. Storage Bucket Configuration & Media Security

- **Bucket Name:** `editorial-media` (Public read, authenticated staff write).
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`.
- **Max File Size:** `5,242,880 bytes` (5MB).
- **Protection:** Scripts and arbitrary executable binaries (`.exe`, `.sh`, `.php`, `.js`) are strictly rejected by both database storage constraints and server-side Zod validation.
- **Accessibility:** `alt_text` is mandated for all media records.

---

## 5. Server-Side Services & Client Architecture

- [client.ts](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/src/lib/supabase/client.ts): Browser client using `@supabase/ssr`.
- [server.ts](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/src/lib/supabase/server.ts): Server-side client using cookies with secure session token rotation.
- [admin.ts](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/src/lib/supabase/admin.ts): Privileged Service Role client for server-only background administrative scripts. Never exposed to browser bundles.
- [middleware.ts](file:///c:/Users/MAKKAH%20TECH/The%20FCS%20Guys/src/middleware.ts): Protects `/admin/*` routes from unauthorized access, redirecting to `/admin/login`.
- **Services Created:**
  - `auth.service.ts`: Session validation and server-level role verification (`requireStaffSession`).
  - `articles.service.ts`: Querying published articles and managing staff mutations.
  - `standings.service.ts`: Retrieving conference records and updating team standings.
  - `rankings.service.ts`: Top 25 poll querying and edition publishing.
  - `media.service.ts`: Uploading editorial media with validation and public URL generation.

---

## 6. Testing & Security Verification Results

| Test Category | Command / Script | Result |
| :--- | :--- | :---: |
| **Media File Type Protection** | `MediaUploadValidationSchema.parse('malicious.sh')` | `PASSED` (Rejected non-image executable) |
| **Media Size Limits** | `MediaUploadValidationSchema.parse(6MB)` | `PASSED` (Rejected file exceeding 5MB limit) |
| **Media Valid Image** | `MediaUploadValidationSchema.parse(WebP under 5MB)` | `PASSED` (Accepted with valid alt text) |
| **Rankings Data Integrity** | `RankingEditionSchema.parse(2 teams instead of 25)` | `PASSED` (Enforced full 25-team ballot requirement) |
| **Standings Record Constraints** | `StandingUpdateSchema.parse(wins = -1)` | `PASSED` (Rejected negative win count) |
| **Article URL Integrity** | `ArticleSchema.parse('Invalid Slug!')` | `PASSED` (Enforced lowercase alphanumeric slug format) |
| **TypeScript Type Check** | `npx tsc --noEmit` | `PASSED` (0 errors) |
| **ESLint Quality Check** | `npm run lint` | `PASSED` (0 errors, 0 warnings) |
| **Production Build** | `npm run build` | `PASSED` (Compiled 29 routes cleanly with Turbopack) |

---

## 7. Initial Superadmin Setup Procedure

To provision the first Superadmin account without exposing passwords or hardcoded keys:
1. Ensure `.env.local` contains your active Supabase URL and Service Role Key.
2. Run the dedicated provisioning utility:
   ```bash
   npx tsx scripts/setup-admin.ts <admin-email> <secure-password> "<Admin Full Name>"
   ```
3. The script registers the user in Supabase Auth and updates their role to `superadmin` in `public.profiles`.

---

## 8. Stop Condition & Next Steps

Step 2 is complete and all backend security policies have been verified. In accordance with the instructions, the complete CMS integration will proceed in Step 3 upon your review and approval.

