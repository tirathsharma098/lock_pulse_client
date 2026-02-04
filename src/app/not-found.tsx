import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
			<div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12">
				<div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur sm:p-12">
					<div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
						<div className="space-y-6">
							<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
								<ShieldAlert className="h-4 w-4" />
								404 error
							</div>

							<h1 className="text-4xl font-semibold sm:text-5xl">
								We couldn&apos;t find that page.
							</h1>
							<p className="text-base text-slate-200/90">
								The page you are looking for might have been moved, renamed, or
								temporarily unavailable. Let&apos;s get you back to a secure place.
							</p>

							<div className="flex flex-wrap gap-4">
								<Link
									href="/"
									className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl"
								>
									Go to homepage
								</Link>
								<Link
									href="/login"
									className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:text-white"
								>
									<ArrowLeft className="h-4 w-4" />
									Back to login
								</Link>
							</div>
						</div>

						<div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center shadow-xl">
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
								<ShieldAlert className="h-8 w-8" />
							</div>
							<p className="mt-6 text-sm text-slate-200/80">
								If you believe this is an error, reach out to LockPulse support
								or check the link for typos.
							</p>
							<div className="mt-6 text-xs text-slate-400">
								Error code: 404
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
