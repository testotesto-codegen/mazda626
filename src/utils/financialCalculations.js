/**
 * Financial calculations and utilities for the dashboard
 * Provides standardized financial formulas and calculations
 */

/**
 * Calculate percentage change between two values
 * @param {number} currentValue - Current value
 * @param {number} previousValue - Previous value
 * @returns {number} Percentage change
 */
export const calculatePercentageChange = (currentValue, previousValue) => {
  if (!previousValue || previousValue === 0) return 0;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

/**
 * Calculate absolute change between two values
 * @param {number} currentValue - Current value
 * @param {number} previousValue - Previous value
 * @returns {number} Absolute change
 */
export const calculateAbsoluteChange = (currentValue, previousValue) => {
  return currentValue - previousValue;
};

/**
 * Calculate compound annual growth rate (CAGR)
 * @param {number} beginningValue - Starting value
 * @param {number} endingValue - Ending value
 * @param {number} periods - Number of periods (years)
 * @returns {number} CAGR as percentage
 */
export const calculateCAGR = (beginningValue, endingValue, periods) => {
  if (beginningValue <= 0 || endingValue <= 0 || periods <= 0) return 0;
  return (Math.pow(endingValue / beginningValue, 1 / periods) - 1) * 100;
};

/**
 * Calculate simple moving average
 * @param {number[]} values - Array of values
 * @param {number} period - Period for moving average
 * @returns {number[]} Array of moving averages
 */
export const calculateSMA = (values, period) => {
  if (!values || values.length < period) return [];
  
  const sma = [];
  for (let i = period - 1; i < values.length; i++) {
    const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
};

/**
 * Calculate exponential moving average
 * @param {number[]} values - Array of values
 * @param {number} period - Period for EMA
 * @returns {number[]} Array of exponential moving averages
 */
export const calculateEMA = (values, period) => {
  if (!values || values.length === 0) return [];
  
  const multiplier = 2 / (period + 1);
  const ema = [values[0]]; // Start with first value
  
  for (let i = 1; i < values.length; i++) {
    ema.push((values[i] * multiplier) + (ema[i - 1] * (1 - multiplier)));
  }
  
  return ema;
};

/**
 * Calculate Relative Strength Index (RSI)
 * @param {number[]} prices - Array of closing prices
 * @param {number} period - Period for RSI calculation (default 14)
 * @returns {number[]} Array of RSI values
 */
export const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length < period + 1) return [];
  
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? Math.abs(change) : 0);
  
  const avgGains = calculateSMA(gains, period);
  const avgLosses = calculateSMA(losses, period);
  
  const rsi = [];
  for (let i = 0; i < avgGains.length; i++) {
    if (avgLosses[i] === 0) {
      rsi.push(100);
    } else {
      const rs = avgGains[i] / avgLosses[i];
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  
  return rsi;
};

/**
 * Calculate portfolio metrics
 * @param {Array} positions - Array of position objects
 * @returns {Object} Portfolio metrics
 */
export const calculatePortfolioMetrics = (positions) => {
  if (!positions || positions.length === 0) {
    return {
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      dayChange: 0,
      dayChangePercent: 0
    };
  }

  let totalValue = 0;
  let totalCost = 0;
  let dayChange = 0;

  positions.forEach(position => {
    const marketValue = position.quantity * position.currentPrice;
    const costBasis = position.quantity * position.averagePrice;
    const positionDayChange = position.quantity * (position.currentPrice - position.previousClose);

    totalValue += marketValue;
    totalCost += costBasis;
    dayChange += positionDayChange;
  });

  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercent,
    dayChange,
    dayChangePercent
  };
};

/**
 * Calculate position weight in portfolio
 * @param {number} positionValue - Value of the position
 * @param {number} totalPortfolioValue - Total portfolio value
 * @returns {number} Weight as percentage
 */
export const calculatePositionWeight = (positionValue, totalPortfolioValue) => {
  if (totalPortfolioValue === 0) return 0;
  return (positionValue / totalPortfolioValue) * 100;
};

