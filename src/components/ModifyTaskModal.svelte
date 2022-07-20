<script lang="ts">
	import Modal from './modal.svelte';

	import { tasks, updateTask } from '$stores/tasks';
	import type { ITask } from '$types/Task';

	export let open = false;
	export let selectedTaskId: string;

	let selectedTask: ITask;
	let task: string;
	let dayDue: string;
	let timeDue: string;

	const populateData = () => {
		selectedTask = $tasks.find((task) => task.id === selectedTaskId) as ITask;

		const dueDateMilisInTimezone =
			selectedTask.dueDateMilis - new Date().getTimezoneOffset() * 60000;

		dayDue = new Date(dueDateMilisInTimezone).toISOString().split('T')[0];

		timeDue = new Date(dueDateMilisInTimezone).toISOString().split('T')[1].split('.')[0];

		task = selectedTask?.task;
	};

	$: selectedTaskId && populateData();

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

			updateTask({
				...selectedTask,
				task,
				dueDateMilis,
			});

			resultType = 'success';
			resultTitle = 'Task modified';
			resultDescription = 'You can safely close this window';
			resultSubmitText = 'Close';

			resultModalOpen = true;
			open = false;
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
	titleText="Modify task"
	descriptionText=""
	submitText="Modify"
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
					on:change
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
					on:change
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
