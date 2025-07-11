// Custom hooks for the financial dashboard application

// Data management hooks
export { default as useMarketData } from './useMarketData';
export { default as useWatchlist } from './useWatchlist';
export { default as usePortfolio } from './usePortfolio';

// Error handling hooks
export { default as useErrorHandler } from './useErrorHandler';

// Performance optimization hooks
export { default as useOptimizedData, useVirtualizedList, useDebouncedSearch } from './useOptimizedData';

// Re-export individual hooks for convenience
export { useMarketData } from './useMarketData';
export { useWatchlist } from './useWatchlist';
export { usePortfolio } from './usePortfolio';
export { useErrorHandler } from './useErrorHandler';
export { useOptimizedData, useVirtualizedList, useDebouncedSearch } from './useOptimizedData';
