// Date utilities
import {
  formatDate,
  getWeekRangeFromDate,
  getAdjacentWeekData,
  WEEK_DIRECTIONS,
} from "@/utils/DateFormatter";

// Filing utilities
import {
  organizeFilingsByPeriod
} from "@/utils/FilingTransformer";

// Widget utilities
import {
  getWidgetDimensions,
  getMultipleWidgetDimensions,
  getAvailableWidgetTypes,
  isWidgetTypeSupported,
} from "@/utils/WidgetCalculator";

// Error handling utilities
import {
  globalErrorHandler,
  ERROR_LEVELS,
  ERROR_CATEGORIES,
  withErrorHandling,
  validateFormData,
} from "@/utils/errorHandler";

// Performance utilities
import {
  memoize,
  debounce,
  throttle,
  performanceMonitor,
  useDebounce,
  useThrottle,
  useLazyImage,
  useVirtualScroll,
  getMemoryUsage,
} from "@/utils/performanceUtils";

// Widget configuration utilities
import {
  WidgetSizeStrategy,
  GridDimensionCalculator,
  GRID_CONFIG,
} from "@/utils/widgetConfigurations";

export {
  // Date utilities
  formatDate,
  getWeekRangeFromDate,
  getAdjacentWeekData,
  WEEK_DIRECTIONS,
  
  // Filing utilities
  organizeFilingsByPeriod,
  
  // Widget utilities
  getWidgetDimensions,
  getMultipleWidgetDimensions,
  getAvailableWidgetTypes,
  isWidgetTypeSupported,
  WidgetSizeStrategy,
  GridDimensionCalculator,
  GRID_CONFIG,
  
  // Error handling
  globalErrorHandler,
  ERROR_LEVELS,
  ERROR_CATEGORIES,
  withErrorHandling,
  validateFormData,
  
  // Performance utilities
  memoize,
  debounce,
  throttle,
  performanceMonitor,
  useDebounce,
  useThrottle,
  useLazyImage,
  useVirtualScroll,
  getMemoryUsage,
};
