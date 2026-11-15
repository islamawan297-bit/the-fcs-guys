'use client';

import React, { useState } from 'react';
import { TOP_25_RANKINGS } from '@/data/fcs-data';
import { Save, CheckCircle2 } from 'lucide-react';
import { TeamRanking } from '@/types';

export default function AdminRankingsPage() {
  const [editionTitle, setEditionTitle] = useState('Week 12 National Media Poll');
  const [rankingDate, setRankingDate] = useState('2026-11-11');
  const [rankings, setRankings] = useState<TeamRanking[]>(TOP_25_RANKINGS);
  const [message, setMessage] = useState('');

  const handleRankChange = (index: number, field: keyof TeamRanking, val: TeamRanking[keyof TeamRanking]) => {
    const updated = [...rankings];
    updated[index] = { ...updated[index], [field]: val };
    setRankings(updated);
  };

  const handleSaveEdition = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Top 25 Rankings certified and published successfully!');
    setTimeout(() => setMessage(''), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282828] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Top 25 Rankings Certification
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Certify weekly national ballots, update team rankings, points, and voting movements.
          </p>
        </div>

        <button
          onClick={handleSaveEdition}
          className="px-4 py-2.5 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] flex items-center shadow-lg transition-colors shrink-0"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Certify & Publish Ballot
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Meta Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#181818] border border-[#282828] p-4 rounded-xl">
        <div>
          <label className="block text-[10px] font-bold uppercase text-[#888888] mb-1">
            Poll Edition Title
          </label>
          <input
            type="text"
            value={editionTitle}
            onChange={(e) => setEditionTitle(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#111111] border border-[#282828] rounded text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-[#888888] mb-1">
            Official Release Date
          </label>
          <input
            type="date"
            value={rankingDate}
            onChange={(e) => setRankingDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#111111] border border-[#282828] rounded text-xs text-white"
          />
        </div>
      </div>

      {/* Table Editor */}
      <div className="bg-[#181818] border border-[#282828] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#282828] bg-[#141414] text-[#888888] uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-3 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-3">Conference</th>
                <th className="py-3 px-3">Record</th>
                <th className="py-3 px-3 text-center">Prev</th>
                <th className="py-3 px-3 text-center">Points</th>
                <th className="py-3 px-3 text-center">1st Votes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {rankings.map((item, idx) => (
                <tr key={item.rank} className="hover:bg-[#202020] transition-colors">
                  <td className="py-2.5 px-3 text-center font-black text-white">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#252525] text-xs">
                      #{item.rank}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-white">
                    {item.team}
                  </td>
                  <td className="py-2.5 px-3 text-[#B5B5B5]">
                    {item.conference}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">
                    <input
                      type="text"
                      value={item.record}
                      onChange={(e) => handleRankChange(idx, 'record', e.target.value)}
                      className="w-16 px-1.5 py-1 bg-[#111111] border border-[#282828] rounded text-center text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-center text-[#888888]">
                    <input
                      type="number"
                      value={item.previousRank}
                      onChange={(e) => handleRankChange(idx, 'previousRank', Number(e.target.value))}
                      className="w-12 px-1 py-1 bg-[#111111] border border-[#282828] rounded text-center text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-center text-[#888888]">
                    <input
                      type="number"
                      value={item.points}
                      onChange={(e) => handleRankChange(idx, 'points', Number(e.target.value))}
                      className="w-16 px-1.5 py-1 bg-[#111111] border border-[#282828] rounded text-center text-xs"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-center text-[#888888]">
                    <input
                      type="number"
                      value={item.firstPlaceVotes || 0}
                      onChange={(e) => handleRankChange(idx, 'firstPlaceVotes', Number(e.target.value))}
                      className="w-12 px-1 py-1 bg-[#111111] border border-[#282828] rounded text-center text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
