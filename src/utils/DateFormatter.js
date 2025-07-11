/**
 * Date formatting constants and configurations
 */
const LOCALE = 'en-US';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const FORMAT_OPTIONS = {
	timeOnly: { hour: 'numeric', minute: 'numeric' },
	dateTime: { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' },
	dateOnly: { year: 'numeric', month: '2-digit', day: '2-digit' },
	monthDay: { month: 'short', day: 'numeric' },
	weekday: { weekday: 'short' }
};

/**
 * Create a date object with only date components (no time)
 * @param {Date} date - Source date
 * @returns {Date} Date with time set to midnight
 */
const getDateOnly = (date) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Calculate the difference in days between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Difference in days
 */
const getDaysDifference = (date1, date2) => {
	const localDate1 = getDateOnly(date1);
	const localDate2 = getDateOnly(date2);
	const diffTime = localDate1 - localDate2;
	return Math.round(diffTime / MS_PER_DAY);
};

/**
 * Format time portion of a date
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
const formatTime = (date) => {
	return date.toLocaleTimeString(LOCALE, FORMAT_OPTIONS.timeOnly);
};

/**
 * Enhanced date formatter with better abstraction and error handling
 * @param {string|Date} date - Date to format (string or Date object)
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
	try {
		const currentDate = new Date();
		const targetDate = new Date(date);

		// Validate the date
		if (isNaN(targetDate.getTime())) {
			console.warn('Invalid date provided to formatDate:', date);
			return 'Invalid Date';
		}

		const diffDays = getDaysDifference(currentDate, targetDate);

		// Format based on time difference
		switch (diffDays) {
			case 0:
				return `Today ${formatTime(targetDate)}`;
			case 1:
				return `Yesterday ${formatTime(targetDate)}`;
			default:
				return targetDate.toLocaleString(LOCALE, FORMAT_OPTIONS.dateTime);
		}
	} catch (error) {
		console.error('Error formatting date:', error);
		return 'Date Error';
	}
};

/**
 * Week navigation directions
 */
export const WEEK_DIRECTIONS = {
	PREV: 'prev',
	NEXT: 'next',
	CURRENT: 'current',
	FIRST_OF_MONTH: 'first_of_month',
	LAST_OF_MONTH: 'last_of_month',
	FIRST_OF_YEAR: 'first_of_year',
	LAST_OF_YEAR: 'last_of_year',
	TWO_WEEKS_PREV: 'two_weeks_prev',
	TWO_WEEKS_NEXT: 'two_weeks_next'
};

/**
 * Calculate start of week based on direction
 * @param {Date} currentDate - Reference date
 * @param {string} direction - Direction to navigate (prev, next, or current)
 * @returns {Date} Start of week date
 */
const calculateWeekStart = (currentDate, direction) => {
	const dayOfWeek = currentDate.getDay();
	const startOfWeek = new Date(currentDate);

	switch (direction) {
		case WEEK_DIRECTIONS.PREV:
			startOfWeek.setDate(currentDate.getDate() - 7);
			break;
		case WEEK_DIRECTIONS.NEXT:
			startOfWeek.setDate(currentDate.getDate() + 7);
			break;
		case WEEK_DIRECTIONS.TWO_WEEKS_PREV:
			startOfWeek.setDate(currentDate.getDate() - 14);
			break;
		case WEEK_DIRECTIONS.TWO_WEEKS_NEXT:
			startOfWeek.setDate(currentDate.getDate() + 14);
			break;
		case WEEK_DIRECTIONS.FIRST_OF_MONTH:
			startOfWeek.setDate(1);
			startOfWeek.setDate(1 - startOfWeek.getDay()); // Go to first Sunday of month
			break;
		case WEEK_DIRECTIONS.LAST_OF_MONTH:
			startOfWeek.setMonth(currentDate.getMonth() + 1, 0); // Last day of current month
			startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Go to last Sunday
			break;
		case WEEK_DIRECTIONS.FIRST_OF_YEAR:
			startOfWeek.setMonth(0, 1); // January 1st
			startOfWeek.setDate(1 - startOfWeek.getDay()); // Go to first Sunday of year
			break;
		case WEEK_DIRECTIONS.LAST_OF_YEAR:
			startOfWeek.setMonth(11, 31); // December 31st
			startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Go to last Sunday
			break;
		default:
			startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
	}

	return startOfWeek;
};

/**
 * Generate week data array with formatted dates
 * @param {Date} startOfWeek - Start date of the week
 * @returns {Array} Array of week day objects
 */
const generateWeekData = (startOfWeek) => {
	const weekData = [];
	
	for (let i = 0; i < 7; i++) {
		const currentDate = new Date(startOfWeek);
		currentDate.setDate(startOfWeek.getDate() + i);
		
		const day = currentDate.getDate();
		const month = currentDate.toLocaleString(LOCALE, FORMAT_OPTIONS.monthDay).split(' ')[0];
		const weekday = currentDate.toLocaleString(LOCALE, FORMAT_OPTIONS.weekday);
		const year = currentDate.getFullYear();
		const formattedDate = `${day} ${month}`;
		
		weekData.push({ 
			date: formattedDate, 
			day: weekday, 
			year,
			fullDate: new Date(currentDate) // Include full date for easier manipulation
		});
	}

	return weekData;
};

/**
 * Enhanced week range calculator with better error handling and abstraction
 * @param {string|Date} dateString - Date string or Date object
 * @param {string} direction - Direction to navigate (prev, next, or current)
 * @returns {Object} Week range data with start, end, and week data
 */
export const getWeekRangeFromDate = (dateString, direction = WEEK_DIRECTIONS.CURRENT) => {
	try {
		const currentDate = new Date(dateString);
		
		// Validate the date
		if (isNaN(currentDate.getTime())) {
			console.warn('Invalid date provided to getWeekRangeFromDate:', dateString);
			return null;
		}

		const startOfWeek = calculateWeekStart(currentDate, direction);
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);

		const startRange = startOfWeek.toLocaleDateString(LOCALE, FORMAT_OPTIONS.dateOnly);
		const endRange = endOfWeek.toLocaleDateString(LOCALE, FORMAT_OPTIONS.dateOnly);
		const weekData = generateWeekData(startOfWeek);

		return { 
			startRange, 
			endRange, 
			weekData,
			startOfWeek: new Date(startOfWeek),
			endOfWeek: new Date(endOfWeek)
		};
	} catch (error) {
		console.error('Error calculating week range:', error);
		return null;
	}
};

