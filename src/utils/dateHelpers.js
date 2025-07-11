/**
 * Date Helpers - Optimized date utilities using date-fns
 */

import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  differenceInDays,
  parseISO,
  isValid,
} from 'date-fns';

/**
 * Formats a date with relative time information
 * @param {string|Date} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    
    if (!isValid(targetDate)) {
      console.warn('Invalid date provided to formatDate:', date);
      return 'Invalid Date';
    }

    const { includeTime = true, shortFormat = false } = options;

    if (isToday(targetDate)) {
      return includeTime 
        ? `Today ${format(targetDate, 'h:mm a')}`
        : 'Today';
    }

    if (isYesterday(targetDate)) {
      return includeTime 
        ? `Yesterday ${format(targetDate, 'h:mm a')}`
        : 'Yesterday';
    }

    // For dates within the last week, show relative time
    const daysDiff = Math.abs(differenceInDays(new Date(), targetDate));
    if (daysDiff <= 7 && !shortFormat) {
      return formatDistanceToNow(targetDate, { addSuffix: true });
    }

    // For older dates, show formatted date
    const dateFormat = includeTime 
      ? (shortFormat ? 'MMM d, h:mm a' : 'MMM d, yyyy h:mm a')
      : (shortFormat ? 'MMM d' : 'MMM d, yyyy');

    return format(targetDate, dateFormat);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Gets week range data from a given date
 * @param {string|Date} dateString - Base date
 * @param {string} direction - 'prev', 'next', or 'current'
 * @returns {Object} Week range data with start, end, and daily data
 */
export const getWeekRangeFromDate = (dateString, direction = 'current') => {
  try {
    let baseDate = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    
    if (!isValid(baseDate)) {
      baseDate = new Date();
    }

    // Adjust base date based on direction
    if (direction === 'prev') {
      baseDate = subWeeks(baseDate, 1);
    } else if (direction === 'next') {
      baseDate = addWeeks(baseDate, 1);
    }

    const weekStart = startOfWeek(baseDate, { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(baseDate, { weekStartsOn: 0 }); // Saturday

    // Generate daily data for the week
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const weekData = weekDays.map(day => ({
      date: format(day, 'd MMM'),
      day: format(day, 'EEE'),
      year: format(day, 'yyyy'),
      fullDate: day,
      isToday: isToday(day),
    }));

    return {
      startRange: format(weekStart, 'MM/dd/yyyy'),
      endRange: format(weekEnd, 'MM/dd/yyyy'),
      weekData,
      weekStart,
      weekEnd,
    };
  } catch (error) {
    console.error('Error getting week range:', error);
    return {
      startRange: '',
      endRange: '',
      weekData: [],
      weekStart: null,
      weekEnd: null,
    };
  }
};

/**
 * Gets adjacent week data based on current week data
 * @param {Array} currentWeekData - Current week data array
 * @param {string} direction - 'next' or 'prev'
 * @returns {Object} Adjacent week data
 */
export const getAdjacentWeekData = (currentWeekData, direction) => {
  try {
    if (!currentWeekData || currentWeekData.length === 0) {
      return getWeekRangeFromDate(new Date(), direction);
    }

    // Use the first day's full date as reference
    const referenceDate = currentWeekData[0].fullDate || new Date();
    return getWeekRangeFromDate(referenceDate, direction);
  } catch (error) {
    console.error('Error getting adjacent week data:', error);
    return getWeekRangeFromDate(new Date(), direction);
  }
};

/**
 * Formats a date for display in financial contexts
 * @param {string|Date} date - Date to format
 * @param {string} type - Format type: 'short', 'medium', 'long'
 * @returns {string} Formatted date
 */
export const formatFinancialDate = (date, type = 'medium') => {
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    
    if (!isValid(targetDate)) {
      return 'N/A';
    }

    switch (type) {
      case 'short':
        return format(targetDate, 'MM/dd');
      case 'long':
        return format(targetDate, 'MMMM d, yyyy');
      case 'medium':
      default:
        return format(targetDate, 'MMM d, yyyy');
    }
  } catch (error) {
    console.error('Error formatting financial date:', error);
    return 'N/A';
  }
};

/**
 * Gets the current market session info based on time
 * @returns {Object} Market session information
 */
export const getMarketSessionInfo = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();

  // Weekend check (0 = Sunday, 6 = Saturday)
  if (currentDay === 0 || currentDay === 6) {
    return {
      isOpen: false,
      status: 'closed',
      message: 'Markets are closed on weekends',
    };
  }

  // Market hours: 9:30 AM - 4:00 PM EST (simplified)
  if (currentHour >= 9 && currentHour < 16) {
    return {
      isOpen: true,
      status: 'open',
      message: 'Markets are currently open',
    };
  } else if (currentHour >= 4 && currentHour < 9) {
    return {
      isOpen: false,
      status: 'pre-market',
      message: 'Pre-market trading',
    };
  } else {
    return {
      isOpen: false,
      status: 'after-hours',
      message: 'After-hours trading',
    };
  }
};

/**
 * Validates if a date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid
 */
export const isValidDateString = (dateString) => {
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
};

/**
 * Gets a human-readable time ago string
 * @param {string|Date} date - Date to compare
 * @returns {string} Time ago string
 */
export const getTimeAgo = (date) => {
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    
    if (!isValid(targetDate)) {
      return 'Unknown time';
    }

    return formatDistanceToNow(targetDate, { addSuffix: true });
  } catch (error) {
    console.error('Error getting time ago:', error);
    return 'Unknown time';
  }
};

