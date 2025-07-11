// Legacy date utilities (deprecated - use dateHelpers instead)
import {
  formatDate as legacyFormatDate,
  getWeekRangeFromDate as legacyGetWeekRangeFromDate,
  getAdjacentWeekData as legacyGetAdjacentWeekData,
} from "./DateFormatter";

// New optimized date utilities
import {
  formatDate,
  getWeekRangeFromDate,
  getAdjacentWeekData,
  formatFinancialDate,
  getMarketSessionInfo,
  isValidDateString,
  getTimeAgo,
} from "./dateHelpers";

import {
  organizeFilingsByPeriod
} from "./FilingTransformer";

// Export new date utilities (preferred)
export {
  formatDate,
  getWeekRangeFromDate,
  getAdjacentWeekData,
  formatFinancialDate,
  getMarketSessionInfo,
  isValidDateString,
  getTimeAgo,
  organizeFilingsByPeriod,
};

// Export legacy utilities for backward compatibility (will be removed in future)
export {
  legacyFormatDate,
  legacyGetWeekRangeFromDate,
  legacyGetAdjacentWeekData,
};
