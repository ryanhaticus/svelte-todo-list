<script lang="ts">
	import Modal from './modal.svelte';

	import { addTask, tasks } from '$stores/tasks';

	export let open = false;

	let task: string;
	let dayDue: string;
	let timeDue: string;

	let resultModalOpen = false;
	let resultTitle: string;
	let resultDescription: string;
	let resultSubmitText: string;
	let resultType: 'info' | 'success' | 'error';

	const handleSubmit = () => {
		try {
			const dueDateMilis = new Date(`${dayDue} ${timeDue}`).getTime();

			if (isNaN(dueDateMilis)) {
				throw { code: 'invalid-date' };
			}

			if (dueDateMilis < Date.now()) {
				throw { code: 'date-in-past' };
			}

			if (!task) {
				throw { code: 'task-required' };
			}

			const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				const r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});

			addTask({
				id,
				task,
				dueDateMilis,
				completed: false,
			});

			resultType = 'success';
			resultTitle = 'Task added';
			resultDescription = 'You can safely close this window';
			resultSubmitText = 'Close';

			resultModalOpen = true;
			open = false;

			task = '';
			dayDue = '';
			timeDue = '';
		} catch ({ code }) {
			switch (code) {
				case 'invalid-date':
					resultDescription = 'Please enter a valid date';
					break;
				case 'date-in-past':
					resultDescription = 'Please enter a date in the future';
					break;
				case 'task-required':
					resultDescription = 'Please enter a task';
					break;
				default:
					resultDescription = 'An unknown error has occurred';
			}

			resultType = 'error';
			resultTitle = 'An error has occurred';
			resultSubmitText = 'Try again';

			resultModalOpen = true;
			open = false;
		}
	};
</script>

<Modal
	open={resultModalOpen}
	titleText={resultTitle}
	descriptionText={resultDescription}
	submitOnly={true}
	submitText={resultSubmitText}
	type={resultType}
	on:submit={() => {
		resultModalOpen = false;

		if (resultType !== 'error') {
			return;
		}

		open = true;
	}}
/>

<Modal
	bind:open
	titleText="Add new task"
	descriptionText=""
	submitText="Add"
	cancelText="Cancel"
	on:submit={handleSubmit}
>
	<div class="text-left flex flex-col gap-y-4">
		<div>
			<label for="task" class="block text-sm font-medium text-gray-700"
				>What do you have to do?</label
			>
			<div class="mt-1">
				<input
					bind:value={task}
					type="text"
					name="task"
					id="task"
					class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					placeholder="Walk the dogs, wash the car, etc."
				/>
			</div>
		</div>
		<div>
			<label for="due-date" class="block text-sm font-medium text-gray-700"
				>What day is this task due?</label
			>
			<div class="mt-1">
				<input
					bind:value={dayDue}
					type="date"
					name="due-date"
					id="due-date"
					class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					placeholder="Due date"
				/>
			</div>
		</div>
		<div>
			<label for="due-time" class="block text-sm font-medium text-gray-700"
				>What time is this task due?</label
			>
			<div class="mt-1">
				<input
					bind:value={timeDue}
					type="time"
					name="due-time"
					id="due-time"
					class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					placeholder="Due time"
				/>
			</div>
		</div>
	</div>
</Modal>
