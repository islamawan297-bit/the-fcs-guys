import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireStaffSession } from '@/services/auth.service';
import { StandingUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

export async function getConferencesWithStandings(seasonYear = 2026) {
  const supabase = await createServerSupabaseClient();

  const { data: season } = await supabase
    .from('seasons')
    .select('id')
    .eq('year', seasonYear)
    .single();

  if (!season) return [];

  const { data: conferences, error } = await supabase
    .from('conferences')
    .select(`
      id,
      code,
      name,
      short_name,
      hq_location,
      founded_year,
      banner_color,
      description,
      standings (
        id,
        conference_wins,
        conference_losses,
        overall_wins,
        overall_losses,
        home_record,
        away_record,
        streak,
        position_rank,
        clinched_postseason,
        teams (id, name, mascot, slug, primary_color, secondary_color, logo_url)
      )
    `)
    .eq('is_active', true)
    .eq('standings.season_id', season.id)
    .order('short_name');

  if (error) throw error;
  return conferences;
}

export async function updateTeamStandings(input: z.infer<typeof StandingUpdateSchema>) {
  await requireStaffSession();
  const validated = StandingUpdateSchema.parse(input);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('standings')
    .upsert(
      {
        ...validated,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'season_id,team_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

