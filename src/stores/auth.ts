import { onAuthStateChanged, type User } from 'firebase/auth';
import { writable } from 'svelte/store';

import { auth } from '$lib/firebase';

import { goto } from '$app/navigation';

export const authenticated = writable(false);
export const user = writable<User | null>(null);

onAuthStateChanged(auth, (observedUser) => {
	if (typeof window === 'undefined') return;

	user.set(observedUser);

	if (!user) {
		authenticated.set(false);
		return;
	}

	authenticated.set(true);

	if (window.location.pathname !== '/auth/signin' && window.location.pathname !== '/auth/signup') {
		return;
	}

	goto('/app');
});
