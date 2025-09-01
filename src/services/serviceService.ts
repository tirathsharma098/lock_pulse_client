import { apiRequest } from './config/api';

export interface Service {
  id: string;
  name: string;
  notes?: string;
  wrappedVaultKey: string;
  vaultKdfSalt: string;
  vaultKdfParams: any;
  passwordNonce: string;
  passwordCiphertext: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  wrappedVaultKey: string;
  vaultKdfSalt: string;
  vaultKdfParams: any;
  passwordNonce: string;
  passwordCiphertext: string;
  notes?: string;
}

export interface UpdateServiceRequest {
  name?: string;
  notes?: string;
  wrappedVaultKey?: string;
  vaultKdfSalt?: string;
  vaultKdfParams?: any;
  passwordNonce?: string;
  passwordCiphertext?: string;
}

export const getAllServices = async (projectId: string): Promise<Service[]> => {
  const response = await apiRequest(`/projects/${projectId}/services`, {
    method: 'GET',
  });
  return response;
};

export const getService = async (projectId: string, id: string): Promise<Service> => {
  const response = await apiRequest(`/projects/${projectId}/services/${id}`, {
    method: 'GET',
  });
  return response;
};

export const createService = async (projectId: string, serviceData: CreateServiceRequest): Promise<Service> => {
  const response = await apiRequest(`/projects/${projectId}/services`, {
    method: 'POST',
    body: JSON.stringify(serviceData),
  });
  return response;
};

export const updateService = async (projectId: string, id: string, serviceData: UpdateServiceRequest): Promise<Service> => {
  const response = await apiRequest(`/projects/${projectId}/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  });
  return response;
};

export const deleteService = async (projectId: string, id: string): Promise<void> => {
  await apiRequest(`/projects/${projectId}/services/${id}`, {
    method: 'DELETE',
  });
};
