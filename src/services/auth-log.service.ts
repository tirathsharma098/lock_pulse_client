import { apiRequest } from './config/api';

export enum AuthLogType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  PASSWORD_CHANGE = 'password_change',
  EMAIL_CHANGE = 'email_change',
  PROFILE_UPDATE = 'profile_update',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  PASSWORD_RESET_COMPLETE = 'password_reset_complete',
  TWO_FACTOR_ENABLED = 'two_factor_enabled',
  TWO_FACTOR_DISABLED = 'two_factor_disabled',
  REVOKED_SESSION = 'revoked_session'
}

export interface AuthLog {
  id: string;
  userId: string;
  sid: string;
  logType: AuthLogType;
  metadata: Record<string, any>;
  success: boolean;
  failureReason: string;
  createdAt: string;
  session: {id: string, deviceName: string};
}

export interface AuthLogResponse {
  logs: AuthLog[];
  limit: number;
  nextCursor: string | null;
  hasNext: boolean;
  hasPrev: boolean;
}

class AuthLogService {
  async getUserLogs(limit: number = 10, cursor?: string, date?: string): Promise<AuthLogResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', limit.toString());
    if (cursor) searchParams.append('cursor', cursor);
    if (date) searchParams.append('date', date);

    return apiRequest(`/auth-log?${searchParams.toString()}`);
  }
}

export const authLogService = new AuthLogService();
