import { apiRequest } from './client';
import { ApiRisk } from '../types/risk';

export const risksApi = {
  list: (engagementId: string) => apiRequest<ApiRisk[]>(`/engagements/${engagementId}/risks`),
  create: (engagementId: string, body: Partial<ApiRisk> & { title: string }) =>
    apiRequest<ApiRisk>(`/engagements/${engagementId}/risks`, { method: 'POST', body }),
  update: (id: string, body: Partial<ApiRisk>) => apiRequest<ApiRisk>(`/risks/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiRequest<{ deleted: boolean }>(`/risks/${id}`, { method: 'DELETE' })
};
