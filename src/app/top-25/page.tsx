import React from 'react';
import { TOP_25_RANKINGS } from '@/data/fcs-data';
import { RankingsTable } from '@/components/RankingsTable';
import { Newsletter } from '@/components/Newsletter';
import { Trophy, Calendar, Info, Award, BarChart3, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'FCS Top 25 Media Poll | The FCS Guys',
  description: 'Official weekly NCAA Division I FCS Football Top 25 Rankings, points breakdown, first-place votes, and team movement.',
};

export default function Top25Page() {
  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* Header section */}
      <div className="border-b border-[#282828] pb-6 sm:pb-8">
        <div className="flex items-center space-x-2 text-[#FFD400] text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4" />
          <span>Week 12 National Media Poll</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          FCS Top 25 Rankings
        </h1>
        <p className="text-[#B5B5B5] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          The definitive national rankings compiled by our certified syndicate of 26 FCS media analysts, regional correspondents, and sports editors. Released every Monday at noon Eastern.
        </p>

        {/* Voting Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-[#181818] border border-[#282828] rounded-lg p-3">
            <span className="text-[10px] uppercase font-bold text-[#777777] block">Ranking Date</span>
            <span className="text-xs sm:text-sm font-bold text-white flex items-center mt-0.5">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#FFD400]" /> Nov 11, 2026
            </span>
          </div>

          <div className="bg-[#181818] border border-[#282828] rounded-lg p-3">
            <span className="text-[10px] uppercase font-bold text-[#777777] block">Number 1 Overall</span>
            <span className="text-xs sm:text-sm font-bold text-[#FFD400] flex items-center mt-0.5">
              <Award className="w-3.5 h-3.5 mr-1" /> NDSU (10-1)
            </span>
          </div>

          <div className="bg-[#181818] border border-[#282828] rounded-lg p-3">
            <span className="text-[10px] uppercase font-bold text-[#777777] block">Total Ballots</span>
            <span className="text-xs sm:text-sm font-bold text-white flex items-center mt-0.5">
              <BarChart3 className="w-3.5 h-3.5 mr-1 text-[#FFD400]" /> 26 Voters
            </span>
          </div>

          <div className="bg-[#181818] border border-[#282828] rounded-lg p-3">
            <span className="text-[10px] uppercase font-bold text-[#777777] block">Top Mover</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Richmond (+2)
            </span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <section className="space-y-4">
        <RankingsTable rankings={TOP_25_RANKINGS} compact={false} />
      </section>

      {/* Others Receiving Votes & Methodology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFD400]">
            Others Receiving Votes (Bubble Teams)
          </h3>
          <p className="text-xs sm:text-sm text-[#B5B5B5] leading-relaxed">
            Illinois State 44, New Hampshire 38, East Tennessee State 31, Southeastern Louisiana 24, Lamar 19, Drake 14, Eastern Kentucky 11, Dartmouth 8, Central Connecticut State 4.
          </p>
          <span className="text-[11px] text-[#666666] block pt-2 border-t border-[#222222]">
            Teams receiving votes on at least two independent ballots.
          </span>
        </div>

        <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center">
            <Info className="w-3.5 h-3.5 text-[#FFD400] mr-1.5" />
            Polling Methodology
          </h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            The FCS Guys Top 25 ballot awards 25 points for first-place votes down to 1 point for 25th-place selections. Ballots are submitted Sunday night following completion of all Saturday games and certified prior to Monday publication.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
