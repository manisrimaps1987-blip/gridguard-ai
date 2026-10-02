import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Database,
  Cpu,
  BarChart3,
  TrendingUp,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_CSV_DATASETS } from '../data/mockGridData';
import { api } from '../services/api';

interface DataUploadModuleProps {
  onOpenCopilot: () => void;
}

export const DataUploadModule: React.FC<DataUploadModuleProps> = ({ onOpenCopilot }) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
      processDataset(file.name, text);
    };
    reader.readAsText(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_CSV_DATASETS[0]) => {
    setFileName(sample.name);
    setFileContent(sample.content);
    processDataset(sample.name, sample.content);
  };

  const processDataset = async (name: string, content: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await api.uploadDataset(name, content);
      setUploadResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process dataset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              Electricity Dataset Ingestion & ML Pipeline
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload CSV/JSON smart meter files for automated validation, anomaly scanning, and model training
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Supports: timestamp, voltage, current, power, frequency, PF</span>
        </div>
      </div>

      {/* Pre-Loaded Sample Datasets (1-Click Loading) */}
      <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
        <h3 className="text-base font-bold text-white font-['Chakra_Petch'] mb-2">
          Pre-Loaded Utility Test Datasets (1-Click Validation)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Click any industrial dataset below to trigger instantaneous automated validation and ML model execution:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_CSV_DATASETS.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className="bg-[#0b172a] border border-cyan-950 hover:border-cyan-500/60 p-4 rounded-xl cursor-pointer transition-all group shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  {sample.rows} rows
                </span>
              </div>
              <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                {sample.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {sample.description}
              </div>
              <div className="mt-3 text-[10px] font-mono text-cyan-400 group-hover:underline">
                ↳ Load & Run ML Pipeline
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Upload Drop Zone */}
      <div className="bg-[#081223] border-2 border-dashed border-cyan-900/60 hover:border-cyan-500/60 rounded-2xl p-8 text-center transition-colors">
        <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
        <h4 className="text-base font-bold text-white font-['Chakra_Petch']">
          Drag and drop your electricity dataset (CSV / JSON)
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Expected schema: <code className="text-cyan-300">timestamp, voltage, current, power, frequency, power_factor, load</code>
        </p>

        <label className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs cursor-pointer shadow-lg transition-transform active:scale-95">
          <span>Browse File from Disk</span>
          <input
            type="file"
            accept=".csv,.json,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Processing Indicator */}
      {loading && (
        <div className="p-6 bg-[#081223] border border-cyan-900/50 rounded-2xl text-center space-y-3">
          <Cpu className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <div className="text-sm font-bold text-white font-mono">
            Executing Automated Smart Grid ML Pipeline...
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Cleaning missing packets → Scanning harmonic anomalies → Training XGBoost ensemble
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-950/40 border border-rose-900 text-rose-300 text-xs font-mono rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Error: {errorMessage}</span>
        </div>
      )}

      {/* Upload Results & 8-Step Pipeline Summary */}
      {uploadResult && (
        <div className="space-y-6">
          {/* Pipeline Completion Steps */}
          <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                Pipeline Execution Status ({uploadResult.filename})
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                100% Processed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-mono">
              {[
                '1. Validated Schema',
                '2. Data Previewed',
                '3. Nulls Imputed',
                '4. Anomalies Flagged',
                '5. Analytics Computed',
                '6. Model Retrained',
                '7. Dashboard Synced',
                '8. Audit Generated',
              ].map((step, idx) => (
                <div key={idx} className="bg-[#0b172a] border border-cyan-950 p-2.5 rounded-lg text-emerald-300 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[10px]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dataset Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">PROCESSED ROWS</div>
              <div className="text-xl font-bold font-mono text-cyan-200 mt-1">
                {uploadResult.rowCount} <span className="text-xs text-slate-400">records</span>
              </div>
            </div>

            <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">MEAN VOLTAGE</div>
              <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                {uploadResult.stats.meanVoltage} V
              </div>
            </div>

            <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">PEAK POWER LOAD</div>
              <div className="text-xl font-bold font-mono text-rose-300 mt-1">
                {uploadResult.stats.peakPowerMW} MW
              </div>
            </div>

            <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">ANOMALIES DETECTED</div>
              <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                {uploadResult.stats.anomaliesDetectedCount} <span className="text-xs text-slate-400">points</span>
              </div>
            </div>

            <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">DATA QUALITY SCORE</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {uploadResult.stats.dataQualityScore} / 100
              </div>
            </div>
          </div>

          {/* Tabular Preview */}
          <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-white font-['Chakra_Petch'] mb-3">
              Dataset Records Preview (First 8 Rows)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0c182f] text-slate-400 uppercase text-[10px] border-b border-cyan-950">
                  <tr>
                    {uploadResult.columns.map((col: string, i: number) => (
                      <th key={i} className="py-2 px-3">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {uploadResult.preview.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-900/50">
                      {uploadResult.columns.map((col: string, j: number) => (
                        <td key={j} className="py-2 px-3">
                          {row[col] !== undefined ? row[col] : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-emerald-400">✓ {uploadResult.modelTrained}</span>
              <button onClick={onOpenCopilot} className="text-cyan-400 hover:underline">
                Ask Copilot to analyze uploaded dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
