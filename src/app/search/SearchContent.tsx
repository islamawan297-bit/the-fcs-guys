'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ARTICLES_DATA, TOP_25_RANKINGS, CONFERENCES_DATA } from '@/data/fcs-data';
import { ArticleCard } from '@/components/ArticleCard';
import { Search, Trophy, Shield, ChevronRight, FileText } from 'lucide-react';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlQuery);

  const activeQuery = query !== undefined ? query : urlQuery;
  const cleanQuery = activeQuery.toLowerCase().trim();

  // Search across Articles
  const matchingArticles = cleanQuery
    ? ARTICLES_DATA.filter((a) =>
        a.title.toLowerCase().includes(cleanQuery) ||
        a.excerpt.toLowerCase().includes(cleanQuery) ||
        a.tags.some((t) => t.toLowerCase().includes(cleanQuery)) ||
        (a.conference && a.conference.toLowerCase().includes(cleanQuery))
      )
    : [];

  // Search across Ranked Teams
  const matchingTeams = cleanQuery
    ? TOP_25_RANKINGS.filter((t) =>
        t.team.toLowerCase().includes(cleanQuery) ||
        t.mascot.toLowerCase().includes(cleanQuery) ||
        t.conference.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Search across Conferences
  const matchingConferences = cleanQuery
    ? CONFERENCES_DATA.filter((c) =>
        c.name.toLowerCase().includes(cleanQuery) ||
        c.shortName.toLowerCase().includes(cleanQuery) ||
        c.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults = matchingArticles.length + matchingTeams.length + matchingConferences.length;

  return (
    <div className="space-y-10">
      
      {/* Header and Search Box */}
      <div className="border-b border-[#282828] pb-6 sm:pb-8">
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mb-4">
          Search Database
        </h1>

        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#777777]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, conferences, playoffs, or stories..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#181818] border border-[#282828] rounded-xl text-base text-white placeholder-[#666666] focus:outline-none focus:border-[#FFD400] transition-colors"
          />
        </div>

        {cleanQuery && (
          <p className="text-xs text-[#888888] mt-3">
            Found <strong className="text-white">{totalResults}</strong> result{totalResults === 1 ? '' : 's'} for &ldquo;{activeQuery}&rdquo;
          </p>
        )}
      </div>

      {cleanQuery ? (
        <div className="space-y-10">
          
          {/* Matched Teams */}
          {matchingTeams.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD400] flex items-center">
                <Trophy className="w-4 h-4 mr-1.5" /> Matched Teams in Top 25 ({matchingTeams.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {matchingTeams.map((team) => (
                  <Link
                    key={team.team}
                    href="/top-25"
                    className="p-3 bg-[#181818] border border-[#282828] rounded-xl hover:border-[#FFD400] transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded bg-[#FFD400] text-[#080808] font-black text-xs flex items-center justify-center">
                        #{team.rank}
                      </span>
                      <div>
                        <div className="font-bold text-white text-sm">{team.team}</div>
                        <div className="text-[11px] text-[#777777]">{team.conference} &bull; {team.record}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#777777]" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Matched Conferences */}
          {matchingConferences.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD400] flex items-center">
                <Shield className="w-4 h-4 mr-1.5" /> Matched Conferences ({matchingConferences.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingConferences.map((conf) => (
                  <Link
                    key={conf.id}
                    href={`/conferences/${conf.id}`}
                    className="p-4 bg-[#181818] border border-[#282828] rounded-xl hover:border-[#FFD400] transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#FFD400] uppercase">{conf.shortName}</div>
                      <div className="font-bold text-white text-base">{conf.name}</div>
                      <div className="text-xs text-[#888888]">{conf.teamsCount} Teams &bull; HQ: {conf.hq}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#777777]" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Matched Articles */}
          {matchingArticles.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD400] flex items-center">
                <FileText className="w-4 h-4 mr-1.5" /> Matched Articles ({matchingArticles.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="standard" />
                ))}
              </div>
            </section>
          )}

          {totalResults === 0 && (
            <div className="bg-[#181818] border border-[#282828] rounded-xl p-12 text-center text-[#888888] space-y-2">
              <p className="text-base text-white font-semibold">No matches found for &ldquo;{activeQuery}&rdquo;</p>
              <p className="text-xs">Try searching for conferences (e.g. MVFC, Big Sky), teams (Montana, NDSU), or playoffs.</p>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-8 text-center text-[#888888]">
          <p className="text-sm">Type any team name, conference keyword, or article topic above to search.</p>
        </div>
      )}

    </div>
  );
}
