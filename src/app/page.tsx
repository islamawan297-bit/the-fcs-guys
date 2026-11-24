'use cache';

import React from 'react';
import Link from 'next/link';
import {
  getDynamicPublishedArticles,
  getDynamicTop25Rankings,
  getDynamicConferences,
  getDynamicPlayoffs
} from '@/services/dynamic-content.service';
import { ArticleCard } from '@/components/ArticleCard';
import { RankingsTable } from '@/components/RankingsTable';
import { PlayoffPreview } from '@/components/PlayoffPreview';
import { Newsletter } from '@/components/Newsletter';
import { DynamicConferenceSidebar } from '@/components/DynamicConferenceSidebar';
import {
  Flame,
  Trophy,
  ChevronRight,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export default async function HomePage() {
  const [articles, top25Rankings, conferences, { projections, matchups }] = await Promise.all([
    getDynamicPublishedArticles(),
    getDynamicTop25Rankings(),
    getDynamicConferences(),
    getDynamicPlayoffs(),
  ]);

  const featuredArticle = articles.find(a => a.featured) || articles[0];
  const secondaryArticles = articles.filter(a => a.id !== featuredArticle?.id).slice(0, 4);
  const latestArticles = articles.filter(a => a.id !== featuredArticle?.id && !secondaryArticles.some(s => s.id === a.id)).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16">

      {/* 1. HERO / MAIN FEATURED SECTION */}
      {featuredArticle && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400]" />
              <h1 className="text-sm font-black uppercase tracking-widest text-[#FFD400]">
                Featured Editorial
              </h1>
            </div>
            <span className="text-xs text-[#888888] font-medium hidden sm:inline">
              FCS Championship Subdivision Spotlight
            </span>
          </div>

          <ArticleCard article={featuredArticle} variant="featured" />
        </section>
      )}

      {/* 2. SECONDARY STORIES TRIO */}
      {secondaryArticles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase text-white tracking-tight flex items-center">
              <Flame className="w-5 h-5 mr-2 text-[#FFD400]" />
              Trending Stories
            </h2>
            <Link
              href="/news"
              className="text-xs font-bold uppercase tracking-wider text-[#FFD400] hover:text-[#E5BE00] flex items-center transition-colors"
            >
              All Stories <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* 3. RANKINGS & STANDINGS SPLIT SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Top 25 Poll Snapshot */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-[#FFD400]" />
              <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight">
                FCS Top 25 Media Poll (Week 12)
              </h2>
            </div>
            <Link
              href="/top-25"
              className="text-xs font-bold text-[#FFD400] hover:underline"
            >
              Full Rankings (1-25) &rarr;
            </Link>
          </div>

          <RankingsTable rankings={top25Rankings} limit={10} compact={false} />
        </div>

        {/* Right 1 Col: Dynamic Conference Standings Sidebar with Auto-Rotation */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-[#282828] pb-3">
            <TrendingUp className="w-5 h-5 text-[#FFD400]" />
            <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight">
              Conference Race
            </h2>
          </div>

          <DynamicConferenceSidebar conferences={conferences} />

          {/* Quick Conference Jump Links */}
          <div className="bg-[#181818] border border-[#282828] rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#888888] mb-3">
              Explore All FCS Conferences
            </h4>
            <div className="flex flex-wrap gap-2">
              {conferences.map((conf) => (
                <Link
                  key={conf.id}
                  href={`/conferences/${conf.id}`}
                  className="px-2.5 py-1 rounded bg-[#202020] hover:bg-[#FFD400] hover:text-[#080808] text-xs font-semibold text-[#B5B5B5] transition-colors"
                >
                  {conf.shortName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLAYOFF PROJECTIONS / BRACKETOLOGY PREVIEW */}
      <section className="bg-[#181818]/60 border border-[#282828] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#282828] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[#FFD400] text-xs font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Road to Frisco 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              FCS Playoff Projections & Bracketology
            </h2>
          </div>
          <Link
            href="/playoff-projections"
            className="inline-flex items-center px-4 py-2.5 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] transition-colors shrink-0"
          >
            Explore Complete Bracket <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <PlayoffPreview projections={projections} matchups={matchups} />
      </section>

      {/* 5. LATEST STORIES FEED & FILM ROOM */}
      {latestArticles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400]" />
              <h2 className="text-xl font-black uppercase text-white tracking-tight">
                In-Depth Film Room & Analysis
              </h2>
            </div>
            <Link
              href="/news"
              className="text-xs font-bold uppercase text-[#FFD400] hover:underline"
            >
              Browse News Wire &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        </section>
      )}

      {/* 6. NEWSLETTER SUBSCRIPTION COMPONENT */}
      <Newsletter />

    </div>
  );
}
