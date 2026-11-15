'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  Search, 
  Trophy, 
  Flame, 
  Calendar, 
  ChevronRight,
  BarChart3
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'News & Analysis', href: '/news' },
  { name: 'Top 25 Rankings', href: '/top-25' },
  { name: 'Playoff Projections', href: '/playoff-projections' },
  { name: 'Conferences', href: '/conferences' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#282828] bg-[#080808]/95 backdrop-blur-md">
      {/* Top Ticker Bar */}
      <div className="bg-[#111111] border-b border-[#222222] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="flex items-center text-[#FFD400] font-bold uppercase tracking-wider text-[11px] shrink-0">
              <Flame className="w-3.5 h-3.5 mr-1" /> FCS WIRE
            </span>
            <div className="truncate text-[#B5B5B5]">
              <span className="text-white font-medium">Brawl of the Wild</span> preview live &bull; 
              <span className="ml-2">NDSU retains #1 spot in updated poll</span> &bull; 
              <span className="ml-2">Selection Sunday 10 days away</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-[#B5B5B5] shrink-0">
            <span className="hover:text-white transition-colors cursor-pointer flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#FFD400]" /> Road to Frisco 2026
            </span>
            <span className="text-[#333333]">|</span>
            <Link href="/top-25" className="hover:text-white transition-colors flex items-center">
              <BarChart3 className="w-3.5 h-3.5 mr-1 text-[#FFD400]" /> Top 25 Poll
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#FFD400] flex items-center justify-center font-black text-[#080808] text-xl shadow-[0_0_20px_rgba(255,212,0,0.25)] group-hover:scale-105 transition-transform">
              FCS
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic leading-none">
                THE FCS <span className="text-[#FFD400]">GUYS</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B5B5B5] mt-1">
                Subdivision Gridiron Media
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive 
                      ? 'text-[#FFD400] bg-[#181818]' 
                      : 'text-[#B5B5B5] hover:text-white hover:bg-[#181818]/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 sm:p-2.5 rounded-lg text-[#B5B5B5] hover:text-white hover:bg-[#181818] transition-colors"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/playoff-projections"
              className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-[#FFD400] text-[#080808] hover:bg-[#E5BE00] transition-colors shadow-sm"
            >
              <Trophy className="w-3.5 h-3.5 mr-1.5" />
              Bracketology
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#B5B5B5] hover:text-white hover:bg-[#181818] transition-colors focus:outline-none"
              aria-label="Open main menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Collapsible Search Input Bar */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-[#222222] animate-in fade-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5B5B5]" />
              <input
                type="text"
                placeholder="Search teams, conferences, playoffs, or stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-24 py-2.5 bg-[#181818] border border-[#282828] rounded-lg text-sm text-white placeholder-[#777777] focus:outline-none focus:border-[#FFD400] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#FFD400] text-[#080808] text-xs font-bold rounded hover:bg-[#E5BE00]"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e0e] border-b border-[#282828] px-4 pt-2 pb-6 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#181818] text-[#FFD400] font-semibold'
                    : 'text-[#B5B5B5] hover:bg-[#181818]/60 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-[#222222] mt-2">
            <Link
              href="/playoff-projections"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-[#FFD400] text-[#080808] font-bold text-sm uppercase tracking-wider"
            >
              <Trophy className="w-4 h-4" />
              <span>View Playoff Bracket</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
