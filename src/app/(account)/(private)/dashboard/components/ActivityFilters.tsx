'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { Filter, RefreshCw } from 'lucide-react';
import ActivityTable from './ActivityTable';
import { searchProjectsAutocomplete } from '@/services/projectService';
import { searchServicesAutocomplete } from '@/services/serviceService';
import debounce from 'lodash/debounce';

interface ActivityFiltersProps {
  isVaultResource?: boolean;
}

interface Option {
  id: string;
  name: string;
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

  const [projectOptions, setProjectOptions] = useState<Option[]>([]);
  const [serviceOptions, setServiceOptions] = useState<Option[]>([]);
  const [selectedProject, setSelectedProject] = useState<Option | null>(null);
  const [selectedService, setSelectedService] = useState<Option | null>(null);
  const [projectInput, setProjectInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const [projectLoading, setProjectLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search for projects
  const debouncedSearchProjects = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery || searchQuery.trim().length < 1) {
        setProjectOptions([]);
        return;
      }
      setProjectLoading(true);
      try {
        const results = await searchProjectsAutocomplete(searchQuery);
        setProjectOptions(results);
      } catch (err) {
        console.error('Error searching projects:', err);
        setError('Failed to search projects');
      } finally {
        setProjectLoading(false);
      }
    }, 300),
    []
  );

  // Debounced search for services
  const debouncedSearchServices = useCallback(
    debounce(async (projectId: string, searchQuery: string) => {
      if (!searchQuery || searchQuery.trim().length < 1 || !projectId) {
        setServiceOptions([]);
        return;
      }
      setServiceLoading(true);
      try {
        const results = await searchServicesAutocomplete(projectId, searchQuery);
        setServiceOptions(results);
      } catch (err) {
        console.error('Error searching services:', err);
        setError('Failed to search services');
      } finally {
        setServiceLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (projectInput) {
      debouncedSearchProjects(projectInput);
    } else {
      setProjectOptions([]);
    }
  }, [projectInput, debouncedSearchProjects]);

  useEffect(() => {
    if (serviceInput && filters.projectId) {
      debouncedSearchServices(filters.projectId, serviceInput);
    } else {
      setServiceOptions([]);
    }
  }, [serviceInput, filters.projectId, debouncedSearchServices]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectChange = (event: any, value: Option | null) => {
    setSelectedProject(value);
    setFilters((prev) => ({ 
      ...prev, 
      projectId: value?.id || '',
      serviceId: '' 
    }));
    setSelectedService(null);
    setServiceOptions([]);
  };

  const handleServiceChange = (event: any, value: Option | null) => {
    setSelectedService(value);
    setFilters((prev) => ({ ...prev, serviceId: value?.id || '' }));
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
    setSelectedProject(null);
    setSelectedService(null);
    setProjectInput('');
    setServiceInput('');
    setProjectOptions([]);
    setServiceOptions([]);
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

            {isVaultResource === false && [
              <Grid key="resource_type" item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Resource Type"
                  value={filters.resourceType}
                  onChange={(e) => handleFilterChange('resourceType', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">All</MenuItem>
                  {/* {isVaultResource !== false && <MenuItem value="vault">Vault</MenuItem>} */}
                  <MenuItem key="project" value="project">Project</MenuItem>,
                  <MenuItem key="service" value="service">Service</MenuItem>,
                  <MenuItem key="credential" value="credential">Credential</MenuItem>
                </TextField>
              </Grid>,
                <Grid key="project" item xs={12} sm={6} md={3}>
                  <Autocomplete
                    size="small"
                    options={projectOptions}
                    getOptionLabel={(option) => option.name}
                    value={selectedProject}
                    onChange={handleProjectChange}
                    inputValue={projectInput}
                    onInputChange={(event, newInputValue) => {
                      setProjectInput(newInputValue);
                    }}
                    loading={projectLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {projectLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    noOptionsText="Type to search projects"
                  />
                </Grid>,
                <Grid key="service" item xs={12} sm={6} md={3}>
                  <Autocomplete
                    size="small"
                    options={serviceOptions}
                    getOptionLabel={(option) => option.name}
                    value={selectedService}
                    onChange={handleServiceChange}
                    inputValue={serviceInput}
                    onInputChange={(event, newInputValue) => {
                      setServiceInput(newInputValue);
                    }}
                    loading={serviceLoading}
                    disabled={!filters.projectId}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Service"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {serviceLoading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    noOptionsText={filters.projectId ? "Type to search services" : "Select a project first"}
                  />
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
