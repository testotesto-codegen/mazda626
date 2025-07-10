import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectHoldings, 
  selectPortfolioTotals, 
  selectPortfolioLoading,
  addHolding,
  removeHolding,
  updatePrices 
} from '../../../redux/slices/portfolioSlice';
import AddHoldingModal from './AddHoldingModal';
import PortfolioCharts from './PortfolioCharts';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart, FiTrash2 } from 'react-icons/fi';

const PortfolioTracker = () => {
  const dispatch = useDispatch();
  const holdings = useSelector(selectHoldings);
  const totals = useSelector(selectPortfolioTotals);
  const isLoading = useSelector(selectPortfolioLoading);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock price updates (in a real app, this would come from an API)
  useEffect(() => {
    const interval = setInterval(() => {
      if (holdings.length > 0) {
        const priceUpdates = {};
        holdings.forEach(holding => {
          // Simulate small price changes
          const change = (Math.random() - 0.5) * 0.02; // ±1% change
          priceUpdates[holding.symbol] = holding.currentPrice * (1 + change);
        });
        dispatch(updatePrices(priceUpdates));
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [holdings, dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const handleAddHolding = (holdingData) => {
    dispatch(addHolding(holdingData));
    setShowAddModal(false);
  };

  const handleRemoveHolding = (id) => {
    if (window.confirm('Are you sure you want to remove this holding?')) {
      dispatch(removeHolding(id));
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your investments and monitor performance
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Add Holding
          </button>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.totalValue)}</p>
              </div>
              <FiDollarSign className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Return</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.totalReturn)}</p>
                <p className="text-green-100 text-sm">{formatPercent(totals.totalReturnPercent)}</p>
              </div>
              <FiTrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className={`bg-gradient-to-r ${totals.dailyChange >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'} p-6 rounded-xl text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Daily Change</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.dailyChange)}</p>
                <p className="text-white/80 text-sm">{formatPercent(totals.dailyChangePercent)}</p>
              </div>
              {totals.dailyChange >= 0 ? (
                <FiTrendingUp className="w-8 h-8 text-white/80" />
              ) : (
                <FiTrendingDown className="w-8 h-8 text-white/80" />
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Holdings</p>
                <p className="text-2xl font-bold">{holdings.length}</p>
                <p className="text-purple-100 text-sm">Positions</p>
              </div>
              <FiPieChart className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {holdings.length > 0 && (
          <div className="mb-8">
            <PortfolioCharts holdings={holdings} />
          </div>
        )}

        {/* Holdings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Holdings</h2>
          </div>
          
          {holdings.length === 0 ? (
            <div className="p-12 text-center">
              <FiPieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No holdings yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start tracking your portfolio by adding your first holding
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Your First Holding
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Market Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Unrealized P&L
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {holdings.map((holding) => (
                    <tr key={holding.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {holding.symbol}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {holding.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {holding.shares.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(holding.avgCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(holding.currentPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(holding.currentValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${holding.unrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(holding.unrealizedGain)}
                        </div>
                        <div className={`text-xs ${holding.unrealizedGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercent(holding.unrealizedGainPercent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveHolding(holding.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Holding Modal */}
        {showAddModal && (
          <AddHoldingModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddHolding}
          />
        )}
      </div>
    </div>
  );
};

export default PortfolioTracker;
