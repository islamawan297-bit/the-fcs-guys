import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CONFERENCES_DATA } from '@/data/fcs-data';
import { Newsletter } from '@/components/Newsletter';
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Trophy, 
  ShieldCheck, 
  Award
} from 'lucide-react';

export function generateStaticParams() {
  return CONFERENCES_DATA.map((conf) => ({
    slug: conf.id,
  }));
}

interface ConferencePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ConferenceDetailPage({ params }: ConferencePageProps) {
  const { slug } = await params;
  const conference = CONFERENCES_DATA.find((c) => c.id === slug);

  if (!conference) {
    notFound();
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* Back button */}
      <div>
        <Link 
          href="/conferences" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#B5B5B5] hover:text-[#FFD400] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> All Conferences
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-[#181818] border border-[#282828] rounded-2xl overflow-hidden shadow-2xl">
        <div 
          className="h-3 w-full"
          style={{ backgroundColor: conference.bannerColor || '#FFD400' }}
        />

        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#FFD400]">
                {conference.shortName} Gridiron
              </span>
              <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight mt-1">
                {conference.name}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 rounded-lg bg-[#222222] border border-[#333333] text-xs font-bold text-white">
                {conference.teamsCount} Member Institutions
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#B5B5B5] max-w-3xl leading-relaxed">
            {conference.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#252525] text-xs">
            <div>
              <span className="text-[#666666] uppercase text-[10px] font-bold block">Headquarters</span>
              <span className="text-white font-semibold flex items-center mt-0.5">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[#FFD400]" /> {conference.hq}
              </span>
            </div>
            <div>
              <span className="text-[#666666] uppercase text-[10px] font-bold block">Founded</span>
              <span className="text-white font-semibold flex items-center mt-0.5">
                <Calendar className="w-3.5 h-3.5 mr-1" /> {conference.founded}
              </span>
            </div>
            <div>
              <span className="text-[#666666] uppercase text-[10px] font-bold block">Defending Champion</span>
              <span className="text-[#FFD400] font-semibold flex items-center mt-0.5">
                <Award className="w-3.5 h-3.5 mr-1" /> {conference.currentChampion}
              </span>
            </div>
            <div>
              <span className="text-[#666666] uppercase text-[10px] font-bold block">Playoff Status</span>
              <span className="text-emerald-400 font-semibold flex items-center mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Auto-Bid Eligible
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Standings Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#282828] pb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#FFD400]" />
            <h2 className="text-xl font-black uppercase text-white tracking-tight">
              Official {conference.shortName} Standings
            </h2>
          </div>
          <span className="text-xs text-[#888888]">2026 Regular Season</span>
        </div>

        <div className="bg-[#181818] border border-[#282828] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#282828] bg-[#141414] text-[11px] font-bold text-[#888888] uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">POS</th>
                  <th className="py-3 px-4">School</th>
                  <th className="py-3 px-4 text-center font-bold text-white">Conf</th>
                  <th className="py-3 px-4 text-center">Overall</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Home</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Away</th>
                  <th className="py-3 px-4 text-center">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222] text-xs sm:text-sm">
                {conference.standings.map((team, idx) => (
                  <tr key={team.team} className="hover:bg-[#202020] transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-[#666666]">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        {team.isRanked && (
                          <span className="px-1.5 py-0.5 rounded bg-[#FFD400] text-[#080808] text-[10px] font-black">
                            #{team.isRanked}
                          </span>
                        )}
                        <span className="font-bold text-white">{team.team}</span>
                        <span className="text-[#777777] hidden md:inline text-xs font-normal">
                          {team.mascot}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#FFD400]">
                      {team.confRecord}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-white">
                      {team.overallRecord}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#888888] hidden sm:table-cell">
                      {team.homeRecord}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#888888] hidden sm:table-cell">
                      {team.awayRecord}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span className={team.streak.startsWith('W') ? 'text-emerald-400' : 'text-rose-400'}>
                        {team.streak}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Switch Conference quick links */}
      <section className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888]">
          Switch Conference
        </h3>
        <div className="flex flex-wrap gap-2">
          {CONFERENCES_DATA.map((c) => (
            <Link
              key={c.id}
              href={`/conferences/${c.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                c.id === conference.id
                  ? 'bg-[#FFD400] text-[#080808]'
                  : 'bg-[#202020] text-[#B5B5B5] hover:text-white hover:bg-[#282828]'
              }`}
            >
              {c.shortName}
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

    </div>
  );
}
