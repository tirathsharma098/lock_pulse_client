export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
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

export const createService = (baseEndpoint: string) => ({
  get: (path: string = '') => apiRequest(`${baseEndpoint}${path}`),
  post: (data: any, path: string = '') => apiRequest(`${baseEndpoint}${path}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (data: any, path: string = '') => apiRequest(`${baseEndpoint}${path}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (path: string = '') => apiRequest(`${baseEndpoint}${path}`, {
    method: 'DELETE',
  }),
});
