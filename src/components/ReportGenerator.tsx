import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { GridTelemetry, TariffConfig } from '../types/grid';

interface ReportGeneratorProps {
  telemetry: GridTelemetry;
  gridHealthScore: number;
  tariff: TariffConfig;
  onOpenCopilot: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  telemetry,
  gridHealthScore,
  tariff,
  onOpenCopilot,
}) => {
  const [period, setPeriod] = useState('Last 24 Hours');
  const [facility, setFacility] = useState('Metro Power Distribution Grid (Sector 4)');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.generateReport(period, facility);
      setReportData(res.report);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#10b981'],
      });
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadJSON = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GridGuard_Report_${Date.now()}.json`;
    a.click();
  };

  const downloadCSV = () => {
    if (!reportData) return;
    const csvContent = `Metric,Value\nReport Title,"${reportData.title}"\nPeriod,"${reportData.period}"\nGrid Health Score,${reportData.gridHealthScore}\nTotal Consumption MWh,${reportData.totalConsumptionMWh}\nPeak Demand MW,${reportData.peakDemandMW}\nRenewable Share,${reportData.renewableSharePercent}%\nEstimated Cost,${tariff.currency}${reportData.totalCostEstimated}\nPotential Savings,${tariff.currency}${reportData.potentialSavings}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GridGuard_Report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              AI Automated Electricity Audit & Health Report Generator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Produce certified utility audit documentation, peak demand assessments, and carbon mitigation summaries
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>{generating ? 'Compiling Report...' : 'Generate New Audit Report'}</span>
        </button>
      </div>

      {/* Configuration Controls */}
      <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <label className="text-slate-400 flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Audit Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full bg-[#0c182d] border border-cyan-950 rounded-lg p-2 text-white"
          >
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Monthly Utility Cycle (30 Days)</option>
            <option>Quarterly Regulatory Assessment</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 flex items-center gap-1.5 mb-1">
            <Building className="w-3.5 h-3.5 text-cyan-400" /> Grid Facility / Regional Zone
          </label>
          <input
            type="text"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            className="w-full bg-[#0c182d] border border-cyan-950 rounded-lg p-2 text-white"
          />
        </div>

        <div>
          <label className="text-slate-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Regulatory Standard
          </label>
          <div className="bg-[#0c182d] border border-cyan-950 rounded-lg p-2 text-slate-300">
            IEEE 519 & NERC CIP Audit
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerate}
            className="w-full p-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/50 text-cyan-300 text-center transition-colors"
          >
            Refresh Audit Parameters
          </button>
        </div>
      </div>

      {/* Generated Report Presentation (Clean, Printable Document View) */}
      {reportData ? (
        <div className="bg-[#0a1220] border-2 border-cyan-900/60 rounded-2xl p-8 shadow-2xl text-slate-200 space-y-6">
          {/* Document Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cyan-950 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  OFFICIAL GRIDGUARD AI AUDIT REPORT
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white font-['Chakra_Petch'] mt-1">
                {reportData.title}
              </h3>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Facility: {reportData.facility} | Period: {reportData.period} | Generated: {new Date(reportData.generatedAt).toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono text-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-mono text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={downloadJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-mono text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div>
            <h4 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider mb-2">
              1. Executive Summary
            </h4>
            <div className="p-4 bg-[#060c18] border border-cyan-950 rounded-xl text-xs leading-relaxed text-slate-300">
              {reportData.executiveSummary}
            </div>
          </div>

          {/* 2. Key Metrics Matrix */}
          <div>
            <h4 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider mb-2">
              2. Grid Performance & Consumption Metrics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-[#060c18] p-3 rounded-xl border border-cyan-950">
                <span className="text-slate-500">Grid Health Score</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {reportData.gridHealthScore} / 100
                </div>
              </div>
              <div className="bg-[#060c18] p-3 rounded-xl border border-cyan-950">
                <span className="text-slate-500">Total Consumption</span>
                <div className="text-xl font-bold text-cyan-300 mt-1">
                  {reportData.totalConsumptionMWh} MWh
                </div>
              </div>
              <div className="bg-[#060c18] p-3 rounded-xl border border-cyan-950">
                <span className="text-slate-500">Peak Demand Recorded</span>
                <div className="text-xl font-bold text-rose-300 mt-1">
                  {reportData.peakDemandMW} MW @ {reportData.peakDemandTime}
                </div>
              </div>
              <div className="bg-[#060c18] p-3 rounded-xl border border-cyan-950">
                <span className="text-slate-500">Renewable Contribution</span>
                <div className="text-xl font-bold text-yellow-300 mt-1">
                  {reportData.renewableSharePercent}%
                </div>
              </div>
            </div>
          </div>

          {/* 3. Electrical Quality & Tolerances */}
          <div>
            <h4 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider mb-2">
              3. Power Quality Baseline (IEEE Compliance)
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-[#060c18] p-3 rounded-xl border border-cyan-950">
                <span className="text-slate-500">Mean Phase Voltage:</span>
                <span className="text-white font-bold ml-2">{reportData.averageVoltage} V (±0.4%)</span>
              </div>
              <div className="bg-[#060c18] p-3 rounded-xl border border-cyan-950">
                <span className="text-slate-500">Mean Frequency:</span>
                <span className="text-white font-bold ml-2">{reportData.averageFrequency} Hz (±0.02)</span>
              </div>
              <div className="bg-[#060c18] p-3 rounded-xl border border-cyan-950">
                <span className="text-slate-500">Power Factor:</span>
                <span className="text-white font-bold ml-2">{reportData.averagePowerFactor} cos φ</span>
              </div>
            </div>
          </div>

          {/* 4. AI Strategic Recommendations */}
          <div>
            <h4 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider mb-2">
              4. AI Operational Recommendations
            </h4>
            <div className="space-y-2 text-xs">
              {reportData.recommendations.map((rec: string, i: number) => (
                <div
                  key={i}
                  className="bg-[#060c18] border border-cyan-950 p-3 rounded-xl flex items-start gap-2 text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Disclaimer */}
          <div className="pt-4 border-t border-cyan-950 text-[11px] font-mono text-slate-500">
            GridGuard AI Audit Engine • Automated analytical report • Certified for internal engineering review and SCADA optimization.
          </div>
        </div>
      ) : (
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-10 text-center space-y-3">
          <FileText className="w-10 h-10 text-cyan-400 mx-auto" />
          <h4 className="text-base font-bold text-white font-['Chakra_Petch']">
            No Report Compiled Yet
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the button above to compile a comprehensive executive audit report based on live electrical telemetry.
          </p>
          <button
            onClick={handleGenerate}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
          >
            Generate Audit Report Now
          </button>
        </div>
      )}
    </div>
  );
};
