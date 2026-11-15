import React from 'react';
import Link from 'next/link';
import { ConferenceInfo } from '@/types';
import { ChevronRight, Users } from 'lucide-react';

interface ConferenceSidebarProps {
  conferences: ConferenceInfo[];
  activeConferenceId?: string;
}

export function ConferenceSidebar({ conferences, activeConferenceId }: ConferenceSidebarProps) {
  // Default to showing MVFC or first conference standings
  const activeConf = conferences.find(c => c.id === activeConferenceId) || conferences[0];

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-[#282828] flex items-center justify-between bg-[#141414]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFD400] block">
            Standings Snapshot
          </span>
          <h3 className="text-base font-bold text-white truncate max-w-[200px]">
            {activeConf.shortName} Leaderboard
          </h3>
        </div>
        <Link 
          href={`/conferences/${activeConf.id}`}
          className="text-xs font-bold text-[#FFD400] hover:text-[#E5BE00] flex items-center"
        >
          Details <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

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

      <div className="p-3 bg-[#131313] border-t border-[#222222] flex items-center justify-between text-xs">
        <Link 
          href="/conferences"
          className="text-[#B5B5B5] hover:text-white transition-colors flex items-center"
        >
          <Users className="w-3.5 h-3.5 mr-1 text-[#FFD400]" />
          All 14 Conferences
        </Link>
        <Link
          href={`/conferences/${activeConf.id}`}
          className="font-bold text-[#FFD400] hover:text-[#E5BE00]"
        >
          Full Standings
        </Link>
      </div>
    </div>
  );
}
