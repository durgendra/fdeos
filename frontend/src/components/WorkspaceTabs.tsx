import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Server, 
  Milestone, 
  Clock, 
  Terminal, 
  Sparkles, 
  Plus, 
  X, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  ChevronRight, 
  Edit3, 
  Undo,
  FileText,
  BadgeAlert,
  Loader2,
  Copy,
  FolderDot
} from 'lucide-react';
import { 
  Engagement, 
  Commitment, 
  Risk, 
  Blocker, 
  ProductSignal, 
  ReadinessItem, 
  StatusUpdate,
  Stakeholder,
  DeploymentStage,
  DeploymentHealth
} from '../types';
import { engagementsApi } from '../api/engagementsApi';
import { notesApi } from '../api/notesApi';
import { commitmentsApi } from '../api/commitmentsApi';
import { risksApi } from '../api/risksApi';
import { productSignalsApi } from '../api/productSignalsApi';
import { readinessApi } from '../api/readinessApi';
import { statusUpdatesApi } from '../api/statusUpdatesApi';

interface WorkspaceTabsProps {
  engagement: Engagement;
  onUpdateEngagement: (updated: Engagement) => void;
  currentRole?: string;
  rolePermissions?: any;
  dataMode?: 'demo' | 'api';
  onRefreshEngagement?: () => void | Promise<void>;
  initialTab?: string;
}

type WorkspaceTabId = 'overview' | 'notes' | 'commitments' | 'risks' | 'feedback' | 'readiness' | 'status';

const workspaceTabIds: WorkspaceTabId[] = ['overview', 'notes', 'commitments', 'risks', 'feedback', 'readiness', 'status'];

