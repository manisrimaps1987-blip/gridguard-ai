import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  Info,
  Zap,
} from 'lucide-react';
import { PowerLoadChart } from '../common/PowerLoadChart';
import { GridMetrics } from '../../types/grid';

interface LoadForecastViewProps {
  metrics: GridMetrics;
}

export const LoadForecastView: React.FC<LoadForecastViewProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1976D2]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              AI Electricity Demand Forecasting
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            AI forecasting identifies expected demand patterns from historical and simulated grid data.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0F3D91] font-bold border border-blue-200">
            Model: LSTM + XGBoost Ensemble
          </span>
        </div>
      </div>

      {/* 4 Forecast KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Current Demand */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-mono text-[#64748B] uppercase">CURRENT DEMAND</div>
          <div className="text-3xl font-black font-mono text-[#0F3D91] mt-2">
            {metrics.currentLoadMW} <span className="text-xs font-normal text-[#64748B]">MW</span>
          </div>
          <div className="text-[11px] text-[#64748B] font-mono mt-1">Real-Time Ingestion</div>
        </div>

        {/* Predicted Peak */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-mono text-[#64748B] uppercase">PREDICTED PEAK</div>
          <div className="text-3xl font-black font-mono text-[#1976D2] mt-2">
            {metrics.peakLoadMW} <span className="text-xs font-normal text-[#64748B]">MW</span>
          </div>
          <div className="text-[11px] text-[#1976D2] font-mono mt-1 font-bold">
            Predicted Peak: 18.7 MW at 19:00
          </div>
        </div>

        {/* Minimum Baseload */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-mono text-[#64748B] uppercase">MINIMUM DEMAND</div>
          <div className="text-3xl font-black font-mono text-[#16A34A] mt-2">
            9.6 <span className="text-xs font-normal text-[#64748B]">MW</span>
          </div>
          <div className="text-[11px] text-[#16A34A] font-mono mt-1">Off-Peak (04:00 AM)</div>
        </div>

        {/* Average Load */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-mono text-[#64748B] uppercase">AVERAGE EXPECTED</div>
          <div className="text-3xl font-black font-mono text-slate-800 mt-2">
            {metrics.averageLoadMW} <span className="text-xs font-normal text-[#64748B]">MW</span>
          </div>
          <div className="text-[11px] text-[#64748B] font-mono mt-1">Diurnal Mean</div>
        </div>
      </div>

      {/* Main Forecast Chart Component */}
      <PowerLoadChart
        currentLoadMW={metrics.currentLoadMW}
        peakLoadMW={metrics.peakLoadMW}
        averageLoadMW={metrics.averageLoadMW}
      />

      {/* Explanation Banner */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 flex items-start gap-3 text-xs text-[#0F3D91] font-mono">
        <Sparkles className="w-5 h-5 text-[#1976D2] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">AI Forecasting Methodology:</span> AI forecasting identifies expected demand patterns from historical and simulated grid data. Predictions account for industrial shift cycles, EV charging cluster load ramps, and temperature-driven HVAC utilization curves.
        </div>
      </div>
    </div>
  );
};
