<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let showForgot = $state(false);
	let forgotEmail = $state('');
	let forgotSent = $state(false);
	let forgotLoading = $state(false);

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
			error = authError.message === 'Invalid login credentials'
				? 'Invalid email or password. Please try again.'
				: authError.message;
			loading = false;
			return;
		}

		goto(redirectTo);
	}

	async function handleForgotPassword(e: Event) {
		e.preventDefault();
		forgotLoading = true;
		error = '';

		const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
			redirectTo: window.location.origin + '/reset-password'
		});

		if (resetError) {
			error = resetError.message;
		} else {
			forgotSent = true;
		}
		forgotLoading = false;
	}
</script>

<svelte:head>
	<title>Sign In — Brother's Only — Kappa Alpha Psi Fraternity, Inc.</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<!-- Logo -->
		<div class="login-logo">
			<img src="/images/trademarks/coatofarms_large.png" alt="Kappa Alpha Psi" />
		</div>

		<h1 class="login-title">Brother's Only</h1>
		<p class="login-subtitle">Sign in to your membership portal</p>

		{#if error}
			<div class="login-error">{error}</div>
		{/if}

		{#if showForgot}
			<!-- Forgot Password -->
			{#if forgotSent}
				<div class="login-success">
					Password reset link sent to <strong>{forgotEmail}</strong>. Check your email.
				</div>
				<button class="login-back" onclick={() => { showForgot = false; forgotSent = false; error = ''; }}>
					Back to Sign In
				</button>
			{:else}
				<p class="forgot-desc">Enter your email address and we'll send you a link to reset your password.</p>
				<form onsubmit={handleForgotPassword}>
					<div class="field">
						<label for="forgot-email">Email Address</label>
						<input
							id="forgot-email"
							type="email"
							bind:value={forgotEmail}
							required
							autocomplete="email"
							placeholder="you@example.com"
							autofocus
						/>
					</div>
					<button type="submit" class="login-btn" disabled={forgotLoading}>
						{forgotLoading ? 'Sending...' : 'Send Reset Link'}
					</button>
				</form>
				<button class="login-back" onclick={() => { showForgot = false; error = ''; }}>
					Back to Sign In
				</button>
			{/if}
		{:else}
			<!-- Sign In Form -->
			<form onsubmit={handleLogin}>
				<div class="field">
					<label for="email">Email Address</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						autocomplete="email"
						placeholder="you@example.com"
					/>
				</div>

				<div class="field">
					<div class="field-header">
						<label for="password">Password</label>
						<button type="button" class="forgot-link" onclick={() => { showForgot = true; forgotEmail = email; error = ''; }}>
							Forgot password?
						</button>
					</div>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						autocomplete="current-password"
						placeholder="Enter your password"
					/>
				</div>

				<button type="submit" class="login-btn" disabled={loading}>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>

			<div class="login-footer">
				<p>Don't have an account? <a href="/register">Create one</a></p>
			</div>
		{/if}
	</div>

	<p class="login-legal">
		Kappa Alpha Psi Fraternity, Inc. &copy; {new Date().getFullYear()}
	</p>
</div>

<style>
	.login-page {
		min-height: 100vh; display: flex; flex-direction: column;
		align-items: center; justify-content: center;
		padding: 40px 20px;
		background: linear-gradient(170deg, #1a0000 0%, #3d0000 40%, #5c0000 100%);
	}

	.login-card {
		width: 100%; max-width: 400px;
		background: white; border-radius: 20px;
		padding: 40px 32px; text-align: center;
		box-shadow: 0 20px 60px rgba(0,0,0,0.4);
	}

	.login-logo { margin-bottom: 20px; }
	.login-logo img { width: 72px; height: auto; opacity: 0.9; }

	.login-title {
		font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
		font-size: 1.6rem; font-weight: 700; color: var(--crimson, #8b0000);
		margin-bottom: 4px;
	}
	.login-subtitle {
		font-size: 0.88rem; color: var(--gray-500, #6b7280);
		margin-bottom: 28px;
	}

	.login-error {
		background: #fef2f2; color: #991b1b;
		padding: 12px 16px; border-radius: 10px;
		font-size: 0.85rem; margin-bottom: 20px; text-align: left;
	}
	.login-success {
		background: #ecfdf5; color: #065f46;
		padding: 12px 16px; border-radius: 10px;
		font-size: 0.85rem; margin-bottom: 20px; text-align: left;
	}

	.field { margin-bottom: 18px; text-align: left; }
	.field label {
		display: block; font-size: 0.78rem; font-weight: 600;
		color: var(--gray-700, #374151); margin-bottom: 6px;
	}
	.field input {
		width: 100%; padding: 12px 14px;
		border: 1.5px solid var(--gray-200, #e5e7eb);
		border-radius: 10px; font-size: 0.92rem; font-family: inherit;
		background: var(--gray-50, #f9fafb); transition: all 0.2s;
	}
	.field input:focus {
		outline: none; border-color: var(--crimson, #8b0000);
		background: white; box-shadow: 0 0 0 3px rgba(139,0,0,0.06);
	}
	.field input::placeholder { color: var(--gray-400, #9ca3af); }

	.field-header {
		display: flex; justify-content: space-between; align-items: center;
	}
	.forgot-link {
		font-size: 0.75rem; color: var(--crimson, #8b0000);
		background: none; border: none; cursor: pointer;
		font-family: inherit; font-weight: 500;
	}
	.forgot-link:hover { text-decoration: underline; }

	.forgot-desc {
		font-size: 0.85rem; color: var(--gray-500); margin-bottom: 20px;
		line-height: 1.5; text-align: left;
	}

	.login-btn {
		width: 100%; padding: 13px;
		background: linear-gradient(160deg, var(--crimson-dark, #5c0000), var(--crimson, #8b0000));
		color: white; border: none; border-radius: 10px;
		font-size: 0.95rem; font-weight: 600; font-family: inherit;
		cursor: pointer; transition: all 0.2s;
		box-shadow: 0 4px 12px rgba(139,0,0,0.25);
	}
	.login-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(139,0,0,0.35);
	}
	.login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

	.login-back {
		display: block; width: 100%; margin-top: 16px; padding: 10px;
		background: none; border: 1px solid var(--gray-200); border-radius: 10px;
		color: var(--gray-600); font-size: 0.88rem; font-family: inherit;
		cursor: pointer; transition: all 0.2s;
	}
	.login-back:hover { border-color: var(--crimson); color: var(--crimson); }

	.login-footer {
		margin-top: 24px; padding-top: 20px;
		border-top: 1px solid var(--gray-100, #f3f4f6);
	}
	.login-footer p { font-size: 0.85rem; color: var(--gray-500); }
	.login-footer a {
		color: var(--crimson, #8b0000); text-decoration: none; font-weight: 600;
	}
	.login-footer a:hover { text-decoration: underline; }

	.login-legal {
		margin-top: 24px; font-size: 0.72rem;
		color: rgba(255,255,255,0.3); text-align: center;
	}

	@media (max-width: 480px) {
		.login-page { padding: 24px 16px; }
		.login-card { padding: 32px 24px; border-radius: 16px; }
		.login-title { font-size: 1.4rem; }
	}
</style>
