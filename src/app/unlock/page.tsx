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
import { deriveKEK, unwrapVaultKey, initSodium } from '@/lib/crypto';
import { useVault } from '@/contexts/VaultContext';
import sodium from 'libsodium-wrappers';

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

      // Get user security parameters
      const { vaultKdfSalt, vaultKdfParams } = await user.getSecurity();
      const { wrappedVaultKey } = await user.getWrappedKey();

      // Derive KEK from password
      const saltBytes = sodium.from_base64(vaultKdfSalt);
      const kek = await deriveKEK(password, saltBytes, vaultKdfParams);

      // Unwrap vault key
      const vaultKey = unwrapVaultKey(wrappedVaultKey, kek);

      // Store vault key in context
      setVaultKey(vaultKey);

      // Clear sensitive data
      kek.fill(0);
      setPassword('');

      router.push('/vault');
    } catch (err: any) {
      setError('Invalid master password or corrupted data');
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
