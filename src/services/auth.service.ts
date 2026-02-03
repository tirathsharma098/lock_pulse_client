import { apiRequest } from './config/api';

export interface RegisterStartData {
  username: string;
  registrationRequest: string;
}

export interface RegisterFinishData {
  username: string;
  email: string;
  fullname: string;
  registrationRecord: string;
  registrationRequest: string;
  wrappedVaultKey: string;
  vaultKdfSalt: string;
  vaultKdfParams: any;
}

export interface LoginStartData {
  username: string;
  startLoginRequest: string;
}

export interface LoginFinishData {
  loginId: string;
  finishLoginRequest: string;
}

export const authService = {
  registerStart: (data: RegisterStartData) =>
    apiRequest('/auth/register/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerFinish: (data: RegisterFinishData) =>
    apiRequest('/auth/register/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginStart: (data: LoginStartData) =>
    apiRequest('/auth/login/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginFinish: (data: LoginFinishData) =>
    apiRequest('/auth/login/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  // Session management
  getSessions: () =>
    apiRequest('/auth/sessions', {
      method: 'GET',
    }),

  revokeSession: (sessionId: string) =>
    apiRequest(`/auth/session/${sessionId}`, {
      method: 'DELETE',
    }),
};
