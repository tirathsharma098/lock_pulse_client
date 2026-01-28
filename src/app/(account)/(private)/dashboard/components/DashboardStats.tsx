'use client';

import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Activity, Eye, Edit, FileText, TrendingUp } from 'lucide-react';
import { dashboardService, StatsData } from '@/services/dashboard.service';

interface DashboardStatsProps {
  filter?: 'all' | 'vault' | 'project';
}

export default function DashboardStats({ filter = 'all' }: DashboardStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [filter]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const filterParam = filter === 'all' ? undefined : filter;
      const data = await dashboardService.getDashboardStats(filterParam);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
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

  if (!stats) return null;

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

  return (
    <div className="space-y-6">
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="dark:bg-gray-800 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-1">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
                      {card.value.toLocaleString()}
                    </Typography>
                  </div>
                  <div className={`p-3 rounded-lg ${card.lightBg}`}>
                    <card.icon className={`w-8 h-8 text-white ${card.color.replace('bg-', 'text-').replace('500', '600')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
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
              <div className="space-y-3">
                {stats.byResourceType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {item.resourceType}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {parseInt(item.count).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="dark:bg-gray-800">
            <CardContent>
              <Typography variant="h6" className="font-semibold mb-4 text-gray-900 dark:text-white">
                By Activity Type
              </Typography>
              <div className="space-y-3">
                {stats.byActivityType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-gray-500" />
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {item.activityType}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {parseInt(item.count).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
