import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/**
 * Custom hook for optimized data handling with caching and memoization
 * Provides performance optimizations for large datasets and frequent updates
 */
export const useOptimizedData = (
  dataSource,
  options = {}
) => {
  const {
    cacheKey = 'default',
    cacheDuration = 300000, // 5 minutes
    enableVirtualization = false,
    pageSize = 100,
    sortBy = null,
    filterBy = null,
    transformData = null,
    debounceMs = 300
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Refs for optimization
  const cacheRef = useRef(new Map());
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Memoized cache key with dependencies
  const memoizedCacheKey = useMemo(() => {
    const keyParts = [
      cacheKey,
      JSON.stringify(sortBy),
      JSON.stringify(filterBy),
      currentPage,
      pageSize
    ];
    return keyParts.join('|');
  }, [cacheKey, sortBy, filterBy, currentPage, pageSize]);

  // Check cache for existing data
  const getCachedData = useCallback((key) => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.data;
    }
    return null;
  }, [cacheDuration]);

  // Store data in cache
  const setCachedData = useCallback((key, data) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now()
    });

    // Clean up old cache entries
    if (cacheRef.current.size > 50) {
      const entries = Array.from(cacheRef.current.entries());
      const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toDelete = sortedEntries.slice(0, 10);
      toDelete.forEach(([key]) => cacheRef.current.delete(key));
    }
  }, []);

  // Optimized data fetching function
  const fetchData = useCallback(async (force = false) => {
    // Check cache first
    if (!force) {
      const cachedData = getCachedData(memoizedCacheKey);
      if (cachedData) {
        setData(cachedData.items);
        setTotalPages(cachedData.totalPages);
        return;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      let result;
      
      if (typeof dataSource === 'function') {
        result = await dataSource({
          page: currentPage,
          pageSize,
          sortBy,
          filterBy,
          signal: abortControllerRef.current.signal
        });
      } else if (Array.isArray(dataSource)) {
        result = processArrayData(dataSource);
      } else {
        throw new Error('Invalid data source');
      }

      // Transform data if transformer provided
      const transformedData = transformData ? transformData(result.items) : result.items;

      const processedResult = {
        items: transformedData,
        totalPages: result.totalPages || Math.ceil(result.total / pageSize) || 1,
        total: result.total || transformedData.length
      };

      setData(processedResult.items);
      setTotalPages(processedResult.totalPages);

      // Cache the result
      setCachedData(memoizedCacheKey, processedResult);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Data fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [
    dataSource,
    memoizedCacheKey,
    currentPage,
    pageSize,
    sortBy,
    filterBy,
    transformData,
    getCachedData,
    setCachedData
  ]);

  // Process array data for pagination and filtering
  const processArrayData = useCallback((arrayData) => {
    let processedData = [...arrayData];

    // Apply filtering
    if (filterBy) {
      processedData = processedData.filter(item => {
        return Object.entries(filterBy).every(([key, value]) => {
          if (typeof value === 'string') {
            return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
          }
          return item[key] === value;
        });
      });
    }

    // Apply sorting
    if (sortBy) {
      processedData.sort((a, b) => {
        const aValue = a[sortBy.field];
        const bValue = b[sortBy.field];
        
        if (typeof aValue === 'string') {
          return sortBy.direction === 'desc' 
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }
        
        return sortBy.direction === 'desc' 
          ? bValue - aValue 
          : aValue - bValue;
      });
    }

    // Apply pagination
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = processedData.slice(startIndex, endIndex);

    return {
      items: paginatedData,
      total: processedData.length,
      totalPages: Math.ceil(processedData.length / pageSize)
    };
  }, [currentPage, pageSize, sortBy, filterBy]);

  // Debounced fetch function
  const debouncedFetch = useCallback((force = false) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchData(force);
    }, debounceMs);
  }, [fetchData, debounceMs]);

  // Pagination controls
  const goToPage = useCallback((page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Virtual scrolling helpers (for large datasets)
  const getVisibleItems = useCallback((startIndex, endIndex) => {
    if (!enableVirtualization) return data;
    return data.slice(startIndex, endIndex);
  }, [data, enableVirtualization]);

  // Memoized computed values
  const computedValues = useMemo(() => ({
    hasData: data.length > 0,
    isEmpty: data.length === 0 && !loading,
    hasNextPage: currentPage < totalPages - 1,
    hasPrevPage: currentPage > 0,
    totalItems: data.length,
    currentPageItems: data.length,
    pageInfo: {
      current: currentPage + 1,
      total: totalPages,
      size: pageSize
    }
  }), [data, loading, currentPage, totalPages, pageSize]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    debouncedFetch();
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedFetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Data state
    data,
    loading,
    error,
    
    // Pagination state
    currentPage,
    totalPages,
    
    // Computed values
    ...computedValues,
    
    // Actions
    refresh,
    clearCache,
    goToPage,
    nextPage,
    prevPage,
    
    // Virtual scrolling
    getVisibleItems,
    
    // Cache info
    cacheSize: cacheRef.current.size,
    isCached: !!getCachedData(memoizedCacheKey)
  };
};

/**
 * Hook for optimized list rendering with virtualization
 */
export const useVirtualizedList = (items, itemHeight = 50, containerHeight = 400) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, index) => ({
      ...item,
      index: visibleRange.startIndex + index,
      top: (visibleRange.startIndex + index) * itemHeight
    }));
  }, [items, visibleRange, itemHeight]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    visibleRange
  };
};

/**
 * Hook for debounced search
 */
export const useDebouncedSearch = (searchTerm, delay = 300) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return debouncedTerm;
};

export default useOptimizedData;

