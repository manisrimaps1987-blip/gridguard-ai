import React from 'react';
import {
  Zap,
  Activity,
  TrendingUp,
  AlertTriangle,
  Layers,
  SunMedium,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  Maximize2,
  BellRing,
} from 'lucide-react';
import {
  GridTelemetry,
  GridAlert,
  OptimizationRecommendation,
  Substation,
} from '../types/grid';

interface DashboardOverviewProps {
  telemetry: GridTelemetry;
  gridHealthScore: number;
  alerts: GridAlert[];
  recommendations: OptimizationRecommendation[];
  substations: Substation[];
  onAcknowledgeAlert: (id: string) => void;
  onApplyRecommendation: (id: string) => void;
  onNavigate: (view: string) => void;
  onOpenCopilot: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  telemetry,
  gridHealthScore,
  alerts,
  recommendations,
  substations,
  onAcknowledgeAlert,
  onApplyRecommendation,
  onNavigate,
  onOpenCopilot,
}) => {
  // Simulated real-time waveform data points for 24h
  const hourlyData = [
    { time: '00:00', load: 2.4, solar: 0, cost: 288 },
    { time: '02:00', load: 2.1, solar: 0, cost: 252 },
    { time: '04:00', load: 2.2, solar: 0, cost: 264 },
    { time: '06:00', load: 2.9, solar: 0.3, cost: 348 },
    { time: '08:00', load: 3.8, solar: 1.4, cost: 532 },
    { time: '10:00', load: 4.2, solar: 2.6, cost: 630 },
    { time: '12:00', load: 4.1, solar: 3.4, cost: 738 },
    { time: '14:00', load: 4.0, solar: 3.1, cost: 720 },
    { time: '16:00', load: 4.4, solar: 1.9, cost: 792 },
    { time: '18:00', load: 5.12, solar: 0.4, cost: 1228 }, // Peak
    { time: '20:00', load: 4.8, solar: 0, cost: 1152 },
    { time: '22:00', load: 3.2, solar: 0, cost: 448 },
  ];

  const maxLoad = 6.0;

  return (
    <div className="space-y-6">
      {/* 1. Key Performance Indicators Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Grid Health */}
        <div
          onClick={() => onNavigate('monitor')}
          className="bg-[#091427] border border-cyan-900/60 rounded-xl p-4 hover:border-cyan-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>GRID HEALTH</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {gridHealthScore}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {gridHealthScore >= 85 ? '✓ Nominal Stability' : '⚠ Elevated Drift'}
          </div>
        </div>

        {/* Current Load */}
        <div
          onClick={() => onNavigate('monitor')}
          className="bg-[#091427] border border-cyan-900/60 rounded-xl p-4 hover:border-cyan-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>CURRENT LOAD</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-cyan-200">
              {telemetry.loadMW}
            </span>
            <span className="text-xs text-cyan-400 font-mono">MW</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">82% of Substation Cap.</div>
        </div>

        {/* Energy Today */}
        <div
          onClick={() => onNavigate('analytics')}
          className="bg-[#091427] border border-cyan-900/60 rounded-xl p-4 hover:border-cyan-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ENERGY TODAY</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-amber-300">
              {telemetry.energyTodayMWh}
            </span>
            <span className="text-xs text-amber-400 font-mono">MWh</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Tracking -2.4% vs yday</div>
        </div>

        {/* Peak Demand */}
        <div
          onClick={() => onNavigate('forecast')}
          className="bg-[#091427] border border-cyan-900/60 rounded-xl p-4 hover:border-cyan-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PEAK DEMAND</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-rose-300">
              {telemetry.peakLoadMW}
            </span>
            <span className="text-xs text-rose-400 font-mono">MW</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Peak Exp: 18:30</div>
        </div>

        {/* Renewable Energy */}
        <div
          onClick={() => onNavigate('renewables')}
          className="bg-[#091427] border border-cyan-900/60 rounded-xl p-4 hover:border-cyan-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>RENEWABLE</span>
            <SunMedium className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-yellow-300">
              {telemetry.renewablePercentage}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {telemetry.renewableGenerationMW} MW Inflow
          </div>
        </div>

        {/* Active Alerts */}
        <div
          onClick={() => onNavigate('outages')}
          className="bg-[#091427] border border-cyan-900/60 rounded-xl p-4 hover:border-cyan-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ACTIVE ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {alerts.filter((a) => !a.acknowledged).length}
            </span>
            <span className="text-xs text-slate-500 font-mono">Unack.</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">1 Critical, 1 High</div>
        </div>
      </div>

      {/* 2. Main Live Charts & Map Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Power Chart (SVG Custom High-Performance) */}
        <div className="lg:col-span-2 bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  Live Power Consumption & Renewable Curve
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time active load profile vs solar generation across diurnal cycle
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
                <span>Active Load (MW)</span>
              </span>
              <span className="flex items-center gap-1.5 text-yellow-300">
                <span className="w-3 h-0.5 bg-yellow-400 inline-block"></span>
                <span>Solar (MW)</span>
              </span>
              <button
                onClick={() => onNavigate('monitor')}
                className="text-slate-400 hover:text-cyan-300 p-1 rounded"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Power Graph */}
          <div className="w-full h-56 relative pt-4 pb-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
              {/* Horizontal Grid lines */}
              {[0, 50, 100, 150, 200].map((y, i) => (
                <g key={i}>
                  <line
                    x1="40"
                    y1={y}
                    x2="690"
                    y2={y}
                    stroke="#14213d"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x="30"
                    y={y + 4}
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {((maxLoad * (200 - y)) / 200).toFixed(1)}M
                  </text>
                </g>
              ))}

              {/* Shaded Area for Solar Generation */}
              <path
                d={`M 40 200 ${hourlyData
                  .map(
                    (d, idx) =>
                      `L ${40 + idx * 59} ${200 - (d.solar / maxLoad) * 200}`
                  )
                  .join(' ')} L 690 200 Z`}
                fill="rgba(250, 204, 21, 0.12)"
              />

              {/* Solar Line */}
              <path
                d={`M 40 ${200 - (hourlyData[0].solar / maxLoad) * 200} ${hourlyData
                  .map(
                    (d, idx) =>
                      `L ${40 + idx * 59} ${200 - (d.solar / maxLoad) * 200}`
                  )
                  .join(' ')}`}
                fill="none"
                stroke="#facc15"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Active Load Shaded Gradient */}
              <defs>
                <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d={`M 40 200 ${hourlyData
                  .map(
                    (d, idx) =>
                      `L ${40 + idx * 59} ${200 - (d.load / maxLoad) * 200}`
                  )
                  .join(' ')} L 690 200 Z`}
                fill="url(#loadGradient)"
              />

              {/* Active Load Curve Line */}
              <path
                d={`M 40 ${200 - (hourlyData[0].load / maxLoad) * 200} ${hourlyData
                  .map(
                    (d, idx) =>
                      `L ${40 + idx * 59} ${200 - (d.load / maxLoad) * 200}`
                  )
                  .join(' ')}`}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Data points */}
              {hourlyData.map((d, idx) => {
                const cx = 40 + idx * 59;
                const cy = 200 - (d.load / maxLoad) * 200;
                return (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4"
                      className="fill-cyan-400 stroke-slate-900 stroke-2 hover:r-6 transition-all"
                    />
                    {/* Time Label on X axis */}
                    <text
                      x={cx}
                      y="218"
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {d.time}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
            <div>
              <span>Current Operating Point: </span>
              <span className="text-cyan-300 font-semibold">{telemetry.loadMW} MW @ 230.2V</span>
            </div>
            <div>
              <span>Projected Evening Peak: </span>
              <span className="text-rose-400 font-semibold">5.14 MW (18:30)</span>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Detailed Consumption Analytics</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Demand Forecast Quick Card */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  AI Demand Forecast
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/50 text-cyan-300">
                XGBoost Ensemble
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Machine learning load projection trained on historical weather and telemetry.
            </p>

            <div className="mt-4 space-y-3">
              <div className="bg-[#0c192f] border border-cyan-950 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">NEXT 1-HOUR PREDICTED</div>
                  <div className="text-xl font-bold font-mono text-cyan-200 mt-0.5">4.38 MW</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-mono">97.2% Confidence</div>
                  <div className="text-xs text-slate-400 font-mono">±0.12 MW Band</div>
                </div>
              </div>

              <div className="bg-[#0c192f] border border-cyan-950 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">EVENING PEAK PREDICTION</div>
                  <div className="text-xl font-bold font-mono text-rose-300 mt-0.5">5.14 MW</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-rose-400 font-mono">Time: 18:30</div>
                  <div className="text-xs text-slate-400 font-mono">Duration: 140 min</div>
                </div>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Reserve Headroom Advisory</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Peak demand will absorb 88% of local distribution capacity. Dispatch BESS battery at 17:45 to trim peak by 0.8 MW.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('forecast')}
              className="w-full py-2 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700/50 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore 24h & 7-Day Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Substation Fleet & Grid Map Quick Strip */}
      <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
              Grid Topology & Substation Fleet Status
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Active primary transmission nodes, collector hubs, and industrial feeders
            </p>
          </div>
          <button
            onClick={() => onNavigate('gridmap')}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
          >
            <span>Open Interactive Grid Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {substations.map((sub) => {
            const statusColor =
              sub.status === 'NORMAL'
                ? 'border-emerald-500/30 text-emerald-400'
                : sub.status === 'WARNING'
                ? 'border-amber-500/30 text-amber-400'
                : sub.status === 'CRITICAL'
                ? 'border-rose-500/40 text-rose-400'
                : 'border-slate-700 text-slate-400';

            return (
              <div
                key={sub.id}
                onClick={() => onNavigate('transformers')}
                className="bg-[#0b172a] border border-cyan-950 hover:border-cyan-500/50 rounded-xl p-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400">{sub.code}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${statusColor}`}>
                    {sub.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 truncate mt-1 group-hover:text-cyan-300">
                  {sub.name}
                </div>
                <div className="mt-2 flex items-baseline justify-between text-xs font-mono">
                  <span className="text-slate-400">Load</span>
                  <span className="text-slate-200 font-bold">{sub.loadMW} MW</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${
                      sub.loadPercentage > 90
                        ? 'bg-rose-500'
                        : sub.loadPercentage > 75
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${sub.loadPercentage}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{sub.loadPercentage}% Cap.</span>
                  <span>Health: {sub.healthScore}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Split: Recent Smart Alerts vs AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  Real-Time Grid Disturbance Alerts
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {alerts.filter((a) => !a.acknowledged).length} Active Unacknowledged
              </span>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 transition-colors ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-950/20 border-rose-900/50 text-rose-200'
                      : alert.severity === 'HIGH'
                      ? 'bg-amber-950/20 border-amber-900/50 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-rose-900 text-rose-100'
                            : alert.severity === 'HIGH'
                            ? 'bg-amber-900 text-amber-100'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="font-semibold text-white">{alert.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{alert.explanation}</p>
                    <div className="text-[10px] text-cyan-400 font-mono">
                      ↳ Action: {alert.recommendedAction}
                    </div>
                  </div>

                  {!alert.acknowledged ? (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] whitespace-nowrap transition-colors"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ack</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('outages')}
              className="text-xs text-cyan-400 hover:underline font-mono flex items-center gap-1"
            >
              <span>View Full Fault Diagnostics & Outage Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Optimization Recommendations */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  AI Energy Optimization Advisories
                </h3>
              </div>
              <span className="text-xs font-mono text-purple-300">
                +$4,890 / mo Potential
              </span>
            </div>

            <div className="space-y-2.5">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="bg-[#0b172a] border border-cyan-950 p-3 rounded-xl text-xs space-y-1.5 hover:border-cyan-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-800/40 text-purple-300">
                        {rec.category}
                      </span>
                      <span className="font-semibold text-white">{rec.title}</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">
                      +${rec.potentialCostSavings}/day
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-900/50 p-2 rounded">
                    <div>
                      <span className="text-slate-500 font-mono">Current: </span>
                      <span>{rec.currentSchedule}</span>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-mono">Recommended: </span>
                      <span>{rec.recommendedSchedule}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Impact: -{rec.impactMW} MW Peak | Confidence: {(rec.confidence * 100).toFixed(0)}%
                    </span>
                    <button
                      onClick={() => onApplyRecommendation(rec.id)}
                      disabled={rec.status === 'APPLIED'}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        rec.status === 'APPLIED'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 cursor-default'
                          : 'bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/50'
                      }`}
                    >
                      {rec.status === 'APPLIED' ? '✓ Applied' : 'Apply Schedule'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onNavigate('optimize')}
              className="text-xs text-cyan-400 hover:underline font-mono flex items-center gap-1"
            >
              <span>Launch Full AI Optimization Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenCopilot}
              className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1"
            >
              <span>Ask Copilot to explain savings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
