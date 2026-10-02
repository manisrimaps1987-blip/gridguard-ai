import React, { useState } from 'react';
import {
  Layers,
  Activity,
  Zap,
  TrendingUp,
  BarChart3,
  SunMedium,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { GridMetrics } from '../../types/grid';

interface AnalyticsViewProps {
  metrics: GridMetrics;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ metrics }) => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '1Y'>('7D');

  const generationMix = [
    { source: 'Utility Solar PV', share: 22, color: 'bg-amber-400', mw: '4.8 MW' },
    { source: 'Coastal Wind', share: 12, color: 'bg-sky-400', mw: '2.6 MW' },
    { source: 'Hydro Baseload', share: 18, color: 'bg-blue-600', mw: '3.9 MW' },
    { source: 'Grid Tie Import', share: 40, color: 'bg-indigo-700', mw: '8.7 MW' },
    { source: 'BESS Battery Arbitrage', share: 8, color: 'bg-emerald-500', mw: '1.7 MW' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0F3D91]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              Grid Performance & Reliability Analytics
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Long-term historical load trends, voltage unbalance indices, and generation fuel mix
          </p>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex items-center bg-[#F6F9FC] p-1 rounded-xl border border-slate-200 text-xs font-mono">
          {(['7D', '30D', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === tf
                  ? 'bg-white text-[#0F3D91] font-bold shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-mono text-[#64748B] uppercase">VOLTAGE STABILITY INDEX</div>
          <div className="text-2xl font-black font-mono text-[#16A34A] mt-2">99.2%</div>
          <div className="text-xs text-[#16A34A] font-mono mt-1">Within IEEE 519 Band</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-mono text-[#64748B] uppercase">FREQUENCY REGULATION</div>
          <div className="text-2xl font-black font-mono text-[#16A34A] mt-2">49.98 Hz</div>
          <div className="text-xs text-[#64748B] font-mono mt-1">±0.04 Hz RMS Drift</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-mono text-[#64748B] uppercase">EQUIPMENT MTBF</div>
          <div className="text-2xl font-black font-mono text-slate-800 mt-2">1,420 Days</div>
          <div className="text-xs text-[#16A34A] font-mono mt-1">Zero Forced Outages</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-mono text-[#64748B] uppercase">RENEWABLE FRACTION</div>
          <div className="text-2xl font-black font-mono text-amber-500 mt-2">34.0%</div>
          <div className="text-xs text-[#64748B] font-mono mt-1">Solar + Wind + BESS</div>
        </div>
      </div>

      {/* Generation Mix & Voltage Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Fuel Mix */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] mb-2">
            Energy Generation & Resource Mix
          </h3>
          <p className="text-xs text-[#64748B] mb-4">
            Active power generation sources delivering energy into the 132kV regional ring
          </p>

          <div className="space-y-3 font-mono text-xs">
            {generationMix.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#172033] font-medium">{item.source}</span>
                  <span className="font-bold text-[#0F3D91]">{item.mw} ({item.share}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.share}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voltage Stability & Harmonics Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] mb-2">
            Harmonic Distortion & Phase Balance
          </h3>
          <p className="text-xs text-[#64748B] mb-4">
            Sub-cycle power quality compliance across distribution busbars
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#F6F9FC] rounded-xl border border-slate-200/80">
              <span className="text-[#64748B] text-[10px]">TOTAL HARMONIC DISTORTION</span>
              <div className="text-2xl font-bold text-[#16A34A] mt-1">1.4%</div>
              <div className="text-[10px] text-[#64748B]">Limit: &lt; 5.0% (IEEE 519)</div>
            </div>

            <div className="p-3 bg-[#F6F9FC] rounded-xl border border-slate-200/80">
              <span className="text-[#64748B] text-[10px]">PHASE UNBALANCE</span>
              <div className="text-2xl font-bold text-[#16A34A] mt-1">0.26%</div>
              <div className="text-[10px] text-[#64748B]">Limit: &lt; 2.0%</div>
            </div>

            <div className="p-3 bg-[#F6F9FC] rounded-xl border border-slate-200/80">
              <span className="text-[#64748B] text-[10px]">CREST FACTOR</span>
              <div className="text-2xl font-bold text-[#0F3D91] mt-1">1.414</div>
              <div className="text-[10px] text-[#64748B]">Pure Sine Profile</div>
            </div>

            <div className="p-3 bg-[#F6F9FC] rounded-xl border border-slate-200/80">
              <span className="text-[#64748B] text-[10px]">TRANSIENT SAG EVENTS</span>
              <div className="text-2xl font-bold text-[#16A34A] mt-1">1</div>
              <div className="text-[10px] text-[#64748B]">Past 7 Days (Resolved)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
