import React from 'react';
import Link from 'next/link';
import { getAdminDashboardStats } from '@/services/dynamic-content.service';
import { 
  FileText, 
  Trophy, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Award,
  ArrowRight,
  PlusCircle,
  Database
} from 'lucide-react';

export default async function AdminDashboardContent() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#181818] via-[#151515] to-[#101010] border border-[#282828] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#FFD400] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Operations Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            The FCS Guys Content Console
          </h2>
          <p className="text-xs text-[#888888] mt-1 max-w-xl">
            Live editorial statistics, conference realignment tools, weekly Top 25 ballot certification, and Road to Frisco bracketology.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/admin/articles/new"
            className="px-4 py-2.5 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] flex items-center shadow-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Write Article
          </Link>
          <Link
            href="/admin/rankings"
            className="px-4 py-2.5 rounded-lg bg-[#222222] border border-[#333333] hover:border-[#FFD400] text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Manage Poll
          </Link>
        </div>
      </div>

      {/* Live Statistics 4-Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#181818] border border-[#282828] p-5 rounded-xl">
          <div className="flex items-center justify-between text-[#888888] text-xs mb-2">
            <span className="uppercase font-bold">Published Stories</span>
            <FileText className="w-4 h-4 text-[#FFD400]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.publishedArticles}</div>
          <div className="text-[11px] text-[#666666] mt-1">Live in national feed</div>
        </div>

        <div className="bg-[#181818] border border-[#282828] p-5 rounded-xl">
          <div className="flex items-center justify-between text-[#888888] text-xs mb-2">
            <span className="uppercase font-bold">Editorial Drafts</span>
            <Layers className="w-4 h-4 text-[#B5B5B5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.draftArticles}</div>
          <div className="text-[11px] text-[#666666] mt-1">Pending review & fact-check</div>
        </div>

        <div className="bg-[#181818] border border-[#282828] p-5 rounded-xl">
          <div className="flex items-center justify-between text-[#888888] text-xs mb-2">
            <span className="uppercase font-bold">Active Programs</span>
            <Award className="w-4 h-4 text-[#FFD400]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalTeams}</div>
          <div className="text-[11px] text-[#666666] mt-1">Across {stats.totalConferences} FCS conferences</div>
        </div>

        <div className="bg-[#181818] border border-[#282828] p-5 rounded-xl">
          <div className="flex items-center justify-between text-[#888888] text-xs mb-2">
            <span className="uppercase font-bold">Latest Poll Edition</span>
            <Trophy className="w-4 h-4 text-[#FFD400]" />
          </div>
          <div className="text-sm font-bold text-white truncate mt-1">{stats.latestRankings}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Certified active ballot</div>
        </div>
      </div>

      {/* Primary Action Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module 1: Articles */}
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 flex flex-col justify-between hover:border-[#383838] transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD400] text-[#080808] flex items-center justify-center font-black">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Article Management</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Create, edit, preview, publish, and archive sports articles. Set featured articles, image captions, and categories.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-[#222222] flex items-center justify-between">
            <Link 
              href="/admin/articles" 
              className="text-xs font-bold text-[#FFD400] hover:text-[#E5BE00] flex items-center uppercase tracking-wider"
            >
              Open Articles CMS <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        {/* Module 2: Top 25 Poll */}
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 flex flex-col justify-between hover:border-[#383838] transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD400] text-[#080808] flex items-center justify-center font-black">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Top 25 Rankings Editor</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Build and publish weekly 25-team ballots. Assign point totals, previous ranks, trend movement, and voting notes.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-[#222222] flex items-center justify-between">
            <Link 
              href="/admin/rankings" 
              className="text-xs font-bold text-[#FFD400] hover:text-[#E5BE00] flex items-center uppercase tracking-wider"
            >
              Manage Polls <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        {/* Module 3: Standings */}
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 flex flex-col justify-between hover:border-[#383838] transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD400] text-[#080808] flex items-center justify-center font-black">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Standings & Records</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Update team conference records, overall records, streaks, home/away splits, and automatic bid clinches.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-[#222222] flex items-center justify-between">
            <Link 
              href="/admin/standings" 
              className="text-xs font-bold text-[#FFD400] hover:text-[#E5BE00] flex items-center uppercase tracking-wider"
            >
              Update Standings <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        {/* Module 4: Conferences & Realignment */}
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 flex flex-col justify-between hover:border-[#383838] transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD400] text-[#080808] flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Conferences & Realignment</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Manage all 14 conferences, update banner colors, edit descriptions, and adjust team membership by season.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-[#222222] flex items-center justify-between">
            <Link 
              href="/admin/conferences" 
              className="text-xs font-bold text-[#FFD400] hover:text-[#E5BE00] flex items-center uppercase tracking-wider"
            >
              Directory Settings <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        {/* Module 5: Playoff Projections */}
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 flex flex-col justify-between hover:border-[#383838] transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD400] text-[#080808] flex items-center justify-center font-black">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Playoff Bracketology</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Simulate 24-team fields, top-8 national byes, first-round host matchups, and bubble analysis notes.
            </p>
          </div>
          <div className="pt-5 mt-4 border-t border-[#222222] flex items-center justify-between">
            <Link 
              href="/admin/playoffs" 
              className="text-xs font-bold text-[#FFD400] hover:text-[#E5BE00] flex items-center uppercase tracking-wider"
            >
              Bracket Modeler <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
