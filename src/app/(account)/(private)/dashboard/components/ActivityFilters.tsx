'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { Filter, RefreshCw } from 'lucide-react';
import ActivityTable from './ActivityTable';
import { getAllProjects } from '@/services/projectService';
import { getAllServices } from '@/services/serviceService';

interface ActivityFiltersProps {
  isVaultResource?: boolean;
}

export default function ActivityFilters({ isVaultResource }: ActivityFiltersProps) {
  const [filters, setFilters] = useState({
    activityType: '',
    resourceType: '',
    startDate: '',
    endDate: '',
    projectId: '',
    serviceId: '',
  });

  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVaultResource === false) {
      fetchProjects();
    }
  }, [isVaultResource]);

  useEffect(() => {
    if (filters.projectId) {
      fetchServices(filters.projectId);
    } else {
      setServices([]);
      setFilters((prev) => ({ ...prev, serviceId: '' }));
    }
  }, [filters.projectId]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProjects("page=1");
      setProjects(data.items.map(p => ({ id: p.id, name: p.name })));
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllServices(projectId, "page=1");
      setServices(data.items.map(s => ({ id: s.id, name: s.name })));
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      activityType: '',
      resourceType: '',
      startDate: '',
      endDate: '',
      projectId: '',
      serviceId: '',
    });
    setServices([]);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <Card className="dark:bg-gray-800">
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Activity Type"
                value={filters.activityType}
                onChange={(e) => handleFilterChange('activityType', e.target.value)}
                size="small"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="view">View</MenuItem>
                <MenuItem value="find">Find</MenuItem>
                <MenuItem value="create">Create</MenuItem>
                <MenuItem value="update">Update</MenuItem>
                <MenuItem value="delete">Delete</MenuItem>
                <MenuItem value="share">Share</MenuItem>
                <MenuItem value="unshare">Unshare</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Resource Type"
                value={filters.resourceType}
                onChange={(e) => handleFilterChange('resourceType', e.target.value)}
                size="small"
              >
                <MenuItem value="">All</MenuItem>
                {isVaultResource !== false && <MenuItem value="vault">Vault</MenuItem>}
                {isVaultResource !== true && [
                    <MenuItem key="project" value="project">Project</MenuItem>,
                    <MenuItem key="service" value="service">Service</MenuItem>,
                    <MenuItem key="credential" value="credential">Credential</MenuItem>
                  ]}
              </TextField>
            </Grid>

            {isVaultResource === false && [
                <Grid key="project" item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Project"
                    value={filters.projectId}
                    onChange={(e) => handleFilterChange('projectId', e.target.value)}
                    size="small"
                    disabled={loading}
                  >
                    <MenuItem value="">All Projects</MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>,
                <Grid key="service" item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Service"
                    value={filters.serviceId}
                    onChange={(e) => handleFilterChange('serviceId', e.target.value)}
                    size="small"
                    disabled={!filters.projectId || loading}
                  >
                    <MenuItem value="">All Services</MenuItem>
                    {services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ]}

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshCw className="w-4 h-4" />}
                onClick={handleReset}
                className="h-10"
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ActivityTable
        isVaultResource={isVaultResource}
        activityType={filters.activityType}
        resourceType={filters.resourceType}
        projectId={filters.projectId}
        serviceId={filters.serviceId}
        startDate={filters.startDate}
        endDate={filters.endDate}
      />
    </div>
  );
}
