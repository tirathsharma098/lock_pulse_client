const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ code: 'UNKNOWN_ERROR', message: 'Unknown error' }));
    throw new ApiError(error.code || 'UNKNOWN_ERROR', error.message || 'Unknown error', response.status);
  }

  return response.json();
};

export const auth = {
  registerStart: (data: { username: string; registrationRequest: string }) =>
    apiRequest('/auth/register/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerFinish: (data: {
    username: string;
    registrationRecord: string;
    wrappedVaultKey: string;
    vaultKdfSalt: string;
    vaultKdfParams: any;
  }) =>
    apiRequest('/auth/register/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginStart: (data: { username: string; startLoginRequest: string }) =>
    apiRequest('/auth/login/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginFinish: (data: { loginId: string; finishLoginRequest: string }) =>
    apiRequest('/auth/login/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
};

export const user = {
  getSecurity: () => apiRequest('/me/security'),
  getWrappedKey: () => apiRequest('/me/wrapped-key'),
};

export const vault = {
  getItems: (page: number = 1) => apiRequest(`/vault/items?page=${page}`),
  
  getItem: (id: string) => apiRequest(`/vault/items/${id}`),
  
  createItem: (data: {
    titleNonce: string;
    titleCiphertext: string;
    passwordNonce: string;
    passwordCiphertext: string;
  }) =>
    apiRequest('/vault/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateItem: (id: string, data: {
    titleNonce?: string;
    titleCiphertext?: string;
    passwordNonce?: string;
    passwordCiphertext?: string;
  }) =>
    apiRequest(`/vault/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteItem: (id: string) =>
    apiRequest(`/vault/items/${id}`, {
      method: 'DELETE',
    }),
};
