'use client';

import { History } from 'lucide-react';

export function LogsHeader() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <History className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Security & Activity Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor all account activities and security events
          </p>
        </div>
      </div>
    </div>
  );
}
