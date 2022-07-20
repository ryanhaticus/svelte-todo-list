<script lang="ts">
	import { goto } from '$app/navigation';

	import Loading from '$components/Loading.svelte';

	import { auth } from '$lib/firebase';

	import { signOut } from 'firebase/auth';
	import { onMount } from 'svelte';

	onMount(async () => {
		await signOut(auth);
		goto('/auth/signin');
	});
</script>

<Loading class="min-h-screen bg-indigo-600 flex items-center justify-center" />
