import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { PieChart, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  currentValue: number;
}

export const PortfolioChart: React.FC<Props> = ({ currentValue }) => {
  const { themeMode } = useSettingsStore();
  const { t } = useLanguageStore();
  const isLight = themeMode === 'neutral-light';

  const [activeView, setActiveView] = useState<'chart' | 'allocation'>('chart');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Generate 7-day cumulative net worth progression
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

  // Allocation data (compact horizontal bars per Wireframe 1 spec)
  const allocations = [
    { sector: 'Technology', percent: 45, color: '#007AFF', amount: currentValue * 0.45 },
    { sector: 'Finance', percent: 30, color: '#34C759', amount: currentValue * 0.30 },
    { sector: 'Consumer', percent: 25, color: '#FF9500', amount: currentValue * 0.25 },
  ];

  return (
    <div className={`rounded-2xl p-4 transition-all duration-200 border ${
      isLight 
        ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]' 
        : 'bg-navy-900/80 border-navy-800 shadow-sm'
    }`}>
      {/* Top Header & Segment Toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className={`text-[13px] font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
            {activeView === 'chart' ? t('seven_day_trajectory', '7-Day Portfolio Trajectory') : t('allocation_breakdown', 'Sector Allocation')}
          </span>
        </div>

        {/* Segmented control: Chart vs Allocation */}
        <div className={`flex items-center rounded-lg p-0.5 border ${
          isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950 border-navy-800'
        }`}>
          <button
            type="button"
            onClick={() => setActiveView('chart')}
            data-touch-target="true"
            className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
              activeView === 'chart'
                ? isLight ? 'bg-white text-[#007AFF] shadow-xs' : 'bg-navy-700 text-white shadow-xs'
                : isLight ? 'text-[#666666]' : 'text-slate-400'
            }`}
          >
            Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveView('allocation')}
            data-touch-target="true"
            className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
              activeView === 'allocation'
                ? isLight ? 'bg-white text-[#007AFF] shadow-xs' : 'bg-navy-700 text-white shadow-xs'
                : isLight ? 'text-[#666666]' : 'text-slate-400'
            }`}
          >
            Allocation
          </button>
        </div>
      </div>

      {activeView === 'chart' ? (
        <div>
          <div className="w-full h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isLight ? '#007AFF' : '#10B981'} stopOpacity={isLight ? 0.25 : 0.3} />
                    <stop offset="95%" stopColor={isLight ? '#007AFF' : '#10B981'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke={isLight ? '#8E8E93' : '#475569'} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
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
                            {payload[0].payload.day}
                          </span>
                          <strong className={isLight ? 'text-[#007AFF]' : 'text-white'}>
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
                  dataKey="value"
                  stroke={isLight ? '#007AFF' : '#10B981'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#portfolioGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[rgba(0,0,0,0.06)] text-[12px] font-mono">
            <span className={isLight ? 'text-[#666666]' : 'text-slate-400'}>
              7-Day Trend:
            </span>
            <span className={`font-semibold ${isLight ? 'text-[#34C759]' : 'text-growth-400'}`}>
              +3.8% performance progression
            </span>
          </div>
        </div>
      ) : (
        /* Wireframe 1: Space-Efficient Horizontal Allocation Bars */
        <div className="space-y-2.5 py-1">
          {/* Combined stacked progress bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#E5E5EA]">
            {allocations.map(a => (
              <div
                key={a.sector}
                style={{ width: `${a.percent}%`, backgroundColor: a.color }}
                className="h-full transition-all duration-300"
                title={`${a.sector}: ${a.percent}%`}
              />
            ))}
          </div>

          {/* Allocation Breakdown Rows */}
          <div className="space-y-1.5 pt-1">
            {allocations.map(item => (
              <div key={item.sector} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className={`font-medium ${isLight ? 'text-[#000000]' : 'text-slate-200'}`}>
                    {item.sector}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className={isLight ? 'text-[#666666]' : 'text-slate-400'}>
                    ${item.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                  <span className={`font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                    {item.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Progressive Disclosure Accordion (0.3s transition, keeping all content visible) */}
          <div className="pt-2 border-t border-[rgba(0,0,0,0.06)]">
            <button
              type="button"
              data-touch-target="true"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full min-h-[44px] flex items-center justify-between text-xs font-semibold text-[#007AFF] hover:underline cursor-pointer"
            >
              <span>{isAccordionOpen ? 'Hide Diversification Tips' : 'View Diversification Insight'}</span>
              {isAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${
              isAccordionOpen ? 'max-h-32 opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}>
              <p className={`text-[13px] leading-relaxed p-2.5 rounded-xl border ${
                isLight ? 'bg-[#F2F2F7] text-[#666666] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950 text-slate-300 border-navy-800'
              }`}>
                💡 <strong>Young Trader Rule:</strong> Aim for no single sector exceeding 50% of your portfolio. Balancing Tech with Finance and Consumer goods reduces vulnerability during sector drawdowns.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
