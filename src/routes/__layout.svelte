<script>
	import '$css/tailwind.css';

	import '$lib/firebase';

	import '$stores/auth';
	import '$stores/user';
	import '$stores/tasks';
</script>

<svelte:head>
	<link rel="icon" type="favicon/svg+xml" href="/favicon.svg" />
	<title>Todo List</title>
</svelte:head>

<slot />
