import { apiRequest } from './config/api';

export interface RegisterStartData {
  username: string;
  email: string;
  registrationRequest: string;
}

export interface RegisterFinishData {
  username: string;
  email: string;
  fullname?: string;
  registrationRecord: string;
  registrationRequest: string;
  wrappedVaultKey: string;
  vaultKdfSalt: string;
  vaultKdfParams: any;
}

export interface RegisterFinishResponse {
  ok: boolean;
  restoredUsername?: string | null;
  message?: string;
}

export interface LoginStartData {
  username: string;
  startLoginRequest: string;
}

export interface LoginStartResponse {
  loginResponse: string;
  loginId: string;
  case?: string;
  email?: string;
}

export interface LoginFinishData {
  loginId: string;
  finishLoginRequest: string;
}

export interface SendVerificationEmailData {
  email: string;
}

export interface VerifyEmailTokenData {
  token: string;
}

export interface SendResetPasswordEmailData {
  email: string;
}

export interface ResetPasswordStartData {
  token: string;
  registrationRequest: string;
}

export interface ResetPasswordStartResponse {
  registrationResponse: string;
}

export interface ResetPasswordFinishData {
  token: string;
  registrationRecord: string;
  wrappedVaultKey: string;
  vaultKdfSalt: string;
  vaultKdfParams: any;
}

export const authService = {
  registerStart: (data: RegisterStartData) =>
    apiRequest('/auth/register/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerFinish: (data: RegisterFinishData): Promise<RegisterFinishResponse> =>
    apiRequest('/auth/register/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginStart: (data: LoginStartData): Promise<LoginStartResponse> =>
    apiRequest('/auth/login/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginFinish: (data: LoginFinishData) =>
    apiRequest('/auth/login/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendVerificationEmail: (data: SendVerificationEmailData) =>
    apiRequest('/auth/verify-email/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyEmailToken: (data: VerifyEmailTokenData) =>
    apiRequest('/auth/verify-email/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sendResetPasswordEmail: (data: SendResetPasswordEmailData) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPasswordStart: (data: ResetPasswordStartData): Promise<ResetPasswordStartResponse> =>
    apiRequest('/auth/reset-password/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPasswordFinish: (data: ResetPasswordFinishData) =>
    apiRequest('/auth/reset-password/finish', {
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
