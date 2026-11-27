'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  TrendingUp, 
  Layers, 
  Database, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Articles CMS', href: '/admin/articles', icon: FileText },
  { name: 'Top 25 Poll', href: '/admin/rankings', icon: Trophy },
  { name: 'Standings Editor', href: '/admin/standings', icon: TrendingUp },
  { name: 'Conferences', href: '/admin/conferences', icon: Layers },
  { name: 'Playoff Bracket', href: '/admin/playoffs', icon: Database },
];

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/auth/signout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // If on login page, render clean container without sidebar
  if (pathname === '/admin/login') {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden w-full flex items-center justify-between p-4 bg-[#181818] border border-[#282828] rounded-xl mb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-[#FFD400]" />
          <span className="font-bold text-white text-sm uppercase">Admin Console</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded bg-[#222222] text-[#B5B5B5] hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside className={`w-full lg:w-64 bg-[#181818] border border-[#282828] rounded-2xl p-4 shrink-0 space-y-6 ${
        mobileSidebarOpen ? 'block' : 'hidden lg:block'
      }`}>
        <div className="px-3 py-2 border-b border-[#252525]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFD400] block">
            Navigation Hub
          </span>
          <span className="text-sm font-black uppercase text-white tracking-tight">
            Editorial Suite
          </span>
        </div>

        <nav className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#FFD400] text-[#080808]'
                    : 'text-[#B5B5B5] hover:text-white hover:bg-[#222222]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-[#252525] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#888888] hover:text-white hover:bg-[#222222] transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Working Area */}
      <section className="flex-1 w-full min-w-0">
        {children}
      </section>

    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#888888]">Loading control console...</div>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}

