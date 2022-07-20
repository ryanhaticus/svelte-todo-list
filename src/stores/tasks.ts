import { writable, get } from 'svelte/store';

import type { ITask } from '$types/Task';

import { user } from '$stores/auth';
import { doc, getDoc, query, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '$lib/firebase';
import type { IMasterTask } from '$types/MasterTask';

export const tasks = writable<ITask[]>([]);

export const updateTask = (task: ITask) => {
	const storedTasks = get(tasks);

	const storedTask = storedTasks.find((t) => t.id === task.id);

	if (!storedTask) {
		return;
	}

	const newTasks = storedTasks.map((t) => (t.id === task.id ? task : t));

	tasks.set(newTasks);
};

export const deleteTask = (task: ITask) => {
	const storedTasks = get(tasks);

	tasks.set(storedTasks.filter((t) => t.id !== task.id));
};

export const addTask = (task: ITask) => {
	const storedTasks = get(tasks);

	tasks.set([...storedTasks, task]);
};

user.subscribe(async (firebaseUser) => {
	if (!firebaseUser) {
		return;
	}

	const docRef = doc(firestore, `tasks/${firebaseUser.uid}`);
	const docSnapshot = await getDoc(docRef);

	const tasksData = (docSnapshot.data() ?? {
		tasks: [],
	}) as IMasterTask;

	if (!docSnapshot.exists()) {
		await setDoc(docRef, tasksData);
	}

	tasks.set(tasksData.tasks);
});

tasks.subscribe((tasks) => {
	const firebaseUser = get(user);

	if (!firebaseUser) {
		return;
	}

	const appUserRef = doc(firestore, `tasks/${firebaseUser?.uid}`);

	setDoc(appUserRef, {
		tasks,
	});
});
