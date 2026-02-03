'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Clock, LogOut } from 'lucide-react';
import { sessionService, UserSession } from '@/services/session.service';
import { toast } from 'sonner';

export function DevicesPanel() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const data = await sessionService.getActiveSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const getDeviceIcon = (deviceName: string) => {
    const lowerName = deviceName?.toLowerCase() || '';
    if (lowerName.includes('mobile') || lowerName.includes('android') || lowerName.includes('ios')) {
      return Smartphone;
    }
    if (lowerName.includes('tablet') || lowerName.includes('ipad')) {
      return Tablet;
    }
    return Monitor;
  };

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInMs = now.getTime() - then.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to logout this device?')) return;

    try {
      setRevokingSessionId(sessionId);
      await sessionService.revokeSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success('Device logged out successfully');
    } catch (error) {
      console.error('Failed to revoke session:', error);
      toast.error('Failed to logout device');
    } finally {
      setRevokingSessionId(null);
    }
  };

  return (
    <div className="p-6">
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg" />
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <Monitor className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active sessions</h3>
          <p className="text-gray-600 dark:text-gray-400">Devices that access your account will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.deviceName);
            const isRecent = session.lastActiveAt && 
              new Date(session.lastActiveAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;

            return (
              <div
                key={session.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <DeviceIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {session.deviceName}
                          </h3>
                          {isRecent && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                          {session.deviceType && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {session.deviceType}
                            </span>
                          )}

                          {session.ip && (
                            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {session.ip}
                            </span>
                          )}

                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>Last active: {getRelativeTime(session.lastActiveAt)}</span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          First login: {new Date(session.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revokingSessionId === session.id}
                        className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Logout this device"
                      >
                        <LogOut className="w-3 h-3" />
                        {revokingSessionId === session.id ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
