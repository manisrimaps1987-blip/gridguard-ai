import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  Gauge,
  Compass,
  Radio,
  Sliders,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { GridTelemetry } from '../types/grid';

interface RealTimeMonitorProps {
  telemetry: GridTelemetry;
  onTriggerSimulation: (type: 'VOLTAGE_SAG' | 'TRANSFORMER_OVERHEAT' | 'OUTAGE_TRIP' | 'RESET') => void;
  onOpenCopilot: () => void;
}

export const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({
  telemetry,
  onTriggerSimulation,
  onOpenCopilot,
}) => {
  // Waveform animation offset
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate 3-phase sine waves
  const pointsPhaseA: string[] = [];
  const pointsPhaseB: string[] = [];
  const pointsPhaseC: string[] = [];

  for (let x = 0; x <= 600; x += 6) {
    const angleRadA = ((x + waveOffset * 4) * Math.PI) / 90;
    const angleRadB = ((x + waveOffset * 4 + 120) * Math.PI) / 90;
    const angleRadC = ((x + waveOffset * 4 + 240) * Math.PI) / 90;

    const yA = 80 - Math.sin(angleRadA) * 55;
    const yB = 80 - Math.sin(angleRadB) * 55;
    const yC = 80 - Math.sin(angleRadC) * 55;

    pointsPhaseA.push(`${x},${yA.toFixed(1)}`);
    pointsPhaseB.push(`${x},${yB.toFixed(1)}`);
    pointsPhaseC.push(`${x},${yC.toFixed(1)}`);
  }

  // Simulated IoT sensor log stream
  const sensorLogs = [
    { time: '10:24:48.120', dev: 'PMU-Alpha-01', metric: 'Phase A Voltage', val: `${telemetry.voltage} V`, status: 'OK' },
    { time: '10:24:48.080', dev: 'PMU-Alpha-02', metric: 'Bus Frequency', val: `${telemetry.frequency} Hz`, status: 'OK' },
    { time: '10:24:47.950', dev: 'CT-TR-501', metric: 'Active Current', val: `${telemetry.current} A`, status: 'OK' },
    { time: '10:24:47.810', dev: 'INVERTER-S03', metric: 'Solar Inflow', val: `${telemetry.renewableGenerationMW} MW`, status: 'OK' },
    { time: '10:24:47.600', dev: 'BESS-CONTROLLER', metric: 'SoC Battery', val: `${telemetry.batteryStatus.soc}%`, status: 'CHG' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Simulation Controls */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              High-Frequency Electrical Telemetry & Oscilloscope
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time phasor measurement units (PMUs), harmonic distortion, and three-phase voltage balance
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => onTriggerSimulation('VOLTAGE_SAG')}
            className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 text-amber-300 transition-colors"
          >
            Inject Sag (212V)
          </button>
          <button
            onClick={() => onTriggerSimulation('TRANSFORMER_OVERHEAT')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/50 text-rose-300 transition-colors"
          >
            Thermal Spike (112°C)
          </button>
          <button
            onClick={() => onTriggerSimulation('RESET')}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/50 text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Nominal</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3-Phase Oscilloscope & Frequency Stability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Three-Phase Sine Wave Oscilloscope */}
        <div className="lg:col-span-2 bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  Three-Phase AC Voltage Waveform (120° Separation)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                50.00 Hz Fundamental Frequency | Total Harmonic Distortion (THD): 1.4%
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Phase A (230.2V)
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Phase B (229.8V)
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Phase C (230.4V)
              </span>
            </div>
          </div>

          {/* SVG Real-time Oscilloscope */}
          <div className="w-full h-48 bg-[#040810] border border-cyan-950 rounded-xl relative overflow-hidden p-2">
            {/* Grid markings */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-4 pointer-events-none opacity-20">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-cyan-500/30"></div>
              ))}
            </div>

            <svg className="w-full h-full" viewBox="0 0 600 160">
              {/* Zero baseline */}
              <line x1="0" y1="80" x2="600" y2="80" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 2" />

              {/* Phase C (Rose) */}
              <polyline fill="none" stroke="#f43f5e" strokeWidth="1.8" points={pointsPhaseC.join(' ')} opacity="0.8" />

              {/* Phase B (Emerald) */}
              <polyline fill="none" stroke="#10b981" strokeWidth="1.8" points={pointsPhaseB.join(' ')} opacity="0.8" />

              {/* Phase A (Cyan - Main) */}
              <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" points={pointsPhaseA.join(' ')} />
            </svg>

            {/* Sweep radar line effect */}
            <div className="absolute top-0 bottom-0 w-1 bg-cyan-400/40 shadow-[0_0_12px_#06b6d4] pointer-events-none animate-grid-scan"></div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-[#0b172a] p-2 rounded-lg border border-cyan-950">
              <span className="text-slate-400">Peak Amplitude</span>
              <div className="text-cyan-300 font-bold text-sm mt-0.5">325.5 Vpk</div>
            </div>
            <div className="bg-[#0b172a] p-2 rounded-lg border border-cyan-950">
              <span className="text-slate-400">Phase Unbalance</span>
              <div className="text-emerald-400 font-bold text-sm mt-0.5">0.26% (Compliant)</div>
            </div>
            <div className="bg-[#0b172a] p-2 rounded-lg border border-cyan-950">
              <span className="text-slate-400">Crest Factor</span>
              <div className="text-cyan-300 font-bold text-sm mt-0.5">1.414 (Pure Sine)</div>
            </div>
          </div>
        </div>

        {/* Frequency & Power Factor Dial Gauges */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
                  Frequency Stability Meter
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">50.00 Hz Target</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="bg-[#0c182e] p-4 rounded-xl border border-cyan-950 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-mono text-emerald-400">
                  {telemetry.frequency}
                </span>
                <span className="text-xs font-mono text-slate-400">Hz (Grid Standard)</span>
              </div>

              {/* Deviation bar */}
              <div className="relative pt-2">
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
                  <div className="w-1/3 bg-amber-500/40"></div>
                  <div className="w-1/3 bg-emerald-500/60"></div>
                  <div className="w-1/3 bg-amber-500/40"></div>
                </div>

                {/* Needle Indicator */}
                {(() => {
                  const freqPct = Math.max(0, Math.min(100, ((telemetry.frequency - 49.5) / 1.0) * 100));
                  return (
                    <div
                      className="absolute top-1 w-2 h-5 bg-cyan-300 rounded shadow-md shadow-cyan-400 -translate-x-1/2 transition-all duration-300"
                      style={{ left: `${freqPct}%` }}
                    ></div>
                  );
                })()}

                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                  <span>49.50 Hz</span>
                  <span className="text-emerald-400 font-bold">50.00 Hz</span>
                  <span>50.50 Hz</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 font-mono">
                Deviation: {(telemetry.frequency - 50.0).toFixed(3)} Hz | Primary Governor Responding
              </div>
            </div>

            {/* Power Factor & Reactive Power */}
            <div className="mt-4 bg-[#0c182e] p-4 rounded-xl border border-cyan-950 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>POWER FACTOR (cos φ)</span>
                <Compass className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-purple-300">
                  {telemetry.powerFactor}
                </span>
                <span className="text-xs font-mono text-emerald-400">Lagging (Healthy)</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Active: {telemetry.loadMW} MW | Reactive: {(telemetry.loadMW * 0.36).toFixed(2)} MVAR
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCopilot}
            className="w-full mt-4 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/50 rounded-xl text-cyan-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Copilot to analyze frequency jitter</span>
          </button>
        </div>
      </div>

      {/* Real-Time IoT Sensor Telemetry Feed */}
      <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
              Live Sensor Ingestion Stream (PMU & Smart Meters)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            MQTT / IEEE C37.118 Streaming
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0c182f] text-slate-400 uppercase text-[10px] border-b border-cyan-950">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Device Node</th>
                <th className="py-2.5 px-3">Measured Parameter</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sensorLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-900/50">
                  <td className="py-2 px-3 text-slate-400">{log.time}</td>
                  <td className="py-2 px-3 text-cyan-300 font-semibold">{log.dev}</td>
                  <td className="py-2 px-3">{log.metric}</td>
                  <td className="py-2 px-3 text-emerald-400 font-bold">{log.val}</td>
                  <td className="py-2 px-3 text-slate-400">Modbus TCP / PMU</td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800/40">
                      {log.status}
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
