import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface Props {
  currentValue: number;
}

export const PortfolioChart: React.FC<Props> = ({ currentValue }) => {
  // Generate a realistic 7-day cumulative net worth progression leading up to currentValue
  const baseValue = Math.max(100, currentValue * 0.96);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  
  const chartData = days.map((day, idx) => {
    const fraction = (idx + 1) / days.length;
    const value = idx === days.length - 1 ? currentValue : baseValue + (currentValue - baseValue) * fraction * (1 + (Math.sin(idx) * 0.015));
    return {
      day,
      value: Number(value.toFixed(2))
    };
  });

  return (
    <div className="bg-navy-900/80 border border-navy-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400">7-Day Portfolio Trajectory</span>
        <span className="text-[11px] font-mono text-growth-400 font-semibold">+3.8% this week</span>
      </div>

      <div className="w-full h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#475569"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${Math.round(v)}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-navy-950 border border-navy-700 rounded-lg px-2.5 py-1.5 shadow-lg text-xs font-mono">
                      <span className="text-slate-400 text-[10px] block">{payload[0].payload.day}</span>
                      <strong className="text-white">${Number(payload[0].value).toFixed(2)}</strong>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#portfolioGrad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
