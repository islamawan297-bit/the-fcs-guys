'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';
import { ArticleSchema } from '@/lib/validations';
import { 
  createNewArticleAction, 
  updateArticleAction, 
  getArticleByIdAction 
} from '@/app/admin/articles/actions';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { 
  Save, 
  Send, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Clock,
  Eye
} from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ConferenceOption {
  id: string;
  name: string;
  short_name: string;
}

interface FetchedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  conference_id: string | null;
  featured_image_url: string | null;
  image_caption: string | null;
  read_time_minutes: number;
  is_featured: boolean;
  is_trending: boolean;
  status: 'draft' | 'review' | 'published' | 'archived';
}

interface ArticleEditorFormProps {
  articleId?: string;
}

export function ArticleEditorForm({ articleId }: ArticleEditorFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(articleId);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [conferenceId, setConferenceId] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [readTime, setReadTime] = useState(4);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'draft' | 'review' | 'published' | 'archived'>('draft');

  // Dynamic dropdown data
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [conferences, setConferences] = useState<ConferenceOption[]>([]);

  // UI state
  const [isLoadingArticle, setIsLoadingArticle] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<'draft' | 'published' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Fetch Categories and Conferences on Mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const supabase = createClient();

        // Load Categories
        const { data: catData } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('display_order', { ascending: true });

        if (catData && catData.length > 0) {
          setCategories(catData);
          if (!categoryId && !isEditMode) {
            setCategoryId(catData[0].id);
          }
        }

        // Load Conferences
        const { data: confData } = await supabase
          .from('conferences')
          .select('id, name, short_name')
          .order('name', { ascending: true });

        if (confData) {
          setConferences(confData);
        }
      } catch (err) {
        console.error('Failed to load categories/conferences:', err);
      }
    }

    loadMeta();
  }, [categoryId, isEditMode]);

  // 2. If in Edit Mode, fetch article details
  useEffect(() => {
    if (!articleId) return;

    async function loadArticle() {
      setIsLoadingArticle(true);
      setErrorMessage(null);
      const res = await getArticleByIdAction(articleId!);
      if (!res.success || !res.data) {
        setErrorMessage(res.error || 'Failed to load existing article.');
        setIsLoadingArticle(false);
        return;
      }

      const a = res.data as unknown as FetchedArticle;
      setTitle(a.title || '');
      setSlug(a.slug || '');
      setIsSlugManual(true);
      setExcerpt(a.excerpt || '');
      setContent(a.content || '');
      setCategoryId(a.category_id || '');
      setConferenceId(a.conference_id || '');
      setImageUrl(a.featured_image_url || null);
      setImageCaption(a.image_caption || '');
      setReadTime(a.read_time_minutes || 4);
      setIsFeatured(Boolean(a.is_featured));
      setIsTrending(Boolean(a.is_trending));
      setCurrentStatus(a.status || 'draft');
      setIsLoadingArticle(false);
    }

    loadArticle();
  }, [articleId]);

  // Auto-slug generator
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  // Auto-calculate read time from content words (~200 words per minute)
  const handleContentChange = (val: string) => {
    setContent(val);
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    const estimated = Math.max(1, Math.ceil(words / 200));
    setReadTime(estimated);
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManual(true);
    const sanitized = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '');
    setSlug(sanitized);
  };

  // 3. Submit Handler
  const handleSubmit = async (targetStatus: 'draft' | 'published') => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic client validation
    if (!title.trim() || title.trim().length < 5) {
      setErrorMessage('Article headline must be at least 5 characters long.');
      return;
    }
    if (!slug.trim() || slug.trim().length < 3) {
      setErrorMessage('URL slug must be at least 3 characters.');
      return;
    }
    if (!excerpt.trim() || excerpt.trim().length < 10) {
      setErrorMessage('Lead excerpt must be at least 10 characters.');
      return;
    }
    if (!content.trim() || content.trim().length < 20) {
      setErrorMessage('Article body content must be at least 20 characters.');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Please select a valid story category.');
      return;
    }

    setIsSubmitting(true);
    setSubmittingAction(targetStatus);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category_id: categoryId,
        conference_id: conferenceId ? conferenceId : null,
        featured_image_url: imageUrl || null,
        image_caption: imageCaption.trim() ? imageCaption.trim() : null,
        read_time_minutes: Number(readTime) || 4,
        status: targetStatus,
        is_featured: isFeatured,
        is_trending: isTrending,
        published_at: targetStatus === 'published' ? new Date().toISOString() : null,
      };

      if (isEditMode && articleId) {
        const res = await updateArticleAction(articleId, payload);
        if (!res.success) {
          throw new Error(res.error || 'Failed to update article.');
        }
        setSuccessMessage(
          targetStatus === 'published'
            ? 'Article successfully published to live website!'
            : 'Changes saved in draft mode.'
        );
      } else {
        const res = await createNewArticleAction(payload as unknown as z.infer<typeof ArticleSchema>);
        if (!res.success) {
          throw new Error(res.error || 'Failed to create article.');
        }
        setSuccessMessage(
          targetStatus === 'published'
            ? 'Article registered and published to live website!'
            : 'Draft article successfully created in database.'
        );
      }

      // Smooth redirect
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1500);
    } catch (err: unknown) {
      console.error('Submission error:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred while saving.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };

  if (isLoadingArticle) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-8 h-8 text-[#FFD400] animate-spin" />
        <p className="text-xs font-bold uppercase text-[#888888] tracking-wider">
          Loading Article Data from Supabase...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282828] pb-4">
        <div>
          <Link
            href="/admin/articles"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#B5B5B5] hover:text-[#FFD400] mb-1"
          >
            <ChevronLeft className="w-4 h-4 mr-0.5" /> Back to Articles
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            {isEditMode ? 'Edit Editorial Story' : 'Create Editorial Story'}
          </h1>
        </div>

        {isEditMode && currentStatus === 'published' && (
          <Link
            href={`/news/${slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-lg bg-[#202020] hover:bg-[#282828] border border-[#333333] text-white text-xs font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
          >
            <Eye className="w-4 h-4 text-[#FFD400]" />
            <span>View Live Article</span>
          </Link>
        )}
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Layout */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Headline */}
            <div>
              <label className="block text-xs font-bold text-[#B5B5B5] uppercase mb-1">
                Article Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Inside the Dakota Marker Film Room: How NDSU Exploited Cover 3"
                className="w-full px-4 py-2.5 bg-[#181818] border border-[#282828] rounded-lg text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#FFD400]"
              />
            </div>

            {/* URL Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#B5B5B5] uppercase">
                  URL Slug *
                </label>
                <span className="text-[10px] text-[#777777] font-mono">
                  /news/{slug || '...'}
                </span>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="inside-the-dakota-marker-film-room"
                className="w-full px-4 py-2 bg-[#141414] border border-[#282828] rounded-lg text-xs font-mono text-[#FFD400] focus:outline-none focus:border-[#FFD400]"
              />
            </div>

            {/* Lead Excerpt */}
            <div>
              <label className="block text-xs font-bold text-[#B5B5B5] uppercase mb-1">
                Short Excerpt / Lead Summary *
              </label>
              <textarea
                rows={2}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A high-level 1-2 sentence teaser that hooks the reader and feeds Google SEO snippets..."
                className="w-full px-4 py-2 bg-[#181818] border border-[#282828] rounded-lg text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#FFD400]"
              />
            </div>

            {/* Article Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#B5B5B5] uppercase">
                  Article Body Content (Markdown Supported) *
                </label>
                <span className="text-[11px] text-[#777777]">
                  {content.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={14}
                required
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write your editorial analysis, film breakdown, quotes, or story narrative here..."
                className="w-full px-4 py-3 bg-[#181818] border border-[#282828] rounded-lg text-sm text-white font-mono placeholder-[#555555] focus:outline-none focus:border-[#FFD400] leading-relaxed"
              />
            </div>

            {/* Featured Media Upload Box */}
            <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#282828] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
                  <span>Featured Editorial Banner</span>
                </h3>
                <span className="text-[10px] text-[#888888] uppercase font-bold">
                  Storage Bucket: editorial-media
                </span>
              </div>

              <MediaUploader
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
              />

              <div>
                <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1">
                  Image Caption / Photo Credit (Optional)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. Photo courtesy of Montana State Athletics / Joe Smith"
                  className="w-full px-3 py-2 bg-[#121212] border border-[#282828] rounded-lg text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#FFD400]"
                />
              </div>
            </div>
          </div>

          {/* Publishing Settings Sidebar (1 col) */}
          <div className="space-y-5">
            <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#282828] pb-2">
                Publishing Details
              </h3>

              {/* Category Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#282828] rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD400]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conference Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1">
                  Conference Focus (Optional)
                </label>
                <select
                  value={conferenceId}
                  onChange={(e) => setConferenceId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#282828] rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD400]"
                >
                  <option value="">National / Multi-Conference</option>
                  {conferences.map((conf) => (
                    <option key={conf.id} value={conf.id}>
                      {conf.name} ({conf.short_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#FFD400]" />
                  <span>Read Time (Minutes)</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={readTime}
                  onChange={(e) => setReadTime(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#282828] rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              {/* Editorial Flags */}
              <div className="pt-3 border-t border-[#222222] space-y-2.5">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FFD400] bg-[#111111] border-[#333333] focus:ring-0"
                  />
                  <label htmlFor="featured" className="text-xs font-bold text-white uppercase cursor-pointer">
                    Mark as Lead Featured Story
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="trending"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FFD400] bg-[#111111] border-[#333333] focus:ring-0"
                  />
                  <label htmlFor="trending" className="text-xs font-bold text-white uppercase cursor-pointer">
                    Mark as Trending Story
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#222222] space-y-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit('published')}
                  className="w-full py-2.5 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] flex items-center justify-center space-x-1.5 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isSubmitting && submittingAction === 'published' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing Story...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Story Now</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit('draft')}
                  className="w-full py-2 rounded-lg bg-[#252525] hover:bg-[#303030] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors border border-[#383838] disabled:opacity-50"
                >
                  {isSubmitting && submittingAction === 'draft' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Draft...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save as Draft</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
