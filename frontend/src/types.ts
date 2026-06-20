export type DeploymentStage =
  | 'Discovery'
  | 'Workflow Mapping'
  | 'Technical Scoping'
  | 'Prototype'
  | 'Validation'
  | 'Production Hardening'
  | 'Handoff'
  | 'Expansion';

export type DeploymentHealth = 'green' | 'yellow' | 'red';

export interface Stakeholder {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface TimelineEvent {
  date: string;
  stage: DeploymentStage;
  note: string;
  achieved: boolean;
}

export interface Blocker {
  id: string;
  title: string;
  stage: DeploymentStage;
  owner: string;
  ageDays: number;
  nextAction: string;
}

export interface Commitment {
  id: string;
  backendId?: string;
  title: string;
  owner: string;
  type: 'Vendor' | 'Customer' | 'Shared';
  dueDate: string;
  status: 'Open' | 'Waiting' | 'Done' | 'At Risk';
  source: string;
  lastUpdated: string;
}

export interface Risk {
  id: string;
  backendId?: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  impact: string;
  mitigation: string;
  owner: string;
  status: 'Open' | 'Mitigated';
}

export interface ProductSignal {
  id: string;
  backendId?: string;
  theme: string;
  type:
    | 'Feature Request'
    | 'Integration Gap'
    | 'Workflow Gap'
    | 'Security Requirement'
    | 'UX Issue'
    | 'Customization Debt';
  evidence: string;
  customerImpact: string;
  frequency: number;
  priority: 'P0' | 'P1' | 'P2';
}

export interface ReadinessItem {
  id: string;
  backendId?: string;
  category:
    | 'Business Readiness'
    | 'Data Readiness'
    | 'Security Readiness'
    | 'Integration Readiness'
    | 'AI Evaluation Readiness'
    | 'Production Readiness'
    | 'Handoff Readiness';
  title: string;
  checked: boolean;
  owner: string;
  notes: string;
  riskTag?: string;
}

export interface StatusUpdate {
  id: string;
  backendId?: string;
  date: string;
  tone: 'Executive' | 'Technical' | 'Customer';
  summary: string;
  completed: string[];
  blockers: string[];
  decisions: string[];
  nextSteps: string[];
}

export interface EngagementNote {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface Engagement {
  id: string;
  backendId?: string;
  customer: string;
  industry: string;
  arr: string;
  stage: DeploymentStage;
  health: DeploymentHealth;
  owner: string;
  objective: string;
  problem: string;
  workflow: string;
  metric: string;
  lastUpdated: string;
  executiveSummary: string;
  stakeholders: Stakeholder[];
  systems: string[];
  timeline: TimelineEvent[];
  currentBlocker: string;
  nextMilestone: string;
  blockers: Blocker[];
  commitments: Commitment[];
  risks: Risk[];
  productSignals: ProductSignal[];
  readiness: ReadinessItem[];
  notesHistory: EngagementNote[];
  statusUpdates: StatusUpdate[];
}

export interface Playbook {
  id: string;
  title: string;
  description: string;
  stage: DeploymentStage;
  requiredOutputs: string[];
  checklistCount: number;
}

export interface ProductThemeAggregate {
  theme: string;
  type: string;
  customersAffected: string[];
  arrImpacted: string;
  evidenceSnippets: string[];
  priority: 'Critical' | 'High' | 'Medium';
  suggestedAction: string;
}

export type UserRole = 'Admin' | 'FDE' | 'FDE Manager' | 'Executive' | 'Product Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  assignedAccounts?: string[];
  status: 'Active' | 'Inactive';
}

export interface RolePermissions {
  engagements: { view: boolean; create: boolean; edit: boolean };
  notesIntelligence: { view: boolean; extract: boolean; approve: boolean };
  commitments: { view: boolean; create: boolean; edit: boolean };
  risksBlockers: { view: boolean; create: boolean; edit: boolean };
  productSignals: { view: boolean; create: boolean; edit: boolean };
  readiness: { view: boolean; check: boolean; edit: boolean };
  statusUpdates: { view: boolean; create: boolean };
  dashboards: { commands: boolean; executive: boolean; productIntel: boolean };
  administration: { manageRoles: boolean; manageUsers: boolean };
}
