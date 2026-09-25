import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { HistoricalPoint } from '../../types/stock';
import { useSettingsStore } from '../../store/settingsStore';

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
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');

  const data = history[timeframe] || history['1M'];
  const firstPoint = data.length > 0 ? data[0].price : currentPrice;
  const isGain = currentPrice >= firstPoint;

  const strokeColor = isGain 
    ? (isLight ? '#34C759' : '#10B981')
    : (isLight ? '#FF3B30' : '#EF4444');

  const timeframes: Array<'1D' | '1W' | '1M' | '1Y'> = ['1D', '1W', '1M', '1Y'];

  return (
    <div className={`rounded-2xl p-4 transition-all border ${
      isLight 
        ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]' 
        : 'bg-navy-900/90 border-navy-800 shadow-sm'
    }`}>
      {/* Timeframe Selector Buttons (Min 48px touch targets) */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
          Price Trend
        </span>
        <div className={`flex items-center p-1 rounded-xl border ${
          isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950 border-navy-800'
        }`}>
          {timeframes.map(tf => (
            <button
              key={tf}
              type="button"
              data-touch-target="true"
              onClick={() => setTimeframe(tf)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer active:scale-95 ${
                timeframe === tf
                  ? isLight ? 'bg-white text-[#007AFF] shadow-xs' : 'bg-navy-700 text-white shadow-sm'
                  : isLight ? 'text-[#666666] hover:text-black' : 'text-slate-400 hover:text-slate-200'
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
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke={isLight ? '#8E8E93' : '#475569'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              stroke={isLight ? '#8E8E93' : '#475569'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${Math.round(v)}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className={`rounded-lg px-2.5 py-1.5 shadow-lg text-xs font-mono border ${
                      isLight 
                        ? 'bg-white border-[rgba(0,0,0,0.1)] text-black' 
                        : 'bg-navy-950 border-navy-700 text-white'
                    }`}>
                      <span className={`text-[10px] block ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                        {payload[0].payload.date}
                      </span>
                      <strong className={isGain ? (isLight ? 'text-[#34C759]' : 'text-growth-400') : (isLight ? 'text-[#FF3B30]' : 'text-loss-500')}>
                        ${Number(payload[0].value).toFixed(2)}
                      </strong>
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
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
