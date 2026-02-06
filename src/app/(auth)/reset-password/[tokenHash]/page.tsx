"use client";

import { use, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as opaque from '@serenity-kit/opaque';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';
import { authService } from '@/services';
import {
  generateVaultKey,
  generateSalt,
  deriveKEK,
  wrapVaultKey,
  combineNonceAndCiphertext,
  getDefaultKdfParams,
  initSodium,
  getEncryptedSize,
} from '@/lib/crypto';

const resetSchema = z.object({
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

type ResetStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ResetPasswordTokenPage({
  params,
}: {
  params: Promise<{ tokenHash: string }>;
}) {
  const { tokenHash } = use(params);
  const token = useMemo(() => decodeURIComponent(tokenHash || ''), [tokenHash]);
  const router = useRouter();
  const redirectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<ResetStatus>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  useEffect(() => {
    return () => {
      if (redirectRef.current) clearTimeout(redirectRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError('');
    setFieldErrors({});

    const result = resetSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setError('Please fix the form');
      return;
    }

    setStatus('loading');

    try {
      await initSodium();

      const { registrationRequest, clientRegistrationState } = opaque.client.startRegistration({ password });
      const { registrationResponse } = await authService.resetPasswordStart({
        token,
        registrationRequest,
      });

      const vaultKey = await generateVaultKey();
      const vaultKdfSalt = await generateSalt();
      const defaultKdfParams = await getDefaultKdfParams();
      const kek = await deriveKEK(password, vaultKdfSalt, defaultKdfParams);
      const { nonce, ciphertext } = await wrapVaultKey(vaultKey, kek);
      const wrappedVaultKey = await combineNonceAndCiphertext(nonce, ciphertext);

      const { registrationRecord } = opaque.client.finishRegistration({
        clientRegistrationState,
        registrationResponse,
        password,
      });

      await authService.resetPasswordFinish({
        token,
        registrationRecord,
        wrappedVaultKey,
        vaultKdfSalt: Buffer.from(vaultKdfSalt).toString('base64'),
        vaultKdfParams: defaultKdfParams,
      });

      vaultKey.fill(0);
      kek.fill(0);
      setStatus('success');
      redirectRef.current = setTimeout(() => {
        router.push('/login?reset=success');
      }, 1500);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Password reset failed');
    }
  };

  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-12">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur sm:p-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Set a new password</h1>
              <p className="text-sm text-slate-300">
                Your vault data will be wiped and replaced after reset.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}
          {status === 'success' && (
            <div className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Password reset successful. Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                placeholder="Enter new password"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-200">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
                }}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                placeholder="Re-enter new password"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-200">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:from-slate-500 disabled:via-slate-500 disabled:to-slate-500"
            >
              {isLoading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>

          <div className="mt-6 text-xs text-slate-400">
            <Link href="/login" className="hover:text-white">
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
