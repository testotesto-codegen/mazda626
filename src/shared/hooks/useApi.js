/**
 * Generic API Hook
 * Provides common patterns for API interactions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createLogger } from '../../core/logging';

const logger = createLogger('useApi');

/**
 * Generic API hook for data fetching and mutations
 * @param {Function} apiFunction - API function to call
 * @param {Object} options - Hook options
 * @returns {Object} API state and actions
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    immediate = false,
    onSuccess = null,
    onError = null,
    dependencies = [],
    retries = 0,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    lastFetch: null
  });

  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);

  /**
   * Execute API call
   */
  const execute = useCallback(async (...args) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const data = await apiFunction(...args, {
        signal: abortControllerRef.current.signal
      });

      setState(prev => ({
        ...prev,
        data,
        loading: false,
        lastFetch: Date.now()
      }));

      retryCountRef.current = 0;

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        logger.debug('API request aborted');
        return;
      }

      // Retry logic
      if (retryCountRef.current < retries) {
        retryCountRef.current++;
        logger.info(`Retrying API call (${retryCountRef.current}/${retries})`);
        
        setTimeout(() => {
          execute(...args);
        }, retryDelay * retryCountRef.current);
        
        return;
      }

      setState(prev => ({
        ...prev,
        error,
        loading: false
      }));

      if (onError) {
        onError(error);
      }

      logger.error('API call failed', error);
      throw error;
    }
  }, [apiFunction, onSuccess, onError, retries, retryDelay]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      data: null,
      loading: false,
      error: null,
      lastFetch: null
    });

    retryCountRef.current = 0;
  }, []);

  /**
   * Refresh data
   */
  const refresh = useCallback(() => {
    if (state.lastFetch) {
      execute();
    }
  }, [execute, state.lastFetch]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute, ...dependencies]);

  return {
    ...state,
    execute,
    reset,
    refresh,
    isLoading: state.loading,
    isError: !!state.error,
    isSuccess: !!state.data && !state.error && !state.loading
  };
};

/**
 * Hook for paginated API calls
 * @param {Function} apiFunction - API function that accepts page parameters
 * @param {Object} options - Hook options
 * @returns {Object} Pagination state and actions
 */
export const usePaginatedApi = (apiFunction, options = {}) => {
  const {
    initialPage = 1,
    pageSize = 20,
    ...apiOptions
  } = options;

  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize,
    total: 0,
    totalPages: 0
  });

  const apiCall = useCallback(
    (page = pagination.page, size = pagination.pageSize) => {
      return apiFunction({ page, limit: size });
    },
    [apiFunction, pagination.page, pagination.pageSize]
  );

  const api = useApi(apiCall, {
    ...apiOptions,
    onSuccess: (data) => {
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / prev.pageSize)
      }));

      if (apiOptions.onSuccess) {
        apiOptions.onSuccess(data);
      }
    }
  });

  const goToPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
    api.execute(page, pagination.pageSize);
  }, [api, pagination.pageSize]);

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      goToPage(pagination.page + 1);
    }
  }, [goToPage, pagination.page, pagination.totalPages]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1);
    }
  }, [goToPage, pagination.page]);

  const changePageSize = useCallback((newSize) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newSize,
      page: 1
    }));
    api.execute(1, newSize);
  }, [api]);

  return {
    ...api,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    hasNextPage: pagination.page < pagination.totalPages,
    hasPrevPage: pagination.page > 1
  };
};

/**
 * Hook for infinite scroll API calls
 * @param {Function} apiFunction - API function
 * @param {Object} options - Hook options
 * @returns {Object} Infinite scroll state and actions
 */
export const useInfiniteApi = (apiFunction, options = {}) => {
  const { pageSize = 20, ...apiOptions } = options;
  
  const [state, setState] = useState({
    data: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: null
  });

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction({
        page: state.page,
        limit: pageSize
      });

      const newData = response.data || response;
      const hasMore = newData.length === pageSize;

      setState(prev => ({
        ...prev,
        data: [...prev.data, ...newData],
        page: prev.page + 1,
        hasMore,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error,
        loading: false
      }));

      if (apiOptions.onError) {
        apiOptions.onError(error);
      }
    }
  }, [apiFunction, state.page, state.loading, state.hasMore, pageSize, apiOptions]);

  const reset = useCallback(() => {
    setState({
      data: [],
      page: 1,
      hasMore: true,
      loading: false,
      error: null
    });
  }, []);

  const refresh = useCallback(() => {
    reset();
    loadMore();
  }, [reset, loadMore]);

  // Load initial data
  useEffect(() => {
    if (state.data.length === 0 && !state.loading) {
      loadMore();
    }
  }, []);

  return {
    ...state,
    loadMore,
    reset,
    refresh,
    isLoading: state.loading,
    isError: !!state.error
  };
};

/**
 * Hook for optimistic updates
 * @param {Function} apiFunction - API function for mutation
 * @param {Object} options - Hook options
 * @returns {Object} Optimistic update state and actions
 */
export const useOptimisticApi = (apiFunction, options = {}) => {
  const { onOptimisticUpdate, onRevert, ...apiOptions } = options;
  
  const [optimisticData, setOptimisticData] = useState(null);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const api = useApi(apiFunction, {
    ...apiOptions,
    onSuccess: (data) => {
      setIsOptimistic(false);
      setOptimisticData(null);
      
      if (apiOptions.onSuccess) {
        apiOptions.onSuccess(data);
      }
    },
    onError: (error) => {
      // Revert optimistic update
      if (isOptimistic && onRevert) {
        onRevert();
      }
      
      setIsOptimistic(false);
      setOptimisticData(null);
      
      if (apiOptions.onError) {
        apiOptions.onError(error);
      }
    }
  });

  const executeOptimistic = useCallback(async (optimisticValue, ...args) => {
    // Apply optimistic update
    setOptimisticData(optimisticValue);
    setIsOptimistic(true);
    
    if (onOptimisticUpdate) {
      onOptimisticUpdate(optimisticValue);
    }

    // Execute actual API call
    return api.execute(...args);
  }, [api, onOptimisticUpdate]);

  return {
    ...api,
    executeOptimistic,
    optimisticData,
    isOptimistic
  };
};

export default useApi;

