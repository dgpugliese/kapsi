<script lang="ts">
	let {
		name,
		title,
		bio = '',
		photoUrl = '',
		organization = ''
	}: {
		name: string;
		title: string;
		bio?: string;
		photoUrl?: string;
		organization?: string;
	} = $props();

	const initials = name.split(' ').map((n) => n[0]).join('');
</script>

<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
	<!-- Photo or initials -->
	<div class="aspect-[4/3] bg-gradient-to-br from-crimson-900 to-crimson-700 flex items-center justify-center">
		{#if photoUrl}
			<img src={photoUrl} alt={name} class="w-full h-full object-cover" />
		{:else}
			<span class="font-serif text-4xl font-bold text-cream/60">{initials}</span>
		{/if}
	</div>
	<div class="p-5">
		<h3 class="font-serif text-lg font-bold text-charcoal">{name}</h3>
		<p class="text-sm text-crimson font-medium mt-0.5">{title}</p>
		{#if organization}
			<p class="text-xs text-gray-500 mt-1">{organization}</p>
		{/if}
		{#if bio}
			<p class="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">{bio}</p>
		{/if}
	</div>
</div>
