'use client';

import React, { useState } from 'react';
import { PLAYOFF_PROJECTIONS } from '@/data/fcs-data';
import { Save, CheckCircle2 } from 'lucide-react';
import { PlayoffProjection } from '@/types';

export default function AdminPlayoffsPage() {
  const [projections, setProjections] = useState<PlayoffProjection[]>(PLAYOFF_PROJECTIONS);
  const [message, setMessage] = useState('');

  const handleSeedChange = (idx: number, field: keyof PlayoffProjection, val: PlayoffProjection[keyof PlayoffProjection]) => {
    const updated = [...projections];
    updated[idx] = { ...updated[idx], [field]: val };
    setProjections(updated);
  };

  const handleSave = () => {
    setMessage('Playoff projections & bracket model saved and published.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282828] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Playoff Bracketology & Projections
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Configure 24-team national bracket, assign top-8 first-round byes, and simulate matchups.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] flex items-center shadow-lg transition-colors shrink-0"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Publish Projections
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Top 8 Seeds */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Top 8 National Seeds (Byes)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {projections.slice(0, 8).map((p, idx) => (
            <div key={p.seed} className="bg-[#181818] border border-[#282828] p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded bg-[#FFD400] text-[#080808] font-black text-xs flex items-center justify-center">
                  #{p.seed}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#888888]">
                  {p.type}
                </span>
              </div>
              <input
                type="text"
                value={p.team}
                onChange={(e) => handleSeedChange(idx, 'team', e.target.value)}
                className="w-full px-2 py-1 bg-[#111111] border border-[#282828] rounded text-xs text-white font-bold"
              />
              <div className="text-[10px] text-[#777777]">
                {p.conference} &bull; {p.record}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
