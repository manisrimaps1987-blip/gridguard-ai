import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  TrendingUp,
  BarChart3,
  Bell,
  Sliders,
  Bot,
  Settings,
  Zap,
  ShieldAlert,
  Layers,
  Wrench,
  Radio,
  SlidersHorizontal,
  LogOut,
  X,
} from 'lucide-react';
import { UserRole } from '../../types/grid';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: { name: string; email: string; role: UserRole };
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  user,
  onLogout,
  mobileOpen,
  onCloseMobile,
  activeAlertsCount,
}) => {
  const primaryNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Grid Monitoring', icon: Activity },
    { id: 'equipment', label: 'Equipment Health', icon: Cpu },
    { id: 'predictions', label: 'AI Predictions', icon: TrendingUp },
    { id: 'forecast', label: 'Load Forecast', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertsCount },
    { id: 'analytics', label: 'Analytics', icon: Layers },
    { id: 'copilot', label: 'AI Grid Copilot', icon: Bot, isAi: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const advancedNav = [
    { id: 'maintenance', label: 'Predictive Maint.', icon: Wrench },
    { id: 'anomalies', label: 'Anomaly Detection', icon: Radio },
    { id: 'outage-risk', label: 'Outage Risk', icon: ShieldAlert },
    { id: 'simulator', label: 'What-If Simulator', icon: SlidersHorizontal },
    { id: 'digital-twin', label: 'Digital Grid Twin', icon: Zap },
    { id: 'risk-ranking', label: 'Asset Risk Ranking', icon: Sliders },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        ></div>
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick('overview')}>
            <div className="w-9 h-9 rounded-xl bg-[#0F3D91] flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#0F3D91] font-['Chakra_Petch'] leading-none block">
                GRIDGUARD <span className="text-[#1976D2]">AI</span>
              </span>
              <span className="text-[10px] text-[#64748B] font-mono leading-none block mt-0.5">
                Reliability Intelligence
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-[#64748B] px-3 mb-2 tracking-wider">
              Control Station
            </div>
            <nav className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#EAF3FF] text-[#0F3D91] font-bold shadow-xs'
                        : 'text-[#172033] hover:bg-slate-100/80 hover:text-[#0F3D91]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-[#0F3D91]'
                            : item.isAi
                            ? 'text-[#1976D2]'
                            : 'text-[#64748B]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#DC2626] text-white text-[10px] font-bold font-mono">
                        {item.badge}
                      </span>
                    )}

                    {item.isAi && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-100 text-[#0F3D91] font-bold">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Advanced Reliability Modules */}
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-[#64748B] px-3 mb-2 tracking-wider">
              Advanced Modules
            </div>
            <nav className="space-y-1">
              {advancedNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#EAF3FF] text-[#0F3D91] font-bold shadow-xs'
                        : 'text-[#172033] hover:bg-slate-100/80 hover:text-[#0F3D91]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#0F3D91]' : 'text-[#64748B]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Status & Profile */}
        <div className="p-3 border-t border-slate-200/80 bg-[#F6F9FC] space-y-3">
          {/* System status pill */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs font-mono">
            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
              <span>SYSTEM STATUS</span>
              <span className="flex items-center gap-1 text-[#16A34A] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                ONLINE
              </span>
            </div>
            <div className="text-[#172033] font-bold text-xs mt-1">
              Bus: 229V / 49.98Hz • 94% Stable
            </div>
          </div>

          {/* User profile & logout */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-full bg-[#0F3D91] text-white flex items-center justify-center font-bold text-xs font-['Chakra_Petch'] shrink-0">
                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="truncate">
                <div className="font-bold text-xs text-[#172033] truncate leading-tight">
                  {user.name}
                </div>
                <div className="text-[10px] text-[#64748B] font-mono leading-tight">
                  {user.role}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
