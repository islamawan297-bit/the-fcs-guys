'use client';

import React, { useState } from 'react';
import { Article } from '@/types';
import { ArticleCard } from '@/components/ArticleCard';
import { Newsletter } from '@/components/Newsletter';
import { Filter, Flame, ChevronLeft, ChevronRight, Newspaper, Search } from 'lucide-react';

const CATEGORIES = ['All', 'Breaking', 'Rankings', 'Analysis', 'Playoffs', 'Recruiting', 'Game Recap'];

interface NewsPageClientProps {
  initialArticles: Article[];
}

export function NewsPageClient({ initialArticles }: NewsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter articles by category and search
  const filteredArticles = initialArticles.filter((a) => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const featuredArticle = initialArticles.find((a) => a.featured) || initialArticles[0];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Header Banner */}
      <div className="border-b border-[#282828] pb-6 sm:pb-8">
        <div className="flex items-center space-x-2 text-[#FFD400] text-xs font-bold uppercase tracking-wider mb-2">
          <Newspaper className="w-4 h-4" />
          <span>FCS National Newsroom</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          News & Trench Analysis
        </h1>
        <p className="text-[#B5B5B5] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Deep dives, verified reporting, coaching carousel updates, and film breakdowns from all 14 NCAA Division I FCS conferences.
        </p>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <Filter className="w-4 h-4 text-[#777777] shrink-0 mr-1" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#FFD400] text-[#080808] shadow-sm'
                    : 'bg-[#181818] text-[#B5B5B5] hover:text-white hover:bg-[#252525] border border-[#282828]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#666666]" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-[#181818] border border-[#282828] rounded-full text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#FFD400]"
            />
          </div>
        </div>
      </div>

      {/* Featured Story at top of News Page if 'All' is selected and no search */}
      {selectedCategory === 'All' && !searchQuery && featuredArticle && (
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-[#FFD400]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#FFD400]">
              Lead Story
            </h2>
          </div>
          <ArticleCard article={featuredArticle} variant="featured" />
        </section>
      )}

      {/* Grid of Articles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">
            {selectedCategory === 'All' ? 'Latest Reports & Wire' : `${selectedCategory} Coverage`}
            <span className="text-xs text-[#777777] font-normal ml-2">
              ({filteredArticles.length} {filteredArticles.length === 1 ? 'story' : 'stories'})
            </span>
          </h2>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-[#181818] border border-[#282828] rounded-xl p-6">
            <p className="text-sm font-bold uppercase text-white tracking-wider">
              No matching articles found
            </p>
            <p className="text-xs text-[#888888] mt-1">
              Try adjusting your search query or selecting a different category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-3 pt-6 border-t border-[#282828]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-[#181818] border border-[#282828] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#222222] transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#888888] font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-[#181818] border border-[#282828] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#222222] transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Signup */}
      <Newsletter />
    </div>
  );
}
