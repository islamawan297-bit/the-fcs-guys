'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Breaking');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      setError('Please provide title, slug, and article content.');
      return;
    }

    setMessage('Article successfully saved and registered.');
    setTimeout(() => {
      router.push('/admin/articles');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#282828] pb-4">
        <div>
          <Link
            href="/admin/articles"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#B5B5B5] hover:text-[#FFD400] mb-1"
          >
            <ChevronLeft className="w-4 h-4 mr-0.5" /> Back to Articles
          </Link>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">
            Create Editorial Story
          </h1>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#B5B5B5] uppercase mb-1">
                Article Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Inside the Dakota Marker Film Room..."
                className="w-full px-4 py-2.5 bg-[#181818] border border-[#282828] rounded-lg text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#FFD400]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B5B5B5] uppercase mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 bg-[#141414] border border-[#282828] rounded-lg text-xs font-mono text-[#FFD400] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B5B5B5] uppercase mb-1">
                Short Excerpt / Lead Summary
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="One or two sentences highlighting the core scoop or angle..."
                className="w-full px-4 py-2 bg-[#181818] border border-[#282828] rounded-lg text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#FFD400]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B5B5B5] uppercase mb-1">
                Article Body Content (Markdown / HTML) *
              </label>
              <textarea
                rows={10}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or paste editorial body text here..."
                className="w-full px-4 py-3 bg-[#181818] border border-[#282828] rounded-lg text-sm text-white font-mono placeholder-[#555555] focus:outline-none focus:border-[#FFD400]"
              />
            </div>
          </div>

          {/* Publishing Settings Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#282828] pb-2">
                Publishing Details
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#282828] rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD400]"
                >
                  <option value="Breaking">Breaking</option>
                  <option value="Rankings">Rankings</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Playoffs">Playoffs</option>
                  <option value="Recruiting">Recruiting</option>
                  <option value="Game Recap">Game Recap</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#282828] rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD400]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Private)</option>
                  <option value="review">Review Queue</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-[#222222]">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FFD400] bg-[#111111] border-[#333333]"
                />
                <label htmlFor="featured" className="text-xs font-bold text-white uppercase">
                  Mark as Lead Featured
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] uppercase mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#111111] border border-[#282828] rounded-lg text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save & Register</span>
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
