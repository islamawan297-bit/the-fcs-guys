import React from 'react';
import { PLAYOFF_PROJECTIONS, PLAYOFF_MATCHUPS } from '@/data/fcs-data';
import { Newsletter } from '@/components/Newsletter';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Info
} from 'lucide-react';

export const metadata = {
  title: 'FCS Playoff Projections & Bracketology | The FCS Guys',
  description: 'Projected 24-team NCAA Division I FCS Championship bracket, top 8 seeds, at-large bids, regional matchups, and Frisco odds.',
};

export default function PlayoffProjectionsPage() {
  const top8Seeds = PLAYOFF_PROJECTIONS.slice(0, 8);
  const roundOneHosts = PLAYOFF_PROJECTIONS.slice(8, 16);

  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* Header Banner */}
      <div className="border-b border-[#282828] pb-6 sm:pb-8">
        <div className="flex items-center space-x-2 text-[#FFD400] text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4" />
          <span>Postseason Intelligence Unit</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Playoff Bracketology & Projections
        </h1>
        <p className="text-[#B5B5B5] text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Simulating the 24-team field for the 2026 NCAA Division I Football Championship Subdivision. Includes 10 automatic qualifiers and 14 high-stakes at-large berths.
        </p>

        {/* Disclaimer Notice: Clearly distinguish projections from official selections */}
        <div className="mt-6 p-4 rounded-xl bg-[#1e1a0b] border border-[#FFD400]/40 flex items-start space-x-3 text-xs sm:text-sm text-[#e6d080]">
          <AlertCircle className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#FFD400] uppercase tracking-wide mr-1.5">
              Notice / Projection Modeling:
            </span>
            These selections are <strong className="text-white">editorial projections</strong> calculated based on current strength of schedule, computer rankings, and quality wins. Official selections will be announced by the NCAA Division I Football Selection Committee on Selection Sunday.
          </div>
        </div>

        {/* Postseason Timeline Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-xs text-[#888888]">
          <div className="bg-[#181818] border border-[#282828] p-3 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[#666666] block">Selection Sunday</span>
            <span className="text-white font-bold text-sm">Sunday, Nov 22, 2026</span>
          </div>
          <div className="bg-[#181818] border border-[#282828] p-3 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[#666666] block">First Round Kickoff</span>
            <span className="text-white font-bold text-sm">Saturday, Nov 28, 2026</span>
          </div>
          <div className="bg-[#181818] border border-[#282828] p-3 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-[#666666] block">National Championship</span>
            <span className="text-[#FFD400] font-bold text-sm">Toyota Stadium &bull; Frisco, TX</span>
          </div>
        </div>
      </div>

      {/* 1. TOP 8 NATIONAL SEEDS (FIRST ROUND BYES) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#282828] pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400]" />
            <h2 className="text-xl font-black uppercase text-white tracking-tight">
              Top 8 National Seeds (Earn First-Round Bye)
            </h2>
          </div>
          <span className="text-xs text-[#888888] hidden sm:inline">Guaranteed Host Status through Quarterfinals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {top8Seeds.map((seed) => (
            <div 
              key={seed.seed}
              className="bg-[#181818] border border-[#282828] rounded-xl p-4 flex flex-col justify-between hover:border-[#FFD400]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-[#FFD400] text-[#080808] font-black text-sm flex items-center justify-center">
                    #{seed.seed}
                  </span>
                  <span className="text-[10px] font-bold text-[#888888] uppercase bg-[#202020] px-2 py-0.5 rounded">
                    {seed.type}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base leading-snug">{seed.team}</h3>
                <div className="flex items-center justify-between text-xs text-[#888888] mt-1 mb-3">
                  <span>{seed.conference}</span>
                  <span className="text-white font-semibold">{seed.record}</span>
                </div>
                <p className="text-xs text-[#999999] leading-relaxed border-t border-[#222222] pt-2.5">
                  {seed.analystCommentary}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#222222] text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {seed.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SEEDS 9-16 (FIRST ROUND HOSTS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#282828] pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B5B5B5]" />
            <h2 className="text-xl font-black uppercase text-white tracking-tight">
              Seeds 9–16 (Projected First-Round Hosts)
            </h2>
          </div>
          <span className="text-xs text-[#888888] hidden sm:inline">First Round On-Campus Venues</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roundOneHosts.map((seed) => (
            <div 
              key={seed.seed}
              className="bg-[#181818] border border-[#282828] rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded bg-[#252525] text-white font-bold text-xs flex items-center justify-center">
                    #{seed.seed}
                  </span>
                  <span className="text-[10px] font-semibold text-[#888888] uppercase bg-[#202020] px-2 py-0.5 rounded">
                    {seed.type}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm leading-snug">{seed.team}</h3>
                <div className="flex items-center justify-between text-xs text-[#888888] mt-1 mb-2">
                  <span>{seed.conference}</span>
                  <span className="text-white font-semibold">{seed.record}</span>
                </div>
                <p className="text-xs text-[#888888] leading-relaxed border-t border-[#222222] pt-2">
                  {seed.analystCommentary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#222222] text-[10px] text-[#B5B5B5] font-semibold flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-[#FFD400]" />
                {seed.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SIMULATED FIRST ROUND BRACKET MATCHUPS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#282828] pb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#FFD400]" />
            <h2 className="text-xl font-black uppercase text-white tracking-tight">
              Projected First-Round Bracket Clashes (Round of 24)
            </h2>
          </div>
          <span className="text-xs text-[#888888] hidden sm:inline">Winners advance to face Top 8 seeds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLAYOFF_MATCHUPS.map((match) => (
            <div 
              key={match.id}
              className="bg-[#181818] border border-[#282828] rounded-xl p-4 flex flex-col justify-between hover:border-[#383838] transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#888888] border-b border-[#222222] pb-2 mb-3">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#FFD400]" /> {match.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> {match.date}
                </span>
              </div>

              <div className="space-y-2">
                <div className={`p-3 rounded-lg flex items-center justify-between ${
                  match.team1.isProjectedWinner 
                    ? 'bg-[#222222] border-l-4 border-[#FFD400] text-white font-bold' 
                    : 'bg-[#141414] text-[#888888]'
                }`}>
                  <div className="flex items-center space-x-2 truncate">
                    {match.team1.seed && (
                      <span className="text-[#FFD400] text-xs font-black">#{match.team1.seed}</span>
                    )}
                    <span className="text-sm">{match.team1.name}</span>
                  </div>
                  <span className="text-xs font-semibold">{match.team1.record}</span>
                </div>

                <div className={`p-3 rounded-lg flex items-center justify-between ${
                  match.team2.isProjectedWinner 
                    ? 'bg-[#222222] border-l-4 border-[#FFD400] text-white font-bold' 
                    : 'bg-[#141414] text-[#888888]'
                }`}>
                  <div className="flex items-center space-x-2 truncate">
                    {match.team2.seed && (
                      <span className="text-[#FFD400] text-xs font-black">#{match.team2.seed}</span>
                    )}
                    <span className="text-sm">{match.team2.name}</span>
                  </div>
                  <span className="text-xs font-semibold">{match.team2.record}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#222222] flex items-center justify-between text-[11px]">
                <span className="text-[#666666]">Host: higher seed / regional criteria</span>
                <span className="text-[#FFD400] font-semibold">
                  Projected Winner: {match.team1.isProjectedWinner ? match.team1.name : match.team2.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ANALYST BUBBLE WATCH & COMMITTEE CRITERIA */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Last Four In
          </h3>
          <ul className="text-xs space-y-1.5 text-[#cccccc]">
            <li>1. William & Mary (6-4, CAA)</li>
            <li>2. Jackson State (8-2, SWAC)</li>
            <li>3. Western Carolina (6-4, SoCon)</li>
            <li>4. Drake (7-2, Pioneer)</li>
          </ul>
        </div>

        <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> First Four Out (Bubble)
          </h3>
          <ul className="text-xs space-y-1.5 text-[#cccccc]">
            <li>1. Illinois State (7-3, MVFC)</li>
            <li>2. New Hampshire (6-4, CAA)</li>
            <li>3. East Tennessee State (6-4, SoCon)</li>
            <li>4. Southeastern Louisiana (6-5, Southland)</li>
          </ul>
        </div>

        <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFD400] flex items-center">
            <Info className="w-3.5 h-3.5 mr-1.5" /> Selection Criteria
          </h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            The NCAA FCS selection committee prioritizes head-to-head results, Division I record against winning programs, SOS, common opponents, and late-season momentum.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

    </div>
  );
}
