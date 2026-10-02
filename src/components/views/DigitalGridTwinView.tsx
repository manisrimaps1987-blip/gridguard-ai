import React, { useState } from 'react';
import {
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { GridAsset } from '../../types/grid';

interface DigitalGridTwinViewProps {
  assets: GridAsset[];
  onSelectAsset: (asset: GridAsset) => void;
}

export const DigitalGridTwinView: React.FC<DigitalGridTwinViewProps> = ({
  assets,
  onSelectAsset,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedTwinNode, setSelectedTwinNode] = useState<any | null>(null);

  // Digital Twin Nodes arranged in a clean cascade
  const twinNodes = [
    {
      id: 'PLANT-01',
      name: 'Combined Cycle Generating Station',
      type: 'Power Plant',
      status: 'Active',
      color: 'bg-blue-600',
      x: 10,
      y: 50,
      load: '45 MW',
      temp: '68°C',
      health: '98%',
      risk: 'Low',
    },
    {
      id: 'SS-A',
      name: 'Substation A (Bulk 400kV)',
      type: 'Substation',
      status: 'Healthy',
      color: 'bg-[#16A34A]',
      x: 28,
      y: 35,
      load: '38.5 MW',
      temp: '48°C',
      health: '96%',
      risk: 'Low',
    },
    {
      id: 'SS-B',
      name: 'Substation B (Grid Tie 132kV)',
      type: 'Substation',
      status: 'Warning',
      color: 'bg-[#F59E0B]',
      x: 28,
      y: 65,
      load: '26.8 MW',
      temp: '62°C',
      health: '82%',
      risk: 'Medium',
    },
    {
      id: 'T-001',
      name: 'Transformer Unit 01',
      type: 'Transformer',
      status: 'Healthy',
      color: 'bg-[#16A34A]',
      x: 48,
      y: 25,
      load: '72%',
      temp: '61°C',
      health: '94%',
      risk: 'Low',
    },
    {
      id: 'T-002',
      name: 'Transformer Unit 02',
      type: 'Transformer',
      status: 'Warning',
      color: 'bg-[#F59E0B]',
      x: 48,
      y: 50,
      load: '91%',
      temp: '78°C',
      health: '74%',
      risk: 'Medium',
    },
    {
      id: 'T-003',
      name: 'Transformer Unit 03',
      type: 'Transformer',
      status: 'Healthy',
      color: 'bg-[#16A34A]',
      x: 48,
      y: 75,
      load: '68%',
      temp: '64°C',
      health: '92%',
      risk: 'Low',
    },
    {
      id: 'D-014',
      name: 'Distribution Node D-14',
      type: 'Distribution Node',
      status: 'Critical',
      color: 'bg-[#DC2626]',
      x: 70,
      y: 40,
      load: '94%',
      temp: '69°C',
      health: '68%',
      risk: 'High',
    },
    {
      id: 'D-008',
      name: 'Distribution Node D-08',
      type: 'Distribution Node',
      status: 'Healthy',
      color: 'bg-[#16A34A]',
      x: 70,
      y: 65,
      load: '62%',
      temp: '58°C',
      health: '95%',
      risk: 'Low',
    },
    {
      id: 'IND-CONS',
      name: 'Sector 4 Heavy Manufacturing',
      type: 'Consumer',
      status: 'Active',
      color: 'bg-blue-600',
      x: 90,
      y: 35,
      load: '12.4 MW',
      temp: '44°C',
      health: '99%',
      risk: 'Low',
    },
    {
      id: 'RES-CONS',
      name: 'Civic Residential & Commercial Grid',
      type: 'Consumer',
      status: 'Active',
      color: 'bg-blue-600',
      x: 90,
      y: 65,
      load: '8.2 MW',
      temp: '36°C',
      health: '99%',
      risk: 'Low',
    },
  ];

  // Flow links
  const flows = [
    { from: 'PLANT-01', to: 'SS-A' },
    { from: 'PLANT-01', to: 'SS-B' },
    { from: 'SS-A', to: 'T-001' },
    { from: 'SS-A', to: 'T-002' },
    { from: 'SS-B', to: 'T-002' },
    { from: 'SS-B', to: 'T-003' },
    { from: 'T-001', to: 'D-014' },
    { from: 'T-002', to: 'D-014' },
    { from: 'T-003', to: 'D-008' },
    { from: 'D-014', to: 'IND-CONS' },
    { from: 'D-008', to: 'RES-CONS' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#0F3D91]" />
            <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
              Digital Grid Twin (Cascade Topology)
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Simplified virtual cascade: Power Plant → Transmission Lines → Substations → Transformers → Distribution Nodes → Consumers
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-bold text-[#0F3D91]">
            {(zoomLevel * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Interactive Twin Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden h-[500px]">
        {/* Schematic Grid Canvas with Zoom Scale */}
        <div
          className="w-full h-full relative transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #CBD5E1 1px, transparent 1px), linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          ></div>

          {/* SVG Animated Power Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {flows.map((flow, idx) => {
              const from = twinNodes.find((n) => n.id === flow.from);
              const to = twinNodes.find((n) => n.id === flow.to);
              if (!from || !to) return null;

              return (
                <g key={idx}>
                  <line
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="#94A3B8"
                    strokeWidth="2.5"
                    opacity="0.4"
                  />
                  <line
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="#0F3D91"
                    strokeWidth="1.8"
                    strokeDasharray="6 4"
                    opacity="0.8"
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {twinNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedTwinNode(node)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={`w-9 h-9 rounded-2xl ${node.color} text-white flex items-center justify-center font-bold text-xs font-mono shadow-md border-2 border-white transition-transform group-hover:scale-125`}
              >
                <Zap className="w-4 h-4 fill-white" />
              </div>

              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm text-[10px] font-mono font-bold text-[#172033] whitespace-nowrap">
                {node.name.split(' ')[0]} ({node.status})
              </div>
            </div>
          ))}
        </div>

        {/* Selected Node Details Drawer */}
        {selectedTwinNode && (
          <div className="absolute bottom-4 right-4 z-30 bg-white p-4 rounded-xl border border-slate-200 shadow-xl max-w-xs text-xs font-mono animate-in fade-in duration-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2 font-bold text-[#172033]">
              <span>{selectedTwinNode.name}</span>
              <button
                onClick={() => setSelectedTwinNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Type:</span>
                <span>{selectedTwinNode.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Status:</span>
                <span className="font-bold text-[#0F3D91]">{selectedTwinNode.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Load:</span>
                <span>{selectedTwinNode.load}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Temperature:</span>
                <span>{selectedTwinNode.temp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Health:</span>
                <span className="text-[#16A34A] font-bold">{selectedTwinNode.health}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
