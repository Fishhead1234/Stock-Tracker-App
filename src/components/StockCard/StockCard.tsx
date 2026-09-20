import React from 'react';
import { TrendingUp, TrendingDown, ChevronRight, Briefcase, X } from 'lucide-react';
import { StockQuote } from '../../types/stock';
import { Position } from '../../types/portfolio';
import { SignalBadge } from './SignalBadge';
import { generateTimingSignal } from '../../services/signalEngine';

interface Props {
  stock: StockQuote;
  position?: Position;
  onClick: () => void;
  onRemove?: () => void;
}

export const StockCard: React.FC<Props> = ({ stock, position, onClick, onRemove }) => {
  const signal = generateTimingSignal(stock);
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
      className="bg-navy-900/90 hover:bg-navy-850 border border-navy-800 hover:border-navy-700/80 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-glow-navy relative group overflow-hidden"
    >
      {/* Top Row: Country, Ticker, Exchange & Signal Badge */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700/80 flex items-center justify-center font-bold text-sm text-slate-100 font-mono shadow-inner relative">
            <span className="text-base">{getCountryFlag(stock.countryCode)}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-white text-sm tracking-wide font-mono">{stock.ticker}</span>
              <span className="text-[10px] bg-navy-800 text-slate-300 font-mono px-1.5 py-0.2 rounded border border-navy-700">
                {stock.exchange}
              </span>
              {position && (
                <span className="flex items-center gap-0.5 text-[10px] bg-growth-950/80 text-growth-400 px-1.5 py-0.2 rounded font-medium border border-growth-500/30">
                  <Briefcase className="w-2.5 h-2.5" />
                  <span>{position.shares} sh</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[170px]">{stock.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <SignalBadge action={signal.action} size="sm" />
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-7 h-7 rounded-lg bg-navy-800/80 hover:bg-loss-500/20 text-slate-400 hover:text-loss-300 border border-navy-700/60 flex items-center justify-center transition"
              title="Remove from Stocks to Watch"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Price in Local Currency & Day Change */}
      <div className="flex items-baseline justify-between pt-1 border-t border-navy-800/60">
        <div>
          <span className="text-lg font-bold text-white font-mono tracking-tight">
            {curr}{stock.price.toLocaleString('en-US', { minimumFractionDigits: stock.price < 10 ? 2 : stock.price > 1000 ? 0 : 2 })}
          </span>
          <span className="text-[10px] text-slate-500 font-mono ml-1">{stock.currency}</span>
        </div>

        <div className={`flex items-center gap-1 text-xs font-mono font-medium ${isPositive ? 'text-growth-400' : 'text-loss-500'}`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{isPositive ? '+' : ''}{curr}{Math.abs(stock.change).toFixed(2)}</span>
          <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
        </div>
      </div>

      {/* User Position Return Strip */}
      {position && (
        <div className="mt-2.5 pt-2 border-t border-navy-800/40 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Your Equity: <strong className="text-slate-200 font-mono">{curr}{currentEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
          <span className={`font-mono font-medium ${positionProfit >= 0 ? 'text-growth-400' : 'text-loss-500'}`}>
            {positionProfit >= 0 ? '+' : ''}{curr}{positionProfit.toFixed(2)} ({positionProfitPercent >= 0 ? '+' : ''}{positionProfitPercent.toFixed(1)}%)
          </span>
        </div>
      )}

      {/* Action Hint */}
      <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-500 group-hover:text-slate-400 transition">
        <span className="truncate max-w-[220px] text-slate-400">
          RSI: <strong className="font-mono text-slate-300">{stock.indicators.rsi}</strong> | {stock.indicators.macd.crossover === 'bullish' ? 'Bullish MACD' : 'Bearish MACD'}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition" />
      </div>
    </div>
  );
};
