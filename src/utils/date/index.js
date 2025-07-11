/**
 * Date utility functions
 */

// Re-export existing date formatter
export { default as DateFormatter } from '../DateFormatter';

/**
 * Additional date utilities
 */

/**
 * Format date to ISO string
 * @param {Date} date - Date to format
 * @returns {string} ISO formatted date string
 */
export const formatToISO = (date) => {
  if (!date || !(date instanceof Date)) return '';
  return date.toISOString();
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date || !(date instanceof Date)) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

/**
 * Check if date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date || !(date instanceof Date)) return false;
  
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if date is within the last N days
 * @param {Date} date - Date to check
 * @param {number} days - Number of days to check within
 * @returns {boolean} True if date is within the specified days
 */
export const isWithinDays = (date, days) => {
  if (!date || !(date instanceof Date) || typeof days !== 'number') return false;
  
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  return diffInDays <= days;
};
