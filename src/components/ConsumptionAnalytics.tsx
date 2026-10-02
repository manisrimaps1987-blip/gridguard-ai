import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';
import { TariffConfig } from '../types/grid';

interface ConsumptionAnalyticsProps {
  tariff: TariffConfig;
  onUpdateTariff: (tariff: Partial<TariffConfig>) => void;
  onOpenCopilot: () => void;
}

export const ConsumptionAnalytics: React.FC<ConsumptionAnalyticsProps> = ({
  tariff,
  onUpdateTariff,
  onOpenCopilot,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    'Today' | '7 Days' | '30 Days' | '3 Months' | '1 Year'
  >('Today');

  const [editTariff, setEditTariff] = useState(false);
  const [tempTariff, setTempTariff] = useState(tariff);

  // Timeframe datasets
  const dataToday = [
    { label: '00:00', kwh: 2400, cost: 288, peak: false },
    { label: '02:00', kwh: 2100, cost: 252, peak: false },
    { label: '04:00', kwh: 2200, cost: 264, peak: false },
    { label: '06:00', kwh: 2900, cost: 348, peak: false },
    { label: '08:00', kwh: 3800, cost: 532, peak: false },
    { label: '10:00', kwh: 4200, cost: 630, peak: false },
    { label: '12:00', kwh: 4100, cost: 738, peak: false },
    { label: '14:00', kwh: 4000, cost: 720, peak: false },
    { label: '16:00', kwh: 4400, cost: 792, peak: false },
    { label: '18:00', kwh: 5120, cost: 1228, peak: true },
    { label: '20:00', kwh: 4800, cost: 1152, peak: true },
    { label: '22:00', kwh: 3200, cost: 448, peak: false },
  ];

  const data7Days = [
    { label: 'Mon', kwh: 78400, cost: 11760, peak: false },
    { label: 'Tue', kwh: 82100, cost: 12430, peak: false },
    { label: 'Wed', kwh: 80600, cost: 12100, peak: false },
    { label: 'Thu', kwh: 84200, cost: 12850, peak: true },
    { label: 'Fri', kwh: 86900, cost: 13320, peak: true },
    { label: 'Sat', kwh: 69300, cost: 9840, peak: false },
    { label: 'Sun', kwh: 71800, cost: 10450, peak: false },
  ];

  const data30Days = [
    { label: 'Week 1', kwh: 560000, cost: 84000, peak: false },
    { label: 'Week 2', kwh: 578000, cost: 86700, peak: false },
    { label: 'Week 3', kwh: 592000, cost: 89400, peak: true },
    { label: 'Week 4', kwh: 554000, cost: 83100, peak: false },
  ];

  const data3Months = [
    { label: 'Aug', kwh: 2450000, cost: 367500, peak: true },
    { label: 'Sep', kwh: 2380000, cost: 357000, peak: false },
    { label: 'Oct (Est)', kwh: 2320000, cost: 348000, peak: false },
  ];

  const data1Year = [
    { label: 'Jan', kwh: 2150000, cost: 322500, peak: false },
    { label: 'Feb', kwh: 1980000, cost: 297000, peak: false },
    { label: 'Mar', kwh: 2240000, cost: 336000, peak: false },
    { label: 'Apr', kwh: 2100000, cost: 315000, peak: false },
    { label: 'May', kwh: 2380000, cost: 357000, peak: false },
    { label: 'Jun', kwh: 2620000, cost: 419200, peak: false },
    { label: 'Jul', kwh: 2890000, cost: 491300, peak: true },
    { label: 'Aug', kwh: 2810000, cost: 477700, peak: true },
    { label: 'Sep', kwh: 2450000, cost: 392000, peak: false },
    { label: 'Oct', kwh: 2320000, cost: 348000, peak: false },
    { label: 'Nov', kwh: 2180000, cost: 327000, peak: false },
    { label: 'Dec', kwh: 2410000, cost: 385600, peak: false },
  ];

  const currentDataset =
    selectedTimeframe === 'Today'
      ? dataToday
      : selectedTimeframe === '7 Days'
      ? data7Days
      : selectedTimeframe === '30 Days'
      ? data30Days
      : selectedTimeframe === '3 Months'
      ? data3Months
      : data1Year;

  const totalConsumption = currentDataset.reduce((acc, d) => acc + d.kwh, 0);
  const totalCost = currentDataset.reduce((acc, d) => acc + d.cost, 0);
  const peakVal = Math.max(...currentDataset.map((d) => d.kwh));
  const minVal = Math.min(...currentDataset.map((d) => d.kwh));
  const avgVal = totalConsumption / currentDataset.length;

  const handleSaveTariff = () => {
    onUpdateTariff(tempTariff);
    setEditTariff(false);
  };

  return (
    <div className="space-y-6">
      {/* Timeframe Selector & Header */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              Electricity Consumption & Time-of-Use Cost Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyze historical energy demand, peak intervals, and custom tariff expenditure
          </p>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex items-center bg-[#060c18] border border-cyan-950 p-1 rounded-xl text-xs font-mono">
          {(['Today', '7 Days', '30 Days', '3 Months', '1 Year'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTimeframe === tf
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">TOTAL CONSUMPTION</div>
          <div className="text-xl font-bold font-mono text-cyan-200 mt-1">
            {(totalConsumption / 1000).toFixed(1)}{' '}
            <span className="text-xs text-cyan-400 font-normal">MWh</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{selectedTimeframe} Volume</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">PEAK CONSUMPTION</div>
          <div className="text-xl font-bold font-mono text-rose-300 mt-1">
            {(peakVal / 1000).toFixed(2)}{' '}
            <span className="text-xs text-rose-400 font-normal">MW/h</span>
          </div>
          <div className="text-[10px] text-rose-400 mt-0.5">Peak Load Period</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">AVERAGE DEMAND</div>
          <div className="text-xl font-bold font-mono text-slate-200 mt-1">
            {(avgVal / 1000).toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">MW/h</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Baseload Average</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">MINIMUM DEMAND</div>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
            {(minVal / 1000).toFixed(2)}{' '}
            <span className="text-xs text-emerald-400 font-normal">MW/h</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Off-Peak Night Base</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">ESTIMATED COST</div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            {tariff.currency}
            {totalCost.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Time-of-Use Rate</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">AVOIDABLE PEAK COST</div>
          <div className="text-xl font-bold font-mono text-purple-300 mt-1">
            {tariff.currency}
            {Math.round(totalCost * 0.18).toLocaleString()}
          </div>
          <div className="text-[10px] text-purple-400 mt-0.5">Shiftable to Solar</div>
        </div>
      </div>

      {/* Main Consumption & Cost Dual Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar & Curve Chart */}
        <div className="lg:col-span-2 bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                Electricity Consumption & Peak Load Profile ({selectedTimeframe})
              </h3>
              <p className="text-xs text-slate-400">
                Hourly and interval load variations showing peak rate periods
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-cyan-300">
                <span className="w-3 h-3 bg-cyan-500/80 rounded-sm"></span> Normal Rate
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-3 h-3 bg-rose-500/80 rounded-sm"></span> Peak Rate Window
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="w-full h-64 pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 650 200">
              {/* Horizontal Reference Lines */}
              {[0, 50, 100, 150, 200].map((y, i) => (
                <line
                  key={i}
                  x1="30"
                  y1={y}
                  x2="640"
                  y2={y}
                  stroke="#14213d"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              {/* Bars */}
              {currentDataset.map((d, idx) => {
                const totalBars = currentDataset.length;
                const barWidth = Math.max(16, 580 / totalBars - 10);
                const x = 40 + idx * (580 / totalBars);
                const barHeight = (d.kwh / peakVal) * 170;
                const y = 190 - barHeight;

                return (
                  <g key={idx} className="group cursor-pointer">
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="3"
                      className={`transition-all hover:opacity-100 ${
                        d.peak
                          ? 'fill-rose-500/85 hover:fill-rose-400'
                          : 'fill-cyan-500/75 hover:fill-cyan-400'
                      }`}
                    />
                    <text
                      x={x + barWidth / 2}
                      y="208"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {d.label}
                    </text>
                    {/* Hover tooltip text */}
                    <title>{`${d.label}: ${(d.kwh / 1000).toFixed(1)} MWh | ${tariff.currency}${d.cost}`}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Peak Demand: {(peakVal / 1000).toFixed(2)} MW</span>
            <span>Total Delivered: {(totalConsumption / 1000).toFixed(1)} MWh</span>
            <button onClick={onOpenCopilot} className="text-cyan-400 hover:underline">
              Ask Copilot: “Why did consumption increase?”
            </button>
          </div>
        </div>

        {/* Tariff Configurator Card */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  Configurable Multi-Tier Tariff
                </h3>
              </div>
              <button
                onClick={() => setEditTariff(!editTariff)}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                {editTariff ? 'Cancel' : 'Configure'}
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Customize Time-of-Use pricing and currency to match your regional utility tariff.
            </p>

            {editTariff ? (
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400">Currency Symbol</label>
                  <input
                    type="text"
                    value={tempTariff.currency}
                    onChange={(e) => setTempTariff({ ...tempTariff, currency: e.target.value })}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Base Rate per kWh</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tempTariff.baseRatePerKWh}
                    onChange={(e) =>
                      setTempTariff({ ...tempTariff, baseRatePerKWh: parseFloat(e.target.value) || 0.1 })
                    }
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Peak Rate Multiplier</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempTariff.peakRateMultiplier}
                    onChange={(e) =>
                      setTempTariff({ ...tempTariff, peakRateMultiplier: parseFloat(e.target.value) || 1.5 })
                    }
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400">Peak Start (24h)</label>
                    <input
                      type="number"
                      value={tempTariff.peakStartHour}
                      onChange={(e) =>
                        setTempTariff({ ...tempTariff, peakStartHour: parseInt(e.target.value) || 17 })
                      }
                      className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Peak End (24h)</label>
                    <input
                      type="number"
                      value={tempTariff.peakEndHour}
                      onChange={(e) =>
                        setTempTariff({ ...tempTariff, peakEndHour: parseInt(e.target.value) || 21 })
                      }
                      className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveTariff}
                  className="w-full mt-2 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg transition-all"
                >
                  Save Tariff Profile
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="bg-[#0b172a] p-3 rounded-xl border border-cyan-950 flex items-center justify-between font-mono">
                  <span className="text-slate-400">Base Energy Rate</span>
                  <span className="text-white font-bold">
                    {tariff.currency}{tariff.baseRatePerKWh} / kWh
                  </span>
                </div>
                <div className="bg-[#0b172a] p-3 rounded-xl border border-cyan-950 flex items-center justify-between font-mono">
                  <span className="text-slate-400">Peak Multiplier</span>
                  <span className="text-rose-400 font-bold">{tariff.peakRateMultiplier}x ({tariff.currency}{(tariff.baseRatePerKWh * tariff.peakRateMultiplier).toFixed(3)}/kWh)</span>
                </div>
                <div className="bg-[#0b172a] p-3 rounded-xl border border-cyan-950 flex items-center justify-between font-mono">
                  <span className="text-slate-400">Peak Period Window</span>
                  <span className="text-amber-300 font-bold">{tariff.peakStartHour}:00 – {tariff.peakEndHour}:00</span>
                </div>
                <div className="bg-[#0b172a] p-3 rounded-xl border border-cyan-950 flex items-center justify-between font-mono">
                  <span className="text-slate-400">Demand Capacity Charge</span>
                  <span className="text-slate-200 font-bold">{tariff.currency}{tariff.demandChargePerKW} / kW-mo</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">
              Estimated Annual Electricity Bill: <span className="text-emerald-400 font-bold">{tariff.currency}{(totalCost * 12).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
