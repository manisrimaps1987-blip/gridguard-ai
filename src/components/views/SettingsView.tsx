import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Radio,
  Sliders,
} from 'lucide-react';
import { UserRole } from '../../types/grid';

interface SettingsViewProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userRole,
  onRoleChange,
}) => {
  const [voltageLow, setVoltageLow] = useState(218);
  const [voltageHigh, setVoltageHigh] = useState(242);
  const [tempMax, setTempMax] = useState(85);
  const [autoAcknowledge, setAutoAcknowledge] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0F3D91]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              Station Settings & SCADA Protection Thresholds
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure automated alarm trigger bounds, authority roles, and telemetry polling intervals
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#0F3D91] hover:bg-[#1976D2] text-white font-bold text-xs font-mono rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saved ? '✓ Settings Saved' : 'Save Parameters'}</span>
        </button>
      </div>

      {/* Thresholds & Station Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protection Limits */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] mb-2">
            SCADA Protection Trip Bounds
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[#64748B] block mb-1">
                Under-Voltage Warning Trip Limit (V)
              </label>
              <input
                type="number"
                value={voltageLow}
                onChange={(e) => setVoltageLow(Number(e.target.value))}
                className="w-full bg-[#F6F9FC] border border-slate-200 rounded-lg p-2 font-bold text-[#172033]"
              />
              <span className="text-[10px] text-[#64748B]">Nominal: 220 V</span>
            </div>

            <div>
              <label className="text-[#64748B] block mb-1">
                Over-Voltage Critical Trip Limit (V)
              </label>
              <input
                type="number"
                value={voltageHigh}
                onChange={(e) => setVoltageHigh(Number(e.target.value))}
                className="w-full bg-[#F6F9FC] border border-slate-200 rounded-lg p-2 font-bold text-[#172033]"
              />
              <span className="text-[10px] text-[#64748B]">Nominal: 240 V</span>
            </div>

            <div>
              <label className="text-[#64748B] block mb-1">
                Maximum Transformer Winding Temp Limit (°C)
              </label>
              <input
                type="number"
                value={tempMax}
                onChange={(e) => setTempMax(Number(e.target.value))}
                className="w-full bg-[#F6F9FC] border border-slate-200 rounded-lg p-2 font-bold text-[#172033]"
              />
              <span className="text-[10px] text-[#64748B]">
                Triggers forced cooling at 75°C, trip alarm at {tempMax}°C
              </span>
            </div>
          </div>
        </div>

        {/* User Role & Station Authentication */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] mb-2">
            Role-Based Access Control (RBAC)
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[#64748B] block mb-1.5">Current Station Authority Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Operator', 'Admin', 'Viewer'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => onRoleChange(role)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      userRole === role
                        ? 'bg-[#EAF3FF] text-[#0F3D91] border-[#1976D2] shadow-xs'
                        : 'bg-[#F6F9FC] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#F6F9FC] rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[#0F3D91] font-bold">Operator Permissions:</span>
              <p className="text-[11px] text-[#64748B] font-sans">
                Acknowledge and resolve alarms, trigger What-If simulation contingencies, inspect high-voltage transformer diagnostics, and export audit reports.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAcknowledge}
                  onChange={(e) => setAutoAcknowledge(e.target.checked)}
                  className="w-4 h-4 text-[#1976D2] rounded border-slate-300"
                />
                <span className="text-xs text-[#172033]">
                  Auto-acknowledge routine low-priority notifications
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
