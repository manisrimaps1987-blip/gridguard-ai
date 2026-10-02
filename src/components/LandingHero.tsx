import React from 'react';
import {
  Zap,
  Activity,
  TrendingUp,
  AlertTriangle,
  Layers,
  SunMedium,
  Bot,
  ShieldCheck,
  ArrowRight,
  Database,
  Cpu,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

interface LandingHeroProps {
  onLaunchDashboard: () => void;
  onExploreSection: (section: string) => void;
  onOpenCopilot: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchDashboard,
  onExploreSection,
  onOpenCopilot,
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#050b14] grid-bg-pattern relative overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-80 right-10 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-6 shadow-lg shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>NEXT-GENERATION POWER SYSTEMS PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-['Chakra_Petch'] leading-tight">
            GRIDGUARD<span className="text-cyan-400"> AI</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-300">
            “AI-Powered Intelligence for a Safer, Smarter Power Grid”
          </p>

          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Monitor electricity in real-time, predict load demand with ML, detect anomalies before blackouts occur, optimize peak-hour energy usage, and understand grid conditions with our connected AI Power Copilot.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-700/50 hover:border-cyan-400 text-cyan-200 font-bold text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask GridGuard Copilot</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Live Hardware Tampering</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Anomaly Engine</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Model Forecasting</span>
            </span>
          </div>
        </div>

        {/* Core Flow Visualization: Electricity Data -> Data Processing -> AI/ML Analysis -> Anomaly & Fault Detection -> Demand Forecasting -> Risk Analysis -> AI Recommendations -> Dashboard & Alerts */}
        <div className="mb-20 bg-[#07101f]/90 border border-cyan-900/60 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                GridGuard AI Operational Data Pipeline Architecture
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              End-to-End Pipeline
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative">
            {[
              { title: 'Electricity Data', desc: 'IoT & Smart Meters', icon: Database, color: 'text-cyan-400' },
              { title: 'Data Processing', desc: 'Noise Filtering & ETL', icon: Cpu, color: 'text-blue-400' },
              { title: 'AI/ML Analysis', desc: 'XGBoost & LSTM', icon: Activity, color: 'text-indigo-400' },
              { title: 'Fault Detection', desc: 'Isolation Forest', icon: AlertTriangle, color: 'text-rose-400' },
              { title: 'Demand Forecast', desc: '24h/7d Peak Models', icon: TrendingUp, color: 'text-emerald-400' },
              { title: 'Risk Analysis', desc: 'Grid Health Score', icon: ShieldCheck, color: 'text-amber-400' },
              { title: 'AI Advisory', desc: 'Peak Load Shifting', icon: Layers, color: 'text-purple-400' },
              { title: 'Live Dashboard', desc: 'SCADA & Smart Alerts', icon: Zap, color: 'text-sky-400' },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0b172a] border border-cyan-950 p-3 rounded-xl flex flex-col items-center text-center relative group hover:border-cyan-500/60 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center mb-2">
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{step.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">{step.desc}</span>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">Step 0{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Grid Sections */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Chakra_Petch']">
            Comprehensive Smart Grid Modules
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">
            Engineered for grid operators, utilities, microgrids, and industrial energy consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Smart Grid Monitoring */}
          <div
            onClick={() => onExploreSection('monitor')}
            className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-6 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/10 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Smart Grid Monitoring
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Real-time telemetry tracking voltage (230V), current, frequency (50Hz), active/reactive power, and power factor vectors with microsecond harmonic precision.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <span>Inspect Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. AI Demand Forecasting */}
          <div
            onClick={() => onExploreSection('forecast')}
            className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-6 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/10 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              AI Demand Forecasting
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Predict next hour, 24h, and 7-day future peak loads using XGBoost, Random Forest, LSTM, and Prophet models with 95% uncertainty confidence intervals.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-blue-400">
              <span>Run ML Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. Outage & Fault Detection */}
          <div
            onClick={() => onExploreSection('outages')}
            className="bg-[#081223] border border-rose-950/60 rounded-2xl p-6 hover:border-rose-500/60 hover:shadow-xl hover:shadow-rose-500/10 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center mb-4 text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
              Outage & Fault Detection
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Instantaneous detection of voltage collapse, feeder trips, overtemperature, and harmonics with automated safety recommendations and dispatch protocols.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-rose-400">
              <span>View Anomaly Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 4. Energy Optimization */}
          <div
            onClick={() => onExploreSection('optimize')}
            className="bg-[#081223] border border-purple-900/50 rounded-2xl p-6 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              AI Energy Optimization
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Autonomous load shifting and peak demand reduction schedules. Shift thermal loads and execute battery storage arbitrage to capture measurable cost savings.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-purple-400">
              <span>Optimize Load Curves</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 5. Renewable Intelligence */}
          <div
            onClick={() => onExploreSection('renewables')}
            className="bg-[#081223] border border-yellow-900/50 rounded-2xl p-6 hover:border-yellow-500/60 hover:shadow-xl hover:shadow-yellow-500/10 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-950/80 border border-yellow-500/40 flex items-center justify-center mb-4 text-yellow-400 group-hover:scale-110 transition-transform">
              <SunMedium className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
              Renewable & Battery Storage
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Solar irradiance modeling, wind generation tracking, battery state-of-charge (SoC) cycling, grid import/export balance, and carbon avoided calculations.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-yellow-400">
              <span>Monitor Green Power</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 6. AI Power Assistant (Copilot) */}
          <div
            onClick={onOpenCopilot}
            className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-6 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/10 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-4 text-cyan-300 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              GridGuard Copilot
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Specialized electrical engineering AI connected directly to live grid context. Ask about consumption trends, peak predictions, harmonic causes, and tariff impacts.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <span>Open Power Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="mt-16 bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">ELECTRICAL SAFETY PROTOCOL ENFORCED</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            GridGuard AI provides intelligence, predictive modeling, alerts, and optimization recommendations. Real-world electrical equipment switching requires authorized SCADA interlocks and certified operator verification.
          </p>
        </div>
      </div>
    </div>
  );
};
