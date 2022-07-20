<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let child: HTMLDivElement;

	const handleClickOutside = (e: MouseEvent) => {
		if (child.contains(e.target as Node)) return;

		dispatch('click-outside');
	};
</script>

<svelte:window on:click={(e) => handleClickOutside(e)} />

<div class="contents" bind:this={child}>
	<slot />
</div>
