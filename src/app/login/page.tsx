'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { auth, user } from '@/lib/api';
import { deriveKEK, unwrapVaultKey, initSodium, decodeBase64 } from '@/lib/crypto';
import { useVault } from '@/contexts/VaultContext';
import { Toaster, toast } from 'sonner';
import LoginPresentation from './components/LoginPresentation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setVaultKey } = useVault();

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Start OPAQUE login
      const { startLoginRequest, clientLoginState } = opaque.client.startLogin({ password });

      // Send login start request
      const { loginResponse, loginId } = await auth.loginStart({
        username,
        startLoginRequest,
      });

      // Finish OPAQUE login
      const loginResult = opaque.client.finishLogin({
        clientLoginState,
        loginResponse,
        password,
      });
      if (!loginResult) {
        throw new Error("Login failed: invalid state or password");
      }
      const { finishLoginRequest } = loginResult;
      // Send finish login request
      await auth.loginFinish({
        loginId,
        finishLoginRequest,
      });

      // Derive KEK and unwrap vault key, then route to /vault
      await initSodium();
      const securityData = await user.getSecurity();
      // const wrappedKeyData = await user.getWrappedKey();

      if (!securityData?.vaultKdfSalt || !securityData?.vaultKdfParams || !securityData?.wrappedVaultKey) {
        throw new Error('Missing security parameters');
      }

      const saltBytes = await decodeBase64(securityData.vaultKdfSalt);
      const kek = await deriveKEK(password, saltBytes, securityData.vaultKdfParams);
      const vaultKey = await unwrapVaultKey(securityData.wrappedVaultKey, kek);

      setVaultKey(vaultKey);
      kek.fill(0);
      setPassword('');

      toast.success('Signed in');
      router.replace('/vault');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-center" duration={1500} richColors />
      
      {/* Presentation Side */}
      <LoginPresentation />
      
      {/* Form Side */}
      <div className="flex-1 lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Container maxWidth="sm">
          <Paper elevation={3} className="p-8 shadow-2xl border border-white/20 backdrop-blur-sm">
            <Typography variant="h4" component="h1" className="mb-6 text-center font-bold text-gray-800">
              Sign In
            </Typography>

            {success && (
              <Alert severity="success" className="mb-4">
                {success}
              </Alert>
            )}

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
                className="bg-white/70"
              />

              <TextField
                fullWidth
                type="password"
                label="Master Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                className="bg-white/70"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }}/> : 'Sign In to Vault'}
              </Button>
            </form>

            <Box className="mt-6 text-center">
              <Typography variant="body2" className="text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" passHref>
                  <MuiLink component="span" className="cursor-pointer font-semibold text-blue-600 hover:text-purple-600 transition-colors">
                    Create one
                  </MuiLink>
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </div>
    </div>
  );
}
