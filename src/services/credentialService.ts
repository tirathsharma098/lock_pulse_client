import { apiRequest } from './config/api';

export interface Credential {
  id: string;
  titleNonce: string;
  titleCiphertext: string;
  passwordNonce: string;
  passwordCiphertext: string;
  isLong?: boolean;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCredentialRequest {
  titleNonce: string;
  titleCiphertext: string;
  passwordNonce: string;
  passwordCiphertext: string;
  isLong?: boolean;
}

export interface UpdateCredentialRequest {
  titleNonce: string;
  titleCiphertext: string;
  passwordNonce: string;
  passwordCiphertext: string;
  isLong?: boolean;
}

export const getAllCredentials = async (projectId: string, serviceId: string): Promise<Credential[]> => {
  const response = await apiRequest(`/projects/${projectId}/services/${serviceId}/credentials`, {
    method: 'GET',
  });
  return response;
};

export const getCredential = async (projectId: string, serviceId: string, id: string): Promise<Credential> => {
  const response = await apiRequest(`/projects/${projectId}/services/${serviceId}/credentials/${id}`, {
    method: 'GET',
  });
  return response;
};

export const createCredential = async (
  projectId: string,
  serviceId: string,
  credentialData: CreateCredentialRequest
): Promise<Credential> => {
  const response = await apiRequest(`/projects/${projectId}/services/${serviceId}/credentials`, {
    method: 'POST',
    body: JSON.stringify(credentialData),
  });
  return response;
};

export const updateCredential = async (
  projectId: string,
  serviceId: string,
  id: string,
  credentialData: UpdateCredentialRequest
): Promise<Credential> => {
  const response = await apiRequest(`/projects/${projectId}/services/${serviceId}/credentials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(credentialData),
  });
  return response;
};

export const deleteCredential = async (projectId: string, serviceId: string, id: string): Promise<void> => {
  await apiRequest(`/projects/${projectId}/services/${serviceId}/credentials/${id}`, {
    method: 'DELETE',
  });
};
