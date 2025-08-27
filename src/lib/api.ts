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

  console.log(`Making API request to: ${url}`);
  console.log('Request config:', { 
    method: config.method || 'GET',
    credentials: config.credentials,
    headers: config.headers 
  });

  const response = await fetch(url, config);
  
  console.log(`Response status: ${response.status}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ code: 'UNKNOWN_ERROR', message: 'Unknown error' }));
    console.error('API Error:', error);
    throw new ApiError(error.code || 'UNKNOWN_ERROR', error.message || 'Unknown error', response.status);
  }

  const data = await response.json();
  console.log(`Response data for ${endpoint}:`, data);
  return data;
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
    registrationRequest: string;
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
