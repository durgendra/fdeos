import { apiRequest } from './client';
import { ApiCommitment } from '../types/commitment';

export const commitmentsApi = {
  list: (engagementId: string) => apiRequest<ApiCommitment[]>(`/engagements/${engagementId}/commitments`),
  create: (engagementId: string, body: Partial<ApiCommitment> & { text: string }) =>
    apiRequest<ApiCommitment>(`/engagements/${engagementId}/commitments`, { method: 'POST', body }),
  update: (id: string, body: Partial<ApiCommitment>) =>
    apiRequest<ApiCommitment>(`/commitments/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiRequest<{ deleted: boolean }>(`/commitments/${id}`, { method: 'DELETE' })
};
