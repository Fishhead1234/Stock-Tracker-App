import React, { useState } from 'react';
import { HelpCircle, Activity, TrendingUp, Compass, BarChart2 } from 'lucide-react';
import { TechnicalIndicators } from '../../types/stock';
import { EducationModal } from '../EducationModal/EducationModal';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  indicators: TechnicalIndicators;
  currentPrice: number;
}

export const TechnicalGauges: React.FC<Props> = ({ indicators, currentPrice }) => {
  const [activeEducationTerm, setActiveEducationTerm] = useState<string | null>(null);
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  const { rsi, macd, sma50, sma200, volumeSurgeRatio } = indicators;

  // RSI Zone logic
  let rsiZone = 'Neutral (Balanced)';
  let rsiColor = isLight ? 'text-[#666666]' : 'text-slate-200';
  let rsiBg = isLight ? 'bg-[#E5E5EA]' : 'bg-slate-700/50';
  if (rsi <= 30) {
    rsiZone = 'Oversold (Bargain Zone)';
    rsiColor = isLight ? 'text-[#34C759]' : 'text-growth-400';
    rsiBg = isLight ? 'bg-[#34C759]/15' : 'bg-growth-500/20';
  } else if (rsi >= 70) {
    rsiZone = 'Overbought (Caution Zone)';
    rsiColor = isLight ? 'text-[#FF9500]' : 'text-gold-400';
    rsiBg = isLight ? 'bg-[#FF9500]/15' : 'bg-gold-500/20';
  }

  // MACD logic
  const isMacdBullish = macd.crossover === 'bullish';

  // Moving Average alignment
  const above50 = currentPrice >= sma50;
  const above200 = currentPrice >= sma200;

  return (
    <div className="space-y-3">
      {/* 1. RSI Oscillator Gauge */}
      <div className={`rounded-2xl p-4 border transition-all ${
        isLight 
          ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]' 
          : 'bg-navy-900/90 border-navy-800 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 ${isLight ? 'text-[#007AFF]' : 'text-slate-400'}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#000000]' : 'text-white'}`}>
              RSI (Relative Strength)
            </span>
            <button
              type="button"
              data-touch-target="true"
              onClick={() => setActiveEducationTerm('RSI')}
              className={`transition cursor-pointer p-1 ${isLight ? 'text-[#8E8E93] hover:text-[#007AFF]' : 'text-slate-400 hover:text-gold-400'}`}
              title="Learn about RSI"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
            isLight ? 'border-[rgba(0,0,0,0.08)]' : 'border-transparent'
          } ${rsiBg} ${rsiColor}`}>
            {rsi.toFixed(1)} - {rsiZone}
          </span>
        </div>

        {/* Visual Gauge Bar */}
        <div className="mt-3">
          <div className={`relative h-3 w-full rounded-full overflow-hidden flex border ${
            isLight ? 'bg-[#E5E5EA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950 border-navy-800'
          }`}>
            {/* Oversold 0-30% */}
            <div className={`w-[30%] border-r ${isLight ? 'bg-[#34C759]/40 border-[rgba(0,0,0,0.1)]' : 'bg-growth-600/40 border-navy-800'}`} />
            {/* Neutral 30-70% */}
            <div className={`w-[40%] border-r ${isLight ? 'bg-[#D1D1D6] border-[rgba(0,0,0,0.1)]' : 'bg-navy-800/60 border-navy-800'}`} />
            {/* Overbought 70-100% */}
            <div className={`w-[30%] ${isLight ? 'bg-[#FF9500]/40' : 'bg-gold-600/40'}`} />
          </div>

          {/* Indicator Pointer */}
          <div className="relative w-full h-4 mt-1">
            <div
              className={`absolute -top-3 w-3.5 h-3.5 rounded-full shadow transition-all duration-500 -ml-1.5 border-2 ${
                isLight ? 'bg-[#007AFF] border-white' : 'bg-white border-navy-950'
              }`}
              style={{ left: `${Math.max(2, Math.min(98, rsi))}%` }}
            />
            <div className={`flex justify-between text-[11px] mt-1 font-mono ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
              <span>0 (Oversold)</span>
              <span>30</span>
              <span>50 Neutral</span>
              <span>70</span>
              <span>100 (Overbought)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MACD Momentum & Moving Averages Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* MACD Card */}
        <div className={`rounded-2xl p-3.5 border transition-all ${
          isLight ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-card' : 'bg-navy-900/90 border-navy-800 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className={`w-3.5 h-3.5 ${isLight ? 'text-[#007AFF]' : 'text-slate-400'}`} />
              <span className={`text-[11px] font-bold uppercase ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                MACD Trend
              </span>
            </div>
            <button
              type="button"
              data-touch-target="true"
              onClick={() => setActiveEducationTerm('MACD')}
              className={`transition cursor-pointer p-1 ${isLight ? 'text-[#8E8E93] hover:text-[#007AFF]' : 'text-slate-400 hover:text-gold-400'}`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2">
            <div className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              isMacdBullish 
                ? isLight ? 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/30' : 'bg-growth-500/20 text-growth-400 border-growth-500/30'
                : isLight ? 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/30' : 'bg-loss-500/20 text-loss-400 border-loss-500/30'
            }`}>
              <span>{isMacdBullish ? 'Bullish Crossover' : 'Bearish Crossover'}</span>
            </div>
            <div className={`text-[12px] mt-2 space-y-0.5 font-mono ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              <div>MACD: <strong className={isLight ? 'text-black' : 'text-slate-200'}>{macd.macdLine}</strong></div>
              <div>Signal: <strong className={isLight ? 'text-black' : 'text-slate-200'}>{macd.signalLine}</strong></div>
              <div>Hist: <strong className={macd.histogram >= 0 ? (isLight ? 'text-[#34C759]' : 'text-growth-400') : (isLight ? 'text-[#FF3B30]' : 'text-loss-400')}>{macd.histogram}</strong></div>
            </div>
          </div>
        </div>

        {/* Moving Averages Card */}
        <div className={`rounded-2xl p-3.5 border transition-all ${
          isLight ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-card' : 'bg-navy-900/90 border-navy-800 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Compass className={`w-3.5 h-3.5 ${isLight ? 'text-[#007AFF]' : 'text-slate-400'}`} />
              <span className={`text-[11px] font-bold uppercase ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                Support SMAs
              </span>
            </div>
            <button
              type="button"
              data-touch-target="true"
              onClick={() => setActiveEducationTerm('Moving Averages')}
              className={`transition cursor-pointer p-1 ${isLight ? 'text-[#8E8E93] hover:text-[#007AFF]' : 'text-slate-400 hover:text-gold-400'}`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`mt-2 text-[12px] font-mono space-y-1 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
            <div className="flex items-center justify-between">
              <span>50-Day:</span>
              <span className={`font-semibold ${above50 ? (isLight ? 'text-[#34C759]' : 'text-growth-400') : (isLight ? 'text-[#FF3B30]' : 'text-loss-400')}`}>
                ${sma50} {above50 ? '▲' : '▼'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>200-Day:</span>
              <span className={`font-semibold ${above200 ? (isLight ? 'text-[#34C759]' : 'text-growth-400') : (isLight ? 'text-[#FF3B30]' : 'text-loss-400')}`}>
                ${sma200} {above200 ? '▲' : '▼'}
              </span>
            </div>
            <div className={`pt-1 text-[11px] font-sans border-t ${
              isLight ? 'border-[rgba(0,0,0,0.06)] text-[#8E8E93]' : 'border-navy-800 text-slate-500'
            }`}>
              {above50 && above200 ? 'Institutional uptrend support' : 'Under macro resistance'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Volume Surge Activity */}
      <div className={`rounded-2xl p-3 px-4 flex items-center justify-between border transition-all ${
        isLight ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-card' : 'bg-navy-900/90 border-navy-800 shadow-sm'
      }`}>
        <div className="flex items-center gap-2.5">
          <BarChart2 className={`w-4 h-4 ${isLight ? 'text-[#007AFF]' : 'text-slate-400'}`} />
          <div>
            <span className={`text-xs font-bold block ${isLight ? 'text-[#000000]' : 'text-white'}`}>
              Volume Activity
            </span>
            <span className={`text-[12px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              {volumeSurgeRatio >= 1.3 ? 'Unusual institutional surge' : 'Average daily volume flow'}
            </span>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className={`text-xs font-bold ${
            volumeSurgeRatio >= 1.3 
              ? isLight ? 'text-[#34C759]' : 'text-growth-400' 
              : isLight ? 'text-black' : 'text-slate-300'
          }`}>
            {(volumeSurgeRatio * 100).toFixed(0)}%
          </span>
          <span className={`text-[10px] block ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>vs 20d Avg</span>
        </div>
      </div>

      {activeEducationTerm && (
        <EducationModal termOrId={activeEducationTerm} onClose={() => setActiveEducationTerm(null)} />
      )}
    </div>
  );
};
