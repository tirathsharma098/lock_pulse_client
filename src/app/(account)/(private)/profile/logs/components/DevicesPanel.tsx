'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Clock, MapPin } from 'lucide-react';
import { authLogService, DeviceInfo as DeviceInfoType } from '@/services/auth-log.service';

export function DevicesPanel() {
  const [devices, setDevices] = useState<DeviceInfoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await authLogService.getUserDevices();
        setDevices(data);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
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
      ) : devices.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <Monitor className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No devices found</h3>
          <p className="text-gray-600 dark:text-gray-400">Devices that access your account will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {devices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.deviceType);
            const isRecent = device.createdAt && 
              new Date(device.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;

            return (
              <div
                key={device.id}
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
                            {device.browser}
                          </h3>
                          {isRecent && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Recent
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                          {device.os && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {device.os}
                            </span>
                          )}

                          {device.ipAddress && (
                            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {device.ipAddress}
                            </span>
                          )}

                          {(device.city || device.country) && (
                            <div className="flex items-center gap-1 text-xs">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {device.city}{device.city && device.country ? ', ' : ''}{device.country}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          <Clock className="w-4 h-4" />
                          <span>{getRelativeTime(device.createdAt)}</span>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(device.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
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
