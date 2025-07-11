import { useState, useEffect, useCallback, useRef } from 'react';
import { useApiErrorHandler } from './useErrorHandler';

/**
 * Custom hook for API calls with loading states, error handling, and caching
 * Provides a consistent pattern for data fetching across the application
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    immediate = true,
    dependencies = [],
    cacheKey = null,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    onSuccess,
    onError,
    transform,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  
  const { handleFetchError } = useApiErrorHandler();
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());

  /**
   * Checks if cached data is still valid
   */
  const isCacheValid = useCallback((cacheEntry) => {
    if (!cacheEntry) return false;
    return Date.now() - cacheEntry.timestamp < cacheDuration;
  }, [cacheDuration]);

  /**
   * Gets data from cache if available and valid
   */
  const getCachedData = useCallback(() => {
    if (!cacheKey) return null;
    const cached = cacheRef.current.get(cacheKey);
    return isCacheValid(cached) ? cached.data : null;
  }, [cacheKey, isCacheValid]);

  /**
   * Stores data in cache
   */
  const setCachedData = useCallback((data) => {
    if (!cacheKey) return;
    cacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }, [cacheKey]);

  /**
   * Executes the API call
   */
  const execute = useCallback(async (...args) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      setError(null);
      return cachedData;
    }

    setLoading(true);
    setError(null);

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const response = await apiFunction(...args, {
        signal: abortControllerRef.current.signal,
      });

      // Transform data if transformer provided
      const transformedData = transform ? transform(response) : response;

      setData(transformedData);
      setCachedData(transformedData);
      setLastFetch(Date.now());

      if (onSuccess) {
        onSuccess(transformedData);
      }

      return transformedData;
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }

      const errorResult = handleFetchError(err);
      setError(errorResult);

      if (onError) {
        onError(err, errorResult);
      }

      throw err;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiFunction, getCachedData, setCachedData, transform, onSuccess, onError, handleFetchError]);

  /**
   * Refetches data, bypassing cache
   */
  const refetch = useCallback((...args) => {
    // Clear cache for this key
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
    }
    return execute(...args);
  }, [execute, cacheKey]);

  /**
   * Clears the current data and error state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    if (cacheKey) {
      cacheRef.current.delete(cacheKey);
    }
  }, [cacheKey]);

  /**
   * Cancels the current request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    reset,
    cancel,
    lastFetch,
  };
};

/**
 * Hook for API mutations (POST, PUT, DELETE)
 */
export const useApiMutation = (apiFunction, options = {}) => {
  const {
    onSuccess,
    onError,
    transform,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { handleMutationError } = useApiErrorHandler();

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(...args);
      const transformedData = transform ? transform(response) : response;

      setData(transformedData);

      if (onSuccess) {
        onSuccess(transformedData);
      }

      return transformedData;
    } catch (err) {
      const errorResult = handleMutationError(err);
      setError(errorResult);

      if (onError) {
        onError(err, errorResult);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, transform, onSuccess, onError, handleMutationError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
};

/**
 * Hook for paginated API calls
 */
export const usePaginatedApi = (apiFunction, options = {}) => {
  const {
    pageSize = 20,
    initialPage = 1,
    ...apiOptions
  } = options;

  const [page, setPage] = useState(initialPage);
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data,
    loading,
    error,
    execute,
    refetch: refetchPage,
  } = useApi(
    (...args) => apiFunction(...args, { page, pageSize }),
    {
      ...apiOptions,
      immediate: false,
      dependencies: [page, pageSize],
      onSuccess: (response) => {
        const newItems = response.data || response.items || response;
        const totalItems = response.total || response.count;

        if (page === 1) {
          setAllData(newItems);
        } else {
          setAllData(prev => [...prev, ...newItems]);
        }

        // Check if there are more pages
        const currentTotal = page === 1 ? newItems.length : allData.length + newItems.length;
        setHasMore(totalItems ? currentTotal < totalItems : newItems.length === pageSize);

        if (apiOptions.onSuccess) {
          apiOptions.onSuccess(response);
        }
      },
    }
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  const refetch = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    return refetchPage();
  }, [refetchPage]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setAllData([]);
    setHasMore(true);
  }, [initialPage]);

  // Load first page
  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data: allData,
    currentPageData: data,
    loading,
    error,
    hasMore,
    page,
    loadMore,
    refetch,
    reset,
  };
};

/**
 * Hook for infinite scroll API calls
 */
export const useInfiniteApi = (apiFunction, options = {}) => {
  const {
    threshold = 100, // pixels from bottom to trigger load
    ...paginatedOptions
  } = options;

  const {
    data,
    loading,
    hasMore,
    loadMore,
    ...rest
  } = usePaginatedApi(apiFunction, paginatedOptions);

  const observerRef = useRef();

  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      rootMargin: `${threshold}px`,
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, loadMore, threshold]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    data,
    loading,
    hasMore,
    lastElementRef,
    loadMore,
    ...rest,
  };
};

export default useApi;

