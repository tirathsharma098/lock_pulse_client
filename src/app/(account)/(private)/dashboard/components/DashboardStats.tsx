'use client';

import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Activity, Eye, Edit, Vault, FolderKanban, Globe } from 'lucide-react';
import { dashboardService, StatsData } from '@/services/dashboard.service';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DashboardStatsProps {
  filter?: 'all' | 'vault' | 'project';
}

export default function DashboardStats({ filter = 'all' }: DashboardStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<'all' | 'vault' | 'project'>('all');
  const [activityStats, setActivityStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetchStats();
  }, [filter]);

  useEffect(() => {
    fetchActivityFilterStats();
  }, [activityFilter]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const filterParam = filter === 'all' ? undefined : filter;
      const data = await dashboardService.getDashboardStats(filterParam);
      setStats(data);
      setActivityStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityFilterStats = async () => {
    try {
      const filterParam = activityFilter === 'all' ? undefined : activityFilter;
      const data = await dashboardService.getDashboardStats(filterParam);
      setActivityStats(data);
    } catch (err) {
      console.error('Error fetching filtered activity stats:', err);
    }
  };

  const handleActivityFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: 'all' | 'vault' | 'project' | null,
  ) => {
    if (newFilter !== null) {
      setActivityFilter(newFilter);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-4">
        {error}
      </div>
    );
  }

  if (!stats || !activityStats) return null;

  const statCards = [
    {
      title: 'Total Activities',
      value: stats.totalActivities,
      icon: Activity,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Total Views',
      value: stats.viewCount,
      icon: Eye,
      color: 'bg-green-500',
      lightBg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Writes',
      value: stats.writeCount,
      icon: Edit,
      color: 'bg-purple-500',
      lightBg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  const resourceTypeColors: Record<string, string> = {
    vault: '#ec4899',
    project: '#3b82f6',
    service: '#6366f1',
    credential: '#10b981',
  };

  const activityTypeColors: Record<string, string> = {
    view: '#3b82f6',
    find: '#06b6d4',
    create: '#10b981',
    update: '#eab308',
    delete: '#ef4444',
    share: '#a855f7',
    unshare: '#f97316',
  };

  // Prepare data for pie charts
  const resourceTypeData = stats.byResourceType.map(item => ({
    name: item.resourceType,
    value: parseInt(item.count),
    percentage: ((parseInt(item.count) / stats.totalActivities) * 100).toFixed(1),
  }));

  const activityTypeData = activityStats.byActivityType.map(item => ({
    name: item.activityType,
    value: parseInt(item.count),
    percentage: ((parseInt(item.count) / activityStats.totalActivities) * 100).toFixed(1),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold capitalize text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Count: {formatNumber(payload[0].value)}
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {payload[0].payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {percentage}%
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
          <div
            className="
              group relative
              rounded-2xl
              border border-gray-200/60 dark:border-gray-700/60
              bg-white dark:bg-gray-900
              p-6
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
        
                <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {formatNumber(card.value)}
                </p>
              </div>
        
              <div
                className={`
                  flex h-12 w-12 items-center justify-center
                  rounded-xl
                  ${card.lightBg}
                  transition-transform duration-300
                  group-hover:scale-110
                `}
              >
                <card.icon
                  className={`
                    h-6 w-6
                    ${card.color.replace('bg-', 'text-').replace('500', '600')}
                  `}
                />
              </div>
            </div>
        
            {/* subtle border glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 dark:ring-white/10" />
          </div>
        </Grid>        
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="dark:bg-gray-800">
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4 text-gray-900 dark:text-white">
                By Resource Type
              </Typography>
              {resourceTypeData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={resourceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {resourceTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={resourceTypeColors[entry.name] || '#9ca3af'} 
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="capitalize">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {resourceTypeData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: resourceTypeColors[item.name] }}
                          ></div>
                          <span className="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatNumber(item.value)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            ({item.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="dark:bg-gray-800">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  By Activity Type
                </Typography>
                <ToggleButtonGroup
                  value={activityFilter}
                  exclusive
                  onChange={handleActivityFilterChange}
                  size="small"
                  aria-label="activity filter"
                  sx={{
                    '& .MuiToggleButton-root': {
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                    },
                  }}
                >
                  <ToggleButton value="all" aria-label="all activities">
                    <Globe className="w-3 h-3 mr-1" />
                    All
                  </ToggleButton>
                  <ToggleButton value="vault" aria-label="vault activities">
                    <Vault className="w-3 h-3 mr-1" />
                    Vault
                  </ToggleButton>
                  <ToggleButton value="project" aria-label="project activities">
                    <FolderKanban className="w-3 h-3 mr-1" />
                    Project
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              {activityTypeData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={activityTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {activityTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={activityTypeColors[entry.name] || '#9ca3af'} 
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="capitalize">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {activityTypeData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: activityTypeColors[item.name] }}
                          ></div>
                          <span className="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatNumber(item.value)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            ({item.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
