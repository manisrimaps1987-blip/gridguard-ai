import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  Info,
  CheckCircle2,
  ExternalLink,
  X,
} from 'lucide-react';
import { GridAsset } from '../../types/grid';

interface PredictiveMaintenanceViewProps {
  assets: GridAsset[];
  onSelectAsset: (asset: GridAsset) => void;
}

export const PredictiveMaintenanceView: React.FC<PredictiveMaintenanceViewProps> = ({
  assets,
  onSelectAsset,
}) => {
  const [selectedAssetForAnalysis, setSelectedAssetForAnalysis] = useState<GridAsset | null>(
    null
  );

  const maintenanceAssets = assets.filter((a) => a.predictiveData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#0F3D91]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              AI Predictive Maintenance & Asset Reliability
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Identify grid equipment that may require inspection based on operational thermal and loading patterns
          </p>
        </div>

        <span className="text-xs font-mono text-[#0F3D91] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 font-bold">
          Prioritized Fleet Inspection Schedule
        </span>
      </div>

      {/* Spotlight: Transformer T-002 Thermal Advisory */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold">
              ATTENTION REQUIRED
            </span>
            <span className="text-sm font-bold text-[#172033] font-mono">
              Transformer T-002 • Substation B
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#172033] font-['Chakra_Petch']">
            Approaching High-Load & Thermal Stress Inspection Threshold
          </h3>
          <p className="text-xs text-[#64748B] max-w-2xl font-sans">
            Transformer T-002 shows continuous loading at 91% and increasing core temperature (78°C). Recommended inspection is scheduled in 6 Days.
          </p>
        </div>

        <button
          onClick={() => {
            const t2 = assets.find((a) => a.id === 'T-002');
            if (t2) setSelectedAssetForAnalysis(t2);
          }}
          className="px-4 py-2 bg-[#0F3D91] hover:bg-[#1976D2] text-white font-bold text-xs font-mono rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          View T-002 Analysis
        </button>
      </div>

      {/* Predictive Maintenance Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] mb-4">
          Fleet Equipment Health & Recommended Inspection Schedule
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F6F9FC] text-[#64748B] uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Asset ID</th>
                <th className="py-3 px-3">Equipment Type</th>
                <th className="py-3 px-3">Health Score</th>
                <th className="py-3 px-3">Failure Risk</th>
                <th className="py-3 px-3">Temp Trend</th>
                <th className="py-3 px-3">Load Trend</th>
                <th className="py-3 px-3">Last Maintenance</th>
                <th className="py-3 px-3">Next Inspection</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#172033]">
              {maintenanceAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#0F3D91]">{asset.id}</td>
                  <td className="py-3 px-3 text-[#64748B]">{asset.type}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        asset.healthPct < 75
                          ? 'text-[#F59E0B]'
                          : 'text-[#16A34A]'
                      }`}
                    >
                      {asset.healthPct}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        asset.risk === 'Low'
                          ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                          : asset.risk === 'Medium'
                          ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                          : 'bg-red-50 text-[#DC2626] border-red-200'
                      }`}
                    >
                      {asset.risk} Risk
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        asset.predictiveData?.temperatureTrend === 'Increasing'
                          ? 'text-[#F59E0B]'
                          : 'text-slate-700'
                      }`}
                    >
                      {asset.predictiveData?.temperatureTrend}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        asset.predictiveData?.loadTrend === 'Increasing'
                          ? 'text-[#F59E0B]'
                          : 'text-slate-700'
                      }`}
                    >
                      {asset.predictiveData?.loadTrend}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#64748B]">
                    {asset.predictiveData?.lastMaintenance}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#0F3D91]">
                    {asset.predictiveData?.nextRecommendedInspection}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => setSelectedAssetForAnalysis(asset)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0F3D91] rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      View Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Output Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-[#64748B] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#1976D2] shrink-0 mt-0.5" />
        <span>
          Important: These are AI/model outputs for demonstration and must not be represented as certified engineering predictions. Real-world maintenance scheduling requires licensed utility engineering inspection and physical dissolved gas chromatography.
        </span>
      </div>

      {/* Modal: View Analysis */}
      {selectedAssetForAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#0F3D91]">
                  {selectedAssetForAnalysis.id}
                </span>
                <h3 className="text-lg font-bold text-[#172033] font-['Chakra_Petch']">
                  Asset Reliability Risk Factor Analysis
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssetForAnalysis(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono mb-4">
              <div className="grid grid-cols-2 gap-3 bg-[#F6F9FC] p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[#64748B]">Health Score</span>
                  <div className="text-xl font-bold text-[#0F3D91]">
                    {selectedAssetForAnalysis.healthPct}%
                  </div>
                </div>
                <div>
                  <span className="text-[#64748B]">Failure Risk</span>
                  <div className="text-xl font-bold text-[#F59E0B]">
                    {selectedAssetForAnalysis.risk}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-[#172033] block mb-2 uppercase text-[10px]">
                  Contributing Risk Factors:
                </span>
                <div className="space-y-2.5">
                  {selectedAssetForAnalysis.predictiveData?.contributingFactors.map(
                    (factor, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-800 font-sans">{factor.factor}</span>
                          <span className="font-bold text-[#0F3D91]">+{factor.impactPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1976D2] rounded-full"
                            style={{ width: `${Math.min(100, factor.impactPct * 2.8)}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAssetForAnalysis(null)}
                className="px-4 py-2 bg-[#0F3D91] text-white font-bold text-xs rounded-xl"
              >
                Dismiss Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
