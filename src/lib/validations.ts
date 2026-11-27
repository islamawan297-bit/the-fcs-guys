import { z } from 'zod';

export const ArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lower-case alphanumeric with dashes'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category_id: z.string().uuid('Please select a valid category'),
  conference_id: z.string().uuid().optional().nullable().or(z.literal('')).transform(val => val === '' ? null : val),
  featured_image_url: z.string().url('Invalid image URL format').optional().nullable().or(z.literal('')).transform(val => val === '' ? null : val),
  image_caption: z.string().max(250).optional().nullable().or(z.literal('')).transform(val => val === '' ? null : val),
  read_time_minutes: z.number().int().min(1).max(60).default(4),
  status: z.enum(['draft', 'review', 'published', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  is_trending: z.boolean().default(false),
  published_at: z.string().datetime().optional().nullable().or(z.literal('')).transform(val => val === '' ? null : val),
});

export const CategorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().max(250).optional().nullable(),
  display_order: z.number().int().default(0),
});

export const ConferenceSchema = z.object({
  code: z.string().min(2).max(20).regex(/^[a-z0-9-]+$/),
  name: z.string().min(3).max(100),
  short_name: z.string().min(2).max(20),
  hq_location: z.string().max(100).optional().nullable(),
  founded_year: z.number().int().min(1850).max(2030).optional().nullable(),
  banner_color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).default('#FFD400'),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export const TeamSchema = z.object({
  name: z.string().min(2).max(100),
  mascot: z.string().min(2).max(50),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  current_conference_id: z.string().uuid().optional().nullable(),
  primary_color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).default('#FFD400'),
  secondary_color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).default('#080808'),
  logo_url: z.string().url().optional().nullable(),
});

export const StandingUpdateSchema = z.object({
  season_id: z.string().uuid(),
  conference_id: z.string().uuid(),
  team_id: z.string().uuid(),
  conference_wins: z.number().int().min(0),
  conference_losses: z.number().int().min(0),
  overall_wins: z.number().int().min(0),
  overall_losses: z.number().int().min(0),
  home_record: z.string().regex(/^\d+-\d+$/).default('0-0'),
  away_record: z.string().regex(/^\d+-\d+$/).default('0-0'),
  streak: z.string().max(10).default('-'),
  position_rank: z.number().int().min(1),
  clinched_postseason: z.boolean().default(false),
});

export const RankingEntryInputSchema = z.object({
  team_id: z.string().uuid(),
  rank: z.number().int().min(1).max(25),
  previous_rank: z.number().int().min(1).max(25).optional().nullable(),
  first_place_votes: z.number().int().min(0).default(0),
  points: z.number().int().min(0).default(0),
  trend: z.enum(['up', 'down', 'same']).default('same'),
});

export const RankingEditionSchema = z.object({
  season_id: z.string().uuid(),
  week_number: z.number().int().min(0).max(20),
  edition_title: z.string().min(5).max(100),
  ranking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  total_voters: z.number().int().min(1).default(26),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  entries: z.array(RankingEntryInputSchema).length(25, 'Top 25 edition must contain exactly 25 ranked teams'),
});

export const MediaUploadValidationSchema = z.object({
  filename: z.string().min(1).max(200),
  file_size_bytes: z.number().int().max(5242880, 'Media file size cannot exceed 5MB'),
  mime_type: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  alt_text: z.string().min(3, 'Descriptive alt text is required for accessibility and editorial integrity').max(250),
  caption: z.string().max(250).optional().nullable(),
});

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

