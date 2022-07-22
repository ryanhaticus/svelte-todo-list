<script lang="ts">
	import IgnoredClickOutside from '$components/IgnoredClickOutside.svelte';

	import ModifyTaskModal from '$components/ModifyTaskModal.svelte';

	import { milisToTime } from '$lib/formatTime';
	import { tasks } from '$stores/tasks';
	import type { ITask } from '$types/Task';
	import { ChevronLeftIcon, ChevronRightIcon } from '@rgossiaux/svelte-heroicons/outline';

	const currentDate = new Date();

	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();
	const currentDay = currentDate.getDate();

	let displayedDays: {
		day: number;
		month: number;
		year: number;
		isToday: boolean;
		isCurrentMonth: boolean;
	}[] = [];

	let selectedMonth = currentMonth;
	let selectedYear = currentYear;

	let selectedDayMobile: {
		day: number;
		month: number;
		year: number;
	} = {
		day: currentDay,
		month: currentMonth,
		year: currentYear,
	};

	let selectedMonthText = '';
	$: selectedMonthText = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
		new Date(selectedYear, selectedMonth),
	);

	let selectedYearText = '';
	$: selectedYearText = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(
		new Date(selectedYear, selectedMonth),
	);

	$: selectedMonth, selectedYear && updateDisplayedDays();

	const updateDisplayedDays = () => {
		displayedDays = [];

		const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
		const firstDayOfMonthIndex = firstDayOfMonth.getDay();
		const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
		const lastDayOfMonthIndex = lastDayOfMonth.getDay();
		const lastDayOfPreviousMonth = new Date(selectedYear, selectedMonth, 0);
		const lastDayOfPreviousMonthIndex = lastDayOfPreviousMonth.getDay();
		const daysInMonth = lastDayOfMonth.getDate();
		const daysInPreviousMonth = lastDayOfPreviousMonth.getDate();

		let day = 1;
		let dayIndex = 0;
		let previousMonthDay = daysInPreviousMonth - lastDayOfPreviousMonthIndex;
		let previousMonth = selectedMonth - 1;
		let previousYear = selectedYear;

		if (previousMonth < 0) {
			previousMonth = 11;
			previousYear--;
		}

		let nextMonthDayIndex = 1;

		for (let i = 0; i < 42; i++) {
			if (i < firstDayOfMonthIndex) {
				displayedDays.push({
					day: previousMonthDay++,
					month: previousMonth,
					year: previousYear,
					isToday: false,
					isCurrentMonth: false,
				});

				dayIndex++;
			} else if (day <= daysInMonth) {
				displayedDays.push({
					day,
					month: selectedMonth,
					year: selectedYear,
					isToday:
						day === currentDay && selectedMonth === currentMonth && selectedYear === currentYear,
					isCurrentMonth: true,
				});

				day++;
				dayIndex++;
			} else {
				displayedDays.push({
					day: nextMonthDayIndex,
					month: selectedMonth + 1,
					year: selectedYear,
					isToday: false,
					isCurrentMonth: false,
				});

				nextMonthDayIndex++;
			}
		}
	};

	updateDisplayedDays();

	const getTasksForDay = (day: number, month: number, year: number, tasks: ITask[]) => {
		return tasks.filter((task) => {
			const taskDate = new Date(task.dueDateMilis);
			return (
				taskDate.getDate() === day &&
				taskDate.getMonth() === month &&
				taskDate.getFullYear() === year
			);
		});
	};

	const decrementMonth = () => {
		if (selectedMonth === 0) {
			selectedMonth = 11;
			selectedYear--;
		} else {
			selectedMonth--;
		}

		selectedMonthText = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
			new Date(selectedYear, selectedMonth),
		);

		selectedYearText = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(
			new Date(selectedYear, selectedMonth),
		);
	};

	const incrementMonth = () => {
		if (selectedMonth === 11) {
			selectedMonth = 0;
			selectedYear++;
		} else {
			selectedMonth++;
		}

		selectedMonthText = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
			new Date(selectedYear, selectedMonth),
		);

		selectedYearText = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(
			new Date(selectedYear, selectedMonth),
		);
	};

	let modifyTaskModalOpen = false;
	let selectedTaskId = '';

	const startModifyingTask = (taskId: string) => {
		selectedTaskId = taskId;
		modifyTaskModalOpen = true;
	};
</script>

<ModifyTaskModal bind:open={modifyTaskModalOpen} {selectedTaskId} />

