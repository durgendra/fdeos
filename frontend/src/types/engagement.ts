export type ApiDeploymentStage =
  | 'Discovery'
  | 'Workflow Mapping'
  | 'Technical Scoping'
  | 'Prototype'
  | 'Validation'
  | 'Production Hardening'
  | 'Handoff'
  | 'Expansion';

export type ApiDeploymentHealth = 'Green' | 'Yellow' | 'Red';

export interface ApiEngagement {
  _id: string;
  organizationId: string;
  customerName: string;
  industry?: string;
  opportunitySize?: number;
  fdeOwnerId?: string;
  fdeOwnerName?: string;
  executiveSponsor?: string;
  technicalSponsor?: string;
  deploymentStage: ApiDeploymentStage;
  health: ApiDeploymentHealth;
  primaryObjective?: string;
  businessProblem?: string;
  targetWorkflow?: string;
  successMetric?: string;
  systemsInvolved?: string[];
  stakeholders?: Array<{
    name: string;
    role: string;
    company?: string;
    influence?: string;
    sentiment?: string;
  }>;
  currentBlocker?: string;
  nextMilestone?: string;
  executiveSummary?: string;
  tags?: string[];
  lastActivityAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
