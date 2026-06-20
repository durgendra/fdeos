import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Play, 
  CornerDownRight, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight,
  TrendingUp,
  FileText,
  Loader2
} from 'lucide-react';

import { INITIAL_ENGAGEMENTS, PLAYBOOKS, AGGREGATE_PRODUCT_THEMES } from './data';
import { Engagement, DeploymentStage, DeploymentHealth, User, RolePermissions, UserRole, ProductThemeAggregate, Playbook } from './types';
import { INITIAL_USERS, DEFAULT_ROLE_PERMISSIONS } from './data/roles';
import Sidebar from './components/Sidebar';
import Charts from './components/Charts';
import WorkspaceTabs from './components/WorkspaceTabs';
import { MarketingPage } from './components/MarketingPage';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './hooks/useAuth';
import { useEngagements } from './hooks/useEngagements';
import { useEngagementDetail } from './hooks/useEngagementDetail';
import { engagementsApi } from './api/engagementsApi';
import { dashboardApi } from './api/dashboardApi';
import { productSignalsApi } from './api/productSignalsApi';
import { readinessApi } from './api/readinessApi';
import { SIMULATED_ROLE_KEY, TOKEN_KEY } from './api/client';
import { mapApiEngagementToUi, mapProductThemeToUi, permissionsToUiPermissions, roleKeyToUiRole, uiRoleToRoleKey } from './api/adapters';
import { DashboardSummary } from './types/dashboard';

// Static assets or constants
const STAGE_COLORS: Record<DeploymentStage, string> = {
  'Discovery': 'bg-zinc-100 text-zinc-700 border-zinc-200',
  'Workflow Mapping': 'bg-sky-50 text-sky-700 border-sky-100',
  'Technical Scoping': 'bg-amber-50 text-amber-700 border-amber-100',
  'Prototype': 'bg-purple-50 text-purple-750 border-purple-100',
  'Validation': 'bg-indigo-50 text-indigo-750 border-indigo-100',
  'Production Hardening': 'bg-violet-50 text-violet-750 border-violet-100',
  'Handoff': 'bg-teal-50 text-teal-750 border-teal-100',
  'Expansion': 'bg-emerald-50 text-emerald-800 border-emerald-100'
};

const HEALTH_COLORS: Record<DeploymentHealth, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
};

function readinessCategoryForStage(stage: DeploymentStage) {
  if (stage === 'Discovery' || stage === 'Workflow Mapping') return 'Business Readiness';
  if (stage === 'Technical Scoping') return 'Integration Readiness';
  if (stage === 'Prototype' || stage === 'Validation') return 'AI Evaluation Readiness';
  if (stage === 'Production Hardening') return 'Production Readiness';
  if (stage === 'Handoff') return 'Handoff Readiness';
  return 'Business Readiness';
}

function buildPlaybookChecklist(playbook: Playbook) {
  const required = playbook.requiredOutputs.map((output) => `${playbook.title}: ${output}`);
  const remaining = Math.max(0, playbook.checklistCount - required.length);
  return [
    ...required,
    ...Array.from({ length: remaining }, (_, index) => `${playbook.title}: checkpoint ${required.length + index + 1}`)
  ];
}

