import React from 'react';
import { 
  Building2, 
  Layers, 
  Compass, 
  BookOpen, 
  Settings, 
  ShieldCheck, 
  Terminal, 
  Sparkles,
  ChevronDown,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  activeCount: number;
  atRiskCount: number;
  currentRole: string;
  rolePermissions: any;
  onLogout?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export default function Sidebar({ 
  currentPath, 
  onNavigate, 
  activeCount, 
  atRiskCount, 
  currentRole, 
  rolePermissions, 
  onLogout,
  theme = 'dark',
  onToggleTheme
}: SidebarProps) {
  const isDark = theme === 'dark';

  // Navigation structure based on active role permissions
  const navItems = [
    ...(rolePermissions?.dashboards?.commands !== false
      ? [{ name: 'Command Center', path: '/', icon: Compass }]
      : []),
    { name: 'Engagements', path: '/engagements', icon: Layers, badge: activeCount },
    ...(rolePermissions?.dashboards?.productIntel !== false
      ? [{ name: 'Product Intelligence', path: '/product-intelligence', icon: Sparkles }]
      : []),
    ...(currentRole !== 'Executive'
      ? [{ name: 'Playbooks', path: '/playbooks', icon: BookOpen, subCount: 6 }]
      : []),
    ...(currentRole === 'Admin'
      ? [{ name: 'Settings', path: '/settings', icon: Settings }]
      : [])
  ];

  const getIsActive = (itemPath: string) => {
    if (itemPath === '/') {
      return currentPath === '' || currentPath === '/';
    }
    return currentPath.startsWith(itemPath);
  };

  return (
    <div className={`w-64 flex flex-col h-screen border-r shrink-0 select-none font-sans transition-colors duration-200 ${
      isDark 
        ? 'bg-zinc-950 text-zinc-300 border-zinc-900/60' 
        : 'bg-white text-slate-700 border-slate-200'
    }`} id="fde-sidebar">
      {/* Workspace Header */}
      <div 
        onClick={() => onNavigate('/marketing')} 
        className={`p-4 border-b flex items-center justify-between transition-colors cursor-pointer group ${
          isDark 
            ? 'border-zinc-900 hover:bg-zinc-900/40' 
            : 'border-slate-100 hover:bg-slate-50/80'
        }`}
        title="Go to Homepage"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center font-mono text-white text-sm font-black tracking-tighter shadow-md">
            Ω
          </div>
          <div className="flex flex-col">
            <span className={`font-semibold text-[14px] leading-tight ${isDark ? 'text-zinc-100 group-hover:text-white' : 'text-slate-800 group-hover:text-indigo-650'}`}>FDE OS</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider">WORKSPACE // v1.0</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
      </div>

      {/* Team Context */}
      <div className={`px-4 py-3 border-b ${isDark ? 'border-zinc-900 bg-zinc-950' : 'border-slate-100 bg-slate-50/30'}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-505 font-medium">DEPLOYMENT REGION</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
          <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>B2B AI Scaling Cluster</span>
        </div>
      </div>

      {/* Navigation Space */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <div>
          <span className="px-3 text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-2">Operations</span>
          {navItems.map((item) => {
            const isActive = getIsActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group duration-150 mb-1 ${
                  isActive 
                    ? (isDark 
                        ? 'bg-zinc-800 text-zinc-100 border-l-2 border-indigo-505 pl-2.5' 
                        : 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-650 pl-2.5 font-semibold')
                    : (isDark 
                        ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60' 
                        : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100/60')
                }`}
                style={{ textAlign: 'left' }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    isActive ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : 'text-zinc-550 group-hover:text-zinc-400'
                  }`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isActive ? 'bg-indigo-900/40 text-indigo-300' : (isDark ? 'bg-zinc-900 text-zinc-550' : 'bg-slate-100 text-slate-505')
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.subCount !== undefined && (
                  <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-slate-400 group-hover:text-slate-650'}`}>
                    {item.subCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Systems Monitoring State */}
        <div className={`pt-6 border-t mt-6 ${isDark ? 'border-zinc-900' : 'border-slate-100'}`}>
          <span className="px-3 text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-2">DEPLOYMENT HEALTH</span>
          <div className="space-y-1.5 px-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[9px] tracking-wider">ACTIVE PIPELINE</span>
              <span className={`font-mono text-[11px] font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{activeCount} accounts</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[9px] tracking-wider">CRITICAL BLOCKERS</span>
              <span className={`font-mono text-[11px] font-medium ${atRiskCount > 0 ? 'text-rose-500 font-bold' : (isDark ? 'text-zinc-400' : 'text-slate-655')}`}>
                {atRiskCount} accounts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Status Profile Card */}
      <div className={`p-3 border-t flex items-center justify-between ${isDark ? 'border-zinc-900 bg-zinc-950/60' : 'border-slate-100 bg-slate-50'}`}>
        <div className="flex items-center gap-2.5 min-w-0" id="fde-profile-meta">
          <div className="relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${isDark ? 'bg-indigo-700/80 border-indigo-505/35 text-zinc-100' : 'bg-indigo-100 border-indigo-200 text-indigo-700'}`}>
              {currentRole === 'Admin' ? 'SC' : currentRole === 'FDE' ? 'AC' : currentRole === 'FDE Manager' ? 'DP' : currentRole === 'Executive' ? 'MV' : 'RP'}
            </div>
            <div className={`absolute right-0 bottom-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border ${isDark ? 'border-zinc-950' : 'border-white'}`}></div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-xs font-semibold truncate leading-none ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
              {currentRole === 'Admin' ? 'Sarah Connor' : currentRole === 'FDE' ? 'Alex Carver' : currentRole === 'FDE Manager' ? 'Diana Price' : currentRole === 'Executive' ? 'Marcus Vance' : 'Raj Patel'}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono truncate leading-normal mt-0.5">{currentRole}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {onToggleTheme && (
            <button 
              onClick={onToggleTheme}
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer ${isDark ? 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'}`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="sidebar-theme-toggle"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}
          <div className={`w-5 h-5 rounded flex items-center justify-center ${isDark ? 'text-indigo-405' : 'text-indigo-650'}`} title="Security clearance active">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          {onLogout && (
            <button 
              onClick={onLogout}
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer ${isDark ? 'hover:bg-red-950/40 text-zinc-500 hover:text-red-400' : 'hover:bg-rose-100 text-slate-500 hover:text-red-650'}`} 
              title="Sign out of workspace"
              id="sidebar-logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
