'use client';

import { useState, useEffect } from 'react';
import { 
  Tabs, 
  Tab, 
  Box, 
  Card, 
  CardContent, 
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  Activity, 
  Eye, 
  Edit, 
  Vault, 
  FolderKanban,
  TrendingUp,
} from 'lucide-react';
import DashboardStats from './components/DashboardStats';
import ActivityTable from './components/ActivityTable';
import ActivityFilters from './components/ActivityFilters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DashboardPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your activity across vaults and projects
          </p>
        </div>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              },
            }}
          >
            <Tab label="Overview" icon={<TrendingUp className="w-5 h-5" />} iconPosition="start" />
            <Tab label="Vault Activities" icon={<Vault className="w-5 h-5" />} iconPosition="start" />
            <Tab label="Project Activities" icon={<FolderKanban className="w-5 h-5" />} iconPosition="start" />
            {/* <Tab label="All Activities" icon={<Activity className="w-5 h-5" />} iconPosition="start" /> */}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <DashboardStats filter="all" />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mt: 4 }}>
            <ActivityFilters isVaultResource={true} />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mt: 4 }}>
            <ActivityFilters isVaultResource={false} />
          </Box>
        </TabPanel>
      </div>
    </div>
  );
}
