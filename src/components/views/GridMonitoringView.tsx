import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  Gauge,
  Compass,
  Radio,
  Clock,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { GridMetrics } from '../../types/grid';

interface GridMonitoringViewProps {
  metrics: GridMetrics;
}

export const GridMonitoringView: React.FC<GridMonitoringViewProps> = ({ metrics }) => {
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // 3-Phase sine wave coordinates
  const pointsPhaseA: string[] = [];
  const pointsPhaseB: string[] = [];
  const pointsPhaseC: string[] = [];

  for (let x = 0; x <= 600; x += 6) {
    const angleRadA = ((x + waveOffset * 4) * Math.PI) / 90;
    const angleRadB = ((x + waveOffset * 4 + 120) * Math.PI) / 90;
    const angleRadC = ((x + waveOffset * 4 + 240) * Math.PI) / 90;

    const yA = 70 - Math.sin(angleRadA) * 45;
    const yB = 70 - Math.sin(angleRadB) * 45;
    const yC = 70 - Math.sin(angleRadC) * 45;

    pointsPhaseA.push(`${x},${yA.toFixed(1)}`);
    pointsPhaseB.push(`${x},${yB.toFixed(1)}`);
    pointsPhaseC.push(`${x},${yC.toFixed(1)}`);
  }

  const pmuSensors = [
    { id: 'PMU-01', location: 'Substation A (400kV Bus)', v: '229.4 V', freq: '49.98 Hz', current: '82 A', pf: '0.96', status: 'Online' },
    { id: 'PMU-02', location: 'Substation B (132kV Bus)', v: '228.8 V', freq: '49.97 Hz', current: '79 A', pf: '0.95', status: 'Online' },
    { id: 'PMU-03', location: 'Substation C (66kV Bus)', v: '230.1 V', freq: '49.99 Hz', current: '64 A', pf: '0.97', status: 'Online' },
    { id: 'PMU-04', location: 'Distribution Node D-14', v: '224.2 V', freq: '49.96 Hz', current: '94 A', pf: '0.88', status: 'Warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0F3D91]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              Live Grid Instrumentation & Oscilloscope
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Continuous sub-second electrical parameters, phasor measurement units (PMUs), and phase unbalance
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#16A34A] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>IEEE C37.118 Streaming @ 60 fps</span>
        </div>
      </div>

      {/* 4 Main Electrical Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>BUS VOLTAGE</span>
            <Zap className="w-4 h-4 text-[#0F3D91]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#0F3D91] mt-2">
            {metrics.voltage} <span className="text-xs font-normal text-[#64748B]">V</span>
          </div>
          <div className="text-[11px] text-[#16A34A] font-mono mt-1">Normal (230V Nominal)</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>GRID FREQUENCY</span>
            <Gauge className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#16A34A] mt-2">
            {metrics.frequency} <span className="text-xs font-normal text-[#64748B]">Hz</span>
          </div>
          <div className="text-[11px] text-[#16A34A] font-mono mt-1">Target: 50.00 Hz</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>LINE CURRENT</span>
            <Activity className="w-4 h-4 text-[#1976D2]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#172033] mt-2">
            {metrics.current} <span className="text-xs font-normal text-[#64748B]">A</span>
          </div>
          <div className="text-[11px] text-[#64748B] font-mono mt-1">Balanced Load</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>POWER FACTOR</span>
            <Compass className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black font-mono text-purple-700 mt-2">
            {metrics.powerFactor}
          </div>
          <div className="text-[11px] text-[#16A34A] font-mono mt-1">Optimal Lagging</div>
        </div>
      </div>

      {/* Three-Phase Voltage Oscilloscope */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch']">
              Three-Phase AC Voltage Waveform (120° Separation)
            </h3>
            <p className="text-xs text-[#64748B]">
              Real-time synchrophasor waveform tracking Phase A (Blue), Phase B (Green), Phase C (Amber)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-[#0F3D91] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F3D91]"></span> Phase A (229.4V)
            </span>
            <span className="flex items-center gap-1 text-[#16A34A] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span> Phase B (228.8V)
            </span>
            <span className="flex items-center gap-1 text-[#F59E0B] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span> Phase C (230.1V)
            </span>
          </div>
        </div>

        {/* SVG Waveform Canvas */}
        <div className="w-full h-44 bg-[#F8FAFC] border border-slate-200/80 rounded-xl relative overflow-hidden p-2">
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-4 pointer-events-none opacity-20">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-slate-400/30"></div>
            ))}
          </div>

          <svg className="w-full h-full" viewBox="0 0 600 140">
            <line x1="0" y1="70" x2="600" y2="70" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 2" />
            <polyline fill="none" stroke="#F59E0B" strokeWidth="1.8" points={pointsPhaseC.join(' ')} opacity="0.8" />
            <polyline fill="none" stroke="#16A34A" strokeWidth="1.8" points={pointsPhaseB.join(' ')} opacity="0.8" />
            <polyline fill="none" stroke="#0F3D91" strokeWidth="2.5" points={pointsPhaseA.join(' ')} />
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs font-mono">
          <div className="bg-[#F6F9FC] p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-[#64748B]">Peak Amplitude</span>
            <div className="text-[#0F3D91] font-bold text-sm mt-0.5">323.8 Vpk</div>
          </div>
          <div className="bg-[#F6F9FC] p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-[#64748B]">Phase Unbalance</span>
            <div className="text-[#16A34A] font-bold text-sm mt-0.5">0.26% (Compliant)</div>
          </div>
          <div className="bg-[#F6F9FC] p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-[#64748B]">THD Distortion</span>
            <div className="text-[#16A34A] font-bold text-sm mt-0.5">1.4% (IEEE 519)</div>
          </div>
        </div>
      </div>

      {/* Phasor Measurement Units (PMU) Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] mb-4">
          Active Phasor Measurement Units (PMUs)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F6F9FC] text-[#64748B] uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Device ID</th>
                <th className="py-3 px-3">Bus Location</th>
                <th className="py-3 px-3">Voltage</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3">Current</th>
                <th className="py-3 px-3">Power Factor</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#172033]">
              {pmuSensors.map((pmu) => (
                <tr key={pmu.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#0F3D91]">{pmu.id}</td>
                  <td className="py-3 px-3">{pmu.location}</td>
                  <td className="py-3 px-3 font-bold">{pmu.v}</td>
                  <td className="py-3 px-3">{pmu.freq}</td>
                  <td className="py-3 px-3">{pmu.current}</td>
                  <td className="py-3 px-3">{pmu.pf}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        pmu.status === 'Online'
                          ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                          : 'bg-amber-50 text-[#F59E0B] border-amber-200'
                      }`}
                    >
                      {pmu.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
