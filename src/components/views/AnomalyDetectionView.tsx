import React, { useState } from 'react';
import {
  Radio,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { INITIAL_ANOMALIES } from '../../services/gridData';
import { AnomalyEvent, GridMetrics } from '../../types/grid';

interface AnomalyDetectionViewProps {
  metrics: GridMetrics;
}

export const AnomalyDetectionView: React.FC<AnomalyDetectionViewProps> = ({ metrics }) => {
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyEvent>(
    INITIAL_ANOMALIES[2] // 10:48 Voltage anomaly default
  );

  const monitoredDimensions = [
    { label: 'Voltage', value: `${metrics.voltage} V`, status: 'Normal', limit: '220 - 240 V' },
    { label: 'Current', value: `${metrics.current} A`, status: 'Normal', limit: '< 100 A' },
    { label: 'Frequency', value: `${metrics.frequency} Hz`, status: 'Normal', limit: '49.8 - 50.2 Hz' },
    { label: 'Temperature', value: '78°C', status: 'Warning', limit: '< 85°C' },
    { label: 'Power Factor', value: `${metrics.powerFactor}`, status: 'Normal', limit: '> 0.90' },
    { label: 'System Load', value: `${metrics.systemLoadPct}%`, status: 'Normal', limit: '< 85%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#0F3D91]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              AI Anomaly Detection (Isolation Forest)
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Continuous sub-cycle outlier scoring across 6 electrical and thermal dimensions
          </p>
        </div>

        <span className="text-xs font-mono text-[#0F3D91] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 font-bold">
          Engine: Scikit-Learn Isolation Forest (iForest v1.4)
        </span>
      </div>

      {/* 6 Monitored Electrical Dimensions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {monitoredDimensions.map((dim, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs font-mono"
          >
            <div className="flex items-center justify-between text-[10px] text-[#64748B] uppercase font-bold">
              <span>{dim.label}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  dim.status === 'Normal' ? 'bg-[#16A34A]' : 'bg-[#F59E0B]'
                }`}
              ></span>
            </div>
            <div className="text-xl font-bold text-[#172033] mt-1.5">{dim.value}</div>
            <div className="text-[10px] text-[#64748B] mt-1">Limit: {dim.limit}</div>
          </div>
        ))}
      </div>

      {/* Timeline & Anomaly Inspector Dual Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0F3D91]" />
            <span>Chronological Event Timeline</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {INITIAL_ANOMALIES.map((event) => {
              const isSelected = selectedAnomaly.id === event.id;
              const isAnomaly = event.status === 'Anomaly';

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedAnomaly(event)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#0F3D91] bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#172033]">{event.time}</span>
                    <span className="text-slate-400">—</span>
                    <span
                      className={`font-semibold ${
                        isAnomaly ? 'text-[#DC2626]' : 'text-[#16A34A]'
                      }`}
                    >
                      {isAnomaly ? `${event.dimension} anomaly detected` : 'Normal'}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isAnomaly
                        ? 'bg-red-50 text-[#DC2626] border-red-200'
                        : 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Anomaly Detail Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                    selectedAnomaly.status === 'Anomaly'
                      ? 'bg-red-50 text-[#DC2626] border-red-200'
                      : 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                  }`}
                >
                  {selectedAnomaly.status} Event
                </span>
                <span className="text-xs font-mono text-[#64748B]">
                  Logged at {selectedAnomaly.time}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#0F3D91]">
                Vector: {selectedAnomaly.dimension}
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="bg-[#F6F9FC] p-4 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                  1. What changed?
                </span>
                <p className="text-sm font-semibold text-[#172033] font-sans">
                  {selectedAnomaly.whatChanged}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F6F9FC] p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                    2. When did it happen?
                  </span>
                  <p className="text-xs font-bold text-[#172033]">{selectedAnomaly.time} UTC</p>
                </div>

                <div className="bg-[#F6F9FC] p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                    3. Which asset was affected?
                  </span>
                  <p className="text-xs font-bold text-[#0F3D91]">{selectedAnomaly.assetAffected}</p>
                </div>
              </div>

              <div className="bg-[#F6F9FC] p-4 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-2">
                  4. What factors contributed?
                </span>
                <div className="space-y-1.5 font-sans">
                  {selectedAnomaly.contributingFactors.map((factor, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F3D91]"></span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-[#64748B]">
            <span>Isolation Forest Decision Function Score: -0.24 (Outlier Threshold &lt; 0.0)</span>
            <span className="text-[#16A34A] font-bold">✓ SCADA Telemetry Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
