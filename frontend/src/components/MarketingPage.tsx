import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Check, X, Menu, ShieldCheck, Sparkles, AlertTriangle, 
  ChevronRight, Layers, Layout, Database, FileText, ClipboardCheck, 
  Activity, Users, TrendingUp, HelpCircle, Inbox, Cpu, Lock, Key, 
  MessageSquare, Settings, Compass, Building, Briefcase, Network,
  Sun, Moon
} from 'lucide-react';

// ====================================================
// TYPES & PERMISSIONS FOR INLINE PREVIEWS
// ====================================================
interface RequestDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ====================================================
// REQUEST DEMO MODAL COMPONENT (MOCK PERSISTED)
// ====================================================
export function RequestDemoModal({ isOpen, onClose }: RequestDemoModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState('5-10');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API delay
    const submission = { name, email, company, role, teamSize, message, timestamp: new Date().toISOString() };
    localStorage.setItem('fdeos_demo_request', JSON.stringify(submission));
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setCompany('');
      setRole('');
      setMessage('');
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in" id="request-demo-modal">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl text-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-sans">Thanks — we'll follow up shortly.</h3>
            <p className="text-zinc-400 text-xs max-w-sm mx-auto font-sans leading-relaxed">
              Our FDE deployment experts will schedule a custom walkthrough session mapped directly to your B2B integration lifecycle.
            </p>
            <button 
              onClick={onClose}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-mono px-5 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              Back to FDE OS
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono font-bold tracking-widest uppercase border border-indigo-500/20 px-2 py-0.5 rounded">
                ENTERPRISE ENGAGEMENT PROTOCOL
              </span>
              <h3 className="text-lg font-bold font-sans mt-2">Request FDE OS Strategic Demo</h3>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Connect your engineering execution directly with enterprise customer deployment parameters.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="E.g., Ryan Gosling"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Work Email</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="E.g., ryan@antigravity.ai"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Company / Team</label>
                <input 
                  type="text" 
                  required 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="E.g., Antigravity AI"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Your Role</label>
                <input 
                  type="text" 
                  required 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="E.g., Head of FDE"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Active deployment FDE team size</label>
                <select 
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                >
                  <option value="1-5">1-5 engineers</option>
                  <option value="5-10">5-10 engineers</option>
                  <option value="10-50">10-50 engineers</option>
                  <option value="50+">50+ structural deployment agents</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Integration challenges / Note</label>
              <textarea 
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-500 text-white resize-none"
                placeholder="Briefly tell us about your current customer deployment tech stack and blockers..."
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-650 hover:bg-indigo-750 font-bold text-white text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              Initialize Demo Dispatch <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ====================================================
// THE MARKETING HOME PAGE RENDERING ENGINE
// ====================================================
interface MarketingPageProps {
  onLoginClick: () => void;
  onDemoClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function MarketingPage({ onLoginClick, onDemoClick, theme, onToggleTheme }: MarketingPageProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const scrollSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans w-full selection:bg-indigo-500 selection:text-white overflow-x-hidden antialiased transition-colors duration-250 ${
      isDark 
        ? 'bg-zinc-950 text-zinc-150' 
        : 'bg-slate-50 text-slate-900 light-mode'
    }`} id="marketing-viewport">
      
      {/* 1. Header Navigation */}
      <MarketingNavbar 
        onScrollTo={scrollSection} 
        onLogin={onLoginClick} 
        onRequestDemo={() => setIsDemoModalOpen(true)} 
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* 2. Main content zones */}
      <main className="flex-1 w-full flex flex-col">
        <HeroSection 
          onRequestDemo={() => setIsDemoModalOpen(true)}
          onTryDemo={onDemoClick}
          onTourClick={() => scrollSection('product-previews')}
        />
        
        <ProblemSection />
        
        <SolutionSection />
        
        <WorkflowSection />
        
        <RoleValueSection />
        
        <ComparisonTable />
        
        <UseCasesSection />
        
        <ProductPreviewSection />
        
        <SecuritySection theme={theme} />
        
        <PricingTeaserSection onRequestDemo={() => setIsDemoModalOpen(true)} />
        
        <FinalCTASection 
          onRequestDemo={() => setIsDemoModalOpen(true)}
          onTryDemo={onDemoClick}
        />
      </main>

      {/* 3. Global Footer */}
      <Footer onScrollTo={scrollSection} />

      {/* 4. Request Demo Overlay Portal */}
      <RequestDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}

// ====================================================
// SUB COMPONENT: NAVBAR
// ====================================================
interface MarketingNavbarProps {
  onScrollTo: (id: string) => void;
  onLogin: () => void;
  onRequestDemo: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

function MarketingNavbar({ onScrollTo, onLogin, onRequestDemo, theme = 'dark', onToggleTheme }: MarketingNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 w-full" id="marketing-navigation-rail">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo block */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center font-bold text-white font-mono shadow-md border border-indigo-500/20">
            F
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-tight font-sans">FDE OS</span>
            <span className="text-[8px] bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-400/20 px-1 py-0.2 rounded ml-1.5 uppercase font-semibold">PILOT v1</span>
          </div>
        </div>

        {/* Links desktop */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide text-zinc-400 font-sans">
          <button onClick={() => onScrollTo('solution-features')} className="hover:text-white transition-colors cursor-pointer">Product</button>
          <button onClick={() => onScrollTo('use-cases')} className="hover:text-white transition-colors cursor-pointer">Use Cases</button>
          <button onClick={() => onScrollTo('role-views')} className="hover:text-white transition-colors cursor-pointer">Roles</button>
          <button onClick={() => onScrollTo('security-governance')} className="hover:text-white transition-colors cursor-pointer">Security</button>
          <button onClick={() => onScrollTo('pricing-teaser')} className="hover:text-white transition-colors cursor-pointer">Pricing</button>
        </div>

        {/* CTA Buttons desktop */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
          {onToggleTheme && (
            <button 
              onClick={onToggleTheme}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button 
            onClick={onLogin} 
            className="text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 px-4 py-2 rounded-lg transition-colors cursor-pointer font-bold"
          >
            Sign In to Workspace
          </button>
          <button 
            onClick={onRequestDemo}
            className="bg-zinc-100 text-zinc-950 hover:bg-white px-4 py-2 rounded-lg transition-all font-bold cursor-pointer font-mono"
          >
            Request Demo
          </button>
        </div>

        {/* Hamburger Mobile */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav expand */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-900 bg-zinc-950 px-6 py-6 space-y-4">
          <div className="flex flex-col gap-4 text-sm text-zinc-400 font-sans">
            <button onClick={() => { onScrollTo('solution-features'); setMobileOpen(false); }} className="text-left py-1.5 hover:text-white">Product</button>
            <button onClick={() => { onScrollTo('use-cases'); setMobileOpen(false); }} className="text-left py-1.5 hover:text-white">Use Cases</button>
            <button onClick={() => { onScrollTo('role-views'); setMobileOpen(false); }} className="text-left py-1.5 hover:text-white">Roles</button>
            <button onClick={() => { onScrollTo('security-governance'); setMobileOpen(false); }} className="text-left py-1.5 hover:text-white">Security</button>
            <button onClick={() => { onScrollTo('pricing-teaser'); setMobileOpen(false); }} className="text-left py-1.5 hover:text-white">Pricing</button>
          </div>
          <div className="h-px bg-zinc-900 my-4"></div>
          <div className="flex flex-col gap-3 font-mono text-xs">
            {onToggleTheme && (
              <button 
                onClick={() => { onToggleTheme(); setMobileOpen(false); }}
                className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 border ${
                  isDark 
                    ? 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-855' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-650" />}
                <span>{isDark ? "Enable Light Theme" : "Enable Dark Theme"}</span>
              </button>
            )}
            <button onClick={() => { onLogin(); setMobileOpen(false); }} className="w-full text-center text-zinc-300 border border-zinc-800 bg-zinc-900 py-2.5 rounded-lg">
              Sign In to Workspace
            </button>
            <button onClick={() => { onRequestDemo(); setMobileOpen(false); }} className="w-full text-center bg-zinc-100 text-zinc-950 py-2.5 rounded-lg font-bold">
              Request Demo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ====================================================
// SUB COMPONENT: HERO SECTION
// ====================================================
interface HeroSectionProps {
  onRequestDemo: () => void;
  onTryDemo: () => void;
  onTourClick: () => void;
}

function HeroSection({ onRequestDemo, onTryDemo, onTourClick }: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center space-y-10" id="hero-marketing-intro">
      
      {/* Target Audience micro tag */}
      <div className="bg-indigo-500/10 border border-indigo-500/25 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider text-indigo-300 flex items-center gap-1.5 animate-pulse">
        <Sparkles className="w-3.5 h-3.5 shrink-0" /> Built for B2B AI teams scaling from founder-led deployment to repeatable FDE execution.
      </div>

      {/* Main Title Headings */}
      <div className="space-y-4 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
          Scale forward-deployed engineering <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-100">
            without losing customer context.
          </span>
        </h1>
        <p className="text-xs sm:text-sm md:text-sm text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed">
          FDE OS turns messy customer notes, deployment work, commitments, blockers, and field feedback into structured execution, leadership visibility, and product roadmap signal.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono w-full sm:w-auto">
        <button 
          onClick={onRequestDemo}
          className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-950 font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          Request Demo
        </button>
        <button 
          onClick={onTryDemo}
          className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 font-bold text-zinc-200 px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          Try Demo Workspace <ArrowRight className="w-4 h-4 text-indigo-400" />
        </button>
        <button 
          onClick={onTourClick}
          className="w-full sm:w-auto font-bold text-zinc-500 hover:text-zinc-300 px-4 py-2 transition-all flex items-center justify-center gap-1 text-[11px] font-mono cursor-pointer"
        >
          View Product Tour ↓
        </button>
      </div>

      {/* MOCK MAPPED WORKFLOW DECK */}
      <div className="w-full max-w-4xl pt-8 relative">
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-75 -z-10 bg-opacity-20 translate-y-12"></div>
        
        {/* Core diagram preview card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 md:p-6 text-left space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="ml-3 font-semibold uppercase text-[10px] text-zinc-500">SYS_VIEWPORT: DEMO COGNITIVE MAP</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest uppercase">// NOTES INTELLIGENCE CORE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Col: Messy Customer Excerpts */}
            <div className="lg:col-span-5 bg-zinc-950 border border-emerald-550/20 rounded-xl p-4 flex flex-col justify-between relative bg-emerald-900/5 select-text font-mono">
              <div className="absolute top-3 right-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] uppercase px-2 py-0.5 rounded font-bold font-mono">
                Incoming Notes Input
              </div>
              <div className="space-y-3 pt-6 text-[11px] text-zinc-400 leading-relaxed font-mono">
                <p className="italic text-zinc-450">// Raw Paste from Slack Sync Call:</p>
                <p className="bg-zinc-900/50 p-2.5 rounded border border-zinc-850">
                  "Sarah: Slack-Sync: Customer says the Zenith Team is block on their FHIR API port setting. We agreed we absolute MUST configure integration firewalls for zenith-health by Friday otherwise pilot goes cold. Also they liked our AI cluster parsing but need custom filters..."
                </p>
                <div className="text-[10px] text-indigo-300 bg-indigo-950/40 p-2 border border-indigo-900/30 rounded">
                  💡 FDE OS parses this raw sequence automatically on submission.
                </div>
              </div>
              <div className="mt-4 pt-3.5 border-t border-zinc-900 text-center text-xs text-zinc-500">
                ⚡ Process Flow Mapping Pipeline →
              </div>
            </div>

            {/* Middle Col: AI Realtime extraction cards */}
            <div className="lg:col-span-2 flex flex-col justify-center items-center gap-4 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-650 flex items-center justify-center font-mono font-black text-white text-xs border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.4)] animate-bounce mt-4">
                AI
              </div>
              <div className="space-y-1 font-mono">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 block">Isolating Vectors</span>
                <span className="text-[10px] text-indigo-300 block font-bold">100% Extracted</span>
              </div>
            </div>

            {/* Right Col: Structured ledger items */}
            <div className="lg:col-span-5 bg-zinc-950 border border-indigo-500/20 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">Structured Elements Ledger</span>
                <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">Ready</span>
              </div>

              {/* Extraction Item 1 */}
              <div className="bg-rose-950/20 border border-rose-500/10 p-2.5 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-rose-400 uppercase">
                  <span>⚐ Risk Tracked</span>
                  <span className="bg-rose-500/10 text-[8px] px-1.5 rounded">High Alert</span>
                </div>
                <p className="text-xs text-zinc-200">Zenith Health FHIR connection firewall block (Friday SLA Goal)</p>
              </div>

              {/* Extraction Item 2 */}
              <div className="bg-indigo-950/20 border border-indigo-500/10 p-2.5 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-indigo-300 uppercase">
                  <span>❖ Commitment Lock</span>
                  <span className="bg-indigo-500/10 text-[8px] px-1.5 rounded">Due Friday</span>
                </div>
                <p className="text-xs text-zinc-200">Configure corporate proxy ingress firewall credentials</p>
              </div>

              {/* Extraction Item 3 */}
              <div className="bg-emerald-950/10 border border-emerald-500/15 p-2.5 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  <span>⚡ Product Feedback</span>
                  <span className="bg-emerald-500/10 text-[8px] px-1.5 rounded">Request Cluster</span>
                </div>
                <p className="text-xs text-zinc-200">Provide custom metrics dashboard filters for AI transcript summaries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: PROBLEM SECTION
// ====================================================
function ProblemSection() {
  const cards = [
    {
      step: "01",
      title: "Scattered Context",
      body: "Deployment parameters are lost across private Slack threads, raw email attachment sheets, docs, CRM files, and unstructured meeting transcripts."
    },
    {
      step: "02",
      title: "Silent Drift",
      body: "Since FDEs make ad-hoc promises directly to their respective customers, core executive managers have zero pipeline auditability on commitments."
    },
    {
      step: "03",
      title: "Risk Blindspots",
      body: "Technical blocker details live inside the deployment codebase. By the time leadership discovers a firewall issue, the project is already behind SLA schedule."
    },
    {
      step: "04",
      title: "Lost Feedback",
      body: "FDEs gather vital field insights about API faults and product gaps, but this feedback gets lost before reaching product managers and engineering leaders."
    },
    {
      step: "05",
      title: "Inconsistent Delivery",
      body: "FDEs write separate updates for different people. Artifact formatting varies, causing information asymmetry and handoff friction."
    }
  ];

  return (
    <section className="bg-zinc-900/40 border-y border-zinc-900 py-20 px-6 w-full" id="problem-canvas">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">THE CORE SYSTEM CHALLLENGE</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            FDE teams scale faster than their operating systems.
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xl mx-auto">
            Traditional project management trackers (like Jira or linear tickets) are made for internal sprint code issues, not high-touch external technical deployments.
          </p>
        </div>

        {/* Problem bento list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <span className="text-xs font-mono font-bold text-zinc-650 block mb-4">{card.step} // GAP</span>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-sans">{card.title}</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-1">{card.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Structured flowchart mapping */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
          <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase block mb-6 text-center">// SYSTEM TRANSITION COGNITIVE PROTOCOL</span>
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
            
            {/* Inputs */}
            <div className="lg:col-span-3 space-y-2 text-center md:text-left">
              <span className="text-[10px] font-mono text-rose-450 font-bold uppercase block">// Messy Inputs</span>
              <div className="p-2.5 bg-zinc-900 rounded-lg text-[10px] font-mono text-zinc-400 border border-rose-500/10">Unsorted Slack Sync transcript snippets</div>
              <div className="p-2.5 bg-zinc-900 rounded-lg text-[10px] font-mono text-zinc-400 border border-rose-500/10">Ambiguous email feature requests</div>
              <div className="p-2.5 bg-zinc-900 rounded-lg text-[10px] font-mono text-zinc-400 border border-rose-500/10">Raw logs and ad-hoc meeting notes</div>
            </div>

            {/* Arrow */}
            <div className="lg:col-span-1 text-center font-mono text-zinc-600 text-sm py-2">➔</div>

            {/* Core engine */}
            <div className="lg:col-span-3 bg-gradient-to-br from-indigo-950 to-zinc-950 border-2 border-indigo-650 rounded-xl p-5 text-center shadow-lg">
              <Cpu className="w-6 h-6 text-indigo-400 mx-auto mb-2 animate-spin" />
              <h5 className="font-bold text-xs font-sans text-white">FDE OS Extraction Core</h5>
              <p className="text-[9px] font-mono text-indigo-305 mt-1 underline">Cosine Parsers & Vector Maps</p>
            </div>

            {/* Arrow */}
            <div className="lg:col-span-1 text-center font-mono text-zinc-600 text-sm py-2">➔</div>

            {/* Outputs */}
            <div className="lg:col-span-3 space-y-2 text-center md:text-left">
              <span className="text-[10px] font-mono text-emerald-450 font-bold uppercase block">// Structured execution</span>
              <div className="p-2.5 bg-zinc-900 rounded-lg text-[10px] font-mono text-zinc-350 border border-emerald-500/10 flex items-center justify-between">
                <span>1. Clean Customer Briefs</span>
                <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-1 rounded">Ok</span>
              </div>
              <div className="p-2.5 bg-zinc-900 rounded-lg text-[10px] font-mono text-zinc-350 border border-emerald-500/10 flex items-center justify-between">
                <span>2. Tracked Commitment Ledger</span>
                <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-1 rounded">Linked</span>
              </div>
              <div className="p-2.5 bg-zinc-900 rounded-lg text-[10px] font-mono text-zinc-350 border border-emerald-500/10 flex items-center justify-between">
                <span>3. Live Deployment Risk Map</span>
                <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-1 rounded">Surfaced</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: SOLUTION SECTION
// ====================================================
function SolutionSection() {
  const cards = [
    {
      icon: <Layout className="w-5 h-5 text-indigo-400" />,
      title: "Engagement Workspace",
      desc: "An isolated command board for each enterprise pilot, tracking operational scopes, goals, and delivery stages."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      title: "Notes Intelligence Extractor",
      desc: "Convert raw transcript copy pastes instantly into highly structured stakeholders, objectives, and parameters."
    },
    {
      icon: <ClipboardCheck className="w-5 h-5 text-indigo-400" />,
      title: "Commitment Ledger",
      desc: "Lock in dates, blockers, and progress states SLA-mapped to individual customer conversations."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-indigo-400" />,
      title: "Deployment Stage Tracker",
      desc: "Standardize active accounts through sequential checklist phases from connectivity checks to full-scale prod."
    },
    {
      icon: <Activity className="w-5 h-5 text-indigo-400" />,
      title: "Risks & Blockers Dashboard",
      desc: "Identify issues early. Keep deployments visible to prevent delayed delivery timelines."
    },
    {
      icon: <Inbox className="w-5 h-5 text-indigo-400" />,
      title: "Product Feedback Extractor",
      desc: "Filter customer feature requests and integration blockages to help product managers adjust roadmap priorities."
    },
    {
      icon: <FileText className="w-5 h-5 text-indigo-400" />,
      title: "Status Update Generator",
      desc: "Generate professional deployment summaries automatically, adjusting the tone to fit internal or external targets."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      title: "Role-Based Viewports",
      desc: "Ensure every viewer (FDEs, Managers, Product PMs, and Executives) displays the specific data scope they need."
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full" id="solution-features">
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">THE WORKSPACE BRIDGE</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            The workspace between customer deployment, engineering, and product.
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xl mx-auto">
            FDE OS is not generic project management. It is purpose-built for technical customer deployments where FDEs convert ambiguous customer needs into working systems.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 hover:bg-zinc-900 hover:border-zinc-800 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                {c.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-sans">{c.title}</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: WORKFLOW SECTION (5 STEPS)
// ====================================================
function WorkflowSection() {
  const steps = [
    {
      num: "01",
      title: "Workspace Creation",
      desc: "Provision a clean sandbox workspace tailored to individual B2B customer specifications."
    },
    {
      num: "02",
      title: "Paste Raw Customer Data",
      desc: "Input raw conversational notes, logs, emails, Slack files, or transcript snippets."
    },
    {
      num: "03",
      title: "Trigger AI Extraction Module",
      desc: "The extractor identifies action items, goals, schedules, blockers, and feature feedback."
    },
    {
      num: "04",
      title: "Review & Map Parameters",
      desc: "Review and organize extracted intelligence, linking tracking milestones to active workloads."
    },
    {
      num: "05",
      title: "Synchronize Viewports",
      desc: "FDEs, PMs, and Executives get updated metrics automatically based on their customized roles."
    }
  ];

  return (
    <section className="bg-zinc-900/20 border-y border-zinc-900 py-20 px-6 w-full" id="workflow-timeline">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">OPERATIONAL LIFECYCLE</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            From messy customer conversation to deployment clarity in minutes.
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xl mx-auto">
            Reduce administrative coordination effort by automated structured tracking. Mapping field data has never been so seamless.
          </p>
        </div>

        {/* Workflow horizontal desktop or vertical mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 relative">
          {steps.map((st, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 relative space-y-4 hover:border-zinc-800 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900/80">
                  <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 px-2 py-0.5 rounded">
                    Step {st.num}
                  </span>
                  <span className="text-[8px] font-mono text-zinc-650 uppercase tracking-widest">// MAP</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-100 font-sans mt-3">{st.title}</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-1">{st.desc}</p>
              </div>
              <div className="pt-4 text-left font-mono text-[9px] text-zinc-550">
                🚀 CONCURRENT PIPELINE ACTIVE
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: ROLE VALUE TAB SECTION
// ====================================================
function RoleValueSection() {
  const [activeTab, setActiveTab] = useState<'FDE' | 'FDEManager' | 'Executive' | 'ProductManager'>('FDE');

  const tabsContent = {
    FDE: {
      tag: "FDE FIELD AGENTS",
      headline: "Run cleaner customer deployments.",
      desc: "Stop worrying about missing deliverables or losing meeting thread snippets. Convert raw data inputs into clean workspaces, track action items, and provide client updates with minimal manual overhead.",
      points: [
        "Turn notes into structured plans instantly",
        "Track commitments and blockers automatically",
        "Generate customer updates with one click",
        "Maintain clean, consistent readiness checklists"
      ]
    },
    FDEManager: {
      tag: "FDE OPERATIONS MANAGER",
      headline: "See every deployment before it becomes a fire drill.",
      desc: "Stop chasing FDE team members for status updates. Monitor active deployments, track scheduled milestones, identify issues early, and ensure delivery stays on track.",
      points: [
        "Monitor all deployments by stage and health",
        "Identify blocked accounts before timelines slip",
        "Track workloads across the team easily",
        "Standardize customer delivery quality standards"
      ]
    },
    Executive: {
      tag: "EXECUTIVE SPONSOR",
      headline: "Understand deployment risk and revenue impact.",
      desc: "Protect ARR metrics. Get clear visibility into deployment progress, track SLA compliance, identify resource constraints, and review summarized performance dashboards.",
      points: [
        "Monitor at-risk accounts easily",
        "Track deployment cycle times",
        "Identify recurring integration gaps",
        "Review board-ready summaries instantly"
      ]
    },
    ProductManager: {
      tag: "PRODUCT MANAGERS",
      headline: "Turn field signal into roadmap evidence.",
      desc: "Stop trying to figure out what custom features FDE teams are building. Review customer requests, analyze common integration challenges, and align roadmap planning with clear field insights.",
      points: [
        "Cluster feature requests automatically",
        "Identify common integration challenges",
        "Track product customization debt",
        "Link plans directly to customer request logs"
      ]
    }
  };

  const curr = tabsContent[activeTab];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full" id="role-views">
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">ROLE-SPECIFIC UTILITY</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            One operating system. Different views for every role.
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xl mx-auto">
            FDE OS coordinates product feedback, risk alerts, and active commitments, ensuring every team member stays aligned.
          </p>
        </div>

        {/* Tabs Control bar */}
        <div className="flex flex-wrap border-b border-zinc-900 justify-center gap-2 text-xs font-mono select-none">
          {[
            { id: 'FDE', title: 'FDE Field Agent' },
            { id: 'FDEManager', title: 'FDE Operations Manager' },
            { id: 'Executive', title: 'Executive Sponsor' },
            { id: 'ProductManager', title: 'Product PM' }
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              className={`pb-3.5 px-3 border-b-2 transition-all cursor-pointer ${activeTab === tb.id ? 'border-indigo-500 text-white font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              {tb.title}
            </button>
          ))}
        </div>

        {/* Content container */}
        <div className="bg-zinc-900/30 border border-zinc-900 p-6 md:p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                {curr.tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight font-sans">
                {curr.headline}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-405 leading-relaxed font-sans">{curr.desc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {curr.points.map((pt, index) => (
                <div key={index} className="flex items-start gap-2.5 font-sans leading-tight">
                  <div className="w-5 h-5 rounded overflow-hidden bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-zinc-300">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">// MOCK PLATFORM VIEWPORT PREVIEW</span>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold">{activeTab} VIEW</span>
            </div>
            
            {activeTab === 'FDE' && (
              <div className="space-y-3">
                <div className="text-xs bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 space-y-1">
                  <span className="text-[9px] font-mono text-indigo-300 block">ACTIVE USER CHECKLIST:</span>
                  <p className="font-bold text-zinc-200">Acme Logistics Integration</p>
                  <div className="flex items-center gap-1.5 pt-1.5 text-[10px] font-mono text-zinc-400">
                    <span className="text-emerald-400">✓ Ingress VPN Whitelist OK</span>
                  </div>
                </div>
                <div className="text-xs bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 space-y-1">
                  <p className="font-bold text-zinc-200">Helios Energy Deployment</p>
                  <div className="flex items-center gap-1.5 pt-1.5 text-[10px] font-mono text-zinc-400">
                    <span className="text-rose-450">⚑ Blocked: Pending Client Auth Token</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'FDEManager' && (
              <div className="space-y-3">
                <div className="text-xs bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 space-y-2">
                  <span className="text-[9px] font-mono text-zinc-450 block uppercase">// FDE Team Deployment Board</span>
                  <div className="flex items-center justify-between text-[10px] font-mono border-b border-zinc-850 pb-1.5 text-zinc-400">
                    <span>Account</span>
                    <span>Risk Health</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>Acme Logistics</span>
                    <span className="text-emerald-400 font-mono font-bold uppercase">[🟢 green]</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>Zenith Health</span>
                    <span className="text-rose-500 font-mono font-bold uppercase">[🔴 critical red]</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Executive' && (
              <div className="space-y-3">
                <div className="text-xs bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 space-y-2">
                  <span className="text-[9px] font-mono text-indigo-300 block uppercase">★ Core Revenue Insights</span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-zinc-950 p-2 border border-zinc-850 rounded">
                      <span className="text-[8px] text-zinc-500 block">Total active ARR</span>
                      <span className="text-sm font-bold text-white">$1.12M</span>
                    </div>
                    <div className="bg-zinc-950 p-2 border border-rose-950/20 rounded">
                      <span className="text-[8px] text-zinc-500 block">Accounts blocked</span>
                      <span className="text-sm font-bold text-rose-500">1 accounts</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ProductManager' && (
              <div className="space-y-3">
                <div className="text-xs bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 space-y-2">
                  <span className="text-[9px] font-mono text-emerald-400 block uppercase">// Field Signals Clustered:</span>
                  <div className="space-y-1.5 text-[11px] text-zinc-300">
                    <p className="border-l-2 border-emerald-500 pl-2"><strong>Custom Dashboard Filtering</strong> requested across 3 accounts</p>
                    <p className="border-l-2 border-zinc-700 pl-2 text-zinc-450"><strong>SAML SSO</strong> required for Helios Energy integration</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: COMPARISON CAPABILITIES TABLE
// ====================================================
function ComparisonTable() {
  const tableData = [
    { capability: "FDE Engagement Lifecycle Tracking", jira: false, sf: true, notion: true, onboard: true, fdeos: true },
    { capability: "Notes-to-Deployment Intelligence Extraction", jira: false, sf: false, notion: false, onboard: false, fdeos: true },
    { capability: "Commitment tracking from messy customer context", jira: false, sf: false, notion: false, onboard: false, fdeos: true },
    { capability: "Technical Deployment Readiness Checklists", jira: true, sf: false, notion: true, onboard: true, fdeos: true },
    { capability: "Product Feedback Clustering & Field Signals", jira: false, sf: false, notion: false, onboard: false, fdeos: true },
    { capability: "Role-Based specialized FDE dashboards", jira: false, sf: false, notion: false, onboard: false, fdeos: true },
    { capability: "Executive portfolio deployment risk visibility", jira: false, sf: true, notion: false, onboard: false, fdeos: true }
  ];

  return (
    <section className="bg-zinc-900/30 border-y border-zinc-900 py-20 px-6 w-full" id="features-comparison">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">OBJECTIVE EVALUATION</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            Why not Jira, Salesforce, Notion, or onboarding software?
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xl mx-auto">
            Traditional tools are either too generic or designed for other departments (like Sales pipeline tracking or product development sprints).
          </p>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left font-sans text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-zinc-900/60 border-b border-zinc-900 text-zinc-400 select-none font-mono text-[9px] uppercase tracking-wider">
                  <th className="p-4 font-bold">Capabilities Matrix</th>
                  <th className="p-4 font-bold text-center">Jira / Linear</th>
                  <th className="p-4 font-bold text-center">Salesforce</th>
                  <th className="p-4 font-bold text-center">Notion Docs</th>
                  <th className="p-4 font-bold text-center">Onboarding Tools</th>
                  <th className="p-4 font-bold bg-indigo-950/20 border-x border-indigo-950/40 text-indigo-300 text-center">FDE OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="p-4 font-medium text-zinc-200 text-xs sm:text-xs font-sans">{row.capability}</td>
                    
                    {/* Jira */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        {row.jira ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-zinc-700" />}
                      </div>
                    </td>

                    {/* Salesforce */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        {row.sf ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-zinc-700" />}
                      </div>
                    </td>

                    {/* Notion */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        {row.notion ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-zinc-700" />}
                      </div>
                    </td>

                    {/* Onboarding */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        {row.onboard ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-zinc-700" />}
                      </div>
                    </td>

                    {/* FDE OS */}
                    <td className="p-4 bg-indigo-950/10 border-x border-indigo-950/30 text-center font-bold">
                      <div className="flex items-center justify-center">
                        {row.fdeos ? <Check className="w-4.5 h-4.5 text-indigo-400" /> : <X className="w-4.5 h-4.5 text-zinc-700" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: USE CASES SECTION
// ====================================================
function UseCasesSection() {
  const useCases = [
    {
      title: "Enterprise AI Implementation",
      sub: "B2B AI Platforms",
      desc: "For vertical AI platform builders deploying complex models into on-prem enterprise clusters with custom security and integration needs."
    },
    {
      title: "Vertical AI SaaS",
      sub: "Domain specific workflows",
      desc: "For vertical SaaS teams handling complex setups and integrations, ensuring delivery meets contract terms."
    },
    {
      title: "Data & ML Infrastructure",
      sub: "Infrastructure scaling Teams",
      desc: "For teams deploying databases, telemetry pipelines, or model frameworks, managing system compatibility parameters efficiently."
    },
    {
      title: "Cybersecurity AI Deployments",
      sub: "High compliance pipelines",
      desc: "For teams managing strictly isolated systems, tracking connectivity blockers and deployment checks systematically."
    },
    {
      title: "Manufacturing AI Controls",
      sub: "Industrial integration models",
      desc: "For engineering teams coordinating physical and digital telemetry integrations, keeping stakeholders aligned on timelines."
    },
    {
      title: "AI Agent Ventures",
      sub: "Pilot to production conversion",
      desc: "For startups transitioning early pilots into stable, repeatable production software, managing product requests and delivery commitments."
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full" id="use-cases">
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">TARGET DEPLOYMENTS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            Built for high-touch enterprise AI deployment.
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xl mx-auto">
            Scale technical delivery, track commitments, and keep operational goals visible across various deployment environments.
          </p>
        </div>

        {/* Use Cases Bento list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((uc, i) => (
            <div key={i} className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl hover:border-zinc-800 transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">{uc.sub}</span>
                <h4 className="text-sm font-bold text-white font-sans">{uc.title}</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-1">{uc.desc}</p>
              </div>
              <div className="pt-4 flex items-center justify-between text-[10px] font-mono text-zinc-550 border-t border-zinc-900">
                <span>OPERATIONAL SPEC</span>
                <span>Active 🟢</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: PRODUCT PREVIEW OR SCREENSHOTS
// ====================================================
function ProductPreviewSection() {
  const previews = [
    {
      title: "Deployment Command Center",
      caption: "Track ARR metrics, deployment progress, risk health, and open commitments across active enterprise customer integrations.",
      tags: ["PORFOLIO SUMMARY", "ARR VALUE", "HEALTH TRACKING"],
      content: (
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between font-mono text-[9px] text-zinc-450 border-b border-zinc-800 pb-2">
            <span>METRIC COMPILATION</span>
            <span>STATUS: ACTIVE</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
              <span className="text-[8px] font-mono text-zinc-500 block uppercase">Total ARR</span>
              <span className="text-sm font-extrabold text-white font-sans">$1.12M</span>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
              <span className="text-[8px] font-mono text-zinc-500 block uppercase">At-risk accounts</span>
              <span className="text-sm font-extrabold text-rose-500 font-sans">1 accounts</span>
            </div>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
              <span className="text-[8px] font-mono text-zinc-500 block uppercase">Open commitments</span>
              <span className="text-sm font-extrabold text-indigo-300 font-sans">14 items</span>
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-850 p-2 rounded text-[10px] text-zinc-400 font-sans leading-relaxed">
            🗺️ <strong>Active Threat:</strong> FHIR Connection Firewall Blockage at Zenith Health. Mitigated action logged.
          </div>
        </div>
      )
    },
    {
      title: "Notes Intelligence Extraction",
      caption: "Paste unstructured call logs, transcript copy, or emails to let the AI module isolate deliverables, parameters, and timelines.",
      tags: ["NATURAL LANGUAGE PARSER", "MILSTESTONE GENERATOR"],
      content: (
        <div className="space-y-2.5 text-left font-mono text-[10px]">
          <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-zinc-400">
            <p className="text-[8px] text-zinc-500 uppercase pb-1">// Input excerpt:</p>
            "Customer agreed to share VPN certificate config by Wednesday afternoon so Ryan can deploy our proxy controller cluster."
          </div>
          <div className="bg-indigo-950/20 border border-indigo-500/10 p-2.5 rounded-lg text-zinc-350 flex justify-between items-center">
            <div>
              <span className="text-[8px] font-mono text-indigo-400 block uppercase">Extracted action item:</span>
              <span>Retrieve and whitelist client VPN certificates</span>
            </div>
            <span className="text-[8px] bg-indigo-500/10 text-indigo-350 px-1 rounded uppercase">Due Wed</span>
          </div>
        </div>
      )
    },
    {
      title: "Commitment Ledger",
      caption: "Track delivery schedules, owner assignments, and client expectations, complete with visible dependency blockages.",
      tags: ["SLA MILESTONES", "FDE OWNER MAP", "DEPENDENCIES PANEL"],
      content: (
        <div className="space-y-2 text-left text-xs font-sans select-none">
          <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between font-mono text-[9px] text-zinc-450 border-b border-zinc-900 pb-1.5">
              <span>LEDGER SPECIFICATION</span>
              <span className="text-amber-500">BLOCKED</span>
            </div>
            <p className="font-bold text-zinc-200">Ingress Network Proxy Config Setup</p>
            <div className="flex items-center justify-between text-[10px] text-zinc-405 font-mono pt-1">
              <span>Assignee: Alex Carver</span>
              <span className="bg-amber-500/15 text-amber-500 px-1.5 rounded text-[8px] uppercase">Proxy block</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Product Intelligence Dashboard",
      caption: "Aggregates and formats loose feedback snippets, grouping them by product theme to help product managers adjust priorities.",
      tags: ["ROADMAP EVIDENCE", "SIGNALS CLUSTERING", "PM BRIDGE"],
      content: (
        <div className="space-y-2 text-left font-sans text-xs">
          <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-lg space-y-2 leading-relaxed">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-emerald-400 uppercase">// Clustered Feedback</span>
              <span className="text-[8px] bg-zinc-850 px-1.5 rounded text-zinc-400">3 occurrences</span>
            </div>
            <p className="font-bold text-zinc-200">Custom Workspace Filtering</p>
            <p className="text-[10px] text-zinc-400">Requested for deployment audit trails during corporate pilot updates.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="bg-zinc-900/20 border-y border-zinc-900 py-18 px-6 w-full" id="product-previews">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">INTERFACE TELEMETRY</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            Inside the FDE OS workspace.
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xl mx-auto">
            Interact with customizable, role-specific components designed to keep B2B engineering and enterprise client parameters synchronized.
          </p>
        </div>

        {/* Bento screenshot grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previews.map((pv, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between hover:border-zinc-800 transition-all space-y-5 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <h4 className="font-extrabold text-sm text-white font-sans">{pv.title}</h4>
                  <div className="flex gap-1">
                    {pv.tags.slice(0, 1).map((t, i) => (
                      <span key={i} className="text-[8px] font-mono text-zinc-450 uppercase tracking-wider">{t}</span>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-405 font-sans leading-relaxed">{pv.caption}</p>
              </div>

              {/* Inside Interactive visual mockup component */}
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-900">
                {pv.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: SECURITY SECTION
// ====================================================
function SecuritySection({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  const securityFeatures = [
    { title: "Organization Workspaces", desc: "Keep customer deployment parameters, notes, and metrics strictly isolated using workspace boundaries." },
    { title: "Granular Role Permissions", desc: "Define granular read, write, and approval levels, tailored to FDEs, Executives, and Product PM roles." },
    { title: "Admin Portal Simulation", desc: "Audit workspace visibility rules instantly using our Admin security viewport simulation tool." },
    { title: "Read-Only Executive Views", desc: "Share high-level delivery summaries and KPIs safely without risk of accidental content edits." },
    { title: "Access Controls & Logs", desc: "Audit notes access, feature extraction steps, and checklist updates to guarantee clear internal operational trails." },
    { title: "SSO & SAML Authentication", desc: "Designed to support SSO and audit logs as enterprise controls expand." }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full animate-fade-in" id="security-governance">
      <div className={`rounded-3xl p-8 md:p-12 relative overflow-hidden border transition-all duration-200 ${
        isDark 
          ? 'bg-gradient-to-br from-zinc-900 to-indigo-950 border-indigo-500/15' 
          : 'bg-gradient-to-br from-indigo-50/70 to-white border-indigo-200/50 shadow-md'
      }`}>
        <div className={`absolute right-6 bottom-4 select-none opacity-5 ${isDark ? 'text-white' : 'text-indigo-600/30'}`}>
          <Lock className="w-56 h-56" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase tracking-wider border ${
              isDark 
                ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/25' 
                : 'text-indigo-700 bg-indigo-100/80 border-indigo-200'
            }`}>
              ENTERPRISE SECURITY FIRST
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold font-sans leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Designed for enterprise deployment teams.
            </h2>
            <p className={`text-xs sm:text-sm font-sans leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-slate-600'
            }`}>
              FDE OS isolates customer data, manages role-based access levels, and supports detailed compliance auditing out of the box.
            </p>
            <div className={`flex items-center gap-3 font-mono text-xs pt-2 ${
              isDark ? 'text-indigo-300' : 'text-indigo-600'
            }`}>
              <ShieldCheck className={`w-5 h-5 shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span>Full compliance logging active</span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityFeatures.map((feat, i) => (
              <div key={i} className={`p-4.5 rounded-xl border space-y-1.5 transition-colors duration-200 ${
                isDark 
                  ? 'bg-zinc-950/40 border-zinc-800/60 hover:border-zinc-700' 
                  : 'bg-white border-slate-200/80 shadow-sm hover:border-indigo-300'
              }`}>
                <span className={`text-[9px] font-mono block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>// SYSTEM_SEC_CONTROL</span>
                <h4 className={`text-xs font-bold font-sans flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Key className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} /> {feat.title}
                </h4>
                <p className={`text-[11px] font-sans leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: PRICING TEASER SLOTS
// ====================================================
interface PricingTeaserSectionProps {
  onRequestDemo: () => void;
}

function PricingTeaserSection({ onRequestDemo }: PricingTeaserSectionProps) {
  const plans = [
    {
      title: "Starter Plan",
      audience: "For early FDE teams",
      features: [
        "Up to 5 active FDE workspaces",
        "Raw meeting transcript upload",
        "Engagement parameter tracking",
        "SLA commitment tracking checklist",
        "Single workspace admin view"
      ],
      cta: "Request Starter Demo"
    },
    {
      title: "Growth Plan",
      audience: "For scaling deployment teams",
      features: [
        "From 5 to 50 active FDE workspaces",
        "Role-Specific viewports mapping",
        "Full core notes extraction pipeline",
        "Product intelligence feedback clustering",
        "Track workloads across the team"
      ],
      cta: "Request Growth Demo",
      popular: true
    },
    {
      title: "Enterprise Plan",
      audience: "For larger organizations",
      features: [
        "Custom deployment limits",
        "SSO and audit log protocols",
        "Premium support channels",
        "Custom system workflow integrations",
        "On-prem deployment sandboxes"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <section className="bg-zinc-900/40 border-y border-zinc-900 py-20 px-6 w-full font-sans text-xs" id="pricing-teaser">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">INVESTMENT EFFICIENCY</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            Simple pricing for growing FDE teams.
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-xl mx-auto">
            Choose a plan tailored to your team's size. No hidden transaction or API parsing fees.
          </p>
        </div>

        {/* Plans row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {plans.map((p, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-3xl relative flex flex-col justify-between border ${
                p.popular 
                  ? 'bg-zinc-950 border-indigo-500/45 shadow-[0_4px_30px_rgba(99,102,241,0.15)] scale-102 z-10' 
                  : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800'
              }`}
            >
              <div className="space-y-5">
                {p.popular && (
                  <span className="absolute top-4 right-4 bg-indigo-500/10 text-indigo-300 font-mono text-[8px] font-bold tracking-widest uppercase border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    RECOMMENDED SETUP
                  </span>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white font-sans border-b border-zinc-900 pb-3">{p.title}</h4>
                  <span className="text-[10px] text-zinc-450 font-sans pt-1.5 block italic">{p.audience}</span>
                </div>

                <ul className="space-y-3 pt-2 text-[11px] text-zinc-300">
                  {p.features.map((feat, index) => (
                    <li key={index} className="flex items-start gap-2 text-zinc-400">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-900/80">
                <button 
                  onClick={onRequestDemo}
                  className={`w-full text-center py-2.5 rounded-xl font-bold font-mono transition-colors text-[11px] cursor-pointer ${
                    p.popular 
                      ? 'bg-zinc-100 text-zinc-950 hover:bg-white' 
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-850'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: FINAL CTA SECTION
// ====================================================
interface FinalCTASectionProps {
  onRequestDemo: () => void;
  onTryDemo: () => void;
}

function FinalCTASection({ onRequestDemo, onTryDemo }: FinalCTASectionProps) {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto w-full text-center space-y-8 animate-fade-in" id="final-cta">
      <div className="space-y-3">
        <span className="text-[10px] font-mono text-indigo-400 tracking-wider font-bold uppercase">IMMEDIATE ACTIVATION</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans leading-tight">
          Give every FDE the operating rhythm of your best FDE.
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl mx-auto leading-relaxed">
          Standardize customer deployment work, surface risk earlier, and turn field learning into product strategy.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono w-full sm:w-auto">
        <button 
          onClick={onRequestDemo}
          className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-950 font-bold px-7 py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-sm"
        >
          Request Demo
        </button>
        <button 
          onClick={onTryDemo}
          className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 font-bold text-zinc-200 px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
        >
          Try Demo Workspace <ArrowRight className="w-4 h-4 text-indigo-400" />
        </button>
      </div>
    </section>
  );
}

// ====================================================
// SUB COMPONENT: FOOTER
// ====================================================
interface FooterProps {
  onScrollTo: (id: string) => void;
}

function Footer({ onScrollTo }: FooterProps) {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-6 w-full mt-auto" id="marketing-footer-deck">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-sans">
        
        {/* Brand info */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded bg-indigo-650 flex items-center justify-center font-bold text-white font-mono text-xs">
              F
            </div>
            <span className="text-white font-bold tracking-tight">FDE OS</span>
          </div>
          <p className="text-zinc-500 font-sans leading-relaxed text-[11px] max-w-xs">
            The operational synchronization hub between forward deployed engineering execution, enterprise customer objectives, and product strategy.
          </p>
        </div>

        {/* Links grid col 1 */}
        <div className="md:col-span-2 space-y-3 font-sans">
          <h5 className="font-bold text-white uppercase text-[9px] font-mono tracking-wider">// Product Platform</h5>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onScrollTo('solution-features')} className="hover:text-white block">Core Engine</button></li>
            <li><button onClick={() => onScrollTo('solution-features')} className="hover:text-white block">Workspace Sandbox</button></li>
            <li><button onClick={() => onScrollTo('workflow-timeline')} className="hover:text-white block">Workflow Flow</button></li>
            <li><button onClick={() => onScrollTo('security-governance')} className="hover:text-white block">SSO Compliance</button></li>
          </ul>
        </div>

        {/* Links grid col 2 */}
        <div className="md:col-span-2 space-y-3 font-sans">
          <h5 className="font-bold text-white uppercase text-[9px] font-mono tracking-wider">// Use Case Targets</h5>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onScrollTo('use-cases')} className="hover:text-white block">AI Implementation</button></li>
            <li><button onClick={() => onScrollTo('use-cases')} className="hover:text-white block">Vertical SaaS</button></li>
            <li><button onClick={() => onScrollTo('use-cases')} className="hover:text-white block">Cybersecurity AI</button></li>
            <li><button onClick={() => onScrollTo('use-cases')} className="hover:text-white block">ML Infrastructure</button></li>
          </ul>
        </div>

        {/* Links grid col 3 */}
        <div className="md:col-span-2 space-y-3 font-sans">
          <h5 className="font-bold text-white uppercase text-[9px] font-mono tracking-wider">// Role Viewports</h5>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onScrollTo('role-views')} className="hover:text-white block">FDE Field agent</button></li>
            <li><button onClick={() => onScrollTo('role-views')} className="hover:text-white block">Operations Manager</button></li>
            <li><button onClick={() => onScrollTo('role-views')} className="hover:text-white block">Executive Sponsor</button></li>
            <li><button onClick={() => onScrollTo('role-views')} className="hover:text-white block">Product PM</button></li>
          </ul>
        </div>

        {/* Links grid col 4 */}
        <div className="md:col-span-2 space-y-3 font-sans">
          <h5 className="font-bold text-white uppercase text-[9px] font-mono tracking-wider">// Pricing & Details</h5>
          <ul className="space-y-2 text-zinc-500">
            <li><button onClick={() => onScrollTo('pricing-teaser')} className="hover:text-white block">Pricing Tiers</button></li>
            <li><button onClick={() => onScrollTo('pricing-teaser')} className="hover:text-white block">Starter Plan</button></li>
            <li><button onClick={() => onScrollTo('pricing-teaser')} className="hover:text-white block">Growth Plan</button></li>
            <li><button onClick={() => onScrollTo('pricing-teaser')} className="hover:text-white block">Enterprise SLA</button></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-zinc-900/80 flex flex-col md:flex-row md:items-center justify-between text-[11px] text-zinc-600 gap-4">
        <span>© 2026 Antigravity AI Technologies, Inc. All rights reserved.</span>
        <div className="flex gap-4 font-mono select-none">
          <a href="#/marketing" className="hover:text-zinc-400">Terms of Service</a>
          <a href="#/marketing" className="hover:text-zinc-400">Privacy Policy</a>
          <a href="#/marketing" className="hover:text-zinc-400">Security Audit Logs v1</a>
        </div>
      </div>
    </footer>
  );
}
