/**
 * Button component type definitions and constants
 */

// Button variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DANGER: 'danger',
  SUCCESS: 'success'
};

// Button sizes
export const BUTTON_SIZES = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl'
};

// Button types
export const BUTTON_TYPES = {
  BUTTON: 'button',
  SUBMIT: 'submit',
  RESET: 'reset',
  LINK: 'link'
};

// Default button classes
export const BASE_BUTTON_CLASSES = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

// Variant classes
export const VARIANT_CLASSES = {
  [BUTTON_VARIANTS.PRIMARY]: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  [BUTTON_VARIANTS.SECONDARY]: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  [BUTTON_VARIANTS.OUTLINE]: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
  [BUTTON_VARIANTS.GHOST]: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  [BUTTON_VARIANTS.DANGER]: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  [BUTTON_VARIANTS.SUCCESS]: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
};

// Size classes
export const SIZE_CLASSES = {
  [BUTTON_SIZES.SMALL]: 'px-3 py-1.5 text-sm',
  [BUTTON_SIZES.MEDIUM]: 'px-4 py-2 text-base',
  [BUTTON_SIZES.LARGE]: 'px-6 py-3 text-lg',
  [BUTTON_SIZES.EXTRA_LARGE]: 'px-8 py-4 text-xl'
};
