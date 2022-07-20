<script lang="ts">
	import Modal from './modal.svelte';

	import { deleteTask, tasks } from '$stores/tasks';
	import type { ITask } from '$types/Task';

	export let open = false;
	export let selectedTaskId: string;

	let selectedTask: ITask;
	$: selectedTask = $tasks.find((task) => task.id === selectedTaskId) as ITask;

	let resultModalOpen = false;

	const handleSubmit = () => {
		deleteTask(selectedTask);
		open = false;
		resultModalOpen = true;
	};
</script>

<Modal
	open={resultModalOpen}
	titleText="Task deleted"
	descriptionText="You can safely close this window"
	submitOnly={true}
	submitText="Close"
	type="success"
	on:submit={() => (resultModalOpen = false)}
/>

<Modal
	bind:open
	titleText="Delete task"
	descriptionText="Are you sure want to delete this task?"
	submitText="Delete"
	cancelText="Cancel"
	on:submit={handleSubmit}
/>
