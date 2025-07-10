import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articles: [],
  filteredArticles: [],
  bookmarkedArticles: [],
  filters: {
    category: 'all',
    sentiment: 'all',
    source: 'all',
    searchTerm: '',
  },
  categories: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrial'],
  sources: ['Reuters', 'Bloomberg', 'CNBC', 'MarketWatch', 'Yahoo Finance'],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
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
    
    setArticles: (state, action) => {
      state.articles = action.payload;
      state.lastUpdated = new Date().toISOString();
      newsSlice.caseReducers.applyFilters(state);
    },
    
    addArticles: (state, action) => {
      const newArticles = action.payload.filter(
        newArticle => !state.articles.some(existing => existing.id === newArticle.id)
      );
      state.articles = [...newArticles, ...state.articles];
      state.lastUpdated = new Date().toISOString();
      newsSlice.caseReducers.applyFilters(state);
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      newsSlice.caseReducers.applyFilters(state);
    },
    
    clearFilters: (state) => {
      state.filters = {
        category: 'all',
        sentiment: 'all',
        source: 'all',
        searchTerm: '',
      };
      newsSlice.caseReducers.applyFilters(state);
    },
    
    bookmarkArticle: (state, action) => {
      const articleId = action.payload;
      const article = state.articles.find(a => a.id === articleId);
      if (article && !state.bookmarkedArticles.some(b => b.id === articleId)) {
        state.bookmarkedArticles.push(article);
      }
    },
    
    removeBookmark: (state, action) => {
      const articleId = action.payload;
      state.bookmarkedArticles = state.bookmarkedArticles.filter(a => a.id !== articleId);
    },
    
    applyFilters: (state) => {
      let filtered = [...state.articles];
      
      // Apply category filter
      if (state.filters.category !== 'all') {
        filtered = filtered.filter(article => 
          article.category?.toLowerCase() === state.filters.category.toLowerCase()
        );
      }
      
      // Apply sentiment filter
      if (state.filters.sentiment !== 'all') {
        filtered = filtered.filter(article => 
          article.sentiment?.toLowerCase() === state.filters.sentiment.toLowerCase()
        );
      }
      
      // Apply source filter
      if (state.filters.source !== 'all') {
        filtered = filtered.filter(article => 
          article.source?.toLowerCase() === state.filters.source.toLowerCase()
        );
      }
      
      // Apply search term filter
      if (state.filters.searchTerm) {
        const searchTerm = state.filters.searchTerm.toLowerCase();
        filtered = filtered.filter(article =>
          article.title?.toLowerCase().includes(searchTerm) ||
          article.summary?.toLowerCase().includes(searchTerm) ||
          article.content?.toLowerCase().includes(searchTerm)
        );
      }
      
      state.filteredArticles = filtered;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setArticles,
  addArticles,
  setFilters,
  clearFilters,
  bookmarkArticle,
  removeBookmark,
  applyFilters,
} = newsSlice.actions;

// Selectors
export const selectNews = (state) => state.news;
export const selectArticles = (state) => state.news.filteredArticles;
export const selectAllArticles = (state) => state.news.articles;
export const selectBookmarkedArticles = (state) => state.news.bookmarkedArticles;
export const selectNewsFilters = (state) => state.news.filters;
export const selectNewsLoading = (state) => state.news.isLoading;
export const selectNewsError = (state) => state.news.error;
export const selectNewsCategories = (state) => state.news.categories;
export const selectNewsSources = (state) => state.news.sources;

export default newsSlice.reducer;
