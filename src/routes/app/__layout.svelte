<script lang="ts">
	import { ViewListIcon, MenuAlt1Icon, CalendarIcon } from '@rgossiaux/svelte-heroicons/outline';

	import { fade, fly } from 'svelte/transition';

	import { goto } from '$app/navigation';
	import { getStores } from '$app/stores';

	import { authenticated, user } from '$stores/auth';
	import { appUser } from '$stores/user';

	import Loading from '$components/Loading.svelte';
	import Logo from '$components/Logo.svelte';
	import IgnoredClickOutside from '$components/IgnoredClickOutside.svelte';
	import Modal from '$components/Modal.svelte';
	import NewTaskModal from '$components/NewTaskModal.svelte';
	import ClickOutside from '$components/ClickOutside.svelte';
	import PageTransition from '$components/PageTransition.svelte';

	const { page } = getStores();

	const headers = [
		{ name: 'My tasks', href: '/app' },
		{ name: 'Calendar', href: '/app/calendar' },
		{ name: 'Settings', href: '/app/settings' },
	];

	let header: string;
	$: header = headers.find((h) => h.href === $page.url.pathname)?.name ?? 'Not found';

	let modalOpen = false;

	setTimeout(() => {
		modalOpen = true;
	}, 1000);

	let sideMenuOpen = false;
	let mobileMenuOpen = false;
	let newTaskModalOpen = false;
</script>