export default function App() {
  const [dataMode, setDataMode] = useState<'demo' | 'api'>(() => {
    return (localStorage.getItem('fdeos_data_mode') as 'demo' | 'api') || 'demo';
  });
  const isApiMode = dataMode === 'api';
  const auth = useAuth(isApiMode);
  const apiEngagements = useEngagements(isApiMode && !!auth.token);

  const switchDataMode = (mode: 'demo' | 'api') => {
    setDataMode(mode);
    localStorage.setItem('fdeos_data_mode', mode);
    if (mode === 'demo') {
      localStorage.removeItem(SIMULATED_ROLE_KEY);
      navigateTo('/');
    } else {
      localStorage.removeItem('fdeos_authenticated');
      navigateTo(localStorage.getItem(TOKEN_KEY) ? '/' : '/login');
    }
  };
  // 1. Core State
  const [engagements, setEngagements] = useState<Engagement[]>(() => {
    return INITIAL_ENGAGEMENTS;
  });

  // 1b. Role & Privilege State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [permissions, setPermissions] = useState<Record<UserRole, RolePermissions>>(DEFAULT_ROLE_PERMISSIONS);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fdeos_authenticated') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('fdeos_current_role') as UserRole) || 'Admin';
  });
  
  const [simulatedRoleActive, setSimulatedRoleActive] = useState<UserRole | null>(null);
  const [pendingPlaybook, setPendingPlaybook] = useState<Playbook | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('fdeos_theme') as 'light' | 'dark') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('fdeos_theme', next);
      return next;
    });
  };

  const apiActualRole = roleKeyToUiRole(auth.session?.actualRole?.key);
  const apiEffectiveRole = roleKeyToUiRole(auth.session?.effectiveRole?.key);
  const effectiveRole = isApiMode ? apiEffectiveRole : (simulatedRoleActive || currentRole);
  const actualRole = isApiMode ? apiActualRole : currentRole;
  const rolePermissions = isApiMode && auth.session ? permissionsToUiPermissions(auth.session.permissions) : permissions[effectiveRole];
  const displayedEngagements = isApiMode ? apiEngagements.engagements : engagements;

  // Auto redirect role-specific landing path on change
  // FDE -> / (will see filtered list with active checkbox toggling)
  // Product Manager -> /product-intelligence (their dedicated workspace views)
  useEffect(() => {
    if (isApiMode) return;
    if (!isAuthenticated) return;
    if (effectiveRole === 'Product Manager') {
      navigateTo('/product-intelligence');
    } else {
      navigateTo('/');
    }
  }, [effectiveRole, isAuthenticated, isApiMode]);

  // Simple reactive HASH router
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const handleHash = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (path: string) => {
    window.location.hash = path.startsWith('/') ? '#' + path : '#/' + path;
  };

  // Parse path
  const hashPath = currentHash.replace(/^#\//, '');
  const pathParts = hashPath.split('/').filter(Boolean);

  const activeCount = displayedEngagements.length;
  const atRiskCount = displayedEngagements.filter(e => e.health === 'red').length;

  const handleLoginSuccess = (role: UserRole) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    localStorage.setItem('fdeos_authenticated', 'true');
    localStorage.setItem('fdeos_current_role', role);
    if (role === 'Product Manager') {
      navigateTo('/product-intelligence');
    } else {
      navigateTo('/');
    }
  };

  const launchDemoWorkspace = () => {
    setDataMode('demo');
    localStorage.setItem('fdeos_data_mode', 'demo');
    localStorage.removeItem(SIMULATED_ROLE_KEY);
    handleLoginSuccess('Admin');
  };

  const handleLogout = () => {
    if (isApiMode) {
      auth.logout();
      setSimulatedRoleActive(null);
      localStorage.removeItem(SIMULATED_ROLE_KEY);
      navigateTo('/login');
      return;
    }
    setIsAuthenticated(false);
    setSimulatedRoleActive(null);
    setCurrentRole('Admin');
    localStorage.removeItem('fdeos_authenticated');
    localStorage.removeItem('fdeos_current_role');
    navigateTo('/');
  };

  // Render Dispatcher
  const handleApiLogin = async (email: string, password: string) => {
    await auth.login(email, password);
    await apiEngagements.retry();
    navigateTo('/');
  };

  const handleApiRegister = async (body: { name: string; email: string; password: string; organizationName: string }) => {
    await auth.register(body);
    await apiEngagements.retry();
    navigateTo('/');
  };

  if ((!isApiMode && !isAuthenticated) || (isApiMode && !auth.token) || hashPath === 'marketing') {
    if (hashPath === 'login') {
      return (
        <AuthPage 
          onLoginSuccess={handleLoginSuccess}
          isRegister={false}
          onNavigate={navigateTo}
          dataMode={dataMode}
          onToggleDataMode={switchDataMode}
          onApiLogin={handleApiLogin}
          authLoading={auth.loading}
          authError={auth.error}
        />
      );
    }
    if (hashPath === 'register') {
      return (
        <AuthPage 
          onLoginSuccess={handleLoginSuccess}
          isRegister={true}
          onNavigate={navigateTo}
          dataMode={dataMode}
          onToggleDataMode={switchDataMode}
          onApiRegister={handleApiRegister}
          authLoading={auth.loading}
          authError={auth.error}
        />
      );
    }
    // Default unauthenticated view
    return (
        <MarketingPage 
          onLoginClick={() => navigateTo('/login')}
        onDemoClick={launchDemoWorkspace} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden select-none transition-colors duration-250 ${
      isDark 
        ? 'bg-zinc-950 text-zinc-150' 
        : 'bg-slate-50 text-slate-900 light-mode'
    }`}>
      {/* 1. Global Navigation Sidebar */}
      <Sidebar 
        currentPath={'/' + hashPath} 
        onNavigate={navigateTo} 
        activeCount={activeCount} 
        atRiskCount={displayedEngagements.filter(e => e.health === 'red').length} 
        currentRole={effectiveRole}
        rolePermissions={rolePermissions}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Main Container body */}
      <div className="flex-1 flex flex-col h-full overflow-hidden select-text" id="fde-main-stage">
        {/* VIEW AS ROLE DROPDOWN & SIMULATION HEADER (ONLY FOR REAL ADMIN) */}
        {actualRole === 'Admin' && (
          <div className="bg-zinc-900 border-b border-zinc-805 px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between text-xs text-white shrink-0 gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700 tracking-wider font-bold">
                SECURITY SYSTEM: CORE ADMIN
              </span>
              <div className="h-4 w-px bg-zinc-800 hidden md:block"></div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-zinc-400">Simulate Viewport as Role:</span>
                <select
                  className="bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded text-white outline-none font-bold text-[11px] cursor-pointer"
                  key={effectiveRole}
                  value={effectiveRole}
                  onChange={(e) => {
                    const val = e.target.value as UserRole;
                    if (val === 'Admin') {
                      setSimulatedRoleActive(null);
                      localStorage.removeItem(SIMULATED_ROLE_KEY);
                    } else {
                      setSimulatedRoleActive(val);
                      if (isApiMode) localStorage.setItem(SIMULATED_ROLE_KEY, uiRoleToRoleKey(val));
                    }
                    if (isApiMode) setTimeout(() => auth.refreshSession(), 0);
                  }}
                >
                  <option value="Admin">Admin (Core Principal)</option>
                  <option value="FDE">FDE Field Agent (Alex Carver)</option>
                  <option value="FDE Manager">FDE Operations Manager</option>
                  <option value="Executive font-semibold">Executive Sponsor</option>
                  <option value="Product Manager">Product PM</option>
                </select>
              </div>
            </div>

            <span className="text-[10px] text-zinc-500 font-mono tracking-wider">// REAL-TIME PRIVILEGE SYNCHRONIZER</span>
          </div>
        )}

        <div className="bg-zinc-950 border-b border-zinc-805 px-6 py-2 flex items-center justify-between text-[10px] font-mono text-zinc-300 shrink-0">
          <span>DATA SOURCE: <strong className="text-white">{dataMode === 'api' ? 'BACKEND API' : 'DEMO SANDBOX'}</strong></span>
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button onClick={() => switchDataMode('demo')} className={`px-2 py-1 rounded cursor-pointer ${dataMode === 'demo' ? 'bg-indigo-650 text-white' : 'text-zinc-500 hover:text-zinc-200'}`}>Demo</button>
            <button onClick={() => switchDataMode('api')} className={`px-2 py-1 rounded cursor-pointer ${dataMode === 'api' ? 'bg-indigo-650 text-white' : 'text-zinc-500 hover:text-zinc-200'}`}>API</button>
          </div>
        </div>

        {/* ACTIVE SIMULATION BANNER */}
        {(simulatedRoleActive || (isApiMode && auth.session?.simulationMode)) && (
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 px-6 py-2.5 shrink-0 text-white flex flex-col sm:flex-row items-center justify-between shadow-inner border-b border-indigo-400/10 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-505"></span>
              </span>
              <span className="font-mono text-xs text-zinc-100">
                <strong>Simulation Mode Active:</strong> Viewing workspace viewport as role: <strong className="text-bold text-indigo-200 underline">{effectiveRole}</strong>. Views, sidebar triggers, metrics and edit rules are synchronized.
              </span>
            </div>
            <button
              onClick={() => {
                setSimulatedRoleActive(null);
                localStorage.removeItem(SIMULATED_ROLE_KEY);
                if (isApiMode) setTimeout(() => auth.refreshSession(), 0);
              }}
              className="bg-indigo-650 hover:bg-zinc-800 border border-indigo-450/40 text-white font-bold text-[10px] px-3.2 py-1 rounded transition-all cursor-pointer font-mono"
            >
              Exit Simulation ✖
            </button>
          </div>
        )}

        {/* Global Systems Alert Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between text-xs text-amber-800 shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-mono">
              <strong>[FDE-ALERT]</strong> {displayedEngagements.filter(e => e.health === 'red').length} account is currently flagged as <strong>CRITICAL RED</strong>.
            </span>
          </div>
          <button 
            onClick={() => navigateTo('/engagements/zenith-health')} 
            className="text-xs text-amber-900 font-bold hover:underline font-mono flex items-center gap-1 cursor-pointer"
          >
            DISPATCH PROTOCOLS <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Dynamic Inner Screens */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 bg-zinc-50/20">
          {pathParts.length === 0 && (
            <CommandCenterPage 
              engagements={displayedEngagements} 
              onNavigate={navigateTo} 
              currentRole={effectiveRole} 
              rolePermissions={rolePermissions} 
              dataMode={dataMode}
              loading={apiEngagements.loading || auth.loading}
              error={apiEngagements.error}
              onRetry={apiEngagements.retry}
            />
          )}

          {pathParts[0] === 'engagements' && (
            <>
              {pathParts[1] === 'new' ? (
                <NewEngagementPage 
                  dataMode={dataMode}
                  onAddEngagement={async (eng, apiPayload) => {
                    if (isApiMode) {
                      const created = await engagementsApi.create(apiPayload);
                      const ui = mapApiEngagementToUi(created);
                      apiEngagements.setEngagements([ui, ...apiEngagements.engagements]);
                      navigateTo(`/engagements/${created._id}`);
                      return;
                    }
                    setEngagements([eng, ...engagements]);
                    navigateTo(`/engagements/${eng.id}`);
                  }}
                  onCancel={() => navigateTo('/engagements')}
                />
              ) : pathParts[1] ? (
                <EngagementDetailPage 
                  engagementId={pathParts[1]} 
                  engagements={displayedEngagements} 
                  dataMode={dataMode}
                  initialTab={pathParts[2]}
                  onUpdateEngagement={async (updated) => {
                    if (isApiMode && updated.backendId) {
                      apiEngagements.setEngagements(apiEngagements.engagements.map(e => e.id === updated.id ? updated : e));
                    } else {
                      setEngagements(engagements.map(e => e.id === updated.id ? updated : e));
                    }
                  }}
                  onBack={() => navigateTo('/engagements')}
                  currentRole={effectiveRole}
                  rolePermissions={rolePermissions}
                />
              ) : (
                <EngagementsListPage 
                  engagements={displayedEngagements} 
                  onNavigate={navigateTo} 
                  currentRole={effectiveRole} 
                  rolePermissions={rolePermissions} 
                  dataMode={dataMode}
                  pendingPlaybook={pendingPlaybook}
                  onCancelPendingPlaybook={() => {
                    setPendingPlaybook(null);
                    navigateTo('/playbooks');
                  }}
                  onInitializePlaybookForEngagement={async (engagementId) => {
                    const playbook = pendingPlaybook;
                    if (!playbook) return;

                    try {
                      if (isApiMode) {
                        const category = readinessCategoryForStage(playbook.stage);
                        const checklistItems = buildPlaybookChecklist(playbook);
                        await Promise.all(checklistItems.map((text) => readinessApi.create(engagementId, {
                          category,
                          text,
                          status: 'Not Started',
                          notes: `Initialized from ${playbook.title}.`
                        })));
                        await apiEngagements.retry();
                      } else {
                        const selected = engagements.find((engagement) => engagement.id === engagementId);
                        if (selected) {
                          setEngagements(engagements.map((engagement) => engagement.id === engagementId ? {
                            ...engagement,
                            readiness: engagement.readiness.length ? engagement.readiness : [
                              ...buildPlaybookChecklist(playbook).map((text, index) => ({
                                id: `pb-${Date.now()}-${index}`,
                                category: readinessCategoryForStage(playbook.stage),
                                title: text,
                                checked: false,
                                owner: selected.owner,
                                notes: `Initialized from ${playbook.title}.`
                              }))
                            ]
                          } : engagement));
                        }
                      }
                      setPendingPlaybook(null);
                      navigateTo(`/engagements/${engagementId}/readiness`);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'Unable to initialize playbook for this engagement.');
                    }
                  }}
                  loading={apiEngagements.loading}
                  error={apiEngagements.error}
                  onRetry={apiEngagements.retry}
                />
              )}
            </>
          )}

          {pathParts[0] === 'product-intelligence' && (
            <ProductIntelligencePage engagements={displayedEngagements} onNavigate={navigateTo} dataMode={dataMode} />
          )}

          {pathParts[0] === 'playbooks' && (
            <PlaybooksPage 
              onNavigate={navigateTo} 
              onInitializePlaybook={(playbook) => {
                setPendingPlaybook(playbook);
                navigateTo('/engagements');
              }}
            />
          )}

          {pathParts[0] === 'settings' && (
            <SettingsPage 
              users={users}
              setUsers={setUsers}
              permissions={permissions}
              setPermissions={setPermissions}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ====================================================
// SCREEN 1: LANDING / COMMAND CENTER DASHBOARD
// ====================================================
function CommandCenterPage({ 
  engagements, 
  onNavigate,
  currentRole,
  rolePermissions,
  dataMode,
  loading,
  error,
  onRetry
}: { 
  engagements: Engagement[]; 
  onNavigate: (p: string) => void;
  currentRole: string;
  rolePermissions: any;
  dataMode?: 'demo' | 'api';
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    if (dataMode !== 'api') return;
    dashboardApi.summary().then(setDashboard).catch(() => undefined);
  }, [dataMode, engagements.length]);

  // KPI calculations
  const totalDeployments = dashboard?.activeDeployments ?? engagements.length;
  const atRiskAccounts = dashboard?.atRiskAccounts ?? engagements.filter(e => e.health === 'red').length;
  const openCommitmentsCount = dashboard?.openCommitments ?? engagements.reduce((sum, e) => sum + e.commitments.filter(c => c.status === 'Open').length, 0);
  const feedbackSignalsCount = dashboard?.productSignalsCaptured ?? engagements.reduce((sum, e) => sum + e.productSignals.length, 0);

  // Avg Readiness progress percentage
  const avgReadinessPct = useMemo(() => {
    let sum = 0;
    engagements.forEach(e => {
      const checked = e.readiness.filter(r => r.checked).length;
      const total = e.readiness.length || 1;
      sum += (checked / total) * 100;
    });
    return dashboard?.avgStageProgress ?? Math.round(sum / (totalDeployments || 1));
  }, [engagements, totalDeployments, dashboard]);

  // Aggregate active risks
  const criticalRisks = useMemo(() => {
    return engagements.flatMap(e => e.risks.filter(r => r.severity === 'High' && r.status === 'Open').map(r => ({ ...r, customerName: e.customer, clientSlug: e.id })));
  }, [engagements]);

  // Recent system signals log
  const recentProductUpdates = useMemo(() => {
    return engagements.flatMap(e => e.productSignals.map(s => ({ ...s, customerName: e.customer })));
  }, [engagements]);

  if (loading) return <InlineState icon="loading" title="Loading command center" message="Syncing deployments from the backend API." />;
  if (error) return <InlineState icon="error" title="Backend data unavailable" message={error} onRetry={onRetry} />;

  // Executive Role layout
  if (currentRole === 'Executive') {
    const totalArr = engagements.reduce((sum, e) => {
      const val = parseInt(e.arr.replace(/[^0-9]/g, '')) || 0;
      return sum + val;
    }, 0);
    const formattedArr = `$${(totalArr / 1000).toFixed(1)}k`;

    return (
      <div className="p-6 space-y-6 animate-fade-in" id="executive-dashboard">
        {/* Executive Banner */}
        <div className="bg-gradient-to-r from-zinc-900 to-indigo-950 p-6 rounded-2xl text-white shadow-md relative overflow-hidden border border-indigo-500/20">
          <div className="relative z-10 space-y-2">
            <span className="bg-indigo-500/20 text-indigo-300 font-mono text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded border border-indigo-400/20">
              Executive Sponsor Viewport
            </span>
            <h1 className="text-xl font-bold font-sans">FDE Portfolio Strategic Status</h1>
            <p className="text-xs text-indigo-200 font-mono">High-altitude financial metrics, portfolio risk thresholds & milestone gateways.</p>
          </div>
          <div className="absolute right-6 bottom-4 text-white opacity-5">
            <ShieldCheck className="w-40 h-40" />
          </div>
        </div>

        {/* Executive Stats Block */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-zinc-200 p-5 rounded-xl">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Tracked ARR portfolio</span>
            <div className="text-2xl font-black text-indigo-750 mt-1 font-sans">$1.12M</div>
            <span className="text-[10px] text-emerald-600 block mt-1 font-mono">✓ 100% Contract Audited</span>
          </div>
          <div className="bg-white border border-rose-100 bg-rose-50/5 p-5 rounded-xl">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Active Threat Factors</span>
            <div className="text-2xl font-black text-rose-600 mt-1 font-sans">{criticalRisks.length} threats</div>
            <span className="text-[10px] text-rose-500 block mt-1 font-mono">⚑ Escalate & Dispatch</span>
          </div>
          <div className="bg-white border border-zinc-200 p-5 rounded-xl">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Average Readiness Phase</span>
            <div className="text-2xl font-black text-zinc-900 mt-1 font-sans">{avgReadinessPct}%</div>
            <span className="text-[10px] text-indigo-400 block mt-1 font-mono">❖ Phase 4 Gate Checks</span>
          </div>
          <div className="bg-white border border-zinc-200 p-5 rounded-xl">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Pending Commitments</span>
            <div className="text-2xl font-black text-zinc-900 mt-1 font-sans">{openCommitmentsCount} items</div>
            <span className="text-[10px] text-zinc-500 block mt-1 font-mono">✓ SLA Guarantee Active</span>
          </div>
        </div>

        <Charts engagements={engagements} />

        {/* Strategic Roadmap List */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-650" /> Strategic Portfolio Roadmap Summary
          </h3>
          <div className="space-y-3">
            {engagements.map(e => (
              <div key={e.id} className="flex flex-col md:flex-row md:items-center justify-between p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl gap-4 hover:border-zinc-300 transition-colors cursor-pointer" onClick={() => onNavigate(`/engagements/${e.id}`)}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-zinc-900">{e.customer}</span>
                    <span className={`px-2 py-0.2 rounded text-[9px] uppercase font-bold border ${HEALTH_COLORS[e.health]}`}>{e.health}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 max-w-xl">{e.objective}</p>
                </div>
                <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0">
                  <span className="text-xs font-bold text-zinc-900">{e.arr} ARR</span>
                  <span className="text-[10px] text-zinc-400 font-mono mt-0.5">Stage: {e.stage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // FDE Local Assignments Filter
  const filterFDEOnly = currentRole === 'FDE';
  const displayEngagements = filterFDEOnly 
    ? engagements.filter(e => e.id === 'acme-logistics' || e.id === 'helios-energy') 
    : engagements;

  return (
    <div className="p-6 space-y-6 animate-fade-in" id="command-center-canvas">
      {/* Simulation Blue Banner for FDE */}
      {filterFDEOnly && (
        <div className="bg-indigo-50 border border-indigo-200/80 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-indigo-900 font-mono">
            <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span><strong>FDE Workspace:</strong> Showing accounts assigned to field agent <strong>Alex Carver</strong>.</span>
          </div>
          <span className="text-[10px] font-mono text-indigo-500 font-semibold uppercase tracking-wider">// DEFAULT VIEWPORT</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-zinc-900">Deployment Command Center</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">FDE Operations, KPI Metrics & Cross-Cluster Accountability Ecosystem</p>
        </div>
        {rolePermissions?.engagements?.create && (
          <button
            onClick={() => onNavigate('/engagements/new')}
            className="bg-zinc-900 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-zinc-800 transition-all cursor-pointer shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" /> New Customer Engagement
          </button>
        )}
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { title: 'Active Deployments', val: displayEngagements.length, subtitle: 'Operational' },
          { title: 'At-Risk Accounts', val: displayEngagements.filter(e => e.health === 'red').length, subtitle: 'Urgent Red Alert', highlight: displayEngagements.filter(e => e.health === 'red').length > 0 },
          { title: 'Open Commitments', val: displayEngagements.reduce((sum, e) => sum + e.commitments.filter(c => c.status === 'Open').length, 0), subtitle: 'Ledger items' },
          { title: 'Product Signals', val: displayEngagements.reduce((sum, e) => sum + e.productSignals.length, 0), subtitle: 'Field updates' },
          { title: 'Avg. Readiness Progress', val: `${avgReadinessPct}%`, subtitle: 'SLA check cleared' }
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-white rounded-xl border p-4.5 shadow-sm transition-all flex flex-col justify-between ${
            kpi.highlight ? 'border-rose-100 bg-rose-50/5' : 'border-zinc-200/80'
          }`}>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{kpi.title}</span>
              <div className="text-2xl font-black text-zinc-900 mt-1 font-sans">{kpi.val}</div>
            </div>
            <span className={`text-[10px] font-mono mt-1 ${kpi.highlight ? 'text-rose-600' : 'text-zinc-400'}`}>❖ {kpi.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Embedded Chart Section */}
      <Charts engagements={displayEngagements} />

      {/* Table of Active customer engagements */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-650">Active Customer Engagements</h3>
              <button onClick={() => onNavigate('/engagements')} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer">
                View Directory →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-serif text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 font-mono text-[9px] uppercase text-zinc-500">
                    <th className="p-3 font-semibold text-[10px]">Customer</th>
                    <th className="p-3 font-semibold text-[10px]">Stage</th>
                    <th className="p-3 font-semibold text-[10px]">Health</th>
                    <th className="p-3 font-semibold text-[10px]">FDE Owner</th>
                    <th className="p-3 font-semibold text-[10px]">Next Milestone</th>
                    <th className="p-3 font-semibold text-[10px] text-center">Open Blocks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-sans text-zinc-700">
                  {displayEngagements.map((eng) => (
                    <tr 
                      key={eng.id} 
                      className="hover:bg-zinc-50/50 transition-colors cursor-pointer"
                      onClick={() => onNavigate(`/engagements/${eng.id}`)}
                    >
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 text-xs flex items-center gap-1">
                            {eng.customer} <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 mt-0.5">{eng.industry}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border font-mono font-bold ${STAGE_COLORS[eng.stage]}`}>
                          {eng.stage}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${HEALTH_COLORS[eng.health]}`}>
                          {eng.health}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] font-semibold text-zinc-600">{eng.owner.split(' ')[0]}</td>
                      <td className="p-3 font-sans font-semibold text-[11px] truncate max-w-xs">{eng.nextMilestone}</td>
                      <td className="p-3 text-center">
                        <span className={`font-mono text-xs font-bold leading-none px-1.5 py-0.5 rounded ${
                          eng.blockers.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-zinc-100 text-zinc-400'
                        }`}>
                          {eng.blockers.length}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right side Critical Risks widgets */}
        <div className="space-y-6">
          {/* Risks list */}
          <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Critical Threat Alert Board</h4>
            <div className="space-y-3">
              {(filterFDEOnly ? criticalRisks.filter(r => r.clientSlug === 'acme-logistics' || r.clientSlug === 'helios-energy') : criticalRisks).slice(0, 3).map((risk, idx) => (
                <div 
                  key={idx} 
                  className="p-3 border border-rose-200 bg-rose-50/5 hover:bg-rose-50/10 rounded-lg cursor-pointer transition-all"
                  onClick={() => onNavigate(`/engagements/${risk.clientSlug}`)}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-black text-zinc-900">{risk.customerName}</span>
                    <span className="text-[9px] font-mono font-bold bg-rose-100 text-rose-700 px-1 py-0.5 rounded uppercase">HIGH</span>
                  </div>
                  <p className="text-xs font-bold text-rose-950 truncate">{risk.title}</p>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1">Mitigation: {risk.mitigation}</p>
                </div>
              ))}
              {((filterFDEOnly ? criticalRisks.filter(r => r.clientSlug === 'acme-logistics' || r.clientSlug === 'helios-energy') : criticalRisks)).length === 0 && (
                <p className="text-xs text-zinc-400 font-mono py-2 text-center">No active high threats. Pipeline safe 🟢</p>
              )}
            </div>
          </div>

          {/* Product Signals Widget */}
          <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Captured Field Signals</h4>
            <div className="space-y-2.5">
              {(filterFDEOnly ? recentProductUpdates.filter(s => s.customerName === 'Acme Logistics' || s.customerName === 'Helios Energy') : recentProductUpdates).slice(0, 3).map((sig, idx) => (
                <div key={idx} className="text-xs border-b border-zinc-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-zinc-800">{sig.theme}</span>
                    <span className="text-[9px] font-mono text-zinc-400 uppercase">{sig.customerName}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 italic truncate font-mono">"{sig.evidence}"</p>
                </div>
              ))}
              <button 
                onClick={() => onNavigate('/product-intelligence')} 
                className="w-full text-center bg-zinc-50 border border-zinc-200/60 p-2 text-xs font-bold text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Inspect Corporate Field Signals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================
// SCREEN 2: ENGAGEMENTS LIST PAGE
// ====================================================
function EngagementsListPage({ 
  engagements, 
  onNavigate,
  currentRole,
  rolePermissions,
  dataMode,
  pendingPlaybook,
  onCancelPendingPlaybook,
  onInitializePlaybookForEngagement,
  loading,
  error,
  onRetry
}: { 
  engagements: Engagement[]; 
  onNavigate: (p: string) => void;
  currentRole: string;
  rolePermissions: any;
  dataMode?: 'demo' | 'api';
  pendingPlaybook?: Playbook | null;
  onCancelPendingPlaybook?: () => void;
  onInitializePlaybookForEngagement?: (engagementId: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [healthFilter, setHealthFilter] = useState<string>('All');
  const [fdeFilterMe, setFdeFilterMe] = useState(currentRole === 'FDE');

  // Sync state if role changed from dropdown
  useEffect(() => {
    setFdeFilterMe(currentRole === 'FDE');
  }, [currentRole]);

  const filteredEngagements = useMemo(() => {
    return engagements.filter((eng) => {
      // If FDE simulator list-only filter is checked, restrict to their accounts
      if (dataMode !== 'api' && fdeFilterMe && eng.id !== 'acme-logistics' && eng.id !== 'helios-energy') {
        return false;
      }
      const matchesSearch = eng.customer.toLowerCase().includes(search.toLowerCase()) || 
                            eng.industry.toLowerCase().includes(search.toLowerCase()) || 
                            eng.owner.toLowerCase().includes(search.toLowerCase());
      const matchesStage = stageFilter === 'All' || eng.stage === stageFilter;
      const matchesHealth = healthFilter === 'All' || eng.health === healthFilter;
      return matchesSearch && matchesStage && matchesHealth;
    });
  }, [engagements, search, stageFilter, healthFilter, fdeFilterMe, dataMode]);

  if (loading) return <InlineState icon="loading" title="Loading engagement directory" message="Fetching customer workspaces from the backend." />;
  if (error) return <InlineState icon="error" title="Could not load engagements" message={error} onRetry={onRetry} />;

  const openEngagement = async (engagementId: string) => {
    if (pendingPlaybook && onInitializePlaybookForEngagement) {
      await onInitializePlaybookForEngagement(engagementId);
      return;
    }
    onNavigate(`/engagements/${engagementId}`);
  };

  return (
    <div className="p-6 space-y-6" id="engagements-list-canvas">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-zinc-900">Engagement Workspaces</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">Isolated customer pipelines, deployments checklist metrics & intelligence briefs</p>
        </div>
        {rolePermissions?.engagements?.create && (
          <button
            onClick={() => onNavigate('/engagements/new')}
            className="bg-zinc-900 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-zinc-800 transition-all cursor-pointer shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" /> New Customer
          </button>
        )}
      </div>

      {pendingPlaybook && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-xs text-indigo-900 font-mono flex flex-col md:flex-row md:items-center justify-between gap-2">
          <span><strong>Playbook Initialization:</strong> Select an engagement to initialize <strong>{pendingPlaybook.title}</strong>.</span>
          <button onClick={onCancelPendingPlaybook} className="text-indigo-700 font-bold hover:underline cursor-pointer">Cancel</button>
        </div>
      )}

      {/* Filter controllers strip */}
      <div className="bg-white rounded-xl border border-zinc-200/80 p-4 shadow-sm flex flex-col md:flex-row gap-3.5 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-indigo-500 focus:bg-white transition-all"
            placeholder="Search customer, industry or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {currentRole === 'FDE' && dataMode !== 'api' && (
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-650 select-none cursor-pointer border border-indigo-100 bg-indigo-50/50 px-2.5 py-1.5 rounded-lg">
              <input
                type="checkbox"
                checked={fdeFilterMe}
                onChange={(e) => setFdeFilterMe(e.target.checked)}
                className="rounded text-indigo-650 focus:ring-indigo-550 h-3.5 w-3.5"
              />
              <span>My Assignments Only (Alex Carver)</span>
            </label>
          )}

          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-lg text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select 
              className="bg-transparent text-zinc-700 outline-none cursor-pointer"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="All">All Stages</option>
              <option value="Discovery">Discovery</option>
              <option value="Workflow Mapping">Workflow Mapping</option>
              <option value="Technical Scoping">Technical Scoping</option>
              <option value="Prototype">Prototype</option>
              <option value="Validation">Validation</option>
              <option value="Production Hardening">Hardening</option>
              <option value="Handoff">Handoff</option>
              <option value="Expansion">Expansion</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-lg text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <select 
              className="bg-transparent text-zinc-700 outline-none cursor-pointer"
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
            >
              <option value="All">All Health</option>
              <option value="green">Green (SLA Cleared)</option>
              <option value="yellow">Yellow (Blocked)</option>
              <option value="red">Red (Critical Threat)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of engagements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEngagements.map((eng) => {
          const finishedChecks = eng.readiness.filter(r => r.checked).length;
          const totalChecks = eng.readiness.length || 1;
          const pct = Math.round((finishedChecks / totalChecks) * 100);

          return (
            <div 
              key={eng.id}
              onClick={() => openEngagement(eng.id)}
              className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-zinc-900 text-sm">{eng.customer}</h3>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide mt-0.5">{eng.industry}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${HEALTH_COLORS[eng.health]}`}>
                    {eng.health}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold font-mono border ${STAGE_COLORS[eng.stage]}`}>
                    {eng.stage}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400">ARR: {eng.arr}</span>
                </div>

                {/* Blocker Alert Banner inside card */}
                {eng.blockers.length > 0 && (
                  <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-rose-950 font-bold leading-none truncate">Active blocker reported:</p>
                      <p className="text-[10px] text-rose-800 leading-normal truncate mt-1">"{eng.currentBlocker}"</p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-zinc-500 leading-relaxed font-sans line-clamp-2">
                  {eng.objective}
                </p>
              </div>

              {/* Progress and indicators bar footer */}
              <div className="pt-4 border-t border-zinc-100 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>Readiness Checklists</span>
                  <span className="font-bold text-zinc-700">{pct}% ({finishedChecks}/{totalChecks})</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all" style={{ width: `${pct}%` }}></div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
                  <span>Owner: <strong>{eng.owner.split(' ')[0]}</strong></span>
                  <span>Sync: {eng.lastUpdated}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEngagements.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-dashed border-zinc-200 p-12 text-center text-zinc-400">
            <Layers className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
            <p className="text-sm font-sans font-medium">No customer engagements match search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ====================================================
// SCREEN 3: ENGAGEMENT DETAILS HUB ROUTER
// ====================================================
function EngagementDetailPage({ 
  engagementId, 
  engagements, 
  onUpdateEngagement, 
  onBack,
  currentRole,
  rolePermissions,
  dataMode,
  initialTab
}: { 
  engagementId: string; 
  engagements: Engagement[]; 
  onUpdateEngagement: (updated: Engagement) => void | Promise<void>;
  onBack: () => void;
  currentRole: string;
  rolePermissions: any;
  dataMode?: 'demo' | 'api';
  initialTab?: string;
}) {
  const detail = useEngagementDetail(dataMode === 'api', engagementId);
  const currentEng = dataMode === 'api' ? detail.engagement : engagements.find(e => e.id === engagementId);

  if (dataMode === 'api' && detail.loading) {
    return <InlineState icon="loading" title="Loading engagement workspace" message="Fetching workspace records, ledgers, risks, readiness, notes, and updates." />;
  }

  if (dataMode === 'api' && detail.error) {
    return <InlineState icon="error" title="Could not load workspace" message={detail.error} onRetry={detail.retry} />;
  }

  if (!currentEng) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold">Engagement Workspace Not Found</h2>
        <button onClick={onBack} className="text-indigo-650 hover:underline">
          Return to directory
        </button>
      </div>
    );
  }

  const handleUpdate = (updated: Engagement) => {
    if (dataMode === 'api') {
      detail.setEngagement(updated);
    }
    onUpdateEngagement(updated);
  };

  return (
    <div className="flex flex-col flex-1" id="engagement-details-hub">
      {/* Sub Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3.5">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 cursor-pointer"
            title="Back to directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900 font-sans">{currentEng.customer}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${HEALTH_COLORS[currentEng.health]}`}>
                {currentEng.health}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${STAGE_COLORS[currentEng.stage]}`}>
                {currentEng.stage}
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-400 mt-0.5">Primary Director Owner: {currentEng.owner}</p>
          </div>
        </div>
      </div>

      {/* Render modular tab views */}
      <WorkspaceTabs 
        engagement={currentEng} 
        onUpdateEngagement={handleUpdate} 
        currentRole={currentRole} 
        rolePermissions={rolePermissions} 
        dataMode={dataMode}
        onRefreshEngagement={detail.retry}
        initialTab={initialTab}
      />
    </div>
  );
}

// ====================================================
// SCREEN 4: NEW ENGAGEMENT PAGE
// ====================================================
function NewEngagementPage({ 
  onAddEngagement, 
  onCancel,
  dataMode
}: { 
  onAddEngagement: (eng: Engagement, apiPayload: any) => void | Promise<void>;
  onCancel: () => void;
  dataMode?: 'demo' | 'api';
}) {
  const [customer, setCustomer] = useState('');
  const [industry, setIndustry] = useState('Supply Chain & Logistics');
  const [arr, setArr] = useState('$150,000');
  const [owner, setOwner] = useState('Sarah Connor (Senior FDE)');
  const [objective, setObjective] = useState('');
  const [problem, setProblem] = useState('');
  const [stage, setStage] = useState<DeploymentStage>('Discovery');
  const [health, setHealth] = useState<DeploymentHealth>('green');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !objective || !problem) return;

    const id = customer.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newDoc: Engagement = {
      id,
      customer,
      industry,
      arr,
      stage,
      health,
      owner,
      objective,
      problem,
      workflow: 'Custom workflow pipeline mapping in progress.',
      metric: 'Define evaluation success indicators targets.',
      lastUpdated: new Date().toISOString().split('T')[0],
      executiveSummary: `Newly bootstrapped AI engagement workspace for ${customer}. Currently holding Discovery synchronization milestones.`,
      stakeholders: [],
      systems: [],
      timeline: [
        { date: new Date().toISOString().split('T')[0], stage: 'Discovery', note: 'Account workspace booked securely.', achieved: true }
      ],
      currentBlocker: 'None reported.',
      nextMilestone: 'Hold Discovery Workshop call to draft scope variables.',
      blockers: [],
      commitments: [],
      risks: [],
      productSignals: [],
      readiness: [
        { id: 're-new-1', category: 'Business Readiness', title: 'Schedule corporate kickoff stakeholder call', checked: false, owner, notes: '' },
        { id: 're-new-2', category: 'Data Readiness', title: 'Define data transmission compliance protocols', checked: false, owner, notes: '' }
      ],
      notesHistory: [],
      statusUpdates: []
    };

    const apiPayload = {
      customerName: customer,
      industry,
      opportunitySize: Number(arr.replace(/[^0-9]/g, '')) || 0,
      fdeOwnerName: owner,
      primaryObjective: objective,
      businessProblem: problem,
      deploymentStage: stage,
      health: health === 'red' ? 'Red' : health === 'yellow' ? 'Yellow' : 'Green',
      targetWorkflow: newDoc.workflow,
      successMetric: newDoc.metric,
      currentBlocker: newDoc.currentBlocker,
      nextMilestone: newDoc.nextMilestone,
      executiveSummary: newDoc.executiveSummary
    };

    setSaving(true);
    setError(null);
    try {
      await onAddEngagement(newDoc, apiPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create engagement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6" id="new-engagement-canvas">
      <div>
        <h1 className="text-xl font-bold font-sans tracking-tight text-zinc-900">Provision Engagement Workspace</h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">Establish isolated workspace logs and default ledger matrices</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg px-3 py-2 text-xs font-mono">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Company / Customer Name</label>
            <input
              type="text"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-850 focus:outline-indigo-500 focus:bg-white"
              placeholder="e.g. Acme Logistics"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Industry Sector</label>
            <select
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-850 focus:outline-indigo-500 focus:bg-white"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Healthcare & Pharma">Healthcare & Pharma</option>
              <option value="Heavy Industry & Manufacturing">Heavy Industry & Manufacturing</option>
              <option value="Consumer Retail">Consumer Retail</option>
              <option value="Energy & Utilities">Energy & Utilities</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Contract Value / Opportunity Size</label>
            <input
              type="text"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-855 focus:outline-indigo-500 focus:bg-white"
              placeholder="e.g. $150,000"
              value={arr}
              onChange={(e) => setArr(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Primary FDE Lead Owner</label>
            <select
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-850 focus:outline-indigo-500"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            >
              <option value="Sarah Connor (Senior FDE)">Sarah Connor (Senior FDE)</option>
              <option value="Alex Carver (Solutions Architect)">Alex Carver (Solutions Architect)</option>
              <option value="Arjun Mehta (Lead FDE)">Arjun Mehta (Lead FDE)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Initial Deployment Stage</label>
            <select
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-850 focus:outline-indigo-500"
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
            >
              <option value="Discovery">Discovery</option>
              <option value="Workflow Mapping">Workflow Mapping</option>
              <option value="Technical Scoping">Technical Scoping</option>
              <option value="Prototype">Prototype</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">Deployment Health Indicator</label>
            <select
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-850 focus:outline-indigo-500"
              value={health}
              onChange={(e) => setHealth(e.target.value as any)}
            >
              <option value="green">Green (Normal)</option>
              <option value="yellow">Yellow (Blocked)</option>
              <option value="red">Red (Critical Risk Alert)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">Primary Objective & AI Solution Scope</label>
          <textarea
            rows={2}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-855 focus:outline-indigo-500 focus:bg-white resize-none"
            placeholder="Describe what model is being deployed and why, e.g. Integrate custom fine-tuned LLM classifier to categorize alert feeds..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">Core Operational Problem / Pain Case</label>
          <textarea
            rows={2}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-855 focus:outline-indigo-500 focus:bg-white resize-none"
            placeholder="Describe the main manual backlog drivers wasting customer staff resources..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-200 hover:bg-zinc-350 text-zinc-700 text-xs rounded-lg font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-zinc-950 hover:bg-zinc-850 text-white text-xs rounded-lg font-bold cursor-pointer"
          >
            {saving ? 'Building...' : dataMode === 'api' ? 'Build API Workspace' : 'Build Workspace'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ====================================================
// SCREEN 5: PRODUCT INTELLIGENCE AGGREGATE PAGE
// ====================================================
function ProductIntelligencePage({ engagements, onNavigate, dataMode }: { engagements: Engagement[]; onNavigate: (p: string) => void; dataMode?: 'demo' | 'api' }) {
  const [briefPushed, setBriefPushed] = useState(false);
  const [apiThemes, setApiThemes] = useState<ProductThemeAggregate[] | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (dataMode !== 'api') return;
    Promise.all([dashboardApi.productIntelligence(), productSignalsApi.listAll()])
      .then(([themes]) => setApiThemes(themes.map(mapProductThemeToUi)))
      .catch((err) => setApiError(err instanceof Error ? err.message : 'Unable to load product intelligence'));
  }, [dataMode]);

  const themes = dataMode === 'api' ? (apiThemes ?? []) : AGGREGATE_PRODUCT_THEMES;

  return (
    <div className="p-6 space-y-6" id="product-intel-canvas">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-zinc-900">Product Field Intelligence</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">Aggregated field feedback, ARR-impacted loops & engineering task recommendations</p>
        </div>
        <button
          onClick={() => {
            setBriefPushed(true);
            alert('Corporate FDE Product Brief summary created and dispatched to Jira/Linear backlog queue!');
          }}
          disabled={briefPushed}
          className="bg-zinc-900 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-zinc-800 disabled:bg-zinc-200 transition-all cursor-pointer shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{briefPushed ? 'Brief Transmitted ✓' : 'Generate Product Brief'}</span>
        </button>
      </div>

      {apiError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-3 text-xs font-mono">
          {apiError}
        </div>
      )}

      {/* Aggregate themes cards */}
      <div className="grid grid-cols-1 gap-6">
        {themes.map((theme, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-zinc-800">{theme.theme}</h4>
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] uppercase px-1.5 py-0.5 rounded font-bold font-mono">
                    Type: {theme.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono text-zinc-400">
                  <span>Customers Impacted:</span>
                  <div className="flex gap-1">
                    {theme.customersAffected.map((c, i) => (
                      <span key={i} className="text-zinc-650 bg-zinc-50 border border-zinc-100 px-1 py-0.5 rounded font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-left md:text-right">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-0.5">ARR Exposure</span>
                <span className="text-base font-black text-emerald-600 font-sans tracking-tight">{theme.arrImpacted}</span>
              </div>
            </div>

            {/* Direct evidence files */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Field Feedback Testimony Snippets</span>
              <div className="max-h-36 overflow-y-auto space-y-2">
                {theme.evidenceSnippets.map((snippet, sIdx) => (
                  <p key={sIdx} className="text-xs text-zinc-650 italic font-mono bg-zinc-50 border border-zinc-100/60 p-2.5 rounded-lg leading-relaxed">
                    "{snippet}"
                  </p>
                ))}
              </div>
            </div>

            {/* AI Action recommendation */}
            <div className="bg-indigo-50/15 border border-indigo-100 p-4 rounded-xl">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[10px] font-mono text-indigo-700 font-bold uppercase tracking-wider">AI Engineering Action</span>
              </div>
              <p className="text-xs text-zinc-800 leading-relaxed font-semibold pl-1.5 border-l-2 border-indigo-500">
                {theme.suggestedAction}
              </p>
            </div>
          </div>
        ))}
        {themes.length === 0 && dataMode === 'api' && !apiError && (
          <div className="bg-white rounded-xl border border-dashed border-zinc-200 p-10 text-center text-zinc-400 font-mono text-xs">
            No product intelligence has been captured yet. Run Notes Intelligence inside a workspace to populate this board.
          </div>
        )}
      </div>
    </div>
  );
}

function InlineState({ icon, title, message, onRetry }: { icon: 'loading' | 'error'; title: string; message: string; onRetry?: () => void }) {
  return (
    <div className="p-12 flex items-center justify-center flex-1">
      <div className="bg-white rounded-xl border border-zinc-200/80 p-8 shadow-sm text-center max-w-md">
        {icon === 'loading' ? (
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
        ) : (
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
        )}
        <h2 className="text-sm font-bold text-zinc-900">{title}</h2>
        <p className="text-xs text-zinc-500 font-mono mt-1 leading-relaxed">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-4 bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-zinc-800 cursor-pointer">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// ====================================================
// SCREEN 6: PLAYBOOKS DIRECTORY PAGE
// ====================================================
function PlaybooksPage({ onNavigate, onInitializePlaybook }: { onNavigate: (p: string) => void; onInitializePlaybook: (playbook: Playbook) => void }) {
  return (
    <div className="p-6 space-y-6" id="playbooks-canvas">
      <div>
        <h1 className="text-xl font-bold font-sans tracking-tight text-zinc-900">Standardized FDE Playbooks</h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">Repeatable operational blueprints, diagnostic criteria checklists & core documentation runbooks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLAYBOOKS.map((play) => (
          <div key={play.id} className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-700 leading-none mb-1.5">{play.stage} Blueprints</h4>
                  <h3 className="text-sm font-black text-zinc-900">{play.title}</h3>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{play.description}</p>

              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase block tracking-wider mb-1.5">Mandatory outputs for stage exit:</span>
                <div className="space-y-1.5">
                  {play.requiredOutputs.map((out, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-zinc-750">
                      <CornerDownRight className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-400">({play.checklistCount} mandatory checkpoints)</span>
              <button 
                onClick={() => onInitializePlaybook(play)}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Initialize Playbook
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ====================================================
// SCREEN 7: SYSTEM CONFIG / SETTINGS PAGE
// ====================================================
function SettingsPage({
  users,
  setUsers,
  permissions,
  setPermissions
}: {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  permissions: Record<UserRole, RolePermissions>;
  setPermissions: React.Dispatch<React.SetStateAction<Record<UserRole, RolePermissions>>>;
}) {
  const [subTab, setSubTab] = useState<'preferences' | 'users' | 'roles'>('users');
  const [org, setOrg] = useState('Antigravity B2B AI Technologies');
  const [threshold, setThreshold] = useState('0.75');

  // New simulated user input states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('FDE');
  const [showAddForm, setShowAddForm] = useState(false);

  // Active matrix edit target role
  const [matrixRole, setMatrixRole] = useState<UserRole>('FDE');

  // Handle visual permission edits
  const handleTogglePermission = (role: UserRole, group: keyof RolePermissions, action: string) => {
    if (role === 'Admin') return; // protected and immutable
    setPermissions(prev => {
      const roleCopy = { ...prev[role] };
      const groupCopy = { ...roleCopy[group] } as any;
      groupCopy[action] = !groupCopy[action];
      return {
        ...prev,
        [role]: {
          ...roleCopy,
          [group]: groupCopy
        }
      };
    });
  };

  // Add sub custom simulated user helper
  const handleAddTeammate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const id = `u-${Date.now()}`;
    const newUser: User = {
      id,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      avatar: newUserName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      status: 'Active'
    };

    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddForm(false);
  };

  // Toggle single user status Active / Inactive
  const handleToggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        if (u.role === 'Admin') return u; // secure admin
        return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return u;
    }));
  };

  // Matrix Metadata configuration for scannable nested rows
  const permissionGroups: { key: keyof RolePermissions; title: string; actions: string[] }[] = [
    { key: 'engagements', title: 'Engagements Core', actions: ['view', 'create', 'edit'] },
    { key: 'notesIntelligence', title: 'Notes Intelligence Extraction', actions: ['view', 'extract', 'approve'] },
    { key: 'commitments', title: 'Commitment Ledger', actions: ['view', 'create', 'edit'] },
    { key: 'risksBlockers', title: 'Risks & Blockers Tracker', actions: ['view', 'create', 'edit'] },
    { key: 'productSignals', title: 'Product Feedback Board', actions: ['view', 'create', 'edit'] },
    { key: 'readiness', title: 'Technical SLA Readiness Checklist', actions: ['view', 'check', 'edit'] },
    { key: 'statusUpdates', title: 'Status Reports Generation', actions: ['view', 'create'] },
    { key: 'dashboards', title: 'Dashboards Access Scope', actions: ['commands', 'executive', 'productIntel'] },
    { key: 'administration', title: 'Administration Governance', actions: ['manageRoles', 'manageUsers'] }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" id="settings-canvas">
      <div>
        <h1 className="text-xl font-bold font-sans tracking-tight text-zinc-900">System Governance Settings</h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">Edit simulated workspace limits, maintain active users & customize role security matrices</p>
      </div>

      {/* Internal Navigation Sub-Tabs strip */}
      <div className="flex border-b border-zinc-200 gap-8 text-xs font-mono tracking-wider font-semibold">
        <button
          onClick={() => setSubTab('users')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${subTab === 'users' ? 'border-zinc-900 text-zinc-900 font-black' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
        >
          📂 Active Users Directory ({users.length})
        </button>
        <button
          onClick={() => setSubTab('roles')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${subTab === 'roles' ? 'border-zinc-900 text-zinc-900 font-black' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
        >
          🛡️ Roles & Permissions Matrix
        </button>
        <button
          onClick={() => setSubTab('preferences')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${subTab === 'preferences' ? 'border-zinc-900 text-zinc-900 font-black' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
        >
          ⚙️ Workspace Preferences
        </button>
      </div>

      {subTab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          {/* Header row split */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-800">Workspace User Directory</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Provision simulated FDE directory members to test live viewport limits</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-zinc-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-zinc-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Security Member
            </button>
          </div>

          {/* Add user inline layout */}
          {showAddForm && (
            <form onSubmit={handleAddTeammate} className="bg-zinc-5 border border-zinc-200 rounded-xl p-4 space-y-3 shadow-inner">
              <span className="text-[10px] font-mono text-indigo-650 font-bold uppercase tracking-widest block">Simulated User Provisioning Protocol</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Teammate Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-zinc-200 rounded px-2.5 py-1.5 text-xs focus:outline-indigo-500"
                    placeholder="E.g., Sarah Connor"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Teammate Corporate Email</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white border border-zinc-200 rounded px-2.5 py-1.5 text-xs focus:outline-indigo-500"
                    placeholder="E.g., email@antigravity.ai"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Assigned Security Role</label>
                  <select
                    className="w-full bg-white border border-zinc-200 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  >
                    <option value="FDE">FDE Field Agent</option>
                    <option value="FDE Manager">FDE Operations Manager</option>
                    <option value="Executive">Executive Sponsor</option>
                    <option value="Product Manager">Product PM</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  className="px-3 py-1.5 border border-transparent text-zinc-500 hover:text-zinc-850"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-650 hover:bg-indigo-700 font-bold text-white px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  Confirm Provisioning
                </button>
              </div>
            </form>
          )}

          {/* Directory list sheet */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 font-mono text-[9px] uppercase text-zinc-450 tracking-wider">
                  <th className="p-3.5 font-bold">User Teammate</th>
                  <th className="p-3.5 font-bold">Assigned Role</th>
                  <th className="p-3.5 font-bold">Scope System ID</th>
                  <th className="p-3.5 font-bold">Directory Status</th>
                  <th className="p-3.5 font-bold text-right">Administrative Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-250 flex items-center justify-center font-mono font-bold text-zinc-650 text-xs">
                          {u.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-zinc-900 block leading-tight">{u.name}</span>
                          <span className="text-[10px] text-zinc-400 font-mono mt-0.5">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-zinc-700">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border border-zinc-150 bg-zinc-50/50">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[10px] text-zinc-400">{u.id}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                        u.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : 'bg-zinc-100 text-zinc-400 border-zinc-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]' : 'bg-zinc-400'}`}></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role === 'Admin' ? (
                        <span className="text-[10px] font-mono text-zinc-400 select-none">// Immutable Principal</span>
                      ) : (
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className="bg-zinc-100 font-mono font-bold text-zinc-600 hover:text-zinc-850 hover:bg-zinc-200 text-[10px] px-2.5 py-1 rounded cursor-pointer transition-colors"
                        >
                          Toggle Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'roles' && (
        <div className="space-y-4 animate-fade-in pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-800">Dynamic Security Permissions Matrix</h3>
              <p className="text-[10px] text-zinc-400 font-mono">Select a simulated user role, toggle granular capability switches, and watch downstream views update instantly</p>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1.5 font-bold">Target Matrix Role:</label>
              <select
                className="bg-white border border-zinc-250 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500 font-mono font-bold cursor-pointer"
                value={matrixRole}
                onChange={(e) => setMatrixRole(e.target.value as UserRole)}
              >
                <option value="FDE">FDE Field Agent</option>
                <option value="FDE Manager">FDE Operations Manager</option>
                <option value="Executive">Executive Sponsor</option>
                <option value="Product Manager">Product PM</option>
                <option value="Admin">Admin (Protected Mode)</option>
              </select>
            </div>
          </div>

          {matrixRole === 'Admin' && (
            <div className="bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-500 font-mono">
              ★ <strong>Protected Admin Viewport:</strong> Security principal role <strong>Admin</strong> represents the absolute maximum authority of this software suite. Its capabilities cannot be edited, restricted, or disabled in model simulation mode.
            </div>
          )}

          {/* Matrix table listing */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 font-mono text-[9px] uppercase text-zinc-450 tracking-wider">
                  <th className="p-3.5 font-bold w-1/3">System Area / Component Group</th>
                  <th className="p-3.5 font-bold text-center">View Power</th>
                  <th className="p-3.5 font-bold text-center">Create / Extract Power</th>
                  <th className="p-3.5 font-bold text-center">Edit / Approve Power</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 font-mono select-none">
                {permissionGroups.map((group) => {
                  const rolePerms = permissions[matrixRole] as any;
                  const groupPerms = rolePerms?.[group.key] || {};
                  
                  // Get names corresponding to matrix indexes
                  const viewKey = group.actions[0];
                  const viewVal = groupPerms?.[viewKey];

                  const createKey = group.actions.length > 2 ? group.actions[1] : group.key === 'statusUpdates' ? 'create' : null;
                  const createVal = createKey ? groupPerms?.[createKey] : null;

                  const editKey = group.actions.length > 2 ? group.actions[2] : group.key === 'dashboards' ? 'commands' : group.key === 'administration' ? 'manageRoles' : null;
                  const editVal = editKey ? groupPerms?.[editKey] : null;

                  return (
                    <tr key={group.key} className="hover:bg-zinc-50/40 transition-colors">
                      <td className="p-3.5 font-sans">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-800 leading-tight text-xs">{group.title}</span>
                          <span className="text-[10px] text-zinc-450 mt-0.5 font-mono">key: system.{String(group.key)}</span>
                        </div>
                      </td>
                      
                      {/* View check */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={!!viewVal}
                            disabled={matrixRole === 'Admin'}
                            onChange={() => handleTogglePermission(matrixRole, group.key, viewKey)}
                            className="rounded text-indigo-650 focus:ring-indigo-500 h-4 w-4 disabled:opacity-40 cursor-pointer"
                          />
                        </div>
                      </td>

                      {/* Create/Extract check */}
                      <td className="p-3.5 text-center">
                        {createKey ? (
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={!!createVal}
                              disabled={matrixRole === 'Admin'}
                              onChange={() => handleTogglePermission(matrixRole, group.key, createKey)}
                              className="rounded text-indigo-650 focus:ring-indigo-500 h-4 w-4 disabled:opacity-40 cursor-pointer"
                            />
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-300">// N/A</span>
                        )}
                      </td>

                      {/* Edit/Approve/Commands check */}
                      <td className="p-3.5 text-center">
                        {editKey ? (
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={!!editVal}
                              disabled={matrixRole === 'Admin'}
                              onChange={() => handleTogglePermission(matrixRole, group.key, editKey)}
                              className="rounded text-indigo-650 focus:ring-indigo-500 h-4 w-4 disabled:opacity-40 cursor-pointer"
                            />
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-300">// N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'preferences' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm space-y-5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Corporate Details</h3>
            <div className="grid grid-cols-1 gap-4 font-sans text-xs">
              <div>
                <label className="text-[11px] font-mono text-zinc-650 block mb-1">Corporate Workspace Name</label>
                <input
                  type="text"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-1.5 text-xs text-zinc-805"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-650 block mb-1">FDE Team Members</label>
                <div className="space-y-1.5 mt-1.5">
                  {['Sarah Connor (Senior FDE)', 'Alex Carver (Solutions Architect)', 'Arjun Mehta (Lead FDE)'].map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 bg-zinc-50 border border-zinc-150 rounded font-mono">
                      <span className="font-bold">{p}</span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-205 px-1 rounded uppercase">AUTHORIZED ACTIVE</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">AI Transcription Extraction Settings</h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-zinc-800">Gemini Parsing Vector Cosine Threshold</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Controls strictness when isolating commitment intentions from raw conversations.</p>
                </div>
                <select 
                  className="bg-white border border-zinc-200 rounded p-1 font-mono text-xs cursor-pointer"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                >
                  <option value="0.60 font-mono">0.60 (Loose extraction)</option>
                  <option value="0.75 font-mono">0.75 (Recommended standard)</option>
                  <option value="0.90 font-mono">0.90 (Conservative compliance)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
