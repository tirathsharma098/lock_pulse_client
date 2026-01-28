'use client';

import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { format } from 'date-fns';
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
  startDate?: string;
  endDate?: string;
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
  startDate,
  endDate,
}: ActivityTableProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchActivities();
  }, [paginationModel, isVaultResource, projectId, serviceId, resourceId, activityType, resourceType, startDate, endDate]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ActivityQueryParams = {
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
      };

      if (isVaultResource !== undefined) params.isVaultResource = isVaultResource;
      if (projectId) params.projectId = projectId;
      if (serviceId) params.serviceId = serviceId;
      if (resourceId) params.resourceId = resourceId;
      if (activityType) params.activityType = activityType;
      if (resourceType) params.resourceType = resourceType;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await dashboardService.getActivities(params);
      setActivities(data.activities);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, 'default' | 'primary' | 'success' | 'error' | 'warning'> = {
      view: 'primary',
      create: 'success',
      update: 'warning',
      delete: 'error',
      share: 'default',
    };
    return colors[type.toLowerCase()] || 'default';
  };

  const columns: GridColDef[] = [
    {
      field: 'activityType',
      headerName: 'Activity',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getActivityColor(params.value)}
          size="small"
          className="capitalize"
        />
      ),
    },
    {
      field: 'resourceType',
      headerName: 'Resource Type',
      width: 150,
      renderCell: (params) => (
        <span className="capitalize">{params.value}</span>
      ),
    },
    {
      field: 'resourceName',
      headerName: 'Resource Name',
      width: 200,
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      width: 180,
      renderCell: (params) => (
        <span className="text-sm">
          {format(new Date(params.value), 'MMM dd, yyyy HH:mm')}
        </span>
      ),
    },
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      width: 150,
    },
  ];

  return (
    <Card className="dark:bg-gray-800">
      <CardContent>
        <Typography variant="h6" className="font-semibold mb-4 text-gray-900 dark:text-white">
          Activity Log
        </Typography>
        {error && (
          <div className="text-red-600 dark:text-red-400 mb-4 text-sm">
            {error}
          </div>
        )}
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={activities}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            rowCount={total}
            paginationMode="server"
            loading={loading}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderBottom: '2px solid rgba(224, 224, 224, 1)',
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
