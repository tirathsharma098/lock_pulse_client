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
import { auth } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

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
      const { finishLoginRequest } = opaque.client.finishLogin({
        clientLoginState,
        loginResponse,
        password,
      });

      // Send finish login request
      await auth.loginFinish({
        loginId,
        finishLoginRequest,
      });

      router.push('/unlock');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper elevation={3} className="p-8">
          <Typography variant="h4" component="h1" className="mb-6 text-center font-bold">
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="mt-6"
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Box className="mt-4 text-center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link href="/register" passHref>
                <MuiLink component="span" className="cursor-pointer">
                  Create one
                </MuiLink>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
