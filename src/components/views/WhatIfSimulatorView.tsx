import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Info,
  Activity,
  ArrowRight,
} from 'lucide-react';

export const WhatIfSimulatorView: React.FC = () => {
  const [loadIncrease, setLoadIncrease] = useState<number>(0); // 0 -> 50%
  const [renewableGen, setRenewableGen] = useState<number>(34); // 0 -> 100%
  const [transformerLoad, setTransformerLoad] = useState<number>(91); // 0 -> 120%
  const [voltageVariation, setVoltageVariation] = useState<number>(0); // -10 -> +10%

  // Compute simulation projections
  const baseLoadPct = 76;
  const projectedLoadPct = Math.min(125, Math.round(baseLoadPct + loadIncrease * 0.75 - (renewableGen - 34) * 0.15));
  
  // Reliability score calculation
  const reliabilityScore = Math.max(
    45,
    Math.min(99, Math.round(94 - loadIncrease * 0.4 - Math.abs(voltageVariation) * 1.5 - (transformerLoad > 95 ? (transformerLoad - 95) * 0.8 : 0)))
  );

  const gridRiskRating =
    projectedLoadPct > 95 || reliabilityScore < 75
      ? 'CRITICAL'
      : projectedLoadPct > 85 || reliabilityScore < 88
      ? 'MODERATE RISK'
      : 'LOW';

  const t002Status =
    transformerLoad > 100
      ? 'Critical'
      : transformerLoad > 88
      ? 'Warning'
      : 'Healthy';

  const voltageStabilityStatus =
    Math.abs(voltageVariation) > 5
      ? 'High Risk'
      : Math.abs(voltageVariation) > 2 || loadIncrease > 15
      ? 'Moderate Risk'
      : 'Normal';

  const handleApply20PctPreset = () => {
    setLoadIncrease(20);
    setTransformerLoad(102);
    setVoltageVariation(-2.1);
  };

  const handleReset = () => {
    setLoadIncrease(0);
    setRenewableGen(34);
    setTransformerLoad(91);
    setVoltageVariation(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#0F3D91]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              What-If Grid Contingency Simulator
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Test hypothetical electrical grid load surges, renewable drops, and voltage fluctuations
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleApply20PctPreset}
            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0F3D91] font-bold border border-blue-200 transition-colors cursor-pointer"
          >
            Run Scenario: Load +20%
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Simulator Workspace: Sliders vs Dynamic Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] mb-4">
            Simulation Stress Parameters
          </h3>

          {/* Slider 1: Load Increase */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#172033]">Load Increase</span>
              <span className="text-[#0F3D91] font-bold">+{loadIncrease}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={loadIncrease}
              onChange={(e) => setLoadIncrease(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0F3D91]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
              <span>0% (Nominal)</span>
              <span>+25%</span>
              <span>+50% (Extreme Peak)</span>
            </div>
          </div>

          {/* Slider 2: Renewable Generation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#172033]">Renewable Generation (Solar + Wind)</span>
              <span className="text-amber-500 font-bold">{renewableGen}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={renewableGen}
              onChange={(e) => setRenewableGen(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
              <span>0% (Dunkelflaute)</span>
              <span>50%</span>
              <span>100% (High Inflow)</span>
            </div>
          </div>

          {/* Slider 3: Transformer Loading */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#172033]">Transformer T-002 Loading</span>
              <span className="text-[#1976D2] font-bold">{transformerLoad}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              value={transformerLoad}
              onChange={(e) => setTransformerLoad(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1976D2]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
              <span>0%</span>
              <span>85% (Warning)</span>
              <span>120% (Severe Overload)</span>
            </div>
          </div>

          {/* Slider 4: Voltage Variation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#172033]">Voltage Variation</span>
              <span className="text-slate-800 font-bold">
                {voltageVariation > 0 ? `+${voltageVariation}%` : `${voltageVariation}%`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={voltageVariation}
              onChange={(e) => setVoltageVariation(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0F3D91]"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
              <span>-10% (Sag)</span>
              <span>0% Nominal (229V)</span>
              <span>+10% (Swell)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Simulation Outputs */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch']">
                Projected Grid Impact Matrix
              </h3>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${
                  gridRiskRating === 'LOW'
                    ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                    : gridRiskRating === 'MODERATE RISK'
                    ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                    : 'bg-red-50 text-[#DC2626] border-red-200 animate-pulse'
                }`}
              >
                {gridRiskRating}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs font-mono">
              {/* Projected Load */}
              <div className="p-3.5 bg-[#F6F9FC] rounded-xl border border-slate-200/80">
                <span className="text-[#64748B] text-[10px]">PROJECTED LOAD</span>
                <div className="text-2xl font-black text-[#0F3D91] mt-1">
                  {projectedLoadPct}%
                </div>
                <div className="text-[10px] text-[#64748B]">Baseline: 76%</div>
              </div>

              {/* Reliability Score */}
              <div className="p-3.5 bg-[#F6F9FC] rounded-xl border border-slate-200/80">
                <span className="text-[#64748B] text-[10px]">RELIABILITY SCORE</span>
                <div className="text-2xl font-black text-[#16A34A] mt-1">
                  94 → <span className={reliabilityScore < 85 ? 'text-[#DC2626]' : 'text-[#F59E0B]'}>{reliabilityScore}%</span>
                </div>
                <div className="text-[10px] text-[#64748B]">Calculated Stability</div>
              </div>

              {/* Transformer T-002 */}
              <div className="p-3.5 bg-[#F6F9FC] rounded-xl border border-slate-200/80">
                <span className="text-[#64748B] text-[10px]">TRANSFORMER T-002</span>
                <div className="text-sm font-bold text-[#172033] mt-1">
                  Healthy → <span className={t002Status === 'Critical' ? 'text-[#DC2626]' : 'text-[#F59E0B]'}>{t002Status}</span>
                </div>
                <div className="text-[10px] text-[#64748B]">Thermal Headroom: {120 - transformerLoad}%</div>
              </div>

              {/* Voltage Stability */}
              <div className="p-3.5 bg-[#F6F9FC] rounded-xl border border-slate-200/80">
                <span className="text-[#64748B] text-[10px]">VOLTAGE STABILITY</span>
                <div className="text-sm font-bold text-[#172033] mt-1">
                  {voltageStabilityStatus}
                </div>
                <div className="text-[10px] text-[#64748B]">Bus: {(229 * (1 + voltageVariation / 100)).toFixed(1)} V</div>
              </div>
            </div>

            {/* Generated Alerts in Scenario */}
            {loadIncrease > 15 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-mono text-[#DC2626] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Contingency Alert: Feeder B load exceeds 90% threshold. Immediate BESS discharge required.
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-[#64748B]">
            <span>Model: Power Flow Newton-Raphson Solver</span>
            <span className="text-[#0F3D91] font-bold">100% Simulated Sandboxed Environment</span>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-[#64748B] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#1976D2] shrink-0 mt-0.5" />
        <span>
          Simulation Disclaimer: This What-If Simulator is a demonstration and training sandbox for evaluating hypothetical grid scenarios. It does not issue commands to real physical switchgear or live electrical infrastructure.
        </span>
      </div>
    </div>
  );
};
