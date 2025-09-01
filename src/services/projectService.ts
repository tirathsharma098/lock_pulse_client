import { VaultKdfParams } from '@/lib/crypto';
import { apiRequest } from './config/api';

export interface Project {
  id: string;
  name: string;
  notes?: string;
  wrappedVaultKey: string;
  vaultKdfSalt: string;
  vaultKdfParams: VaultKdfParams;
  passwordNonce: string;
  passwordCiphertext: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  wrappedVaultKey: string;
  vaultKdfSalt: string;
  vaultKdfParams: any;
  passwordNonce: string;
  passwordCiphertext: string;
  notes?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  notes?: string;
  wrappedVaultKey?: string;
  vaultKdfSalt?: string;
  vaultKdfParams?: any;
  passwordNonce?: string;
  passwordCiphertext?: string;
}

export const getAllProjects = async (): Promise<Project[]> => {
  const response = await apiRequest('/projects', {
    method: 'GET',
  });
  return response;
};

export const getProject = async (id: string): Promise<Project> => {
  const response = await apiRequest(`/projects/${id}`, {
    method: 'GET',
  });
  return response;
};

export const createProject = async (projectData: CreateProjectRequest): Promise<Project> => {
  const response = await apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
  return response;
};

export const updateProject = async (id: string, projectData: UpdateProjectRequest): Promise<Project> => {
  const response = await apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
  return response;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  });
};
