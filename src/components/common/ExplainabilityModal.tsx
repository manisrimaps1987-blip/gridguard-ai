import React from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { AIReliabilityPrediction } from '../../types/grid';

interface ExplainabilityModalProps {
  prediction: AIReliabilityPrediction | null;
  onClose: () => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  prediction,
  onClose,
}) => {
  if (!prediction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0F3D91] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#1976D2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#172033] font-['Chakra_Petch'] leading-tight">
                Why is the risk changing?
              </h3>
              <p className="text-xs text-[#64748B] font-mono">
                {prediction.category} • Model Explainability (XAI)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Score Summary Banner */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#64748B] font-bold">
              PREDICTED RISK INDEX
            </span>
            <div className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              Risk Score: <span className="text-[#0F3D91]">{prediction.probabilityPct}%</span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              prediction.status === 'LOW'
                ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                : prediction.status === 'MODERATE'
                ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                : 'bg-red-50 text-[#DC2626] border-red-200'
            }`}
          >
            {prediction.status} RISK
          </span>
        </div>

        {/* Contributing Factors with Horizontal Progress Bars */}
        <div className="space-y-4 mb-6">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-[#172033]">
            Key Contributing Factors
          </div>

          <div className="space-y-3">
            {prediction.contributingFactors.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#172033]">{item.factor}</span>
                  <span className="font-mono font-bold text-[#0F3D91]">
                    +{item.impactPct}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1976D2] to-[#0F3D91] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, item.impactPct * 2.5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Action */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl mb-4 text-xs">
          <div className="font-bold text-[#0F3D91] flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#1976D2]" />
            <span>Recommended Engineering Mitigation</span>
          </div>
          <p className="text-slate-700 leading-relaxed font-sans">
            {prediction.recommendedAction}
          </p>
        </div>

        {/* Demonstration Disclaimer Note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2 text-[11px] text-[#64748B] font-mono leading-tight">
          <Info className="w-4 h-4 text-[#1976D2] shrink-0 mt-0.5" />
          <span>
            These risk metrics are model outputs for demonstration and should not be treated as certified operational instructions.
          </span>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0F3D91] hover:bg-[#1976D2] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Dismiss Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
