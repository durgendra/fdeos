import { ApiEnvelope } from '../types/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const TOKEN_KEY = 'fdeos_api_token';
export const SIMULATED_ROLE_KEY = 'fdeos_simulated_role_key';

export class ApiClientError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code = 'API_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const simulatedRole = localStorage.getItem(SIMULATED_ROLE_KEY);
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (simulatedRole) headers.set('X-Simulated-Role', simulatedRole);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    const message = payload?.error?.message || `Request failed with status ${response.status}`;
    const code = payload?.error?.code || 'API_ERROR';
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.hash = '#/login';
    }
    throw new ApiClientError(message, response.status, code);
  }

  return payload.data;
}
