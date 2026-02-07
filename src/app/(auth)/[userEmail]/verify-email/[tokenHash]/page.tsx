"use client";

import { use, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';

type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

export default function VerifyEmailTokenPage({
	params,
}: {
  params: Promise<{ tokenHash: string }>;
}) {
	const { tokenHash } = use(params);
	const router = useRouter();
	const token = useMemo(
		() => decodeURIComponent(tokenHash || ''),
		[tokenHash],
	);

	const [status, setStatus] = useState<VerifyStatus>('idle');
	const [error, setError] = useState('');
	const redirectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (redirectRef.current) {
				clearTimeout(redirectRef.current);
			}
		};
	}, []);

	const handleVerify = async () => {
		if (!token || status === 'loading' || status === 'success') return;
		setError('');
		setStatus('loading');

		try {
			await authService.verifyEmailToken({ token });
			setStatus('success');
			redirectRef.current = setTimeout(() => {
				router.push('/login?registered=true');
			}, 1500);
		} catch (err: any) {
			setStatus('error');
			setError(err?.message || 'Email verification failed.');
		}
	};

	const isLoading = status === 'loading';
	const isSuccess = status === 'success';

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
			<div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-12">
				<div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur sm:p-12">
					<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
						<div className="space-y-5">
							<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
								<Sparkles className="h-4 w-4" />
								Welcome to LockPulse
							</div>

							<h1 className="text-3xl font-semibold sm:text-4xl">
								Your account is ready.
							</h1>
							<p className="text-base text-slate-200/90">
								You have successfully created your account in LockPulse — the
								zero-knowledge password manager built for modern teams. Verify
								your email to activate secure sign-in.
							</p>

							{error && (
								<div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
									{error}
								</div>
							)}

							{isSuccess && (
								<div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
									Email verified. Redirecting you to sign in...
								</div>
							)}
						</div>

						<div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/10 p-6 text-center shadow-xl">
							<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
								<ShieldCheck className="h-7 w-7" />
							</div>
							<p className="text-sm text-slate-200/80">
								Verify your email address to complete setup.
							</p>
							<Button
								type="button"
								onClick={handleVerify}
								disabled={isLoading || isSuccess}
								className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:from-slate-500 disabled:via-slate-500 disabled:to-slate-500"
							>
								{isLoading ? 'Verifying...' : isSuccess ? 'Verified' : 'Verify email'}
							</Button>
							<div className="mt-4 text-xs text-slate-400">
								<Link href="/login" className="hover:text-white">
									Return to login
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
