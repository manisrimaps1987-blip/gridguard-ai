import React, { useState } from 'react';
import {
  Layers,
  Zap,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BatteryCharging,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OptimizationRecommendation, TariffConfig } from '../types/grid';

interface EnergyOptimizerProps {
  recommendations: OptimizationRecommendation[];
  tariff: TariffConfig;
  onApplyRecommendation: (id: string) => void;
  onOpenCopilot: () => void;
}

export const EnergyOptimizer: React.FC<EnergyOptimizerProps> = ({
  recommendations,
  tariff,
  onApplyRecommendation,
  onOpenCopilot,
}) => {
  const [simulationActive, setSimulationActive] = useState(false);

  const totalSavingsDollars = recommendations.reduce(
    (acc, r) => acc + (r.status === 'APPLIED' ? r.potentialCostSavings : 0),
    0
  );
  const totalPotentialDollars = recommendations.reduce(
    (acc, r) => acc + r.potentialCostSavings,
    0
  );
  const totalPeakReductionMW = recommendations.reduce(
    (acc, r) => acc + r.impactMW,
    0
  );

  const handleApply = (id: string) => {
    onApplyRecommendation(id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#3b82f6', '#10b981'],
    });
  };

  // Before & After Peak Shifting Curve Data Points
  const beforeCurve = [2.4, 2.1, 2.2, 2.9, 3.8, 4.2, 4.1, 4.0, 4.4, 5.12, 4.8, 3.2];
  const afterCurve = [2.6, 2.3, 2.3, 2.9, 3.8, 4.5, 4.6, 4.4, 4.3, 4.25, 4.1, 3.2]; // Shifted to midday solar

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              AI Energy Optimization & Demand Response Dispatch
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Peak shaving, Time-of-Use load shifting, and automated battery arbitrage dispatch schedules
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-purple-950/60 border border-purple-800/40 px-3 py-1.5 rounded-xl text-purple-300">
            <span>Potential Monthly Savings: {tariff.currency}{(totalPotentialDollars * 30).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase">PEAK DEMAND REDUCTION</div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-1">
            -{totalPeakReductionMW.toFixed(1)} <span className="text-xs text-slate-400">MW</span>
          </div>
          <div className="text-[10px] text-purple-400 mt-0.5">Shave from 18:00 - 20:30 peak</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase">CAPTUREABLE SAVINGS</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {tariff.currency}{totalPotentialDollars.toLocaleString()} <span className="text-xs text-slate-400">/ day</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">TOU Peak Tariff Arbitrage</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE APPLIED SAVINGS</div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
            {tariff.currency}{totalSavingsDollars.toLocaleString()} <span className="text-xs text-slate-400">/ day</span>
          </div>
          <div className="text-[10px] text-cyan-400 mt-0.5">Enforced SCADA Schedules</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase">SAFETY VERIFICATION</div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Interlocks Verified</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Human Verification Required</div>
        </div>
      </div>

      {/* Before & After Load Shifting Curve */}
      <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
              Load Shifting Simulation (Baseline vs Optimized Schedule)
            </h3>
            <p className="text-xs text-slate-400">
              Shifting flexible pumping and charging loads to coincide with peak solar generation (12:00 - 15:00)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-3 h-0.5 bg-slate-500 inline-block"></span> Baseline Profile (Peak 5.12 MW)
            </span>
            <span className="flex items-center gap-1 text-cyan-300 font-bold">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span> Optimized Profile (Peak 4.25 MW)
            </span>
          </div>
        </div>

        {/* SVG Curve */}
        <div className="w-full h-56 pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 650 180">
            {/* Grid lines */}
            {[0, 45, 90, 135, 180].map((y, i) => (
              <line key={i} x1="30" y1={y} x2="640" y2={y} stroke="#14213d" strokeDasharray="3 3" />
            ))}

            {/* Baseline dashed gray */}
            <path
              d={`M 40 ${180 - (beforeCurve[0] / 6.0) * 180} ${beforeCurve
                .map((v, i) => `L ${40 + i * 54} ${180 - (v / 6.0) * 180}`)
                .join(' ')}`}
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Optimized solid cyan */}
            <path
              d={`M 40 ${180 - (afterCurve[0] / 6.0) * 180} ${afterCurve
                .map((v, i) => `L ${40 + i * 54} ${180 - (v / 6.0) * 180}`)
                .join(' ')}`}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
            />

            {/* Labels */}
            {['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map((t, idx) => (
              <text key={idx} x={40 + idx * 54} y="196" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                {t}
              </text>
            ))}
          </svg>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Result: Peak shaved by 0.87 MW (-17% during 18:00 - 20:30)</span>
          <span className="text-emerald-400 font-bold">Avoided Peak Demand Penalties: {tariff.currency}1,420 / day</span>
        </div>
      </div>

      {/* AI Recommendation Cards List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
          AI Optimization Action Items
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800/40 text-purple-300 font-bold">
                    {rec.category}
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    +{tariff.currency}{rec.potentialCostSavings}/day
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-['Chakra_Petch']">{rec.title}</h4>

                <div className="mt-3 space-y-2 text-xs font-mono bg-[#091322] p-3 rounded-xl border border-cyan-950">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Schedule:</span>
                    <span className="text-slate-300">{rec.currentSchedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-400">AI Recommended:</span>
                    <span className="text-cyan-300 font-bold">{rec.recommendedSchedule}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-500">Peak Load Impact:</span>
                    <span className="text-purple-300 font-bold">-{rec.impactMW} MW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AI Confidence:</span>
                    <span className="text-emerald-400 font-bold">{(rec.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-cyan-400 font-mono font-semibold">Action:</span>
                  <span>{rec.actionRequired}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={onOpenCopilot}
                  className="text-xs text-cyan-400 hover:underline font-mono"
                >
                  Ask Copilot for analysis
                </button>

                <button
                  onClick={() => handleApply(rec.id)}
                  disabled={rec.status === 'APPLIED'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    rec.status === 'APPLIED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50 cursor-default'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md cursor-pointer active:scale-95'
                  }`}
                >
                  {rec.status === 'APPLIED' ? '✓ Schedule Armed' : 'Apply Optimization'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-400 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
        <div>
          <span className="text-slate-200 font-bold">Hardware Safeguard Notice:</span> GridGuard AI optimization dispatches SCADA setpoints within permissible thermal and contractual limits. Live high-voltage circuit breaker commands require human operator sign-off.
        </div>
      </div>
    </div>
  );
};
