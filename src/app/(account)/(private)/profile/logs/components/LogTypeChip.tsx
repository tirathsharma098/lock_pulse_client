'use client';

import { Chip } from '@mui/material';
import {
  Login,
  Logout,
  PersonAdd,
  Lock,
  Email,
  Edit,
  VpnKey,
  Security,
} from '@mui/icons-material';
import { AuthLogType } from '@/services/auth-log.service';

interface LogTypeChipProps {
  logType: AuthLogType;
}

const LOG_TYPE_CONFIG = {
  [AuthLogType.LOGIN]: {
    label: 'Login',
    color: 'success' as const,
    icon: <Login fontSize="small" />,
  },
  [AuthLogType.LOGOUT]: {
    label: 'Logout',
    color: 'default' as const,
    icon: <Logout fontSize="small" />,
  },
  [AuthLogType.REGISTER]: {
    label: 'Registration',
    color: 'primary' as const,
    icon: <PersonAdd fontSize="small" />,
  },
  [AuthLogType.PASSWORD_CHANGE]: {
    label: 'Password Changed',
    color: 'warning' as const,
    icon: <Lock fontSize="small" />,
  },
  [AuthLogType.EMAIL_CHANGE]: {
    label: 'Email Changed',
    color: 'info' as const,
    icon: <Email fontSize="small" />,
  },
  [AuthLogType.PROFILE_UPDATE]: {
    label: 'Profile Updated',
    color: 'secondary' as const,
    icon: <Edit fontSize="small" />,
  },
  [AuthLogType.PASSWORD_RESET_REQUEST]: {
    label: 'Password Reset Request',
    color: 'warning' as const,
    icon: <VpnKey fontSize="small" />,
  },
  [AuthLogType.PASSWORD_RESET_COMPLETE]: {
    label: 'Password Reset',
    color: 'warning' as const,
    icon: <VpnKey fontSize="small" />,
  },
  [AuthLogType.TWO_FACTOR_ENABLED]: {
    label: '2FA Enabled',
    color: 'success' as const,
    icon: <Security fontSize="small" />,
  },
  [AuthLogType.TWO_FACTOR_DISABLED]: {
    label: '2FA Disabled',
    color: 'error' as const,
    icon: <Security fontSize="small" />,
  },
};

export function LogTypeChip({ logType }: LogTypeChipProps) {
  const config = LOG_TYPE_CONFIG[logType] || {
    label: logType,
    color: 'default' as const,
    icon: null,
  };

  return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
}
