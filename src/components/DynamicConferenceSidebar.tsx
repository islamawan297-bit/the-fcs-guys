'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConferenceInfo } from '@/types';
import { ChevronRight, ChevronLeft, Users, Pause, Play } from 'lucide-react';

interface DynamicConferenceSidebarProps {
  conferences: ConferenceInfo[];
}

export function DynamicConferenceSidebar({ conferences }: DynamicConferenceSidebarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeConf = conferences[currentIndex] || conferences[0];

  // Auto-rotation every 7 seconds when not hovered/paused
  useEffect(() => {
    if (isPaused || conferences.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % conferences.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, conferences.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + conferences.length) % conferences.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % conferences.length);
  };

  if (!conferences || conferences.length === 0) {
    return (
      <div className="bg-[#181818] border border-[#282828] rounded-xl p-8 text-center text-[#888888]">
        <p className="text-sm">Standings records updating...</p>
      </div>
    );
  }

  return (
    <div 
      className="bg-[#181818] border border-[#282828] rounded-xl overflow-hidden shadow-lg transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Banner & Conference Switch Controls */}
      <div className="p-4 border-b border-[#282828] flex items-center justify-between bg-[#141414]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFD400] block">
              Standings Tracker
            </span>
            {isPaused ? (
              <span className="text-[9px] text-[#666666] flex items-center bg-[#222222] px-1.5 py-0.5 rounded">
                <Pause className="w-2.5 h-2.5 mr-0.5" /> Paused
              </span>
            ) : (
              <span className="text-[9px] text-emerald-400 flex items-center bg-emerald-950/40 px-1.5 py-0.5 rounded">
                <Play className="w-2.5 h-2.5 mr-0.5" /> Auto
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white truncate max-w-[180px] sm:max-w-[220px]">
            {activeConf.shortName} Leaderboard
          </h3>
        </div>

        {/* Carousel buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrev}
            className="p-1 rounded bg-[#202020] hover:bg-[#282828] text-[#B5B5B5] hover:text-white transition-colors"
            aria-label="Previous conference"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded bg-[#202020] hover:bg-[#282828] text-[#B5B5B5] hover:text-white transition-colors"
            aria-label="Next conference"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Standings Table Body */}
      <div className="p-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#666666] border-b border-[#222222] font-semibold">
              <th className="py-2 px-2.5">Team</th>
              <th className="py-2 px-2 text-center">Conf</th>
              <th className="py-2 px-2 text-center">Ovr</th>
              <th className="py-2 px-2 text-center">Strk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202020]">
            {activeConf.standings.slice(0, 6).map((item, idx) => (
              <tr key={item.team} className="hover:bg-[#202020]/60 transition-colors">
                <td className="py-2.5 px-2.5 font-medium text-white flex items-center space-x-1.5 truncate">
                  <span className="text-[#666666] text-[11px] w-3">{idx + 1}</span>
                  {item.isRanked && (
                    <span className="text-[10px] font-bold text-[#FFD400] mr-1">
                      #{item.isRanked}
                    </span>
                  )}
                  <span className="truncate">{item.team}</span>
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-[#B5B5B5]">
                  {item.confRecord}
                </td>
                <td className="py-2.5 px-2 text-center text-[#888888]">
                  {item.overallRecord}
                </td>
                <td className="py-2.5 px-2 text-center text-xs font-semibold">
                  <span className={item.streak.startsWith('W') ? 'text-emerald-400' : 'text-rose-400'}>
                    {item.streak}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer controls */}
      <div className="p-3 bg-[#131313] border-t border-[#222222] flex items-center justify-between text-xs">
        <Link 
          href="/conferences"
          className="text-[#B5B5B5] hover:text-white transition-colors flex items-center"
        >
          <Users className="w-3.5 h-3.5 mr-1 text-[#FFD400]" />
          All {conferences.length} Leagues
        </Link>
        <Link
          href={`/conferences/${activeConf.id}`}
          className="font-bold text-[#FFD400] hover:text-[#E5BE00] flex items-center"
        >
          Full Standings <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>
    </div>
  );
}

