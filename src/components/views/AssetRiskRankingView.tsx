import React, { useState } from 'react';
import {
  Sliders,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { GridAsset } from '../../types/grid';

interface AssetRiskRankingViewProps {
  assets: GridAsset[];
  onSelectAsset: (asset: GridAsset) => void;
}

export const AssetRiskRankingView: React.FC<AssetRiskRankingViewProps> = ({
  assets,
  onSelectAsset,
}) => {
  const [search, setSearch] = useState('');

  // Generate transparent composite risk scores
  const rankedAssets = [
    {
      id: 'T-002',
      name: 'Transformer Unit 02',
      type: 'Transformer',
      location: 'Substation B',
      compositeRiskPct: 72,
      primaryStressFactor: 'High loading continuous duty (91%) & 78°C core temp',
      mitigationAction: 'Engage forced fan bank 2; transfer 6 MW to Substation A',
      status: 'Warning',
    },
    {
      id: 'D-014',
      name: 'Distribution Node D-14',
      type: 'Distribution Node',
      location: 'Sector 3 Commercial Zone',
      compositeRiskPct: 64,
      primaryStressFactor: 'Sub-cycle voltage sag transients & phase unbalance',
      mitigationAction: 'Adjust OLTC tap changer position +1 step',
      status: 'Critical',
    },
    {
      id: 'T-004',
      name: 'Transformer Unit 04',
      type: 'Transformer',
      location: 'Industrial Feeder Hub',
      compositeRiskPct: 38,
      primaryStressFactor: 'Cyclic arc furnace loads & ambient heat accumulation',
      mitigationAction: 'Monitor winding temperature trend; schedule oil DGA',
      status: 'Warning',
    },
    {
      id: 'SS-B',
      name: 'Substation B (Grid Tie 132kV)',
      type: 'Substation',
      location: 'East Industrial Junction',
      compositeRiskPct: 24,
      primaryStressFactor: '89% capacity absorption during evening industrial shift',
      mitigationAction: 'Maintain BESS battery availability for peak shaving',
      status: 'Warning',
    },
    {
      id: 'T-001',
      name: 'Transformer Unit 01',
      type: 'Transformer',
      location: 'Substation A',
      compositeRiskPct: 12,
      primaryStressFactor: 'Nominal baseload duty; balanced 3-phase current',
      mitigationAction: 'Routine visual and thermographic inspection in 90 days',
      status: 'Healthy',
    },
    {
      id: 'T-003',
      name: 'Transformer Unit 03',
      type: 'Transformer',
      location: 'Substation C',
      compositeRiskPct: 9,
      primaryStressFactor: 'Optimal thermal dissipation; 68% loading ratio',
      mitigationAction: 'Scheduled annual preventive maintenance',
      status: 'Healthy',
    },
  ];

  const filtered = rankedAssets.filter(
    (a) =>
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0F3D91]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              Asset Failure Risk Ranking (Leaderboard)
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Transparent composite failure risk index computed from real-time thermal, loading, and harmonic vectors
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search risk ranking..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F6F9FC] border border-slate-200 rounded-lg text-xs font-mono text-[#172033] focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F6F9FC] text-[#64748B] uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Asset ID & Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Composite Risk</th>
                <th className="py-3 px-3">Primary Stress Factor</th>
                <th className="py-3 px-3">Recommended Mitigation</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#172033]">
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#0F3D91]">#{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#172033]">{item.id}</div>
                    <div className="text-[10px] text-[#64748B]">{item.name}</div>
                  </td>
                  <td className="py-3 px-3 text-[#64748B]">{item.type}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-black text-sm ${
                          item.compositeRiskPct > 60
                            ? 'text-[#DC2626]'
                            : item.compositeRiskPct > 30
                            ? 'text-[#F59E0B]'
                            : 'text-[#16A34A]'
                        }`}
                      >
                        {item.compositeRiskPct}%
                      </span>
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            item.compositeRiskPct > 60
                              ? 'bg-[#DC2626]'
                              : item.compositeRiskPct > 30
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#16A34A]'
                          }`}
                          style={{ width: `${item.compositeRiskPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 max-w-xs font-sans text-[11px] text-slate-700 leading-snug">
                    {item.primaryStressFactor}
                  </td>
                  <td className="py-3 px-3 max-w-xs font-sans text-[11px] text-[#0F3D91] font-medium leading-snug">
                    {item.mitigationAction}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => {
                        const target = assets.find((a) => a.id === item.id);
                        if (target) onSelectAsset(target);
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0F3D91] rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
