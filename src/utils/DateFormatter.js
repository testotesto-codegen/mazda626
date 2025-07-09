export const formatDate = (date) => {
	const currentDate = new Date();

	// Parse the incoming UTC date string as a Date object (which will be in local time)
	const targetDate = new Date(date);

	// Calculate difference in days based on local date, not absolute time difference
	const currentLocal = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
	const targetLocal = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
	const diffTime = currentLocal - targetLocal;
	const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		const options = { hour: 'numeric', minute: 'numeric' };
		return 'Today ' + targetDate.toLocaleTimeString('en-US', options);
	} else if (diffDays === 1) {
		const options = { hour: 'numeric', minute: 'numeric' };
		return 'Yesterday ' + targetDate.toLocaleTimeString('en-US', options);
	} else {
		const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
		return targetDate.toLocaleString('en-US', options);
	}
};

export const getWeekRangeFromDate = (dateString, direction) => {
	const currentDate = new Date(dateString);
	const dayOfWeek = currentDate.getDay();
	const startOfWeek = new Date(currentDate);
	if (direction === 'prev') {
		startOfWeek.setDate(currentDate.getDate() - 7);
	} else if (direction === 'next') {
		startOfWeek.setDate(currentDate.getDate() + 7);
	} else {
		startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
	}

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);

	const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
	const startRange = startOfWeek.toLocaleDateString('en-US', formatOptions);
	const endRange = endOfWeek.toLocaleDateString('en-US', formatOptions);

	const weekData = [];
	for (let i = 0; i < 7; i++) {
		const currentDate = new Date(startOfWeek);
		currentDate.setDate(startOfWeek.getDate() + i);
		const day = currentDate.getDate();
		const month = currentDate.toLocaleString('en-US', { month: 'short' });
		const weekday = currentDate.toLocaleString('en-US', { weekday: 'short' });
		const year = currentDate.getFullYear();
		const formattedDate = `${day} ${month}`;
		weekData.push({ date: formattedDate, day: weekday, year });
	}

	return { startRange, endRange, weekData };
};

export const getAdjacentWeekData = (currentWeekData, direction) => {
	const [day, month] = currentWeekData[0].date.split(' ');
	const monthIndex = new Date(`${month} 1, ${currentWeekData[0].year}`).getMonth(); // Get month index
	const startDate = new Date(currentWeekData[0].year, monthIndex, day);

	if (direction === 'next') {
		startDate.setDate(startDate.getDate() + 7); // Move to next week's Sunday
	} else if (direction === 'prev') {
		startDate.setDate(startDate.getDate() - 7); // Move to previous week's Sunday
	}

	return getWeekRangeFromDate(startDate);
};
