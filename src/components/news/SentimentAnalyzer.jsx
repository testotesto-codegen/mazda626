import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiTarget } from 'react-icons/fi';

const SentimentAnalyzer = ({ newsData }) => {
  const sentimentData = useMemo(() => {
    const positive = newsData.filter(n => n.sentiment.label === 'positive').length;
    const negative = newsData.filter(n => n.sentiment.label === 'negative').length;
    const neutral = newsData.filter(n => n.sentiment.label === 'neutral').length;
    
    return [
      { name: 'Positive', value: positive, color: '#10B981' },
      { name: 'Negative', value: negative, color: '#EF4444' },
      { name: 'Neutral', value: neutral, color: '#6B7280' }
    ];
  }, [newsData]);

  const trendData = useMemo(() => {
    // Generate hourly sentiment trend for the last 24 hours
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      
      // Mock sentiment score for each hour
      const score = Math.sin(i / 4) * 0.3 + Math.random() * 0.4 - 0.2;
      
      return {
        time: hour.toLocaleTimeString([], { hour: '2-digit' }),
        sentiment: score,
        volume: Math.floor(Math.random() * 20) + 5
      };
    });
    
    return hours;
  }, []);

  const symbolSentiment = useMemo(() => {
    const symbols = {};
    
    newsData.forEach(news => {
      news.symbols.forEach(symbol => {
        if (!symbols[symbol]) {
          symbols[symbol] = { scores: [], count: 0 };
        }
        symbols[symbol].scores.push(news.sentiment.score);
        symbols[symbol].count++;
      });
    });

    return Object.entries(symbols)
      .map(([symbol, data]) => ({
        symbol,
        avgScore: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [newsData]);

  const overallSentiment = useMemo(() => {
    if (newsData.length === 0) return 0;
    return newsData.reduce((sum, news) => sum + news.sentiment.score, 0) / newsData.length;
  }, [newsData]);

  const getSentimentLabel = (score) => {
    if (score > 0.2) return 'Bullish';
    if (score < -0.2) return 'Bearish';
    return 'Neutral';
  };

  const getSentimentColor = (score) => {
    if (score > 0.2) return 'text-success';
    if (score < -0.2) return 'text-error';
    return 'text-textSecondary';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-textSecondary text-sm">{label}</p>
          <p className="text-text font-semibold">
            Sentiment: {payload[0].value.toFixed(2)}
          </p>
          <p className="text-textSecondary text-sm">
            Volume: {payload[0].payload.volume} articles
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overall Sentiment */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <FiActivity className="w-5 h-5" />
          Market Sentiment
        </h3>
        
        <div className="text-center mb-4">
          <div className={`text-3xl font-bold ${getSentimentColor(overallSentiment)}`}>
            {overallSentiment.toFixed(2)}
          </div>
          <div className={`text-sm font-medium ${getSentimentColor(overallSentiment)}`}>
            {getSentimentLabel(overallSentiment)}
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {sentimentData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-text">{item.name}</span>
              </div>
              <span className="text-textSecondary">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Trend */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <FiTrendingUp className="w-5 h-5" />
          24 Hour Trend
        </h3>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-textSecondary)"
                fontSize={10}
              />
              <YAxis 
                stroke="var(--color-textSecondary)"
                fontSize={10}
                domain={[-1, 1]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sentiment"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Symbols */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <FiTarget className="w-5 h-5" />
          Symbol Sentiment
        </h3>
        
        <div className="space-y-3">
          {symbolSentiment.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text">{item.symbol}</span>
                <span className="text-xs text-textSecondary">({item.count})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      item.avgScore > 0 ? 'bg-success' : 'bg-error'
                    }`}
                    style={{ 
                      width: `${Math.abs(item.avgScore) * 100}%`,
                      marginLeft: item.avgScore < 0 ? `${(1 + item.avgScore) * 100}%` : '0'
                    }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  item.avgScore > 0 ? 'text-success' : 'text-error'
                }`}>
                  {item.avgScore.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-primary mb-2">Key Insights</h4>
        <div className="text-xs text-textSecondary space-y-1">
          <p>• Overall market sentiment is {getSentimentLabel(overallSentiment).toLowerCase()}</p>
          <p>• {sentimentData.find(s => s.name === 'Positive')?.value || 0} positive vs {sentimentData.find(s => s.name === 'Negative')?.value || 0} negative articles</p>
          <p>• Most mentioned: {symbolSentiment[0]?.symbol || 'N/A'} ({symbolSentiment[0]?.count || 0} articles)</p>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
