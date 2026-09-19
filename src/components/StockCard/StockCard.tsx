import React from 'react';
import { TrendingUp, TrendingDown, ChevronRight, Briefcase } from 'lucide-react';
import { StockQuote } from '../../types/stock';
import { Position } from '../../types/portfolio';
import { SignalBadge } from './SignalBadge';
import { generateTimingSignal } from '../../services/signalEngine';

interface Props {
  stock: StockQuote;
  position?: Position;
  onClick: () => void;
}

export const StockCard: React.FC<Props> = ({ stock, position, onClick }) => {
  const signal = generateTimingSignal(stock);
  const isPositive = stock.change >= 0;

  // Calculate position metrics if owned
  let positionProfit = 0;
  let positionProfitPercent = 0;
  let currentEquity = 0;

  if (position) {
    const costBasis = position.shares * position.averageBuyPrice;
    currentEquity = position.shares * stock.price;
    positionProfit = currentEquity - costBasis;
    positionProfitPercent = costBasis > 0 ? (positionProfit / costBasis) * 100 : 0;
  }

  return (
    <div
      onClick={onClick}
      className="bg-navy-900/90 hover:bg-navy-850 border border-navy-800 hover:border-navy-700/80 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-glow-navy relative group overflow-hidden"
    >
      {/* Top Row: Ticker, Name, and Signal Badge */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700/80 flex items-center justify-center font-bold text-sm text-slate-100 font-mono shadow-inner">
            {stock.ticker.slice(0, 4)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base tracking-wide font-mono">{stock.ticker}</span>
              {position && (
                <span className="flex items-center gap-0.5 text-[10px] bg-navy-800 text-growth-400 px-1.5 py-0.2 rounded font-medium border border-navy-700">
                  <Briefcase className="w-2.5 h-2.5" />
                  <span>{position.shares} sh</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[150px]">{stock.name}</p>
          </div>
        </div>

        <SignalBadge action={signal.action} size="sm" />
      </div>

      {/* Middle Row: Price & Day Change */}
      <div className="flex items-baseline justify-between pt-1 border-t border-navy-800/60">
        <div>
          <span className="text-lg font-bold text-white font-mono tracking-tight">
            ${stock.price.toFixed(2)}
          </span>
        </div>

        <div className={`flex items-center gap-1 text-xs font-mono font-medium ${isPositive ? 'text-growth-400' : 'text-loss-500'}`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
          <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
        </div>
      </div>

      {/* Optional User Position Return Strip */}
      {position && (
        <div className="mt-2.5 pt-2 border-t border-navy-800/40 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Your Equity: <strong className="text-slate-200 font-mono">${currentEquity.toFixed(2)}</strong></span>
          <span className={`font-mono font-medium ${positionProfit >= 0 ? 'text-growth-400' : 'text-loss-500'}`}>
            {positionProfit >= 0 ? '+' : ''}${positionProfit.toFixed(2)} ({positionProfitPercent >= 0 ? '+' : ''}{positionProfitPercent.toFixed(1)}%)
          </span>
        </div>
      )}

      {/* Action Hint on Hover/Tap */}
      <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-500 group-hover:text-slate-400 transition">
        <span className="truncate max-w-[200px] text-slate-400">
          RSI: <strong className="font-mono text-slate-300">{stock.indicators.rsi}</strong> | {stock.indicators.macd.crossover === 'bullish' ? 'Bullish MACD' : 'Bearish MACD'}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition" />
      </div>
    </div>
  );
};
