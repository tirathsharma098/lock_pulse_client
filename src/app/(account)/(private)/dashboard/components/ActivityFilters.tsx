'use client';

import { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { Filter, RefreshCw, Calendar, Activity as ActivityIcon, Layers, Folder, Server } from 'lucide-react';
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

const ACTIVITY_TYPES = [
  { value: '', label: 'All Activities' },
  { value: 'view', label: 'View' },
  { value: 'find', label: 'Find' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'share', label: 'Share' },
  { value: 'unshare', label: 'Unshare' },
];

const RESOURCE_TYPES = [
  { value: '', label: 'All Resources' },
  { value: 'project', label: 'Project' },
  { value: 'service', label: 'Service' },
  { value: 'credential', label: 'Credential' },
];

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
    <div className="space-y-6">
      {/* Filters Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filter Activities
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Narrow down your activity logs
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

        {/* Filter Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Activity Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <ActivityIcon className="w-4 h-4" />
                Activity Type
              </label>
              <select
                value={filters.activityType}
                onChange={(e) => handleFilterChange('activityType', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Type - Only for projects */}
            {isVaultResource === false && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Layers className="w-4 h-4" />
                  Resource Type
                </label>
                <select
                  value={filters.resourceType}
                  onChange={(e) => handleFilterChange('resourceType', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {RESOURCE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Project Autocomplete - Only for projects */}
            {isVaultResource === false && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Folder className="w-4 h-4" />
                  Project
                </label>
                <Autocomplete
                  size="small"
                  options={projectOptions}
                  getOptionLabel={(option) => option.name}
                  value={selectedProject}
                  onChange={handleProjectChange}
                  inputValue={projectInput}
                  onInputChange={(event, newInputValue) => setProjectInput(newInputValue)}
                  loading={projectLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search projects..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {projectLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgb(249 250 251)',
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgb(209 213 219)',
                        },
                      }}
                    />
                  )}
                  noOptionsText="Type to search projects"
                />
              </div>
            )}

            {/* Service Autocomplete - Only for projects */}
            {isVaultResource === false && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Server className="w-4 h-4" />
                  Service
                </label>
                <Autocomplete
                  size="small"
                  options={serviceOptions}
                  getOptionLabel={(option) => option.name}
                  value={selectedService}
                  onChange={handleServiceChange}
                  inputValue={serviceInput}
                  onInputChange={(event, newInputValue) => setServiceInput(newInputValue)}
                  loading={serviceLoading}
                  disabled={!filters.projectId}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={filters.projectId ? "Search services..." : "Select project first"}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {serviceLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgb(249 250 251)',
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgb(209 213 219)',
                        },
                      }}
                    />
                  )}
                  noOptionsText={filters.projectId ? "Type to search services" : "Select a project first"}
                />
              </div>
            )}

            {/* Start Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4" />
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Activity Table */}
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
