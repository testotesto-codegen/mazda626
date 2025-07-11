/**
 * Formatting Utility Functions
 * Common formatting functions for numbers, currency, percentages, etc.
 */

/**
 * Format number with locale-specific formatting
 * @param {number} value - Number to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, options = {}) => {
  const {
    locale = 'en-US',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    useGrouping = true
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping
    }).format(value);
  } catch (error) {
    console.warn('Number formatting error:', error);
    return value.toString();
  }
};

/**
 * Format currency value
 * @param {number} value - Currency value
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, options = {}) => {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSymbol = true
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

  try {
    if (!showSymbol) {
      return formatNumber(value, { locale, minimumFractionDigits, maximumFractionDigits });
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value);
  } catch (error) {
    console.warn('Currency formatting error:', error);
    return `$${formatNumber(value, { minimumFractionDigits, maximumFractionDigits })}`;
  }
};

/**
 * Format percentage value
 * @param {number} value - Percentage value (0.1 = 10%)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, options = {}) => {
  const {
    locale = 'en-US',
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
    showSign = false
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value);

    if (showSign && value > 0) {
      return `+${formatted}`;
    }

    return formatted;
  } catch (error) {
    console.warn('Percentage formatting error:', error);
    const percent = (value * 100).toFixed(maximumFractionDigits);
    return `${showSign && value > 0 ? '+' : ''}${percent}%`;
  }
};

/**
 * Format large numbers with abbreviations (K, M, B, T)
 * @param {number} value - Number to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted abbreviated number
 */
export const formatAbbreviatedNumber = (value, options = {}) => {
  const {
    precision = 1,
    locale = 'en-US'
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue < 1000) {
    return formatNumber(value, { locale, maximumFractionDigits: precision });
  }

  const abbreviations = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' }
  ];

  for (const { value: threshold, symbol } of abbreviations) {
    if (absValue >= threshold) {
      const abbreviated = absValue / threshold;
      const formatted = formatNumber(abbreviated, {
        locale,
        maximumFractionDigits: precision
      });
      return `${sign}${formatted}${symbol}`;
    }
  }

  return formatNumber(value, { locale, maximumFractionDigits: precision });
};

/**
 * Format file size in bytes
 * @param {number} bytes - File size in bytes
 * @param {Object} options - Formatting options
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, options = {}) => {
  const {
    precision = 1,
    binary = false
  } = options;

  if (bytes === null || bytes === undefined || isNaN(bytes)) {
    return '—';
  }

  if (bytes === 0) return '0 B';

  const base = binary ? 1024 : 1000;
  const units = binary
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const exponent = Math.floor(Math.log(Math.abs(bytes)) / Math.log(base));
  const value = bytes / Math.pow(base, exponent);
  const unit = units[exponent] || units[units.length - 1];

  return `${formatNumber(value, { maximumFractionDigits: precision })} ${unit}`;
};

/**
 * Format phone number
 * @param {string} phoneNumber - Phone number string
 * @param {string} format - Format type ('us', 'international')
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber, format = 'us') => {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  if (format === 'us') {
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
  }

  // Return original if can't format
  return phoneNumber;
};

/**
 * Format credit card number
 * @param {string} cardNumber - Credit card number
 * @param {boolean} mask - Whether to mask the number
 * @returns {string} Formatted credit card number
 */
export const formatCreditCard = (cardNumber, mask = false) => {
  if (!cardNumber) return '';

  const digits = cardNumber.replace(/\D/g, '');
  
  if (mask && digits.length >= 4) {
    const lastFour = digits.slice(-4);
    const masked = '*'.repeat(Math.max(0, digits.length - 4));
    return `${masked}${lastFour}`.replace(/(.{4})/g, '$1 ').trim();
  }

  // Format with spaces every 4 digits
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Format social security number
 * @param {string} ssn - Social security number
 * @param {boolean} mask - Whether to mask the number
 * @returns {string} Formatted SSN
 */
export const formatSSN = (ssn, mask = false) => {
  if (!ssn) return '';

  const digits = ssn.replace(/\D/g, '');
  
  if (digits.length !== 9) return ssn;

  if (mask) {
    return `***-**-${digits.slice(-4)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || '';
  
  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  
  return text.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Convert camelCase to Title Case
 * @param {string} text - CamelCase text
 * @returns {string} Title Case text
 */
export const camelToTitle = (text) => {
  if (!text) return '';
  
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

/**
 * Format duration in milliseconds to human readable
 * @param {number} milliseconds - Duration in milliseconds
 * @param {Object} options - Formatting options
 * @returns {string} Formatted duration
 */
export const formatDuration = (milliseconds, options = {}) => {
  const {
    showMilliseconds = false,
    compact = false
  } = options;

  if (milliseconds === null || milliseconds === undefined || isNaN(milliseconds)) {
    return '—';
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts = [];

  if (days > 0) {
    parts.push(`${days}${compact ? 'd' : ` day${days !== 1 ? 's' : ''}`}`);
  }
  
  if (hours % 24 > 0) {
    parts.push(`${hours % 24}${compact ? 'h' : ` hour${hours % 24 !== 1 ? 's' : ''}`}`);
  }
  
  if (minutes % 60 > 0) {
    parts.push(`${minutes % 60}${compact ? 'm' : ` minute${minutes % 60 !== 1 ? 's' : ''}`}`);
  }
  
  if (seconds % 60 > 0 || parts.length === 0) {
    parts.push(`${seconds % 60}${compact ? 's' : ` second${seconds % 60 !== 1 ? 's' : ''}`}`);
  }

  if (showMilliseconds && milliseconds % 1000 > 0) {
    parts.push(`${milliseconds % 1000}${compact ? 'ms' : ` millisecond${milliseconds % 1000 !== 1 ? 's' : ''}`}`);
  }

  return parts.join(compact ? ' ' : ', ');
};

/**
 * Format address object to string
 * @param {Object} address - Address object
 * @returns {string} Formatted address string
 */
export const formatAddress = (address) => {
  if (!address) return '';

  const parts = [
    address.street,
    address.city,
    [address.state, address.zipCode].filter(Boolean).join(' '),
    address.country
  ].filter(Boolean);

  return parts.join(', ');
};

export default {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatAbbreviatedNumber,
  formatFileSize,
  formatPhoneNumber,
  formatCreditCard,
  formatSSN,
  truncateText,
  capitalizeWords,
  camelToTitle,
  formatDuration,
  formatAddress
};

