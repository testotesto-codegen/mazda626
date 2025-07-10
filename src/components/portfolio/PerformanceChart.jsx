import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const PerformanceChart = ({ timeframe, metric, data }) => {
  // Generate mock data based on timeframe
  const chartData = useMemo(() => {
    const generateData = () => {
      const dataPoints = {
        '1D': 24,
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        'ALL': 730
      };

      const points = dataPoints[timeframe] || 365;
      const baseValue = 110000;
      const currentValue = data.totalValue;
      const growth = (currentValue - baseValue) / points;

      return Array.from({ length: points }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (points - i));
        
        // Add some realistic volatility
        const volatility = Math.sin(i / 10) * 2000 + Math.random() * 1000 - 500;
        const value = baseValue + (growth * i) + volatility;
        
        return {
          date: date.toISOString().split('T')[0],
          value: Math.max(value, baseValue * 0.8), // Prevent negative values
          return: ((value - baseValue) / baseValue) * 100,
          benchmark: baseValue + (growth * i * 0.7) + (volatility * 0.5) // S&P 500 mock
        };
      });
    };

    return generateData();
  }, [timeframe, data.totalValue]);

  const formatValue = (value) => {
    if (metric === 'return') {
      return `${value.toFixed(2)}%`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const getDataKey = () => {
    switch (metric) {
      case 'return':
        return 'return';
      case 'benchmark':
        return 'benchmark';
      default:
        return 'value';
    }
  };

  const getColor = () => {
    const lastValue = chartData[chartData.length - 1];
    const firstValue = chartData[0];
    const isPositive = lastValue[getDataKey()] >= firstValue[getDataKey()];
    return isPositive ? '#10B981' : '#EF4444';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-textSecondary text-sm mb-1">{label}</p>
          <p className="text-text font-semibold">
            {formatValue(payload[0].value)}
          </p>
          {metric === 'benchmark' && payload[1] && (
            <p className="text-textSecondary text-sm">
              Benchmark: {formatValue(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={getColor()} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={getColor()} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--color-textSecondary)"
            fontSize={12}
            tickFormatter={(value) => {
              const date = new Date(value);
              if (timeframe === '1D') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              if (timeframe === '1W') return date.toLocaleDateString([], { weekday: 'short' });
              return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            stroke="var(--color-textSecondary)"
            fontSize={12}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {metric === 'benchmark' && (
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke="var(--color-secondary)"
              strokeWidth={2}
              fill="transparent"
              strokeDasharray="5 5"
            />
          )}
          
          <Area
            type="monotone"
            dataKey={getDataKey()}
            stroke={getColor()}
            strokeWidth={3}
            fill="url(#colorGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;

