import React from 'react';
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Zap,
  TrendingUp,
  TrendingDown,
  SunMedium,
  CheckCircle2,
  Cpu,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PowerLoadChart } from '../common/PowerLoadChart';
import { GridMap } from '../common/GridMap';
import {
  GridMetrics,
  GridAsset,
  AIReliabilityPrediction,
} from '../../types/grid';

interface OverviewViewProps {
  metrics: GridMetrics;
  assets: GridAsset[];
  predictions: AIReliabilityPrediction[];
  onSelectAsset: (asset: GridAsset) => void;
  onOpenPredictionAnalysis: (pred: AIReliabilityPrediction) => void;
  onNavigate: (view: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  assets,
  predictions,
  onSelectAsset,
  onOpenPredictionAnalysis,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Header & Live Grid Status Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-[#16A34A] uppercase">
              ● GRID STATUS: STABLE
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch'] mt-1">
            Grid Reliability Overview
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time intelligence for monitoring and predicting grid reliability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('simulator')}
            className="px-4 py-2 bg-[#EAF3FF] hover:bg-blue-100 text-[#0F3D91] font-bold text-xs font-mono rounded-xl border border-blue-200 transition-colors cursor-pointer"
          >
            Launch What-If Simulator
          </button>
          <button
            onClick={() => onNavigate('copilot')}
            className="px-4 py-2 bg-[#0F3D91] hover:bg-[#1976D2] text-white font-bold text-xs font-mono rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Grid Copilot</span>
          </button>
        </div>
      </div>

      {/* 2. Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Reliability Score */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs card-shadow-hover transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>RELIABILITY SCORE</span>
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#16A34A] mt-2">
            {metrics.reliabilityScore}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1 font-mono">Status: Excellent</div>
          <div className="mt-2 text-[10px] text-[#16A34A] font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>↑ 1.4% from yesterday</span>
          </div>
        </div>

        {/* Card 2: Current Load */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs card-shadow-hover transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>CURRENT LOAD</span>
            <Activity className="w-4 h-4 text-[#1976D2]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#0F3D91] mt-2">
            {metrics.systemLoadPct}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1 font-mono">Status: Normal</div>
          <div className="mt-2 text-[10px] text-amber-600 font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>↑ 4.2% from yesterday</span>
          </div>
        </div>

        {/* Card 3: Fault Risk */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs card-shadow-hover transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>FAULT RISK</span>
            <AlertTriangle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-[#16A34A] mt-2">
            {metrics.faultRiskPct}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1 font-mono">Status: Low</div>
          <div className="mt-2 text-[10px] text-[#16A34A] font-mono flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>↓ 2.1% from last week</span>
          </div>
        </div>

        {/* Card 4: Active Alerts */}
        <div
          onClick={() => onNavigate('alerts')}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs card-shadow-hover transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>ACTIVE ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-[#F59E0B] mt-2 group-hover:scale-105 transition-transform">
            {metrics.activeAlertsCount}
          </div>
          <div className="text-[11px] text-[#DC2626] font-mono mt-1 font-bold">
            Attention Required
          </div>
          <div className="mt-2 text-[10px] text-[#64748B] font-mono">
            1 High • 2 Med
          </div>
        </div>

        {/* Card 5: Connected Assets */}
        <div
          onClick={() => onNavigate('equipment')}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs card-shadow-hover transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>CONNECTED ASSETS</span>
            <Cpu className="w-4 h-4 text-[#0F3D91]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#172033] mt-2">
            {metrics.connectedAssetsCount}
          </div>
          <div className="text-[11px] text-[#16A34A] mt-1 font-mono font-bold">100% Online</div>
          <div className="mt-2 text-[10px] text-[#64748B] font-mono">
            107 Healthy • 16 Warn
          </div>
        </div>

        {/* Card 6: Renewable Contribution */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs card-shadow-hover transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>RENEWABLE MIX</span>
            <SunMedium className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-500 mt-2">
            {metrics.renewableContributionPct}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1 font-mono">Solar + Wind</div>
          <div className="mt-2 text-[10px] text-[#16A34A] font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>↑ 3.5% vs average</span>
          </div>
        </div>
      </div>

      {/* 3. LIVE GRID STATUS (Large Dedicated Panel with 4 Metrics) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch']">
              Live Grid Status
            </h3>
            <p className="text-xs text-[#64748B]">
              Real-time electrical telemetry stream with nominal tolerance verification
            </p>
          </div>
          <span className="text-xs font-mono text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
            ● Nominal Tolerance
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Voltage */}
          <div className="bg-[#F6F9FC] p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>VOLTAGE</span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            </div>
            <div className="text-3xl font-black font-mono text-[#172033] mt-2">
              {metrics.voltage} <span className="text-sm font-normal text-[#64748B]">V</span>
            </div>
            <div className="text-[11px] text-[#16A34A] font-mono mt-1">Normal (230V ±5%)</div>
          </div>

          {/* Frequency */}
          <div className="bg-[#F6F9FC] p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>FREQUENCY</span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            </div>
            <div className="text-3xl font-black font-mono text-[#172033] mt-2">
              {metrics.frequency} <span className="text-sm font-normal text-[#64748B]">Hz</span>
            </div>
            <div className="text-[11px] text-[#16A34A] font-mono mt-1">Normal (50.00 Hz Target)</div>
          </div>

          {/* Current */}
          <div className="bg-[#F6F9FC] p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>CURRENT</span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            </div>
            <div className="text-3xl font-black font-mono text-[#172033] mt-2">
              {metrics.current} <span className="text-sm font-normal text-[#64748B]">A</span>
            </div>
            <div className="text-[11px] text-[#16A34A] font-mono mt-1">Balanced Load</div>
          </div>

          {/* Power Factor */}
          <div className="bg-[#F6F9FC] p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>POWER FACTOR</span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            </div>
            <div className="text-3xl font-black font-mono text-[#172033] mt-2">
              {metrics.powerFactor} <span className="text-sm font-normal text-[#64748B]">cos φ</span>
            </div>
            <div className="text-[11px] text-[#16A34A] font-mono mt-1">Normal (Lagging)</div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B] font-mono">
          <span>System Load: {metrics.systemLoadPct}% of Distribution Headroom</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#1976D2]" />
            <span>Last updated: {metrics.lastUpdated}</span>
          </span>
        </div>
      </div>

      {/* 4. Power Load Chart */}
      <PowerLoadChart
        currentLoadMW={metrics.currentLoadMW}
        peakLoadMW={metrics.peakLoadMW}
        averageLoadMW={metrics.averageLoadMW}
      />

      {/* 5. Grid Network Map */}
      <GridMap assets={assets} onSelectAsset={onSelectAsset} />

      {/* 6. AI Reliability Prediction Section with "View AI Analysis" */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1976D2]" />
              <span>AI Reliability Intelligence</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Predictive risk projections across 5 core electrical grid vulnerability vectors
            </p>
          </div>
          <span className="text-xs font-mono text-[#0F3D91] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-bold">
            Overall Risk: LOW (8%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {predictions.map((pred) => (
            <div
              key={pred.id}
              className="bg-[#F6F9FC] border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between hover:border-[#1976D2] hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#64748B] uppercase font-bold text-[10px]">
                    {pred.category}
                  </span>
                  <span
                    className={`font-bold ${
                      pred.probabilityPct > 15
                        ? 'text-[#DC2626]'
                        : pred.probabilityPct > 10
                        ? 'text-[#F59E0B]'
                        : 'text-[#16A34A]'
                    }`}
                  >
                    {pred.probabilityPct}%
                  </span>
                </div>

                <div className="mt-2 text-2xl font-black font-mono text-[#172033]">
                  {pred.probabilityPct}%
                </div>

                <div className="text-[11px] text-[#64748B] mt-1 leading-snug line-clamp-2">
                  {pred.shortExplanation}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={() => onOpenPredictionAnalysis(pred)}
                  className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-[#0F3D91] font-bold text-xs font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View AI Analysis</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
