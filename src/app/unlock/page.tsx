'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { user } from '@/lib/api';
import { deriveKEK, unwrapVaultKey, initSodium, decodeBase64 } from '@/lib/crypto';
import { useVault } from '@/contexts/VaultContext';
import sodium from 'libsodium-wrappers-sumo';

export default function UnlockPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setVaultKey } = useVault();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await initSodium();

      console.log('Starting unlock process...');
      
      // Get user security parameters
      const securityData = await user.getSecurity();
      console.log('Security data received:', { 
        hasVaultKdfSalt: !!securityData.vaultKdfSalt,
        hasVaultKdfParams: !!securityData.vaultKdfParams 
      });
      
      const wrappedKeyData = await user.getWrappedKey();
      console.log('Wrapped key data received:', { 
        hasWrappedVaultKey: !!wrappedKeyData.wrappedVaultKey,
        wrappedKeyLength: wrappedKeyData.wrappedVaultKey?.length 
      });

      const { vaultKdfSalt, vaultKdfParams } = securityData;
      const { wrappedVaultKey } = wrappedKeyData;

      // Validate required data
      if (!vaultKdfSalt || !vaultKdfParams || !wrappedVaultKey) {
        throw new Error('Missing security parameters');
      }

      // Derive KEK from password
      const saltBytes = await decodeBase64(vaultKdfSalt);
      console.log('Salt bytes length:', saltBytes.length);
      
      const kek = await deriveKEK(password, saltBytes, vaultKdfParams);
      console.log('KEK derived, length:', kek.length);

      // Unwrap vault key
      console.log('Attempting to unwrap vault key...');
      console.log('Wrapped key preview:', wrappedVaultKey.substring(0, 50) + '...');
      
      const vaultKey = await unwrapVaultKey(wrappedVaultKey, kek);
      console.log('Vault key unwrapped successfully, length:', vaultKey.length);

      // Store vault key in context
      setVaultKey(vaultKey);

      // Clear sensitive data
      kek.fill(0);
      setPassword('');

      // Navigate to the vault
      router.replace('/vault');
      return;
    } catch (err: any) {
      console.error('Unlock error:', err);
      
      // More specific error messages
      if (err.message.includes('incomplete input')) {
        setError('Corrupted vault data. Please contact support.');
      } else if (err.message.includes('Failed to unwrap vault key')) {
        setError('Invalid master password or corrupted vault key.');
      } else if (err.message.includes('Missing security parameters')) {
        setError('Account setup incomplete. Please re-register.');
      } else {
        setError('Invalid master password or corrupted data');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper elevation={3} className="p-8 text-center">
          <LockOpenIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          
          <Typography variant="h4" component="h1" className="mb-2 font-bold">
            Unlock Vault
          </Typography>
          
          <Typography variant="body1" className="mb-6 text-gray-600">
            Enter your master password to decrypt your vault
          </Typography>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              type="password"
              label="Master Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="mt-6"
            >
              {loading ? <CircularProgress size={24} /> : 'Unlock Vault'}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
