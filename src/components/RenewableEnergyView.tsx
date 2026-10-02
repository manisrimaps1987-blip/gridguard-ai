import React from 'react';
import {
  SunMedium,
  Wind,
  BatteryCharging,
  Zap,
  Activity,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Leaf,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { RenewableMetrics, GridTelemetry } from '../types/grid';

interface RenewableEnergyViewProps {
  renewable: RenewableMetrics;
  telemetry: GridTelemetry;
  onOpenCopilot: () => void;
}

export const RenewableEnergyView: React.FC<RenewableEnergyViewProps> = ({
  renewable,
  telemetry,
  onOpenCopilot,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SunMedium className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              Renewable Energy Generation & BESS Storage Architecture
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of utility solar parks, wind turbines, battery state of charge (SoC), and carbon offset
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-xl text-emerald-300 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Avoided CO₂ Today: {renewable.carbonAvoidedTonsToday} Metric Tons</span>
          </div>
        </div>
      </div>

      {/* Renewable KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Solar */}
        <div className="bg-[#081223] border border-yellow-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>SOLAR ARRAY</span>
            <SunMedium className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-yellow-300 mt-1">
            {renewable.solarMW} <span className="text-xs font-normal">MW</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Cap: {renewable.solarCapacityMW} MW (63%)</div>
        </div>

        {/* Wind */}
        <div className="bg-[#081223] border border-cyan-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>WIND TURBINES</span>
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
            {renewable.windMW} <span className="text-xs font-normal">MW</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Cap: {renewable.windCapacityMW} MW (51%)</div>
        </div>

        {/* Total Renewable Inflow */}
        <div className="bg-[#081223] border border-emerald-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>TOTAL GREEN INFLOW</span>
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
            {renewable.totalRenewableMW} <span className="text-xs font-normal">MW</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            {renewable.renewableSharePercent}% of System Load
          </div>
        </div>

        {/* Battery Storage SoC */}
        <div className="bg-[#081223] border border-emerald-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>BESS BATTERY SoC</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {renewable.batterySoc}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            {renewable.batteryPowerMW > 0 ? `Charging (${renewable.batteryPowerMW} MW)` : `Discharging`}
          </div>
        </div>

        {/* Grid Import */}
        <div className="bg-[#081223] border border-cyan-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>GRID IMPORT</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-300 mt-1">
            {renewable.gridImportMW} <span className="text-xs font-normal">MW</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">External Tie-Line Flow</div>
        </div>

        {/* Grid Export */}
        <div className="bg-[#081223] border border-cyan-900/40 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>GRID EXPORT</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-1">
            {renewable.gridExportMW} <span className="text-xs font-normal">MW</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Surplus Feed-in Tariff</div>
        </div>
      </div>

      {/* Dynamic Power Flow Diagram (SVG Animation) */}
      <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white font-['Chakra_Petch'] mb-2">
          Dynamic System Power Flow Topology
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Real-time electrical energy exchange between distributed generation, storage, and customer loads
        </p>

        <div className="relative bg-[#050b14] border border-cyan-950 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          {/* Left: Sources */}
          <div className="flex flex-col gap-4 w-full md:w-56">
            {/* Solar Node */}
            <div className="bg-[#0c182d] border border-yellow-800/40 p-3 rounded-xl flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-yellow-950/80 flex items-center justify-center text-yellow-400">
                <SunMedium className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Solar Farm</div>
                <div className="text-sm font-mono font-bold text-yellow-400">{renewable.solarMW} MW</div>
              </div>
            </div>

            {/* Wind Node */}
            <div className="bg-[#0c182d] border border-cyan-800/40 p-3 rounded-xl flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/80 flex items-center justify-center text-cyan-400">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Wind Park</div>
                <div className="text-sm font-mono font-bold text-cyan-400">{renewable.windMW} MW</div>
              </div>
            </div>

            {/* Grid Import Node */}
            <div className="bg-[#0c182d] border border-blue-800/40 p-3 rounded-xl flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-950/80 flex items-center justify-center text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Transmission Tie</div>
                <div className="text-sm font-mono font-bold text-blue-400">{renewable.gridImportMW} MW</div>
              </div>
            </div>
          </div>

          {/* Center: Grid Busbar & Battery Hub */}
          <div className="flex flex-col items-center justify-center text-center p-6 bg-[#081426] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)] w-full md:w-64 relative">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-2">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-xs font-mono uppercase text-slate-400">CENTRAL 33kV BUSBAR</div>
            <div className="text-2xl font-extrabold font-mono text-cyan-200 mt-1">
              {telemetry.loadMW} MW
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
              Net Frequency: {telemetry.frequency} Hz
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-950 w-full flex items-center justify-around text-xs font-mono">
              <div>
                <span className="text-slate-500">BESS SoC</span>
                <div className="text-emerald-400 font-bold">{renewable.batterySoc}%</div>
              </div>
              <div>
                <span className="text-slate-500">Mode</span>
                <div className="text-cyan-300 font-bold">
                  {renewable.batteryPowerMW > 0 ? 'Charging' : 'Idle'}
                </div>
              </div>
            </div>
          </div>

          {/* Right: End Use Loads & Customers */}
          <div className="flex flex-col gap-4 w-full md:w-56">
            <div className="bg-[#0c182d] border border-cyan-900/50 p-3 rounded-xl flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Industrial Feeders</div>
                <div className="text-sm font-mono font-bold text-cyan-300">2.8 MW Load</div>
              </div>
            </div>

            <div className="bg-[#0c182d] border border-cyan-900/50 p-3 rounded-xl flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Commercial District</div>
                <div className="text-sm font-mono font-bold text-blue-300">1.1 MW Load</div>
              </div>
            </div>

            <div className="bg-[#0c182d] border border-cyan-900/50 p-3 rounded-xl flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Renewable Storage</div>
                <div className="text-sm font-mono font-bold text-emerald-300">+0.8 MW Stored</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
          <span>Renewable Integration Compliance: IEEE 1547-2018</span>
          <button onClick={onOpenCopilot} className="text-cyan-400 hover:underline">
            Ask Copilot: “How can I increase renewable penetration?”
          </button>
        </div>
      </div>
    </div>
  );
};