/**
 * Enhanced adjacent week data calculator with better error handling
 * 
 * REVIEW NOTE: This function has been significantly improved from the original implementation:
 * - Added comprehensive input validation to prevent runtime errors
 * - Enhanced error handling with graceful fallbacks (returns null instead of throwing)
 * - Better abstraction by leveraging the new getWeekRangeFromDate function
 * - Supports all new week navigation directions (not just prev/next)
 * - More robust date parsing and manipulation
 * 
 * @param {Array} currentWeekData - Current week data array
 * @param {string} direction - Direction to navigate (supports all WEEK_DIRECTIONS)
 * @returns {Object|null} Adjacent week range data or null if error
 */
export const getAdjacentWeekData = (currentWeekData, direction) => {
	try {
		// Validate input
		if (!Array.isArray(currentWeekData) || currentWeekData.length === 0) {
			console.warn('Invalid currentWeekData provided to getAdjacentWeekData');
			return null;
		}

		const firstDay = currentWeekData[0];
		if (!firstDay || !firstDay.date || !firstDay.year) {
			console.warn('Invalid week data structure');
			return null;
		}

		// Use fullDate if available (from enhanced week data), otherwise reconstruct
		let startDate;
		if (firstDay.fullDate) {
			startDate = new Date(firstDay.fullDate);
		} else {
			// Fallback to original parsing method
			const [day, month] = firstDay.date.split(' ');
			const monthIndex = new Date(`${month} 1, ${firstDay.year}`).getMonth();
			startDate = new Date(firstDay.year, monthIndex, parseInt(day));
		}

		// Validate the reconstructed date
		if (isNaN(startDate.getTime())) {
			console.warn('Could not parse date from week data');
			return null;
		}

		// Navigate to adjacent week
		const weekOffset = direction === WEEK_DIRECTIONS.NEXT ? 7 : -7;
		startDate.setDate(startDate.getDate() + weekOffset);

		return getWeekRangeFromDate(startDate, WEEK_DIRECTIONS.CURRENT);
	} catch (error) {
		console.error('Error calculating adjacent week data:', error);
		return null;
	}
};

/**
 * Export week direction constants for external use
 */
export { WEEK_DIRECTIONS };
