-- ==============================================================================
-- THE FCS GUYS: INITIAL SEED DEMONSTRATION DATA
-- Migration: 00002_seed_demo_data.sql
-- Clearly labeled demonstration fixtures for FCS sports journalism
-- ==============================================================================

-- 1. SEASONS
INSERT INTO public.seasons (id, year, title, is_current, start_date, end_date)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 2026, '2026-27 FCS Season', true, '2026-08-29', '2027-01-11')
ON CONFLICT (year) DO NOTHING;

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, display_order)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Breaking', 'breaking', 'Breaking news and urgent reports from across the subdivision', 1),
  ('c2222222-2222-2222-2222-222222222222', 'Rankings', 'rankings', 'Official media polls, committee reveals and power rankings', 2),
  ('c3333333-3333-3333-3333-333333333333', 'Analysis', 'analysis', 'Deep film room breakdowns, EPA analysis and tactical deep dives', 3),
  ('c4444444-4444-4444-4444-444444444444', 'Playoffs', 'playoffs', '24-team bracketology and Road to Frisco projections', 4),
  ('c5555555-5555-5555-5555-555555555555', 'Recruiting', 'recruiting', 'Transfer portal news and high school commitments', 5),
  ('c6666666-6666-6666-6666-666666666666', 'Game Recap', 'game-recap', 'Post-game breakdowns, box score takeaways and stats', 6)
ON CONFLICT (slug) DO NOTHING;

-- 3. TAGS
INSERT INTO public.tags (id, name, slug)
VALUES
  ('t1111111-1111-1111-1111-111111111111', 'Playoffs', 'playoffs'),
  ('t2222222-2222-2222-2222-222222222222', 'Frisco', 'frisco'),
  ('t3333333-3333-3333-3333-333333333333', 'MVFC', 'mvfc'),
  ('t4444444-4444-4444-4444-444444444444', 'Big Sky', 'big-sky'),
  ('t5555555-5555-5555-5555-555555555555', 'CAA', 'caa')
ON CONFLICT (slug) DO NOTHING;

-- 4. CONFERENCES
INSERT INTO public.conferences (id, code, name, short_name, hq_location, founded_year, banner_color, description)
VALUES
  ('f1111111-1111-1111-1111-111111111111', 'mvfc', 'Missouri Valley Football Conference', 'MVFC', 'St. Louis, MO', 1985, '#005837', 'The standard of FCS championship dominance, boasting 17 national titles.'),
  ('f2222222-2222-2222-2222-222222222222', 'big-sky', 'Big Sky Conference', 'Big Sky', 'Farmington, UT', 1963, '#00205B', 'Vast western conference famous for fierce rivalries and mountain venues.'),
  ('f3333333-3333-3333-3333-333333333333', 'caa', 'CAA Football (Coastal Athletic Association)', 'CAA', 'Richmond, VA', 2007, '#9E0712', 'The premier East Coast gridiron conference stretching Maine to North Carolina.'),
  ('f4444444-4444-4444-4444-444444444444', 'socon', 'Southern Conference', 'SoCon', 'Spartanburg, SC', 1921, '#E05929', 'One of college football oldest leagues, deeply rooted in southern pigskin tradition.')
ON CONFLICT (code) DO NOTHING;

-- 5. TEAMS
INSERT INTO public.teams (id, name, mascot, slug, current_conference_id, primary_color, secondary_color)
VALUES
  ('e1111111-1111-1111-1111-111111111111', 'North Dakota State', 'Bison', 'north-dakota-state', 'f1111111-1111-1111-1111-111111111111', '#005837', '#FFD400'),
  ('e2222222-2222-2222-2222-222222222222', 'Montana State', 'Bobcats', 'montana-state', 'f2222222-2222-2222-2222-222222222222', '#00205B', '#FFD400'),
  ('e3333333-3333-3333-3333-333333333333', 'South Dakota State', 'Jackrabbits', 'south-dakota-state', 'f1111111-1111-1111-1111-111111111111', '#0033A0', '#FFD400'),
  ('e4444444-4444-4444-4444-444444444444', 'Montana', 'Grizzlies', 'montana', 'f2222222-2222-2222-2222-222222222222', '#702082', '#B5B5B5')
ON CONFLICT (slug) DO NOTHING;

-- 6. STANDINGS
INSERT INTO public.standings (season_id, conference_id, team_id, conference_wins, conference_losses, overall_wins, overall_losses, home_record, away_record, streak, position_rank)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 7, 0, 10, 1, '6-0', '4-1', 'W8', 1),
  ('a1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'e3333333-3333-3333-3333-333333333333', 6, 1, 9, 2, '5-0', '4-2', 'W3', 2),
  ('a1111111-1111-1111-1111-111111111111', 'f2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 7, 0, 10, 0, '5-0', '5-0', 'W10', 1),
  ('a1111111-1111-1111-1111-111111111111', 'f2222222-2222-2222-2222-222222222222', 'e4444444-4444-4444-4444-444444444444', 5, 2, 8, 3, '5-1', '3-2', 'W1', 2)
ON CONFLICT (season_id, team_id) DO NOTHING;

-- 7. RANKING EDITION & ENTRIES
INSERT INTO public.ranking_editions (id, season_id, week_number, edition_title, ranking_date, total_voters, status)
VALUES
  ('r1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 12, 'Week 12 National Media Poll', '2026-11-11', 26, 'published')
ON CONFLICT (season_id, week_number) DO NOTHING;

INSERT INTO public.ranking_entries (edition_id, team_id, rank, previous_rank, first_place_votes, points, trend)
VALUES
  ('r1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 1, 1, 24, 648, 'same'),
  ('r1111111-1111-1111-1111-111111111111', 'e2222222-2222-2222-2222-222222222222', 2, 2, 2, 624, 'same'),
  ('r1111111-1111-1111-1111-111111111111', 'e3333333-3333-3333-3333-333333333333', 3, 4, 0, 595, 'up')
ON CONFLICT (edition_id, rank) DO NOTHING;

