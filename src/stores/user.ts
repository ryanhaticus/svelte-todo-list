import { get, writable } from 'svelte/store';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { user } from '$stores/auth';

import { firestore } from '$lib/firebase';

import type { ITodoListUser } from '$types/TodoListUser';

export const appUser = writable<ITodoListUser | null>(null);

user.subscribe(async (firebaseUser) => {
	if (!firebaseUser) {
		return;
	}

	const appUserRef = doc(firestore, `users/${firebaseUser?.uid}`);
	const appUserDoc = await getDoc(appUserRef);

	const appUserData = (appUserDoc.data() ?? {
		avatar: `https://picsum.photos/seed/${Date.now()}/300/300`,
		displayName: 'Todo List User',
	}) as ITodoListUser;

	if (!appUserDoc.exists()) {
		await setDoc(appUserRef, appUserData);
	}

	appUser.set(appUserData);
});

appUser.subscribe((appUser) => {
	if (!appUser) {
		return;
	}

	const firebaseUser = get(user);

	const appUserRef = doc(firestore, `users/${firebaseUser?.uid}`);

	updateDoc(appUserRef, JSON.parse(JSON.stringify(appUser)));
});
