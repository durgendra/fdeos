import { apiRequest } from './client';
import { AuthResponse, ApiUser, EffectiveSession } from '../types/api';

export const authApi = {
  login: (body: { email: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/login', { method: 'POST', body }),
  register: (body: { name: string; email: string; password: string; organizationName: string }) =>
    apiRequest<AuthResponse>('/auth/register', { method: 'POST', body }),
  me: () => apiRequest<ApiUser>('/auth/me'),
  effectiveSession: () => apiRequest<EffectiveSession>('/auth/effective-session')
};
