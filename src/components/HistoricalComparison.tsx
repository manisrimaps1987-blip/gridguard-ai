import React, { useState } from 'react';
import {
  History,
  TrendingUp,
  TrendingDown,
  Calendar,
  Zap,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { TariffConfig } from '../types/grid';

interface HistoricalComparisonProps {
  tariff: TariffConfig;
  onOpenCopilot: () => void;
}

export const HistoricalComparison: React.FC<HistoricalComparisonProps> = ({
  tariff,
  onOpenCopilot,
}) => {
  const [comparisonMode, setComparisonMode] = useState<
    'Yesterday vs Today' | 'Week vs Week' | 'Month vs Month' | 'Year vs Year'
  >('Yesterday vs Today');

  // Comparative metrics depending on selected mode
  const comparisonData = {
    'Yesterday vs Today': {
      period1Label: 'Yesterday',
      period2Label: 'Today',
      consumptionP1: 73.6,
      consumptionP2: 71.8,
      consumptionUnit: 'MWh',
      consumptionChangePct: -2.4,
      peakDemandP1: 5.28,
      peakDemandP2: 5.12,
      peakDemandUnit: 'MW',
      peakDemandChangePct: -3.0,
      costP1: 10740,
      costP2: 10450,
      costChangePct: -2.7,
      renewableShareP1: 31.5,
      renewableShareP2: 34.2,
      renewableShareChangePct: +8.6,
      commentary:
        'Energy consumption decreased by 2.4% today due to improved industrial HVAC scheduling and cooler ambient temperatures.',
    },
    'Week vs Week': {
      period1Label: 'Previous Week',
      period2Label: 'Current Week',
      consumptionP1: 512.4,
      consumptionP2: 555.4,
      consumptionUnit: 'MWh',
      consumptionChangePct: +8.4,
      peakDemandP1: 5.34,
      peakDemandP2: 5.17,
      peakDemandUnit: 'MW',
      peakDemandChangePct: -3.2,
      costP1: 76860,
      costP2: 83310,
      costChangePct: +8.4,
      renewableShareP1: 29.4,
      renewableShareP2: 33.8,
      renewableShareChangePct: +15.0,
      commentary:
        'Energy consumption increased by 8.4% week-over-week due to an industrial production surge at Sector 4, while peak demand decreased by 3.2% via successful BESS peak shaving.',
    },
    'Month vs Month': {
      period1Label: 'Previous Month (Sep)',
      period2Label: 'Current Month (Oct)',
      consumptionP1: 2450,
      consumptionP2: 2320,
      consumptionUnit: 'MWh',
      consumptionChangePct: -5.3,
      peakDemandP1: 5.4,
      peakDemandP2: 5.1,
      peakDemandUnit: 'MW',
      peakDemandChangePct: -5.5,
      costP1: 392000,
      costP2: 348000,
      costChangePct: -11.2,
      renewableShareP1: 28.0,
      renewableShareP2: 34.0,
      renewableShareChangePct: +21.4,
      commentary:
        'Monthly electricity expenditure fell by 11.2% following the commission of South Valley Solar Park array.',
    },
    'Year vs Year': {
      period1Label: 'Previous Year (2025)',
      period2Label: 'Current Year (2026)',
      consumptionP1: 28400,
      consumptionP2: 27900,
      consumptionUnit: 'MWh',
      consumptionChangePct: -1.8,
      peakDemandP1: 6.2,
      peakDemandP2: 5.4,
      peakDemandUnit: 'MW',
      peakDemandChangePct: -12.9,
      costP1: 4544000,
      costP2: 4185000,
      costChangePct: -7.9,
      renewableShareP1: 22.0,
      renewableShareP2: 34.2,
      renewableShareChangePct: +55.4,
      commentary:
        'Year-over-year peak demand dropped 12.9% (-0.8 MW) while renewable integration rose by 55.4%.',
    },
  }[comparisonMode];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              Period-over-Period Historical Comparative Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare consumption, peak loads, electricity costs, and renewable generation with percentage change metrics
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-[#060c18] border border-cyan-950 p-1 rounded-xl text-xs font-mono">
          {(
            [
              'Yesterday vs Today',
              'Week vs Week',
              'Month vs Month',
              'Year vs Year',
            ] as const
          ).map((mode) => (
            <button
              key={mode}
              onClick={() => setComparisonMode(mode)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                comparisonMode === mode
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Energy Consumption */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              ENERGY CONSUMPTION
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">
                  {comparisonData.period2Label}
                </span>
                <span className="text-2xl font-bold font-mono text-cyan-200">
                  {comparisonData.consumptionP2}{' '}
                  <span className="text-xs font-normal">{comparisonData.consumptionUnit}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-mono">
                  {comparisonData.period1Label}
                </span>
                <span className="text-sm font-mono text-slate-400">
                  {comparisonData.consumptionP1} {comparisonData.consumptionUnit}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-950 flex items-center justify-between text-xs font-mono">
            <span>Delta:</span>
            <span
              className={`flex items-center gap-1 font-bold ${
                comparisonData.consumptionChangePct <= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {comparisonData.consumptionChangePct <= 0 ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(comparisonData.consumptionChangePct)}%</span>
            </span>
          </div>
        </div>

        {/* 2. Peak Demand */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">PEAK DEMAND</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">
                  {comparisonData.period2Label}
                </span>
                <span className="text-2xl font-bold font-mono text-rose-300">
                  {comparisonData.peakDemandP2}{' '}
                  <span className="text-xs font-normal">{comparisonData.peakDemandUnit}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-mono">
                  {comparisonData.period1Label}
                </span>
                <span className="text-sm font-mono text-slate-400">
                  {comparisonData.peakDemandP1} {comparisonData.peakDemandUnit}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-950 flex items-center justify-between text-xs font-mono">
            <span>Peak Shaving Delta:</span>
            <span
              className={`flex items-center gap-1 font-bold ${
                comparisonData.peakDemandChangePct <= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {comparisonData.peakDemandChangePct <= 0 ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(comparisonData.peakDemandChangePct)}%</span>
            </span>
          </div>
        </div>

        {/* 3. Electricity Cost */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              ESTIMATED COST ({tariff.currency})
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">
                  {comparisonData.period2Label}
                </span>
                <span className="text-2xl font-bold font-mono text-amber-300">
                  {tariff.currency}
                  {comparisonData.costP2.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-mono">
                  {comparisonData.period1Label}
                </span>
                <span className="text-sm font-mono text-slate-400">
                  {tariff.currency}
                  {comparisonData.costP1.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-950 flex items-center justify-between text-xs font-mono">
            <span>Bill Impact:</span>
            <span
              className={`flex items-center gap-1 font-bold ${
                comparisonData.costChangePct <= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {comparisonData.costChangePct <= 0 ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(comparisonData.costChangePct)}%</span>
            </span>
          </div>
        </div>

        {/* 4. Renewable Share */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              RENEWABLE INTEGRATION
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-mono">
                  {comparisonData.period2Label}
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-300">
                  {comparisonData.renewableShareP2}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-mono">
                  {comparisonData.period1Label}
                </span>
                <span className="text-sm font-mono text-slate-400">
                  {comparisonData.renewableShareP1}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-950 flex items-center justify-between text-xs font-mono">
            <span>Green Penetration:</span>
            <span className="flex items-center gap-1 font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{comparisonData.renewableShareChangePct}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Comparative Insights */}
      <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-300 font-bold font-['Chakra_Petch'] text-sm mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Historical Diagnostic Commentary ({comparisonMode})</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          {comparisonData.commentary}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Benchmark: Weather Normalized Baseline Model</span>
          <button onClick={onOpenCopilot} className="text-cyan-400 hover:underline">
            Ask Copilot to explain period-over-period differences
          </button>
        </div>
      </div>
    </div>
  );
};
