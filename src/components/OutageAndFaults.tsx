import React, { useState } from 'react';
import {
  AlertTriangle,
  Zap,
  Activity,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Sparkles,
  Info,
  Radio,
  Users,
} from 'lucide-react';
import { FaultRecord, OutageEvent, AlertSeverity } from '../types/grid';

interface OutageAndFaultsProps {
  faults: FaultRecord[];
  outages: OutageEvent[];
  onAcknowledgeFault: (id: string) => void;
  onTriggerSimulation: (type: 'VOLTAGE_SAG' | 'TRANSFORMER_OVERHEAT' | 'OUTAGE_TRIP' | 'RESET') => void;
  onOpenCopilot: () => void;
}

export const OutageAndFaults: React.FC<OutageAndFaultsProps> = ({
  faults,
  outages,
  onAcknowledgeFault,
  onTriggerSimulation,
  onOpenCopilot,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredFaults =
    filterSeverity === 'ALL'
      ? faults
      : faults.filter((f) => f.severity === filterSeverity);

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'LOW':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Simulation Controls */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              Power Outage & Anomaly Fault Detection Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine learning anomaly detection (Isolation Forest & Z-Score thresholds) protecting transmission lines and transformers
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => onTriggerSimulation('OUTAGE_TRIP')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-bold transition-colors"
          >
            Trigger Outage Drill
          </button>
          <button
            onClick={() => onTriggerSimulation('VOLTAGE_SAG')}
            className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-700/50 text-amber-300 transition-colors"
          >
            Inject Voltage Sag
          </button>
          <button
            onClick={() => onTriggerSimulation('RESET')}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-700/50 text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Drills</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: POWER OUTAGE DETECTION (Prominent alert banner) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
              Active Power Outage Status
            </h3>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/50">
            Automated Recloser & Sensor Loss Monitoring
          </span>
        </div>

        {outages.length > 0 ? (
          <div className="space-y-3">
            {outages.map((outage) => (
              <div
                key={outage.id}
                className="bg-gradient-to-r from-rose-950/40 via-[#0d172a] to-rose-950/30 border-2 border-rose-500/70 rounded-2xl p-5 shadow-2xl relative overflow-hidden"
              >
                {/* Outage Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-900/60 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded bg-rose-600 text-white font-black font-mono text-sm tracking-widest animate-pulse">
                      OUTAGE DETECTED
                    </span>
                    <span className="text-sm font-bold text-white font-mono">{outage.id}</span>
                    <span className="text-xs text-rose-300 font-mono">
                      Detected: {outage.detectedTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-full bg-rose-900/60 border border-rose-700 text-rose-200 font-bold">
                      Status: {outage.status}
                    </span>
                    <span className="text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>ETA: {outage.etaMinutes} mins</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-[#091322] p-3 rounded-xl border border-cyan-950">
                    <div className="text-[10px] font-mono text-slate-400">LOCATION & SUBSTATION</div>
                    <div className="font-bold text-white mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{outage.location}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Area: {outage.affectedArea}</div>
                  </div>

                  <div className="bg-[#091322] p-3 rounded-xl border border-cyan-950">
                    <div className="text-[10px] font-mono text-slate-400">AFFECTED SCALE</div>
                    <div className="font-bold text-rose-300 mt-1 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{outage.affectedCustomers.toLocaleString()} Customers</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Severity: {outage.estimatedSeverity}</div>
                  </div>

                  <div className="bg-[#091322] p-3 rounded-xl border border-cyan-950">
                    <div className="text-[10px] font-mono text-slate-400">AI ROOT CAUSE DIAGNOSIS</div>
                    <div className="text-slate-200 mt-1 text-[11px] leading-relaxed">
                      {outage.reason}
                    </div>
                  </div>

                  <div className="bg-[#091322] p-3 rounded-xl border border-cyan-950">
                    <div className="text-[10px] font-mono text-slate-400">SAFETY RECOMMENDATION</div>
                    <div className="text-cyan-300 mt-1 text-[11px] font-semibold leading-relaxed">
                      {outage.recommendedAction}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-rose-900/40 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Automated Safety Action: {outage.automatedSafetyAction}</span>
                  </span>
                  {outage.isSimulated && (
                    <span className="text-amber-400">
                      [DEMO SCENARIO — ELECTRICAL DRILL PROTOCOL]
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#081223] border border-emerald-900/40 rounded-2xl p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-white font-mono">
              ✓ ALL DISTRIBUTION FEEDERS ENERGIZED
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Zero active power outages or sudden loss-of-voltage events detected across grid network.
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: POWER FAULT DETECTION MODULE */}
      <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                Power Fault Diagnostics & Anomaly Detection
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Isolation Forest & Multi-variate classification (Overvoltage, Undervoltage, Thermal Runaway, Harmonics)
            </p>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500">Filter:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  filterSeverity === s
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Faults Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c182f] text-slate-400 uppercase text-[10px] font-mono border-b border-cyan-950">
              <tr>
                <th className="py-3 px-3">Fault Type</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Detected Value</th>
                <th className="py-3 px-3">Expected Band</th>
                <th className="py-3 px-3">Location & Node</th>
                <th className="py-3 px-3">Possible Cause</th>
                <th className="py-3 px-3">Recommended Action</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredFaults.map((f) => (
                <tr key={f.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{f.faultType}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{f.detectedAt}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getSeverityBadge(
                        f.severity
                      )}`}
                    >
                      {f.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-300">{f.detectedValue}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{f.expectedRange}</td>
                  <td className="py-3 px-3">
                    <div className="text-cyan-300 font-semibold">{f.location}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{f.component}</div>
                  </td>
                  <td className="py-3 px-3 max-w-xs text-[11px] text-slate-300 leading-snug">
                    {f.possibleCause}
                  </td>
                  <td className="py-3 px-3 max-w-xs text-[11px] text-cyan-200 leading-snug">
                    {f.recommendedAction}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {f.status === 'ACTIVE' ? (
                      <button
                        onClick={() => onAcknowledgeFault(f.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors"
                      >
                        Investigate
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{f.status}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Anomaly Engine: Isolation Forest (Contamination factor = 0.02)</span>
          <button onClick={onOpenCopilot} className="text-cyan-400 hover:underline">
            Ask Copilot: “Is there an abnormal load on the system?”
          </button>
        </div>
      </div>
    </div>
  );
};
