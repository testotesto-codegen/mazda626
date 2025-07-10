import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiActivity, 
  FiFilter,
  FiRefreshCw,
  FiClock,
  FiExternalLink,
  FiBarChart3
} from 'react-icons/fi';
import NewsCard from '../components/news/NewsCard';
import SentimentAnalyzer from '../components/news/SentimentAnalyzer';

const NewsSentiment = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, positive, negative, neutral
  const [timeframe, setTimeframe] = useState('24h'); // 1h, 24h, 7d, 30d
  const [selectedSymbol, setSelectedSymbol] = useState('all');

  // Mock news data
  const mockNewsData = [
    {
      id: 1,
      title: "Apple Reports Record Q4 Earnings, Beats Expectations",
      summary: "Apple Inc. reported quarterly earnings that exceeded analyst expectations, driven by strong iPhone sales and services revenue growth.",
      source: "Reuters",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      url: "https://example.com/news/1",
      sentiment: {
        score: 0.85,
        label: 'positive',
        confidence: 0.92
      },
      symbols: ['AAPL'],
      impact: 'high',
      category: 'earnings'
    },
    {
      id: 2,
      title: "Tesla Faces Production Challenges in Shanghai Factory",
      summary: "Tesla's Shanghai Gigafactory is experiencing production delays due to supply chain disruptions, potentially affecting Q4 delivery targets.",
      source: "Bloomberg",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      url: "https://example.com/news/2",
      sentiment: {
        score: -0.65,
        label: 'negative',
        confidence: 0.88
      },
      symbols: ['TSLA'],
      impact: 'medium',
      category: 'operations'
    },
    {
      id: 3,
      title: "Federal Reserve Hints at Potential Rate Cut in 2024",
      summary: "Fed officials suggest monetary policy may become more accommodative next year if inflation continues to moderate.",
      source: "Wall Street Journal",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      url: "https://example.com/news/3",
      sentiment: {
        score: 0.45,
        label: 'positive',
        confidence: 0.75
      },
      symbols: ['SPY', 'QQQ'],
      impact: 'high',
      category: 'monetary_policy'
    },
    {
      id: 4,
      title: "NVIDIA Partners with Major Cloud Providers for AI Infrastructure",
      summary: "NVIDIA announces new partnerships to expand AI computing capabilities across major cloud platforms.",
      source: "TechCrunch",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      url: "https://example.com/news/4",
      sentiment: {
        score: 0.72,
        label: 'positive',
        confidence: 0.89
      },
      symbols: ['NVDA'],
      impact: 'medium',
      category: 'partnerships'
    },
    {
      id: 5,
      title: "Oil Prices Surge on Middle East Tensions",
      summary: "Crude oil futures jump 3% as geopolitical tensions in the Middle East raise supply concerns.",
      source: "CNBC",
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
      url: "https://example.com/news/5",
      sentiment: {
        score: -0.35,
        label: 'negative',
        confidence: 0.82
      },
      symbols: ['XOM', 'CVX'],
      impact: 'high',
      category: 'commodities'
    }
  ];

  useEffect(() => {
    setNewsData(mockNewsData);
  }, []);

  const filteredNews = newsData.filter(news => {
    if (filter !== 'all' && news.sentiment.label !== filter) return false;
    if (selectedSymbol !== 'all' && !news.symbols.includes(selectedSymbol)) return false;
    return true;
  });

  const getSentimentStats = () => {
    const total = newsData.length;
    const positive = newsData.filter(n => n.sentiment.label === 'positive').length;
    const negative = newsData.filter(n => n.sentiment.label === 'negative').length;
    const neutral = newsData.filter(n => n.sentiment.label === 'neutral').length;
    
    return {
      total,
      positive: (positive / total * 100).toFixed(1),
      negative: (negative / total * 100).toFixed(1),
      neutral: (neutral / total * 100).toFixed(1),
      avgScore: (newsData.reduce((sum, n) => sum + n.sentiment.score, 0) / total).toFixed(2)
    };
  };

  const stats = getSentimentStats();

  const refreshNews = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const uniqueSymbols = [...new Set(newsData.flatMap(n => n.symbols))].sort();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">News Sentiment Analysis</h1>
              <p className="text-textSecondary">
                AI-powered sentiment analysis of financial news and market impact
              </p>
            </div>
            <button
              onClick={refreshNews}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                  <FiActivity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text">{stats.total}</div>
                  <div className="text-sm text-textSecondary">Total Articles</div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success bg-opacity-10 rounded-lg">
                  <FiTrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text">{stats.positive}%</div>
                  <div className="text-sm text-textSecondary">Positive</div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-error bg-opacity-10 rounded-lg">
                  <FiTrendingDown className="w-5 h-5 text-error" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text">{stats.negative}%</div>
                  <div className="text-sm text-textSecondary">Negative</div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning bg-opacity-10 rounded-lg">
                  <FiBarChart3 className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text">{stats.avgScore}</div>
                  <div className="text-sm text-textSecondary">Avg Score</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sentiment Analyzer */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <SentimentAnalyzer newsData={newsData} />
          </motion.div>

          {/* News Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-4 p-4 bg-surface border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <FiFilter className="w-4 h-4 text-textSecondary" />
                  <span className="text-sm text-textSecondary">Sentiment:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 bg-background border border-border rounded text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-textSecondary">Symbol:</span>
                  <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="px-3 py-1 bg-background border border-border rounded text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Symbols</option>
                    {uniqueSymbols.map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-textSecondary" />
                  <span className="text-sm text-textSecondary">Time:</span>
                  <div className="flex bg-background border border-border rounded-lg p-1">
                    {['1h', '24h', '7d', '30d'].map((tf) => (
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
            </div>

            {/* News List */}
            <div className="space-y-4">
              {filteredNews.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NewsCard news={news} />
                </motion.div>
              ))}

              {filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <FiActivity className="w-12 h-12 text-textSecondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text mb-2">No news found</h3>
                  <p className="text-textSecondary">
                    Try adjusting your filters or refresh to get the latest news
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsSentiment;

