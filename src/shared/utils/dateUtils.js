/**
 * Date Utility Functions
 * Centralized date formatting and manipulation utilities
 */

import { format, parseISO, isValid, differenceInDays, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatString - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date with relative time (Today, Yesterday, etc.)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date with relative time
 */
export const formatRelativeDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    
    const now = new Date();
    const diffDays = differenceInDays(now, dateObj);
    
    if (diffDays === 0) {
      return `Today ${format(dateObj, 'h:mm a')}`;
    } else if (diffDays === 1) {
      return `Yesterday ${format(dateObj, 'h:mm a')}`;
    } else if (diffDays < 7) {
      return format(dateObj, 'EEEE h:mm a');
    } else {
      return format(dateObj, 'MMM dd, h:mm a');
    }
  } catch (error) {
    console.warn('Relative date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Format time only
 * @param {string|Date} date - Date to format
 * @param {boolean} includeSeconds - Include seconds in format
 * @returns {string} Formatted time string
 */
export const formatTime = (date, includeSeconds = false) => {
  const formatString = includeSeconds ? 'h:mm:ss a' : 'h:mm a';
  return formatDate(date, formatString);
};

/**
 * Format date for API (ISO string)
 * @param {string|Date} date - Date to format
 * @returns {string} ISO date string
 */
export const formatDateForAPI = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    
    return dateObj.toISOString();
  } catch (error) {
    console.warn('API date formatting error:', error);
    return null;
  }
};

/**
 * Get week range from a given date
 * @param {string|Date} date - Reference date
 * @param {string} direction - 'current', 'prev', or 'next'
 * @returns {Object} Week range data
 */
export const getWeekRange = (date, direction = 'current') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    
    let referenceDate = dateObj;
    
    if (direction === 'prev') {
      referenceDate = subWeeks(dateObj, 1);
    } else if (direction === 'next') {
      referenceDate = addWeeks(dateObj, 1);
    }
    
    const startDate = startOfWeek(referenceDate, { weekStartsOn: 0 }); // Sunday
    const endDate = endOfWeek(referenceDate, { weekStartsOn: 0 });
    
    // Generate week data
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      weekData.push({
        date: format(currentDate, 'd MMM'),
        day: format(currentDate, 'EEE'),
        year: currentDate.getFullYear(),
        fullDate: currentDate,
        isToday: differenceInDays(new Date(), currentDate) === 0
      });
    }
    
    return {
      startRange: format(startDate, 'MM/dd/yyyy'),
      endRange: format(endDate, 'MM/dd/yyyy'),
      weekData,
      startDate,
      endDate
    };
  } catch (error) {
    console.warn('Week range calculation error:', error);
    return null;
  }
};

/**
 * Get adjacent week data
 * @param {Array} currentWeekData - Current week data array
 * @param {string} direction - 'next' or 'prev'
 * @returns {Object} Adjacent week range data
 */
export const getAdjacentWeekData = (currentWeekData, direction) => {
  if (!currentWeekData || currentWeekData.length === 0) {
    return null;
  }
  
  const firstDay = currentWeekData[0];
  if (!firstDay || !firstDay.fullDate) {
    return null;
  }
  
  return getWeekRange(firstDay.fullDate, direction);
};

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} Whether date is today
 */
export const isToday = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return false;
    }
    
    return differenceInDays(new Date(), dateObj) === 0;
  } catch (error) {
    return false;
  }
};

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} Whether date is in the past
 */
export const isPast = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return false;
    }
    
    return differenceInDays(new Date(), dateObj) > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Check if date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean} Whether date is in the future
 */
export const isFuture = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return false;
    }
    
    return differenceInDays(new Date(), dateObj) < 0;
  } catch (error) {
    return false;
  }
};

/**
 * Get days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days between dates
 */
export const getDaysBetween = (startDate, endDate) => {
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    if (!isValid(start) || !isValid(end)) {
      throw new Error('Invalid dates');
    }
    
    return Math.abs(differenceInDays(end, start));
  } catch (error) {
    console.warn('Days between calculation error:', error);
    return 0;
  }
};

/**
 * Parse date string safely
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  try {
    if (!dateString) return null;
    
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    console.warn('Date parsing error:', error);
    return null;
  }
};

/**
 * Get current timestamp
 * @returns {number} Current timestamp
 */
export const getCurrentTimestamp = () => {
  return Date.now();
};

/**
 * Get current ISO string
 * @returns {string} Current ISO date string
 */
export const getCurrentISOString = () => {
  return new Date().toISOString();
};

/**
 * Common date format presets
 */
export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  MEDIUM: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  FULL: 'EEEE, MMMM dd, yyyy',
  TIME_12: 'h:mm a',
  TIME_24: 'HH:mm',
  DATETIME_SHORT: 'MM/dd/yyyy h:mm a',
  DATETIME_MEDIUM: 'MMM dd, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
};

export default {
  formatDate,
  formatRelativeDate,
  formatTime,
  formatDateForAPI,
  getWeekRange,
  getAdjacentWeekData,
  isToday,
  isPast,
  isFuture,
  getDaysBetween,
  parseDate,
  getCurrentTimestamp,
  getCurrentISOString,
  DATE_FORMATS
};

