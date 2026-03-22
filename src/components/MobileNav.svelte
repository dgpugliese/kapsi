<script lang="ts">
	type NavLink = {
		label: string;
		href: string;
		children?: { label: string; href: string }[];
	};

	let { open = $bindable(false), navLinks = [] }: { open: boolean; navLinks: NavLink[] } = $props();

	let expandedSection = $state<string | null>(null);

	function toggleSection(label: string) {
		expandedSection = expandedSection === label ? null : label;
	}

	function close() {
		open = false;
		expandedSection = null;
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/50 z-50 lg:hidden"
		onclick={close}
		role="presentation"
	></div>

	<!-- Drawer -->
	<nav
		class="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto lg:hidden"
		aria-label="Mobile navigation"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200">
			<span class="font-serif text-lg font-bold text-crimson-900">Menu</span>
			<button
				class="p-2 text-charcoal hover:bg-gray-100 rounded-md"
				onclick={close}
				aria-label="Close menu"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Links -->
		<div class="py-2">
			{#each navLinks as link}
				{#if link.children}
					<div>
						<button
							class="flex items-center justify-between w-full px-6 py-3 text-charcoal hover:bg-cream/50 transition-colors"
							onclick={() => toggleSection(link.label)}
						>
							<span class="font-medium">{link.label}</span>
							<svg
								class="h-4 w-4 text-gray-400 transition-transform {expandedSection === link.label ? 'rotate-180' : ''}"
								fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
							>
								<path d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						{#if expandedSection === link.label}
							<div class="bg-cream-100 py-1">
								{#each link.children as child}
									<a
										href={child.href}
										class="block px-10 py-2.5 text-sm text-charcoal hover:text-crimson transition-colors"
										onclick={close}
									>
										{child.label}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<a
						href={link.href}
						class="block px-6 py-3 font-medium text-charcoal hover:bg-cream/50 transition-colors"
						onclick={close}
					>
						{link.label}
					</a>
				{/if}
			{/each}
		</div>

		<!-- Login button -->
		<div class="p-4 border-t border-gray-200">
			<a
				href="/login"
				class="block w-full text-center px-4 py-3 bg-crimson text-white font-medium rounded-lg hover:bg-crimson-700 transition-colors"
				onclick={close}
			>
				Member Login
			</a>
		</div>
	</nav>
{/if}
