'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface VaultContextType {
  vaultKey: Uint8Array | null;
  projectVaultKey: Uint8Array | null;
  serviceVaultKey: Uint8Array | null;
  username: string | null;
  email: string | null;
  setVaultData: (key: Uint8Array | null, username: string, email: string) => void;
  setProjectVaultKey: (key: Uint8Array | null) => void;
  setServiceVaultKey: (key: Uint8Array | null) => void;
  isUnlocked: boolean;
  wipeVaultKey: () => void;
  isCollaborating: boolean;
  setIsCollaborating: (value: boolean) => void;
  collaboratorId?: string | null;
  setCollaboratorId: (id: string) => void;
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
  const [projectVaultKey, setProjectVaultKey] = useState<Uint8Array | null>(null);
  const [serviceVaultKey, setServiceVaultKey] = useState<Uint8Array | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isCollaborating, setIsCollaborating] = useState<boolean>(false);
  const [collaboratorId, setCollaboratorId] = useState<string | null>(null);

  const setVaultData = (key: Uint8Array | null, username: string, email: string) => {
    console.debug('[vault-ctx] setVaultKey called. len=', key?.length ?? null);
    setVaultKeyState(key);
    setUsername(username);
    setEmail(email);
  };

  const wipeVaultKey = () => {
    if (vaultKey) {
      // Zero out the key in memory
      vaultKey.fill(0);
      console.debug('[vault-ctx] wipeVaultKey zeroed. prevLen=', vaultKey.length);
    } else {
      console.debug('[vault-ctx] wipeVaultKey called with null key');
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
      // Do NOT wipe here — this cleanup runs on re-renders (e.g., when vaultKey changes)
      // wiping here would instantly clear the key after setVaultKey.
    };
  }, []); // run once on mount, not on vaultKey changes

  const value: VaultContextType = {
    vaultKey,
    projectVaultKey,
    serviceVaultKey,
    username,
    email,
    setVaultData,
    setProjectVaultKey,
    setServiceVaultKey,
    isUnlocked: vaultKey !== null,
    wipeVaultKey,
    isCollaborating, 
    setIsCollaborating,
    collaboratorId,
    setCollaboratorId,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
};
