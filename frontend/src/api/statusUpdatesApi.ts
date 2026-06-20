import { apiRequest } from './client';
import { ApiStatusUpdate } from '../types/statusUpdate';

export const statusUpdatesApi = {
  list: (engagementId: string) => apiRequest<ApiStatusUpdate[]>(`/engagements/${engagementId}/status-updates`),
  generate: (body: { engagementId: string; tone: 'Executive' | 'Technical' | 'Customer-Friendly' }) =>
    apiRequest<ApiStatusUpdate>('/ai/generate-status-update', { method: 'POST', body })
};
