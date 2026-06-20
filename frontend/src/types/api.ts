export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  roleKey: 'admin' | 'fde' | 'fde_manager' | 'executive' | 'product_manager';
  organizationId: string;
}

export interface ApiOrganization {
  _id: string;
  name: string;
  domain?: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
  organization?: ApiOrganization;
}

export interface EffectiveSession {
  user: ApiUser;
  actualRole: {
    key: string;
    permissions: string[];
    defaultLandingPage: string;
  };
  effectiveRole: {
    key: string;
    permissions: string[];
    defaultLandingPage: string;
  };
  simulationMode: boolean;
  permissions: string[];
  defaultLandingPage: string;
}