export default function WorkspaceTabs({ engagement, onUpdateEngagement, currentRole, rolePermissions, dataMode, onRefreshEngagement, initialTab }: WorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState<
    WorkspaceTabId
  >(workspaceTabIds.includes(initialTab as WorkspaceTabId) ? initialTab as WorkspaceTabId : 'overview');

  React.useEffect(() => {
    if (workspaceTabIds.includes(initialTab as WorkspaceTabId)) {
      setActiveTab(initialTab as WorkspaceTabId);
    }
  }, [initialTab]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Building2 },
    { id: 'notes', name: 'Notes Intelligence', icon: Sparkles, highlight: true },
    { id: 'commitments', name: 'Commitments', icon: Milestone },
    { id: 'risks', name: 'Risks & Blockers', icon: AlertTriangle },
    { id: 'feedback', name: 'Product Feedback', icon: FolderDot },
    { id: 'readiness', name: 'Readiness Checklist', icon: Check },
    { id: 'status', name: 'Status Updates', icon: FileText }
  ];

  React.useEffect(() => {
    const refresh = () => {
      onRefreshEngagement?.();
    };
    window.addEventListener('fdeos-refresh-engagement', refresh);
    return () => window.removeEventListener('fdeos-refresh-engagement', refresh);
  }, [onRefreshEngagement]);

  return (
    <div className="flex flex-col flex-1" id="workspace-tabs-container">
      {/* Tab bar */}
      <div className="border-b border-zinc-200 bg-white sticky top-0 z-10 px-6">
        <div className="flex space-x-6 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-1 border-b-2 font-medium text-xs flex items-center gap-2 shrink-0 transition-all cursor-pointer relative ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-zinc-400'}`} />
                <span>{tab.name}</span>
                {tab.highlight && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-6 flex-1 bg-zinc-50/50">
        {activeTab === 'overview' && (
          <OverviewTab engagement={engagement} onUpdateEngagement={onUpdateEngagement} currentRole={currentRole} rolePermissions={rolePermissions} dataMode={dataMode} onRefreshEngagement={onRefreshEngagement} />
        )}
        {activeTab === 'notes' && (
          <NotesIntelligenceTab engagement={engagement} onUpdateEngagement={onUpdateEngagement} currentRole={currentRole} rolePermissions={rolePermissions} dataMode={dataMode} onRefreshEngagement={onRefreshEngagement} />
        )}
        {activeTab === 'commitments' && (
          <CommitmentsTab engagement={engagement} onUpdateEngagement={onUpdateEngagement} currentRole={currentRole} rolePermissions={rolePermissions} dataMode={dataMode} onRefreshEngagement={onRefreshEngagement} />
        )}
        {activeTab === 'risks' && (
          <RisksTab engagement={engagement} onUpdateEngagement={onUpdateEngagement} currentRole={currentRole} rolePermissions={rolePermissions} dataMode={dataMode} onRefreshEngagement={onRefreshEngagement} />
        )}
        {activeTab === 'feedback' && (
          <ProductFeedbackTab engagement={engagement} onUpdateEngagement={onUpdateEngagement} currentRole={currentRole} rolePermissions={rolePermissions} dataMode={dataMode} onRefreshEngagement={onRefreshEngagement} />
        )}
        {activeTab === 'readiness' && (
          <ReadinessTab engagement={engagement} onUpdateEngagement={onUpdateEngagement} currentRole={currentRole} rolePermissions={rolePermissions} dataMode={dataMode} onRefreshEngagement={onRefreshEngagement} />
        )}
        {activeTab === 'status' && (
          <StatusUpdatesTab engagement={engagement} onUpdateEngagement={onUpdateEngagement} currentRole={currentRole} rolePermissions={rolePermissions} dataMode={dataMode} onRefreshEngagement={onRefreshEngagement} />
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. OVERVIEW TAB
// ----------------------------------------------------
function OverviewTab({ engagement, onUpdateEngagement, currentRole, rolePermissions, onRefreshEngagement }: WorkspaceTabsProps) {
  const [newStakeholder, setNewStakeholder] = useState({ name: '', role: '', email: '' });
  const [showAddStakeholder, setShowAddStakeholder] = useState(false);
  const [newSystem, setNewSystem] = useState('');
  const [stageDraft, setStageDraft] = useState<DeploymentStage>(engagement.stage);
  const [healthDraft, setHealthDraft] = useState<DeploymentHealth>(engagement.health);
  const [milestoneDraft, setMilestoneDraft] = useState(engagement.nextMilestone);
  const [stageNote, setStageNote] = useState('');
  const [savingStage, setSavingStage] = useState(false);

  const canEdit = rolePermissions?.engagements?.edit !== false;
  const deploymentStages: DeploymentStage[] = ['Discovery', 'Workflow Mapping', 'Technical Scoping', 'Prototype', 'Validation', 'Production Hardening', 'Handoff', 'Expansion'];
  const currentStageIndex = deploymentStages.indexOf(engagement.stage);
  const nextStage = currentStageIndex >= 0 && currentStageIndex < deploymentStages.length - 1 ? deploymentStages[currentStageIndex + 1] : null;

  React.useEffect(() => {
    setStageDraft(engagement.stage);
    setHealthDraft(engagement.health);
    setMilestoneDraft(engagement.nextMilestone);
  }, [engagement.id, engagement.stage, engagement.health, engagement.nextMilestone]);

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!newStakeholder.name || !newStakeholder.role || !newStakeholder.email) return;

    const updatedStakeholders = [...engagement.stakeholders, newStakeholder];
    onUpdateEngagement({
      ...engagement,
      stakeholders: updatedStakeholders
    });
    setNewStakeholder({ name: '', role: '', email: '' });
    setShowAddStakeholder(false);
  };

  const handleAddSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!newSystem.trim()) return;

    const updatedSystems = [...engagement.systems, newSystem.trim()];
    onUpdateEngagement({
      ...engagement,
      systems: updatedSystems
    });
    setNewSystem('');
  };

  const handleRemoveSystem = (index: number) => {
    if (!canEdit) return;
    const updatedSystems = engagement.systems.filter((_, i) => i !== index);
    onUpdateEngagement({
      ...engagement,
      systems: updatedSystems
    });
  };

  const persistStageUpdate = async (targetStage: DeploymentStage, targetHealth: DeploymentHealth, targetMilestone: string, note: string, completedStage?: DeploymentStage) => {
    if (!canEdit) return;

    const today = new Date().toISOString().split('T')[0];
    const updated: Engagement = {
      ...engagement,
      stage: targetStage,
      health: targetHealth,
      nextMilestone: targetMilestone,
      lastUpdated: today,
      timeline: [
        ...engagement.timeline,
        {
          date: today,
          stage: completedStage || targetStage,
          note: note.trim() || (completedStage ? `${completedStage} completed. Moved to ${targetStage}.` : `Updated active stage to ${targetStage}.`),
          achieved: Boolean(completedStage)
        },
        ...(completedStage
          ? [{
              date: today,
              stage: targetStage,
              note: targetMilestone || `Begin ${targetStage}.`,
              achieved: false
            }]
          : [])
      ]
    };

    setSavingStage(true);
    try {
      onUpdateEngagement(updated);
      if (engagement.backendId) {
        await engagementsApi.update(engagement.backendId, {
          deploymentStage: targetStage,
          health: targetHealth === 'red' ? 'Red' : targetHealth === 'yellow' ? 'Yellow' : 'Green',
          nextMilestone: targetMilestone,
          executiveSummary: engagement.executiveSummary
        });
        await onRefreshEngagement?.();
      }
      setStageNote('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unable to save stage update.');
    } finally {
      setSavingStage(false);
    }
  };

  const saveStageUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await persistStageUpdate(stageDraft, healthDraft, milestoneDraft, stageNote);
  };

  const completeAndMoveNext = async () => {
    if (!nextStage) return;
    setStageDraft(nextStage);
    await persistStageUpdate(
      nextStage,
      healthDraft,
      milestoneDraft || `Begin ${nextStage}`,
      stageNote || `${engagement.stage} completed; advancing to ${nextStage}.`,
      engagement.stage
    );
  };

  return (
    <div className="space-y-6" id="overview-tab-content">
      {/* Read-only Alert Bar */}
      {!canEdit && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>[Read-only Mode]</strong> Action items are disabled for the <strong>{currentRole}</strong> role under current company permissions.
          </span>
        </div>
      )}

      {/* Core Executive Card */}
      <div className="bg-white rounded-xl border border-zinc-200/80 p-6 shadow-sm">
        <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">Executive Summary</h3>
        <p className="text-zinc-800 text-sm font-medium leading-relaxed">{engagement.executiveSummary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-zinc-100">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Customer Target Objective</span>
            <p className="text-xs text-zinc-800 font-semibold">{engagement.objective}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Primary Pain / Business Problem</span>
            <p className="text-xs text-zinc-800 font-semibold">{engagement.problem}</p>
          </div>
        </div>
      </div>

      <form onSubmit={saveStageUpdate} className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-zinc-800">Stage Control</h4>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Update the active deployment stage, health, next milestone, and progress note.</p>
          </div>
          {!canEdit && (
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded">Read-only for {currentRole}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-mono text-zinc-600 block mb-1">Active Stage</label>
            <select
              disabled={!canEdit}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-850 focus:outline-indigo-500 disabled:opacity-60"
              value={stageDraft}
              onChange={(e) => setStageDraft(e.target.value as DeploymentStage)}
            >
              {deploymentStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-mono text-zinc-600 block mb-1">Health</label>
            <select
              disabled={!canEdit}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-850 focus:outline-indigo-500 disabled:opacity-60"
              value={healthDraft}
              onChange={(e) => setHealthDraft(e.target.value as DeploymentHealth)}
            >
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="red">Red</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-mono text-zinc-600 block mb-1">Next Milestone</label>
            <input
              disabled={!canEdit}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-850 focus:outline-indigo-500 disabled:opacity-60"
              value={milestoneDraft}
              onChange={(e) => setMilestoneDraft(e.target.value)}
              placeholder="Define the next milestone"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-zinc-600 block mb-1">Progress Note</label>
          <textarea
            disabled={!canEdit}
            rows={2}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-800 focus:outline-indigo-500 resize-none disabled:opacity-60"
            value={stageNote}
            onChange={(e) => setStageNote(e.target.value)}
            placeholder="What changed? Example: Prototype validation completed; moving to Production Hardening after security review."
          />
        </div>

        {canEdit && (
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              type="button"
              disabled={savingStage || !nextStage}
              onClick={completeAndMoveNext}
              className="bg-indigo-650 hover:bg-indigo-700 disabled:bg-zinc-300 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
            >
              {nextStage ? `Complete ${engagement.stage} & Move to ${nextStage}` : 'Final Stage Reached'}
            </button>
            <button
              type="submit"
              disabled={savingStage}
              className="bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
            >
              {savingStage ? 'Saving Update...' : 'Save Stage Update'}
            </button>
          </div>
        )}
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stakeholder Directory */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <h4 className="text-sm font-bold text-zinc-800">Stakeholder Directory</h4>
              </div>
              {canEdit && (
                <button
                  onClick={() => setShowAddStakeholder(!showAddStakeholder)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Stakeholder
                </button>
              )}
            </div>

            {showAddStakeholder && canEdit && (
              <form onSubmit={handleAddStakeholder} className="bg-zinc-50 p-4 border border-zinc-200 rounded-lg mb-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-600 block mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                      placeholder="Jane Doe"
                      value={newStakeholder.name}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-600 block mb-1">Job Title</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                      placeholder="Principal Architect"
                      value={newStakeholder.role}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-600 block mb-1">Corporate Email</label>
                    <input
                      type="email"
                      className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                      placeholder="jane@company.com"
                      value={newStakeholder.email}
                      onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowAddStakeholder(false)}
                    className="px-3 py-1.5 bg-zinc-200 text-zinc-700 hover:bg-zinc-300 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-zinc-800 text-white hover:bg-zinc-950 rounded cursor-pointer font-medium"
                  >
                    Save Stakeholder
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {engagement.stakeholders.map((person, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-zinc-150 rounded-lg hover:bg-zinc-50/50 transition-colors">
                  <div>
                    <h5 className="text-xs font-bold text-zinc-800">{person.name}</h5>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{person.role}</p>
                  </div>
                  <div className="text-left sm:text-right mt-1.5 sm:mt-0">
                    <span className="text-xs font-mono text-zinc-600 hover:text-indigo-600 hover:underline cursor-pointer block">
                      {person.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Systems Involved */}
        <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-indigo-500" />
              <h4 className="text-sm font-bold text-zinc-800">Systems Enclave</h4>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {engagement.systems.map((system, idx) => (
                <span
                  key={idx}
                  className="bg-zinc-50 border border-zinc-200 text-zinc-700 px-2 py-1 rounded text-xs flex items-center gap-1.5 font-mono group"
                >
                  <span>{system}</span>
                  {canEdit && (
                    <button
                      onClick={() => handleRemoveSystem(idx)}
                      className="text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {engagement.systems.length === 0 && (
                <p className="text-xs text-zinc-400 font-mono">No systems listed yet.</p>
              )}
            </div>
          </div>

          {canEdit ? (
            <form onSubmit={handleAddSystem} className="mt-4 pt-4 border-t border-zinc-100 flex gap-2">
              <input
                type="text"
                className="flex-1 bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-indigo-500"
                placeholder="e.g. SAP ERP, AWS S3 API"
                value={newSystem}
                onChange={(e) => setNewSystem(e.target.value)}
              />
              <button
                type="submit"
                className="bg-zinc-800 text-white rounded px-3 py-1.5 hover:bg-zinc-950 transition-colors flex items-center text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </form>
          ) : (
            <div className="mt-4 pt-4 border-t border-zinc-100 text-center text-zinc-400 text-xs font-mono">
              🔒 Operations locked
            </div>
          )}
        </div>
      </div>

      {/* Timeline tracker */}
      <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-4 h-4 text-indigo-500" />
          <h4 className="text-sm font-bold text-zinc-800">Deployment Journey Roadmap</h4>
        </div>

        <div className="relative">
          {/* Vertical line connector */}
          <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-zinc-200"></div>

          <div className="space-y-6">
            {engagement.timeline.map((event, idx) => {
              const latestActiveIndex = engagement.timeline.reduce((latest, item, itemIndex) => (
                !item.achieved && item.stage === engagement.stage ? itemIndex : latest
              ), -1);
              const isActiveTimelineEvent = !event.achieved && event.stage === engagement.stage && idx === latestActiveIndex;
              return (
              <div key={idx} className="flex items-start gap-4 relative">
                <div className={`w-12 text-right text-[10px] font-mono text-zinc-400 pt-1 shrink-0`}>
                  {event.date}
                </div>
                <div className={`w-3 h-3 rounded-full mt-1.5 z-10 shrink-0 ${
                  event.achieved 
                    ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' 
                    : engagement.health === 'red' && isActiveTimelineEvent
                      ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)] animate-pulse'
                      : 'bg-zinc-200 border border-zinc-300'
                }`}></div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-bold ${event.achieved ? 'text-zinc-800' : 'text-zinc-500'}`}>
                      {event.stage}
                    </span>
                    {isActiveTimelineEvent && (
                      <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        Active Stage
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">{event.note}</p>
                </div>
              </div>
            );})}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. NOTES INTELLIGENCE TAB (CORE VALUE)
// ----------------------------------------------------
function NotesIntelligenceTab({ engagement, onUpdateEngagement, currentRole, rolePermissions }: WorkspaceTabsProps) {
  const [inputText, setInputText] = useState('');
  const [sourceType, setSourceType] = useState('Meeting Notes');
  const [noteTitle, setNoteTitle] = useState('Discovery call notes');
  const [isExtracting, setIsExtracting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [extractedItems, setExtractedItems] = useState<any[] | null>(null);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canExtract = rolePermissions?.notesIntelligence?.extract !== false;
  const canApprove = rolePermissions?.notesIntelligence?.approve !== false;

  // High-fidelity extracted outputs to display
  const MOCK_EXTRACTIONS: any[] = [
    {
      id: 'ex-obj',
      category: 'Customer Objective',
      value: `Fenetrate telemetry pipelines directly with local proxy relays to feed active sensor updates directly back to models, improving predictions.`,
      status: 'pending'
    },
    {
      id: 'ex-stk',
      category: 'Stakeholder Detected',
      value: `Priscilla Wells (Associate VP Analytics), Email: p.wells@${engagement.customer.toLowerCase().replace(/\s/g, '')}.com`,
      type: 'stakeholder',
      data: { name: 'Priscilla Wells', role: 'Associate VP Analytics', email: `p.wells@${engagement.customer.toLowerCase().replace(/\s/g, '')}.com` },
      status: 'pending'
    },
    {
      id: 'ex-cmt1',
      category: 'New Commitment',
      value: `Vendor FDE (${engagement.owner.split(' ')[0]}) to deploy sandbox instance version 1.4 by next Friday to verify compliance caching.`,
      type: 'commitment',
      data: { title: 'Deploy sandbox instance version 1.4 to test local client telemetry caching', owner: `${engagement.owner.split(' ')[0]} (Vendor)`, type: 'Vendor', dueDate: '2026-06-26', status: 'Open', source: 'Simulated Extraction', lastUpdated: '2026-06-19' },
      status: 'pending'
    },
    {
      id: 'ex-cmt2',
      category: 'New Commitment',
      value: `Client Technical Team to confirm Active Directory token revocation API documentation by Wednesday.`,
      type: 'commitment',
      data: { title: 'Provide Active Directory token revocation API endpoints details', owner: 'Technical Lead (Customer)', type: 'Customer', dueDate: '2026-06-24', status: 'Open', source: 'Simulated Extraction', lastUpdated: '2026-06-19' },
      status: 'pending'
    },
    {
      id: 'ex-risk',
      category: 'Deployment Risk',
      value: `Latency threshold constraints over regional VPN routing loops might occasionally drop metrics connection packets.`,
      type: 'risk',
      data: { title: 'VPN Routing Latency Drops', severity: 'Medium', description: 'Network packet failures over customer VPN loop blocks telemetry sync files.', impact: 'May skip machine diagnosis windows.', mitigation: 'Deploy native on-prem caching buffer.' },
      status: 'pending'
    }
  ];

  const triggerExtraction = async () => {
    if (!canExtract) return;
    if (!inputText.trim()) return;

    setIsExtracting(true);
    setTerminalLogs([]);
    setExtractedItems(null);
    setError(null);

    if (engagement.backendId) {
      setTerminalLogs(['>> Extracting objectives, commitments, blockers, risks, and product signals...']);
      try {
        const result = await notesApi.extract({
          engagementId: engagement.backendId,
          rawText: inputText,
          sourceType,
          title: noteTitle || 'Untitled notes'
        });
        setNoteId(result.noteId);
        const extracted = result.extracted;
        const apiItems = [
          extracted.customerObjective && {
            id: 'ex-obj',
            category: 'Customer Objective',
            value: extracted.customerObjective,
            status: 'accepted'
          },
          extracted.businessProblem && {
            id: 'ex-problem',
            category: 'Business Problem',
            value: extracted.businessProblem,
            status: 'accepted'
          },
          ...extracted.stakeholders.map((stakeholder, idx) => ({
            id: `ex-stk-${idx}`,
            category: 'Stakeholder Detected',
            value: `${stakeholder.name} (${stakeholder.role})`,
            type: 'stakeholder',
            data: { name: stakeholder.name, role: stakeholder.role, email: `${stakeholder.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@customer.local` },
            status: 'accepted'
          })),
          ...extracted.commitments.map((commitment, idx) => ({
            id: `ex-cmt-${idx}`,
            category: 'New Commitment',
            value: commitment.text,
            type: 'commitment',
            data: {
              title: commitment.text,
              owner: commitment.ownerName || 'Unassigned',
              type: commitment.ownerType || 'Vendor',
              dueDate: commitment.dueDate || new Date().toISOString().slice(0, 10),
              status: 'Open',
              source: commitment.sourceExcerpt || 'AI Extraction',
              lastUpdated: new Date().toISOString().slice(0, 10)
            },
            status: 'accepted'
          })),
          ...extracted.risks.map((risk, idx) => ({
            id: `ex-risk-${idx}`,
            category: 'Deployment Risk',
            value: risk.title,
            type: 'risk',
            data: {
              title: risk.title,
              severity: risk.severity === 'Critical' ? 'High' : risk.severity || 'Medium',
              description: risk.description || '',
              impact: risk.impact || '',
              mitigation: risk.mitigation || '',
              owner: risk.ownerName || 'Unassigned'
            },
            status: 'accepted'
          })),
          ...extracted.productSignals.map((signal, idx) => ({
            id: `ex-signal-${idx}`,
            category: 'Product Signal',
            value: `${signal.theme}: ${signal.evidence}`,
            status: 'accepted'
          })),
          ...extracted.recommendedNextSteps.map((step, idx) => ({
            id: `ex-step-${idx}`,
            category: 'Recommended Next Step',
            value: step,
            status: 'accepted'
          }))
        ].filter(Boolean);
        setExtractedItems(apiItems as any[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Extraction failed');
      } finally {
        setIsExtracting(false);
      }
      return;
    }

    const logSteps = [
      '>> [FDE OS v1] Initializing neural extractor engine...',
      '>> Connected securely to Gemini flash-3.5 backend cluster.',
      '>> Loading raw transcript character sequences...',
      '>> Analyzing context vectors and isolating business intents...',
      '>> Scanning transcript for Commitments, Actions, Deadlines, and People...',
      '>> Extracting Product Feedback patterns & Compliance constraints...',
      '>> Correlating historical entity graphs with current systems list...',
      '>> Success. Formulating structured deployment brief updates...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSteps.length) {
        setTerminalLogs((prev) => [...prev, logSteps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsExtracting(false);
        setExtractedItems(MOCK_EXTRACTIONS);
      }
    }, 450);
  };

  const updateItemStatus = (id: string, status: 'accepted' | 'rejected') => {
    if (!canApprove) return;
    if (!extractedItems) return;
    setExtractedItems(
      extractedItems.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const applyWorkspaceUpdates = async () => {
    if (!canApprove) return;
    if (!extractedItems) return;

    const accepted = extractedItems.filter((i) => i.status === 'accepted');
    if (accepted.length === 0) return;

    if (engagement.backendId && noteId) {
      try {
        await notesApi.applyExtraction({
          noteId,
          applyToEngagement: true,
          createCommitments: true,
          createRisks: true,
          createProductSignals: true
        });
        alert('Workspace updated from notes.');
        setExtractedItems(null);
        setInputText('');
        window.dispatchEvent(new CustomEvent('fdeos-refresh-engagement'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to apply extraction');
      }
      return;
    }

    let updated = { ...engagement };

    accepted.forEach((item) => {
      if (item.type === 'stakeholder') {
        const exists = updated.stakeholders.some(s => s.email === item.data.email);
        if (!exists) {
          updated.stakeholders = [...updated.stakeholders, item.data];
        }
      } else if (item.type === 'commitment') {
        const id = 'c-ex-' + Math.random().toString(36).substr(2, 5);
        updated.commitments = [...updated.commitments, { id, ...item.data }];
      } else if (item.type === 'risk') {
        const id = 'r-ex-' + Math.random().toString(36).substr(2, 5);
        updated.risks = [...updated.risks, { id, ...item.data, status: 'Open' }];
      }
    });

    onUpdateEngagement(updated);
    setExtractedItems(null);
    setInputText('');
    alert('Extracted intelligence elements successfully integrated into this Engagement workspace!');
  };

  return (
    <div className="space-y-6" id="notes-intelligence-content">
      {/* Permission message */}
      {(!canExtract || !canApprove) && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 px-4 py-3 rounded-xl text-xs flex flex-col gap-1 font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>[Limited System Scope]</strong> Current role <strong>{currentRole}</strong> suffers restricted permissions:</span>
          </div>
          <ul className="list-disc pl-8 mt-1 space-y-0.5">
            {!canExtract && <li>Neural transcript extraction is locked.</li>}
            {!canApprove && <li>Decoupled approvals mechanism. Cannot integrate extracted components.</li>}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm">
        <label className="block text-sm font-bold text-zinc-800 mb-2">
          Paste meeting notes, calls transcript, Slack snippets, or email excerpts
        </label>
        <p className="text-[11px] text-zinc-500 mb-3 font-mono leading-relaxed">
          AI will extract objectives, actors mentioned, concrete commitments with tentative dates, blocker elements, and product team feedback automatically.
        </p>

        {error && (
          <div className="mb-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg px-3 py-2 text-xs font-mono">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-indigo-500"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title"
          />
          <select
            className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-indigo-500"
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
          >
            <option>Meeting Notes</option>
            <option>Transcript</option>
            <option>Slack Snippet</option>
            <option>Email Excerpt</option>
            <option>Sales Notes</option>
            <option>Other</option>
          </select>
        </div>

        <textarea
          rows={6}
          disabled={!canExtract}
          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-800 font-mono focus:outline-indigo-500 focus:bg-white transition-all resize-none disabled:opacity-60"
          placeholder={canExtract ? "[Insert Call Transcript or Notes here, e.g.]\nMet with Diana and Priscilla from operations today. Priscilla Wells is joining as Associate VP Analytics. She will be a core stakeholder..." : "[Extraction Disabled]"}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>

        <div className="flex justify-between items-center mt-3">
          <button
            disabled={!canExtract}
            onClick={() => setInputText(`Met with dynamic stakeholders today at ${engagement.customer}. Priscilla Wells is joining as Associate VP Analytics. She requested Sarah to deploy the sandbox instance version 1.4 by next Friday to verify legal compliance caching. Priscilla mentioned they are anxious to get our API running behind their on-prem private proxy cluster and will provide OAuth API configurations by Wednesday, but worried about latency constraints over VPN. They will review compliance routes by next Tuesday.`)}
            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-mono tracking-wide cursor-pointer font-semibold underline disabled:opacity-40"
          >
            Load Realistic Demo Copy
          </button>

          <button
            onClick={triggerExtraction}
            disabled={isExtracting || !inputText.trim() || !canExtract}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_2px_8px_rgba(79,70,229,0.2)]"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Extracting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Extract Deployment Intelligence
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Loader Logs */}
      {isExtracting && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-[11px] text-emerald-400 space-y-1 shadow-inner animate-pulse">
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </div>
          ))}
          <div className="flex gap-2 items-center text-zinc-400 animate-bounce mt-1">
            <span>▋ Running semantic entity classification models...</span>
          </div>
        </div>
      )}

      {/* Extracted Artifacts View */}
      {extractedItems && !isExtracting && (
        <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-zinc-800">Extracted Intelligence Output</h4>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Please audit, approve, or edit individual artifacts before applying them directly to the main workspace.</p>
            </div>
            <button
              onClick={applyWorkspaceUpdates}
              disabled={!canApprove || extractedItems.filter(i => i.status === 'accepted').length === 0}
              className="bg-zinc-900 text-white font-bold text-xs px-4 py-1.5 rounded-lg hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 cursor-pointer self-start transition-all"
            >
              {canApprove ? "Apply Accepted to Workspace" : "🔒 Approval Locked"}
            </button>
          </div>

          <div className="space-y-3">
            {extractedItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 border rounded-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  item.status === 'accepted'
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : item.status === 'rejected'
                      ? 'border-rose-100 bg-rose-50/10 opacity-60'
                      : 'border-zinc-200 hover:bg-zinc-50/50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase border ${
                      item.type === 'commitment'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : item.type === 'stakeholder'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {item.category}
                    </span>
                    {item.status === 'accepted' && (
                      <span className="text-[10px] text-emerald-600 font-mono font-semibold">Accepted ✓</span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="text-[10px] text-rose-500 font-mono line-through">Rejected</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-700 font-mono">{item.value}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  <button
                    disabled={!canApprove}
                    onClick={() => updateItemStatus(item.id, 'accepted')}
                    className={`p-1.5 rounded border transition-colors cursor-pointer disabled:opacity-40 ${
                      item.status === 'accepted'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                    title="Accept & Add to live records"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={!canApprove}
                    onClick={() => updateItemStatus(item.id, 'rejected')}
                    className={`p-1.5 rounded border transition-colors cursor-pointer disabled:opacity-40 ${
                      item.status === 'rejected'
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:text-rose-500 hover:bg-rose-50'
                    }`}
                    title="Reject feedback"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 3. COMMITMENTS TAB
// ----------------------------------------------------
function CommitmentsTab({ engagement, onUpdateEngagement, currentRole, rolePermissions, onRefreshEngagement }: WorkspaceTabsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newCommitment, setNewCommitment] = useState({
    title: '',
    owner: '',
    type: 'Vendor' as 'Vendor' | 'Customer' | 'Shared',
    dueDate: '',
    status: 'Open' as 'Open' | 'Waiting' | 'Done' | 'At Risk',
    source: 'Engagement Notes Integration'
  });

  const canCreate = rolePermissions?.commitments?.create !== false;
  const canEdit = rolePermissions?.commitments?.edit !== false;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    if (!newCommitment.title || !newCommitment.owner || !newCommitment.dueDate) return;

    let id = 'c-' + Math.random().toString(36).substr(2, 5);
    if (engagement.backendId) {
      const created = await commitmentsApi.create(engagement.backendId, {
        text: newCommitment.title,
        ownerName: newCommitment.owner,
        ownerType: newCommitment.type,
        dueDate: newCommitment.dueDate,
        status: newCommitment.status,
        sourceExcerpt: newCommitment.source
      });
      id = created._id;
    }
    const added: Commitment = {
      id,
      ...newCommitment,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    onUpdateEngagement({
      ...engagement,
      commitments: [added, ...engagement.commitments]
    });

    setNewCommitment({
      title: '',
      owner: '',
      type: 'Vendor',
      dueDate: '',
      status: 'Open',
      source: 'Manual Command Form'
    });
    setShowAdd(false);
    onRefreshEngagement?.();
  };

  const toggleStatus = async (id: string) => {
    if (!canEdit) return;
    const nextStates: Record<any, any> = {
      'Open': 'Waiting',
      'Waiting': 'Done',
      'Done': 'At Risk',
      'At Risk': 'Open'
    };

    const updated = engagement.commitments.map((cmt) => {
      if (cmt.id === id) {
        if (cmt.backendId) commitmentsApi.update(cmt.backendId, { status: nextStates[cmt.status] as any }).then(() => onRefreshEngagement?.()).catch((err) => alert(err.message));
        return {
          ...cmt,
          status: nextStates[cmt.status] as any,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return cmt;
    });

    onUpdateEngagement({
      ...engagement,
      commitments: updated
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Waiting':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'At Risk':
        return 'bg-rose-50 text-rose-800 border-rose-200 font-bold animate-pulse';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6" id="commitments-tab-content">
      {/* Read-only Alert Bar */}
      {(!canCreate || !canEdit) && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 px-4 py-3 rounded-xl text-xs flex flex-col gap-1 font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>[Read-only Ledger]</strong> Current role <strong>{currentRole}</strong> has limited capabilities:</span>
          </div>
          <ul className="list-disc pl-8 mt-1 space-y-0.5">
            {!canCreate && <li>Booking new commitments is locked.</li>}
            {!canEdit && <li>Toggling or editing live commitment statuses is locked.</li>}
          </ul>
        </div>
      )}

      {/* Metrics Summary Columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['All Ledger Items', 'Done', 'Waiting', 'At Risk'].map((metric) => {
          let value = 0;
          if (metric === 'All Ledger Items') value = engagement.commitments.length;
          else if (metric === 'Done') value = engagement.commitments.filter(c => c.status === 'Done').length;
          else if (metric === 'Waiting') value = engagement.commitments.filter(c => c.status === 'Waiting').length;
          else if (metric === 'At Risk') value = engagement.commitments.filter(c => c.status === 'At Risk').length;

          return (
            <div key={metric} className="bg-white rounded-xl border border-zinc-200/80 p-4 shadow-sm">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block tracking-wider mb-1">{metric}</span>
              <span className="text-xl font-black text-zinc-900 font-sans">{value}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-zinc-800 font-sans">Corporate Commitments Ledger</h4>
          </div>
          {canCreate && (
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Book Commitment
            </button>
          )}
        </div>

        {showAdd && canCreate && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-zinc-50 border-b border-zinc-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Commitment & Scope Description</label>
              <input
                type="text"
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                placeholder="e.g. Provide production client security docs"
                value={newCommitment.title}
                onChange={(e) => setNewCommitment({ ...newCommitment, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Owner Name</label>
              <input
                type="text"
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                placeholder="e.g. John Miller"
                value={newCommitment.owner}
                onChange={(e) => setNewCommitment({ ...newCommitment, owner: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Owner Entity Alignment</label>
              <select
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                value={newCommitment.type}
                onChange={(e) => setNewCommitment({ ...newCommitment, type: e.target.value as any })}
              >
                <option value="Vendor">Vendor (Our Team)</option>
                <option value="Customer">Customer (Their Team)</option>
                <option value="Shared">Shared Collaboration</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Target Due Date</label>
              <input
                type="date"
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                value={newCommitment.dueDate}
                onChange={(e) => setNewCommitment({ ...newCommitment, dueDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Initial Status</label>
              <select
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                value={newCommitment.status}
                onChange={(e) => setNewCommitment({ ...newCommitment, status: e.target.value as any })}
              >
                <option value="Open">Open</option>
                <option value="Waiting">Waiting</option>
                <option value="Done">Completed</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>
            <div className="flex items-end justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs rounded font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-950 text-white text-xs rounded font-bold cursor-pointer"
              >
                Save Item
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono text-[10px] uppercase">
                <th className="p-4 font-semibold">Commitment Title</th>
                <th className="p-4 font-semibold">Owner</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold text-center">Status {canEdit && "(Click to toggle)"}</th>
                <th className="p-4 font-semibold">Source Snippet</th>
                <th className="p-4 font-semibold">Last Synchronized</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {engagement.commitments.map((cmt) => (
                <tr key={cmt.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 font-bold text-zinc-800">{cmt.title}</td>
                  <td className="p-4 font-mono text-zinc-700">{cmt.owner}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${
                      cmt.type === 'Vendor' 
                        ? 'bg-zinc-100 text-zinc-700 border-zinc-200' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {cmt.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-zinc-650">{cmt.dueDate}</td>
                  <td className="p-4 text-center">
                    {canEdit ? (
                      <button
                        onClick={() => toggleStatus(cmt.id)}
                        className={`px-2.5 py-1 rounded border text-[10px] font-mono font-bold transition-all hover:scale-105 inline-block cursor-pointer ${getStatusStyle(cmt.status)}`}
                      >
                        {cmt.status}
                      </button>
                    ) : (
                      <span className={`px-2.5 py-1 rounded border text-[10px] font-mono font-bold opacity-75 inline-block ${getStatusStyle(cmt.status)}`}>
                        🔒 {cmt.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-zinc-500 italic max-w-xs truncate" title={cmt.source}>{cmt.source}</td>
                  <td className="p-4 font-mono text-zinc-400">{cmt.lastUpdated}</td>
                </tr>
              ))}
              {engagement.commitments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400 font-mono">No active commitments registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. RISKS & BLOCKERS TAB
// ----------------------------------------------------
function RisksTab({ engagement, onUpdateEngagement, currentRole, rolePermissions, onRefreshEngagement }: WorkspaceTabsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newRisk, setNewRisk] = useState({
    title: '',
    severity: 'Medium' as 'High' | 'Medium' | 'Low',
    description: '',
    impact: '',
    mitigation: '',
    owner: engagement.owner.split(' ')[0]
  });

  const canCreate = rolePermissions?.risksBlockers?.create !== false;
  const canEdit = rolePermissions?.risksBlockers?.edit !== false;

  const handleAddRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    if (!newRisk.title || !newRisk.description || !newRisk.mitigation) return;

    let id = 'r-' + Math.random().toString(36).substr(2, 5);
    if (engagement.backendId) {
      const created = await risksApi.create(engagement.backendId, {
        title: newRisk.title,
        severity: newRisk.severity,
        description: newRisk.description,
        impact: newRisk.impact,
        mitigation: newRisk.mitigation,
        ownerName: newRisk.owner
      });
      id = created._id;
    }
    const added: Risk = {
      id,
      ...newRisk,
      status: 'Open'
    };

    onUpdateEngagement({
      ...engagement,
      risks: [added, ...engagement.risks]
    });
    setNewRisk({
      title: '',
      severity: 'Medium',
      description: '',
      impact: '',
      mitigation: '',
      owner: engagement.owner.split(' ')[0]
    });
    setShowAdd(false);
    onRefreshEngagement?.();
  };

  const handleMitigateRisk = async (id: string) => {
    if (!canEdit) return;
    const updated = engagement.risks.map((risk) => {
      if (risk.id === id) {
        if (risk.backendId) risksApi.update(risk.backendId, { status: risk.status === 'Open' ? 'Mitigated' : 'Open' as any }).then(() => onRefreshEngagement?.()).catch((err) => alert(err.message));
        return {
          ...risk,
          status: (risk.status === 'Open' ? 'Mitigated' : 'Open') as any
        };
      }
      return risk;
    });

    onUpdateEngagement({
      ...engagement,
      risks: updated
    });
  };

  const calculateRiskScore = () => {
    const totalCount = engagement.risks.filter(r => r.status === 'Open').length;
    const highs = engagement.risks.filter(r => r.severity === 'High' && r.status === 'Open').length;
    const mediums = engagement.risks.filter(r => r.severity === 'Medium' && r.status === 'Open').length;

    if (totalCount === 0 && engagement.health !== 'red') return { score: '12 / 100', text: 'Low Threat', color: 'text-emerald-500' };
    if (highs >= 2 || engagement.health === 'red') return { score: '88 / 100', text: 'Critical Risk', color: 'text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)] border-rose-300' };
    if (highs === 1 || mediums >= 2) return { score: '56 / 100', text: 'Elevated At Risk', color: 'text-amber-500' };
    return { score: '34 / 100', text: 'Moderate Safe', color: 'text-sky-500' };
  };

  const scoreMetadata = calculateRiskScore();

  return (
    <div className="space-y-6" id="risks-tab-content">
      {/* Read-only Alert Bar */}
      {(!canCreate || !canEdit) && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 px-4 py-3 rounded-xl text-xs flex flex-col gap-1 font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>[Limited Access Mode]</strong> Current role <strong>{currentRole}</strong> has limited capabilities:</span>
          </div>
          <ul className="list-disc pl-8 mt-1 space-y-0.5">
            {!canCreate && <li>Adding new risk entities is disabled.</li>}
            {!canEdit && <li>Mitigating or reopening existing registered risks is disabled.</li>}
          </ul>
        </div>
      )}

      {/* Risk Analysis Score and AI Advisor Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Threat Scorecard</span>
          <span className={`text-4xl font-sans font-black leading-none ${scoreMetadata.color}`}>
            {scoreMetadata.score}
          </span>
          <span className="text-xs font-bold text-zinc-700 mt-2">{scoreMetadata.text}</span>
          <p className="text-[10px] text-zinc-400 font-mono mt-1 leading-normal">Derived from {engagement.risks.filter(r => r.status === 'Open').length} live variables</p>
        </div>

        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-md flex items-center gap-4 border border-indigo-900">
          <div className="bg-zinc-800/80 w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-zinc-700">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-mono font-bold tracking-wider text-indigo-300 uppercase leading-none">FDE OS System Advisor</h5>
            <p className="text-xs font-semibold text-zinc-100 leading-snug">
              {engagement.health === 'red'
                ? "Deployment clinical EHR blockages require synthetically partitioned HIPAA proxies. Recommend requesting a non-PII diagnostic sandbox payload from internal sponsors immediately."
                : "Operational factors indicate strong timeline integrity. Ensure that high latency callback variables are localized within isolated micro-queues to protect SLAs."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Active Worksite Blockers Table */}
      <div className="bg-white rounded-xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200/80 bg-zinc-50/50">
          <h4 className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">Active Workspace Blockers</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 font-mono text-[9px] uppercase text-zinc-400">
                <th className="p-3 font-semibold">Blocker Title</th>
                <th className="p-3 font-semibold">Target Stage</th>
                <th className="p-3 font-semibold">Owner</th>
                <th className="p-3 font-semibold">Days Unresolved</th>
                <th className="p-3 font-semibold">AI Recommended Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {engagement.blockers.map((blk) => (
                <tr key={blk.id} className="hover:bg-rose-50/5 whitespace-normal">
                  <td className="p-3 font-bold text-zinc-800 flex items-center gap-2">
                    <BadgeAlert className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{blk.title}</span>
                  </td>
                  <td className="p-3 font-mono">{blk.stage}</td>
                  <td className="p-3 font-mono text-zinc-900 font-bold">{blk.owner}</td>
                  <td className="p-3 font-mono font-bold text-rose-600">{blk.ageDays} days</td>
                  <td className="p-3 italic text-zinc-500 font-mono sm:text-[11px]">{blk.nextAction}</td>
                </tr>
              ))}
              {engagement.blockers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-zinc-400 font-mono">No active blockers holding this deployment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risks Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-zinc-800">Deployment Risk Registry</h4>
          {canCreate && (
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Corporate Risk Factor
            </button>
          )}
        </div>

        {showAdd && canCreate && (
          <form onSubmit={handleAddRisk} className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Risk Description Title</label>
              <input
                type="text"
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                placeholder="e.g. Host firewall exception blocking API calls"
                value={newRisk.title}
                onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Severity Tier</label>
              <select
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                value={newRisk.severity}
                onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value as any })}
              >
                <option value="High">High Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="Low">Low Severity</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Primary Owner</label>
              <input
                type="text"
                className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500"
                placeholder="Sarah Connor"
                value={newRisk.owner}
                onChange={(e) => setNewRisk({ ...newRisk, owner: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Business Impact Description</label>
              <textarea
                rows={2}
                className="w-full bg-white border border-zinc-300 rounded p-2 text-xs text-zinc-800 focus:outline-indigo-500 resize-none font-sans"
                placeholder="What happens if this risk materializes?"
                value={newRisk.description}
                onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-mono text-zinc-600 block mb-1">Mitigation Plan & Playbook Safeguards</label>
              <textarea
                rows={2}
                className="w-full bg-white border border-zinc-300 rounded p-2 text-xs text-zinc-800 focus:outline-indigo-500 resize-none font-sans"
                placeholder="What operational step resolves this?"
                value={newRisk.mitigation}
                onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 bg-zinc-200 text-zinc-700 rounded hover:bg-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-zinc-900 text-white rounded hover:bg-zinc-950 font-bold cursor-pointer"
              >
                Save Risk Profile
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {engagement.risks.map((risk) => {
            const isMitigated = risk.status === 'Mitigated';
            return (
              <div
                key={risk.id}
                className={`bg-white rounded-xl border p-5 shadow-sm transition-all duration-200 relative ${
                  isMitigated
                    ? 'border-zinc-200 bg-zinc-50/40 opacity-70'
                    : risk.severity === 'High'
                      ? 'border-rose-100/90 shadow-sm hover:border-rose-200'
                      : 'border-zinc-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border inline-block mb-1.5 ${
                      isMitigated
                        ? 'bg-zinc-100 text-zinc-500 border-zinc-200'
                        : risk.severity === 'High'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {risk.severity} Risk
                    </span>
                    <h5 className={`text-xs font-bold ${isMitigated ? 'line-through text-zinc-500' : 'text-zinc-800'}`}>
                      {risk.title}
                    </h5>
                  </div>
                  {canEdit ? (
                    <button
                      onClick={() => handleMitigateRisk(risk.id)}
                      className={`px-2 py-1 h-fit text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                        isMitigated
                          ? 'bg-zinc-200 text-zinc-700 border-zinc-300 hover:bg-zinc-350'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {isMitigated ? 'Reopen' : 'Mitigate ✓'}
                    </button>
                  ) : (
                    <span className={`px-2 py-1 h-fit text-[10px] font-mono rounded border border-zinc-200 bg-zinc-50 text-zinc-400 opacity-60 inline-block`}>
                      🔒 {isMitigated ? 'Mitigated' : 'Open'}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block tracking-wider uppercase">Business Threat Case</span>
                    <p className="text-xs text-zinc-650 mt-0.5 leading-relaxed">{risk.description}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block tracking-wider uppercase">Mitigation Action</span>
                    <p className="text-xs font-mono text-zinc-800 mt-1 pl-2 border-l-2 border-indigo-500 bg-zinc-50 p-2 rounded">
                      {risk.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. PRODUCT FEEDBACK TAB
// ----------------------------------------------------
function ProductFeedbackTab({ engagement, onUpdateEngagement, currentRole, rolePermissions, onRefreshEngagement }: WorkspaceTabsProps) {
  const [syncedSignals, setSyncedSignals] = useState<Record<string, boolean>>({});

  const canEdit = rolePermissions?.productSignals?.edit !== false;

  const handlePushToBrief = async (id: string) => {
    if (!canEdit) return;
    const signal = engagement.productSignals.find((item) => item.id === id);
    if (signal?.backendId) {
      await productSignalsApi.update(signal.backendId, { status: 'Sent to Product' });
      onRefreshEngagement?.();
    }
    setSyncedSignals({
      ...syncedSignals,
      [id]: true
    });
  };

  return (
    <div className="space-y-6" id="product-feedback-content">
      {/* Read-only Alert Bar */}
      {!canEdit && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>[Read-only Slate]</strong> Current role <strong>{currentRole}</strong> does not have permission to sync signals to product briefs.
          </span>
        </div>
      )}

      {/* Overview theme blocks */}
      <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm">
        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest leading-none mb-1">DEPLOYMENT FIELD INTELLIGENCE</h3>
        <p className="text-sm font-semibold text-zinc-800">Captured Product Signals</p>
        <p className="text-xs text-zinc-500 leading-normal mt-1">
          These product requests are automatically parsed from your transcript history. Pushing these to product brief aggregates ARR impact for the engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core theme aggregator list */}
        <div className="lg:col-span-3 space-y-4">
          {engagement.productSignals.map((signal) => {
            const isSynced = syncedSignals[signal.id];
            return (
              <div key={signal.id} className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-300 transition-all duration-250">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-zinc-800 text-zinc-100 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                      {signal.type}
                    </span>
                    <span className="bg-indigo-50/60 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
                      Theme: {signal.theme}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      (Frequency: {signal.frequency}x across target sites)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Direct Customer Evidence Snippet</span>
                    <p className="text-xs text-zinc-800 italic bg-zinc-50 border border-zinc-100 p-3 rounded-lg leading-relaxed">
                      "{signal.evidence}"
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-[11px] font-mono">
                    <div>
                      <span className="text-zinc-400 uppercase mr-1">Target Priority:</span>
                      <span className="font-bold text-zinc-900">{signal.priority}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 uppercase mr-1">Customer Impact Case:</span>
                      <span className="text-zinc-650">{signal.customerImpact}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  <button
                    disabled={isSynced || !canEdit}
                    onClick={() => handlePushToBrief(signal.id)}
                    className={`font-semibold text-xs px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-55 ${
                      isSynced
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 cursor-default'
                        : !canEdit
                          ? 'bg-zinc-100 text-zinc-400 border-zinc-250'
                          : 'bg-zinc-900 text-white border-zinc-950 hover:bg-zinc-800'
                    }`}
                  >
                    {isSynced ? '✓ Synced to Product Brief' : canEdit ? 'Send to Product Brief' : '🔒 Sync Restricted'}
                  </button>
                </div>
              </div>
            );
          })}

          {engagement.productSignals.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-zinc-200 p-8 text-center text-zinc-500 font-sans">
              <FolderDot className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs font-mono">No product signals detected in active transcripts. Run Notes Extractor to capture telemetry indicators.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. READINESS TAB
// ----------------------------------------------------
function ReadinessTab({ engagement, onUpdateEngagement, currentRole, rolePermissions, onRefreshEngagement }: WorkspaceTabsProps) {
  const categoriesList = [
    'Business Readiness',
    'Data Readiness',
    'Security Readiness',
    'Integration Readiness',
    'AI Evaluation Readiness',
    'Production Readiness',
    'Handoff Readiness'
  ] as const;

  const canEdit = rolePermissions?.readiness?.edit !== false;

  const handleToggleCheck = async (id: string) => {
    if (!canEdit) return;
    const target = engagement.readiness.find((item) => item.id === id);
    if (target?.backendId) {
      await readinessApi.update(target.backendId, { status: target.checked ? 'In Progress' : 'Complete' });
      onRefreshEngagement?.();
    }
    const updated = engagement.readiness.map((item) => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });

    onUpdateEngagement({
      ...engagement,
      readiness: updated
    });
  };

  // Calculations
  const checkedItemsCount = engagement.readiness.filter((r) => r.checked).length;
  const totalItemsCount = engagement.readiness.length || 1;
  const overallPercentage = Math.round((checkedItemsCount / totalItemsCount) * 100);

  // Find weakest area
  const categoryStats = categoriesList.map((cat) => {
    const items = engagement.readiness.filter((r) => r.category === cat);
    const checked = items.filter((r) => r.checked).length;
    const total = items.length;
    const percentage = total > 0 ? (checked / total) * 100 : 100;
    return { category: cat, percentage, total };
  }).filter(c => c.total > 0);

  const weakest = categoryStats.reduce(
    (min, cur) => (cur.percentage < min.percentage ? cur : min),
    { category: 'None', percentage: 100 }
  );

  return (
    <div className="space-y-6" id="readiness-tab-content">
      {/* Read-only Alert Bar */}
      {!canEdit && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>[Read-only Checklist]</strong> Current role <strong>{currentRole}</strong> does not have permission to check off checklist items.
          </span>
        </div>
      )}

      {/* Score and recommendations banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center font-bold">
            {/* SVG circle percentage graph */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-zinc-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-650 transition-all duration-700"
                strokeWidth="3.5"
                strokeDasharray={`${overallPercentage}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-black text-indigo-900 font-sans">{overallPercentage}%</span>
          </div>

          <div>
            <span className="text-[9px] font-mono text-zinc-400 block tracking-widest uppercase">READINESS SCORE</span>
            <p className="text-xs font-bold text-zinc-800 leading-snug">Deployment Pipeline Readiness Score</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{checkedItemsCount}/ {totalItemsCount} checkpoints resolved</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm space-y-1.5 flex flex-col justify-center">
          <span className="text-[9px] font-mono text-amber-600 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded w-fit uppercase leading-none">
            DIAGNOSTIC EXPOSURE SUMMARY
          </span>
          <p className="text-xs text-zinc-800 font-semibold leading-relaxed">
            {weakest.category !== 'None' && weakest.percentage < 100
              ? `Weakest Area detected in [${weakest.category}] (${Math.round(weakest.percentage)}% configured). To unlock production transition, you must resolve downstream dependencies.`
              : `All systems and scoping requirements meet minimal corporate launch SLAs. Ready to proceed to final sandbox pilot run.`
            }
          </p>
        </div>
      </div>

      {/* Directory of categorized checkboards */}
      {engagement.backendId && engagement.readiness.length === 0 && canEdit && (
        <div className="bg-white rounded-xl border border-dashed border-zinc-200 p-8 text-center">
          <p className="text-xs text-zinc-500 font-mono mb-3">No readiness checklist exists for this workspace yet.</p>
          <button
            onClick={async () => {
              await readinessApi.createDefaults(engagement.backendId!);
              onRefreshEngagement?.();
            }}
            className="bg-zinc-900 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            Create Default Checklist
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoriesList.map((cat, catIdx) => {
          const items = engagement.readiness.filter((r) => r.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                <h5 className="text-xs font-bold text-zinc-800">{cat}</h5>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {items.filter(i => i.checked).length} / {items.length} cleared
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      disabled={!canEdit}
                      onChange={() => handleToggleCheck(item.id)}
                      className="mt-0.5 w-4 h-4 text-indigo-600 bg-zinc-100 border-zinc-300 rounded focus:ring-indigo-500 cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <p className={`text-xs font-bold leading-normal ${item.checked ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>
                        {item.title}
                      </p>
                      {item.notes && (
                        <p className={`text-[10px] font-mono leading-relaxed mt-0.5 ${item.checked ? 'text-zinc-400' : 'text-zinc-500 bg-zinc-50 p-1.5 rounded border border-zinc-100'}`}>
                          {item.notes}
                        </p>
                      )}
                      {item.riskTag && !item.checked && (
                        <span className="bg-rose-50 border border-rose-100 text-[9px] text-rose-700 px-1 py-0.5 font-mono rounded mt-1.5 inline-block font-semibold">
                          {item.riskTag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 7. STATUS UPDATES TAB
// ----------------------------------------------------
function StatusUpdatesTab({ engagement, onUpdateEngagement, currentRole, rolePermissions, onRefreshEngagement }: WorkspaceTabsProps) {
  const [tone, setTone] = useState<'Executive' | 'Technical' | 'Customer'>('Executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeUpdate, setActiveUpdate] = useState<StatusUpdate | null>(() => {
    return engagement.statusUpdates.length > 0 ? engagement.statusUpdates[0] : null;
  });

  const canCreate = rolePermissions?.statusUpdates?.create !== false;

  const generateStatusUpdate = async () => {
    if (!canCreate) return;
    setIsGenerating(true);

    if (engagement.backendId) {
      try {
        const generatedApi = await statusUpdatesApi.generate({
          engagementId: engagement.backendId,
          tone: tone === 'Customer' ? 'Customer-Friendly' : tone
        });
        const generated: StatusUpdate = {
          id: generatedApi._id,
          backendId: generatedApi._id,
          date: generatedApi.createdAt?.slice(0, 10) || new Date().toISOString().split('T')[0],
          tone: generatedApi.tone === 'Customer-Friendly' ? 'Customer' : generatedApi.tone,
          summary: generatedApi.summary,
          completed: generatedApi.completedThisPeriod,
          blockers: generatedApi.currentBlockers,
          decisions: generatedApi.decisionsNeeded,
          nextSteps: generatedApi.nextSteps
        };
        setActiveUpdate(generated);
        onUpdateEngagement({
          ...engagement,
          statusUpdates: [generated, ...engagement.statusUpdates]
        });
        onRefreshEngagement?.();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Unable to generate status update');
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    setTimeout(() => {
      setIsGenerating(false);

      let summary = '';
      let completed: string[] = [];
      let blockers: string[] = [];
      let decisions: string[] = [];
      let nextSteps: string[] = [];

      if (tone === 'Executive') {
        summary = `Corporate high-confidence briefing outlining active deployment variables for ${engagement.customer}. Core deliverables track against timeline projections, with operations and risk factors aligned.`;
        completed = [
          `Finalized sandbox prototype flow modeling of baseline datasets.`,
          `Synchronized all technical requirements mapping configurations.`
        ];
        blockers = engagement.blockers.map((b) => b.title) || [`No major strategic timeline dependencies reported.`];
        decisions = [`Standardized model threshold parameters mapping metrics.`];
        nextSteps = [
          `Prepare executive steering group showcase and sandbox validations on June 22nd.`,
          `Commence formal Production Hardening architecture checks.`
        ];
      } else if (tone === 'Technical') {
        summary = `FDE deployment logs for ${engagement.customer}. System integration and architecture tracking variables live. Epic, SAP, or telemetry connectors operating at benchmark cluster conditions.`;
        completed = [
          `Built Kafka consumer modules inside container networks.`,
          `Achieved 97.2% classification latency under mock stress loads.`
        ];
        blockers = engagement.blockers.map((b) => b.title) || [`Review private tenant VPC routes configuration.`];
        decisions = [`Migrate webhook endpoints payload validation schemes.`];
        nextSteps = [
          `Hold schema engineering and Kafka cluster review standups.`,
          `Verify network gateway IP exceptions range mappings.`
        ];
      } else {
        summary = `Weekly project update alignment for our colleagues at ${engagement.customer}. Our combined team is making rapid strides to automate workloads and save manual dispatcher or researcher effort.`;
        completed = [
          `Finished customer experience prototype demonstration dashboard.`,
          `Incorporated operational review feedback details.`
        ];
        blockers = [`Awaiting transactional field schema catalogs from administrative leads.`];
        decisions = [`Decided to deploy on-prem isolated containers to safeguard privacy.`];
        nextSteps = [
          `Distribute login sandboxes to core pilot users for initial feedback runs.`,
          `Host support desk training orientation session.`
        ];
      }

      const generated: StatusUpdate = {
        id: 'su-' + Math.random().toString(36).substr(2, 5),
        date: new Date().toISOString().split('T')[0],
        tone,
        summary,
        completed,
        blockers,
        decisions,
        nextSteps
      };

      setActiveUpdate(generated);

      // Persist generated status update
      onUpdateEngagement({
        ...engagement,
        statusUpdates: [generated, ...engagement.statusUpdates]
      });

    }, 800);
  };

  const copyToClipboard = () => {
    if (!activeUpdate) return;
    const text = `STATUS BRIEFD: ${engagement.customer} (${activeUpdate.date}) - TONE: ${activeUpdate.tone}
Summary: ${activeUpdate.summary}

COMPLETED:
${activeUpdate.completed.map(c => `- ${c}`).join('\n')}

BLOCKERS:
${activeUpdate.blockers.map(b => `- ${b}`).join('\n')}

NEXT STEPS:
${activeUpdate.nextSteps.map(n => `- ${n}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="status-updates-tab">
      {/* Read-only Alert Bar */}
      {!canCreate && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>[Generation Restricted]</strong> Current role <strong>{currentRole}</strong> does not have permission to run AI-assisted status compiles.
          </span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-zinc-800">Automated Status Update Generator</h4>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Generate customized, high-quality progress updates using real metrics and ledger history.</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              disabled={!canCreate}
              className="bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-indigo-500 disabled:opacity-50"
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
            >
              <option value="Executive">Executive Summary Tone</option>
              <option value="Technical">Technical Engineer Tone</option>
              <option value="Customer">Friendly Sponsor Tone</option>
            </select>

            <button
              onClick={generateStatusUpdate}
              disabled={isGenerating || !canCreate}
              className="bg-indigo-650 hover:bg-indigo-700 disabled:bg-zinc-200 text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-all disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compiling...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> {canCreate ? 'Generate Update' : 'Locked'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Update Preview */}
        <div className="lg:col-span-2 space-y-4">
          {activeUpdate ? (
            <div className="bg-white rounded-xl border border-zinc-200/80 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                    {activeUpdate.tone} Update
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">Date: {activeUpdate.date}</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="text-xs text-zinc-650 hover:text-indigo-650 flex items-center gap-1 font-mono hover:scale-105 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> {copied ? '✓ Copied' : 'Copy Text'}
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h5 className="font-mono text-[10px] uppercase text-zinc-400 font-semibold mb-1">Brief Summary</h5>
                  <p className="text-zinc-800 font-semibold leading-relaxed p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                    {activeUpdate.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Completed list */}
                  <div className="space-y-2">
                    <h5 className="font-mono text-[10px] uppercase text-zinc-400 font-semibold border-b border-zinc-150 pb-1">Completed Deliverables</h5>
                    <ul className="space-y-1.5 list-disc pl-4 text-zinc-750">
                      {activeUpdate.completed.map((c, i) => (
                        <tr key={i}>
                          <li className="leading-relaxed">{c}</li>
                        </tr>
                      ))}
                    </ul>
                  </div>

                  {/* Blockers list */}
                  <div className="space-y-2">
                    <h5 className="font-mono text-[10px] uppercase text-rose-500 font-semibold border-b border-rose-100 pb-1">Identified Concerns / Blockers</h5>
                    <ul className="space-y-1.5 list-disc pl-4 text-zinc-750">
                      {activeUpdate.blockers.map((b, i) => (
                        <tr key={i}>
                          <li className="leading-relaxed">{b}</li>
                        </tr>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-zinc-100">
                  {/* Decisions */}
                  <div className="space-y-2">
                    <h5 className="font-mono text-[10px] uppercase text-zinc-455 font-semibold">Key Decisions Reached</h5>
                    <ul className="space-y-1 list-disc pl-4 text-zinc-650">
                      {activeUpdate.decisions.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Operational Next Steps */}
                  <div className="space-y-2">
                    <h5 className="font-mono text-[10px] uppercase text-zinc-455 font-semibold">Scheduled Next Actions</h5>
                    <ul className="space-y-1 list-disc pl-4 text-zinc-650">
                      {activeUpdate.nextSteps.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-zinc-200 p-12 text-center text-zinc-400 font-sans">
              <FileText className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs font-mono">No update generated. Select tone above and click "Generate Update".</p>
            </div>
          )}
        </div>

        {/* History of update briefs */}
        <div className="bg-white rounded-xl border border-zinc-200/80 p-5 shadow-sm h-fit">
          <h4 className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider mb-3">Status Vault History</h4>
          <div className="space-y-2">
            {engagement.statusUpdates.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveUpdate(item)}
                className={`w-full p-2.5 rounded-lg border text-left flex flex-col justify-between hover:bg-zinc-50 border-zinc-200 ${
                  activeUpdate?.id === item.id 
                    ? 'border-indigo-500 bg-indigo-50/10' 
                    : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-[11px] text-zinc-800">
                    {item.tone} Update
                  </span>
                  <span className="text-[10px] text-zinc-450 font-mono">{item.date}</span>
                </div>
                <p className="text-[10px] text-zinc-500 truncate leading-snug w-full mt-1.5 font-mono">{item.summary}</p>
              </button>
            ))}
            {engagement.statusUpdates.length === 0 && (
              <p className="text-[10px] text-zinc-400 font-mono py-2">Historical statuses list is empty.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
