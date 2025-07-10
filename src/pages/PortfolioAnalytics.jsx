import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiPieChart,
  FiBarChart3,
  FiActivity,
  FiTarget,
  FiShield
} from 'react-icons/fi';
import PerformanceChart from '../components/portfolio/PerformanceChart';
import RiskMetrics from '../components/portfolio/RiskMetrics';
import AssetAllocation from '../components/portfolio/AssetAllocation';

const PortfolioAnalytics = () => {
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 125430.50,
    totalReturn: 15420.30,
    totalReturnPercent: 14.05,
    dayChange: 1250.75,
    dayChangePercent: 1.01,
    positions: 12,
    lastUpdated: new Date()
  });

  const [timeframe, setTimeframe] = useState('1Y');
  const [selectedMetric, setSelectedMetric] = useState('value');

  const performanceMetrics = [
    {
      title: 'Total Value',
      value: `$${portfolioData.totalValue.toLocaleString()}`,
      change: portfolioData.dayChange,
      changePercent: portfolioData.dayChangePercent,
      icon: FiDollarSign,
      color: 'text-primary'
    },
    {
      title: 'Total Return',
      value: `$${portfolioData.totalReturn.toLocaleString()}`,
      change: portfolioData.totalReturn,
      changePercent: portfolioData.totalReturnPercent,
      icon: FiTrendingUp,
      color: 'text-success'
    },
    {
      title: 'Active Positions',
      value: portfolioData.positions,
      change: 2,
      changePercent: 20,
      icon: FiPieChart,
      color: 'text-accent'
    },
    {
      title: 'Sharpe Ratio',
      value: '1.85',
      change: 0.15,
      changePercent: 8.8,
      icon: FiShield,
      color: 'text-warning'
    }
  ];

  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text mb-2">Portfolio Analytics</h1>
          <p className="text-textSecondary">
            Comprehensive analysis of your investment performance
          </p>
          <div className="text-sm text-textSecondary mt-2">
            Last updated: {portfolioData.lastUpdated.toLocaleString()}
          </div>
        </motion.div>

        {/* Performance Metrics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {performanceMetrics.map((metric, index) => (
            <div
              key={metric.title}
              className="bg-surface border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-opacity-10 ${metric.color.replace('text-', 'bg-')}`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className={`flex items-center text-sm ${
                  metric.change >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {metric.change >= 0 ? <FiTrendingUp className="w-4 h-4 mr-1" /> : <FiTrendingDown className="w-4 h-4 mr-1" />}
                  {metric.changePercent >= 0 ? '+' : ''}{metric.changePercent}%
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text mb-1">{metric.value}</div>
                <div className="text-sm text-textSecondary">{metric.title}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text flex items-center gap-2">
                  <FiBarChart3 className="w-5 h-5" />
                  Performance Chart
                </h2>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="px-3 py-1 bg-background border border-border rounded text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="value">Portfolio Value</option>
                    <option value="return">Total Return</option>
                    <option value="benchmark">vs Benchmark</option>
                  </select>
                  <div className="flex bg-background border border-border rounded-lg p-1">
                    {timeframes.map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          timeframe === tf
                            ? 'bg-primary text-white'
                            : 'text-textSecondary hover:text-text'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <PerformanceChart 
                timeframe={timeframe} 
                metric={selectedMetric}
                data={portfolioData}
              />
            </div>
          </motion.div>

          {/* Risk Metrics */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-surface border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
                <FiActivity className="w-5 h-5" />
                Risk Analysis
              </h2>
              <RiskMetrics />
            </div>
          </motion.div>
        </div>

        {/* Asset Allocation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
              <FiTarget className="w-5 h-5" />
              Asset Allocation
            </h2>
            <AssetAllocation />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;

