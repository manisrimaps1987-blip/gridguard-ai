import React from 'react';
import {
  TrendingUp,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { AIReliabilityPrediction } from '../../types/grid';

interface AIPredictionsViewProps {
  predictions: AIReliabilityPrediction[];
  onOpenAnalysis: (pred: AIReliabilityPrediction) => void;
}

export const AIPredictionsView: React.FC<AIPredictionsViewProps> = ({
  predictions,
  onOpenAnalysis,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1976D2]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              AI Reliability Prediction Engine
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Predictive machine learning models identifying failure risk, thermal hotspots, and voltage instabilities
          </p>
        </div>

        <span className="text-xs font-mono text-[#0F3D91] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-bold">
          Confidence Level: 97.4% (Multi-Vector Ensemble)
        </span>
      </div>

      {/* Main Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {predictions.map((pred) => (
          <div
            key={pred.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-[#1976D2] hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-100 pb-3 mb-3">
                <span className="font-bold text-[#0F3D91] uppercase text-[11px]">
                  {pred.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    pred.status === 'LOW'
                      ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                      : pred.status === 'MODERATE'
                      ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                      : 'bg-red-50 text-[#DC2626] border-red-200'
                  }`}
                >
                  {pred.status} RISK
                </span>
              </div>

              <div className="flex items-baseline justify-between my-2">
                <span className="text-4xl font-black font-mono text-[#172033]">
                  {pred.probabilityPct}%
                </span>
                <span className="text-xs font-mono text-[#64748B]">Probability</span>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed mt-2">
                {pred.shortExplanation}
              </p>

              {/* Recommendation Preview */}
              <div className="mt-4 p-3 bg-[#F6F9FC] rounded-xl border border-slate-200/80 text-xs">
                <div className="font-bold text-[#0F3D91] flex items-center gap-1.5 mb-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1976D2]" />
                  <span>Mitigation Protocol</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-tight">
                  {pred.recommendedAction}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => onOpenAnalysis(pred)}
                className="w-full py-2 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0F3D91] font-bold text-xs font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View AI Analysis (Why?)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Model Explainability banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-xs text-[#64748B] font-mono flex items-start gap-3">
        <Info className="w-5 h-5 text-[#1976D2] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#172033]">XAI Methodology:</span> Predictions are generated using tree-ensemble and recurrent architectures correlating thermal time series, phase unbalance, and historical contingency patterns. Click *"View AI Analysis"* on any prediction to inspect individual contributing feature weights.
        </div>
      </div>
    </div>
  );
};
