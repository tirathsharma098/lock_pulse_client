'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconButton } from '@/components/ui/icon-button';
import Link from 'next/link';
import * as opaque from '@serenity-kit/opaque';
import { authService, userService } from '@/services';
import { deriveKEK, unwrapVaultKey, initSodium, decodeBase64, getEncryptedSize } from '@/lib/crypto';
import { useVault } from '@/contexts/VaultContext';
import { toast } from 'sonner';
import LoginPresentation from '../components/LoginPresentation';
import { z } from 'zod'; // add zod
import { Shield, Send, Loader2 } from 'lucide-react';
import styles from './LoginPresentation.module.css';
import FullPageSpinner from '@/components/ui/full-page-loader';
import { saveUser } from '@/lib/usersFn';
import RecentUsers from './RecentUsers';

// local schema
const loginSchema = z.object({
  username: z.string().min(5, 'Username is required'),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(60, { message: 'Username should not exceed 60 characters' })
    .refine((val) => getEncryptedSize(val) <= 1024, {
      message: 'Encrypted password must be less than 1 KB',
    }),
});

export default function LoginClient() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deviceVerificationRequired, setDeviceVerificationRequired] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  // track field-level issues
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setVaultData, vaultKey, wipeVaultKey } = useVault();
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  useEffect(()=> {
    const handleBeforeLoad = async () => {
      try{
        const res = await fetch('api/auth/check-cookie',{
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success && vaultKey)
          router.replace('/account');
        else if(data.success && !vaultKey){
          await fetch('/api/auth/check-cookie', {
            credentials: 'include',
            method: 'POST',
          })
        }
      } catch(err){
        toast.error("Something went wrong");
      } finally {
        wipeVaultKey();
        setIsInitialLoad(true);
      }
    }
    handleBeforeLoad();
  }, []);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    }
    if (searchParams.get('restored') === 'true') {
      const restoredUsername = searchParams.get('username');
      setSuccess(
        restoredUsername
          ? `Account restored. Use username "${restoredUsername}" to sign in.`
          : 'Account restored. Please sign in with your previous username.',
      );
      if (!username && restoredUsername) {
        setUsername(restoredUsername);
      }
    }
    if (searchParams.get('reason') === 'expired') {
      toast.info("Session expired. Please log in again.");
    }
  }, [searchParams, username]);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const formatCooldown = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setDeviceVerificationRequired(false);
    setLoading(true);

    // zod validation (replace native/inline validation)
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setLoading(false);
      setError('Please fix the form');
      return;
    }

    try {
      // Start OPAQUE login
      const { startLoginRequest, clientLoginState } = opaque.client.startLogin({ password });

      // Send login start request - Updated to use authService
      const { loginResponse, loginId, code: loginCode, email } = await authService.loginStart({
        username,
        startLoginRequest,
        otp: otp || undefined,
      });
      if(loginCode === 'EMAIL_NOT_VERIFIED') {
        setError('Email not verified. Please verify your email before logging in.');
        setLoading(false);
        if (email) {
          router.replace(`/${email}/verify-email`);
        }
        return;
      }
      if (loginCode === 'DEVICE_VERIFICATION_REQUIRED') {
        setDeviceVerificationRequired(true);
        setMaskedEmail(email || '');
        setLoading(false);
        return;
      }
      if (loginCode === 'OTP_INVALID') {
        setDeviceVerificationRequired(true);
        setMaskedEmail(email || '');
        setError('Invalid or expired verification code.');
        setLoading(false);
        return;
      }
      if(!loginResponse || !loginId || loginResponse === 'decoy_response') {
        throw new Error('Username or password is incorrect');
      }
      // Finish OPAQUE login
      const loginResult = opaque.client.finishLogin({
        clientLoginState,
        loginResponse,
        password,
      });
      // console.log(">> OPAQUE loginResult:", loginResult);
      if (!loginResult) {
        throw new Error("Username or password is incorrect");
      }
      const { finishLoginRequest } = loginResult;
      
      // Send finish login request - Updated to use authService
      await authService.loginFinish({
        loginId,
        finishLoginRequest,
      });

      // Derive KEK and unwrap vault key, then route to /vault
      await initSodium();
      const securityData = await userService.getSecurity(); // Updated to use userService

      if (!securityData?.vaultKdfSalt || !securityData?.vaultKdfParams || !securityData?.wrappedVaultKey) {
        throw new Error('Missing security parameters');
      }

      const saltBytes = await decodeBase64(securityData.vaultKdfSalt);
      const kek = await deriveKEK(password, saltBytes, securityData.vaultKdfParams);
      const vaultKey = await unwrapVaultKey(securityData.wrappedVaultKey, kek);

      setVaultData(vaultKey, username, securityData.email);
      kek.fill(0);
      setPassword('');
      saveUser(username);
      toast.success('Signed in');
      router.replace('/account');
    } catch (err: any) {
      // console.log(">> Error during login:", err);
      setError(err?.message || 'Login failed');
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return ( isInitialLoad ? <div className="min-h-screen flex">
      {/* Presentation Side */}
      <LoginPresentation />
      
      {/* Form Side */}
      <div className="flex-1 lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-4 md:p-4">
        <div className="w-full max-w-md p-0 sm:p-4">
          <div className="p-8 shadow-2xl border border-white/20 backdrop-blur-sm rounded-2xl bg-white">
            <div className='lg:hidden'>
              <div className="flex items-center justify-center mb-4">
                <Link href='/' >
                  <div className={`${styles.logoContainer} animate-pulse`}>
                    <Shield className="h-16 w-16 text-blue-600 drop-shadow-lg" />
                  </div>
                </Link>
              </div>
            </div>
            <h1 className="mt-5 mb-6 text-center text-3xl font-bold text-gray-800">
              Sign In
            </h1>

            {success && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="!space-y-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors((p) => ({ ...p, username: undefined }));
                }}
                disabled={loading}
                autoComplete="off"
                className="bg-white/70"
                error={fieldErrors.username}
              />

              <Input
                type="password"
                label="Master Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                disabled={loading}
                autoComplete="off"
                className="bg-white/70"
                error={fieldErrors.password}
              />

              {deviceVerificationRequired && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <p className="font-semibold">Verify new device</p>
                  <p className="mt-1 text-amber-800">
                    Send a code to {maskedEmail || 'your email'} and enter it below to continue.
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <Input
                        label="Verification code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={loading}
                        className="bg-white/70"
                      />
                    </div>
                    <IconButton
                      aria-label="Send verification code"
                      title={otpCooldown > 0 ? `Resend in ${formatCooldown(otpCooldown)}` : 'Send code'}
                      onClick={async () => {
                        if (sendingOtp || !username || otpCooldown > 0) return;
                        setSendingOtp(true);
                        setError('');
                        try {
                          await authService.sendVerifyDeviceCode({ username });
                          toast.success('Verification code sent');
                          setOtpCooldown(90);
                        } catch (err: any) {
                          setError(err?.message || 'Failed to send verification code');
                        } finally {
                          setSendingOtp(false);
                        }
                      }}
                      disabled={sendingOtp || !username || otpCooldown > 0}
                      className="h-10 w-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {sendingOtp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </IconButton>
                  </div>
                  {otpCooldown > 0 && (
                    <p className="mt-2 text-xs text-amber-800">
                      Resend available in {formatCooldown(otpCooldown)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Link href="/reset-password" className="text-sm font-semibold text-red-600 hover:text-red-500">
                  Reset password
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg text-white"
              >
                Sign In to Vault
              </Button>
            </form>

            <div className="mt-6 text-center text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-purple-600 transition-colors">
                Create one
              </Link>
            </div>
          </div>

          <div className="mt-4">
            <RecentUsers 
              onSelectUser={(selectedUsername) => {
                setUsername(selectedUsername);
                if (fieldErrors.username) setFieldErrors((p) => ({ ...p, username: undefined }));
              }}
            />
          </div>
        </div>
      </div>
    </div> : <FullPageSpinner/>
  );
}
