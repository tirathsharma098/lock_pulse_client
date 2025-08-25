'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VaultContextType {
  vaultKey: Uint8Array | null;
  setVaultKey: (key: Uint8Array | null) => void;
  isUnlocked: boolean;
  wipeVaultKey: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vaultKey, setVaultKeyState] = useState<Uint8Array | null>(null);
  const router = useRouter();

  const setVaultKey = (key: Uint8Array | null) => {
    setVaultKeyState(key);
  };

  const wipeVaultKey = () => {
    if (vaultKey) {
      // Zero out the key in memory
      vaultKey.fill(0);
    }
    setVaultKeyState(null);
  };

  useEffect(() => {
    // Wipe vault key on page unload
    const handleBeforeUnload = () => {
      wipeVaultKey();
    };

    // Wipe vault key on visibility change (e.g., tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        wipeVaultKey();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      wipeVaultKey();
    };
  }, [vaultKey]);

  const value: VaultContextType = {
    vaultKey,
    setVaultKey,
    isUnlocked: vaultKey !== null,
    wipeVaultKey,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
};