<!-- This example requires Tailwind CSS v2.0+ -->
<div class="lg:flex lg:h-full lg:flex-col">
	<header
		class="relative z-20 flex items-center justify-between border-b border-gray-200 py-4 px-6 lg:flex-none"
	>
		<h1 class="text-lg font-semibold text-gray-900">
			<time datetime="2022-01">{selectedMonthText} {selectedYearText}</time>
		</h1>
		<div class="flex items-center">
			<div class="flex items-center rounded-md shadow-sm md:items-stretch">
				<button
					on:click={decrementMonth}
					type="button"
					class="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
				>
					<span class="sr-only">Previous month</span>
					<ChevronLeftIcon class="h-5 w-5" />
				</button>
				<button
					type="button"
					class="w-24 hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
					>{selectedMonthText}</button
				>
				<span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
				<button
					on:click={incrementMonth}
					type="button"
					class="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
				>
					<span class="sr-only">Next month</span>
					<!-- Heroicon name: solid/chevron-right -->
					<ChevronRightIcon class="h-5 w-5" />
				</button>
			</div>
		</div>
	</header>
	<div class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
		<div
			class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none"
		>
			<div class="bg-white py-2">S<span class="sr-only sm:not-sr-only">un</span></div>
			<div class="bg-white py-2">M<span class="sr-only sm:not-sr-only">on</span></div>
			<div class="bg-white py-2">T<span class="sr-only sm:not-sr-only">ue</span></div>
			<div class="bg-white py-2">W<span class="sr-only sm:not-sr-only">ed</span></div>
			<div class="bg-white py-2">T<span class="sr-only sm:not-sr-only">hu</span></div>
			<div class="bg-white py-2">F<span class="sr-only sm:not-sr-only">ri</span></div>
			<div class="bg-white py-2">S<span class="sr-only sm:not-sr-only">at</span></div>
		</div>
		<div class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
			<div class="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
				{#each displayedDays as { isCurrentMonth, isToday, year, month, day }}
					<div
						class="relative py-2 px-3 text-gray-500 {isCurrentMonth
							? 'bg-white'
							: 'bg-gray-50 text-gray-500'}"
					>
						<time
							class={isToday
								? 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'
								: ''}
							datetime="{year}-{month}-{day}">{day}</time
						>
						<!-- if a task in $tasks falls on this day, include it in a list -->
						{#if getTasksForDay(day, month, year, $tasks).length > 0}
							<ol class="mt-2">
								{#each getTasksForDay(day, month, year, $tasks) as { id, task, dueDateMilis }}
									<IgnoredClickOutside>
										<li on:click={() => startModifyingTask(id)}>
											<span class="group cursor-pointer flex">
												<p
													class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
												>
													{task}
												</p>
												<time
													datetime="2022-01-25T14:00"
													class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
													>{milisToTime(dueDateMilis)}</time
												>
											</span>
										</li></IgnoredClickOutside
									>{/each}
							</ol>
						{/if}
					</div>
				{/each}
			</div>
			<div class="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
				{#each displayedDays as { isCurrentMonth, isToday, day, month, year }}
					<button
						on:click={() =>
							(selectedDayMobile = {
								year: year,
								month: month,
								day: day,
							})}
						class="flex h-14 flex-col py-2 px-3 hover:bg-gray-100 focus:z-10 {isCurrentMonth
							? 'bg-white'
							: 'bg-gray-50'} {isToday ||
						(selectedDayMobile.month === month &&
							selectedDayMobile.day === day &&
							selectedDayMobile.year === year)
							? 'font-semibold'
							: ''} {selectedDayMobile ===
						{
							day,
							month,
							year,
						}
							? 'text-white'
							: ''} {isToday ? 'text-indigo-600' : ''} {isCurrentMonth && !isToday
							? 'text-gray-900'
							: ''} {!isCurrentMonth && !isToday ? 'text-gray-500' : ''}"
					>
						<time
							datetime="{year}-{month}-{day}"
							class="ml-auto {selectedDayMobile.month === month &&
							selectedDayMobile.day === day &&
							selectedDayMobile.year === year
								? 'flex h-6 w-6 items-center justify-center rounded-full'
								: ''} {selectedDayMobile.month === month &&
							selectedDayMobile.day === day &&
							selectedDayMobile.year === year &&
							isToday
								? 'bg-indigo-600 text-white'
								: ''} {selectedDayMobile.month === month &&
							selectedDayMobile.day === day &&
							selectedDayMobile.year === year &&
							!isToday
								? 'bg-gray-900 text-white'
								: ''}">{day}</time
						>
						<span class="sr-only">{getTasksForDay(day, month, year, $tasks).length} events</span>
						{#if getTasksForDay(day, month, year, $tasks).length > 0}
							<span class="-mx-0.5 mt-auto flex flex-wrap-reverse">
								{#each getTasksForDay(day, month, year, $tasks) as task}
									<span class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" />{/each}
							</span>{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
	<div class="py-10 lg:hidden">
		{#if getTasksForDay(selectedDayMobile.day, selectedDayMobile.month, selectedDayMobile.year, $tasks).length > 0}
			<ol
				class="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5"
			>
				{#each getTasksForDay(selectedDayMobile.day, selectedDayMobile.month, selectedDayMobile.year, $tasks) as { id, task, dueDateMilis }}
					<IgnoredClickOutside>
						<li
							on:click={() => startModifyingTask(id)}
							class="group flex p-4 pr-6 focus-within:bg-gray-50"
						>
							<div class="flex-auto">
								<p class="font-semibold text-gray-900">{task}</p>
								<time datetime="2022-01-15T09:00" class="mt-2 flex items-center text-gray-700">
									<!-- Heroicon name: solid/clock -->
									<svg
										class="mr-2 h-5 w-5 text-gray-400"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
											clip-rule="evenodd"
										/>
									</svg>
									{milisToTime(dueDateMilis)}
								</time>
							</div>
							<button
								on:click={() => startModifyingTask(id)}
								class="ml-6 flex-none self-center rounded-md border border-gray-300 bg-white py-2 px-3 font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
								>Modify<span class="sr-only">, {task}</span></button
							>
						</li></IgnoredClickOutside
					>{/each}
			</ol>{/if}
	</div>
</div>
