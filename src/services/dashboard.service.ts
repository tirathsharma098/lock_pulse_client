import { apiRequest } from './config/api';

export interface ActivityQueryParams {
  limit?: number;
  cursor?: string;
  activityType?: string;
  resourceType?: string;
  projectId?: string;
  serviceId?: string;
  resourceId?: string;
  isVaultResource?: boolean;
  date?: string;
}

export interface Activity {
  id: string;
  activityType: string;
  resourceType: string;
  resourceName: string;
  resourceId: string;
  projectId?: string;
  serviceId?: string;
  isVaultResource: boolean;
  createdAt: string;
  ipAddress: string;
  userAgent: string;
  metadata?: string;
}

export interface ActivityResponse {
  activities: Activity[];
  limit: number;
  nextCursor: string | null;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StatsData {
  totalActivities: number;
  viewCount: number;
  writeCount: number;
  byResourceType: Array<{ resourceType: string; count: string }>;
  byActivityType: Array<{ activityType: string; count: string }>;
}

export interface ResourceStats {
  totalViews: number;
  totalWrites: number;
  recentActivities: Activity[];
}

export interface ProjectStats {
  resourceType: string;
  activityType: string;
  count: string;
}

class DashboardService {
  /**
   * Get activities with optional filters
   */
  async getActivities(params: ActivityQueryParams = {}): Promise<ActivityResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.activityType) searchParams.append('activityType', params.activityType);
    if (params.resourceType) searchParams.append('resourceType', params.resourceType);
    if (params.projectId) searchParams.append('projectId', params.projectId);
    if (params.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params.resourceId) searchParams.append('resourceId', params.resourceId);
    if (params.isVaultResource !== undefined) {
      searchParams.append('isVaultResource', params.isVaultResource.toString());
    }
    if (params.date) searchParams.append('date', params.date);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/activity-log?${queryString}` : '/activity-log';

    return apiRequest(endpoint);
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(filter?: 'vault' | 'project'): Promise<StatsData> {
    let endpoint = '/activity-log/dashboard/stats';
    
    if (filter === 'vault') {
      endpoint += '?vault=true';
    } else if (filter === 'project') {
      endpoint += '?vault=false';
    }

    return apiRequest(endpoint);
  }

  /**
   * Get statistics for a specific resource
   */
  async getResourceStats(
    resourceType: string,
    resourceId: string
  ): Promise<ResourceStats> {
    return apiRequest(
      `/activity-log/resource/${resourceType}/${resourceId}`);
  }

  /**
   * Get statistics for a specific project
   */
  async getProjectStats(projectId: string): Promise<ProjectStats[]> {
    return apiRequest(
      `/activity-log/project/${projectId}/stats`);
  }
}

export const dashboardService = new DashboardService();