'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#181818] via-[#141414] to-[#0d0d0d] border border-[#2c2c2c] p-8 sm:p-12 shadow-2xl">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD400]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#222222] border border-[#333333] text-[#FFD400] text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5" />
          <span>The Monday Morning Film Room</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">
          Never Miss a Snap in the <span className="text-[#FFD400]">Subdivision</span>
        </h2>

        <p className="text-sm sm:text-base text-[#B5B5B5] max-w-xl mx-auto leading-relaxed">
          Join 28,000+ FCS coaches, athletic directors, players, and diehard fans receiving our weekly ballot breakdown, bubble metrics, and game previews every Tuesday.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center space-x-2 text-emerald-400 font-semibold py-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>Thank you for subscribing! Check your inbox for the latest edition.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <div className="relative w-full">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#333333] rounded-lg text-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#FFD400] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#FFD400] text-[#080808] font-black text-sm uppercase tracking-wider hover:bg-[#E5BE00] transition-colors shrink-0 shadow-md"
            >
              Subscribe
            </button>
          </form>
        )}

        <div className="flex items-center justify-center space-x-4 text-xs text-[#777777] pt-2">
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#FFD400]" /> Zero Spam
          </span>
          <span>&bull;</span>
          <span>Unsubscribe anytime</span>
          <span>&bull;</span>
          <span>Strict editorial privacy</span>
        </div>
      </div>
    </section>
  );
}

