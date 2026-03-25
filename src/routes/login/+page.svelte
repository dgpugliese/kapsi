<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let ssoLoading = $state(false);
	let error = $state('');

	const redirectTo = $derived($page.url.searchParams.get('redirect') || '/portal');

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (authError) {
			error = authError.message;
			loading = false;
			return;
		}

		goto(redirectTo);
	}

	async function handleSalesforceSSO() {
		ssoLoading = true;
		error = '';

		const { error: ssoError } = await supabase.auth.signInWithOAuth({
			provider: 'custom:salesforce' as any,
			options: {
				redirectTo: window.location.origin + redirectTo
			}
		});

		if (ssoError) {
			error = ssoError.message;
			ssoLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Brother's Only — Kappa Alpha Psi®</title>
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Brother's Only</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Sign in to your membership portal.</p>
	</div>
</section>

<section class="section">
	<div class="container" style="max-width:480px;">
		<div class="auth-card">
			<div class="auth-icon">
				<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
				</svg>
			</div>

			{#if error}
				<div class="form-error">{error}</div>
			{/if}

			<!-- Salesforce SSO -->
			<button
				onclick={handleSalesforceSSO}
				disabled={ssoLoading}
				class="sso-btn"
			>
				<img src="/images/crest.png" alt="" class="sso-icon" />
				{ssoLoading ? 'Redirecting...' : 'Sign in with Kappa Credentials'}
			</button>

			<div class="divider">
				<span>or sign in with email</span>
			</div>

			<form onsubmit={handleLogin}>
				<div style="margin-bottom:20px;">
					<label for="email" class="form-label">Email Address</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						autocomplete="email"
						class="form-control"
						placeholder="you@example.com"
					/>
				</div>

				<div style="margin-bottom:24px;">
					<label for="password" class="form-label">Password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						autocomplete="current-password"
						class="form-control"
						placeholder="Enter your password"
					/>
				</div>

				<button type="submit" disabled={loading} class="btn btn--primary" style="width:100%; justify-content:center;">
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>

			<div class="auth-links">
				<a href="/forgot-password" class="auth-link">Forgot your password?</a>
				<p style="font-size:0.9rem; color:var(--gray-600); margin-top:12px;">
					Don't have an account? <a href="/register" class="auth-link" style="font-weight:600;">Register</a>
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.auth-card {
		background: var(--white); border-radius: var(--radius-lg);
		padding: 40px 32px; box-shadow: var(--shadow-md); text-align: center;
	}
	.auth-icon {
		width: 56px; height: 56px; border-radius: 50%;
		background: linear-gradient(160deg, var(--crimson-dark), var(--crimson));
		color: var(--cream); display: flex; align-items: center; justify-content: center;
		margin: 0 auto 24px;
	}
	.form-label {
		display: block; font-size: 0.82rem; font-weight: 600;
		color: var(--gray-800); margin-bottom: 6px; text-align: left;
	}
	.form-error {
		background: #FEF2F2; color: #991B1B;
		padding: 12px 16px; border-radius: var(--radius);
		font-size: 0.9rem; margin-bottom: 24px; text-align: left;
	}
	.auth-links {
		margin-top: 24px; text-align: center;
	}
	.auth-link {
		font-size: 0.9rem; color: var(--crimson); text-decoration: none;
		transition: color var(--transition);
	}
	.auth-link:hover { color: var(--crimson-dark); }

	/* SSO Button */
	.sso-btn {
		width: 100%; display: flex; align-items: center; justify-content: center;
		gap: 12px; padding: 14px 24px; border-radius: var(--radius);
		background: linear-gradient(160deg, var(--crimson-dark), var(--crimson));
		color: var(--white); font-size: 0.95rem; font-weight: 600;
		border: none; cursor: pointer; transition: all 0.25s ease;
		box-shadow: 0 4px 12px rgba(139, 0, 0, 0.25);
	}
	.sso-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(139, 0, 0, 0.35);
	}
	.sso-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
	.sso-icon { width: 24px; height: 24px; object-fit: contain; }

	/* Divider */
	.divider {
		display: flex; align-items: center; gap: 16px;
		margin: 24px 0; color: var(--gray-400); font-size: 0.8rem;
		text-transform: uppercase; letter-spacing: 0.5px;
	}
	.divider::before, .divider::after {
		content: ''; flex: 1; height: 1px; background: var(--gray-200);
	}

	@media (max-width: 480px) {
		.auth-card { padding: 28px 20px; }
	}
</style>
