import React, { useState } from 'react';
import {
  Search,
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Zap,
  Menu,
} from 'lucide-react';
import { UserRole, GridStatus } from '../../types/grid';

interface HeaderProps {
  pageTitle: string;
  breadcrumb: string;
  gridStatus: GridStatus;
  activeAlertsCount: number;
  user: { name: string; email: string; role: UserRole };
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  onOpenCopilot: () => void;
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  breadcrumb,
  gridStatus,
  activeAlertsCount,
  user,
  onRoleChange,
  onLogout,
  onOpenCopilot,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[11px] font-mono text-[#64748B] flex items-center gap-1.5">
            <span>Grid Reliability</span>
            <span>/</span>
            <span className="text-[#1976D2] font-semibold">{breadcrumb}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#172033] font-['Chakra_Petch'] leading-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assets, substations (e.g. T-002, Substation B)..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#F6F9FC] border border-slate-200 rounded-lg text-xs text-[#172033] focus:bg-white focus:border-[#1976D2] focus:ring-1 focus:ring-blue-200 outline-none transition-all font-mono"
          />
        </div>
      </div>

      {/* Right: Actions, Grid Status, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        {/* Grid Status Badge: ● GRID STATUS: STABLE */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-[#16A34A]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>GRID STATUS: {gridStatus}</span>
        </div>

        {/* Notifications Icon with active badge */}
        <div className="relative">
          <button
            title="Active Alarms"
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {activeAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F3D91] text-white font-bold flex items-center justify-center text-xs shadow-xs font-['Chakra_Petch']">
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden xl:block text-left">
              <span className="block text-xs font-bold text-[#172033] leading-none">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-[#64748B] font-mono leading-none">
                {user.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-bold text-[#172033]">{user.name}</div>
                <div className="text-[11px] text-[#64748B] font-mono">{user.email}</div>
              </div>

              <div className="py-1">
                <span className="text-[10px] uppercase font-mono text-[#64748B] px-3 py-1 block">
                  Switch Authority Role
                </span>
                {(['Operator', 'Admin', 'Viewer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      user.role === r
                        ? 'bg-blue-50 text-[#0F3D91] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r}</span>
                    {user.role === r && <ShieldCheck className="w-3.5 h-3.5 text-[#0F3D91]" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-[#DC2626] hover:bg-red-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out Workstation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
