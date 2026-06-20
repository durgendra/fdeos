import { apiRequest } from './client';
import { DashboardSummary, ProductIntelligenceTheme } from '../types/dashboard';

export const dashboardApi = {
  summary: () => apiRequest<DashboardSummary>('/dashboard/summary'),
  productIntelligence: () => apiRequest<ProductIntelligenceTheme[]>('/dashboard/product-intelligence')
};
