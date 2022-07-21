export const milisToDate = (milis: number) => {
	const dueDate = new Date(milis);

	const dueDateString = dueDate.toLocaleString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});

	return dueDateString;
};

export const milisToTime = (milis: number) => {
	const dueDate = new Date(milis);

	const dueDateString = dueDate.toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});

	return dueDateString;
};
