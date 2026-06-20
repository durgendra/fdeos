import { apiRequest } from './client';
import { ApiProductSignal } from '../types/productSignal';

export const productSignalsApi = {
  listAll: () => apiRequest<ApiProductSignal[]>('/product-signals'),
  list: (engagementId: string) => apiRequest<ApiProductSignal[]>(`/engagements/${engagementId}/product-signals`),
  create: (engagementId: string, body: Partial<ApiProductSignal> & { theme: string }) =>
    apiRequest<ApiProductSignal>(`/engagements/${engagementId}/product-signals`, { method: 'POST', body }),
  update: (id: string, body: Partial<ApiProductSignal>) =>
    apiRequest<ApiProductSignal>(`/product-signals/${id}`, { method: 'PATCH', body }),
  delete: (id: string) => apiRequest<{ deleted: boolean }>(`/product-signals/${id}`, { method: 'DELETE' })
};
