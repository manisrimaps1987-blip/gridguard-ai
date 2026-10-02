import React, { useState } from 'react';
import {
  Cpu,
  Thermometer,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Droplets,
  Wind,
  Filter,
} from 'lucide-react';
import { Substation, Transformer, GridStatus } from '../types/grid';

interface TransformerSubstationViewProps {
  substations: Substation[];
  transformers: Transformer[];
  onOpenCopilot: () => void;
}

export const TransformerSubstationView: React.FC<TransformerSubstationViewProps> = ({
  substations,
  transformers,
  onOpenCopilot,
}) => {
  const [activeTab, setActiveTab] = useState<'transformers' | 'substations'>('transformers');
  const [substationFilter, setSubstationFilter] = useState<string>('ALL');

  const filteredSubstations =
    substationFilter === 'ALL'
      ? substations
      : substations.filter((s) => s.status === substationFilter);

  const getHealthBadge = (health: number) => {
    if (health >= 85) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
    if (health >= 65) return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
    return 'text-rose-400 bg-rose-950/60 border-rose-800/40';
  };

  const getStatusBadge = (status: GridStatus) => {
    switch (status) {
      case 'NORMAL':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'WARNING':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/40';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Selector & Stats */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              Transformer Fleet & Substation Asset Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time thermal monitoring, oil degradation analysis, and substation load capacities
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#060c18] border border-cyan-950 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('transformers')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'transformers'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Power Transformers ({transformers.length})
          </button>
          <button
            onClick={() => setActiveTab('substations')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'substations'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Substations ({substations.length})
          </button>
        </div>
      </div>

      {activeTab === 'transformers' ? (
        /* TRANSFORMER MONITORING VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformers.map((tr) => (
              <div
                key={tr.id}
                className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-3">
                    <div>
                      <div className="text-xs font-mono text-cyan-400 font-bold">{tr.id}</div>
                      <h4 className="text-base font-bold text-white font-['Chakra_Petch']">
                        {tr.name}
                      </h4>
                      <div className="text-[11px] text-slate-400 truncate">{tr.substationName}</div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                          tr.status === 'Healthy'
                            ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40'
                            : tr.status === 'Warning'
                            ? 'text-amber-400 bg-amber-950/60 border-amber-800/40'
                            : 'text-rose-400 bg-rose-950/60 border-rose-800/40 animate-pulse'
                        }`}
                      >
                        {tr.status}
                      </span>
                      <div className="text-xs font-bold font-mono text-cyan-300 mt-1">
                        Health: {tr.healthIndicator}%
                      </div>
                    </div>
                  </div>

                  {/* Thermal Gauges Row */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-mono">
                    <div className="bg-[#0b172a] p-2.5 rounded-xl border border-cyan-950">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>WINDING TEMP</span>
                        <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                      <div className="text-lg font-bold text-slate-100 mt-1">
                        {tr.windingTempC}°C
                      </div>
                      <div className="text-[10px] text-slate-400">Limit: 95°C</div>
                    </div>

                    <div className="bg-[#0b172a] p-2.5 rounded-xl border border-cyan-950">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>OIL TOP TEMP</span>
                        <Droplets className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="text-lg font-bold text-slate-100 mt-1">{tr.oilTempC}°C</div>
                      <div className="text-[10px] text-slate-400">Limit: 85°C</div>
                    </div>
                  </div>

                  {/* Electrical Loading */}
                  <div className="space-y-2 text-xs font-mono bg-[#091322] p-3 rounded-xl border border-cyan-950 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rated Capacity</span>
                      <span className="text-slate-200 font-bold">{tr.ratedMVA} MVA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Load Ratio</span>
                      <span className="text-cyan-300 font-bold">{tr.loadPercentage}%</span>
                    </div>
                    {/* Load bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          tr.loadPercentage > 90
                            ? 'bg-rose-500'
                            : tr.loadPercentage > 75
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${tr.loadPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Voltage Prim/Sec</span>
                      <span className="text-slate-300">
                        {tr.voltagePrimaryKV}kV / {tr.voltageSecondaryKV}kV
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current / PF</span>
                      <span className="text-slate-300">
                        {tr.currentAmps} A | PF {tr.powerFactor}
                      </span>
                    </div>
                  </div>

                  {/* Cooling & DGA Diagnostics */}
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Cooling Radiator:</span>
                      <span className="text-cyan-300 flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        <span>{tr.coolingStatus}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Dissolved Gas (DGA):</span>
                      <span
                        className={`font-semibold ${
                          tr.dgaStatus === 'Normal'
                            ? 'text-emerald-400'
                            : tr.dgaStatus === 'Trace Gases'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {tr.dgaStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Oil Dielectric Index: {tr.oilQualityIndex}%</span>
                    <button onClick={onOpenCopilot} className="text-cyan-400 hover:underline">
                      Diagnose Thermal Drift
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SUBSTATIONS FLEET VIEW */
        <div className="space-y-6">
          {/* Substation Filters */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Status:
            </span>
            {['ALL', 'NORMAL', 'WARNING', 'CRITICAL', 'OFFLINE'].map((status) => (
              <button
                key={status}
                onClick={() => setSubstationFilter(status)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  substationFilter === status
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'bg-[#081223] text-slate-400 hover:text-slate-200 border border-cyan-950'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0c182f] text-slate-400 uppercase text-[10px] border-b border-cyan-950">
                  <tr>
                    <th className="py-3 px-3">Substation ID & Name</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Voltage Level</th>
                    <th className="py-3 px-3">Active Load / Cap</th>
                    <th className="py-3 px-3">Load %</th>
                    <th className="py-3 px-3">Frequency / PF</th>
                    <th className="py-3 px-3">Temperature</th>
                    <th className="py-3 px-3">Health Score</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredSubstations.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white text-sm">{s.name}</div>
                        <div className="text-[10px] text-cyan-400">{s.code} | {s.location}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{s.type}</td>
                      <td className="py-3 px-3 font-bold text-slate-200">{s.voltageLevelKV} kV</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-cyan-300">{s.loadMW} MW</div>
                        <div className="text-[10px] text-slate-500">Cap: {s.capacityMW} MW</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              s.loadPercentage > 90
                                ? 'bg-rose-500'
                                : s.loadPercentage > 75
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                            style={{ width: `${s.loadPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-400">{s.loadPercentage}%</span>
                      </td>
                      <td className="py-3 px-3">
                        <div>{s.frequencyHz.toFixed(2)} Hz</div>
                        <div className="text-[10px] text-slate-500">PF {s.powerFactor}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold ${
                            s.temperatureC > 70
                              ? 'text-rose-400'
                              : s.temperatureC > 50
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {s.temperatureC}°C
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded border text-[11px] font-bold ${getHealthBadge(
                            s.healthScore
                          )}`}
                        >
                          {s.healthScore} / 100
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold border ${getStatusBadge(
                            s.status
                          )}`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
