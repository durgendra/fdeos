export interface ExtractedIntelligence {
  customerObjective: string;
  businessProblem: string;
  stakeholders: Array<{
    name: string;
    role: string;
    company?: string;
    influence?: 'high' | 'medium' | 'low';
    sentiment?: 'positive' | 'neutral' | 'negative' | 'unknown';
  }>;
  systemsMentioned: string[];
  commitments: Array<{
    text: string;
    ownerName?: string;
    ownerType?: 'Vendor' | 'Customer' | 'Shared';
    dueDate?: string;
    sourceExcerpt?: string;
  }>;
  risks: Array<{
    title: string;
    description?: string;
    severity?: 'Low' | 'Medium' | 'High' | 'Critical';
    impact?: string;
    mitigation?: string;
    ownerName?: string;
  }>;
  blockers: string[];
  openQuestions: string[];
  productSignals: Array<{
    theme: string;
    signalType: string;
    evidence?: string;
    customerImpact?: string;
    suggestedPriority?: 'Low' | 'Medium' | 'High' | 'Critical';
  }>;
  recommendedNextSteps: string[];
}

export interface ApiNote {
  _id: string;
  organizationId: string;
  engagementId: string;
  title: string;
  rawText?: string;
  sourceType: string;
  extracted?: ExtractedIntelligence;
  extractionStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
}
