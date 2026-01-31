'use client';

import { useState, useEffect } from 'react';
import { authLogService, AuthLog } from '@/services/auth-log.service';
import { LogsHeader } from './components/LogsHeader';
import { DevicesPanel } from './components/DevicesPanel';
import { LogsList } from './components/LogsList';
import { Pagination } from '@/components/ui/pagination';
import { Monitor, History } from 'lucide-react';

type TabType = 'devices' | 'activity';

export default function LogsPage() {
  const [logs, setLogs] = useState<AuthLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [activeTab, setActiveTab] = useState<TabType>('devices');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authLogService.getUserLogs(pageSize, (page - 1) * pageSize);
      setLogs(response.logs);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'activity') {
      fetchLogs();
    }
  }, [page, pageSize, activeTab]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <LogsHeader />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 dark:text-red-400"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('devices')}
                className={`flex-1 px-6 py-4 font-medium text-sm transition-colors relative ${
                  activeTab === 'devices'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Monitor className="w-5 h-5" />
                  <span>Trusted Devices</span>
                </div>
                {activeTab === 'devices' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 px-6 py-4 font-medium text-sm transition-colors relative ${
                  activeTab === 'activity'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <History className="w-5 h-5" />
                  <span>Activity Logs</span>
                </div>
                {activeTab === 'activity' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === 'devices' ? (
              <DevicesPanel />
            ) : (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Logs</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total {total} activities recorded
                  </p>
                </div>

                <LogsList logs={logs} loading={loading} />

                {!loading && logs.length > 0 && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
