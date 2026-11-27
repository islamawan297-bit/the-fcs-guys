import { createPublicSupabaseClient } from '@/lib/supabase/public';
import { ARTICLES_DATA, TOP_25_RANKINGS, CONFERENCES_DATA, PLAYOFF_PROJECTIONS, PLAYOFF_MATCHUPS } from '@/data/fcs-data';
import { Article, TeamRanking, ConferenceInfo, PlayoffProjection, PlayoffMatchup } from '@/types';

function isConfiguredSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && !url.includes('mock');
}

interface RawDbArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  image_caption: string | null;
  read_time_minutes: number;
  is_featured: boolean;
  is_trending: boolean;
  published_at: string | null;
  categories: { name: string } | null;
  conferences: { short_name: string } | null;
  profiles: { full_name: string; role: string; avatar_url: string | null } | null;
}

interface RawDbRankingEntry {
  rank: number;
  previous_rank: number | null;
  first_place_votes: number;
  points: number;
  trend: 'up' | 'down' | 'same';
  teams: {
    name: string;
    mascot: string;
    primary_color: string | null;
    conferences: { short_name: string } | null;
  } | null;
}

interface RawDbStanding {
  conference_wins: number;
  conference_losses: number;
  overall_wins: number;
  overall_losses: number;
  home_record: string | null;
  away_record: string | null;
  streak: string | null;
  position_rank: number;
  teams: { name: string; mascot: string } | null;
}

interface RawDbConference {
  id: string;
  code: string;
  name: string;
  short_name: string;
  hq_location: string | null;
  founded_year: number | null;
  banner_color: string | null;
  description: string | null;
  standings: RawDbStanding[];
}

/**
 * Fetch all published articles with fallback to demo data
 */
export async function getDynamicPublishedArticles(options?: {
  categoryId?: string;
  limit?: number;
}): Promise<Article[]> {
  if (isConfiguredSupabase()) {
    try {
      const supabase = createPublicSupabaseClient();
      let query = supabase
        .from('articles')
        .select(`
          id,
          slug,
          title,
          excerpt,
          content,
          featured_image_url,
          image_caption,
          read_time_minutes,
          is_featured,
          is_trending,
          published_at,
          categories (name),
          conferences (short_name),
          profiles (full_name, role, avatar_url)
        `)
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const rawArticles = data as unknown as RawDbArticle[];
        return rawArticles.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          category: (item.categories?.name as Article['category']) || 'Breaking',
          conference: item.conferences?.short_name || 'National',
          author: {
            name: item.profiles?.full_name || 'Staff Analyst',
            role: item.profiles?.role === 'superadmin' ? 'Editor-in-Chief' : 'Staff Writer',
            avatar: item.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          },
          publishedAt: item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
          readTime: `${item.read_time_minutes || 4} min read`,
          imageUrl: item.featured_image_url || 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=1200',
          imageCaption: item.image_caption || undefined,
          featured: item.is_featured,
          trending: item.is_trending,
          tags: ['FCS', 'Football'],
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch articles fell back to verified fixtures:', e);
    }
  }

  let result = ARTICLES_DATA;
  if (options?.limit) {
    result = result.slice(0, options.limit);
  }
  return result;
}

/**
 * Fetch a single article by slug
 */
export async function getDynamicArticleBySlug(slug: string): Promise<Article | null> {
  if (isConfiguredSupabase()) {
    try {
      const supabase = createPublicSupabaseClient();
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          slug,
          title,
          excerpt,
          content,
          featured_image_url,
          image_caption,
          read_time_minutes,
          is_featured,
          is_trending,
          published_at,
          categories (name),
          conferences (short_name),
          profiles (full_name, role, avatar_url)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .single();

      if (!error && data) {
        const item = data as unknown as RawDbArticle;
        return {
          id: item.id,
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          category: (item.categories?.name as Article['category']) || 'Breaking',
          conference: item.conferences?.short_name || 'National',
          author: {
            name: item.profiles?.full_name || 'Staff Analyst',
            role: item.profiles?.role === 'superadmin' ? 'Editor-in-Chief' : 'Staff Writer',
            avatar: item.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          },
          publishedAt: item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
          readTime: `${item.read_time_minutes || 4} min read`,
          imageUrl: item.featured_image_url || 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=1200',
          imageCaption: item.image_caption || undefined,
          featured: item.is_featured,
          trending: item.is_trending,
          tags: ['FCS', 'Subdivision'],
        };
      }
    } catch (e) {
      console.warn('Supabase fetch article by slug fell back to fixtures:', e);
    }
  }

  return ARTICLES_DATA.find((a) => a.slug === slug) || null;
}

/**
 * Fetch Top 25 Rankings
 */
