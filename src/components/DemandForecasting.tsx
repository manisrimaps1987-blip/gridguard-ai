import React, { useState } from 'react';
import {
  TrendingUp,
  Cpu,
  Activity,
  Layers,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { GridTelemetry, LoadForecastPoint, ForecastModelInfo } from '../types/grid';

interface DemandForecastingProps {
  telemetry: GridTelemetry;
  onOpenCopilot: () => void;
}

export const DemandForecasting: React.FC<DemandForecastingProps> = ({
  telemetry,
  onOpenCopilot,
}) => {
  const [selectedModel, setSelectedModel] = useState<
    'XGBoost' | 'Random Forest' | 'LSTM' | 'GRU' | 'Prophet'
  >('XGBoost');
  const [forecastHorizon, setForecastHorizon] = useState<'24h' | '7d'>('24h');

  // Available ML Models
  const models: ForecastModelInfo[] = [
    {
      id: 'xgboost',
      name: 'XGBoost',
      type: 'XGBoost',
      rmse: 0.14,
      mape: 2.8,
      r2: 0.97,
      confidence: 96,
      description: 'Gradient boosted trees optimized for tabular smart meter and weather telemetry.',
    },
    {
      id: 'lstm',
      name: 'LSTM Recurrent Network',
      type: 'LSTM',
      rmse: 0.12,
      mape: 2.3,
      r2: 0.98,
      confidence: 97,
      description: 'Long Short-Term Memory deep neural network capturing multi-day cyclical dependencies.',
    },
    {
      id: 'gru',
      name: 'Gated Recurrent Unit (GRU)',
      type: 'GRU',
      rmse: 0.13,
      mape: 2.5,
      r2: 0.97,
      confidence: 96,
      description: 'High-speed sequential neural network for sub-minute phasor forecasting.',
    },
    {
      id: 'rf',
      name: 'Random Forest Regressor',
      type: 'Random Forest',
      rmse: 0.18,
      mape: 3.4,
      r2: 0.94,
      confidence: 91,
      description: 'Non-linear ensemble model resilient against missing IoT sensor packets.',
    },
    {
      id: 'prophet',
      name: 'Prophet (Additive Seasonality)',
      type: 'Prophet',
      rmse: 0.21,
      mape: 4.1,
      r2: 0.91,
      confidence: 89,
      description: 'Decomposable time series model capturing holiday and weekend load patterns.',
    },
  ];

  const currentModelInfo = models.find((m) => m.type === selectedModel) || models[0];

  // 24 Hour Forecast Data
  const forecastPoints24h = [
    { time: '11:00', actual: 4.25, predicted: 4.28, lower: 4.15, upper: 4.41, temp: 24 },
    { time: '12:00', actual: undefined, predicted: 4.18, lower: 4.02, upper: 4.34, temp: 26 },
    { time: '13:00', actual: undefined, predicted: 4.05, lower: 3.88, upper: 4.22, temp: 27 },
    { time: '14:00', actual: undefined, predicted: 3.98, lower: 3.80, upper: 4.16, temp: 28 },
    { time: '15:00', actual: undefined, predicted: 4.22, lower: 4.01, upper: 4.43, temp: 28 },
    { time: '16:00', actual: undefined, predicted: 4.54, lower: 4.30, upper: 4.78, temp: 27 },
    { time: '17:00', actual: undefined, predicted: 4.88, lower: 4.62, upper: 5.14, temp: 26 },
    { time: '18:00', actual: undefined, predicted: 5.12, lower: 4.85, upper: 5.39, temp: 24 }, // Peak
    { time: '19:00', actual: undefined, predicted: 5.08, lower: 4.80, upper: 5.36, temp: 23 },
    { time: '20:00', actual: undefined, predicted: 4.75, lower: 4.49, upper: 5.01, temp: 22 },
    { time: '21:00', actual: undefined, predicted: 4.12, lower: 3.88, upper: 4.36, temp: 21 },
    { time: '22:00', actual: undefined, predicted: 3.45, lower: 3.22, upper: 3.68, temp: 20 },
    { time: '23:00', actual: undefined, predicted: 2.85, lower: 2.64, upper: 3.06, temp: 19 },
    { time: '00:00', actual: undefined, predicted: 2.45, lower: 2.25, upper: 2.65, temp: 18 },
    { time: '02:00', actual: undefined, predicted: 2.15, lower: 1.95, upper: 2.35, temp: 17 },
    { time: '04:00', actual: undefined, predicted: 2.22, lower: 2.01, upper: 2.43, temp: 17 },
    { time: '06:00', actual: undefined, predicted: 2.95, lower: 2.70, upper: 3.20, temp: 18 },
    { time: '08:00', actual: undefined, predicted: 3.85, lower: 3.58, upper: 4.12, temp: 21 },
  ];

  // 7 Day Forecast Data
  const forecastPoints7d = [
    { day: 'Day +1 (Tomorrow)', peakMW: 5.18, totalMWh: 74.2, tempC: 27, conf: 96, window: '18:00 - 20:30' },
    { day: 'Day +2', peakMW: 5.25, totalMWh: 76.8, tempC: 29, conf: 94, window: '18:15 - 20:45' },
    { day: 'Day +3', peakMW: 5.05, totalMWh: 72.1, tempC: 25, conf: 92, window: '17:45 - 20:15' },
    { day: 'Day +4', peakMW: 4.90, totalMWh: 69.5, tempC: 24, conf: 89, window: '17:30 - 20:00' },
    { day: 'Day +5', peakMW: 5.32, totalMWh: 78.4, tempC: 30, conf: 87, window: '18:30 - 21:00' },
    { day: 'Day +6 (Weekend)', peakMW: 4.30, totalMWh: 58.2, tempC: 26, conf: 85, window: '19:00 - 21:00' },
    { day: 'Day +7 (Weekend)', peakMW: 4.15, totalMWh: 56.1, tempC: 25, conf: 82, window: '19:00 - 21:00' },
  ];

  const maxVal = 6.0;

  return (
    <div className="space-y-6">
      {/* Top Header & Model Selector */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              AI Demand & Load Prediction Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Predictive load modeling with 95% confidence intervals and multi-model ensemble comparison
          </p>
        </div>

        {/* Model Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(['XGBoost', 'LSTM', 'GRU', 'Random Forest', 'Prophet'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedModel === m
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'bg-[#060c18] border border-cyan-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Model Performance & Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE MODEL</div>
          <div className="text-base font-bold font-mono text-cyan-300 mt-1">{currentModelInfo.name}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Ensemble Regressor</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">CURRENT LOAD</div>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">
            {telemetry.loadMW} <span className="text-xs text-cyan-400">MW</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Real-time Telemetry</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">PREDICTED PEAK</div>
          <div className="text-xl font-bold font-mono text-rose-300 mt-1">
            5.12 <span className="text-xs text-rose-400">MW</span>
          </div>
          <div className="text-[10px] text-rose-400 mt-0.5">Peak Hour: 18:30</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">MODEL ACCURACY (R²)</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {currentModelInfo.r2}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">High Goodness of Fit</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">ERROR (MAPE / RMSE)</div>
          <div className="text-xl font-bold font-mono text-cyan-200 mt-1">
            {currentModelInfo.mape}% <span className="text-xs text-slate-400">/ {currentModelInfo.rmse}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Mean Absolute Pct Error</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">CONFIDENCE LEVEL</div>
          <div className="text-xl font-bold font-mono text-purple-300 mt-1">
            {currentModelInfo.confidence}%
          </div>
          <div className="text-[10px] text-purple-400 mt-0.5">95% Prediction Interval</div>
        </div>
      </div>

      {/* Horizon Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setForecastHorizon('24h')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            forecastHorizon === '24h'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'bg-[#081223] text-slate-400 border border-cyan-950'
          }`}
        >
          Next 24 Hours (Hourly Curve)
        </button>
        <button
          onClick={() => setForecastHorizon('7d')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            forecastHorizon === '7d'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'bg-[#081223] text-slate-400 border border-cyan-950'
          }`}
        >
          Next 7 Days (Peak Projection Table)
        </button>
      </div>

      {/* 24-Hour Prediction Graph with 95% Confidence Band */}
      {forecastHorizon === '24h' ? (
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                Next 24-Hour Predicted Load with 95% Uncertainty Confidence Band
              </h3>
              <p className="text-xs text-slate-400">
                Generated using {currentModelInfo.name} with ambient temperature correlation
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
                <span>Predicted Mean (MW)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-3 bg-cyan-500/15 border border-cyan-500/30 inline-block"></span>
                <span>95% Uncertainty Range</span>
              </span>
            </div>
          </div>

          {/* SVG Forecast Chart */}
          <div className="w-full h-64 pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
              {/* Grid Lines */}
              {[0, 50, 100, 150, 200].map((y, i) => (
                <g key={i}>
                  <line x1="40" y1={y} x2="690" y2={y} stroke="#14213d" strokeDasharray="3 3" />
                  <text x="30" y={y + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                    {((maxVal * (200 - y)) / 200).toFixed(1)}M
                  </text>
                </g>
              ))}

              {/* Shaded Confidence Interval Band */}
              <defs>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Confidence polygon */}
              {(() => {
                const upperPoints = forecastPoints24h.map(
                  (p, idx) => `${40 + idx * 36},${200 - (p.upper / maxVal) * 200}`
                );
                const lowerPoints = forecastPoints24h
                  .slice()
                  .reverse()
                  .map(
                    (p, idx) =>
                      `${40 + (forecastPoints24h.length - 1 - idx) * 36},${200 - (p.lower / maxVal) * 200}`
                  );
                const polygonPath = `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;
                return <path d={polygonPath} fill="url(#confidenceBand)" />;
              })()}

              {/* Predicted Mean Curve */}
              <path
                d={`M 40 ${200 - (forecastPoints24h[0].predicted / maxVal) * 200} ${forecastPoints24h
                  .map((p, idx) => `L ${40 + idx * 36} ${200 - (p.predicted / maxVal) * 200}`)
                  .join(' ')}`}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Peak annotation */}
              <circle cx="292" cy={200 - (5.12 / maxVal) * 200} r="5" className="fill-rose-500 animate-ping" />
              <circle cx="292" cy={200 - (5.12 / maxVal) * 200} r="4" className="fill-rose-400 stroke-black stroke-2" />
              <text x="292" y={200 - (5.12 / maxVal) * 200 - 10} fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                PEAK 5.12 MW (18:00)
              </text>

              {/* Points */}
              {forecastPoints24h.map((p, idx) => {
                const cx = 40 + idx * 36;
                const cy = 200 - (p.predicted / maxVal) * 200;
                return (
                  <g key={idx} className="group">
                    <circle cx={cx} cy={cy} r="3" className="fill-cyan-300 hover:r-5 transition-all" />
                    {idx % 2 === 0 && (
                      <text x={cx} y="218" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        {p.time}
                      </text>
                    )}
                    <title>{`${p.time}: Predicted ${p.predicted} MW (${p.lower} - ${p.upper} MW)`}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Model Trained: 10,000 hourly historical points</span>
            <span>Temperature Dependency: 0.08 MW/°C above 25°C</span>
            <button onClick={onOpenCopilot} className="text-cyan-400 hover:underline">
              Ask Copilot: “Predict tomorrow's demand.”
            </button>
          </div>
        </div>
      ) : (
        /* 7-Day Forecast Table */
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
          <h3 className="text-base font-bold text-white font-['Chakra_Petch'] mb-4">
            Next 7-Day Multi-Horizon Demand Projections
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c182f] text-slate-400 uppercase text-[10px] border-b border-cyan-950">
                <tr>
                  <th className="py-3 px-3">Horizon</th>
                  <th className="py-3 px-3">Predicted Peak</th>
                  <th className="py-3 px-3">Projected Energy</th>
                  <th className="py-3 px-3">Expected Temp</th>
                  <th className="py-3 px-3">Peak Window</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {forecastPoints7d.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 font-semibold text-white">{d.day}</td>
                    <td className="py-2.5 px-3 text-rose-300 font-bold">{d.peakMW} MW</td>
                    <td className="py-2.5 px-3 text-amber-300">{d.totalMWh} MWh</td>
                    <td className="py-2.5 px-3 text-slate-300">{d.tempC}°C</td>
                    <td className="py-2.5 px-3 text-slate-400">{d.window}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{d.conf}%</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-800/50">
                        Scheduled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
