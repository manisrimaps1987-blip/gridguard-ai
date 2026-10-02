import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { GridAlertItem, AlertSeverity } from '../../types/grid';

interface AlertsViewProps {
  alerts: GridAlertItem[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onViewDetails: (assetId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onAcknowledge,
  onResolve,
  onViewDetails,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts =
    filterSeverity === 'ALL'
      ? alerts
      : alerts.filter((a) => a.severity === filterSeverity);

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'HIGH':
        return 'bg-red-50 text-[#DC2626] border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-[#F59E0B] border-amber-200';
      case 'LOW':
        return 'bg-blue-50 text-[#1976D2] border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#DC2626]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              Grid Reliability Alarms & Incidents
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Triage, acknowledge, and resolve real-time thermal, load, and voltage anomaly alarms
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center bg-[#F6F9FC] p-1 rounded-xl border border-slate-200 text-xs font-mono">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterSeverity === s
                  ? 'bg-white text-[#0F3D91] font-bold shadow-xs'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-2xl p-5 border transition-all ${
              alert.severity === 'HIGH'
                ? 'border-red-200 shadow-xs'
                : alert.severity === 'MEDIUM'
                ? 'border-amber-200'
                : 'border-slate-200/80'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getSeverityBadge(
                    alert.severity
                  )}`}
                >
                  {alert.severity} PRIORITY
                </span>
                <span className="text-sm font-bold text-[#172033] font-mono">
                  {alert.assetName} ({alert.assetId})
                </span>
                <span className="text-xs text-[#64748B] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    alert.status === 'ACTIVE'
                      ? 'bg-red-50 text-[#DC2626]'
                      : alert.status === 'ACKNOWLEDGED'
                      ? 'bg-amber-50 text-[#F59E0B]'
                      : 'bg-emerald-50 text-[#16A34A]'
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold text-[#172033] mb-2">{alert.description}</p>

            <div className="p-3 bg-[#F6F9FC] rounded-xl border border-slate-200/80 text-xs font-mono text-slate-700 mb-4">
              <span className="font-bold text-[#0F3D91]">Suggested Action: </span>
              <span>{alert.suggestedAction}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs font-mono">
              <button
                onClick={() => onViewDetails(alert.assetId)}
                className="text-[#1976D2] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View Asset Telemetry Details</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-2">
                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 transition-colors cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => onResolve(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve Alarm</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
