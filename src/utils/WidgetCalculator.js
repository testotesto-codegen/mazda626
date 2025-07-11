import { 
  WidgetSizeStrategy, 
  GridDimensionCalculator, 
  GRID_CONFIG 
} from './widgetConfigurations';

/**
 * Enhanced Widget Calculator with Strategy Pattern
 * Provides clean, extensible widget dimension calculations
 */

/**
 * Get widget size configuration using strategy pattern
 * @param {Object} widget - Widget configuration object
 * @returns {Object} Size configuration with width and height
 */
const getComponentSize = (widget) => {
  const size = widget.size || 'small';
  return WidgetSizeStrategy.getSizeConfig(widget.content, size);
};

/**
 * Calculate widget dimensions for grid layout
 * @param {Object} widget - Widget configuration object
 * @param {number} gridWidth - Total grid width in pixels
 * @returns {Object} Grid layout dimensions {x, y, w, h, i}
 */
export const getWidgetDimensions = (widget, gridWidth) => {
  try {
    // Validate inputs
    if (!widget || !widget.content) {
      console.warn('Invalid widget configuration provided');
      return getDefaultDimensions(widget);
    }

    if (!gridWidth || gridWidth <= 0) {
      console.warn('Invalid grid width provided');
      gridWidth = 1200; // Fallback width
    }

    // Get size configuration
    const sizeConfig = getComponentSize(widget);
    const pixelWidth = parseInt(sizeConfig?.width) || 320;
    const pixelHeight = parseInt(sizeConfig?.height) || 250;

    // Convert to grid units
    const { w, h } = GridDimensionCalculator.pixelsToGridUnits(
      pixelWidth, 
      pixelHeight, 
      gridWidth
    );

    return {
      x: widget.x || GRID_CONFIG.DEFAULT_POSITION.x,
      y: widget.y || GRID_CONFIG.DEFAULT_POSITION.y,
      w: Math.max(w, 1), // Ensure minimum width
      h: Math.max(h, 1), // Ensure minimum height
      i: widget.id,
    };
  } catch (error) {
    console.error('Error calculating widget dimensions:', error);
    return getDefaultDimensions(widget);
  }
};

/**
 * Get default dimensions for error cases
 * @param {Object} widget - Widget configuration object
 * @returns {Object} Default grid layout dimensions
 */
const getDefaultDimensions = (widget) => {
  return {
    x: widget?.x || GRID_CONFIG.DEFAULT_POSITION.x,
    y: widget?.y || GRID_CONFIG.DEFAULT_POSITION.y,
    w: 4, // Default to 4 grid units wide
    h: 6, // Default to 6 grid units tall
    i: widget?.id || 'unknown',
  };
};

/**
 * Batch calculate dimensions for multiple widgets
 * @param {Array} widgets - Array of widget configuration objects
 * @param {number} gridWidth - Total grid width in pixels
 * @returns {Array} Array of grid layout dimensions
 */
export const getMultipleWidgetDimensions = (widgets, gridWidth) => {
  if (!Array.isArray(widgets)) {
    console.warn('Widgets must be an array');
    return [];
  }

  return widgets.map(widget => getWidgetDimensions(widget, gridWidth));
};

/**
 * Get available widget types
 * @returns {string[]} Array of registered widget type names
 */
export const getAvailableWidgetTypes = () => {
  return WidgetSizeStrategy.getRegisteredTypes();
};

/**
 * Check if a widget type is supported
 * @param {string} widgetType - The widget type to check
 * @returns {boolean} True if supported
 */
export const isWidgetTypeSupported = (widgetType) => {
  return WidgetSizeStrategy.isRegistered(widgetType);
};
