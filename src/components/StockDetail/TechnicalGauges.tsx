import React, { useState } from 'react';
import { HelpCircle, Activity, TrendingUp, Compass, BarChart2 } from 'lucide-react';
import { TechnicalIndicators } from '../../types/stock';
import { EducationModal } from '../EducationModal/EducationModal';

interface Props {
  indicators: TechnicalIndicators;
  currentPrice: number;
}

export const TechnicalGauges: React.FC<Props> = ({ indicators, currentPrice }) => {
  const [activeEducationTerm, setActiveEducationTerm] = useState<string | null>(null);

  const { rsi, macd, sma20, sma50, sma200, volumeSurgeRatio } = indicators;

  // RSI Zone logic
  let rsiZone = 'Neutral (Balanced)';
  let rsiColor = 'text-slate-200';
  let rsiBg = 'bg-slate-700/50';
  if (rsi <= 30) {
    rsiZone = 'Oversold (Bargain Zone)';
    rsiColor = 'text-growth-400';
    rsiBg = 'bg-growth-500/20';
  } else if (rsi >= 70) {
    rsiZone = 'Overbought (Caution Zone)';
    rsiColor = 'text-gold-400';
    rsiBg = 'bg-gold-500/20';
  }

  // MACD logic
  const isMacdBullish = macd.crossover === 'bullish';

  // Moving Average alignment
  const above50 = currentPrice >= sma50;
  const above200 = currentPrice >= sma200;

  return (
    <div className="space-y-3">
      {/* 1. RSI Oscillator Gauge */}
      <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">RSI (Relative Strength)</span>
            <button
              onClick={() => setActiveEducationTerm('RSI')}
              className="text-slate-400 hover:text-gold-400 transition"
              title="Learn about RSI"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${rsiBg} ${rsiColor}`}>
            {rsi.toFixed(1)} - {rsiZone}
          </span>
        </div>

        {/* Visual Gauge Bar */}
        <div className="mt-3">
          <div className="relative h-3 w-full rounded-full bg-navy-950 overflow-hidden border border-navy-800 flex">
            {/* Oversold 0-30% */}
            <div className="w-[30%] bg-growth-600/40 border-r border-navy-800"></div>
            {/* Neutral 30-70% */}
            <div className="w-[40%] bg-navy-800/60 border-r border-navy-800"></div>
            {/* Overbought 70-100% */}
            <div className="w-[30%] bg-gold-600/40"></div>
          </div>

          {/* Indicator Pointer */}
          <div className="relative w-full h-4 mt-1">
            <div
              className="absolute -top-3 w-3 h-3 bg-white border-2 border-navy-950 rounded-full shadow transition-all duration-500 -ml-1.5"
              style={{ left: `${Math.max(2, Math.min(98, rsi))}%` }}
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
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
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-white uppercase">MACD Trend</span>
            </div>
            <button
              onClick={() => setActiveEducationTerm('MACD')}
              className="text-slate-400 hover:text-gold-400 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2">
            <div className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
              isMacdBullish ? 'bg-growth-500/20 text-growth-400' : 'bg-loss-500/20 text-loss-400'
            }`}>
              <span>{isMacdBullish ? 'Bullish Crossover' : 'Bearish Crossover'}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 space-y-0.5 font-mono">
              <div>MACD Line: <strong className="text-slate-200">{macd.macdLine}</strong></div>
              <div>Signal Line: <strong className="text-slate-200">{macd.signalLine}</strong></div>
              <div>Hist: <strong className={macd.histogram >= 0 ? 'text-growth-400' : 'text-loss-400'}>{macd.histogram}</strong></div>
            </div>
          </div>
        </div>

        {/* Moving Averages Card */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-white uppercase">Support SMAs</span>
            </div>
            <button
              onClick={() => setActiveEducationTerm('Moving Averages')}
              className="text-slate-400 hover:text-gold-400 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">50-Day:</span>
              <span className={`font-semibold ${above50 ? 'text-growth-400' : 'text-loss-400'}`}>
                ${sma50} {above50 ? '▲' : '▼'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">200-Day:</span>
              <span className={`font-semibold ${above200 ? 'text-growth-400' : 'text-loss-400'}`}>
                ${sma200} {above200 ? '▲' : '▼'}
              </span>
            </div>
            <div className="pt-1 text-[10px] text-slate-500 font-sans border-t border-navy-800">
              {above50 && above200 ? 'Institutional uptrend support' : 'Under macro resistance'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Volume Surge Activity */}
      <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-3 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-slate-400" />
          <div>
            <span className="text-xs font-bold text-white block">Volume Activity</span>
            <span className="text-[11px] text-slate-400">
              {volumeSurgeRatio >= 1.3 ? 'Unusual institutional surge' : 'Average daily volume flow'}
            </span>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className={`text-xs font-bold ${volumeSurgeRatio >= 1.3 ? 'text-growth-400' : 'text-slate-300'}`}>
            {(volumeSurgeRatio * 100).toFixed(0)}%
          </span>
          <span className="text-[10px] text-slate-500 block">vs 20d Avg</span>
        </div>
      </div>

      {activeEducationTerm && (
        <EducationModal termOrId={activeEducationTerm} onClose={() => setActiveEducationTerm(null)} />
      )}
    </div>
  );
};
