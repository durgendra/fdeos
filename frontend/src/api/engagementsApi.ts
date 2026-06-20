import { apiRequest } from './client';
import { ApiEngagement } from '../types/engagement';

export const engagementsApi = {
  list: () => apiRequest<ApiEngagement[]>('/engagements'),
  get: (id: string) => apiRequest<ApiEngagement>(`/engagements/${id}`),
  create: (body: Partial<ApiEngagement>) => apiRequest<ApiEngagement>('/engagements', { method: 'POST', body }),
  update: (id: string, body: Partial<ApiEngagement>) => apiRequest<ApiEngagement>(`/engagements/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiRequest<{ deleted: boolean }>(`/engagements/${id}`, { method: 'DELETE' })
};
