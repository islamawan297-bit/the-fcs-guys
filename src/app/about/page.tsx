import React from 'react';
import { Newsletter } from '@/components/Newsletter';
import { 
  ShieldCheck, 
  Users, 
  Award, 
  Target, 
  CheckCircle2, 
  Mail
} from 'lucide-react';

export const metadata = {
  title: 'About The FCS Guys | Premier FCS College Football Media',
  description: 'The FCS Guys is the independent editorial brand dedicated to championing NCAA Division I FCS football with verified reporting, film room analysis, and bracketology.',
};

export default function AboutPage() {
  const editorialStaff = [
    {
      name: 'Garrett Vance',
      role: 'Editor-in-Chief & Bracketologist',
      bio: 'Covering Division I football for 14 seasons. Official voter in the FCS National Media Poll.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Brett McAllister',
      role: 'Western Region Correspondent',
      bio: 'Specialist in Big Sky and Western football history. Veteran broadcaster and sideline analyst.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Colton Bradley',
      role: 'Midwest & Trench Analyst',
      bio: 'Former collegiate offensive lineman analyzing line-of-scrimmage metrics and EPA in the MVFC.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Marcus Williams',
      role: 'HBCU & Celebration Bowl Insider',
      bio: 'Providing comprehensive beat coverage of the SWAC and MEAC with weekly coach interviews.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300'
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* Hero Mission */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#181818] border border-[#282828] text-[#FFD400] text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Independent Sports Journalism</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight">
          Champions of the <span className="text-[#FFD400]">Subdivision</span>
        </h1>
        <p className="text-sm sm:text-base text-[#B5B5B5] leading-relaxed">
          Founded by dedicated football writers and analysts, The FCS Guys was built to give NCAA Division I Football Championship Subdivision the premier, unfiltered media coverage it rightfully commands.
        </p>
      </section>

      {/* Core Values 3-Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#FFD400] text-[#080808] flex items-center justify-center font-black">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase">Pure FCS Focus</h3>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
            We don’t treat FCS as an afterthought or filler between FBS segments. Every article, ranking model, and podcast episode is 100% committed to FCS football.
          </p>
        </div>

        <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#FFD400] text-[#080808] flex items-center justify-center font-black">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase">Editorial Integrity</h3>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
            Our Top 25 ballot and Playoff Projections follow verified metrics, film evaluation, and on-field results. No pay-to-play coverage or fabricated rumors.
          </p>
        </div>

        <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#FFD400] text-[#080808] flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase">Community Rooted</h3>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
            From the bitter cold in Missoula and Fargo to the electric tailgate atmospheres in Atlanta and Frisco, we celebrate the true spirit of collegiate football.
          </p>
        </div>
      </section>

      {/* Editorial Team */}
      <section className="space-y-6">
        <div className="border-b border-[#282828] pb-3">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
            Editorial Syndicate & Contributors
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Meet the analysts behind the rankings, film breakdowns, and weekly ballots.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {editorialStaff.map((member) => (
            <div 
              key={member.name}
              className="bg-[#181818] border border-[#282828] rounded-xl p-5 text-center space-y-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.avatar}
                alt={member.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#FFD400]"
              />
              <div>
                <h4 className="text-base font-bold text-white">{member.name}</h4>
                <p className="text-xs text-[#FFD400] font-semibold">{member.role}</p>
              </div>
              <p className="text-xs text-[#888888] leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Standards & Contact */}
      <section id="editorial-standards" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold uppercase text-white flex items-center">
            <CheckCircle2 className="w-5 h-5 text-[#FFD400] mr-2" />
            Editorial Guidelines
          </h3>
          <ul className="text-xs sm:text-sm text-[#B5B5B5] space-y-2.5 leading-relaxed">
            <li>&bull; <strong className="text-white">Fact Verification:</strong> All roster moves, injuries, and commitments require direct athletic department confirmation.</li>
            <li>&bull; <strong className="text-white">Data Separation:</strong> Projections and statistical models are explicitly labeled apart from official NCAA records.</li>
            <li>&bull; <strong className="text-white">Corrections Policy:</strong> Material errors are corrected transparently with an editor note timestamp.</li>
          </ul>
        </div>

        <div id="contact" className="bg-[#181818] border border-[#282828] rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold uppercase text-white flex items-center">
            <Mail className="w-5 h-5 text-[#FFD400] mr-2" />
            Media & Inquiries
          </h3>
          <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
            For press credentials, sports information director (SID) distribution, guest analyst bookings, or advertising opportunities, reach out directly to our editorial desk:
          </p>
          <div className="p-3 bg-[#111111] rounded-lg border border-[#252525] text-xs space-y-1">
            <div className="text-white font-mono">press@thefcsguys.com</div>
            <div className="text-[#666666]">Frisco & National Bureaus</div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

    </div>
  );
}
