-- ==============================================================================
-- THE FCS GUYS: INITIAL SEED DEMONSTRATION DATA (Production-Safe & Natural-Key Resilient)
-- Migration: 00002_seed_demo_data.sql
-- Uses DO blocks and natural key lookups to guarantee 100% foreign key idempotency.
-- Records created by this migration are logged into public._seed_provenance for 100% deterministic rollback.
-- ==============================================================================

-- Create dedicated provenance tracker table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public._seed_provenance (
  id BIGSERIAL PRIMARY KEY,
  migration_id TEXT NOT NULL,
  entity_table TEXT NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Harden _seed_provenance: enable RLS, revoke public access
ALTER TABLE public._seed_provenance ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public._seed_provenance FROM PUBLIC, anon, authenticated;
-- Grant access exclusively to service_role (and table owner/postgres)
GRANT ALL ON TABLE public._seed_provenance TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public._seed_provenance_id_seq TO service_role;

DO $$
DECLARE
  v_season_id UUID;
  v_season_is_new BOOLEAN := false;
  v_mvfc_id UUID;
  v_bigsky_id UUID;
  v_caa_id UUID;
  v_socon_id UUID;
  v_ndsu_id UUID;
  v_montana_st_id UUID;
  v_sdsu_id UUID;
  v_montana_id UUID;
  v_ranking_edition_id UUID;
  rec RECORD;
BEGIN

  -- 1. SEASONS (Natural Key: year)
  -- Insert only if season 2026 does not exist. If inserted, capture ID and mark as newly created.
  WITH ins_season AS (
    INSERT INTO public.seasons (id, year, title, is_current, start_date, end_date)
    VALUES ('a1111111-1111-1111-1111-111111111111', 2026, '2026-27 FCS Season', true, '2026-08-29', '2027-01-11')
    ON CONFLICT (year) DO NOTHING
    RETURNING id
  )
  SELECT id INTO v_season_id FROM ins_season;

  IF v_season_id IS NOT NULL THEN
    v_season_is_new := true;
    INSERT INTO public._seed_provenance (migration_id, entity_table, entity_id)
    VALUES ('00002_seed_demo_data', 'seasons', v_season_id);
  ELSE
    -- Pre-existing 2026 season: resolve its ID, but v_season_is_new remains false
    SELECT id INTO v_season_id FROM public.seasons WHERE year = 2026;
  END IF;

  IF v_season_id IS NULL THEN
    RAISE EXCEPTION 'Seed Error: Season for 2026 could not be resolved or inserted.';
  END IF;

  -- 2. CATEGORIES (Natural Keys: slug, name)
  FOR rec IN
    WITH ins_cat AS (
      INSERT INTO public.categories (id, name, slug, description, display_order)
      SELECT c.id, c.name, c.slug, c.description, c.display_order
      FROM (
        VALUES
          ('c1111111-1111-1111-1111-111111111111'::UUID, 'Breaking', 'breaking', 'Breaking news and urgent reports from across the subdivision', 1),
          ('c2222222-2222-2222-2222-222222222222'::UUID, 'Rankings', 'rankings', 'Official media polls, committee reveals and power rankings', 2),
          ('c3333333-3333-3333-3333-333333333333'::UUID, 'Analysis', 'analysis', 'Deep film room breakdowns, EPA analysis and tactical deep dives', 3),
          ('c4444444-4444-4444-4444-444444444444'::UUID, 'Playoffs', 'playoffs', '24-team bracketology and Road to Frisco projections', 4),
          ('c5555555-5555-5555-5555-555555555555'::UUID, 'Recruiting', 'recruiting', 'Transfer portal news and high school commitments', 5),
          ('c6666666-6666-6666-6666-666666666666'::UUID, 'Game Recap', 'game-recap', 'Post-game breakdowns, box score takeaways and stats', 6)
      ) AS c(id, name, slug, description, display_order)
      WHERE NOT EXISTS (
        SELECT 1 FROM public.categories
        WHERE categories.slug = c.slug OR categories.name = c.name
      )
      RETURNING id
    )
    SELECT id FROM ins_cat
  LOOP
    INSERT INTO public._seed_provenance (migration_id, entity_table, entity_id)
    VALUES ('00002_seed_demo_data', 'categories', rec.id);
  END LOOP;

  -- 3. TAGS (Natural Keys: slug, name)
  FOR rec IN
    WITH ins_tag AS (
      INSERT INTO public.tags (id, name, slug)
      SELECT t.id, t.name, t.slug
      FROM (
        VALUES
          ('ba111111-1111-1111-1111-111111111111'::UUID, 'Playoffs', 'playoffs'),
          ('ba222222-2222-2222-2222-222222222222'::UUID, 'Frisco', 'frisco'),
          ('ba333333-3333-3333-3333-333333333333'::UUID, 'MVFC', 'mvfc'),
          ('ba444444-4444-4444-4444-444444444444'::UUID, 'Big Sky', 'big-sky'),
          ('ba555555-5555-5555-5555-555555555555'::UUID, 'CAA', 'caa')
      ) AS t(id, name, slug)
      WHERE NOT EXISTS (
        SELECT 1 FROM public.tags
        WHERE tags.slug = t.slug OR tags.name = t.name
      )
      RETURNING id
    )
    SELECT id FROM ins_tag
  LOOP
    INSERT INTO public._seed_provenance (migration_id, entity_table, entity_id)
    VALUES ('00002_seed_demo_data', 'tags', rec.id);
  END LOOP;

  -- 4. CONFERENCES (Natural Keys: code, name)
  FOR rec IN
    WITH ins_conf AS (
      INSERT INTO public.conferences (id, code, name, short_name, hq_location, founded_year, banner_color, description)
      SELECT cf.id, cf.code, cf.name, cf.short_name, cf.hq_location, cf.founded_year, cf.banner_color, cf.description
      FROM (
        VALUES
          ('da111111-1111-1111-1111-111111111111'::UUID, 'mvfc', 'Missouri Valley Football Conference', 'MVFC', 'St. Louis, MO', 1985, '#005837', 'The standard of FCS championship dominance, boasting 17 national titles.'),
          ('da222222-2222-2222-2222-222222222222'::UUID, 'big-sky', 'Big Sky Conference', 'Big Sky', 'Farmington, UT', 1963, '#00205B', 'Vast western conference famous for fierce rivalries and mountain venues.'),
          ('da333333-3333-3333-3333-333333333333'::UUID, 'caa', 'CAA Football (Coastal Athletic Association)', 'CAA', 'Richmond, VA', 2007, '#9E0712', 'The premier East Coast gridiron conference stretching Maine to North Carolina.'),
          ('da444444-4444-4444-4444-444444444444'::UUID, 'socon', 'Southern Conference', 'SoCon', 'Spartanburg, SC', 1921, '#E05929', 'One of college football oldest leagues, deeply rooted in southern pigskin tradition.')
      ) AS cf(id, code, name, short_name, hq_location, founded_year, banner_color, description)
      WHERE NOT EXISTS (
        SELECT 1 FROM public.conferences
        WHERE conferences.code = cf.code OR conferences.name = cf.name
      )
      RETURNING id
    )
    SELECT id FROM ins_conf
  LOOP
    INSERT INTO public._seed_provenance (migration_id, entity_table, entity_id)
    VALUES ('00002_seed_demo_data', 'conferences', rec.id);
  END LOOP;

  -- Resolve conference IDs dynamically and verify they exist
  SELECT id INTO v_mvfc_id FROM public.conferences WHERE code = 'mvfc';
  SELECT id INTO v_bigsky_id FROM public.conferences WHERE code = 'big-sky';
  SELECT id INTO v_caa_id FROM public.conferences WHERE code = 'caa';
  SELECT id INTO v_socon_id FROM public.conferences WHERE code = 'socon';

  IF v_mvfc_id IS NULL OR v_bigsky_id IS NULL OR v_caa_id IS NULL OR v_socon_id IS NULL THEN
    RAISE EXCEPTION 'Seed Error: One or more required conferences (MVFC, Big Sky, CAA, SoCon) could not be resolved.';
  END IF;

  -- 5. TEAMS (Natural Key: slug)
  FOR rec IN
    WITH ins_team AS (
      INSERT INTO public.teams (id, name, mascot, slug, current_conference_id, primary_color, secondary_color)
      VALUES
        ('e1111111-1111-1111-1111-111111111111', 'North Dakota State', 'Bison', 'north-dakota-state', v_mvfc_id, '#005837', '#FFD400'),
        ('e2222222-2222-2222-2222-222222222222', 'Montana State', 'Bobcats', 'montana-state', v_bigsky_id, '#00205B', '#FFD400'),
        ('e3333333-3333-3333-3333-333333333333', 'South Dakota State', 'Jackrabbits', 'south-dakota-state', v_mvfc_id, '#0033A0', '#FFD400'),
        ('e4444444-4444-4444-4444-444444444444', 'Montana', 'Grizzlies', 'montana', v_bigsky_id, '#702082', '#B5B5B5')
      ON CONFLICT (slug) DO NOTHING
      RETURNING id
    )
    SELECT id FROM ins_team
  LOOP
    INSERT INTO public._seed_provenance (migration_id, entity_table, entity_id)
    VALUES ('00002_seed_demo_data', 'teams', rec.id);
  END LOOP;

  -- Resolve team IDs dynamically and verify they exist
  SELECT id INTO v_ndsu_id FROM public.teams WHERE slug = 'north-dakota-state';
  SELECT id INTO v_montana_st_id FROM public.teams WHERE slug = 'montana-state';
  SELECT id INTO v_sdsu_id FROM public.teams WHERE slug = 'south-dakota-state';
  SELECT id INTO v_montana_id FROM public.teams WHERE slug = 'montana';

  IF v_ndsu_id IS NULL OR v_montana_st_id IS NULL OR v_sdsu_id IS NULL OR v_montana_id IS NULL THEN
    RAISE EXCEPTION 'Seed Error: One or more required teams (NDSU, Montana St, SDSU, Montana) could not be resolved.';
  END IF;

  -- 6. STANDINGS (Demo fixtures strictly marked unverified: is_verified = false)
  -- ISOLATION ENFORCEMENT: Never contaminate an existing real season with demo standings.
  -- Standings fixtures are inserted ONLY IF the 2026 season was created newly by this seed migration.
  IF v_season_is_new THEN
    FOR rec IN
      WITH ins_stnd AS (
        INSERT INTO public.standings (season_id, conference_id, team_id, conference_wins, conference_losses, overall_wins, overall_losses, home_record, away_record, streak, position_rank, is_verified)
        VALUES
          (v_season_id, v_mvfc_id, v_ndsu_id, 7, 0, 10, 1, '6-0', '4-1', 'W8', 1, false),
          (v_season_id, v_mvfc_id, v_sdsu_id, 6, 1, 9, 2, '5-0', '4-2', 'W3', 2, false),
          (v_season_id, v_bigsky_id, v_montana_st_id, 7, 0, 10, 0, '5-0', '5-0', 'W10', 1, false),
          (v_season_id, v_bigsky_id, v_montana_id, 5, 2, 8, 3, '5-1', '3-2', 'W1', 2, false)
        ON CONFLICT (season_id, team_id) DO NOTHING
        RETURNING id
      )
      SELECT id FROM ins_stnd
    LOOP
      INSERT INTO public._seed_provenance (migration_id, entity_table, entity_id)
      VALUES ('00002_seed_demo_data', 'standings', rec.id);
    END LOOP;
  ELSE
    RAISE NOTICE 'Seed Notice: Existing 2026 season detected. Skipping demo standings to prevent contaminating production standings.';
  END IF;

  -- 7. RANKING EDITION & ENTRIES
  -- (Natural Key: season_id, week_number)
  -- Strictly inserted with fixed UUID 'ea111111-1111-1111-1111-111111111111'.
  -- Demo ranking entries are ONLY inserted if THIS EXACT EXECUTION created the demo edition.
  -- Uses `INSERT ... ON CONFLICT DO NOTHING RETURNING id` to positively prove creation.
  -- If any edition (published or draft) already exists for (v_season_id, 12),
  -- RETURNING id will be NULL, and demo entries will be strictly skipped.
  WITH inserted_edition AS (
    INSERT INTO public.ranking_editions (id, season_id, week_number, edition_title, ranking_date, total_voters, status)
    VALUES
      ('ea111111-1111-1111-1111-111111111111', v_season_id, 12, 'Week 12 National Media Poll [Demo]', '2026-11-11', 26, 'draft')
    ON CONFLICT (season_id, week_number) DO NOTHING
    RETURNING id
  )
  SELECT id INTO v_ranking_edition_id FROM inserted_edition;

  -- Only insert demo ranking entries if this execution created the exact demo edition
  IF v_ranking_edition_id IS NOT NULL AND v_ranking_edition_id = 'ea111111-1111-1111-1111-111111111111' THEN
    INSERT INTO public._seed_provenance (migration_id, entity_table, entity_id)
    VALUES ('00002_seed_demo_data', 'ranking_editions', v_ranking_edition_id);

    FOR rec IN
      WITH ins_entry AS (
        INSERT INTO public.ranking_entries (edition_id, team_id, rank, previous_rank, first_place_votes, points, trend)
        SELECT re.edition_id, re.team_id, re.rank, re.previous_rank, re.first_place_votes, re.points, re.trend
        FROM (
          VALUES
            (v_ranking_edition_id, v_ndsu_id, 1, 1, 24, 648, 'same'::TEXT),
            (v_ranking_edition_id, v_montana_st_id, 2, 2, 2, 624, 'same'::TEXT),
            (v_ranking_edition_id, v_sdsu_id, 3, 4, 0, 595, 'up'::TEXT)
        ) AS re(edition_id, team_id, rank, previous_rank, first_place_votes, points, trend)
        WHERE NOT EXISTS (
          SELECT 1 FROM public.ranking_entries
          WHERE ranking_entries.edition_id = re.edition_id
            AND (ranking_entries.rank = re.rank OR ranking_entries.team_id = re.team_id)
        )
        RETURNING id
      )
      SELECT id FROM ins_entry
    LOOP
      INSERT INTO public._seed_provenance (migration_id, entity_table, entity_id)
      VALUES ('00002_seed_demo_data', 'ranking_entries', rec.id);
    END LOOP;
  ELSE
    RAISE NOTICE 'Seed Notice: Week 12 ranking edition already exists for season %. Skipping demo ranking entries to protect existing poll data.', v_season_id;
  END IF;

END $$;
