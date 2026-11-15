import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight,
  ShieldCheck,
  Share2,
  Tv,
  Globe,
  Radio
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#282828] text-[#B5B5B5] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#222222]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded bg-[#FFD400] flex items-center justify-center font-black text-[#080808] text-lg">
                FCS
              </div>
              <span className="text-xl font-black tracking-tight text-white uppercase italic">
                THE FCS <span className="text-[#FFD400]">GUYS</span>
              </span>
            </Link>
            <p className="text-sm text-[#888888] leading-relaxed max-w-sm">
              The premier independent media source dedicated exclusively to NCAA Division I FCS football. Delivering comprehensive national rankings, bracketology, trench analysis, and conference coverage.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="X / Twitter"
                className="w-9 h-9 rounded-full bg-[#181818] border border-[#282828] flex items-center justify-center text-[#B5B5B5] hover:text-[#FFD400] hover:border-[#FFD400] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube Broadcasts"
                className="w-9 h-9 rounded-full bg-[#181818] border border-[#282828] flex items-center justify-center text-[#B5B5B5] hover:text-[#FFD400] hover:border-[#FFD400] transition-colors"
              >
                <Tv className="w-4 h-4" />
              </a>
              <a 
                href="https://thefcsguys.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Network"
                className="w-9 h-9 rounded-full bg-[#181818] border border-[#282828] flex items-center justify-center text-[#B5B5B5] hover:text-[#FFD400] hover:border-[#FFD400] transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <Link 
                href="/news" 
                aria-label="Podcast"
                className="w-9 h-9 rounded-full bg-[#181818] border border-[#282828] flex items-center justify-center text-[#B5B5B5] hover:text-[#FFD400] hover:border-[#FFD400] transition-colors"
              >
                <Radio className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-[#FFD400] pl-2.5">
              Coverage
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/news" className="hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#FFD400] mr-1.5 transition-colors" />
                  National Headlines
                </Link>
              </li>
              <li>
                <Link href="/top-25" className="hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#FFD400] mr-1.5 transition-colors" />
                  Top 25 Media Poll
                </Link>
              </li>
              <li>
                <Link href="/playoff-projections" className="hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#FFD400] mr-1.5 transition-colors" />
                  Playoff Bracketology
                </Link>
              </li>
              <li>
                <Link href="/conferences" className="hover:text-white transition-colors flex items-center group">
                  <ChevronRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#FFD400] mr-1.5 transition-colors" />
                  Conference Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Conferences */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-[#FFD400] pl-2.5">
              Major Conferences
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/conferences/mvfc" className="hover:text-white transition-colors">
                  Missouri Valley (MVFC)
                </Link>
              </li>
              <li>
                <Link href="/conferences/big-sky" className="hover:text-white transition-colors">
                  Big Sky Conference
                </Link>
              </li>
              <li>
                <Link href="/conferences/caa" className="hover:text-white transition-colors">
                  CAA Football
                </Link>
              </li>
              <li>
                <Link href="/conferences/socon" className="hover:text-white transition-colors">
                  Southern (SoCon)
                </Link>
              </li>
              <li>
                <Link href="/conferences/uac" className="hover:text-white transition-colors">
                  United Athletic (UAC)
                </Link>
              </li>
              <li>
                <Link href="/conferences/southland" className="hover:text-white transition-colors">
                  Southland Conference
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Trust */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-[#FFD400] pl-2.5">
              The Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Media Team
                </Link>
              </li>
              <li>
                <Link href="/about#editorial-standards" className="hover:text-white transition-colors">
                  Editorial Standards
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-white transition-colors">
                  Media Inquiries
                </Link>
              </li>
              <li>
                <Link href="/about#privacy" className="hover:text-white transition-colors">
                  Privacy Policy & Terms
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#777777] gap-4">
          <p>
            &copy; 2026 The FCS Guys. All rights reserved. Not officially affiliated with or endorsed by the NCAA.
          </p>
          <div className="flex items-center space-x-6 text-[#777777]">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFD400] mr-1.5" />
              Verified Independent Journalism
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
