'use client';

import { AuthLog, AuthLogType } from '@/services/auth-log.service';
import {
  Monitor,
  Smartphone,
  Tablet,
  LogIn,
  LogOut,
  UserPlus,
  Lock,
  Mail,
  Edit,
  Key,
  Shield,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface LogCardProps {
  log: AuthLog;
}

const LOG_TYPE_CONFIG = {
  [AuthLogType.LOGIN]: { label: 'Login', icon: LogIn, color: 'green' },
  [AuthLogType.LOGOUT]: { label: 'Logout', icon: LogOut, color: 'gray' },
  [AuthLogType.REGISTER]: { label: 'Registration', icon: UserPlus, color: 'blue' },
  [AuthLogType.PASSWORD_CHANGE]: { label: 'Password Changed', icon: Lock, color: 'orange' },
  [AuthLogType.EMAIL_CHANGE]: { label: 'Email Changed', icon: Mail, color: 'cyan' },
  [AuthLogType.PROFILE_UPDATE]: { label: 'Profile Updated', icon: Edit, color: 'purple' },
  [AuthLogType.PASSWORD_RESET_REQUEST]: { label: 'Password Reset Request', icon: Key, color: 'yellow' },
  [AuthLogType.PASSWORD_RESET_COMPLETE]: { label: 'Password Reset', icon: Key, color: 'orange' },
  [AuthLogType.TWO_FACTOR_ENABLED]: { label: '2FA Enabled', icon: Shield, color: 'green' },
  [AuthLogType.TWO_FACTOR_DISABLED]: { label: '2FA Disabled', icon: Shield, color: 'red' },
};

export function LogCard({ log }: LogCardProps) {
  const config = LOG_TYPE_CONFIG[log.logType] || { label: log.logType, icon: Edit, color: 'gray' };
  const Icon = config.icon;

  const getDeviceIcon = () => {
    switch (log.deviceType?.toLowerCase()) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  const DeviceIcon = getDeviceIcon();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-${config.color}-100 dark:bg-${config.color}-900/20`}>
          <Icon className={`w-5 h-5 text-${config.color}-600 dark:text-${config.color}-400`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{config.label}</h3>
                {log.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <DeviceIcon className="w-4 h-4" />
                  <span>{log.browser || 'Unknown Browser'}</span>
                </div>

                {log.os && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {log.os}
                  </span>
                )}

                {log.ipAddress && (
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {log.ipAddress}
                  </span>
                )}

                {(log.city || log.country) && (
                  <span className="text-xs">
                    📍 {log.city}{log.city && log.country ? ', ' : ''}{log.country}
                  </span>
                )}
              </div>

              {!log.success && log.failureReason && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded">
                  {log.failureReason}
                </div>
              )}
            </div>

            <div className="text-right">
              <time className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(log.createdAt)}
              </time>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(log.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