export async function getDynamicTop25Rankings(): Promise<TeamRanking[]> {
  if (isConfiguredSupabase()) {
    try {
      const supabase = createPublicSupabaseClient();
      const { data: edition } = await supabase
        .from('ranking_editions')
        .select(`
          id,
          ranking_entries (
            rank,
            previous_rank,
            first_place_votes,
            points,
            trend,
            teams (
              name,
              mascot,
              primary_color,
              conferences (short_name)
            )
          )
        `)
        .eq('status', 'published')
        .order('ranking_date', { ascending: false })
        .limit(1)
        .single();

      if (edition && edition.ranking_entries && edition.ranking_entries.length > 0) {
        const rawEntries = edition.ranking_entries as unknown as RawDbRankingEntry[];
        return rawEntries
          .sort((a, b) => a.rank - b.rank)
          .map((entry) => ({
            rank: entry.rank,
            previousRank: entry.previous_rank || entry.rank,
            team: entry.teams?.name || 'Unknown Team',
            mascot: entry.teams?.mascot || 'Squad',
            record: '10-1',
            conference: entry.teams?.conferences?.short_name || 'Independent',
            points: entry.points,
            firstPlaceVotes: entry.first_place_votes || undefined,
            trend: entry.trend,
            logoColor: entry.teams?.primary_color || '#FFD400',
          }));
      }
    } catch (e) {
      console.warn('Supabase fetch rankings fell back to fixtures:', e);
    }
  }

  return TOP_25_RANKINGS;
}

/**
 * Fetch Conferences and Standings
 */
export async function getDynamicConferences(): Promise<ConferenceInfo[]> {
  if (isConfiguredSupabase()) {
    try {
      const supabase = createPublicSupabaseClient();
      const { data, error } = await supabase
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
            conference_wins,
            conference_losses,
            overall_wins,
            overall_losses,
            home_record,
            away_record,
            streak,
            position_rank,
            teams (name, mascot)
          )
        `)
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        const rawConfs = data as unknown as RawDbConference[];
        return rawConfs.map((conf) => ({
          id: conf.code,
          name: conf.name,
          shortName: conf.short_name,
          hq: conf.hq_location || 'USA',
          founded: String(conf.founded_year || 1980),
          teamsCount: conf.standings?.length || 8,
          currentChampion: 'Defending Champ',
          bannerColor: conf.banner_color || '#FFD400',
          description: conf.description || '',
          standings: (conf.standings || [])
            .sort((a, b) => a.position_rank - b.position_rank)
            .map((s) => ({
              team: s.teams?.name || 'Team',
              mascot: s.teams?.mascot || 'Squad',
              confRecord: `${s.conference_wins}-${s.conference_losses}`,
              overallRecord: `${s.overall_wins}-${s.overall_losses}`,
              streak: s.streak || 'W1',
              homeRecord: s.home_record || '0-0',
              awayRecord: s.away_record || '0-0',
            })),
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch conferences fell back to fixtures:', e);
    }
  }

  return CONFERENCES_DATA;
}

/**
 * Fetch Playoff Projections & Matchups
 */
export async function getDynamicPlayoffs(): Promise<{
  projections: PlayoffProjection[];
  matchups: PlayoffMatchup[];
}> {
  return {
    projections: PLAYOFF_PROJECTIONS,
    matchups: PLAYOFF_MATCHUPS,
  };
}

/**
 * Live Dashboard Statistics for Admin
 */
export async function getAdminDashboardStats() {
  if (isConfiguredSupabase()) {
    try {
      const supabase = createPublicSupabaseClient();
      const [
        { count: publishedArticlesCount },
        { count: draftsCount },
        { count: teamsCount },
        { count: conferencesCount },
        { data: latestPoll },
        { data: latestPlayoffs },
      ] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('teams').select('*', { count: 'exact', head: true }),
        supabase.from('conferences').select('*', { count: 'exact', head: true }),
        supabase.from('ranking_editions').select('edition_title, ranking_date').order('ranking_date', { ascending: false }).limit(1).single(),
        supabase.from('playoff_editions').select('title, edition_date').order('edition_date', { ascending: false }).limit(1).single(),
      ]);

      return {
        publishedArticles: publishedArticlesCount ?? 6,
        draftArticles: draftsCount ?? 2,
        totalTeams: teamsCount ?? 128,
        totalConferences: conferencesCount ?? 14,
        latestRankings: latestPoll?.edition_title || 'Week 12 Media Poll',
        latestPlayoffs: latestPlayoffs?.title || 'Road to Frisco - Week 12 Projection',
      };
    } catch (e) {
      console.warn('Supabase admin stats fell back to baseline statistics:', e);
    }
  }

  return {
    publishedArticles: 6,
    draftArticles: 2,
    totalTeams: 128,
    totalConferences: 14,
    latestRankings: 'Week 12 National Media Poll',
    latestPlayoffs: 'Road to Frisco - 24-Team Projection',
  };
}
