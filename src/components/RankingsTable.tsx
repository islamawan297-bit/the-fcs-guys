import React from 'react';
import Link from 'next/link';
import { TeamRanking } from '@/types';
import { ArrowUp, ArrowDown, Minus, ChevronRight } from 'lucide-react';

interface RankingsTableProps {
  rankings: TeamRanking[];
  limit?: number;
  compact?: boolean;
}

export function RankingsTable({ rankings, limit, compact = false }: RankingsTableProps) {
  const displayRankings = limit ? rankings.slice(0, limit) : rankings;

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#282828] bg-[#141414] text-[11px] font-bold text-[#888888] uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4 text-center w-12">RK</th>
              <th className="py-3 px-3 sm:px-4">Team</th>
              <th className="py-3 px-3 sm:px-4 hidden sm:table-cell">Conference</th>
              <th className="py-3 px-3 sm:px-4 text-center">Record</th>
              {!compact && (
                <>
                  <th className="py-3 px-3 sm:px-4 text-center hidden md:table-cell">Prev</th>
                  <th className="py-3 px-3 sm:px-4 text-center hidden lg:table-cell">Points</th>
                </>
              )}
              <th className="py-3 px-3 sm:px-4 text-center">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222] text-xs sm:text-sm">
            {displayRankings.map((team) => {
              const diff = team.previousRank - team.rank;
              return (
                <tr 
                  key={team.rank}
                  className="hover:bg-[#202020] transition-colors group"
                >
                  {/* Rank */}
                  <td className="py-3 sm:py-3.5 px-3 sm:px-4 text-center font-black text-white">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded ${
                      team.rank <= 3 ? 'bg-[#FFD400] text-[#080808]' : team.rank <= 8 ? 'bg-[#252525] text-white' : 'text-[#B5B5B5]'
                    }`}>
                      {team.rank}
                    </span>
                  </td>

                  {/* Team */}
                  <td className="py-3 sm:py-3.5 px-3 sm:px-4">
                    <div className="flex items-center space-x-2.5">
                      <div 
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: team.logoColor }}
                      />
                      <div>
                        <div className="font-bold text-white group-hover:text-[#FFD400] transition-colors">
                          {team.team}
                          {team.firstPlaceVotes ? (
                            <span className="text-[10px] text-[#FFD400] font-normal ml-1">
                              ({team.firstPlaceVotes})
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[11px] text-[#777777] sm:hidden">
                          {team.conference}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Conference */}
                  <td className="py-3 sm:py-3.5 px-3 sm:px-4 text-[#B5B5B5] hidden sm:table-cell font-medium">
                    {team.conference}
                  </td>

                  {/* Record */}
                  <td className="py-3 sm:py-3.5 px-3 sm:px-4 text-center font-semibold text-white">
                    {team.record}
                  </td>

                  {/* Previous Rank */}
                  {!compact && (
                    <>
                      <td className="py-3 sm:py-3.5 px-3 sm:px-4 text-center text-[#888888] hidden md:table-cell">
                        {team.previousRank}
                      </td>
                      <td className="py-3 sm:py-3.5 px-3 sm:px-4 text-center text-[#888888] hidden lg:table-cell">
                        {team.points}
                      </td>
                    </>
                  )}

                  {/* Trend Indicator */}
                  <td className="py-3 sm:py-3.5 px-3 sm:px-4 text-center">
                    {team.trend === 'up' && (
                      <span className="inline-flex items-center text-emerald-400 font-semibold text-xs">
                        <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                        {Math.abs(diff)}
                      </span>
                    )}
                    {team.trend === 'down' && (
                      <span className="inline-flex items-center text-rose-400 font-semibold text-xs">
                        <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                        {Math.abs(diff)}
                      </span>
                    )}
                    {team.trend === 'same' && (
                      <span className="inline-flex items-center text-[#666666] text-xs">
                        <Minus className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {limit && (
        <div className="p-3 bg-[#141414] border-t border-[#282828] text-center">
          <Link 
            href="/top-25" 
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#FFD400] hover:text-[#E5BE00] transition-colors"
          >
            <span>View Full Top 25 Poll</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
