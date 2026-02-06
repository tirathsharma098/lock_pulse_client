"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Mail } from 'lucide-react';
import { authService } from '@/services';

export default function ResetPasswordPage() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (cooldown <= 0) return;
		const timer = setInterval(() => {
			setCooldown((prev) => Math.max(prev - 1, 0));
		}, 1000);
		return () => clearInterval(timer);
	}, [cooldown]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || loading || cooldown > 0) return;
		setLoading(true);
		setError('');
		setSuccess('');
		try {
			await authService.sendResetPasswordEmail({ email });
			setSuccess('If your account exists, a reset link has been sent to your email.');
			setCooldown(90);
		} catch (err: any) {
			setError(err?.message || 'Failed to send reset email');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
			<div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-12">
				<div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur sm:p-12">
					<div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
						<div className="space-y-6">
							<div className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
								<AlertTriangle className="h-4 w-4" />
								Important warning
							</div>
							<h1 className="text-3xl font-semibold sm:text-4xl">Reset your password</h1>
							<p className="text-base text-slate-200/90">
								Resetting your password will permanently remove your vault data. Without your
								original password, your credentials cannot be recovered.
							</p>
							<div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
								<p className="font-semibold">Data loss notice</p>
								<p className="mt-2 text-rose-100/90">
									Your vault, projects, services, and credentials will be deleted after a reset.
									This action cannot be undone.
								</p>
							</div>
							<p className="text-sm text-slate-300/80">
								Need help? Contact support or sign in if you remember your password.
							</p>
							<Link href="/login" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
								Return to login
							</Link>
						</div>

						<div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl">
							<h2 className="text-lg font-semibold">Send reset link</h2>
							<p className="mt-1 text-sm text-slate-300">
								Enter your account email and we will send a reset link.
							</p>

							{error && (
								<div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
									{error}
								</div>
							)}
							{success && (
								<div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
									{success}
								</div>
							)}

							<form onSubmit={handleSubmit} className="mt-6 space-y-4">
								<label className="block text-sm font-medium text-slate-200">Email address</label>
								<div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
									<Mail className="h-4 w-4 text-slate-300" />
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="you@company.com"
										className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
									/>
								</div>

								<button
									type="submit"
									disabled={loading || cooldown > 0 || !email}
									className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:from-slate-500 disabled:via-slate-500 disabled:to-slate-500"
								>
									{cooldown > 0
										? `Try again in ${Math.ceil(cooldown / 60)}:${String(cooldown % 60).padStart(2, '0')}`
										: loading
											? 'Sending...'
											: 'Send reset password email'}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
