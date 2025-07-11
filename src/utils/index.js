// Legacy exports (maintained for backward compatibility)
import {
  formatDate,
  getWeekRangeFromDate,
  getAdjacentWeekData,
} from "./DateFormatter";
import{
  organizeFilingsByPeriod
} from "./FilingTransformer";

export {
  formatDate,
  getWeekRangeFromDate,
  getAdjacentWeekData,
  organizeFilingsByPeriod,
};

// Additional legacy exports
export { default as DateFormatter } from './DateFormatter';
export { default as FilingTransformer } from './FilingTransformer';
export { default as WidgetCalculator } from './WidgetCalculator';
export { default as highlightChunk } from './highlightChunk';
export { default as testHelpers } from './testHelpers';
export { default as toastNotifications } from './toastNotifications';

// New organized utility exports
export * from './date';
export * from './formatting';
export * from './validation';
export * from './constants';
