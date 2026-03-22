<script lang="ts">
	import { supabase } from '$lib/supabase';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	async function handleRegister(e: Event) {
		e.preventDefault();
		error = '';

		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}
		if (password.length < 8) {
			error = 'Password must be at least 8 characters.';
			return;
		}

		loading = true;

		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { first_name: firstName, last_name: lastName }
			}
		});

		if (authError) {
			error = authError.message;
			loading = false;
			return;
		}

		if (data.user) {
			const { error: insertError } = await supabase.from('members').insert({
				id: data.user.id,
				first_name: firstName,
				last_name: lastName,
				email,
				membership_status: 'inactive',
				role: 'member'
			});

			if (insertError && !insertError.message.includes('duplicate')) {
				error = 'Account created but profile setup failed. Please contact IHQ.';
				loading = false;
				return;
			}
		}

		success = true;
		loading = false;
	}
</script>

<svelte:head>
	<title>Register — Kappa Alpha Psi®</title>
</svelte:head>

<section class="page-hero">
	<div class="container">
		<h1>Member Registration</h1>
		<div class="hero-divider"><span>&#9670;</span></div>
		<p>Create your account to access the member portal.</p>
	</div>
</section>

<section class="section">
	<div class="container" style="max-width:520px;">
		{#if success}
			<div class="success-card">
				<div class="success-icon">&#10003;</div>
				<h2 style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; margin-bottom:8px;">Registration Submitted</h2>
				<p style="color:var(--gray-600); font-size:0.95rem; line-height:1.75;">
					Your account has been created and is <strong>pending approval</strong>. An administrator
					will review and activate your account. You'll receive an email once approved.
				</p>
				<a href="/login" class="btn btn--primary" style="margin-top:20px;">Back to Login</a>
			</div>
		{:else}
			<div class="auth-card">
				<div class="auth-icon">
					<svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
					</svg>
				</div>

				{#if error}
					<div class="form-error">{error}</div>
				{/if}

				<form onsubmit={handleRegister}>
					<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
						<div>
							<label for="firstName" class="form-label">First Name</label>
							<input id="firstName" type="text" bind:value={firstName} required class="form-control" />
						</div>
						<div>
							<label for="lastName" class="form-label">Last Name</label>
							<input id="lastName" type="text" bind:value={lastName} required class="form-control" />
						</div>
					</div>

					<div style="margin-bottom:20px;">
						<label for="regEmail" class="form-label">Email Address</label>
						<input id="regEmail" type="email" bind:value={email} required class="form-control" placeholder="you@example.com" />
					</div>

					<div style="margin-bottom:20px;">
						<label for="regPassword" class="form-label">Password</label>
						<input id="regPassword" type="password" bind:value={password} required minlength="8" class="form-control" placeholder="At least 8 characters" />
					</div>

					<div style="margin-bottom:24px;">
						<label for="confirmPassword" class="form-label">Confirm Password</label>
						<input id="confirmPassword" type="password" bind:value={confirmPassword} required class="form-control" />
					</div>

					<button type="submit" disabled={loading} class="btn btn--primary" style="width:100%; justify-content:center;">
						{loading ? 'Creating Account...' : 'Register'}
					</button>
				</form>

				<p style="text-align:center; margin-top:20px; font-size:0.9rem; color:var(--gray-600);">
					Already have an account? <a href="/login" class="auth-link" style="font-weight:600;">Sign In</a>
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
		font-size: 1.5rem; font-weight: 700;
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
