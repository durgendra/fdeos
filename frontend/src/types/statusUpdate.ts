export interface ApiStatusUpdate {
  _id: string;
  engagementId: string;
  tone: 'Executive' | 'Technical' | 'Customer-Friendly';
  summary: string;
  completedThisPeriod: string[];
  currentBlockers: string[];
  decisionsNeeded: string[];
  nextSteps: string[];
  fullText: string;
  createdAt?: string;
}
