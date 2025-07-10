import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { FiPieChart, FiBarChart3 } from 'react-icons/fi';

const AssetAllocation = () => {
  const [viewType, setViewType] = useState('pie'); // 'pie' or 'bar'

  const allocationData = [
    { name: 'Technology', value: 35.2, amount: 44156, color: '#3B82F6', target: 30 },
    { name: 'Healthcare', value: 18.5, amount: 23205, color: '#10B981', target: 20 },
    { name: 'Financial', value: 15.8, amount: 19818, color: '#F59E0B', target: 15 },
    { name: 'Consumer Goods', value: 12.3, amount: 15430, color: '#EF4444', target: 12 },
    { name: 'Energy', value: 8.7, amount: 10912, color: '#8B5CF6', target: 10 },
    { name: 'Real Estate', value: 5.2, amount: 6522, color: '#06B6D4', target: 8 },
    { name: 'Utilities', value: 2.8, amount: 3512, color: '#84CC16', target: 3 },
    { name: 'Cash', value: 1.5, amount: 1881, color: '#6B7280', target: 2 }
  ];

  const assetTypes = [
    { name: 'Stocks', value: 78.5, color: '#3B82F6' },
    { name: 'Bonds', value: 15.2, color: '#10B981' },
    { name: 'ETFs', value: 4.8, color: '#F59E0B' },
    { name: 'Cash', value: 1.5, color: '#6B7280' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-text font-semibold">{data.name}</p>
          <p className="text-primary">${data.amount?.toLocaleString()}</p>
          <p className="text-textSecondary">{data.value}% of portfolio</p>
          {data.target && (
            <p className="text-xs text-textSecondary">Target: {data.target}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Sector Allocation</h3>
        <div className="flex bg-background border border-border rounded-lg p-1">
          <button
            onClick={() => setViewType('pie')}
            className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
              viewType === 'pie'
                ? 'bg-primary text-white'
                : 'text-textSecondary hover:text-text'
            }`}
          >
            <FiPieChart className="w-4 h-4" />
            Pie
          </button>
          <button
            onClick={() => setViewType('bar')}
            className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
              viewType === 'bar'
                ? 'bg-primary text-white'
                : 'text-textSecondary hover:text-text'
            }`}
          >
            <FiBarChart3 className="w-4 h-4" />
            Bar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="bg-background rounded-lg p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              ) : (
                <BarChart data={allocationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--color-textSecondary)"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="var(--color-textSecondary)"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <Bar dataKey="target" fill="transparent" stroke="var(--color-textSecondary)" strokeDasharray="3 3" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Details */}
        <div className="space-y-4">
          {/* Asset Type Breakdown */}
          <div className="bg-background rounded-lg p-4">
            <h4 className="text-sm font-semibold text-text mb-3">Asset Types</h4>
            <div className="space-y-2">
              {assetTypes.map((asset, index) => (
                <div key={asset.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className="text-sm text-text">{asset.name}</span>
                  </div>
                  <span className="text-sm font-medium text-text">{asset.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation vs Target */}
          <div className="bg-background rounded-lg p-4">
            <h4 className="text-sm font-semibold text-text mb-3">Current vs Target</h4>
            <div className="space-y-3">
              {allocationData.slice(0, 5).map((item, index) => {
                const difference = item.value - item.target;
                const isOverweight = difference > 0;
                
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-textSecondary">{item.value}%</span>
                        <span className={`text-xs ${isOverweight ? 'text-warning' : 'text-success'}`}>
                          {isOverweight ? '+' : ''}{difference.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div 
                        className="bg-primary rounded-full"
                        style={{ width: `${(item.value / 40) * 100}%` }}
                      />
                      <div 
                        className="bg-border rounded-full"
                        style={{ width: `${((40 - item.value) / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rebalancing Suggestions */}
          <div className="bg-primary bg-opacity-5 rounded-lg p-4 border border-primary border-opacity-20">
            <h4 className="text-sm font-semibold text-primary mb-2">Rebalancing Suggestions</h4>
            <div className="text-xs text-textSecondary space-y-1">
              <p>• Consider reducing Technology allocation by 5.2%</p>
              <p>• Increase Real Estate exposure by 2.8%</p>
              <p>• Healthcare allocation is close to target</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;

