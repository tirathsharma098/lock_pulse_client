import { apiRequest } from './config/api';

export interface SecurityData {
  vaultKdfSalt: string;
  vaultKdfParams: any;
  wrappedVaultKey: string;
}

export const userService = {
  getSecurity: (): Promise<SecurityData> => 
    apiRequest('/me/security'),

  getWrappedKey: () => 
    apiRequest('/me/wrapped-key'),
};
