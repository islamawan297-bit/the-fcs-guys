'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const isMissingEnv = 
        !process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock');

      if (isMissingEnv) {
        setErrorMsg('Authentication Service Unavailable: Supabase environment variables are missing in Vercel deployment settings.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Redirect to admin dashboard upon successful authentication
        router.push('/admin');
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      if (msg.includes('Failed to fetch') || msg.includes('fetch')) {
        setErrorMsg('Network Error: Unable to connect to Supabase Auth API. Please verify your Supabase project status and Vercel environment variables.');
      } else {
        setErrorMsg(msg);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#181818] border border-[#282828] p-8 sm:p-10 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#FFD400] text-[#080808] flex items-center justify-center mx-auto font-black shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Editorial Staff Login
          </h1>
          <p className="text-xs text-[#888888]">
            Restricted access portal for certified The FCS Guys editors and analysts.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#B5B5B5] uppercase mb-1.5">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@thefcsguys.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#282828] rounded-lg text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#B5B5B5] uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#282828] rounded-lg text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#222222] text-center">
          <div className="inline-flex items-center text-[11px] text-[#666666]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFD400] mr-1" />
            256-Bit SSL Encrypted &bull; No Public Registration
          </div>
        </div>

      </div>
    </div>
  );
}

