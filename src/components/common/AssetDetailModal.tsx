import React from 'react';
import { X, Cpu, Thermometer, Activity, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { GridAsset } from '../../types/grid';

interface AssetDetailModalProps {
  asset: GridAsset | null;
  onClose: () => void;
  onOpenAnalysis?: (asset: GridAsset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onOpenAnalysis,
}) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0F3D91] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#1976D2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#0F3D91]">{asset.id}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded border ${
                    asset.status === 'Healthy'
                      ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                      : asset.status === 'Warning'
                      ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                      : 'bg-red-50 text-[#DC2626] border-red-200'
                  }`}
                >
                  {asset.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] leading-tight">
                {asset.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
          <div className="bg-[#F6F9FC] p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-[#64748B] text-[10px]">
              <span>TEMPERATURE</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-[#172033] mt-1">{asset.temperatureC}°C</div>
            <div className="text-[10px] text-[#64748B]">Threshold: 85°C</div>
          </div>

          <div className="bg-[#F6F9FC] p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-[#64748B] text-[10px]">
              <span>LOAD RATIO</span>
              <Activity className="w-3.5 h-3.5 text-[#1976D2]" />
            </div>
            <div className="text-xl font-bold text-[#172033] mt-1">{asset.loadPct}%</div>
            <div className="text-[10px] text-[#64748B]">Health: {asset.healthPct}%</div>
          </div>
        </div>

        {/* Spec details */}
        <div className="space-y-2 text-xs font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-4">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Asset Type:</span>
            <span className="text-[#172033] font-semibold">{asset.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Physical Location:</span>
            <span className="text-[#172033] font-semibold">{asset.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Risk Level:</span>
            <span
              className={`font-bold ${
                asset.risk === 'Low'
                  ? 'text-[#16A34A]'
                  : asset.risk === 'Medium'
                  ? 'text-[#F59E0B]'
                  : 'text-[#DC2626]'
              }`}
            >
              {asset.risk} Risk
            </span>
          </div>
          {asset.specifications && (
            <>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-[#64748B]">Voltage Level:</span>
                <span className="text-[#172033]">{asset.specifications.voltageLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Capacity:</span>
                <span className="text-[#172033]">{asset.specifications.ratedCapacity}</span>
              </div>
            </>
          )}
        </div>

        {/* Predictive maintenance recommendation if available */}
        {asset.predictiveData && (
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl mb-4 text-xs">
            <div className="font-bold text-[#0F3D91] flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Next Recommended Inspection: {asset.predictiveData.nextRecommendedInspection}</span>
            </div>
            <p className="text-[#64748B] text-[11px] leading-tight">
              Temperature trend: {asset.predictiveData.temperatureTrend} • Load trend: {asset.predictiveData.loadTrend}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-[#64748B] font-mono">Last update: {asset.lastUpdate}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0F3D91] hover:bg-[#1976D2] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
