import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Share2, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Briefcase,
  HelpCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { useMarketStore } from '../../store/marketStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useSettingsStore } from '../../store/settingsStore';
import { PriceChart } from '../../components/StockDetail/PriceChart';
import { TechnicalGauges } from '../../components/StockDetail/TechnicalGauges';
import { SignalExplanation } from '../../components/StockDetail/SignalExplanation';
import { PositionStats } from '../../components/StockDetail/PositionStats';
import { AddStockModal } from '../AddStock/AddStockModal';
import { generateTimingSignal } from '../../services/signalEngine';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';

export const StockDetailScreen: React.FC = () => {
  const { selectedTicker, quotes, watchlist, toggleWatchlist } = useMarketStore();
  const { positions } = usePortfolioStore();
  const { setActiveTab } = useSettingsStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stock = selectedTicker ? quotes[selectedTicker.toUpperCase()] : Object.values(quotes)[0];

  if (!stock) {
    return (
      <div className="p-6 text-center text-slate-400">
        <p>No stock selected.</p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="mt-3 px-4 py-2 bg-navy-800 text-white rounded-xl text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const signal = generateTimingSignal(stock);
  const position = positions.find(p => p.ticker.toUpperCase() === stock.ticker.toUpperCase());
  const isWatched = watchlist.includes(stock.ticker.toUpperCase());
  const isPositive = stock.change >= 0;

  return (
    <div className="flex-1 flex flex-col pb-24 space-y-4">
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-9 h-9 rounded-full bg-navy-900 border border-navy-800 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <h2 className="text-base font-bold text-white font-mono">{stock.ticker}</h2>
            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{stock.name}</p>
          </div>

          <button
            onClick={() => toggleWatchlist(stock.ticker)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
              isWatched
                ? 'bg-gold-500/20 border-gold-500 text-gold-400'
                : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'
            }`}
          >
            <Star className={`w-4 h-4 ${isWatched ? 'fill-gold-400' : ''}`} />
          </button>
        </div>

        {/* Current Price & Day Stats Header */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-3xl p-4 shadow-sm">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                ${stock.price.toFixed(2)}
              </span>
              <div className={`flex items-center gap-1 mt-1 text-xs font-mono font-bold ${
                isPositive ? 'text-growth-400' : 'text-loss-500'
              }`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isPositive ? '+' : ''}${stock.change.toFixed(2)}</span>
                <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                <span className="text-[10px] text-slate-500 font-sans ml-1">Today</span>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400 font-mono space-y-0.5">
              <div>High: <strong className="text-slate-200">${stock.high.toFixed(2)}</strong></div>
              <div>Low: <strong className="text-slate-200">${stock.low.toFixed(2)}</strong></div>
            </div>
          </div>

          {/* Quick Fundamental Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-navy-800 text-center font-mono text-xs">
            <div className="bg-navy-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 font-sans block">Market Cap</span>
              <strong className="text-white text-xs">{stock.marketCap}</strong>
            </div>
            <div className="bg-navy-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 font-sans block">P/E Ratio</span>
              <strong className="text-white text-xs">{stock.peRatio}x</strong>
            </div>
            <div className="bg-navy-950/60 p-2 rounded-xl">
              <span className="text-[10px] text-slate-400 font-sans block">Volume</span>
              <strong className="text-white text-xs">{(stock.volume / 1000000).toFixed(1)}M</strong>
            </div>
          </div>
        </div>

        {/* Interactive Price Chart with Timeframes */}
        <PriceChart history={stock.history} currentPrice={stock.price} />

        {/* Intelligent Timing Advice & Beginner Breakdown */}
        <SignalExplanation signal={signal} />

        {/* Visual Technical Gauges (RSI, MACD, SMAs, Volume) */}
        <TechnicalGauges indicators={stock.indicators} currentPrice={stock.price} />

        {/* User's Position & Dollar-Cost Averaging Calculator */}
        <PositionStats
          stock={stock}
          position={position}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </div>

      {isAddModalOpen && (
        <AddStockModal
          preselectedTicker={stock.ticker}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};
