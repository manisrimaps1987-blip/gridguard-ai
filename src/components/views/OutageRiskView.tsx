import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Info,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const OutageRiskView: React.FC = () => {
  const outageRiskPct = 7;
  const contributingFactors = [
    { name: 'High Load (Evening Ramp)', weight: 21 },
    { name: 'Voltage Instability (Node D-14)', weight: 12 },
    { name: 'Equipment Risk (Transformer T-002 Thermal Gradient)', weight: 9 },
    { name: 'Historical Pattern (Convective Weather History)', weight: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#16A34A]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              Outage Risk Prediction & Contingency Margin
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Predictive contingency modeling assessing localized grid collapse probability
          </p>
        </div>

        <span className="text-xs font-mono text-[#16A34A] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
          Current Outage Risk: LOW (7%)
        </span>
      </div>

      {/* Main Risk Visualization Dial Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial Risk Meter */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono uppercase font-bold text-[#64748B]">
            CURRENT OUTAGE RISK
          </span>

          <div className="relative my-6 w-44 h-44 flex items-center justify-center">
            {/* SVG Radial Meter */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="#16A34A"
                strokeWidth="10"
                strokeDasharray={`${(outageRiskPct / 100) * 301.5} 301.5`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black font-mono text-[#172033]">
                {outageRiskPct}%
              </span>
              <span className="text-xs font-mono text-[#16A34A] font-bold">LOW RISK</span>
            </div>
          </div>

          <div className="text-xs font-mono text-[#64748B] max-w-xs">
            Substation spinning reserves exceed primary trip margins by +4.8 MW
          </div>
        </div>

        {/* Contributing Factors Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] mb-2">
              Contributing Risk Factors
            </h3>
            <p className="text-xs text-[#64748B] mb-5">
              Factor decomposition calculating cumulative outage probability
            </p>

            <div className="space-y-4 font-mono text-xs">
              {contributingFactors.map((factor, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-slate-800 font-medium">{factor.name}</span>
                    <span className="font-bold text-[#0F3D91]">+{factor.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1976D2] to-[#0F3D91] rounded-full"
                      style={{ width: `${factor.weight * 2.8}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-[#64748B]">
            <span>Model: Bayesian Contingency Evaluator</span>
            <span className="text-[#16A34A] font-bold">✓ 93% Headroom Available</span>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-[#64748B] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#1976D2] shrink-0 mt-0.5" />
        <span>
          Important: Outage risk percentages represent statistical probability calculations for prototype decision-support. GridGuard AI does not claim or guarantee complete elimination of unplanned physical infrastructure failures.
        </span>
      </div>
    </div>
  );
};
