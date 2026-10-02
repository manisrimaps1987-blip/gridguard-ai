import React, { useState } from 'react';
import {
  MapPin,
  Zap,
  Activity,
  Layers,
  SunMedium,
  Wind,
  BatteryCharging,
  AlertTriangle,
  Info,
  Maximize2,
  X,
  ExternalLink,
} from 'lucide-react';
import { Substation, GridStatus } from '../types/grid';

interface GridMapProps {
  substations: Substation[];
  onOpenCopilot: () => void;
}

interface MapNode {
  id: string;
  name: string;
  type: 'substation' | 'solar' | 'wind' | 'battery' | 'powerplant' | 'fault';
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  voltageKV: number;
  loadMW: number;
  capacityMW: number;
  status: GridStatus;
  substationRef?: Substation;
}

export const GridMap: React.FC<GridMapProps> = ({ substations, onOpenCopilot }) => {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Map nodes representing regional grid topology
  const nodes: MapNode[] = [
    {
      id: 'node-01',
      name: 'North Metro Substation Alpha',
      type: 'substation',
      x: 35,
      y: 28,
      voltageKV: 132,
      loadMW: 38.5,
      capacityMW: 50.0,
      status: 'NORMAL',
      substationRef: substations.find((s) => s.id === 'sub-01'),
    },
    {
      id: 'node-02',
      name: 'East Bay Distribution Hub',
      type: 'substation',
      x: 72,
      y: 38,
      voltageKV: 33,
      loadMW: 26.8,
      capacityMW: 30.0,
      status: 'WARNING',
      substationRef: substations.find((s) => s.id === 'sub-02'),
    },
    {
      id: 'node-03',
      name: 'South Valley Renewable Collector',
      type: 'substation',
      x: 48,
      y: 75,
      voltageKV: 66,
      loadMW: 18.2,
      capacityMW: 45.0,
      status: 'NORMAL',
      substationRef: substations.find((s) => s.id === 'sub-03'),
    },
    {
      id: 'node-04',
      name: 'West Hills Feeder Substation',
      type: 'substation',
      x: 20,
      y: 52,
      voltageKV: 33,
      loadMW: 31.4,
      capacityMW: 35.0,
      status: 'WARNING',
      substationRef: substations.find((s) => s.id === 'sub-04'),
    },
    {
      id: 'node-05',
      name: 'Harbor Gate Primary Substation',
      type: 'substation',
      x: 82,
      y: 72,
      voltageKV: 66,
      loadMW: 48.9,
      capacityMW: 50.0,
      status: 'CRITICAL',
      substationRef: substations.find((s) => s.id === 'sub-05'),
    },
    {
      id: 'node-06',
      name: 'Central Tie Reserve Hub',
      type: 'substation',
      x: 45,
      y: 48,
      voltageKV: 220,
      loadMW: 0.0,
      capacityMW: 80.0,
      status: 'OFFLINE',
      substationRef: substations.find((s) => s.id === 'sub-06'),
    },
    {
      id: 'solar-01',
      name: 'Valley Horizon Solar Park',
      type: 'solar',
      x: 62,
      y: 84,
      voltageKV: 33,
      loadMW: 3.8,
      capacityMW: 6.0,
      status: 'NORMAL',
    },
    {
      id: 'wind-01',
      name: 'Coastal Ridge Wind Farm',
      type: 'wind',
      x: 18,
      y: 80,
      voltageKV: 33,
      loadMW: 1.6,
      capacityMW: 3.5,
      status: 'NORMAL',
    },
    {
      id: 'battery-01',
      name: 'Metro BESS Storage Facility',
      type: 'battery',
      x: 52,
      y: 35,
      voltageKV: 33,
      loadMW: 0.85,
      capacityMW: 12.0,
      status: 'NORMAL',
    },
    {
      id: 'plant-01',
      name: 'Combined Cycle Peaker Station',
      type: 'powerplant',
      x: 88,
      y: 20,
      voltageKV: 132,
      loadMW: 42.0,
      capacityMW: 60.0,
      status: 'NORMAL',
    },
  ];

  // Transmission line links connecting nodes
  const transmissionLines = [
    { from: 'node-01', to: 'node-06', kv: 132, color: '#06b6d4' },
    { from: 'node-06', to: 'node-02', kv: 132, color: '#06b6d4' },
    { from: 'node-01', to: 'node-04', kv: 33, color: '#38bdf8' },
    { from: 'node-04', to: 'node-03', kv: 66, color: '#3b82f6' },
    { from: 'node-03', to: 'node-05', kv: 66, color: '#3b82f6' },
    { from: 'node-02', to: 'node-05', kv: 33, color: '#38bdf8' },
    { from: 'solar-01', to: 'node-03', kv: 33, color: '#facc15' },
    { from: 'wind-01', to: 'node-03', kv: 33, color: '#38bdf8' },
    { from: 'battery-01', to: 'node-06', kv: 33, color: '#10b981' },
    { from: 'plant-01', to: 'node-02', kv: 132, color: '#06b6d4' },
  ];

  const filteredNodes =
    filterType === 'ALL' ? nodes : nodes.filter((n) => n.type === filterType);

  const getNodeColor = (status: GridStatus, type: string) => {
    if (status === 'CRITICAL') return 'bg-rose-500 text-black border-rose-300 shadow-rose-500/50';
    if (status === 'WARNING') return 'bg-amber-400 text-black border-amber-200 shadow-amber-400/50';
    if (status === 'OFFLINE') return 'bg-slate-700 text-slate-300 border-slate-600';
    if (type === 'solar') return 'bg-yellow-400 text-black border-yellow-200 shadow-yellow-400/50';
    if (type === 'battery') return 'bg-emerald-400 text-black border-emerald-200 shadow-emerald-400/50';
    return 'bg-cyan-400 text-black border-cyan-200 shadow-cyan-400/50';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#091427] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
              Interactive Smart Grid Topology Map
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Geographic electrical transmission lines (132kV / 66kV / 33kV), substations, solar parks, and battery hubs
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500">Filter Nodes:</span>
          {['ALL', 'substation', 'solar', 'wind', 'battery'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                filterType === t
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'bg-[#060c18] border border-cyan-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[520px] bg-[#030712] border border-cyan-900/60 rounded-2xl overflow-hidden shadow-2xl">
        {/* Subtle grid background */}
        <div className="absolute inset-0 grid-bg-pattern opacity-40"></div>

        {/* Geographic Contour vector art */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <path
            d="M 50 150 Q 200 80 400 180 T 800 220"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <path
            d="M 100 350 Q 300 280 500 380 T 900 320"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
        </svg>

        {/* SVG Transmission Lines Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {transmissionLines.map((line, idx) => {
            const fromNode = nodes.find((n) => n.id === line.from);
            const toNode = nodes.find((n) => n.id === line.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={idx}>
                {/* Glow line */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={line.color}
                  strokeWidth="3"
                  opacity="0.3"
                />
                {/* Main line */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={line.color}
                  strokeWidth="1.8"
                  strokeDasharray={line.kv === 132 ? undefined : '5 3'}
                  opacity="0.8"
                />
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute top-4 left-4 z-20 bg-[#081223]/90 backdrop-blur-md border border-cyan-900/60 rounded-xl p-3 text-[11px] font-mono space-y-1.5 shadow-xl">
          <div className="text-white font-bold text-xs mb-1">Grid Legend</div>
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Normal Substation</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Warning (High Load)</span>
          </div>
          <div className="flex items-center gap-2 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span>Critical / Overheat</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-300">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span>Solar / Wind Farm</span>
          </div>
        </div>

        {/* Interactive Clickable Nodes */}
        {filteredNodes.map((node) => {
          const colorClass = getNodeColor(node.status, node.type);
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {/* Outer pulsing ring for warning/critical */}
              {node.status === 'CRITICAL' && (
                <div className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping pointer-events-none"></div>
              )}

              {/* Node Icon Circle */}
              <div
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${colorClass}`}
              >
                {node.type === 'solar' ? (
                  <SunMedium className="w-4 h-4" />
                ) : node.type === 'wind' ? (
                  <Wind className="w-4 h-4" />
                ) : node.type === 'battery' ? (
                  <BatteryCharging className="w-4 h-4" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
              </div>

              {/* Pin Name Label Tooltip */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#091325] border border-cyan-800/60 rounded px-2 py-0.5 text-[10px] font-mono text-white whitespace-nowrap shadow-xl opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
                {node.name}
              </div>
            </div>
          );
        })}

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-40 w-80 bg-[#081223]/95 backdrop-blur-md border border-cyan-700/60 rounded-2xl p-5 shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white text-sm truncate font-['Chakra_Petch']">
                  {selectedNode.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Asset Type:</span>
                <span className="text-cyan-300 uppercase font-bold">{selectedNode.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Voltage Level:</span>
                <span className="text-white font-bold">{selectedNode.voltageKV} kV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Load:</span>
                <span className="text-cyan-300 font-bold">{selectedNode.loadMW} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rated Capacity:</span>
                <span className="text-slate-300">{selectedNode.capacityMW} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Operating Status:</span>
                <span
                  className={`font-bold ${
                    selectedNode.status === 'NORMAL'
                      ? 'text-emerald-400'
                      : selectedNode.status === 'WARNING'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>

              {selectedNode.substationRef && (
                <div className="pt-2 border-t border-cyan-950 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Health Score:</span>
                    <span className="text-emerald-400 font-bold">
                      {selectedNode.substationRef.healthScore} / 100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Temperature:</span>
                    <span>{selectedNode.substationRef.temperatureC}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Power Factor:</span>
                    <span>{selectedNode.substationRef.powerFactor}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-950 flex items-center justify-between">
              <button
                onClick={onOpenCopilot}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Ask Copilot about this node</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
