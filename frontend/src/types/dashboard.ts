import { ApiEngagement } from './engagement';
import { ApiProductSignal } from './productSignal';
import { ApiRisk } from './risk';

export interface DashboardSummary {
  activeDeployments: number;
  atRiskAccounts: number;
  openCommitments: number;
  productSignalsCaptured: number;
  avgStageProgress: number;
  deploymentsByStage: Array<{ stage: string; count: number }>;
  healthBreakdown: Array<{ health: string; count: number }>;
  criticalRisks: ApiRisk[];
  recentProductSignals: ApiProductSignal[];
  activeEngagements: ApiEngagement[];
}

export interface ProductIntelligenceTheme {
  theme: string;
  frequency: number;
  customersAffected: number;
  opportunityImpact: number;
  suggestedPriority: string;
  evidenceSnippets: string[];
}
