import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface DistributionChartProps {
  data: { range: string; count: number }[];
}

const PURPLE_GRADIENT = [
  '#9333ea',
  '#7c3aed',
  '#6d28d9',
  '#5b21b6',
  '#4c1d95',
  '#3b0764',
  '#2d1b4e',
];

// Custom label component for pie chart - positioned outside
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, range, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30; // Position text outside the pie
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Show all labels, even tiny slices
  // if (percent < 0.005) return null; // Commented out to show all slices

  return (
    <text 
      x={x} 
      y={y} 
      fill="#ffffff" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={11}
      fontWeight={500}
    >
      {`${range}: ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export function DistributionChart({ data }: DistributionChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  
  // Filter out empty data entries for pie chart (but keep all for bar chart)
  const pieData = data.filter(item => item.count > 0);

  return (
    <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl text-white">Allocation Distribution</h2>
        
        <div className="flex items-center gap-1 bg-[#0f0f1e] border border-[#2d2d44] rounded-lg p-1">
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded transition-colors ${
              chartType === 'bar'
                ? 'bg-[#7c3aed] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`p-2 rounded transition-colors ${
              chartType === 'pie'
                ? 'bg-[#7c3aed] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Pie Chart"
          >
            <PieChartIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        {chartType === 'bar' ? (
          <BarChart data={data} margin={{ left: 5, right: 15, top: 15, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
            <XAxis 
              dataKey="range" 
              stroke="#6b7280"
              tick={{ fill: '#d1d5db', fontSize: 11 }}
              tickMargin={8}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#d1d5db', fontSize: 11 }}
              width={50}
              tickMargin={5}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #7c3aed',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#a78bfa', fontWeight: 600 }}
              itemStyle={{ color: '#ffffff' }}
              cursor={{ fill: '#7c3aed', opacity: 0.1 }}
              formatter={(value: number) => [value.toLocaleString(), 'Wallets']}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PURPLE_GRADIENT[index % PURPLE_GRADIENT.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={{ stroke: '#7c3aed', strokeWidth: 1 }}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PURPLE_GRADIENT[index % PURPLE_GRADIENT.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #7c3aed',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#a78bfa', fontWeight: 600 }}
              itemStyle={{ color: '#ffffff' }}
              formatter={(value: number) => [value.toLocaleString(), 'Wallets']}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
              formatter={(value) => <span style={{ color: '#d1d5db' }}>{value}</span>}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
