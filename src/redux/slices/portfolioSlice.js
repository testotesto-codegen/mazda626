import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  holdings: [],
  totalValue: 0,
  totalCost: 0,
  totalReturn: 0,
  totalReturnPercent: 0,
  dailyChange: 0,
  dailyChangePercent: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addHolding: (state, action) => {
      const newHolding = {
        id: Date.now().toString(),
        symbol: action.payload.symbol,
        name: action.payload.name,
        shares: parseFloat(action.payload.shares),
        avgCost: parseFloat(action.payload.avgCost),
        currentPrice: parseFloat(action.payload.currentPrice || action.payload.avgCost),
        sector: action.payload.sector || 'Unknown',
        dateAdded: new Date().toISOString(),
      };
      
      // Calculate derived values
      newHolding.totalCost = newHolding.shares * newHolding.avgCost;
      newHolding.currentValue = newHolding.shares * newHolding.currentPrice;
      newHolding.unrealizedGain = newHolding.currentValue - newHolding.totalCost;
      newHolding.unrealizedGainPercent = (newHolding.unrealizedGain / newHolding.totalCost) * 100;
      
      state.holdings.push(newHolding);
      portfolioSlice.caseReducers.calculateTotals(state);
    },
    
    updateHolding: (state, action) => {
      const { id, updates } = action.payload;
      const holdingIndex = state.holdings.findIndex(h => h.id === id);
      
      if (holdingIndex !== -1) {
        const holding = state.holdings[holdingIndex];
        Object.assign(holding, updates);
        
        // Recalculate derived values
        holding.totalCost = holding.shares * holding.avgCost;
        holding.currentValue = holding.shares * holding.currentPrice;
        holding.unrealizedGain = holding.currentValue - holding.totalCost;
        holding.unrealizedGainPercent = (holding.unrealizedGain / holding.totalCost) * 100;
        
        portfolioSlice.caseReducers.calculateTotals(state);
      }
    },
    
    removeHolding: (state, action) => {
      state.holdings = state.holdings.filter(h => h.id !== action.payload);
      portfolioSlice.caseReducers.calculateTotals(state);
    },
    
    updatePrices: (state, action) => {
      const priceUpdates = action.payload; // { symbol: newPrice }
      
      state.holdings.forEach(holding => {
        if (priceUpdates[holding.symbol]) {
          const oldPrice = holding.currentPrice;
          holding.currentPrice = priceUpdates[holding.symbol];
          holding.currentValue = holding.shares * holding.currentPrice;
          holding.unrealizedGain = holding.currentValue - holding.totalCost;
          holding.unrealizedGainPercent = (holding.unrealizedGain / holding.totalCost) * 100;
          holding.dailyChange = (holding.currentPrice - oldPrice) * holding.shares;
          holding.dailyChangePercent = ((holding.currentPrice - oldPrice) / oldPrice) * 100;
        }
      });
      
      portfolioSlice.caseReducers.calculateTotals(state);
      state.lastUpdated = new Date().toISOString();
    },
    
    calculateTotals: (state) => {
      state.totalValue = state.holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
      state.totalCost = state.holdings.reduce((sum, holding) => sum + holding.totalCost, 0);
      state.totalReturn = state.totalValue - state.totalCost;
      state.totalReturnPercent = state.totalCost > 0 ? (state.totalReturn / state.totalCost) * 100 : 0;
      state.dailyChange = state.holdings.reduce((sum, holding) => sum + (holding.dailyChange || 0), 0);
      state.dailyChangePercent = state.totalValue > 0 ? (state.dailyChange / (state.totalValue - state.dailyChange)) * 100 : 0;
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addHolding,
  updateHolding,
  removeHolding,
  updatePrices,
  calculateTotals,
  setLoading,
  setError,
  clearError,
} = portfolioSlice.actions;

// Selectors
export const selectPortfolio = (state) => state.portfolio;
export const selectHoldings = (state) => state.portfolio.holdings;
export const selectPortfolioTotals = (state) => ({
  totalValue: state.portfolio.totalValue,
  totalCost: state.portfolio.totalCost,
  totalReturn: state.portfolio.totalReturn,
  totalReturnPercent: state.portfolio.totalReturnPercent,
  dailyChange: state.portfolio.dailyChange,
  dailyChangePercent: state.portfolio.dailyChangePercent,
});
export const selectPortfolioLoading = (state) => state.portfolio.isLoading;
export const selectPortfolioError = (state) => state.portfolio.error;

export default portfolioSlice.reducer;
