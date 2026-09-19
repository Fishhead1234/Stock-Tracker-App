import React, { useState } from 'react';
import { Zap, Filter, Compass, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { useMarketStore } from '../../store/marketStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useSettingsStore } from '../../store/settingsStore';
import { generateTimingSignal } from '../../services/signalEngine';
import { SignalCard } from '../../components/SignalAlert/SignalCard';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';

export const SignalsScreen: React.FC = () => {
  const { quotes, selectTicker } = useMarketStore();
  const { positions } = usePortfolioStore();
  const { setActiveTab } = useSettingsStore();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'PORTFOLIO'>('ALL');

  const allStocks = Object.values(quotes);
  const signals = allStocks.map(stock => generateTimingSignal(stock));

  // Filter signals
  const filteredSignals = signals.filter(sig => {
    if (activeFilter === 'BUY') {
      return sig.action === 'STRONG_BUY' || sig.action === 'BUY';
    }
    if (activeFilter === 'SELL') {
      return sig.action === 'TRIM' || sig.action === 'STRONG_SELL';
    }
    if (activeFilter === 'PORTFOLIO') {
      return positions.some(p => p.ticker.toUpperCase() === sig.ticker.toUpperCase());
    }
    return true;
  });

  const handleSelectStock = (ticker: string) => {
    selectTicker(ticker);
    setActiveTab('stockDetail');
  };

  return (
    <div className="flex-1 flex flex-col pb-24 space-y-4">
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Top Header */}
        <div className="pt-1">
          <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider font-mono">
            Timing Engine
          </span>
          <h2 className="text-xl font-extrabold text-white">Intelligent Timing Signals</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Technical indicator setups translated into clear, actionable beginner guidance.
          </p>
        </div>

        {/* Market Sentiment Overview Card */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Market Sentiment Index
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-growth-400 font-mono">62 / 100</span>
              <span className="text-xs font-semibold text-slate-200">Moderate Greed</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Market momentum is positive. Focus on disciplined dip buying.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-growth-500/15 border border-growth-500/40 flex items-center justify-center text-growth-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: `All Signals (${signals.length})` },
            { id: 'BUY', label: 'Buy Windows' },
            { id: 'SELL', label: 'Take Profit / Caution' },
            { id: 'PORTFOLIO', label: `My Stocks (${positions.length})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                activeFilter === f.id
                  ? 'bg-navy-700 text-white border border-navy-600 shadow-sm'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-850'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Signals List Feed */}
        {filteredSignals.length === 0 ? (
          <div className="bg-navy-900/50 border border-navy-850 rounded-2xl p-6 text-center text-slate-400 space-y-2">
            <Compass className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-xs">No active signals match the selected filter right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSignals.map(sig => (
              <SignalCard
                key={sig.ticker}
                signal={sig}
                onSelectStock={handleSelectStock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
