<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 200,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
			};
		},
	});

	import { tasks, updateTask } from '$stores/tasks';

	import type { ITask } from '$types/Task';
	import ModifyTaskModal from '$components/ModifyTaskModal.svelte';
	import IgnoredClickOutside from '$components/IgnoredClickOutside.svelte';
	import DeleteTaskModal from '$components/DeleteTaskModal.svelte';
	import { milisToDate } from '$lib/formatTime';

	let sortedTasks: ITask[];
	$: sortedTasks = $tasks.sort((a, b) => a.dueDateMilis - b.dueDateMilis);

	let incompleteTasks: ITask[];
	$: incompleteTasks = sortedTasks.filter((task) => !task.completed);

	let completeTasks: ITask[];
	$: completeTasks = sortedTasks.filter((task) => task.completed);

	let selectedTaskId: string;
	let modifyTaskModalOpen = false;
	let deleteTaskModalOpen = false;

	const startModifyingTask = (taskId: string) => {
		selectedTaskId = taskId;
		modifyTaskModalOpen = true;
	};

	const startDeletingTask = (taskId: string) => {
		selectedTaskId = taskId;
		deleteTaskModalOpen = true;
	};
</script>

<ModifyTaskModal bind:open={modifyTaskModalOpen} {selectedTaskId} />
<DeleteTaskModal bind:open={deleteTaskModalOpen} {selectedTaskId} />

<div>
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Incomplete tasks</h1>
			<p class="mt-2 text-sm text-gray-700">
				A list of all your tasks that have not yet been marked as complete.
			</p>
		</div>
	</div>
	<div class="mt-8 flex flex-col">
		<div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
				<div
					class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
				>
					<table class="min-w-full divide-y divide-gray-300">
						<thead class="bg-gray-50">
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
									>Task</th
								>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>Due Date</th
								>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>Status (click to mark complete)</th
								>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class="sr-only">Modify</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white ">
							{#each incompleteTasks as task}
								<tr in:receive={{ key: task.id }} out:send={{ key: task.id }}>
									<td
										class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
										>{task.task}</td
									>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
										>{milisToDate(task.dueDateMilis)}</td
									>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
										><button
											on:click={() =>
												updateTask({
													...task,
													completed: true,
												})}
											type="button"
											class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800"
										>
											Incomplete
										</button></td
									>
									<td
										class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
									>
										<IgnoredClickOutside>
											<button
												on:click={() => startDeletingTask(task.id)}
												type="button"
												class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
												>Delete<span class="sr-only">, {task.task}</span
												></button
											>
											<button
												on:click={() => startModifyingTask(task.id)}
												type="button"
												class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
												>Modify<span class="sr-only">, {task.task}</span
												></button
											></IgnoredClickOutside
										>
									</td>
								</tr>{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="mt-6">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-xl font-semibold text-gray-900">Complete tasks</h1>
			<p class="mt-2 text-sm text-gray-700">
				A list of all your completed tasks
			</p>
		</div>
	</div>
	<div class="mt-8 flex flex-col">
		<div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
				<div
					class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
				>
					<table class="min-w-full divide-y divide-gray-300">
						<thead class="bg-gray-50">
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
									>Task</th
								>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>Due Date</th
								>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									>Status (click to mark incomplete)</th
								>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class="sr-only">Modify</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each completeTasks as task}
								<tr in:receive={{ key: task.id }} out:send={{ key: task.id }}>
									<td
										class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
										>{task.task}</td
									>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
										>{milisToDate(task.dueDateMilis)}</td
									>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
										><button
											on:click={() =>
												updateTask({
													...task,
													completed: false,
												})}
											type="button"
											class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800"
										>
											Complete
										</button></td
									>
									<td
										class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
										><IgnoredClickOutside>
											<button
												on:click={() => startDeletingTask(task.id)}
												type="button"
												class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
												>Delete<span class="sr-only">, {task.task}</span
												></button
											>
											<button
												on:click={() => startModifyingTask(task.id)}
												type="button"
												class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
												>Modify<span class="sr-only">, {task.task}</span
												></button
											></IgnoredClickOutside
										>
									</td>
								</tr>{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
