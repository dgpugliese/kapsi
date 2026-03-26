<script lang="ts">
	import '../app.css';
	import Header from '$components/Header.svelte';
	import Footer from '$components/Footer.svelte';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { page } from '$app/stores';

	let { children } = $props();

	const isPortal = $derived($page.url.pathname.startsWith('/portal'));

	onMount(() => {
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
			if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
				invalidateAll();
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<meta name="description" content="Kappa Alpha Psi Fraternity, Inc. — Achievement in every field of human endeavor. Founded January 5, 1911." />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Kappa Alpha Psi Fraternity, Inc." />
</svelte:head>

{#if isPortal}
	{@render children()}
{:else}
	<div class="flex min-h-screen flex-col">
		<Header />
		<main class="flex-1">
			{@render children()}
		</main>
		<Footer />
	</div>
{/if}
