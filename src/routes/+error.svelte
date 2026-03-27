<script lang="ts">
	import { page } from '$app/stores';

	const status = $derived($page.status);
	const message = $derived($page.error?.message || '');

	const errorInfo = $derived(() => {
		switch (status) {
			case 403:
				return {
					title: 'Access Denied',
					description: 'You don\'t have permission to view this page.',
					action: 'If you believe this is an error, please log in with an authorized account or contact your chapter\'s Keeper of Records.',
					actionLink: '/login',
					actionLabel: 'Log In'
				};
			case 404:
				return {
					title: 'Page Not Found',
					description: 'The page you\'re looking for doesn\'t exist or has been moved.',
					action: 'Double-check the URL or navigate back to a page you know.',
					actionLink: '/',
					actionLabel: 'Go Home'
				};
			case 500:
				return {
					title: 'Something Went Wrong',
					description: 'We encountered an unexpected error on our end.',
					action: 'Please try again in a few moments. If the problem persists, contact International Headquarters.',
					actionLink: '/',
					actionLabel: 'Go Home'
				};
			default:
				return {
					title: `Error ${status}`,
					description: message || 'An unexpected error occurred.',
					action: 'Please try again or navigate back.',
					actionLink: '/',
					actionLabel: 'Go Home'
				};
		}
	});
</script>

<svelte:head>
	<title>{errorInfo().title} — Kappa Alpha Psi Fraternity, Inc.</title>
</svelte:head>

<div class="error-page">
	<div class="error-content">
		<img src="/images/trademarks/coatofarms_large.png" alt="Kappa Alpha Psi Coat of Arms" class="error-logo" />

		<div class="error-code">{status}</div>
		<h1 class="error-title">{errorInfo().title}</h1>
		<p class="error-description">{errorInfo().description}</p>

		{#if message && message !== errorInfo().description}
			<p class="error-detail">{message}</p>
		{/if}

		<p class="error-action">{errorInfo().action}</p>

		<div class="error-buttons">
			<a href={errorInfo().actionLink} class="error-btn error-btn--primary">
				{errorInfo().actionLabel}
			</a>
			{#if status === 404}
				<a href="/portal" class="error-btn error-btn--outline">
					Member Portal
				</a>
			{/if}
			{#if status === 403}
				<a href="/" class="error-btn error-btn--outline">
					Go Home
				</a>
			{/if}
			{#if status === 500}
				<button class="error-btn error-btn--outline" onclick={() => location.reload()}>
					Try Again
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.error-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 24px;
		background: linear-gradient(170deg, #f8f6f3 0%, #fff 50%, #f8f6f3 100%);
	}

	.error-content {
		text-align: center;
		max-width: 480px;
		width: 100%;
	}

	.error-logo {
		width: 80px;
		height: auto;
		margin: 0 auto 24px;
		display: block;
		opacity: 0.85;
	}

	.error-code {
		font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
		font-size: 5rem;
		font-weight: 700;
		color: var(--crimson, #8B0000);
		line-height: 1;
		margin-bottom: 8px;
		letter-spacing: -2px;
	}

	.error-title {
		font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--black, #1a1a1a);
		margin-bottom: 12px;
	}

	.error-description {
		font-size: 1rem;
		color: var(--gray-600, #4b5563);
		line-height: 1.6;
		margin-bottom: 8px;
	}

	.error-detail {
		font-size: 0.82rem;
		color: var(--gray-400, #9ca3af);
		background: var(--gray-50, #f9fafb);
		padding: 8px 14px;
		border-radius: 8px;
		margin-bottom: 12px;
		font-family: monospace;
		word-break: break-word;
	}

	.error-action {
		font-size: 0.9rem;
		color: var(--gray-500, #6b7280);
		line-height: 1.5;
		margin-bottom: 28px;
	}

	.error-buttons {
		display: flex;
		justify-content: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.error-btn {
		padding: 12px 28px;
		border-radius: 10px;
		font-size: 0.9rem;
		font-weight: 600;
		font-family: inherit;
		text-decoration: none;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
	}

	.error-btn--primary {
		background: var(--crimson, #8B0000);
		color: white;
	}
	.error-btn--primary:hover {
		background: var(--crimson-dark, #5C0000);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(139, 0, 0, 0.3);
	}

	.error-btn--outline {
		background: white;
		color: var(--crimson, #8B0000);
		border: 1.5px solid rgba(139, 0, 0, 0.2);
	}
	.error-btn--outline:hover {
		border-color: var(--crimson, #8B0000);
		background: rgba(139, 0, 0, 0.03);
	}

	@media (max-width: 480px) {
		.error-code { font-size: 3.5rem; }
		.error-title { font-size: 1.3rem; }
		.error-buttons { flex-direction: column; }
		.error-btn { width: 100%; text-align: center; }
	}
</style>
