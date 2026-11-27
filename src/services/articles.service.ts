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

export async function getArticlesForAdmin(options?: {
  status?: string;
  search?: string;
  categoryId?: string;
}) {
  await requireStaffSession();
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      featured_image_url,
      image_caption,
      read_time_minutes,
      status,
      is_featured,
      is_trending,
      published_at,
      created_at,
      updated_at,
      category_id,
      conference_id,
      categories (id, name, slug),
      conferences (id, name, short_name, code),
      profiles (id, full_name, role, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options?.categoryId && options.categoryId !== 'all') {
    query = query.eq('category_id', options.categoryId);
  }

  if (options?.search) {
    query = query.ilike('title', `%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getArticleById(id: string) {
  await requireStaffSession();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      featured_image_url,
      image_caption,
      read_time_minutes,
      status,
      is_featured,
      is_trending,
      published_at,
      created_at,
      updated_at,
      category_id,
      conference_id,
      categories (id, name, slug),
      conferences (id, name, short_name, code),
      profiles (id, full_name, role, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function checkSlugAvailability(slug: string, currentArticleId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('articles').select('id').eq('slug', slug);
  if (currentArticleId) {
    query = query.neq('id', currentArticleId);
  }
  const { data } = await query;
  return !data || data.length === 0;
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

  // If status is being set to published and published_at is not provided, set published_at to now()
  const payload: Record<string, unknown> = {
    ...input,
    updated_at: new Date().toISOString(),
  };

  if (input.status === 'published') {
    payload.published_at = input.published_at || new Date().toISOString();
  } else if (input.status === 'draft') {
    payload.published_at = null;
  }

  const { data, error } = await supabase
    .from('articles')
    .update(payload)
    .eq('id', articleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteArticle(articleId: string) {
  await requireStaffSession();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', articleId);

  if (error) throw error;
  return { success: true };
}

export async function toggleArticleStatus(articleId: string, newStatus: 'published' | 'draft') {
  await requireStaffSession();
  const supabase = await createServerSupabaseClient();

  const updateData: { status: string; published_at: string | null; updated_at: string } = {
    status: newStatus,
    published_at: newStatus === 'published' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', articleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

