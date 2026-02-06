'use client';

import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { FileText, Clock, User, Hash } from 'lucide-react';
import { dashboardService, Activity, ActivityQueryParams } from '@/services/dashboard.service';

interface ActivityTableProps {
  filter?: string;
  limit?: number;
  isVaultResource?: boolean;
  projectId?: string;
  serviceId?: string;
  resourceId?: string;
  activityType?: string;
  resourceType?: string;
  date?: string;
}

export default function ActivityTable({
  filter = 'all',
  limit = 50,
  isVaultResource,
  projectId,
  serviceId,
  resourceId,
  activityType,
  resourceType,
  date,
}: ActivityTableProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(limit);
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    setCursor(null);
    setCursorStack([]);
  }, [isVaultResource, projectId, serviceId, resourceId, activityType, resourceType, date]);

  useEffect(() => {
    fetchActivities();
  }, [pageSize, cursor, isVaultResource, projectId, serviceId, resourceId, activityType, resourceType, date]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ActivityQueryParams = {
        limit: pageSize,
        cursor: cursor ?? undefined,
      };

      if (isVaultResource !== undefined) params.isVaultResource = isVaultResource;
      if (projectId) params.projectId = projectId;
      if (serviceId) params.serviceId = serviceId;
      if (resourceId) params.resourceId = resourceId;
      if (activityType) params.activityType = activityType;
      if (resourceType) params.resourceType = resourceType;
      if (date) params.date = date;

      const data = await dashboardService.getActivities(params);
      setActivities(data.activities);
      setNextCursor(data.nextCursor);
      setHasNext(data.hasNext);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      view: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      find: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      create: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      update: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      share: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      unshare: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const columns: GridColDef[] = [
    {
      field: 'srNo',
      headerName: 'Sr. No.',
      width: 80,
      renderCell: (params) => {
        const srNo = params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1;
        return (
          <div className="flex items-center gap-2">
            <Hash className="w-3 h-3 text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{srNo}</span>
          </div>
        );
      },
    },
    {
      field: 'activityType',
      headerName: 'Activity',
      width: 130+28,
      renderCell: (params) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getActivityColor(params.value)}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'resourceType',
      headerName: 'Resource Type',
      width: 150+28,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="capitalize text-gray-700 dark:text-gray-300">{params.value}</span>
        </div>
      ),
    },
    {
      field: 'resourceName',
      headerName: 'Resource Name',
      width: 200+28,
      renderCell: (params) => (
        <span className="font-medium text-gray-900 dark:text-white truncate">
          {params.value || '-'}
        </span>
      ),
    },
    {
      field: 'username',
      headerName: 'User',
      valueGetter: (_value, row) => row.user?.username ?? '-',
      width: 150+28,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-gray-700 dark:text-gray-300">{params.value}</span>
        </div>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      width: 180+28,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {format(new Date(params.value), 'MMM dd, yyyy HH:mm')}
          </span>
        </div>
      ),
    },
    // {
    //   field: 'ipAddress',
    //   headerName: 'IP Address',
    //   width: 140,
    //   renderCell: (params) => (
    //     <div className="flex items-center gap-2">
    //       <MapPin className="w-4 h-4 text-gray-400" />
    //       <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
    //         {params.value || '-'}
    //       </span>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Activity Logs
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {activities.length > 0
                ? `Showing ${activities.length} activities${hasNext ? ' (more available)' : ''}`
                : 'No activities found'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">Per page</label>
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                setCursor(null);
                setCursorStack([]);
              }}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (cursorStack.length === 0) return;
                const previousCursor = cursorStack[cursorStack.length - 1] ?? null;
                setCursorStack(cursorStack.slice(0, -1));
                setCursor(previousCursor);
              }}
              disabled={cursorStack.length === 0 || loading}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (!nextCursor) return;
                setCursorStack([...cursorStack, cursor]);
                setCursor(nextCursor);
              }}
              disabled={!hasNext || loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={activities}
            columns={columns}
            pagination={undefined}
            loading={loading}
            disableRowSelectionOnClick
            hideFooterPagination
            hideFooterSelectedRowCount
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'divider',
                padding: '12px 16px',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'transparent',
                borderBottom: '2px solid',
                borderColor: 'divider',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'text.secondary',
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '2px solid',
                borderColor: 'divider',
                marginTop: '1rem',
              },
              '& .MuiTablePagination-root': {
                color: 'text.secondary',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
