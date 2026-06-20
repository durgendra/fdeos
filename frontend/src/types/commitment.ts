export interface ApiCommitment {
  _id: string;
  engagementId: string;
  text: string;
  ownerName?: string;
  ownerType: 'Vendor' | 'Customer' | 'Shared';
  dueDate?: string;
  status: 'Open' | 'Waiting' | 'Done' | 'At Risk';
  sourceExcerpt?: string;
  createdAt?: string;
  updatedAt?: string;
}