/**
 * Calculate volatility (standard deviation of returns)
 * @param {number[]} returns - Array of return values
 * @returns {number} Volatility
 */
export const calculateVolatility = (returns) => {
  if (!returns || returns.length < 2) return 0;
  
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const squaredDifferences = returns.map(ret => Math.pow(ret - mean, 2));
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / returns.length;
  
  return Math.sqrt(variance);
};

/**
 * Calculate Sharpe ratio
 * @param {number[]} returns - Array of return values
 * @param {number} riskFreeRate - Risk-free rate (default 0.02 for 2%)
 * @returns {number} Sharpe ratio
 */
export const calculateSharpeRatio = (returns, riskFreeRate = 0.02) => {
  if (!returns || returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const volatility = calculateVolatility(returns);
  
  if (volatility === 0) return 0;
  
  return (avgReturn - riskFreeRate) / volatility;
};

/**
 * Calculate maximum drawdown
 * @param {number[]} values - Array of portfolio values
 * @returns {Object} Max drawdown info
 */
export const calculateMaxDrawdown = (values) => {
  if (!values || values.length < 2) {
    return { maxDrawdown: 0, peak: 0, trough: 0 };
  }
  
  let peak = values[0];
  let maxDrawdown = 0;
  let peakIndex = 0;
  let troughIndex = 0;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] > peak) {
      peak = values[i];
      peakIndex = i;
    }
    
    const drawdown = (peak - values[i]) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      troughIndex = i;
    }
  }
  
  return {
    maxDrawdown: maxDrawdown * 100, // Convert to percentage
    peak: peak,
    trough: values[troughIndex],
    peakIndex,
    troughIndex
  };
};

/**
 * Calculate beta (correlation with market)
 * @param {number[]} stockReturns - Stock return values
 * @param {number[]} marketReturns - Market return values
 * @returns {number} Beta value
 */
export const calculateBeta = (stockReturns, marketReturns) => {
  if (!stockReturns || !marketReturns || stockReturns.length !== marketReturns.length) {
    return 1; // Default beta
  }
  
  const n = stockReturns.length;
  const stockMean = stockReturns.reduce((sum, ret) => sum + ret, 0) / n;
  const marketMean = marketReturns.reduce((sum, ret) => sum + ret, 0) / n;
  
  let covariance = 0;
  let marketVariance = 0;
  
  for (let i = 0; i < n; i++) {
    const stockDiff = stockReturns[i] - stockMean;
    const marketDiff = marketReturns[i] - marketMean;
    
    covariance += stockDiff * marketDiff;
    marketVariance += marketDiff * marketDiff;
  }
  
  if (marketVariance === 0) return 1;
  
  return covariance / marketVariance;
};

/**
 * Calculate present value
 * @param {number} futureValue - Future value
 * @param {number} rate - Discount rate
 * @param {number} periods - Number of periods
 * @returns {number} Present value
 */
export const calculatePresentValue = (futureValue, rate, periods) => {
  if (rate === 0) return futureValue;
  return futureValue / Math.pow(1 + rate, periods);
};

/**
 * Calculate future value
 * @param {number} presentValue - Present value
 * @param {number} rate - Interest rate
 * @param {number} periods - Number of periods
 * @returns {number} Future value
 */
export const calculateFutureValue = (presentValue, rate, periods) => {
  return presentValue * Math.pow(1 + rate, periods);
};

/**
 * Calculate annualized return
 * @param {number} totalReturn - Total return as decimal
 * @param {number} years - Number of years
 * @returns {number} Annualized return as percentage
 */
export const calculateAnnualizedReturn = (totalReturn, years) => {
  if (years === 0) return 0;
  return (Math.pow(1 + totalReturn, 1 / years) - 1) * 100;
};

export default {
  calculatePercentageChange,
  calculateAbsoluteChange,
  calculateCAGR,
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculatePortfolioMetrics,
  calculatePositionWeight,
  calculateVolatility,
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateBeta,
  calculatePresentValue,
  calculateFutureValue,
  calculateAnnualizedReturn
};

