<script>
	import { fly } from 'svelte/transition';

	import { getStores } from '$app/stores';
	const { page } = getStores();
</script>

{#key $page.url}
	<div in:fly={{ delay: 400, x: 10 }} out:fly={{ duration: 400, x: 10 }}>
		<slot />
	</div>
{/key}
