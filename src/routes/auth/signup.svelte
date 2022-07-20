<script lang="ts">
	import Logo from '$components/Logo.svelte';
	import Modal from '$components/Modal.svelte';

	import { auth } from '$lib/firebase';

	import { createUserWithEmailAndPassword } from 'firebase/auth';

	let email = '';
	let password = '';
	let confirmPassword = '';

	let modalOpen = false;
	let titleText = '';
	let descriptionText = '';
	let submitText = '';
	let type: 'info' | 'success' | 'error' = 'info';

	const handleSubmit = async () => {
		try {
			if (password !== confirmPassword) {
				throw {
					code: 'auth/password-mismatch',
				};
			}

			await createUserWithEmailAndPassword(auth, email, password);

			type = 'success';
			titleText = 'You have signed up';
			descriptionText = 'Please wait while we redirect you';
			submitText = 'Close';
		} catch (untypedError: unknown) {
			const error = untypedError as { code: string };

			switch (error.code) {
				case 'auth/email-already-in-use':
					type = 'error';
					titleText = 'Email already in use';
					descriptionText = 'Please enter a different email address';
					break;
				case 'auth/invalid-email':
					type = 'error';
					titleText = 'Invalid email';
					descriptionText = 'Please enter a valid email address';
					break;
				case 'auth/weak-password':
					type = 'error';
					titleText = 'Weak password';
					descriptionText = 'The password you entered is less than 6 characters long';
					break;
				case 'auth/password-mismatch':
					type = 'error';
					titleText = 'Password mismatch';
					descriptionText = 'The passwords you entered do not match';
					break;
				default:
					type = 'error';
					titleText = 'Error';
					descriptionText = 'An unknown error has occurred';
					break;
			}

			submitText = 'Try again';
		}

		modalOpen = true;
	};
</script>

<Modal
	bind:open={modalOpen}
	{submitText}
	{titleText}
	{descriptionText}
	{type}
	submitOnly={true}
	on:submit={() => (modalOpen = false)}
/>

<div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<Logo class="mx-auto h-12 w-auto" />
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for an account</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			or
			<a href="/auth/signin" class="font-medium text-indigo-600 hover:text-indigo-500">
				sign in if you have one
			</a>
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<form on:submit|preventDefault={handleSubmit} class="space-y-6" action="#" method="POST">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
					<div class="mt-1">
						<input
							bind:value={email}
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
					<div class="mt-1">
						<input
							bind:value={password}
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<label for="confirm-password" class="block text-sm font-medium text-gray-700"
						>Confirm Password</label
					>
					<div class="mt-1">
						<input
							bind:value={confirmPassword}
							id="confirm-password"
							name="confirm-password"
							type="password"
							required
							class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>Sign up</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
