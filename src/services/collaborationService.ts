import { VaultKdfParams } from '@/lib/crypto';
import { apiRequest } from './config/api';

interface ShareProjectData {
  projectId: string;
  collaboratorId: string;
}

export interface SharedUser {
  sr: number;
  id: string;
  username: string;
  email: string;
  sharedAt: string;
}

export interface Collaborator {
  id: string;
  username: string;
  email: string;
}

export interface SharedProject {
  id: string;
  title: string;
  summary: string;
  vaultKdfSalt: string;
  vaultKdfParams: VaultKdfParams;
  wrappedVaultKey: string;
  sharedAt: string;
}

export const shareProject = async (data: ShareProjectData): Promise<{ success: boolean }> => {
  return apiRequest('/collaboration/share', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const unshareProject = async (data: ShareProjectData): Promise<{ success: boolean }> => {
  return apiRequest('/collaboration/share', {
    method: 'DELETE',
    body: JSON.stringify(data),
  });
};

export const getSharedUsers = async (projectId: string, search?: string): Promise<SharedUser[]> => {
  const params = new URLSearchParams();
  if (search) {
    params.append('search', search);
  }
  const query = params.toString();
  const url = `/collaboration/project/${projectId}/shared-users${query ? `?${query}` : ''}`;
  
  return apiRequest(url);
};

export const getCollaboratorsForUser = async (): Promise<Collaborator[]> => {
  return apiRequest('/collaboration/collaborators-for-user');
};

export const getSharedProjects = async (ownerId: string): Promise<SharedProject[]> => {
  return apiRequest(`/collaboration/${ownerId}/shared-projects`);
};

export const searchUsers = async (search: string): Promise<Collaborator[]> => {
  const params = new URLSearchParams({ search });
  return apiRequest(`/collaboration/search-users?${params.toString()}`);
};

export const getProjectDetails = async (projectId: string): Promise<any> => {
  return apiRequest(`/collaboration/project/${projectId}/details`);
};
