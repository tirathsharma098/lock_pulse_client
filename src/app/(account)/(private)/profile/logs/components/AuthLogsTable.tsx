'use client';

import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Chip, Box, Tooltip } from '@mui/material';
import { AuthLog, AuthLogType } from '@/services/auth-log.service';
import { LogTypeChip } from './LogTypeChip';
import { DeviceInfo } from './DeviceInfo';

interface AuthLogsTableProps {
  logs: AuthLog[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function AuthLogsTable({
  logs,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
}: AuthLogsTableProps) {
  const rows: GridRowsProp = logs.map((log) => ({
    // id: log.id,
    ...log,
  }));

  const columns: GridColDef[] = [
    {
      field: 'logType',
      headerName: 'Action',
      width: 180,
      renderCell: (params) => <LogTypeChip logType={params.value} />,
    },
    {
      field: 'deviceInfo',
      headerName: 'Device',
      width: 200,
      renderCell: (params) => (
        <DeviceInfo
          deviceType={params.row.deviceType}
          browser={params.row.browser}
          os={params.row.os}
        />
      ),
    },
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      width: 140,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 180,
      renderCell: (params) => {
        const { city, country } = params.row;
        if (!city && !country) return '-';
        return `${city || ''}${city && country ? ', ' : ''}${country || ''}`;
      },
    },
    {
      field: 'success',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Success' : 'Failed'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      width: 180,
      renderCell: (params) => {
        const date = new Date(params.value);
        return (
          <Tooltip title={date.toLocaleString()}>
            <span>{date.toLocaleString()}</span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={total}
        // page={page}
        // pageSize={pageSize}
        // onPageChange={onPageChange}
        // onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
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
    </Box>
  );
}
