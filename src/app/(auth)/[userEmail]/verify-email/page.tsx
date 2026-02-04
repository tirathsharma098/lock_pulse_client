"use client";

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Mail, ShieldCheck } from 'lucide-react';
import { authService } from '@/services';
import { useRouter } from 'next/navigation';

const COOLDOWN_MS = 90_000;
const DAILY_LIMIT = 10;

type CountRecord = {
	date: string;
	count: number;
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const formatTime = (ms: number) => {
	const totalSeconds = Math.ceil(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function VerifyEmailRequestPage({
	params,
}: {
  params: Promise<{ userEmail: string }>;
}) {
	const { userEmail } = use(params);
	const email = useMemo(
		() => decodeURIComponent(userEmail || ''),
		[userEmail],
	);
	const router = useRouter();
	const [count, setCount] = useState(0);
	const [cooldownUntil, setCooldownUntil] = useState(0);
	const [remainingMs, setRemainingMs] = useState(0);
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (!email || typeof window === 'undefined') return;
		const countKey = `verify-email-count:${email}`;
		const cooldownKey = `verify-email-cooldown:${email}`;
		const today = getTodayKey();

		try {
			const raw = localStorage.getItem(countKey);
			if (raw) {
				const parsed = JSON.parse(raw) as CountRecord;
				if (parsed.date === today) {
					setCount(parsed.count);
				} else {
					localStorage.setItem(countKey, JSON.stringify({ date: today, count: 0 }));
					setCount(0);
				}
			} else {
				localStorage.setItem(countKey, JSON.stringify({ date: today, count: 0 }));
				setCount(0);
			}
		} catch {
			setCount(0);
		}

		const cooldownRaw = localStorage.getItem(cooldownKey);
		const cooldownValue = cooldownRaw ? Number(cooldownRaw) : 0;
		setCooldownUntil(Number.isFinite(cooldownValue) ? cooldownValue : 0);
	}, [email]);

	useEffect(() => {
		if (!cooldownUntil) {
			setRemainingMs(0);
			return;
		}

		const tick = () => {
			const nextRemaining = Math.max(0, cooldownUntil - Date.now());
			setRemainingMs(nextRemaining);
		};

		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [cooldownUntil]);

	const attemptsLeft = Math.max(0, DAILY_LIMIT - count);
	const isCooldown = remainingMs > 0;
	const isLimitReached = count >= DAILY_LIMIT;
	const isDisabled = isSending || isCooldown || isLimitReached;

	const handleSend = async () => {
		if (!email || isDisabled || typeof window === 'undefined') return;
		setError('');
		setSuccess('');
		setIsSending(true);

		try {
			const resp = await authService.sendVerificationEmail({ email });
			if(resp.case === "EMAIL_ALREADY_VERIFIED") {
				setSuccess('Email is already verified. You can sign in now.');
				router.push('/login');
				return;
			}
			const today = getTodayKey();
			const countKey = `verify-email-count:${email}`;
			const cooldownKey = `verify-email-cooldown:${email}`;
			const nextCount = Math.min(DAILY_LIMIT, count + 1);

			localStorage.setItem(countKey, JSON.stringify({ date: today, count: nextCount }));
			setCount(nextCount);

			const nextCooldown = Date.now() + COOLDOWN_MS;
			localStorage.setItem(cooldownKey, String(nextCooldown));
			setCooldownUntil(nextCooldown);
			setSuccess('Verification link sent. Check your inbox.');
		} catch (err: any) {
			setError(err?.message || 'Failed to send verification link.');
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
			<div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12">
				<div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
							<ShieldCheck className="h-4 w-4" />
							Secure onboarding
						</div>
						<h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
							Verify your email to activate your LockPulse vault
						</h1>
						<p className="text-base text-slate-600">
							We just sent your account details through our zero-knowledge pipeline.
							Confirm your email address to unlock secure sign-in and recovery.
						</p>

						<div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm">
							<Mail className="h-4 w-4 text-blue-600" />
							<span className="font-medium">{email || 'Your email address'}</span>
						</div>

						<div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
							<span>Already verified?</span>
							<Link
								href="/login"
								className="font-semibold text-blue-600 transition hover:text-indigo-600"
							>
								Sign in
							</Link>
						</div>
					</div>

					<div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur">
						<div className="space-y-5">
							<div>
								<h2 className="text-xl font-semibold text-slate-900">Send verification link</h2>
								<p className="mt-2 text-sm text-slate-600">
									Click the button to email a new verification link to your inbox.
								</p>
							</div>

							{error && (
								<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
									{error}
								</div>
							)}

							{success && (
								<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
									{success}
								</div>
							)}

							<button
								type="button"
								onClick={handleSend}
								disabled={isDisabled}
								className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300"
							>
								{isSending
									? 'Sending...'
									: isLimitReached
										? 'Daily limit reached'
										: isCooldown
											? `Resend in ${formatTime(remainingMs)}`
											: 'Send verification link'}
							</button>

							<p className="text-xs text-slate-500">
								If you do not see the email, check your spam folder or whitelist
								LockPulse notifications.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
