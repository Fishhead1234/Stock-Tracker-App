import React, { useState } from 'react';
import { Zap, Filter, Compass, AlertCircle, TrendingUp, Info, PlusCircle } from 'lucide-react';
import { useMarketStore } from '../../store/marketStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';
import { generateTimingSignal } from '../../services/signalEngine';
import { SignalCard } from '../../components/SignalAlert/SignalCard';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';

export const SignalsScreen: React.FC = () => {
  const { language, t } = useLanguageStore();
  const { quotes, selectTicker, watchlist } = useMarketStore();
  const { positions } = usePortfolioStore();
  const { setActiveTab } = useSettingsStore();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PORTFOLIO' | 'WATCHLIST' | 'BUY' | 'SELL'>('ALL');

  const portfolioTickers = new Set(positions.map(p => p.ticker.toUpperCase()));
  const watchlistTickers = new Set(watchlist.map(t => t.toUpperCase()));
  const allTrackedTickers = new Set([...portfolioTickers, ...watchlistTickers]);

  // Strictly filter signals to stocks in user's portfolio and monitored watchlist
  const trackedQuotes = Object.values(quotes).filter(s => allTrackedTickers.has(s.ticker.toUpperCase()));
  const signals = trackedQuotes.map(stock => generateTimingSignal(stock, language));

  // Filter signals
  const filteredSignals = signals.filter(sig => {
    const t = sig.ticker.toUpperCase();
    if (activeFilter === 'PORTFOLIO') {
      return portfolioTickers.has(t);
    }
    if (activeFilter === 'WATCHLIST') {
      return watchlistTickers.has(t);
    }
    if (activeFilter === 'BUY') {
      return sig.action === 'STRONG_BUY' || sig.action === 'BUY';
    }
    if (activeFilter === 'SELL') {
      return sig.action === 'TRIM' || sig.action === 'STRONG_SELL';
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
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#FF9500] uppercase tracking-wider font-mono">
                {t('sig_timing_engine', 'Timing Engine')}
              </span>
              <h2 className="text-xl font-extrabold text-[#000000] dark:text-white tracking-tight">
                {t('sig_my_signals', 'My Stocks & Monitored Signals')}
              </h2>
            </div>
            <span className="text-xs bg-[#F2F2F7] dark:bg-navy-800 border border-black/10 dark:border-navy-700 text-[#34C759] font-mono px-2.5 py-1 rounded-lg">
              {allTrackedTickers.size} {t('sig_tracked_badge', 'Tracked')}
            </span>
          </div>
          <p className="text-[13px] text-[#666666] dark:text-slate-400 mt-1 leading-[1.6]">
            {t('sig_subtitle', 'Real-time timing setups tailored specifically to your portfolio and monitored stocks.')}
          </p>
        </div>

        {/* Market Sentiment Overview Card */}
        <div className="bg-white dark:bg-navy-900/90 border border-black/10 dark:border-navy-800 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-bold text-[#8E8E93] dark:text-slate-400 uppercase tracking-wider block mb-0.5">
              {t('sig_sentiment_title', 'Market Sentiment Index')}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#34C759] font-mono">62 / 100</span>
              <span className="text-[13px] font-semibold text-[#000000] dark:text-slate-200">
                {t('sig_moderate_greed', 'Moderate Greed')}
              </span>
            </div>
            <p className="text-xs text-[#666666] dark:text-slate-400 mt-1 leading-[1.5]">
              {t('sig_sentiment_desc', 'Market momentum is positive. Focus on disciplined dip buying on your tracked watchlist.')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#34C759]/10 border border-[#34C759]/30 flex items-center justify-center text-[#34C759] shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'ALL', label: `${t('sig_tab_all', 'All Tracked')} (${signals.length})` },
            { id: 'PORTFOLIO', label: `${t('sig_tab_portfolio', 'My Portfolio')} (${positions.length})` },
            { id: 'WATCHLIST', label: `${t('sig_tab_watchlist', 'Watchlist')} (${watchlist.length})` },
            { id: 'BUY', label: t('sig_tab_buy', 'Buy Windows') },
            { id: 'SELL', label: t('sig_tab_sell', 'Take Profit / Caution') }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? 'bg-[#007AFF] text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-navy-950 text-[#666666] dark:text-slate-400 hover:text-black dark:hover:text-white border border-black/10 dark:border-navy-850'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Empty State when no stocks are tracked */}
        {allTrackedTickers.size === 0 ? (
          <div className="bg-white dark:bg-navy-900/60 border border-black/10 dark:border-navy-800 rounded-2xl p-6 text-center text-[#666666] dark:text-slate-400 space-y-3 shadow-xs">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F2F2F7] dark:bg-navy-800 border border-black/10 dark:border-navy-700 flex items-center justify-center text-[#FF9500]">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#000000] dark:text-white">
                {t('sig_empty_title', 'No signals tracked yet')}
              </h3>
              <p className="text-[13px] text-[#666666] dark:text-slate-400 max-w-xs mx-auto leading-[1.6]">
                {t('sig_empty_desc', 'Add stocks to your portfolio or watchlist on the Dashboard to view their live timing signals here.')}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center justify-center gap-1.5 min-h-[48px] px-6 py-3 bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold text-[15px] rounded-lg shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              {t('add_stock', 'Add Stock')}
            </button>
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="bg-white dark:bg-navy-900/50 border border-black/10 dark:border-navy-850 rounded-2xl p-6 text-center text-[#666666] dark:text-slate-400 space-y-2 shadow-xs">
            <Compass className="w-8 h-8 mx-auto text-[#8E8E93]" />
            <p className="text-[13px] leading-[1.6]">
              {language === 'ko' ? '선택한 필터 조건에 부합하는 종목 신호가 없습니다.' : 'No active signals match the selected filter in your monitored list.'}
            </p>
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
