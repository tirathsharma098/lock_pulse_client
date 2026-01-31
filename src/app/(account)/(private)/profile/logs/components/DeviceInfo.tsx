'use client';

import { Box, Typography, Tooltip } from '@mui/material';
import { PhoneAndroid, Computer, Tablet } from '@mui/icons-material';

interface DeviceInfoProps {
  deviceType: string;
  browser: string;
  os: string;
}

export function DeviceInfo({ deviceType, browser, os }: DeviceInfoProps) {
  const getDeviceIcon = () => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <PhoneAndroid fontSize="small" />;
      case 'tablet':
        return <Tablet fontSize="small" />;
      default:
        return <Computer fontSize="small" />;
    }
  };

  return (
    <Tooltip title={`${browser} on ${os}`}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getDeviceIcon()}
        <Box>
          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
            {browser || 'Unknown'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
            {os || 'Unknown OS'}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}
