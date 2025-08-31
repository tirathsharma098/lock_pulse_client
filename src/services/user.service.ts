import { apiRequest } from './config/api';

export interface SecurityData {
  email:string;
  vaultKdfSalt: string;
  vaultKdfParams: any;
  wrappedVaultKey: string;
}

export const userService = {
  getSecurity: (): Promise<SecurityData> => 
    apiRequest('/me/security'),

  getWrappedKey: () => 
    apiRequest('/me/wrapped-key'),

  updatePasswordStart: async(data: { registrationRequest: string }) =>{
    return apiRequest('/me/update-password/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updatePasswordFinish: async(data: {
    registrationRecord: string;
    registrationRequest: string;
    wrappedVaultKey: string;
    vaultKdfSalt: string;
    vaultKdfParams: any;
  }) => {
    return apiRequest('/me/update-password/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateEmail: async(data: {
    email: string;
  }) => {
    return apiRequest('/me/update-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