{#if $authenticated && $appUser}
	<NewTaskModal bind:open={newTaskModalOpen} />
	<div class="min-h-screen">
		<!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
		{#if mobileMenuOpen}
			<div class="relative z-40 lg:hidden" role="dialog" aria-modal="true">
				<!--
      Off-canvas menu backdrop, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
    -->
				<div
					in:fade={{ duration: 200 }}
					out:fade={{ delay: 200 }}
					class="fixed inset-0 bg-gray-600 bg-opacity-75"
				/>

				<div
					in:fly={{ delay: 200, x: -200 }}
					out:fly={{ duration: 200, x: -200 }}
					class="fixed inset-0 flex z-40"
				>
					<div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
						<div class="absolute top-0 right-0 -mr-12 pt-2">
							<button
								on:click={() => (mobileMenuOpen = false)}
								type="button"
								class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
							>
								<span class="sr-only">Close sidebar</span>
								<!-- Heroicon name: outline/x -->
								<svg
									class="h-6 w-6 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div class="flex-shrink-0 flex items-center px-4">
							<Logo href="/app" class="h-8 w-auto" />
						</div>
						<div class="mt-5 flex-1 h-0 overflow-y-auto">
							<nav class="px-2">
								<div class="space-y-1">
									<a
										on:click={() => (mobileMenuOpen = false)}
										href="/app"
										class="text-gray-600 group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md {$page
											.url.pathname === '/app'
											? 'bg-gray-100'
											: 'hover:text-gray-900 hover:bg-gray-50'}"
									>
										<ViewListIcon class="text-gray-400 mr-3 flex-shrink-0 h-6 w-6" />
										My tasks
									</a>
									<a
										on:click={() => (mobileMenuOpen = false)}
										href="/app/calendar"
										class="text-gray-600 group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md {$page
											.url.pathname === '/app/calendar'
											? 'bg-gray-100'
											: 'hover:text-gray-900 hover:bg-gray-50'}"
									>
										<CalendarIcon class="text-gray-400 mr-3 flex-shrink-0 h-6 w-6" />
										Calendar
									</a>
								</div>
							</nav>
						</div>
					</div>

					<div class="flex-shrink-0 w-14" aria-hidden="true">
						<!-- Dummy element to force sidebar to shrink to fit close icon -->
					</div>
				</div>
			</div>{/if}

		<!-- Static sidebar for desktop -->
		<div
			class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:pt-5 lg:pb-4 lg:bg-gray-100"
		>
			<div class="flex items-center flex-shrink-0 px-6">
				<Logo href="/app" class="h-8 w-auto" />
			</div>
			<!-- Sidebar component, swap this element with another sidebar if you like -->
			<div class="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
				<!-- User account dropdown -->
				<div class="pt-2 px-3 relative inline-block text-left">
					<div>
						<IgnoredClickOutside>
							<button
								on:click={() => (sideMenuOpen = true)}
								type="button"
								class="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
								id="options-menu-button"
								aria-expanded="false"
								aria-haspopup="true"
							>
								<span class="flex w-full justify-between items-center">
									<span class="flex min-w-0 items-center justify-between space-x-3">
										<img
											class="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
											src={$appUser?.avatar}
											alt="User"
										/>
										<span class="flex-1 flex flex-col min-w-0">
											<span class="text-gray-900 text-sm font-medium truncate"
												>{$appUser?.displayName ?? 'Todo List User'}</span
											>
											<span class="text-gray-500 text-sm truncate">{$user?.email}</span>
										</span>
									</span>
									<!-- Heroicon name: solid/selector -->
									<svg
										class="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
											clip-rule="evenodd"
										/>
									</svg>
								</span>
							</button></IgnoredClickOutside
						>
					</div>

					{#if sideMenuOpen}
						<ClickOutside on:click-outside={(e) => (sideMenuOpen = false)}>
							<div
								transition:fade={{ duration: 200 }}
								class="z-10 mx-3 origin-top absolute right-0 left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="options-menu-button"
								tabindex="-1"
								on:click={() => (sideMenuOpen = false)}
							>
								<div class="py-1" role="none">
									<a
										href="/app/settings"
										class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
										role="menuitem"
										tabindex="-1"
										id="options-menu-item-1">Settings</a
									>
								</div>
								<div class="py-1" role="none">
									<a
										href="/auth/signout"
										class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
										role="menuitem"
										tabindex="-1"
										id="options-menu-item-5">Sign out</a
									>
								</div>
							</div></ClickOutside
						>
					{/if}
				</div>

				<!-- Navigation -->
				<nav class="px-3 mt-6">
					<div class="space-y-1">
						<a
							href="/app"
							class="text-gray-700group flex items-center px-2 py-2 text-sm font-medium rounded-md {$page
								.url.pathname === '/app'
								? 'bg-gray-200'
								: 'hover:text-gray-900 hover:bg-gray-50'}"
						>
							<ViewListIcon
								class="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
							/>
							My tasks
						</a>
						<a
							href="/app/calendar"
							class="text-gray-700group flex items-center px-2 py-2 text-sm font-medium rounded-md {$page
								.url.pathname === '/app/calendar'
								? 'bg-gray-200'
								: 'hover:text-gray-900 hover:bg-gray-50'}"
						>
							<CalendarIcon
								class="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6"
							/>
							Calendar
						</a>
					</div>
				</nav>
			</div>
		</div>
		<!-- Main column -->
		<div class="lg:pl-64 flex flex-col">
			<!-- Search header -->
			<div
				class="sticky top-0 z-10 flex-shrink-0 flex justify-between h-16 bg-white border-b border-gray-200 lg:hidden"
			>
				<!-- Sidebar toggle, controls the 'sidebarOpen' sidebar state. -->
				<button
					on:click={() => (mobileMenuOpen = true)}
					type="button"
					class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
				>
					<span class="sr-only">Open sidebar</span>
					<MenuAlt1Icon class="h-6 w-6" />
				</button>
				<div class="flex justify-between px-4 sm:px-6 lg:px-8">
					<div class="flex items-center">
						<!-- Profile dropdown -->
						<div class="ml-3 relative">
							<div>
								<IgnoredClickOutside>
									<button
										on:click={() => (sideMenuOpen = true)}
										type="button"
										class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										id="user-menu-button"
										aria-expanded="false"
										aria-haspopup="true"
									>
										<span class="sr-only">Open user menu</span>
										<img class="h-8 w-8 rounded-full" src={$appUser?.avatar} alt="User" />
									</button></IgnoredClickOutside
								>
							</div>

							{#if sideMenuOpen}
								<ClickOutside on:click-outside={() => (sideMenuOpen = false)}>
									<div
										transition:fade={{ duration: 200 }}
										class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="user-menu-button"
										tabindex="-1"
									>
										<div class="py-1" role="none">
											<a
												href="/app/settings"
												class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
												role="menuitem"
												tabindex="-1"
												id="user-menu-item-1">Settings</a
											>
										</div>
										<div class="py-1" role="none">
											<a
												href="/auth/signout"
												class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
												role="menuitem"
												tabindex="-1"
												id="user-menu-item-5">Sign out</a
											>
										</div>
									</div></ClickOutside
								>{/if}
						</div>
					</div>
				</div>
			</div>
			<main class="flex-1 flex flex-col min-h-screen">
				<!-- Page title & actions -->
				<div
					class="border-b border-gray-200 px-4 py-4 flex items-center justify-between sm:px-6 lg:px-8"
				>
					<div class="flex-1 min-w-0">
						<h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">{header}</h1>
					</div>
					<div>
						<IgnoredClickOutside>
							<button
								on:click={() => (newTaskModalOpen = true)}
								type="button"
								class="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:order-1 sm:ml-3"
								>New task</button
							></IgnoredClickOutside
						>
					</div>
				</div>

				<div class="flex-grow px-4 pt-6 sm:px-6 lg:px-8">
					<PageTransition>
						<slot /></PageTransition
					>
				</div>
			</main>
		</div>
	</div>
{/if}

{#if !$authenticated || !$appUser}
	<Modal
		titleText="Signed out"
		descriptionText="You may have been signed out. Please click the button below to be redirected to signin."
		open={modalOpen}
		submitOnly={true}
		allowClickOutside={false}
		submitText="Return to sign in"
		on:submit={() => goto('/auth/signin')}
	/>
	<Loading class="min-h-screen bg-indigo-600 flex items-center justify-center" />
{/if}
