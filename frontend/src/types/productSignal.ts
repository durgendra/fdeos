export interface ApiProductSignal {
  _id: string;
  engagementId: string;
  theme: string;
  signalType: string;
  evidence?: string;
  customerImpact?: string;
  suggestedPriority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Reviewed' | 'Sent to Product' | 'Dismissed';
  createdAt?: string;
}
