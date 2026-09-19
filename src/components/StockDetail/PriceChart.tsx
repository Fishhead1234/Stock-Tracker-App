import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { HistoricalPoint } from '../../types/stock';

interface Props {
  history: {
    '1D': HistoricalPoint[];
    '1W': HistoricalPoint[];
    '1M': HistoricalPoint[];
    '1Y': HistoricalPoint[];
    'ALL': HistoricalPoint[];
  };
  currentPrice: number;
}

export const PriceChart: React.FC<Props> = ({ history, currentPrice }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');

  const data = history[timeframe] || history['1M'];
  const firstPoint = data.length > 0 ? data[0].price : currentPrice;
  const isGain = currentPrice >= firstPoint;

  const strokeColor = isGain ? '#10B981' : '#EF4444';
  const fillColor = isGain ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';

  const minPrice = data.length > 0 ? Math.min(...data.map(d => d.price)) * 0.98 : 0;
  const maxPrice = data.length > 0 ? Math.max(...data.map(d => d.price)) * 1.02 : 100;

  const timeframes: Array<'1D' | '1W' | '1M' | '1Y'> = ['1D', '1W', '1M', '1Y'];

  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 shadow-sm">
      {/* Timeframe Selector Buttons */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400">Price Trend</span>
        <div className="flex items-center bg-navy-950 p-1 rounded-xl border border-navy-800">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition ${
                timeframe === tf
                  ? 'bg-navy-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#475569"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#475569"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val.toFixed(0)}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as HistoricalPoint;
                  return (
                    <div className="bg-navy-950 border border-navy-700 rounded-lg p-2.5 shadow-xl text-xs">
                      <div className="text-slate-400 text-[10px] mb-1">{pt.date}</div>
                      <div className="font-mono font-bold text-white text-sm">
                        ${pt.price.toFixed(2)}
                      </div>
                      {pt.volume && (
                        <div className="text-slate-500 text-[10px] mt-0.5">
                          Vol: {(pt.volume / 1000).toFixed(0)}k
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2.5}
              fill="url(#priceGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
