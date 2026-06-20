import { apiRequest } from './client';
import { ApiReadinessItem } from '../types/readiness';

export const readinessApi = {
  list: (engagementId: string) => apiRequest<ApiReadinessItem[]>(`/engagements/${engagementId}/readiness`),
  create: (engagementId: string, body: Pick<ApiReadinessItem, 'category' | 'text'> & Partial<ApiReadinessItem>) =>
    apiRequest<ApiReadinessItem>(`/engagements/${engagementId}/readiness`, { method: 'POST', body }),
  createDefaults: (engagementId: string) => apiRequest<ApiReadinessItem[]>(`/engagements/${engagementId}/readiness/defaults`, { method: 'POST' }),
  update: (id: string, body: Partial<ApiReadinessItem>) =>
    apiRequest<ApiReadinessItem>(`/readiness/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiRequest<{ deleted: boolean }>(`/readiness/${id}`, { method: 'DELETE' })
};
