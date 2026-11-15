import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireStaffSession } from '@/services/auth.service';
import { ArticleSchema } from '@/lib/validations';
import { z } from 'zod';

export async function getPublishedArticles(options?: {
  limit?: number;
  offset?: number;
  categoryId?: string;
  conferenceId?: string;
}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image_url,
      image_caption,
      read_time_minutes,
      published_at,
      is_featured,
      is_trending,
      categories (id, name, slug),
      conferences (id, name, short_name, code),
      profiles (id, full_name, role, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }
  if (options?.conferenceId) {
    query = query.eq('conference_id', options.conferenceId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      categories (*),
      conferences (*),
      profiles (id, full_name, role, avatar_url, bio),
      article_tags (
        tags (id, name, slug)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

export async function createArticle(input: z.infer<typeof ArticleSchema>) {
  // Enforce staff session & permission verification on server
  const { user } = await requireStaffSession();
  const validated = ArticleSchema.parse(input);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...validated,
      author_id: user.id,
      published_at: validated.status === 'published' ? (validated.published_at || new Date().toISOString()) : null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateArticle(articleId: string, input: Partial<z.infer<typeof ArticleSchema>>) {
  await requireStaffSession();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('articles')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', articleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

