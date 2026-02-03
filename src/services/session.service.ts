import { apiRequest } from './config/api';

export interface UserSession {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  ip: string;
  createdAt: string;
  lastActiveAt: string;
  revokedAt: string | null;
}

class SessionService {
  /**
   * Get all active sessions (devices) for current user
   */
  async getActiveSessions(): Promise<UserSession[]> {
    return apiRequest('/auth/sessions');
  }

  /**
   * Logout from a specific device/session
   */
  async revokeSession(sessionId: string): Promise<void> {
    return apiRequest(`/auth/session/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

export const sessionService = new SessionService();
