<script lang="ts">
	let {
		loading = false,
		disabled = false,
		label = 'Submit',
		loadingLabel = 'Processing...',
		type = 'submit' as 'submit' | 'button',
		onclick = undefined as (() => void) | undefined,
		style = ''
	}: {
		loading?: boolean;
		disabled?: boolean;
		label?: string;
		loadingLabel?: string;
		type?: 'submit' | 'button';
		onclick?: (() => void) | undefined;
		style?: string;
	} = $props();
</script>

<button
	{type}
	disabled={disabled || loading}
	class="progress-btn"
	class:progress-btn--loading={loading}
	{onclick}
	{style}
>
	{#if loading}
		<div class="progress-bar"></div>
		<span class="progress-btn-content">
			<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
				<circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-linecap="round" />
			</svg>
			{loadingLabel}
		</span>
	{:else}
		<span class="progress-btn-content">{label}</span>
	{/if}
</button>

<style>
	.progress-btn {
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 14px 24px;
		border: none;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		background: var(--crimson, #c8102e);
		color: white;
		transition: background 0.2s, opacity 0.2s;
	}

	.progress-btn:hover:not(:disabled) {
		background: var(--crimson-dark, #8b0000);
	}

	.progress-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.progress-btn--loading {
		background: var(--crimson-dark, #8b0000);
		cursor: wait;
	}

	.progress-btn-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		position: relative;
		z-index: 1;
	}

	.progress-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: rgba(255, 255, 255, 0.15);
		animation: progress-sweep 2s ease-in-out infinite;
		border-radius: inherit;
	}

	@keyframes progress-sweep {
		0% { width: 0%; left: 0; }
		50% { width: 60%; left: 20%; }
		100% { width: 0%; left: 100%; }
	}

	.spinner {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>
