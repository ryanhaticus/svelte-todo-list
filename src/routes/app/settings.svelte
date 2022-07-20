<script lang="ts">
	import Modal from '$components/modal.svelte';

	import { user } from '$stores/auth';
	import { appUser } from '$stores/user';

	import type { ITodoListUser } from '$types/TodoListUser';

	let modalOpen = false;

	let displayName: string;
	let avatar: string;

	appUser.subscribe((user) => {
		displayName = user?.displayName ?? 'Todo List User';
		avatar = user?.avatar ?? '';
	});

	const handleSubmit = () => {
		appUser.set({
			...appUser,
			displayName,
			avatar,
		} as ITodoListUser);

		modalOpen = true;
	};
</script>

<Modal
	open={modalOpen}
	titleText="Changes saved"
	descriptionText="You can safely close this window"
	submitOnly={true}
	submitText="Close"
	on:submit={() => (modalOpen = false)}
/>

<div class="max-w-3xl">
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-y-4">
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
			<div class="mt-1">
				<input
					value={$user?.email}
					type="email"
					name="email"
					id="email"
					class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
					disabled
				/>
			</div>
		</div>
		<div>
			<label for="display-name" class="block text-sm font-medium text-gray-700">Display Name</label>
			<div class="mt-1">
				<input
					bind:value={displayName}
					type="text"
					name="display-name"
					id="display-name"
					class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
				/>
			</div>
		</div>
		<div>
			<label for="avatar" class="block text-sm font-medium text-gray-700">Avatar</label>
			<div class="mt-1">
				<input
					bind:value={avatar}
					type="text"
					name="avatar"
					id="avatar"
					class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
				/>
			</div>
		</div>
		<div>
			<button
				type="submit"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>Save changes</button
			>
		</div>
	</form>
</div>
