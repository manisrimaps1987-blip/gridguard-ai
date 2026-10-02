import React, { useState } from 'react';
import {
  Sliders,
  Users,
  Cpu,
  Radio,
  ShieldCheck,
  Activity,
  Layers,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { UserRole, GridTelemetry } from '../types/grid';

interface AdminGatewayProps {
  telemetry: GridTelemetry;
  gridHealthScore: number;
  userRole: UserRole;
  onTriggerSimulation: (type: 'VOLTAGE_SAG' | 'TRANSFORMER_OVERHEAT' | 'OUTAGE_TRIP' | 'RESET') => void;
}

export const AdminGateway: React.FC<AdminGatewayProps> = ({
  telemetry,
  gridHealthScore,
  userRole,
  onTriggerSimulation,
}) => {
  const [voltageMin, setVoltageMin] = useState(218);
  const [voltageMax, setVoltageMax] = useState(242);
  const [freqMin, setFreqMin] = useState(49.8);
  const [freqMax, setFreqMax] = useState(50.2);
  const [maxTransformerTemp, setMaxTransformerTemp] = useState(95);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveThresholds = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Mock Users Registry
  const usersList = [
    { name: 'Chief Engineer Sarah Chen', role: 'Admin', email: 's.chen@gridguard.ai', status: 'Online', lastActive: 'Now' },
    { name: 'Grid Operator Alex Vance', role: 'Grid Operator', email: 'a.vance@gridguard.ai', status: 'Online', lastActive: '5m ago' },
    { name: 'Energy Analyst Dev Patel', role: 'Energy Analyst', email: 'd.patel@gridguard.ai', status: 'Online', lastActive: '12m ago' },
    { name: 'Executive Viewer Marcus Brody', role: 'Viewer', email: 'm.brody@gridguard.ai', status: 'Offline', lastActive: '2h ago' },
  ];

  // IoT Devices Registry
  const devicesList = [
    { id: 'ESP32-PMU-01', type: 'Phasor Measurement Unit', protocol: 'MQTT / IEEE C37.118', location: 'Substation Alpha', status: 'ONLINE', ping: '12ms' },
    { id: 'MODBUS-TR-501', type: 'Transformer Thermal RTD', protocol: 'Modbus TCP', location: 'Harbor Gate', status: 'ONLINE', ping: '24ms' },
    { id: 'SMARTMTR-IND-12', type: 'High-Tension Smart Meter', protocol: 'DLMS/COSEM', location: 'Industrial Sector 4', status: 'ONLINE', ping: '45ms' },
    { id: 'INVERTER-GW-03', type: 'Solar Array Gateway', protocol: 'SunSpec Modbus', location: 'South Valley', status: 'ONLINE', ping: '18ms' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              Admin Control Center & IoT Hardware Gateway
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            System health diagnostics, SCADA telemetry broker, sensor calibration, and role-based access control
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
            MQTT Broker: ONLINE (1,240 pkts/s)
          </span>
        </div>
      </div>

      {/* Admin KPI Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">REGISTERED USERS</div>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">14</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">6 Active Now</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">GRID DEVICES & PMUs</div>
          <div className="text-xl font-bold font-mono text-cyan-200 mt-1">48</div>
          <div className="text-[10px] text-cyan-400 mt-0.5">100% Ingestion Up</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">TELEMETRY UPTIME</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">99.98%</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Zero Packet Loss</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE ALERTS</div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            {telemetry.activeAlertCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Triaged by AI</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">SYSTEM HEALTH</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {gridHealthScore} / 100
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Multi-Vector Score</div>
        </div>

        <div className="bg-[#081223] border border-cyan-900/50 rounded-xl p-3.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase">SIMULATION DRILLS</div>
          <div className="text-xl font-bold font-mono text-purple-300 mt-1">Enabled</div>
          <div className="text-[10px] text-purple-400 mt-0.5">Safety Interlocked</div>
        </div>
      </div>

      {/* IoT / Hardware Integration Architecture Diagram */}
      <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white font-['Chakra_Petch'] mb-2">
          IoT Hardware & SCADA Ingestion Architecture
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Edge sensor protocol conversion pipeline powering real-time GridGuard telemetry
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-center text-xs font-mono">
          <div className="bg-[#0b172a] border border-cyan-950 p-4 rounded-xl flex flex-col items-center">
            <Radio className="w-6 h-6 text-cyan-400 mb-2" />
            <span className="font-bold text-white">IoT Sensors</span>
            <span className="text-[10px] text-slate-400 mt-1">ESP32 / Arduino / PMU</span>
            <span className="text-[9px] text-cyan-400 mt-2">Stage 01</span>
          </div>

          <div className="bg-[#0b172a] border border-cyan-950 p-4 rounded-xl flex flex-col items-center">
            <Activity className="w-6 h-6 text-blue-400 mb-2" />
            <span className="font-bold text-white">MQTT / REST Broker</span>
            <span className="text-[10px] text-slate-400 mt-1">Mosquitto / Kafka</span>
            <span className="text-[9px] text-blue-400 mt-2">Stage 02</span>
          </div>

          <div className="bg-[#0b172a] border border-cyan-950 p-4 rounded-xl flex flex-col items-center">
            <Cpu className="w-6 h-6 text-indigo-400 mb-2" />
            <span className="font-bold text-white">Data Processing</span>
            <span className="text-[10px] text-slate-400 mt-1">Kalman Filter & Imputer</span>
            <span className="text-[9px] text-indigo-400 mt-2">Stage 03</span>
          </div>

          <div className="bg-[#0b172a] border border-cyan-950 p-4 rounded-xl flex flex-col items-center">
            <Layers className="w-6 h-6 text-purple-400 mb-2" />
            <span className="font-bold text-white">Database Store</span>
            <span className="text-[10px] text-slate-400 mt-1">TimescaleDB / Postgres</span>
            <span className="text-[9px] text-purple-400 mt-2">Stage 04</span>
          </div>

          <div className="bg-[#0b172a] border border-cyan-950 p-4 rounded-xl flex flex-col items-center">
            <Zap className="w-6 h-6 text-amber-400 mb-2" />
            <span className="font-bold text-white">AI / ML Engine</span>
            <span className="text-[10px] text-slate-400 mt-1">XGBoost & Isolation Forest</span>
            <span className="text-[9px] text-amber-400 mt-2">Stage 05</span>
          </div>

          <div className="bg-[#0b172a] border border-cyan-950 p-4 rounded-xl flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
            <span className="font-bold text-white">GridGuard UI</span>
            <span className="text-[10px] text-slate-400 mt-1">Dashboard & Alerts</span>
            <span className="text-[9px] text-emerald-400 mt-2">Stage 06</span>
          </div>
        </div>
      </div>

      {/* Threshold Configuration & Simulation Trigger Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Safety Thresholds */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white font-['Chakra_Petch']">
              Electrical Protection Thresholds
            </h3>
            <span className="text-xs text-slate-400 font-mono">SCADA Trip Limits</span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Phase Voltage Band (V)</span>
                <span className="text-cyan-300 font-bold">{voltageMin} V - {voltageMax} V</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={voltageMin}
                  onChange={(e) => setVoltageMin(Number(e.target.value))}
                  className="w-1/2 bg-[#0c182d] border border-cyan-950 p-2 rounded text-white"
                />
                <input
                  type="number"
                  value={voltageMax}
                  onChange={(e) => setVoltageMax(Number(e.target.value))}
                  className="w-1/2 bg-[#0c182d] border border-cyan-950 p-2 rounded text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Frequency Trip Band (Hz)</span>
                <span className="text-emerald-300 font-bold">{freqMin} Hz - {freqMax} Hz</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.05"
                  value={freqMin}
                  onChange={(e) => setFreqMin(Number(e.target.value))}
                  className="w-1/2 bg-[#0c182d] border border-cyan-950 p-2 rounded text-white"
                />
                <input
                  type="number"
                  step="0.05"
                  value={freqMax}
                  onChange={(e) => setFreqMax(Number(e.target.value))}
                  className="w-1/2 bg-[#0c182d] border border-cyan-950 p-2 rounded text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Max Transformer Temperature Cutoff (°C)</span>
                <span className="text-rose-300 font-bold">{maxTransformerTemp}°C</span>
              </div>
              <input
                type="number"
                value={maxTransformerTemp}
                onChange={(e) => setMaxTransformerTemp(Number(e.target.value))}
                className="w-full bg-[#0c182d] border border-cyan-950 p-2 rounded text-white"
              />
            </div>

            <button
              onClick={handleSaveThresholds}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? '✓ Thresholds Updated in SCADA' : 'Save SCADA Thresholds'}</span>
            </button>
          </div>
        </div>

        {/* Live Device Registry */}
        <div className="bg-[#081223] border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
          <h3 className="text-base font-bold text-white font-['Chakra_Petch'] mb-3">
            Active Grid Devices & PMU Registry
          </h3>

          <div className="space-y-2.5">
            {devicesList.map((dev) => (
              <div
                key={dev.id}
                className="bg-[#0b172a] border border-cyan-950 p-3 rounded-xl flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{dev.id}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{dev.type} | {dev.location}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800/40">
                    {dev.status}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">{dev.ping} latency</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
