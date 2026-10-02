import React from 'react';
import {
  Zap,
  Activity,
  Gauge,
  Compass,
  BatteryCharging,
  SunMedium,
  TrendingUp,
} from 'lucide-react';
import { GridTelemetry } from '../types/grid';

interface LiveTelemetryBarProps {
  telemetry: GridTelemetry;
}

export const LiveTelemetryBar: React.FC<LiveTelemetryBarProps> = ({ telemetry }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'WARNING':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'CRITICAL':
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800/30';
    }
  };

  return (
    <div className="w-full bg-[#081120] border-b border-cyan-950/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
        {/* Voltage */}
        <div className="bg-[#0b172c] border border-cyan-900/40 rounded-lg p-2 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>VOLTAGE</span>
            <Zap className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-cyan-100">{telemetry.voltage}</span>
            <span className="text-[10px] text-cyan-400 font-mono">V</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Nominal: 230V ±5%</div>
        </div>

        {/* Current */}
        <div className="bg-[#0b172c] border border-cyan-900/40 rounded-lg p-2 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>CURRENT</span>
            <Activity className="w-3 h-3 text-blue-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-blue-100">{telemetry.current}</span>
            <span className="text-[10px] text-blue-400 font-mono">A</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Phase Balanced</div>
        </div>

        {/* Power */}
        <div className="bg-[#0b172c] border border-cyan-900/40 rounded-lg p-2 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>POWER</span>
            <TrendingUp className="w-3 h-3 text-cyan-300" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-cyan-200">{telemetry.power}</span>
            <span className="text-[10px] text-cyan-400 font-mono">{telemetry.powerUnit}</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Active Power</div>
        </div>

        {/* Frequency */}
        <div className="bg-[#0b172c] border border-cyan-900/40 rounded-lg p-2 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>FREQUENCY</span>
            <Gauge className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-emerald-200">{telemetry.frequency}</span>
            <span className="text-[10px] text-emerald-400 font-mono">Hz</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Target: 50.00 Hz</div>
        </div>

        {/* Power Factor */}
        <div className="bg-[#0b172c] border border-cyan-900/40 rounded-lg p-2 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>POWER FACTOR</span>
            <Compass className="w-3 h-3 text-purple-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-purple-200">{telemetry.powerFactor}</span>
            <span className="text-[10px] text-purple-400 font-mono">cos φ</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Lagging (Normal)</div>
        </div>

        {/* System Load */}
        <div className="bg-[#0b172c] border border-cyan-900/40 rounded-lg p-2 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>SYSTEM LOAD</span>
            <Activity className="w-3 h-3 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-sky-200">{telemetry.loadMW}</span>
            <span className="text-[10px] text-sky-400 font-mono">MW</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Peak: {telemetry.peakLoadMW} MW</div>
        </div>

        {/* Energy Today */}
        <div className="bg-[#0b172c] border border-cyan-900/40 rounded-lg p-2 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>ENERGY TODAY</span>
            <Zap className="w-3 h-3 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-amber-200">{telemetry.energyTodayMWh}</span>
            <span className="text-[10px] text-amber-400 font-mono">MWh</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono">Cumulative 24h</div>
        </div>

        {/* Renewable Gen */}
        <div className="bg-[#0b172c] border border-cyan-900/40 rounded-lg p-2 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>RENEWABLE</span>
            <SunMedium className="w-3 h-3 text-yellow-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-yellow-200">{telemetry.renewableGenerationMW}</span>
            <span className="text-[10px] text-yellow-400 font-mono">MW</span>
          </div>
          <div className="text-[9px] text-yellow-300/80 font-mono">{telemetry.renewablePercentage}% of Load</div>
        </div>

        {/* Battery Status */}
        <div className="bg-[#0b172c] border border-cyan-900/40 rounded-lg p-2 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>BATTERY BESS</span>
            <BatteryCharging className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-emerald-200">{telemetry.batteryStatus.soc}</span>
            <span className="text-[10px] text-emerald-400 font-mono">% SoC</span>
          </div>
          <div className="text-[9px] text-emerald-400/80 font-mono">+{telemetry.batteryStatus.powerMW} MW Chg</div>
        </div>

        {/* Grid Status */}
        <div
          className={`border rounded-lg p-2 flex flex-col justify-between transition-colors ${getStatusColor(
            telemetry.gridStatus
          )}`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono opacity-80">
            <span>GRID STATUS</span>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          </div>
          <div className="mt-1">
            <span className="text-base font-extrabold font-mono tracking-wider">{telemetry.gridStatus}</span>
          </div>
          <div className="text-[9px] opacity-80 font-mono">Autonomous Reg.</div>
        </div>
      </div>
    </div>
  );
};
