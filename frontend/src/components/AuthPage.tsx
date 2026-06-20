import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, UserCheck, Key, Lock, Mail, ChevronRight, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface AuthPageProps {
  onLoginSuccess: (role: UserRole) => void;
  isRegister?: boolean;
  onNavigate: (p: string) => void;
  dataMode?: 'demo' | 'api';
  onApiLogin?: (email: string, password: string) => Promise<void>;
  onApiRegister?: (body: { name: string; email: string; password: string; organizationName: string }) => Promise<void>;
  authLoading?: boolean;
  authError?: string | null;
  onToggleDataMode?: (mode: 'demo' | 'api') => void;
}

export function AuthPage({ 
  onLoginSuccess, 
  isRegister = false, 
  onNavigate,
  dataMode = 'demo',
  onApiLogin,
  onApiRegister,
  authLoading = false,
  authError,
  onToggleDataMode
}: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [localError, setLocalError] = useState<string | null>(null);

  // Simulated active profiles
  const profiles = [
    { role: 'Admin' as UserRole, name: 'Principal Admin', desc: 'Manage users, edit roles, full permission coverage.' },
    { role: 'FDE' as UserRole, name: 'Alex Carver (FDE)', desc: 'Field workspace views, custom assignments, read lists.' },
    { role: 'FDE Manager' as UserRole, name: 'Operations Manager', desc: 'Deployments board health checks, standard KPIs.' },
    { role: 'Executive' as UserRole, name: 'Executive Sponsor', desc: 'Secure strategic roadmap totals, Arr values.' },
    { role: 'Product Manager' as UserRole, name: 'Product PM', desc: 'Product intelligence board, cluster feature signal.' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (dataMode === 'api') {
      try {
        if (isRegister) {
          await onApiRegister?.({
            name: name || 'Workspace Admin',
            email,
            password,
            organizationName: organizationName || name || 'FDE OS Workspace'
          });
        } else {
          await onApiLogin?.(email, password);
        }
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : 'Authentication failed');
      }
      return;
    }
    onLoginSuccess(selectedRole);
  };

  const handleProfileClick = (role: UserRole) => {
    if (dataMode === 'api') return;
    setSelectedRole(role);
    onLoginSuccess(role);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@example.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans w-full" id="auth-canvas">
      
      {/* Dynamic graphic lighting */}
      <div className="absolute inset-x-0 top-0 h-40 bg-indigo-500/10 blur-3xl rounded-full scale-150 -z-10"></div>
      
      <div className="w-full max-w-sm space-y-6 relative z-10">
        
        {/* Logo block */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div 
            onClick={() => onNavigate('/marketing')}
            className="w-10 h-10 rounded-xl bg-indigo-650 flex items-center justify-center font-bold text-white font-mono shadow-md border border-indigo-505/20 cursor-pointer"
          >
            F
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans">FDE OS Secure Integration</h1>
            <p className="text-[11px] text-zinc-450 font-mono">Authenticate to corporate sandbox workspace</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-805 rounded-xl p-1.5 flex gap-1 font-mono text-[10px]">
          <button
            type="button"
            onClick={() => onToggleDataMode?.('demo')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${dataMode === 'demo' ? 'bg-indigo-650 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Demo View
          </button>
          <button
            type="button"
            onClick={() => onToggleDataMode?.('api')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${dataMode === 'api' ? 'bg-indigo-650 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            API View
          </button>
        </div>

        {/* Option toggles */}
        {!isRegister ? (
          <div className="bg-zinc-900 border border-zinc-805 rounded-2xl p-5 shadow-xl space-y-4">
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {(authError || localError) && dataMode === 'api' && (
                <div className="bg-rose-950/50 border border-rose-800 text-rose-100 rounded-lg px-3 py-2 text-[10px] font-mono">
                  {localError || authError}
                </div>
              )}
              <div>
                <label className="text-[10px] font-mono text-zinc-450 block mb-1">Corporate Workspace Email</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-550" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-955 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-400 text-white"
                    placeholder="E.g., admin@antigravity.ai"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-455 block mb-1">Passphrase Code</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-550" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-955 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-400 text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-zinc-400 justify-between select-none">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-650 h-3 w-3 bg-zinc-950 border-zinc-800" />
                  <span>Stay authorized</span>
                </label>
                <a href="#/login" className="hover:text-indigo-305">Forgot passphrase?</a>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-indigo-650 hover:bg-indigo-755 font-bold text-white text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
              >
                {authLoading ? 'Authenticating...' : 'Launch Workspace'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {dataMode === 'api' && (
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="w-full bg-zinc-950 hover:bg-zinc-805 border border-zinc-800 font-bold text-zinc-200 text-xs py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Use Demo Login: admin@example.com / Password123!
                </button>
              )}
            </form>

            {/* QUICK ONE CLICK SECURE PROFILES DEMO SELECTION */}
            {dataMode === 'demo' && (
            <div className="border-t border-zinc-900 pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-455" /> MOCK INSTANT SIGN-IN PROFILES
                </span>
                <span className="text-[8px] text-zinc-500 font-mono">// Sandbox bypass</span>
              </div>
              <p className="text-[10px] text-zinc-450 font-sans leading-relaxed">
                Click any pre-configured identity below to instantly login as that role and test downstream views:
              </p>
              
              <div className="space-y-1.5 pt-1">
                {profiles.map((prof) => (
                  <button
                    key={prof.role}
                    type="button"
                    onClick={() => handleProfileClick(prof.role)}
                    className="w-full text-left p-2.5 bg-zinc-950 hover:bg-zinc-805 border border-zinc-850 hover:border-zinc-700 rounded-lg transition-all flex items-start gap-2 group cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-zinc-450 group-hover:text-white transition-colors text-[9px] mt-0.5">
                      {prof.role.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-zinc-200 group-hover:text-white block">{prof.name}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="text-[9px] text-zinc-500 font-sans mt-0.5 block truncate leading-tight">{prof.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            )}

            <div className="text-center pt-2 text-[10px] font-mono text-zinc-500 border-t border-zinc-900 flex justify-center gap-1.5">
              <span>Need a new organization?</span>
              <button onClick={() => onNavigate('/register')} className="text-indigo-400 hover:underline">Register workspace</button>
            </div>

          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-805 rounded-2xl p-5 shadow-xl space-y-4">
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {(authError || localError) && dataMode === 'api' && (
                <div className="bg-rose-950/50 border border-rose-800 text-rose-100 rounded-lg px-3 py-2 text-[10px] font-mono">
                  {localError || authError}
                </div>
              )}
              <div>
                <label className="text-[10px] font-mono text-zinc-450 block mb-1">Company / Organization name</label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 text-white"
                  placeholder="E.g., Antigravity AI"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-450 block mb-1">Admin Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 text-white"
                  placeholder="E.g., Sarah Connor"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-450 block mb-1">Admin Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 text-white"
                  placeholder="E.g., chief@antigravity.ai"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-450 block mb-1">Set Master Passphrase</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 text-white"
                  placeholder="••••••••"
                />
                <p className="text-[9px] text-zinc-500 font-mono mt-1">Minimum 8 characters.</p>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-indigo-650 hover:bg-indigo-755 font-bold text-white text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
              >
                {authLoading ? 'Provisioning...' : 'Provision Organization'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="text-center pt-2 text-[10px] font-mono text-zinc-500 border-t border-zinc-900 flex justify-center gap-1.5">
              <span>Already registered?</span>
              <button onClick={() => onNavigate('/login')} className="text-indigo-400 hover:underline">Log in</button>
            </div>

          </div>
        )}

        {/* Back link */}
        <div className="text-center pt-2">
          <button 
            onClick={() => onNavigate('/marketing')}
            className="text-zinc-500 hover:text-zinc-400 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 mx-auto"
          >
            ← Back to marketing homepage
          </button>
        </div>

      </div>
    </div>
  );
}
