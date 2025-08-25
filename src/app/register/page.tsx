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
  Box,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import * as opaque from '@serenity-kit/opaque';
import { auth } from '@/lib/api';
import { generateVaultKey, generateSalt, deriveKEK, wrapVaultKey, combineNonceAndCiphertext, DEFAULT_KDF_PARAMS, initSodium } from '@/lib/crypto';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await initSodium();

      // Start OPAQUE registration
      const { registrationRequest, clientRegistrationState } = opaque.client.startRegistration({ password });

      // Send registration request to server
      const { registrationResponse } = await auth.registerStart({
        username,
        registrationRequest,
      });

      // Generate vault key and encryption parameters
      const vaultKey = generateVaultKey();
      const vaultKdfSalt = generateSalt();
      const kek = await deriveKEK(password, vaultKdfSalt, DEFAULT_KDF_PARAMS);
      const { nonce, ciphertext } = wrapVaultKey(vaultKey, kek);
      const wrappedVaultKey = combineNonceAndCiphertext(nonce, ciphertext);

      // Finish OPAQUE registration
      const { registrationRecord } = opaque.client.finishRegistration({
        clientRegistrationState,
        registrationResponse,
        password,
      });

      // Send final registration data
      await auth.registerFinish({
        username,
        registrationRecord,
        wrappedVaultKey,
        vaultKdfSalt: Buffer.from(vaultKdfSalt).toString('base64'),
        vaultKdfParams: DEFAULT_KDF_PARAMS,
      });

      // Clear sensitive data
      vaultKey.fill(0);
      kek.fill(0);

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper elevation={3} className="p-8">
          <Typography variant="h4" component="h1" className="mb-6 text-center font-bold">
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />

            <TextField
              fullWidth
              type="password"
              label="Master Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
              helperText="This password encrypts your vault. Choose something strong and memorable."
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm Master Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="mt-6"
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </form>

          <Box className="mt-4 text-center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link href="/login" passHref>
                <MuiLink component="span" className="cursor-pointer">
                  Sign in
                </MuiLink>
              </Link>
            </Typography>
          </Box>

          <Alert severity="warning" className="mt-4">
            <Typography variant="body2">
              <strong>Important:</strong> Your master password cannot be recovered. 
              If you forget it, your data will be permanently inaccessible.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </div>
  );
}
