import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Custom hook for managing user portfolio
 * Provides portfolio calculations, position management, and performance tracking
 */
export const usePortfolio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { positions, cash, totalValue, lastUpdated } = useSelector(state => state.portfolio || {});
  const { user } = useSelector(state => state.auth || {});

  const addPosition = useCallback(async (symbol, quantity, price, type = 'BUY') => {
    if (!symbol || quantity <= 0 || price <= 0) {
      setError('Invalid position parameters');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/portfolio/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          symbol,
          quantity,
          price,
          type,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add position');
      }

      const newPosition = await response.json();

      dispatch({
        type: 'portfolio/addPosition',
        payload: newPosition
      });

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Add position error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [dispatch, user?.token]);

  const updatePosition = useCallback(async (positionId, updates) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/portfolio/positions/${positionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update position');
      }

      const updatedPosition = await response.json();

      dispatch({
        type: 'portfolio/updatePosition',
        payload: updatedPosition
      });

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Update position error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [dispatch, user?.token]);

  const removePosition = useCallback(async (positionId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/portfolio/positions/${positionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove position');
      }

      dispatch({
        type: 'portfolio/removePosition',
        payload: { positionId }
      });

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Remove position error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [dispatch, user?.token]);

  // Portfolio calculations
  const portfolioMetrics = useMemo(() => {
    if (!positions || positions.length === 0) {
      return {
        totalValue: cash || 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        dayGainLoss: 0,
        dayGainLossPercent: 0,
        positions: []
      };
    }

    let totalMarketValue = 0;
    let totalCostBasis = 0;
    let totalDayChange = 0;

    const enrichedPositions = positions.map(position => {
      const marketValue = position.quantity * position.currentPrice;
      const costBasis = position.quantity * position.averagePrice;
      const gainLoss = marketValue - costBasis;
      const gainLossPercent = (gainLoss / costBasis) * 100;
      const dayChange = position.quantity * (position.currentPrice - position.previousClose);
      const dayChangePercent = ((position.currentPrice - position.previousClose) / position.previousClose) * 100;

      totalMarketValue += marketValue;
      totalCostBasis += costBasis;
      totalDayChange += dayChange;

      return {
        ...position,
        marketValue,
        costBasis,
        gainLoss,
        gainLossPercent,
        dayChange,
        dayChangePercent,
        weight: 0 // Will be calculated after total is known
      };
    });

    // Calculate position weights
    const positionsWithWeights = enrichedPositions.map(position => ({
      ...position,
      weight: (position.marketValue / totalMarketValue) * 100
    }));

    const totalPortfolioValue = totalMarketValue + (cash || 0);
    const totalGainLoss = totalMarketValue - totalCostBasis;
    const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;
    const dayGainLossPercent = totalMarketValue > 0 ? (totalDayChange / totalMarketValue) * 100 : 0;

    return {
      totalValue: totalPortfolioValue,
      marketValue: totalMarketValue,
      costBasis: totalCostBasis,
      cash: cash || 0,
      totalGainLoss,
      totalGainLossPercent,
      dayGainLoss: totalDayChange,
      dayGainLossPercent,
      positions: positionsWithWeights,
      positionCount: positions.length
    };
  }, [positions, cash]);

  const getPositionBySymbol = useCallback((symbol) => {
    return positions?.find(position => position.symbol === symbol) || null;
  }, [positions]);

  const getTopPositions = useCallback((limit = 5) => {
    return portfolioMetrics.positions
      .sort((a, b) => b.marketValue - a.marketValue)
      .slice(0, limit);
  }, [portfolioMetrics.positions]);

  const getWorstPerformers = useCallback((limit = 5) => {
    return portfolioMetrics.positions
      .sort((a, b) => a.gainLossPercent - b.gainLossPercent)
      .slice(0, limit);
  }, [portfolioMetrics.positions]);

  const getBestPerformers = useCallback((limit = 5) => {
    return portfolioMetrics.positions
      .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
      .slice(0, limit);
  }, [portfolioMetrics.positions]);

  // Load portfolio data on mount
  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      fetch('/api/portfolio', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: 'portfolio/loadPortfolio',
          payload: data
        });
      })
      .catch(err => {
        console.error('Load portfolio error:', err);
        setError('Failed to load portfolio');
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [user?.token, dispatch]);

  return {
    ...portfolioMetrics,
    loading,
    error,
    lastUpdated,
    addPosition,
    updatePosition,
    removePosition,
    getPositionBySymbol,
    getTopPositions,
    getWorstPerformers,
    getBestPerformers,
    isEmpty: !positions || positions.length === 0
  };
};

export default usePortfolio;

