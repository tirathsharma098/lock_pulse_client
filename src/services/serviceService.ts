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
  isLong?: boolean;
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
  isLong?: boolean;
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
  isLong?: boolean;
}

export const getAllServices = async (projectId: string, queryParams?: string): Promise<{ items: Service[]; total: number; page: number }> => {
  const url = queryParams ? `/projects/${projectId}/services?${queryParams}` : `/projects/${projectId}/services`;
  const response = await apiRequest(url, {
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

export async function searchServicesAutocomplete(
  projectId: string,
  query: string
): Promise<Array<{ id: string; name: string }>> {
  if (!query || query.trim().length < 1 || !projectId) {
    return [];
  }
  return apiRequest(`/projects/${projectId}/services/search/autocomplete?q=${encodeURIComponent(query)}`);
}
