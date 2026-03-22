<script lang="ts">
	import { supabase } from '$lib/supabase';

	let email = $state('');
	let loading = $state(false);
	let sent = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/callback?type=recovery`
		});

		if (authError) {
			error = authError.message;
		} else {
			sent = true;
		}
		loading = false;
	}
</script>

<svelte:head>
	<title>Forgot Password — Kappa Alpha Psi®</title>
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Reset Password</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Enter your email to receive a password reset link.</p>
	</div>
</section>

<section class="section">
	<div class="container" style="max-width:480px;">
		{#if sent}
			<div class="success-card">
				<div class="success-icon">
					<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
					</svg>
				</div>
				<h2 style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; margin-bottom:8px;">Check Your Email</h2>
				<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.75;">
					If an account exists for <strong>{email}</strong>, we've sent a password reset link.
					Check your inbox and spam folder.
				</p>
				<a href="/login" class="btn btn--outline" style="margin-top:20px;">Back to Login</a>
			</div>
		{:else}
			<div class="auth-card">
				<div class="auth-icon">
					<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
					</svg>
				</div>

				{#if error}
					<div class="form-error">{error}</div>
				{/if}

				<form onsubmit={handleSubmit}>
					<div style="margin-bottom:24px;">
						<label for="email" class="form-label">Email Address</label>
						<input id="email" type="email" bind:value={email} required class="form-control" placeholder="you@example.com" />
					</div>
					<button type="submit" disabled={loading} class="btn btn--primary" style="width:100%; justify-content:center;">
						{loading ? 'Sending...' : 'Send Reset Link'}
					</button>
				</form>

				<p style="text-align:center; margin-top:20px;">
					<a href="/login" class="auth-link">Back to Login</a>
				</p>
			</div>
		{/if}
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
	.success-card {
		background: var(--cream); border-radius: var(--radius-lg);
		padding: 48px; text-align: center;
	}
	.success-icon {
		width: 56px; height: 56px; border-radius: 50%;
		background: #D1FAE5; color: #065F46;
		display: flex; align-items: center; justify-content: center;
		margin: 0 auto 16px;
	}
	.auth-link {
		font-size: 0.9rem; color: var(--crimson); text-decoration: none;
		transition: color var(--transition);
	}
	.auth-link:hover { color: var(--crimson-dark); }

	@media (max-width: 480px) {
		.auth-card { padding: 28px 20px; }
	}
</style>
