import React, { useState } from 'react';
import {
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Thermometer,
  Activity,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { GridAsset, AssetHealthStatus } from '../../types/grid';

interface EquipmentHealthViewProps {
  assets: GridAsset[];
  onSelectAsset: (asset: GridAsset) => void;
}

export const EquipmentHealthView: React.FC<EquipmentHealthViewProps> = ({
  assets,
  onSelectAsset,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const totalCount = 128;
  const healthyCount = 107;
  const warningCount = 16;
  const criticalCount = 5;

  const filteredAssets = assets.filter((asset) => {
    const matchesStatus =
      filterStatus === 'All' ? true : asset.status === filterStatus;
    const matchesType = typeFilter === 'All' ? true : asset.type === typeFilter;
    const matchesSearch =
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-2xl font-black text-[#172033] font-['Chakra_Petch']">
          Equipment Health
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Monitor the condition and reliability risk of connected grid assets.
        </p>
      </div>

      {/* 4 Fleet Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Assets */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>TOTAL ASSETS</span>
            <Cpu className="w-4 h-4 text-[#0F3D91]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#172033] mt-2">
            {totalCount}
          </div>
          <div className="text-xs text-[#16A34A] font-mono mt-1 font-bold">100% Monitored</div>
        </div>

        {/* Healthy */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>HEALTHY ASSETS</span>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#16A34A] mt-2">
            {healthyCount}
          </div>
          <div className="text-xs text-[#64748B] font-mono mt-1">83.6% Nominal</div>
        </div>

        {/* Warning */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>WARNING ELEVATED</span>
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#F59E0B] mt-2">
            {warningCount}
          </div>
          <div className="text-xs text-[#F59E0B] font-mono mt-1">Attention Advised</div>
        </div>

        {/* Critical */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
            <span>CRITICAL CONDITION</span>
            <AlertCircle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#DC2626] mt-2">
            {criticalCount}
          </div>
          <div className="text-xs text-[#DC2626] font-mono mt-1 font-bold">Action Required</div>
        </div>
      </div>

      {/* Equipment Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        {/* Controls: Search & Status Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#F6F9FC] p-1 rounded-xl border border-slate-200 text-xs font-mono">
            {['All', 'Healthy', 'Warning', 'Critical'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  filterStatus === status
                    ? 'bg-white text-[#0F3D91] font-bold shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search & Type dropdown */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="w-full relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by ID (e.g. T-002, D-014)..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#F6F9FC] border border-slate-200 rounded-lg text-xs font-mono text-[#172033] focus:bg-white focus:border-[#1976D2] outline-none"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#F6F9FC] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#172033] outline-none"
            >
              <option>All Types</option>
              <option>Transformer</option>
              <option>Substation</option>
              <option>Distribution Node</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F6F9FC] text-[#64748B] uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Asset ID</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Temperature</th>
                <th className="py-3 px-3">Load</th>
                <th className="py-3 px-3">Health</th>
                <th className="py-3 px-3">Risk</th>
                <th className="py-3 px-3">Last Update</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#172033]">
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-bold text-[#0F3D91]">{asset.id}</td>
                  <td className="py-3 px-3 text-[#64748B]">{asset.type}</td>
                  <td className="py-3 px-3">{asset.location}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        asset.temperatureC > 75
                          ? 'text-[#DC2626]'
                          : asset.temperatureC > 65
                          ? 'text-[#F59E0B]'
                          : 'text-[#16A34A]'
                      }`}
                    >
                      {asset.temperatureC}°C
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold">{asset.loadPct}%</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        asset.status === 'Healthy'
                          ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                          : asset.status === 'Warning'
                          ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                          : 'bg-red-50 text-[#DC2626] border-red-200'
                      }`}
                    >
                      {asset.healthPct}% ({asset.status})
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        asset.risk === 'Low'
                          ? 'text-[#16A34A]'
                          : asset.risk === 'Medium'
                          ? 'text-[#F59E0B]'
                          : 'text-[#DC2626]'
                      }`}
                    >
                      {asset.risk}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#64748B]">{asset.lastUpdate}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAsset(asset);
                      }}
                      className="text-[#1976D2] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
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
