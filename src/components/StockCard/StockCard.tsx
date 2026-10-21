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

  const signal = generateTimingSignal(
    stock, 
    language,
    position ? {
      averageBuyPrice: position.averageBuyPrice,
      shares: position.shares,
      targetSellPrice: position.targetSellPrice,
      stopLossPrice: position.stopLossPrice,
      currencySymbol: position.currencySymbol
    } : undefined
  );
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
      className={`min-h-[56px] rounded-2xl p-4 transition-all duration-300 cursor-pointer relative group overflow-hidden border ${
        position
          ? isLight
            ? 'bg-gradient-to-b from-[#F2FBF5] via-white to-white border-[#34C759]/60 ring-2 ring-[#34C759]/40 shadow-[0_0_20px_rgba(52,199,89,0.22),0_6px_20px_rgba(52,199,89,0.1)] hover:shadow-[0_0_25px_rgba(52,199,89,0.32)]'
            : 'bg-gradient-to-b from-[#0B251E] via-navy-900 to-navy-900 border-emerald-500/60 ring-2 ring-emerald-500/50 shadow-[0_0_22px_rgba(16,185,129,0.35),0_0_45px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)]'
          : isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)] hover:border-[#007AFF]/40 hover:shadow-card shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]' 
            : 'bg-navy-900/90 hover:bg-navy-850 border-navy-800 hover:border-navy-700/80 shadow-sm'
      }`}
    >
      {/* Top glowing accent bar for personal holdings */}
      {position && (
        <div 
          className={`absolute top-0 left-0 right-0 h-[3px] ${
            isLight
              ? 'bg-gradient-to-r from-[#34C759] via-emerald-400 to-[#30D158] shadow-[0_0_8px_rgba(52,199,89,0.5)]'
              : 'bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
          }`} 
        />
      )}

      {/* Top Row: Country, Ticker, Exchange & Signal Badge */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Icon with left padding */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base font-mono shrink-0 border transition-colors ${
            position
              ? isLight
                ? 'bg-[#EAF7EE] border-[#34C759]/30 text-black shadow-xs'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-inner'
              : isLight 
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
              {signal.assetClass === 'INDEX_ETF' && (
                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                  isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                }`}>
                  Index ETF
                </span>
              )}
              {signal.assetClass === 'SECTOR_ETF' && (
                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                  isLight ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-purple-950/60 text-purple-400 border-purple-800'
                }`}>
                  Sector ETF
                </span>
              )}
              {signal.assetClass === 'LEVERAGED_ETF' && (
                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                  isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-950/60 text-amber-400 border-amber-800'
                }`}>
                  Leveraged ETF
                </span>
              )}
              {position && (
                <span className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-bold border transition-shadow ${
                  isLight 
                    ? 'bg-[#34C759]/15 text-[#248A3D] border-[#34C759]/40 shadow-[0_0_8px_rgba(52,199,89,0.25)]' 
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.35)]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isLight ? 'bg-[#34C759]' : 'bg-emerald-400'
                  }`} />
                  <Briefcase className="w-2.5 h-2.5" />
                  <span>Personal Holding ({position.shares} sh)</span>
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
        position
          ? isLight ? 'border-[#34C759]/20' : 'border-emerald-500/20'
          : isLight ? 'border-[rgba(0,0,0,0.08)]' : 'border-navy-800/60'
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
        <div className={`mt-2.5 pt-2 border-t text-[12px] font-mono transition-colors ${
          isLight 
            ? 'border-[#34C759]/25 bg-gradient-to-r from-[#F4FAF6] via-[#EEF8F1] to-[#F4FAF6] -mx-4 -mb-4 p-3 rounded-b-2xl' 
            : 'border-emerald-500/25 bg-gradient-to-r from-emerald-950/50 via-navy-950/60 to-emerald-950/50 -mx-4 -mb-4 p-3 rounded-b-2xl'
        }`}>
          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-[#333333]' : 'text-slate-300'}>
              Avg Cost: <strong className={isLight ? 'text-[#000000]' : 'text-white'}>{curr}{position.averageBuyPrice.toFixed(2)}</strong>
            </span>
            <div className={`font-bold flex items-center gap-1 ${
              positionProfit >= 0 
                ? isLight ? 'text-[#248A3D]' : 'text-emerald-400' 
                : isLight ? 'text-[#FF3B30]' : 'text-loss-500'
            }`}>
              <span>P&L:</span>
              <span>{positionProfit >= 0 ? '+' : ''}{curr}{Math.abs(positionProfit).toFixed(2)} ({positionProfit >= 0 ? '+' : ''}{positionProfitPercent.toFixed(1)}%)</span>
            </div>
          </div>
          {signal.costBasisFeedback && (
            <p className={`mt-1.5 text-[11px] font-sans leading-tight font-medium ${
              isLight ? 'text-[#007AFF]' : 'text-emerald-300'
            }`}>
              💡 {signal.costBasisFeedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
