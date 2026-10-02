import React, { useState } from 'react';
import {
  Zap,
  Activity,
  AlertTriangle,
  Bot,
  Sliders,
  Sparkles,
  BarChart3,
  MapPin,
  TrendingUp,
  Cpu,
  FileText,
  UploadCloud,
  Layers,
  History,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { GridTelemetry, UserRole } from '../types/grid';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  telemetry: GridTelemetry;
  gridHealthScore: number;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenCopilot: () => void;
  onTriggerSimulation: (type: 'VOLTAGE_SAG' | 'TRANSFORMER_OVERHEAT' | 'OUTAGE_TRIP' | 'RESET') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  telemetry,
  gridHealthScore,
  userRole,
  setUserRole,
  onOpenCopilot,
  onTriggerSimulation,
}) => {
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getStatusBadge = () => {
    switch (telemetry.gridStatus) {
      case 'NORMAL':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          text: 'NORMAL',
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400 animate-ping',
          text: 'WARNING',
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
          dot: 'bg-rose-400 animate-ping',
          text: 'CRITICAL',
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          dot: 'bg-slate-400',
          text: 'OFFLINE',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-950/60 bg-[#070e1c]/95 backdrop-blur-md">
      {/* Top Demo Data Notice Bar */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-blue-950/80 to-cyan-950/70 border-b border-cyan-800/30 px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-semibold tracking-wider">DEMO DATA — NOT LIVE GRID DATA</span>
          <span className="hidden sm:inline text-cyan-400/60 text-[11px]">| Real-time simulated electrical telemetry stream</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTriggerSimulation('RESET')}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors"
            title="Reset telemetry to nominal 230V / 50Hz"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Grid</span>
          </button>
          <span className="text-slate-500">|</span>
          <div className="relative">
            <button
              onClick={() => setShowSimMenu(!showSimMenu)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-900/40 hover:bg-cyan-900/70 border border-cyan-700/40 text-cyan-200 transition-all font-mono text-[11px]"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span>Simulate Disturbance</span>
            </button>
            {showSimMenu && (
              <div className="absolute right-0 mt-1 w-64 bg-[#091325] border border-cyan-700/50 rounded-lg shadow-2xl p-2 z-50 text-xs">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Test Grid Scenarios
                </div>
                <button
                  onClick={() => {
                    onTriggerSimulation('VOLTAGE_SAG');
                    setShowSimMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-950/40 text-amber-300 flex items-center justify-between transition-colors"
                >
                  <span>Inject Voltage Sag (212V)</span>
                  <span className="text-[10px] bg-amber-900/60 px-1 rounded text-amber-200">Warning</span>
                </button>
                <button
                  onClick={() => {
                    onTriggerSimulation('TRANSFORMER_OVERHEAT');
                    setShowSimMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-rose-950/40 text-rose-300 flex items-center justify-between transition-colors"
                >
                  <span>TR-501 Overheat (112°C)</span>
                  <span className="text-[10px] bg-rose-900/60 px-1 rounded text-rose-200">Thermal</span>
                </button>
                <button
                  onClick={() => {
                    onTriggerSimulation('OUTAGE_TRIP');
                    setShowSimMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-red-950/60 text-red-400 font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Simulate Line 9A Outage</span>
                  <span className="text-[10px] bg-red-900/80 px-1 rounded text-red-100">Critical</span>
                </button>
                <div className="border-t border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    onTriggerSimulation('RESET');
                    setShowSimMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-cyan-950/40 text-cyan-300 transition-colors"
                >
                  Restore Nominal Operations
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all">
              <Zap className="w-6 h-6 text-black fill-cyan-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-['Chakra_Petch']">
                  GRIDGUARD<span className="text-cyan-400"> AI</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-medium border border-cyan-500/30">
                  SMART GRID
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block tracking-wide">
                AI-Powered Intelligence for a Safer, Smarter Power Grid
              </p>
            </div>
          </div>

          {/* Grid Health Score Quick Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Grid Health</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-base font-bold font-mono ${
                    gridHealthScore >= 85
                      ? 'text-emerald-400'
                      : gridHealthScore >= 65
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {gridHealthScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
            </div>
          </div>

          {/* Grid Status Badge */}
          <div
            className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-mono font-semibold ${status.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
            <span>GRID: {status.text}</span>
          </div>
        </div>

        {/* Right Tools & Role Selection */}
        <div className="flex items-center gap-3">
          {/* AI Copilot trigger */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-cyan-200" />
            <span className="hidden sm:inline">GridGuard Copilot</span>
            <span className="sm:hidden">Copilot</span>
            <Sparkles className="w-3 h-3 text-cyan-300" />
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-200 hover:border-cyan-500/50 text-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">{userRole}</span>
            </button>
            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-[#091325] border border-cyan-800/40 rounded-lg shadow-xl p-1 z-50 text-xs">
                {(['Admin', 'Grid Operator', 'Energy Analyst', 'Viewer'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setUserRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                      userRole === role
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-t border-slate-800/80 bg-[#060c18]/90 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-1.5 text-xs font-medium">
          <button
            onClick={() => setCurrentView('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('monitor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'monitor'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Real-Time Monitor</span>
          </button>

          <button
            onClick={() => setCurrentView('gridmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'gridmap'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Grid Map</span>
          </button>

          <button
            onClick={() => setCurrentView('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'analytics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Consumption & Cost</span>
          </button>

          <button
            onClick={() => setCurrentView('forecast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'forecast'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AI Demand Forecast</span>
          </button>

          <button
            onClick={() => setCurrentView('outages')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'outages'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Outages & Faults</span>
          </button>

          <button
            onClick={() => setCurrentView('transformers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'transformers'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Transformers & Substations</span>
          </button>

          <button
            onClick={() => setCurrentView('renewables')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'renewables'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Renewables & Battery</span>
          </button>

          <button
            onClick={() => setCurrentView('optimize')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'optimize'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Energy Optimization</span>
          </button>

          <button
            onClick={() => setCurrentView('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'upload'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Dataset ML Upload</span>
          </button>

          <button
            onClick={() => setCurrentView('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'reports'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Reports</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'history'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historical Compare</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'admin'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Admin & IoT</span>
          </button>

          <button
            onClick={() => setCurrentView('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              currentView === 'landing'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Overview</span>
          </button>
        </div>
      </div>
    </header>
  );
};
