<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import {
		ClipboardListIcon,
		CheckIcon,
		ExclamationIcon,
	} from '@rgossiaux/svelte-heroicons/outline';
	import ClickOutside from '$components/clickOutside.svelte';

	const dispatch = createEventDispatcher();

	export let type: 'info' | 'success' | 'error' = 'info';
	export let submitText = 'Submit';
	export let cancelText = 'Cancel';
	export let titleText = 'Modal';
	export let descriptionText = 'Modal description';
	export let allowClickOutside = true;

	export let open = false;
	$: if (!open) {
		dispatch('close');
	}

	export let submitOnly = false;
</script>

{#if open}
	<form on:submit|preventDefault>
		<div
			transition:fade={{ duration: 200 }}
			class="relative z-10"
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true"
		>
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

			<div class="fixed z-10 inset-0 overflow-y-auto">
				<div
					class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0"
				>
					<ClickOutside
						on:click-outside={() => {
							if (!allowClickOutside) return;

							open = false;
						}}
					>
						<div
							transition:fade={{ duration: 200, delay: 200 }}
							class="w-full relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6"
						>
							<div>
								<div
									class="mx-auto flex items-center justify-center h-12 w-12 rounded-full {type ===
									'info'
										? 'bg-indigo-100'
										: type === 'success'
										? 'bg-green-100'
										: 'bg-red-100'}"
								>
									{#if type === 'info'}
										<ClipboardListIcon class="h-6 w-6 text-indigo-600" />
									{/if}
									{#if type === 'success'}
										<CheckIcon class="h-6 w-6 text-green-600" />
									{/if}
									{#if type === 'error'}
										<ExclamationIcon class="h-6 w-6 text-red-600" />
									{/if}
								</div>
								<div class="mt-3 text-center sm:mt-5">
									<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
										{titleText}
									</h3>
									<div class="mt-2">
										<p class="text-sm text-gray-500">
											{descriptionText}
										</p>
									</div>
									<div class="mt-5">
										<slot />
									</div>
								</div>
							</div>
							<div
								class="mt-5 sm:mt-6 {submitOnly
									? ''
									: 'sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense'}"
							>
								<button
									type="submit"
									class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
									>{submitText}</button
								>
								{#if !submitOnly}
									<button
										on:click={() => {
											open = false;
											dispatch('cancel');
										}}
										type="button"
										class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
										>{cancelText}</button
									>{/if}
							</div>
						</div>
					</ClickOutside>
				</div>
			</div>
		</div>
	</form>
{/if}
