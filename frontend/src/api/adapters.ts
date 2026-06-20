import { Engagement, DeploymentHealth, DeploymentStage, ProductThemeAggregate, UserRole, RolePermissions } from '../types';
import { ApiEngagement } from '../types/engagement';
import { ApiCommitment } from '../types/commitment';
import { ApiRisk } from '../types/risk';
import { ApiProductSignal } from '../types/productSignal';
import { ApiReadinessItem } from '../types/readiness';
import { ApiStatusUpdate } from '../types/statusUpdate';
import { ApiNote } from '../types/note';

export const roleKeyToUiRole = (roleKey?: string): UserRole => {
  if (roleKey === 'fde') return 'FDE';
  if (roleKey === 'fde_manager') return 'FDE Manager';
  if (roleKey === 'executive') return 'Executive';
  if (roleKey === 'product_manager') return 'Product Manager';
  return 'Admin';
};

export const uiRoleToRoleKey = (role: UserRole) => {
  if (role === 'FDE') return 'fde';
  if (role === 'FDE Manager') return 'fde_manager';
  if (role === 'Executive') return 'executive';
  if (role === 'Product Manager') return 'product_manager';
  return 'admin';
};

export const permissionsToUiPermissions = (permissions: string[]): RolePermissions => ({
  engagements: {
    view: permissions.some((p) => p.startsWith('engagement:view')),
    create: permissions.includes('engagement:create'),
    edit: permissions.some((p) => p.startsWith('engagement:update'))
  },
  notesIntelligence: {
    view: permissions.some((p) => p.startsWith('notes:view')),
    extract: permissions.includes('notes:extract_ai'),
    approve: permissions.includes('notes:apply_extraction')
  },
  commitments: {
    view: permissions.some((p) => p.startsWith('commitment:view')),
    create: permissions.includes('commitment:create'),
    edit: permissions.some((p) => p.startsWith('commitment:update'))
  },
  risksBlockers: {
    view: permissions.some((p) => p.startsWith('risk:view')),
    create: permissions.includes('risk:create'),
    edit: permissions.some((p) => p.startsWith('risk:update'))
  },
  productSignals: {
    view: permissions.some((p) => p.startsWith('product_signal:view')),
    create: permissions.includes('product_signal:create'),
    edit: permissions.some((p) => p.startsWith('product_signal:update')) || permissions.includes('product_signal:send_to_roadmap')
  },
  readiness: {
    view: permissions.includes('readiness:view'),
    check: permissions.includes('readiness:update'),
    edit: permissions.includes('readiness:update')
  },
  statusUpdates: {
    view: permissions.includes('status_update:view'),
    create: permissions.includes('status_update:generate') || permissions.includes('status_update:create')
  },
  dashboards: {
    commands: permissions.includes('dashboard:view_command_center') || permissions.includes('dashboard:view_my'),
    executive: permissions.includes('dashboard:view_executive'),
    productIntel: permissions.includes('dashboard:view_product_intelligence')
  },
  administration: {
    manageRoles: permissions.includes('admin:update_roles'),
    manageUsers: permissions.includes('admin:update_users')
  }
});

const healthToUi = (health: string): DeploymentHealth => health.toLowerCase() as DeploymentHealth;
const money = (value?: number) => (value ? `$${value.toLocaleString()}` : '$0');
const dateOnly = (value?: string) => (value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10));
const priorityToUi = (priority?: string) => (priority === 'Critical' ? 'P0' : priority === 'High' ? 'P1' : 'P2') as 'P0' | 'P1' | 'P2';
const deploymentStages: DeploymentStage[] = ['Discovery', 'Workflow Mapping', 'Technical Scoping', 'Prototype', 'Validation', 'Production Hardening', 'Handoff', 'Expansion'];

function buildStageTimeline(engagement: ApiEngagement) {
  const activeIndex = Math.max(0, deploymentStages.indexOf(engagement.deploymentStage));
  const createdDate = dateOnly(engagement.createdAt);
  const activeDate = dateOnly(engagement.lastActivityAt || engagement.updatedAt);

  return deploymentStages.slice(0, activeIndex + 1).map((stage, index) => ({
    date: index === 0 ? createdDate : activeDate,
    stage,
    note:
      index < activeIndex
        ? `${stage} completed.`
        : engagement.nextMilestone || `Current active stage: ${stage}.`,
    achieved: index < activeIndex
  }));
}

