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
}

export interface AuthLog {
  id: string;
  userId: string;
  logType: AuthLogType;
  ipAddress: string;
  userAgent: string;
  deviceFingerprint: string;
  deviceType: string;
  browser: string;
  os: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  metadata: Record<string, any>;
  success: boolean;
  failureReason: string;
  createdAt: string;
}

export interface AuthLogResponse {
  logs: AuthLog[];
  total: number;
}
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface DeviceInfo extends AuthLog {}
/* eslint-enable */
class AuthLogService {
  async getUserLogs(limit: number = 50, offset: number = 0): Promise<AuthLogResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', limit.toString());
    searchParams.append('offset', offset.toString());

    return apiRequest(`/auth-log?${searchParams.toString()}`);
  }

  async getUserDevices(): Promise<DeviceInfo[]> {
    return apiRequest('/auth-log/devices');
  }
}

export const authLogService = new AuthLogService();
