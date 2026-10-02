import React, { useState } from 'react';
import { Zap, MapPin, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { GridAsset } from '../../types/grid';

interface GridMapProps {
  assets: GridAsset[];
  onSelectAsset: (asset: GridAsset) => void;
}

export const GridMap: React.FC<GridMapProps> = ({ assets, onSelectAsset }) => {
  const [hoveredNode, setHoveredNode] = useState<GridAsset | null>(null);

  // Electrical interconnect links
  const links = [
    { from: 'SS-A', to: 'T-001', kv: '132 kV' },
    { from: 'SS-A', to: 'SS-B', kv: '400 kV' },
    { from: 'SS-B', to: 'T-002', kv: '132 kV' },
    { from: 'SS-B', to: 'BESS-01', kv: '33 kV' },
    { from: 'T-001', to: 'T-004', kv: '33 kV' },
    { from: 'T-002', to: 'D-014', kv: '11 kV' },
    { from: 'T-003', to: 'D-008', kv: '11 kV' },
    { from: 'SOLAR-01', to: 'T-003', kv: '33 kV' },
    { from: 'T-004', to: 'T-003', kv: '33 kV' },
  ];

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return {
          bg: 'bg-[#16A34A]',
          ring: 'ring-emerald-200',
          border: 'border-emerald-600',
          emoji: '🟢',
        };
      case 'Warning':
        return {
          bg: 'bg-[#F59E0B]',
          ring: 'ring-amber-200 animate-pulse',
          border: 'border-amber-600',
          emoji: '🟡',
        };
      case 'Critical':
        return {
          bg: 'bg-[#DC2626]',
          ring: 'ring-red-300 animate-ping',
          border: 'border-red-600',
          emoji: '🔴',
        };
      default:
        return {
          bg: 'bg-slate-500',
          ring: 'ring-slate-200',
          border: 'border-slate-600',
          emoji: '⚪',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
      {/* Title & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#172033] font-['Chakra_Petch'] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#0F3D91]" />
            <span>Grid Network</span>
          </h3>
          <p className="text-xs text-[#64748B]">
            Interactive topological schema of transmission lines, substations, and transformers
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono bg-[#F6F9FC] px-3 py-1.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
            <span className="text-[#172033]">Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span className="text-[#172033]">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
            <span className="text-[#172033]">Critical</span>
          </div>
        </div>
      </div>

      {/* Electrical Topology Schematic Canvas */}
      <div className="w-full h-80 sm:h-96 bg-[#F8FAFC] border border-slate-200/80 rounded-xl relative overflow-hidden">
        {/* Schematic background grid pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        {/* SVG Transmission & Feeder Links */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {links.map((link, idx) => {
            const from = assets.find((a) => a.id === link.from);
            const to = assets.find((a) => a.id === link.to);
            if (!from || !to) return null;

            return (
              <g key={idx}>
                {/* Glow line */}
                <line
                  x1={`${from.coordinates.x}%`}
                  y1={`${from.coordinates.y}%`}
                  x2={`${to.coordinates.x}%`}
                  y2={`${to.coordinates.y}%`}
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  opacity="0.6"
                />
                {/* Animated active current dashes */}
                <line
                  x1={`${from.coordinates.x}%`}
                  y1={`${from.coordinates.y}%`}
                  x2={`${to.coordinates.x}%`}
                  y2={`${to.coordinates.y}%`}
                  stroke="#1976D2"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0.8"
                />
              </g>
            );
          })}
        </svg>

        {/* Assets Pins */}
        {assets.map((asset) => {
          const style = getMarkerColor(asset.status);
          const isWarning = asset.status === 'Warning';
          const isCritical = asset.status === 'Critical';

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              onMouseEnter={() => setHoveredNode(asset)}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              style={{
                left: `${asset.coordinates.x}%`,
                top: `${asset.coordinates.y}%`,
              }}
            >
              {/* Outer pulsing ring for attention */}
              {(isWarning || isCritical) && (
                <div
                  className={`absolute -inset-1.5 rounded-full ${
                    isCritical ? 'bg-red-400/40 animate-ping' : 'bg-amber-400/40 animate-pulse'
                  }`}
                ></div>
              )}

              {/* Marker Circle */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${style.bg} text-white flex items-center justify-center font-bold text-[10px] font-mono shadow-md border-2 border-white transition-transform group-hover:scale-125`}
              >
                {asset.type === 'Substation'
                  ? 'SS'
                  : asset.type === 'Transformer'
                  ? 'T'
                  : asset.type === 'Solar Farm'
                  ? 'PV'
                  : 'D'}
              </div>

              {/* ID Badge */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 px-2 py-0.5 rounded border border-slate-200 shadow-sm text-[10px] font-mono font-bold text-[#172033] whitespace-nowrap">
                {asset.id} {style.emoji}
              </div>
            </div>
          );
        })}

        {/* Hover Inspector Preview Popup */}
        {hoveredNode && (
          <div className="absolute bottom-4 left-4 z-30 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl max-w-xs text-xs font-mono animate-in fade-in duration-100">
            <div className="font-bold text-[#172033] flex items-center justify-between">
              <span>{hoveredNode.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  hoveredNode.status === 'Healthy'
                    ? 'bg-emerald-50 text-[#16A34A]'
                    : hoveredNode.status === 'Warning'
                    ? 'bg-amber-50 text-[#F59E0B]'
                    : 'bg-red-50 text-[#DC2626]'
                }`}
              >
                {hoveredNode.status}
              </span>
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">{hoveredNode.location}</div>
            <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#64748B]">Load: </span>
                <span className="text-[#172033] font-bold">{hoveredNode.loadPct}%</span>
              </div>
              <div>
                <span className="text-[#64748B]">Temp: </span>
                <span className="text-[#172033] font-bold">{hoveredNode.temperatureC}°C</span>
              </div>
            </div>
            <div className="mt-1 text-[10px] text-[#1976D2] font-semibold">
              Click node to view full diagnostics
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] font-mono">
        <span>Click any substation or transformer node to inspect diagnostics & live telemetry</span>
        <span className="text-[#0F3D91] font-semibold">Connected Topology: 128 Nodes</span>
      </div>
    </div>
  );
};
