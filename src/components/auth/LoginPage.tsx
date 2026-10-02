import React, { useState } from 'react';
import { Zap, ShieldCheck, ArrowRight, Lock, Mail, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types/grid';

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; email: string; role: UserRole }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('operator.vance@gridguard.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: 'Grid Operator Alex Vance',
      email: email || 'operator.vance@gridguard.ai',
      role: 'Operator',
    });
  };

  const handleQuickLogin = (name: string, role: UserRole, userEmail: string) => {
    onLoginSuccess({ name, role, email: userEmail });
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F6F9FC]">
      {/* Left side: Premium GridGuard AI Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F3D91] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.4) 2px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        ></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-[#0F3D91] fill-[#0F3D91]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight font-['Chakra_Petch']">
                GRIDGUARD <span className="text-[#38BDF8]">AI</span>
              </span>
              <span className="block text-[10px] tracking-widest text-blue-200 font-mono">
                ENTERPRISE UTILITY PLATFORM
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-mono backdrop-blur-sm border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>NEXT-GEN POWER GRID INTELLIGENCE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-['Chakra_Petch'] leading-tight">
            Intelligent Grid Reliability
          </h1>

          <p className="text-lg text-blue-100 font-light leading-relaxed">
            Monitor, predict, and understand power-grid reliability with AI. Detect thermal anomalies, forecast peak demand, and prevent transmission outages before they occur.
          </p>

          <div className="space-y-3 pt-4 border-t border-white/15 text-sm text-blue-100">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#38BDF8]" />
              <span>Real-time sub-cycle synchrophasor telemetry monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#38BDF8]" />
              <span>Isolation Forest anomaly & transformer thermal risk detection</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#38BDF8]" />
              <span>Explainable AI (XAI) root cause attribution & operator guidance</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-300 font-mono flex items-center justify-between">
          <span>IEEE 519 & NERC CIP Audit Compliant</span>
          <span>v2.4 Production Suite</span>
        </div>
      </div>

      {/* Right side: Modern Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-200/80">
          <div className="text-center mb-8">
            <div className="inline-flex lg:hidden items-center justify-center w-12 h-12 rounded-xl bg-[#0F3D91] text-white mb-3">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#172033] font-['Chakra_Petch']">
              Sign In to Station
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Enter your utility credentials to access the Grid Reliability Console
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">
                Workstation Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@gridguard.ai"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#172033] focus:bg-white focus:border-[#1976D2] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#172033]">Password</label>
                <button
                  type="button"
                  className="text-xs text-[#1976D2] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#172033] focus:bg-white focus:border-[#1976D2] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#1976D2] rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-[#64748B]">Remember workstation</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0F3D91] hover:bg-[#1976D2] text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-[11px] text-[#64748B] font-medium">
              Or continue with
            </span>
          </div>

          <button
            onClick={() => handleQuickLogin('Grid Operator Alex Vance', 'Operator', 'alex.vance@gridguard.ai')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-[#172033] transition-colors flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick Demo Station Logins */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[11px] font-mono text-[#64748B] block mb-2">
              1-CLICK DEMO WORKSTATION ACCESS:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
              <button
                onClick={() =>
                  handleQuickLogin('Grid Operator Alex Vance', 'Operator', 'alex.vance@gridguard.ai')
                }
                className="py-1 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0F3D91] font-semibold transition-colors"
              >
                Operator
              </button>
              <button
                onClick={() =>
                  handleQuickLogin('Chief Engineer Sarah Chen', 'Admin', 'sarah.chen@gridguard.ai')
                }
                className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() =>
                  handleQuickLogin('Analyst Dev Patel', 'Viewer', 'dev.patel@gridguard.ai')
                }
                className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
              >
                Viewer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
