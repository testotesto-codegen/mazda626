/**
 * Custom Hooks Index
 * Centralized exports for all custom hooks in the application
 */

// Financial data hooks
export { 
  useFinancialData, 
  useMultipleFinancialData 
} from './useFinancialData';

// Market data hooks
export { 
  useMarketData, 
  useWatchlist 
} from './useMarketData';

// Re-export for convenience
export * from './useFinancialData';
export * from './useMarketData';

