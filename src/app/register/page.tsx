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
import { authService } from '@/services'; // Updated import
import { generateVaultKey, generateSalt, deriveKEK, wrapVaultKey, combineNonceAndCiphertext, getDefaultKdfParams, initSodium, getEncryptedSize } from '@/lib/crypto';
import RegisterPresentation from './components/RegisterPresentation';
import { z } from 'zod'; // add zod

// local schema
const registerSchema = z.object({
  username: z.preprocess(
    (val) => typeof val === 'string' ? val.toLowerCase().trim() : val,
    z.string()
      .min(5, { message: 'Username must be at least 5 characters' })
      .max(60, { message: 'Username should not exceed 60 characters' })
      .refine((val) => /^[a-z0-9]+$/.test(val), {
        message: 'Username must contain only letters and numbers',
      })
  ),
   email: z
   .string()
   .min(5, { message: "Email is required" })
   .max(320, { message: "Email must be at most 320 characters" })
   .toLowerCase()
   .trim(),
  password: z.string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .refine((val) => getEncryptedSize(val) <= 1024, {
    message: 'Encrypted password must be less than 1 KB',
  }),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((v) => v.password === v.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // zod validation (replace inline checks)
    const result = registerSchema.safeParse({ username, email, password, confirmPassword });
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setError(Object.values(errs)[0] || 'Please fix the form');
      return;
    }

    setLoading(true);

    try {
      await initSodium();

      // Start OPAQUE registration
      const { registrationRequest, clientRegistrationState } = opaque.client.startRegistration({ password });

      // Send registration request to server - Updated to use authService
      const { registrationResponse } = await authService.registerStart({
        username,
        registrationRequest,
      });

      // Generate vault key and encryption parameters
      const vaultKey = await generateVaultKey();
      const vaultKdfSalt = await generateSalt();
      const defaultKdfParams = await getDefaultKdfParams();
      const kek = await deriveKEK(password, vaultKdfSalt, defaultKdfParams);
      const { nonce, ciphertext } = await wrapVaultKey(vaultKey, kek);
      const wrappedVaultKey = await combineNonceAndCiphertext(nonce, ciphertext);

      // Finish OPAQUE registration
      const { registrationRecord } = opaque.client.finishRegistration({
        clientRegistrationState,
        registrationResponse,
        password,
      });

      // Send final registration data - Updated to use authService
      await authService.registerFinish({
        username,
        email,
        registrationRecord,
        registrationRequest,
        wrappedVaultKey,
        vaultKdfSalt: Buffer.from(vaultKdfSalt).toString('base64'),
        vaultKdfParams: defaultKdfParams,
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

    const passwordSize = password ? getEncryptedSize(password) : 0;

  return (
    <div className="min-h-screen flex">
      {/* Presentation Side */}
      <RegisterPresentation />
      
      {/* Form Side */}
      <div className="flex-1 lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Container maxWidth="sm">
          <Paper elevation={3} className="p-8 shadow-2xl border border-white/20 backdrop-blur-sm">
            <Typography variant="h4" component="h1" className="!mb-6 text-center font-bold text-gray-800">
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
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors((p) => ({ ...p, username: undefined }));
                }}
                disabled={loading}
                autoComplete="username"
                className="bg-white/70"
                error={!!fieldErrors.username}
                helperText={fieldErrors.username ?? ''}
              />
               <TextField
            fullWidth
            // type="email"
            label="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            disabled={loading}
            autoComplete="email"
          />
              <Box>
              <TextField
                fullWidth
                type="password"
                label="Master Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                disabled={loading}
                autoComplete="new-password"
                className="bg-white/70"
                error={!!fieldErrors.password}
                helperText={fieldErrors.password ?? ''}
              />
              {password && (
              <Typography variant="caption" color="textSecondary" className="mt-1 block">
                Encrypted size: {passwordSize} bytes
              </Typography>
            )}
            </Box>
              <TextField
                fullWidth
                type="password"
                label="Confirm Master Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
                }}
                disabled={loading}
                autoComplete="new-password"
                className="bg-white/70"
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword ?? ''}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }}/> : 'Create Secure Vault'}
              </Button>
            </form>

            <Box className="mt-6 text-center">
              <Typography variant="body2" className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" passHref>
                  <MuiLink component="span" className="cursor-pointer font-semibold text-blue-600 hover:text-purple-600 transition-colors">
                    Sign in
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
