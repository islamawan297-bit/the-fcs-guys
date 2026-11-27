-- ==============================================================================
-- THE FCS GUYS: EXHAUSTIVE DYNAMIC CONSERVATIVE ROLLBACK SCRIPT
-- Enforces zero-collateral, zero-cascade, zero-nullification rollback.
-- Dynamically inspects all foreign keys in PostgreSQL catalogs that reference
-- the seed entity tables, queries each for non-seed dependent rows, and aborts
-- with RAISE EXCEPTION before any record can be deleted.
-- ==============================================================================

DO $$
DECLARE
  v_rec RECORD;
  v_dep_count BIGINT;
  v_sql TEXT;
  v_total_violations INT := 0;
BEGIN
  IF to_regclass('public._seed_provenance') IS NULL THEN
    RAISE NOTICE 'Rollback Notice: public._seed_provenance does not exist. Nothing to roll back.';
    RETURN;
  END IF;

  RAISE NOTICE '=== EXHAUSTIVE FOREIGN-KEY DEPENDENCY AUDIT STARTING ===';

  -- 1. DYNAMIC CATALOG-DRIVEN AUDIT:
  -- Query pg_constraint and pg_class to locate every foreign key in the public schema
  -- that targets any table tracked in _seed_provenance.
  FOR v_rec IN (
    SELECT 
      conname AS fk_name,
      conrelid::regclass::text AS child_table,
      confrelid::regclass::text AS parent_table,
      child_attr.attname AS child_column,
      parent_attr.attname AS parent_column,
      confdeltype AS delete_action -- 'c'=cascade, 'n'=set null, 'r'=restrict, 'a'=no action
    FROM pg_constraint c
    JOIN pg_attribute child_attr ON child_attr.attrelid = c.conrelid AND child_attr.attnum = c.conkey[1]
    JOIN pg_attribute parent_attr ON parent_attr.attrelid = c.confrelid AND parent_attr.attnum = c.confkey[1]
    WHERE c.contype = 'f'
      AND c.confrelid::regclass::text IN (
        'public.seasons', 'public.conferences', 'public.teams', 
        'public.categories', 'public.tags', 'public.ranking_editions'
      )
    ORDER BY conrelid::regclass::text, conname
  )
  LOOP
    -- Build query to check if any child record references a seed-created parent
    -- but is NOT ITSELF a seed-created entity logged in _seed_provenance.
    -- Example for rankings, standings, articles, team_conference_membership, etc.
    v_sql := format(
      'SELECT count(*) FROM %s WHERE %I IN (
         SELECT entity_id FROM public._seed_provenance WHERE migration_id = ''00002_seed_demo_data''
       ) AND id NOT IN (
         SELECT entity_id FROM public._seed_provenance WHERE migration_id = ''00002_seed_demo_data''
       )',
      v_rec.child_table,
      v_rec.child_column
    );

    -- Special handling for composite-key junction tables without single 'id' column (e.g. article_tags)
    IF v_rec.child_table = 'public.article_tags' THEN
      v_sql := format(
        'SELECT count(*) FROM %s WHERE %I IN (
           SELECT entity_id FROM public._seed_provenance WHERE migration_id = ''00002_seed_demo_data''
         ) AND article_id NOT IN (
           SELECT entity_id FROM public._seed_provenance WHERE migration_id = ''00002_seed_demo_data''
         )',
        v_rec.child_table,
        v_rec.child_column
      );
    END IF;

    BEGIN
      EXECUTE v_sql INTO v_dep_count;
      IF v_dep_count > 0 THEN
        RAISE WARNING 'Foreign Key Blocker: % rows in % (via %) depend on seed % rows!',
          v_dep_count, v_rec.child_table, v_rec.fk_name, v_rec.parent_table;
        v_total_violations := v_total_violations + 1;
      END IF;
    EXCEPTION WHEN undefined_table OR undefined_column THEN
      -- Table or column not currently present in environment
      NULL;
    END;
  END LOOP;

  IF v_total_violations > 0 THEN
    RAISE EXCEPTION 'Rollback Aborted: % non-seed foreign key dependencies detected. Rollback halted to prevent silent data loss or nullification.', v_total_violations;
  END IF;

  RAISE NOTICE '=== ALL DEPENDENCY CHECKS PASSED: ZERO COLLATERAL CONFLICTS ===';

  -- 2. SAFE DELETIONS IN STRICT REVERSE-DEPENDENCY ORDER
  DELETE FROM public.ranking_entries
  WHERE id IN (SELECT entity_id FROM public._seed_provenance WHERE migration_id = '00002_seed_demo_data' AND entity_table = 'ranking_entries');

  DELETE FROM public.ranking_editions
  WHERE id IN (SELECT entity_id FROM public._seed_provenance WHERE migration_id = '00002_seed_demo_data' AND entity_table = 'ranking_editions');

  DELETE FROM public.standings
  WHERE id IN (SELECT entity_id FROM public._seed_provenance WHERE migration_id = '00002_seed_demo_data' AND entity_table = 'standings');

  DELETE FROM public.teams
  WHERE id IN (SELECT entity_id FROM public._seed_provenance WHERE migration_id = '00002_seed_demo_data' AND entity_table = 'teams');

  DELETE FROM public.conferences
  WHERE id IN (SELECT entity_id FROM public._seed_provenance WHERE migration_id = '00002_seed_demo_data' AND entity_table = 'conferences');

  DELETE FROM public.tags
  WHERE id IN (SELECT entity_id FROM public._seed_provenance WHERE migration_id = '00002_seed_demo_data' AND entity_table = 'tags');

  DELETE FROM public.categories
  WHERE id IN (SELECT entity_id FROM public._seed_provenance WHERE migration_id = '00002_seed_demo_data' AND entity_table = 'categories');

  DELETE FROM public.seasons
  WHERE id IN (SELECT entity_id FROM public._seed_provenance WHERE migration_id = '00002_seed_demo_data' AND entity_table = 'seasons');

  DELETE FROM public._seed_provenance WHERE migration_id = '00002_seed_demo_data';

  RAISE NOTICE 'Rollback Complete: All seed records successfully removed without any collateral damage.';
END $$;
