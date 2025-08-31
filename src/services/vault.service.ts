import { apiRequest } from './config/api';

export interface VaultItemData {
  titleNonce: string;
  titleCiphertext: string;
  passwordNonce: string;
  passwordCiphertext: string;
  isLong: boolean;
}

export interface VaultItem {
  id: string;
  titleNonce: string;
  titleCiphertext: string;
  passwordNonce?: string;
  passwordCiphertext?: string;
  createdAt: string;
  isLong?: boolean;
}

export interface VaultItemsResponse {
  items: VaultItem[];
  page: number;
  total: number;
}

export interface DecryptedItem {
  id: string;
  title: string;
  password: string;
  createdAt: string;
  isLong?: boolean;
  passwordSize?: number;
  titleSize?: number;
}

export const vaultService = {
  getItems: (query: string = ''): Promise<VaultItemsResponse> => 
    apiRequest(`/vault/items?${query}`),

  getItem: (id: string): Promise<VaultItem> => 
    apiRequest(`/vault/items/${id}`),

  createItem: (data: VaultItemData): Promise<VaultItem> =>
    apiRequest('/vault/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateItem: (id: string, data: VaultItemData): Promise<VaultItem> =>
    apiRequest(`/vault/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteItem: (id: string): Promise<void> =>
    apiRequest(`/vault/items/${id}`, {
      method: 'DELETE',
    }),
};