export function mapApiEngagementToUi(
  engagement: ApiEngagement,
  nested?: {
    commitments?: ApiCommitment[];
    risks?: ApiRisk[];
    productSignals?: ApiProductSignal[];
    readiness?: ApiReadinessItem[];
    notes?: ApiNote[];
    statusUpdates?: ApiStatusUpdate[];
  }
): Engagement {
  const risks = nested?.risks ?? [];
  return {
    id: engagement._id,
    backendId: engagement._id,
    customer: engagement.customerName,
    industry: engagement.industry || 'Unspecified',
    arr: money(engagement.opportunitySize),
    stage: engagement.deploymentStage,
    health: healthToUi(engagement.health),
    owner: engagement.fdeOwnerName || 'Unassigned FDE',
    objective: engagement.primaryObjective || 'Objective not captured yet.',
    problem: engagement.businessProblem || 'Business problem not captured yet.',
    workflow: engagement.targetWorkflow || 'Workflow mapping pending.',
    metric: engagement.successMetric || 'Success metric pending.',
    lastUpdated: dateOnly(engagement.updatedAt || engagement.lastActivityAt),
    executiveSummary: engagement.executiveSummary || 'No executive summary has been recorded yet.',
    stakeholders: (engagement.stakeholders ?? []).map((stakeholder, index) => ({
      name: stakeholder.name,
      role: stakeholder.role,
      email: `${stakeholder.name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/\.$/, '') || `stakeholder${index}`}@customer.local`
    })),
    systems: engagement.systemsInvolved ?? [],
    timeline: buildStageTimeline(engagement),
    currentBlocker: engagement.currentBlocker || '',
    nextMilestone: engagement.nextMilestone || 'Define next milestone.',
    blockers: risks
      .filter((risk) => ['High', 'Critical'].includes(risk.severity) && risk.status !== 'Mitigated')
      .map((risk, index) => ({
        id: risk._id,
        title: risk.title,
        stage: engagement.deploymentStage,
        owner: risk.ownerName || engagement.fdeOwnerName || 'Unassigned',
        ageDays: index + 1,
        nextAction: risk.mitigation || 'Confirm mitigation owner.'
      })),
    commitments: (nested?.commitments ?? []).map((commitment) => ({
      id: commitment._id,
      backendId: commitment._id,
      title: commitment.text,
      owner: commitment.ownerName || 'Unassigned',
      type: commitment.ownerType,
      dueDate: dateOnly(commitment.dueDate),
      status: commitment.status,
      source: commitment.sourceExcerpt || 'Backend record',
      lastUpdated: dateOnly(commitment.updatedAt || commitment.createdAt)
    })),
    risks: risks.map((risk) => ({
      id: risk._id,
      backendId: risk._id,
      title: risk.title,
      severity: risk.severity === 'Critical' ? 'High' : risk.severity,
      description: risk.description || '',
      impact: risk.impact || '',
      mitigation: risk.mitigation || '',
      owner: risk.ownerName || 'Unassigned',
      status: risk.status === 'Mitigated' ? 'Mitigated' : 'Open'
    })),
    productSignals: (nested?.productSignals ?? []).map((signal) => ({
      id: signal._id,
      backendId: signal._id,
      theme: signal.theme,
      type: signal.signalType as any,
      evidence: signal.evidence || '',
      customerImpact: signal.customerImpact || '',
      frequency: 1,
      priority: priorityToUi(signal.suggestedPriority)
    })),
    readiness: (nested?.readiness ?? []).map((item) => ({
      id: item._id,
      backendId: item._id,
      category: item.category as any,
      title: item.text,
      checked: item.status === 'Complete',
      owner: item.ownerName || '',
      notes: item.notes || '',
      riskTag: item.riskTag
    })),
    notesHistory: (nested?.notes ?? []).map((note) => ({
      id: note._id,
      date: dateOnly(note.createdAt),
      title: `${note.title} (${note.sourceType}, ${note.extractionStatus})`,
      content: note.rawText || 'Raw note hidden by current permissions.'
    })),
    statusUpdates: (nested?.statusUpdates ?? []).map((update) => ({
      id: update._id,
      backendId: update._id,
      date: dateOnly(update.createdAt),
      tone: update.tone === 'Customer-Friendly' ? 'Customer' : update.tone,
      summary: update.summary,
      completed: update.completedThisPeriod,
      blockers: update.currentBlockers,
      decisions: update.decisionsNeeded,
      nextSteps: update.nextSteps
    }))
  };
}

export function mapProductThemeToUi(theme: {
  theme: string;
  frequency: number;
  customersAffected: number;
  opportunityImpact: number;
  suggestedPriority: string;
  evidenceSnippets: string[];
}): ProductThemeAggregate {
  return {
    theme: theme.theme,
    type: 'Aggregated Signal',
    customersAffected: [`${theme.customersAffected} customers`],
    arrImpacted: `${theme.frequency} signals`,
    evidenceSnippets: theme.evidenceSnippets,
    priority: theme.suggestedPriority === 'Critical' ? 'Critical' : theme.suggestedPriority === 'High' ? 'High' : 'Medium',
    suggestedAction: 'Review with product leadership and decide whether to route into roadmap triage.'
  };
}
