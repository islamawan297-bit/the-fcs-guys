'use server';

import { 
  createArticle, 
  updateArticle, 
  deleteArticle, 
  toggleArticleStatus, 
  checkSlugAvailability, 
  getArticlesForAdmin,
  getArticleById
} from '@/services/articles.service';
import { ArticleSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function createNewArticleAction(input: z.infer<typeof ArticleSchema>): Promise<ActionResult> {
  try {
    const isAvailable = await checkSlugAvailability(input.slug);
    if (!isAvailable) {
      return { success: false, error: `The URL slug "${input.slug}" is already taken. Please choose another.` };
    }

    const created = await createArticle(input);
    revalidatePath('/news');
    revalidatePath('/');
    revalidatePath('/admin/articles');
    return { success: true, data: created };
  } catch (err: unknown) {
    console.error('Error creating article:', err);
    const message = err instanceof Error ? err.message : 'Failed to create article';
    return { success: false, error: message };
  }
}

export async function updateArticleAction(
  articleId: string, 
  input: Partial<z.infer<typeof ArticleSchema>>
): Promise<ActionResult> {
  try {
    if (input.slug) {
      const isAvailable = await checkSlugAvailability(input.slug, articleId);
      if (!isAvailable) {
        return { success: false, error: `The URL slug "${input.slug}" is already taken.` };
      }
    }

    const updated = await updateArticle(articleId, input);
    revalidatePath('/news');
    revalidatePath(`/news/${updated.slug}`);
    revalidatePath('/');
    revalidatePath('/admin/articles');
    return { success: true, data: updated };
  } catch (err: unknown) {
    console.error('Error updating article:', err);
    const message = err instanceof Error ? err.message : 'Failed to update article';
    return { success: false, error: message };
  }
}

export async function deleteArticleAction(articleId: string): Promise<ActionResult> {
  try {
    await deleteArticle(articleId);
    revalidatePath('/news');
    revalidatePath('/');
    revalidatePath('/admin/articles');
    return { success: true };
  } catch (err: unknown) {
    console.error('Error deleting article:', err);
    const message = err instanceof Error ? err.message : 'Failed to delete article';
    return { success: false, error: message };
  }
}

export async function toggleArticleStatusAction(
  articleId: string, 
  newStatus: 'published' | 'draft'
): Promise<ActionResult> {
  try {
    const updated = await toggleArticleStatus(articleId, newStatus);
    revalidatePath('/news');
    revalidatePath(`/news/${updated.slug}`);
    revalidatePath('/');
    revalidatePath('/admin/articles');
    return { success: true, data: updated };
  } catch (err: unknown) {
    console.error('Error toggling article status:', err);
    const message = err instanceof Error ? err.message : 'Failed to change article status';
    return { success: false, error: message };
  }
}

export async function getAdminArticlesAction(options?: {
  status?: string;
  search?: string;
  categoryId?: string;
}): Promise<ActionResult> {
  try {
    const articles = await getArticlesForAdmin(options);
    return { success: true, data: articles };
  } catch (err: unknown) {
    console.error('Error fetching admin articles:', err);
    const message = err instanceof Error ? err.message : 'Failed to fetch articles';
    return { success: false, error: message };
  }
}

export async function getArticleByIdAction(id: string): Promise<ActionResult> {
  try {
    const article = await getArticleById(id);
    if (!article) {
      return { success: false, error: 'Article not found' };
    }
    return { success: true, data: article };
  } catch (err: unknown) {
    console.error('Error fetching article by ID:', err);
    const message = err instanceof Error ? err.message : 'Failed to fetch article';
    return { success: false, error: message };
  }
}
