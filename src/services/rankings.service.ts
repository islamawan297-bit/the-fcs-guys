import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireStaffSession } from '@/services/auth.service';
import { RankingEditionSchema } from '@/lib/validations';
import { z } from 'zod';

export async function getLatestTop25Rankings() {
  const supabase = await createServerSupabaseClient();

  const { data: edition, error: editionError } = await supabase
    .from('ranking_editions')
    .select(`
      id,
      week_number,
      edition_title,
      ranking_date,
      total_voters,
      status,
      ranking_entries (
        id,
        rank,
        previous_rank,
        first_place_votes,
        points,
        trend,
        teams (
          id,
          name,
          mascot,
          slug,
          primary_color,
          conferences (short_name, code)
        )
      )
    `)
    .eq('status', 'published')
    .order('ranking_date', { ascending: false })
    .limit(1)
    .single();

  if (editionError) return null;
  return edition;
}

export async function publishRankingEdition(input: z.infer<typeof RankingEditionSchema>) {
  await requireStaffSession();
  const validated = RankingEditionSchema.parse(input);

  const supabase = await createServerSupabaseClient();

  // 1. Insert or update the edition header
  const { data: edition, error: editionError } = await supabase
    .from('ranking_editions')
    .upsert(
      {
        season_id: validated.season_id,
        week_number: validated.week_number,
        edition_title: validated.edition_title,
        ranking_date: validated.ranking_date,
        total_voters: validated.total_voters,
        status: validated.status,
      },
      { onConflict: 'season_id,week_number' }
    )
    .select()
    .single();

  if (editionError || !edition) throw editionError;

  // 2. Insert all 25 ranked entries
  const entriesPayload = validated.entries.map((entry) => ({
    edition_id: edition.id,
    team_id: entry.team_id,
    rank: entry.rank,
    previous_rank: entry.previous_rank,
    first_place_votes: entry.first_place_votes,
    points: entry.points,
    trend: entry.trend,
  }));

  const { error: entriesError } = await supabase
    .from('ranking_entries')
    .upsert(entriesPayload, { onConflict: 'edition_id,rank' });

  if (entriesError) throw entriesError;

  return edition;
}

