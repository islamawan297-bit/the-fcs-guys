'use client';

import React, { useState } from 'react';
import { CONFERENCES_DATA } from '@/data/fcs-data';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminStandingsPage() {
  const [selectedConfId, setSelectedConfId] = useState(CONFERENCES_DATA[0].id);
  const [conferences, setConferences] = useState(CONFERENCES_DATA);
  const [message, setMessage] = useState('');

  const currentConf = conferences.find((c) => c.id === selectedConfId) || conferences[0];

  const handleStandingChange = (teamIndex: number, field: string, val: string) => {
    const updated = [...conferences];
    const confIdx = updated.findIndex((c) => c.id === selectedConfId);
    if (confIdx >= 0) {
      updated[confIdx].standings[teamIndex] = {
        ...updated[confIdx].standings[teamIndex],
        [field]: val,
      };
      setConferences(updated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(`Standings updated and synchronized for ${currentConf.name}.`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282828] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Conference Standings Editor
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Manual correction & entry for conference records, overall records, streaks, and splits.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-lg bg-[#FFD400] text-[#080808] font-black text-xs uppercase tracking-wider hover:bg-[#E5BE00] flex items-center shadow-lg transition-colors shrink-0"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Changes
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Conference Switch Tabs */}
      <div className="flex flex-wrap gap-2">
        {conferences.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedConfId(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              c.id === selectedConfId
                ? 'bg-[#FFD400] text-[#080808]'
                : 'bg-[#181818] border border-[#282828] text-[#B5B5B5] hover:text-white'
            }`}
          >
            {c.shortName}
          </button>
        ))}
      </div>

      {/* Standings Table Editor */}
      <div className="bg-[#181818] border border-[#282828] rounded-xl overflow-hidden shadow-lg">
        <div className="p-3 bg-[#141414] border-b border-[#282828] font-bold text-xs text-white">
          Editing: {currentConf.name}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#282828] bg-[#141414] text-[#888888] uppercase font-bold text-[10px] tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">POS</th>
                <th className="py-2.5 px-4">School</th>
                <th className="py-2.5 px-3 text-center">Conf Record</th>
                <th className="py-2.5 px-3 text-center">Overall</th>
                <th className="py-2.5 px-3 text-center">Home</th>
                <th className="py-2.5 px-3 text-center">Away</th>
                <th className="py-2.5 px-3 text-center">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {currentConf.standings.map((team, idx) => (
                <tr key={team.team} className="hover:bg-[#202020] transition-colors">
                  <td className="py-2 px-3 text-center font-bold text-[#666666]">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-4 font-bold text-white">
                    {team.team}
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-[#FFD400]">
                    <input
                      type="text"
                      value={team.confRecord}
                      onChange={(e) => handleStandingChange(idx, 'confRecord', e.target.value)}
                      className="w-16 px-1.5 py-0.5 bg-[#111111] border border-[#282828] rounded text-center text-xs text-[#FFD400] font-bold"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="text"
                      value={team.overallRecord}
                      onChange={(e) => handleStandingChange(idx, 'overallRecord', e.target.value)}
                      className="w-16 px-1.5 py-0.5 bg-[#111111] border border-[#282828] rounded text-center text-xs text-white font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="text"
                      value={team.homeRecord}
                      onChange={(e) => handleStandingChange(idx, 'homeRecord', e.target.value)}
                      className="w-16 px-1.5 py-0.5 bg-[#111111] border border-[#282828] rounded text-center text-xs text-[#888888]"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="text"
                      value={team.awayRecord}
                      onChange={(e) => handleStandingChange(idx, 'awayRecord', e.target.value)}
                      className="w-16 px-1.5 py-0.5 bg-[#111111] border border-[#282828] rounded text-center text-xs text-[#888888]"
                    />
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="text"
                      value={team.streak}
                      onChange={(e) => handleStandingChange(idx, 'streak', e.target.value)}
                      className="w-14 px-1.5 py-0.5 bg-[#111111] border border-[#282828] rounded text-center text-xs font-bold"
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
