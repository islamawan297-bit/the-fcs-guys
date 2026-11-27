'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  getAdminArticlesAction, 
  deleteArticleAction, 
  toggleArticleStatusAction 
} from './actions';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Loader2, 
  FileText, 
  ArrowUpRight, 
  RotateCcw
} from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  category_id: string;
  categories: { id: string; name: string; slug: string } | null;
  conferences: { id: string; name: string; short_name: string } | null;
  profiles: { id: string; full_name: string; role: string; avatar_url: string | null } | null;
}

export default function ArticlesCMSPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Fetch articles from Supabase via server action
  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setFeedbackMessage(null);
    try {
      const res = await getAdminArticlesAction({
        status: statusFilter,
        search: search.trim() || undefined,
      });

      if (res.success && res.data) {
        setArticles(res.data as ArticleItem[]);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.error || 'Failed to load articles from Supabase.',
        });
      }
    } catch (err: unknown) {
      console.error('Error loading articles:', err);
      setFeedbackMessage({
        type: 'error',
        text: 'An unexpected error occurred while fetching articles.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await getAdminArticlesAction({
          status: statusFilter,
          search: search.trim() || undefined,
        });

        if (!ignore) {
          if (res.success && res.data) {
            setArticles(res.data as ArticleItem[]);
          } else {
            setFeedbackMessage({
              type: 'error',
              text: res.error || 'Failed to load articles from Supabase.',
            });
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          console.error('Error loading articles:', err);
          setFeedbackMessage({
            type: 'error',
            text: 'An unexpected error occurred while fetching articles.',
          });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [statusFilter, search]);

  // Handle Publish / Unpublish Toggle
  const handleToggleStatus = async (item: ArticleItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const actionLabel = newStatus === 'published' ? 'publish' : 'unpublish';

    if (!confirm(`Are you sure you want to ${actionLabel} "${item.title}"?`)) {
      return;
    }

    setActionInProgress(item.id);
    try {
      const res = await toggleArticleStatusAction(item.id, newStatus);
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Article "${item.title}" successfully ${newStatus === 'published' ? 'published to live site' : 'moved to drafts'}.`,
        });
        await loadArticles();
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.error || `Failed to ${actionLabel} article.`,
        });
      }
    } catch (err: unknown) {
      console.error(`Error toggling status:`, err);
      setFeedbackMessage({
        type: 'error',
        text: `Error updating article publication status.`,
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`PERMANENT DELETE: Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setActionInProgress(id);
    try {
      const res = await deleteArticleAction(id);
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Article "${title}" permanently deleted from Supabase.`,
        });
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.error || 'Failed to delete article. Verify you have superadmin/editor privileges.',
        });
      }
    } catch (err: unknown) {
      console.error('Error deleting article:', err);
      setFeedbackMessage({
        type: 'error',
        text: 'An error occurred while deleting the article.',
      });
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282828] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Article CMS & Publications
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Manage live reporting, editorial breakdowns, drafts, and featured articles in Supabase.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="px-4 py-2.5 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] flex items-center shadow-lg transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Create Article
        </Link>
      </div>

      {/* Notifications */}
      {feedbackMessage && (
        <div
          className={`p-3 rounded-lg flex items-center justify-between space-x-2 text-xs font-semibold ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
          <input
            type="text"
            placeholder="Search database articles by headline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#181818] border border-[#282828] rounded-lg text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#FFD400]"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'published', 'draft', 'review', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                statusFilter === status
                  ? 'bg-[#FFD400] text-[#080808]'
                  : 'bg-[#181818] text-[#888888] hover:text-white border border-[#282828]'
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={() => loadArticles()}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#181818] border border-[#282828] text-[#888888] hover:text-white transition-colors"
            title="Refresh database"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#181818] border border-[#282828] rounded-xl overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-[#FFD400] animate-spin" />
            <p className="text-xs font-bold uppercase text-[#888888] tracking-wider">
              Querying live Supabase articles...
            </p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#222222] flex items-center justify-center mx-auto text-[#666666]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase text-white tracking-wide">
              No Articles Found in Database
            </h3>
            <p className="text-xs text-[#777777] max-w-sm mx-auto">
              {search || statusFilter !== 'all'
                ? 'No stories match your current search or filter criteria.'
                : 'Your Supabase database currently contains zero articles. Click "Create Article" to write your first live story.'}
            </p>
            <div className="pt-2">
              <Link
                href="/admin/articles/new"
                className="inline-flex items-center px-4 py-2 bg-[#FFD400] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#E5BE00] transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Write First Story
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#282828] bg-[#141414] text-[#888888] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {articles.map((item) => {
                  const isBusy = actionInProgress === item.id;
                  const formattedDate = item.published_at
                    ? new Date(item.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });

                  return (
                    <tr key={item.id} className="hover:bg-[#202020] transition-colors">
                      {/* Title & Slug */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white max-w-sm sm:max-w-md truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#777777] flex items-center space-x-2 mt-0.5">
                          <span>By {item.profiles?.full_name || 'Staff Author'}</span>
                          <span>&bull;</span>
                          <span className="font-mono text-[#555555]">/news/{item.slug}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#222222] text-[#B5B5B5] font-semibold text-[10px]">
                          {item.categories?.name || 'General'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            item.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : item.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : item.status === 'review'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-[#888888] whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* View Live */}
                          {item.status === 'published' && (
                            <Link
                              href={`/news/${item.slug}`}
                              target="_blank"
                              className="p-1.5 rounded hover:bg-[#282828] text-[#B5B5B5] hover:text-[#FFD400] transition-colors"
                              title="View Live Article"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </Link>
                          )}

                          {/* Quick Publish / Unpublish */}
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleStatus(item)}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              item.status === 'published'
                                ? 'bg-[#252525] hover:bg-[#333333] text-[#B5B5B5]'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                            }`}
                            title={item.status === 'published' ? 'Unpublish to Draft' : 'Publish to Live Site'}
                          >
                            {isBusy ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : item.status === 'published' ? (
                              'Unpublish'
                            ) : (
                              'Publish'
                            )}
                          </button>

                          {/* Edit */}
                          <Link
                            href={`/admin/articles/${item.id}`}
                            className="p-1.5 rounded hover:bg-[#282828] text-[#B5B5B5] hover:text-white transition-colors"
                            title="Edit Article"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 rounded hover:bg-rose-500/20 text-[#888888] hover:text-rose-400 transition-colors disabled:opacity-40"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
