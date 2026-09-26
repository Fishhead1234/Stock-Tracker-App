import React from 'react';
import { TrendingUp, TrendingDown, Briefcase, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { StockQuote } from '../../types/stock';
import { Position } from '../../types/portfolio';
import { SignalBadge } from './SignalBadge';
import { generateTimingSignal } from '../../services/signalEngine';
import { useSettingsStore } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  stock: StockQuote;
  position?: Position;
  onClick: () => void;
  onRemove?: () => void;
}

export const StockCard: React.FC<Props> = ({ stock, position, onClick, onRemove }) => {
  const { themeMode } = useSettingsStore();
  const { language } = useLanguageStore();
  const isLight = themeMode === 'neutral-light';

  const signal = generateTimingSignal(stock, language);
  const isPositive = stock.change >= 0;

  let positionProfit = 0;
  let positionProfitPercent = 0;
  let currentEquity = 0;

  if (position) {
    const costBasis = position.shares * position.averageBuyPrice;
    currentEquity = position.shares * stock.price;
    positionProfit = currentEquity - costBasis;
    positionProfitPercent = costBasis > 0 ? (positionProfit / costBasis) * 100 : 0;
  }

  const getCountryFlag = (code: string) => {
    switch (code) {
      case 'TW': return '🇹🇼';
      case 'KR': return '🇰🇷';
      case 'US': return '🇺🇸';
      case 'UK': return '🇬🇧';
      case 'NZ': return '🇳🇿';
      case 'AU': return '🇦🇺';
      case 'JP': return '🇯🇵';
      default: return '🌐';
    }
  };

  const curr = stock.currencySymbol || '$';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      data-touch-target="true"
      className={`min-h-[56px] rounded-2xl p-4 transition-all duration-200 cursor-pointer relative group overflow-hidden border ${
        isLight 
          ? 'bg-white border-[rgba(0,0,0,0.1)] hover:border-[#007AFF]/40 hover:shadow-card shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]' 
          : 'bg-navy-900/90 hover:bg-navy-850 border-navy-800 hover:border-navy-700/80 shadow-sm'
      }`}
    >
      {/* Top Row: Country, Ticker, Exchange & Signal Badge */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Icon with left padding */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base font-mono shrink-0 border ${
            isLight 
              ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)] text-black' 
              : 'bg-navy-800 border-navy-700/80 text-slate-100 shadow-inner'
          }`}>
            <span>{getCountryFlag(stock.countryCode)}</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`font-bold text-[16px] tracking-tight font-mono ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                {stock.ticker}
              </span>
              <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
                isLight 
                  ? 'bg-[#F2F2F7] text-[#666666] border-[rgba(0,0,0,0.08)]' 
                  : 'bg-navy-800 text-slate-300 border-navy-700'
              }`}>
                {stock.exchange}
              </span>
              {position && (
                <span className={`flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded font-medium border ${
                  isLight 
                    ? 'bg-[#34C759]/12 text-[#34C759] border-[#34C759]/30' 
                    : 'bg-growth-950/80 text-growth-400 border-growth-500/30'
                }`}>
                  <Briefcase className="w-2.5 h-2.5" />
                  <span>{position.shares} sh</span>
                </span>
              )}
            </div>
            <p className={`text-[13px] truncate max-w-[190px] leading-snug mt-0.5 ${
              isLight ? 'text-[#666666]' : 'text-slate-400'
            }`}>
              {stock.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <SignalBadge action={signal.action} size="sm" />
          {onRemove && (
            <button
              type="button"
              data-touch-target="true"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition border cursor-pointer active:scale-90 ${
                isLight 
                  ? 'bg-[#F2F2F7] hover:bg-[#FF3B30]/15 text-[#8E8E93] hover:text-[#FF3B30] border-[rgba(0,0,0,0.08)]' 
                  : 'bg-navy-800/80 hover:bg-loss-500/20 text-slate-400 hover:text-loss-300 border-navy-700/60'
              }`}
              title="Remove from Stocks to Watch"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Price in Local Currency & Day Change */}
      <div className={`flex items-baseline justify-between pt-2 border-t ${
        isLight ? 'border-[rgba(0,0,0,0.08)]' : 'border-navy-800/60'
      }`}>
        <div>
          <span className={`text-[17px] font-bold font-mono tracking-tight ${
            isLight ? 'text-[#000000]' : 'text-white'
          }`}>
            {curr}{stock.price.toLocaleString('en-US', { minimumFractionDigits: stock.price < 10 ? 2 : stock.price > 1000 ? 0 : 2 })}
          </span>
          <span className={`text-[12px] font-mono ml-1 ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
            {stock.currency}
          </span>
        </div>

        <div className={`flex items-center gap-1 text-[13px] font-mono font-semibold ${
          isPositive 
            ? isLight ? 'text-[#34C759]' : 'text-growth-400' 
            : isLight ? 'text-[#FF3B30]' : 'text-loss-500'
        }`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{isPositive ? '+' : ''}{curr}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
        </div>
      </div>

      {/* Position Specific Metrics Row (If user owns this stock) */}
      {position && (
        <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[13px] font-mono ${
          isLight ? 'border-[rgba(0,0,0,0.06)] bg-[#F2F2F7] -mx-4 -mb-4 p-3 rounded-b-xl' : 'border-navy-800/50 bg-navy-950/40 -mx-4 -mb-4 p-2.5 rounded-b-xl'
        }`}>
          <div className="flex items-center gap-2">
            <span className={isLight ? 'text-[#666666]' : 'text-slate-400'}>
              Val: <strong className={isLight ? 'text-[#000000]' : 'text-white'}>${currentEquity.toFixed(2)}</strong>
            </span>
          </div>
          <div className={`font-bold flex items-center gap-1 ${
            positionProfit >= 0 
              ? isLight ? 'text-[#34C759]' : 'text-growth-400' 
              : isLight ? 'text-[#FF3B30]' : 'text-loss-500'
          }`}>
            <span>P&L:</span>
            <span>{positionProfit >= 0 ? '+' : ''}${positionProfit.toFixed(2)} ({positionProfit >= 0 ? '+' : ''}{positionProfitPercent.toFixed(1)}%)</span>
          </div>
        </div>
      )}
    </div>
  );
};
