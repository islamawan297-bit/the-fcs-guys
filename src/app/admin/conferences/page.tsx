'use client';

import React, { useState } from 'react';
import { CONFERENCES_DATA } from '@/data/fcs-data';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminConferencesPage() {
  const [conferences, setConferences] = useState(CONFERENCES_DATA);
  const [message, setMessage] = useState('');

  const handleConfUpdate = (index: number, field: string, val: string) => {
    const updated = [...conferences];
    updated[index] = { ...updated[index], [field]: val };
    setConferences(updated);
  };

  const handleSave = () => {
    setMessage('Conference directory settings updated.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282828] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Conference Directory & Realignment
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Manage conferences, headquarters locations, and branding banners.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] flex items-center shadow-lg transition-colors shrink-0"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Settings
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conferences.map((conf, idx) => (
          <div key={conf.id} className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">{conf.name}</span>
              <span className="text-xs font-black uppercase text-[#FFD400] bg-[#222222] px-2 py-0.5 rounded">
                {conf.shortName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#888888] mb-1">
                  HQ Location
                </label>
                <input
                  type="text"
                  value={conf.hq}
                  onChange={(e) => handleConfUpdate(idx, 'hq', e.target.value)}
                  className="w-full px-2.5 py-1 bg-[#111111] border border-[#282828] rounded text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#888888] mb-1">
                  Banner Hex Color
                </label>
                <input
                  type="text"
                  value={conf.bannerColor}
                  onChange={(e) => handleConfUpdate(idx, 'bannerColor', e.target.value)}
                  className="w-full px-2.5 py-1 bg-[#111111] border border-[#282828] rounded text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[#888888] mb-1">
                Description & Media Tagline
              </label>
              <textarea
                rows={2}
                value={conf.description}
                onChange={(e) => handleConfUpdate(idx, 'description', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#111111] border border-[#282828] rounded text-xs text-[#B5B5B5]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
