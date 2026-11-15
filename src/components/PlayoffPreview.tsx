import React from 'react';
import Link from 'next/link';
import { PlayoffProjection, PlayoffMatchup } from '@/types';
import { ChevronRight, MapPin, Calendar } from 'lucide-react';

interface PlayoffPreviewProps {
  projections: PlayoffProjection[];
  matchups: PlayoffMatchup[];
}

export function PlayoffPreview({ projections, matchups }: PlayoffPreviewProps) {
  const top8Seeds = projections.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Top 8 Seeds with First Round Byes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Projected Top-8 National Seeds (First Round Byes)
            </h3>
          </div>
          <span className="text-xs text-[#888888]">Updated: Nov 13, 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {top8Seeds.map((seed) => (
            <div 
              key={seed.seed}
              className="bg-[#181818] border border-[#282828] hover:border-[#383838] p-3.5 rounded-xl transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded bg-[#FFD400] text-[#080808] font-black text-xs flex items-center justify-center">
                  #{seed.seed}
                </span>
                <span className="text-[10px] font-semibold text-[#888888] uppercase bg-[#222222] px-2 py-0.5 rounded">
                  {seed.type}
                </span>
              </div>
              <div className="font-bold text-white text-sm truncate">{seed.team}</div>
              <div className="flex items-center justify-between text-xs text-[#888888] mt-1">
                <span>{seed.conference}</span>
                <span className="font-semibold text-white">{seed.record}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured First Round Matchups Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#888888] uppercase tracking-wider">
            Featured First Round Projected Matchups
          </h4>
          <Link 
            href="/playoff-projections" 
            className="text-xs font-bold text-[#FFD400] hover:text-[#E5BE00] flex items-center transition-colors"
          >
            Full 24-Team Bracket <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {matchups.slice(0, 4).map((m) => (
            <div 
              key={m.id}
              className="bg-[#181818] border border-[#282828] rounded-xl p-3.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[11px] text-[#777777] mb-2">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-[#FFD400]" /> {m.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> {m.date}
                </span>
              </div>

              <div className="space-y-1.5 py-1">
                <div className={`flex items-center justify-between text-xs font-semibold px-2 py-1 rounded ${
                  m.team1.isProjectedWinner ? 'bg-[#222222] text-white font-bold' : 'text-[#888888]'
                }`}>
                  <span className="truncate">
                    {m.team1.seed && <span className="text-[#FFD400] mr-1.5">#{m.team1.seed}</span>}
                    {m.team1.name}
                  </span>
                  <span className="text-[11px]">{m.team1.record}</span>
                </div>

                <div className={`flex items-center justify-between text-xs font-semibold px-2 py-1 rounded ${
                  m.team2.isProjectedWinner ? 'bg-[#222222] text-white font-bold' : 'text-[#888888]'
                }`}>
                  <span className="truncate">
                    {m.team2.seed && <span className="text-[#FFD400] mr-1.5">#{m.team2.seed}</span>}
                    {m.team2.name}
                  </span>
                  <span className="text-[11px]">{m.team2.record}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#222222] text-[10px] text-right text-[#FFD400] font-semibold">
                Projected Winner Advances to Round 2
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
