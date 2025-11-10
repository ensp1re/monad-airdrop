import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AllocationAreaChartProps {
  data: { range: string; totalAmount: number }[];
}

export function AllocationAreaChart({ data }: AllocationAreaChartProps) {
  return (
    <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl text-white mb-4 sm:mb-6">Total MON by Range</h2>
      
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ left: 5, right: 15, top: 15, bottom: 10 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => {
              if (value >= 1000000000) {
                return `${(value / 1000000000).toFixed(1)}B`;
              } else if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              }
              return value.toLocaleString();
            }}
            width={55}
            tickMargin={5}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a2e',
              border: '1px solid #7c3aed',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#a78bfa', fontWeight: 600 }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value: number) => [value.toLocaleString() + ' MON', 'Total Amount']}
            cursor={{ stroke: '#7c3aed', strokeWidth: 2, strokeDasharray: '5 5' }}
          />
          <Area 
            type="monotone" 
            dataKey="totalAmount" 
            stroke="#7c3aed" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
