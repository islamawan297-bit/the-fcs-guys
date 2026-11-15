'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ARTICLES_DATA } from '@/data/fcs-data';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle2
} from 'lucide-react';

export default function ArticlesCMSPage() {
  const [articles, setArticles] = useState(ARTICLES_DATA);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const filtered = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter((a) => a.id !== id));
      setMessage('Article deleted from database.');
      setTimeout(() => setMessage(''), 3000);
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
            Manage editorial reporting, film breakdowns, drafts, and featured homepage articles.
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

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
          <input
            type="text"
            placeholder="Search stories by headline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#181818] border border-[#282828] rounded-lg text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#FFD400]"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#181818] border border-[#282828] rounded-xl overflow-hidden shadow-lg">
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
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#202020] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white max-w-sm sm:max-w-md truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#777777] flex items-center space-x-2 mt-0.5">
                      <span>By {item.author.name}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-[#555555]">/{item.slug}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#222222] text-[#B5B5B5] font-semibold text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase">
                      Published
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#888888]">
                    {item.publishedAt}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/news/${item.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-[#282828] text-[#B5B5B5] hover:text-white"
                        title="View Live"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded hover:bg-rose-500/20 text-rose-400"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
