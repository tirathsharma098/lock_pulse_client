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
import { generateVaultKey, generateSalt, deriveKEK, wrapVaultKey, combineNonceAndCiphertext, getDefaultKdfParams, initSodium } from '@/lib/crypto';

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

    console.log('📝 Registration: Starting registration process...');

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
      console.log('🔧 Registration: Initializing sodium...');
      await initSodium();
      console.log('✅ Registration: Sodium initialized');

      // Start OPAQUE registration
      console.log('🔧 Registration: Starting OPAQUE registration...');
      const { registrationRequest, clientRegistrationState } = opaque.client.startRegistration({ password });
      console.log('✅ Registration: OPAQUE registration started');

      // Send registration request to server
      console.log('🔧 Registration: Sending registration request to server...');
      const { registrationResponse } = await auth.registerStart({
        username,
        registrationRequest,
      });
      console.log('✅ Registration: Received response from server');

      // Generate vault key and encryption parameters
      console.log('🔧 Registration: Generating vault key...');
      const vaultKey = await generateVaultKey();
      console.log('✅ Registration: Vault key generated');

      console.log('🔧 Registration: Generating vault KDF salt...');
      const vaultKdfSalt = await generateSalt();
      console.log('✅ Registration: Vault KDF salt generated');

      console.log('🔧 Registration: Getting default KDF params...');
      const defaultKdfParams = await getDefaultKdfParams();
      console.log('✅ Registration: Default KDF params obtained');

      console.log('🔧 Registration: Deriving KEK... THIS IS WHERE THE ERROR LIKELY OCCURS');
      const kek = await deriveKEK(password, vaultKdfSalt, defaultKdfParams);
      console.log('✅ Registration: KEK derived successfully');

      console.log('🔧 Registration: Wrapping vault key...');
      const { nonce, ciphertext } = await wrapVaultKey(vaultKey, kek);
      console.log('✅ Registration: Vault key wrapped');

      console.log('🔧 Registration: Combining nonce and ciphertext...');
      const wrappedVaultKey = await combineNonceAndCiphertext(nonce, ciphertext);
      console.log('✅ Registration: Nonce and ciphertext combined');

      // Finish OPAQUE registration
      console.log('🔧 Registration: Finishing OPAQUE registration...');
      const { registrationRecord } = opaque.client.finishRegistration({
        clientRegistrationState,
        registrationResponse,
        password,
      });
      console.log('✅ Registration: OPAQUE registration finished');

      // Send final registration data
      console.log('🔧 Registration: Sending final registration data...');
      await auth.registerFinish({
        username,
        registrationRecord,
        wrappedVaultKey,
        vaultKdfSalt: Buffer.from(vaultKdfSalt).toString('base64'),
        vaultKdfParams: defaultKdfParams,
      });
      console.log('✅ Registration: Registration completed successfully');

      // Clear sensitive data
      vaultKey.fill(0);
      kek.fill(0);

      router.push('/login?registered=true');
    } catch (err: any) {
      console.error('❌ Registration: Error occurred:', err);
      console.error('❌ Registration: Error stack:', err.stack);
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
