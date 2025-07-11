import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Custom hook for managing user watchlists
 * Provides CRUD operations for watchlist management
 */
export const useWatchlist = (watchlistId = 'default') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { watchlists, activeWatchlist } = useSelector(state => state.watchlist || {});
  const { user } = useSelector(state => state.auth || {});

  const currentWatchlist = watchlists?.[watchlistId] || { symbols: [], name: 'Default' };

  const addSymbol = useCallback(async (symbol, metadata = {}) => {
    if (!symbol || currentWatchlist.symbols.includes(symbol)) {
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate symbol exists
      const validation = await fetch(`/api/market/validate/${symbol}`);
      if (!validation.ok) {
        throw new Error(`Invalid symbol: ${symbol}`);
      }

      const symbolData = await validation.json();

      // Add to watchlist
      const response = await fetch(`/api/watchlist/${watchlistId}/symbols`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          symbol,
          metadata: {
            ...metadata,
            addedAt: new Date().toISOString(),
            companyName: symbolData.companyName,
            sector: symbolData.sector
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add symbol to watchlist');
      }

      // Update local state via Redux
      dispatch({
        type: 'watchlist/addSymbol',
        payload: { watchlistId, symbol, metadata }
      });

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Add symbol error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [watchlistId, currentWatchlist.symbols, dispatch, user?.token]);

  const removeSymbol = useCallback(async (symbol) => {
    if (!currentWatchlist.symbols.includes(symbol)) {
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/watchlist/${watchlistId}/symbols/${symbol}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove symbol from watchlist');
      }

      dispatch({
        type: 'watchlist/removeSymbol',
        payload: { watchlistId, symbol }
      });

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Remove symbol error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [watchlistId, currentWatchlist.symbols, dispatch, user?.token]);

  const reorderSymbols = useCallback(async (newOrder) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/watchlist/${watchlistId}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ symbols: newOrder })
      });

      if (!response.ok) {
        throw new Error('Failed to reorder watchlist');
      }

      dispatch({
        type: 'watchlist/reorderSymbols',
        payload: { watchlistId, symbols: newOrder }
      });

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Reorder symbols error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [watchlistId, dispatch, user?.token]);

  const createWatchlist = useCallback(async (name, symbols = []) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          name,
          symbols,
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create watchlist');
      }

      const newWatchlist = await response.json();

      dispatch({
        type: 'watchlist/createWatchlist',
        payload: newWatchlist
      });

      return newWatchlist.id;
    } catch (err) {
      setError(err.message);
      console.error('Create watchlist error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch, user?.token]);

  const deleteWatchlist = useCallback(async () => {
    if (watchlistId === 'default') {
      setError('Cannot delete default watchlist');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/watchlist/${watchlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete watchlist');
      }

      dispatch({
        type: 'watchlist/deleteWatchlist',
        payload: { watchlistId }
      });

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Delete watchlist error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [watchlistId, dispatch, user?.token]);

  // Load watchlist data on mount
  useEffect(() => {
    if (user?.token && !currentWatchlist.loaded) {
      // Fetch watchlist data
      fetch(`/api/watchlist/${watchlistId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: 'watchlist/loadWatchlist',
          payload: { watchlistId, data }
        });
      })
      .catch(err => {
        console.error('Load watchlist error:', err);
        setError('Failed to load watchlist');
      });
    }
  }, [watchlistId, user?.token, currentWatchlist.loaded, dispatch]);

  return {
    watchlist: currentWatchlist,
    loading,
    error,
    addSymbol,
    removeSymbol,
    reorderSymbols,
    createWatchlist,
    deleteWatchlist,
    symbolCount: currentWatchlist.symbols?.length || 0,
    isEmpty: !currentWatchlist.symbols?.length
  };
};

export default useWatchlist;

