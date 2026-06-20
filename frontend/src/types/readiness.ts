export interface ApiReadinessItem {
  _id: string;
  engagementId: string;
  category: string;
  text: string;
  status: 'Not Started' | 'In Progress' | 'Complete' | 'Blocked';
  ownerName?: string;
  notes?: string;
  riskTag?: string;
}
