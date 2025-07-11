/**
 * Validation utility functions
 */

/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone number validation (US format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number is valid
 */
export const isValidPhone = (phone) => {
  if (typeof phone !== 'string') return false;
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * URL validation
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidUrl = (url) => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Password strength validation
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength and requirements
 */
export const validatePassword = (password) => {
  if (typeof password !== 'string') {
    return { isValid: false, strength: 'invalid', requirements: [] };
  }

  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  
  let strength = 'weak';
  if (metRequirements >= 4) strength = 'strong';
  else if (metRequirements >= 3) strength = 'medium';

  return {
    isValid: metRequirements >= 3,
    strength,
    requirements,
    score: metRequirements
  };
};

/**
 * Credit card number validation (Luhn algorithm)
 * @param {string} cardNumber - Credit card number to validate
 * @returns {boolean} True if card number is valid
 */
export const isValidCreditCard = (cardNumber) => {
  if (typeof cardNumber !== 'string') return false;
  
  const cleanNumber = cardNumber.replace(/\D/g, '');
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Check if string is empty or only whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if string is empty or whitespace
 */
export const isEmpty = (str) => {
  return typeof str !== 'string' || str.trim().length === 0;
};

/**
 * Check if value is a valid number
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a valid number
 */
export const isValidNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Check if date is valid
 * @param {any} date - Date to validate
 * @returns {boolean} True if date is valid
 */
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Validate required fields in an object
 * @param {Object} obj - Object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result
 */
export const validateRequiredFields = (obj, requiredFields) => {
  if (typeof obj !== 'object' || obj === null) {
    return { isValid: false, missingFields: requiredFields };
  }

  const missingFields = requiredFields.filter(field => {
    const value = obj[field];
    return value === undefined || value === null || 
           (typeof value === 'string' && value.trim() === '');
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
