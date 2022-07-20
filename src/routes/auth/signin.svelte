<script lang="ts">
	import Logo from '$components/Logo.svelte';
	import Modal from '$components/Modal.svelte';

	import { auth } from '$lib/firebase';

	import { signInWithEmailAndPassword } from 'firebase/auth';

	let email = '';
	let password = '';

	let modalOpen = false;
	let titleText = '';
	let descriptionText = '';
	let submitText = '';
	let type: 'info' | 'success' | 'error' = 'info';

	const handleSubmit = async () => {
		try {
			await signInWithEmailAndPassword(auth, email, password);

			type = 'success';
			titleText = 'You have signed in';
			descriptionText = 'Please wait while we redirect you';
			submitText = 'Close';
		} catch (untypedError: unknown) {
			const error = untypedError as { code: string };

			switch (error.code) {
				case 'auth/invalid-email':
					type = 'error';
					titleText = 'Invalid email';
					descriptionText = 'Please enter a valid email address';
					break;
				case 'auth/user-disabled':
					type = 'error';
					titleText = 'Account disabled';
					descriptionText = 'Your account has been disabled';
					break;
				case 'auth/user-not-found':
					type = 'error';
					titleText = 'User not found';
					descriptionText = 'No user found with this email address';
					break;
				case 'auth/wrong-password':
					type = 'error';
					titleText = 'Wrong password';
					descriptionText = 'The password you entered is incorrect';
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
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			or
			<a href="/auth/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
				sign up if you don't have one
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

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
						/>
						<label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
					</div>

					<div class="text-sm">
						<a
							href="/auth/forgotpassword"
							class="font-medium text-indigo-600 hover:text-indigo-500"
						>
							Forgot your password?
						</a>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>Sign in</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
