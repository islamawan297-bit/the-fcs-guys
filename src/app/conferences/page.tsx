import React from 'react';
import Link from 'next/link';
import { CONFERENCES_DATA } from '@/data/fcs-data';
import { Newsletter } from '@/components/Newsletter';
import { ChevronRight, Shield, MapPin, Award } from 'lucide-react';

export const metadata = {
  title: 'FCS Conferences Directory | The FCS Guys',
  description: 'Explore all NCAA Division I FCS conferences, standings, team records, and championship races.',
};

export default function ConferencesPage() {
  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* Header section */}
      <div className="border-b border-[#282828] pb-6 sm:pb-8">
        <div className="flex items-center space-x-2 text-[#FFD400] text-xs font-bold uppercase tracking-wider mb-2">
          <Shield className="w-4 h-4" />
          <span>Subdivision Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          FCS Conferences
        </h1>
        <p className="text-[#B5B5B5] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Comprehensive directory and standings hub across all premier leagues competing in the NCAA Division I Football Championship Subdivision.
        </p>
      </div>

      {/* Conference Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CONFERENCES_DATA.map((conf) => (
          <div 
            key={conf.id}
            className="group bg-[#181818] border border-[#282828] hover:border-[#383838] rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header stripe */}
              <div 
                className="h-2.5 w-full"
                style={{ backgroundColor: conf.bannerColor || '#FFD400' }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#FFD400] uppercase tracking-wider">
                      {conf.shortName}
                    </span>
                    <h2 className="text-xl font-bold text-white group-hover:text-[#FFD400] transition-colors leading-tight">
                      {conf.name}
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 bg-[#222222] text-[#B5B5B5] text-xs font-semibold rounded shrink-0 border border-[#303030]">
                    {conf.teamsCount} Teams
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#B5B5B5] leading-relaxed mb-4">
                  {conf.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#888888] pt-3 border-t border-[#222222]">
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#666666]" />
                    <span>HQ: {conf.hq}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1 text-[#FFD400]" />
                    <span className="truncate">Defending: {conf.currentChampion}</span>
                  </div>
                </div>

                {/* Standings top 3 peek */}
                <div className="mt-4 pt-3 border-t border-[#222222] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666] block mb-1">
                    Current Leaders
                  </span>
                  {conf.standings.slice(0, 3).map((team, idx) => (
                    <div key={team.team} className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-white truncate">
                        <span className="text-[#666666] mr-1.5">{idx + 1}.</span>
                        {team.team}
                      </span>
                      <span className="font-bold text-[#FFD400] text-[11px]">
                        {team.confRecord} ({team.overallRecord})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#141414] border-t border-[#282828] flex items-center justify-between">
              <span className="text-xs text-[#888888]">
                Established {conf.founded}
              </span>
              <Link
                href={`/conferences/${conf.id}`}
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#FFD400] hover:text-[#E5BE00] group-hover:translate-x-1 transition-all"
              >
                <span>View Full Standings</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <Newsletter />

    </div>
  );
}
