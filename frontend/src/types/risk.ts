export interface ApiRisk {
  _id: string;
  engagementId: string;
  title: string;
  description?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  impact?: string;
  mitigation?: string;
  ownerName?: string;
  status: 'Open' | 'Monitoring' | 'Mitigated' | 'Accepted';
}
