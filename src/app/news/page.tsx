'use client';

import React, { useState } from 'react';
import { ARTICLES_DATA } from '@/data/fcs-data';
import { ArticleCard } from '@/components/ArticleCard';
import { Newsletter } from '@/components/Newsletter';
import { Filter, Flame, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';

const CATEGORIES = ['All', 'Breaking', 'Rankings', 'Analysis', 'Playoffs', 'Recruiting', 'Game Recap'];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredArticles = selectedCategory === 'All'
    ? ARTICLES_DATA
    : ARTICLES_DATA.filter((a) => a.category === selectedCategory);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-6 pb-2 no-scrollbar">
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
      </div>

      {/* Featured Story at top of News Page if 'All' is selected */}
      {selectedCategory === 'All' && ARTICLES_DATA.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-[#FFD400]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#FFD400]">
              Lead Story
            </h2>
          </div>
          <ArticleCard article={ARTICLES_DATA[0]} variant="featured" />
        </section>
      )}

      {/* Grid of Articles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">
            {selectedCategory === 'All' ? 'Latest Reports' : `${selectedCategory} Stories`}
            <span className="text-xs text-[#777777] font-normal normal-case ml-2">
              ({filteredArticles.length} articles)
            </span>
          </h2>
        </div>

        {currentArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        ) : (
          <div className="bg-[#181818] border border-[#282828] rounded-xl p-12 text-center text-[#888888]">
            <p>No articles found for the selected category.</p>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="flex items-center justify-center space-x-2 pt-8 border-t border-[#282828]">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-[#181818] border border-[#282828] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#252525]"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-1.5 px-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === num
                    ? 'bg-[#FFD400] text-[#080808]'
                    : 'bg-[#181818] text-[#B5B5B5] hover:text-white border border-[#282828]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-[#181818] border border-[#282828] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#252525]"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}

