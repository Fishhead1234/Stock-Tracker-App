import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  Zap, 
  Plus, 
  Globe, 
  Compass, 
  Briefcase,
  Search,
  Loader2,
  Star,
  X,
  Layers,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  ChevronsUp,
  AlertTriangle,
  Bell,
  Crown
} from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useMarketStore } from '../../store/marketStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { stockService } from '../../services/stockService';
import { StockQuote } from '../../types/stock';
import { generateTimingSignal } from '../../services/signalEngine';
import { SignalAction } from '../../types/signal';
import { PortfolioSummaryCard } from '../../components/Dashboard/PortfolioSummaryCard';
import { PortfolioChart } from '../../components/Dashboard/PortfolioChart';
import { StockCard } from '../../components/StockCard/StockCard';
import { DataStatusBadge } from '../../components/Common/DataStatusBadge';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';
import { AddStockModal } from '../AddStock/AddStockModal';
import { EducationModal } from '../../components/EducationModal/EducationModal';
import { NotificationCenterModal } from '../../components/Notifications/NotificationCenterModal';
import { UpgradeProModal } from '../../components/Subscription/UpgradeProModal';

type WatchFilterType = 'ALL' | 'TRIM' | 'STRONG_BUY' | 'BUY' | 'HOLD' | 'STRONG_SELL';

export const DashboardScreen: React.FC = () => {
  const { positions, getSummary } = usePortfolioStore();
  const { quotes, selectTicker, watchlist, addToWatchlist, removeFromWatchlist } = useMarketStore();
  const { setActiveTab } = useSettingsStore();
  const { getUnreadCount } = useNotificationStore();
  const { plan, getTrialDaysRemaining } = useSubscriptionStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [educationTerm, setEducationTerm] = useState<string | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const unreadCount = getUnreadCount();
  const trialDays = getTrialDaysRemaining();

  // Search state for Stocks to Watch
  const [searchExplorer, setSearchExplorer] = useState('');
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [onlineResults, setOnlineResults] = useState<Array<{ ticker: string; name: string; exchange: string }>>([]);
  const [loadingTicker, setLoadingTicker] = useState<string | null>(null);

  // Timing signal filter toggle for Stocks to Watch
  const [watchFilter, setWatchFilter] = useState<WatchFilterType>('ALL');

  const summary = getSummary(quotes);

  // Filtered watched stocks list
  const watchedQuotes: StockQuote[] = watchlist
    .map(ticker => quotes[ticker.toUpperCase()])
    .filter((q): q is StockQuote => Boolean(q));

  // Pre-calculate timing signals and counts for watched stocks
  const watchedWithSignals = watchedQuotes.map(stock => ({
    stock,
    signal: generateTimingSignal(stock)
  }));

  const counts = {
    ALL: watchedQuotes.length,
    TRIM: watchedWithSignals.filter(w => w.signal.action === 'TRIM').length,
    STRONG_BUY: watchedWithSignals.filter(w => w.signal.action === 'STRONG_BUY').length,
    BUY: watchedWithSignals.filter(w => w.signal.action === 'BUY').length,
    HOLD: watchedWithSignals.filter(w => w.signal.action === 'HOLD').length,
    STRONG_SELL: watchedWithSignals.filter(w => w.signal.action === 'STRONG_SELL').length,
  };

  const filterPills: Array<{
    id: WatchFilterType;
    label: string;
    count: number;
    activeColor: string;
    activeBg: string;
    activeBorder: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'ALL',
      label: 'All',
      count: counts.ALL,
      activeColor: 'text-white',
      activeBg: 'bg-navy-800',
      activeBorder: 'border-slate-500',
      icon: <Layers className="w-3 h-3" />
    },
    {
      id: 'TRIM',
      label: 'Trim Profit',
      count: counts.TRIM,
      activeColor: 'text-gold-300',
      activeBg: 'bg-gold-500/15',
      activeBorder: 'border-gold-500/50',
      icon: <ArrowDownCircle className="w-3 h-3 text-gold-400" />
    },
    {
      id: 'STRONG_BUY',
      label: 'Strong Buy',
      count: counts.STRONG_BUY,
      activeColor: 'text-growth-300',
      activeBg: 'bg-growth-500/15',
      activeBorder: 'border-growth-500/50',
      icon: <ChevronsUp className="w-3 h-3 text-growth-400" />
    },
    {
      id: 'BUY',
      label: 'Buy Window',
      count: counts.BUY,
      activeColor: 'text-growth-300',
      activeBg: 'bg-growth-500/15',
      activeBorder: 'border-growth-500/50',
      icon: <ArrowUpCircle className="w-3 h-3 text-growth-400" />
    },
    {
      id: 'HOLD',
      label: 'Hold / Wait',
      count: counts.HOLD,
      activeColor: 'text-slate-200',
      activeBg: 'bg-slate-700/30',
      activeBorder: 'border-slate-500/50',
      icon: <MinusCircle className="w-3 h-3 text-slate-400" />
    },
    {
      id: 'STRONG_SELL',
      label: 'High Risk / Sell',
      count: counts.STRONG_SELL,
      activeColor: 'text-loss-300',
      activeBg: 'bg-loss-500/15',
      activeBorder: 'border-loss-500/50',
      icon: <AlertTriangle className="w-3 h-3 text-loss-400" />
    },
  ];

  const filteredWatched = watchedWithSignals.filter(({ signal }) => {
    if (watchFilter === 'ALL') return true;
    return signal.action === watchFilter;
  }).map(w => w.stock);

  // Debounced live market search for Stocks to Watch
  useEffect(() => {
    const q = searchExplorer.trim();
    if (!q) {
      setOnlineResults([]);
      setIsSearchingOnline(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingOnline(true);
      try {
        const live = await stockService.searchLiveOnline(q);
        setOnlineResults(live);
      } catch (err) {
        console.warn('Dashboard live search error', err);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchExplorer]);

  const filteredLocalStocks = searchExplorer.trim()
    ? stockService.searchStocks(searchExplorer)
    : [];

  const deduplicatedOnline = onlineResults.filter(
    online => !filteredLocalStocks.some(loc => loc.ticker.toUpperCase() === online.ticker.toUpperCase())
  );

  const handleStockClick = (ticker: string) => {
    selectTicker(ticker);
    setActiveTab('stockDetail');
  };

  const handleAddOnlineToWatch = async (item: { ticker: string; name: string; exchange: string }) => {
    const clean = item.ticker.toUpperCase();
    if (!quotes[clean]) {
      setLoadingTicker(clean);
      try {
        await stockService.fetchAndIndexOnlineStock(item.ticker, item.name, item.exchange);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingTicker(null);
      }
    }
    addToWatchlist(clean);
    setSearchExplorer('');
    setOnlineResults([]);
  };

  const handleDirectWatchLookup = async (symbolToLookup: string) => {
    const clean = symbolToLookup.trim().toUpperCase();
    if (!clean) return;

    if (!quotes[clean]) {
      setLoadingTicker(clean);
      try {
        await stockService.fetchAndIndexOnlineStock(clean, clean, 'NYSE / NASDAQ');
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingTicker(null);
      }
    }
    addToWatchlist(clean);
    setSearchExplorer('');
    setOnlineResults([]);
  };

  return (
    <div className="flex-1 flex flex-col pb-24 space-y-4">
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Header with Universal Exchange Badge & Notifications / Pro Actions */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gold-400 uppercase tracking-wider font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span>Universal Exchange Tracker</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">Global Portfolio Hub</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Pro / Trial Badge Button */}
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-600/20 text-gold-300 border border-gold-500/40 text-[10px] font-bold hover:scale-105 transition"
              title="Membership Status"
            >
              <Crown className="w-3 h-3 fill-gold-400 text-gold-400" />
              <span>{plan === 'LIFETIME' ? 'PRO' : `${trialDays}d Trial`}</span>
            </button>

            {/* Notification Bell Button */}
            <button
              type="button"
              onClick={() => setIsNotificationCenterOpen(true)}
              className="relative p-1.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-300 hover:text-white hover:border-growth-500/50 transition"
              title="Alert Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-growth-500 text-navy-950 font-mono font-black text-[9px] flex items-center justify-center shadow">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <DataStatusBadge />
          </div>
        </div>

        {/* Global Market Status Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
          <span className="text-slate-500 shrink-0 font-sans text-[10px] uppercase font-bold">Markets:</span>
          <span className="px-2 py-0.5 rounded-md bg-navy-900 border border-navy-800 text-slate-300 flex items-center gap-1 shrink-0">
            <span>🇹🇼 TWSE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-navy-900 border border-navy-800 text-slate-300 flex items-center gap-1 shrink-0">
            <span>🇰🇷 KRX</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-navy-900 border border-navy-800 text-growth-400 flex items-center gap-1 shrink-0">
            <span>🇺🇸 US</span>
            <span className="w-1.5 h-1.5 rounded-full bg-growth-500 animate-pulse"></span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-navy-900 border border-navy-800 text-growth-400 flex items-center gap-1 shrink-0">
            <span>🇬🇧 LSE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-growth-500 animate-pulse"></span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-navy-900 border border-navy-800 text-slate-300 flex items-center gap-1 shrink-0">
            <span>🇳🇿 NZX</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-navy-900 border border-navy-800 text-slate-300 flex items-center gap-1 shrink-0">
            <span>🇯🇵 TSE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          </span>
        </div>

        {/* Portfolio Summary Card */}
        <PortfolioSummaryCard
          summary={summary}
          onOpenAddStock={() => setIsAddModalOpen(true)}
        />

        {/* 7-Day Performance Chart */}
        {summary.currentValue > 0 && (
          <PortfolioChart currentValue={summary.currentValue} />
        )}

        {/* Daily Bite-Sized Learning Tip Card */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 rounded-2xl p-4 relative overflow-hidden shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400 shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider font-mono">
                  Trading Insight
                </span>
                <button
                  onClick={() => setEducationTerm('RSI')}
                  className="text-[10px] text-slate-400 hover:text-white underline"
                >
                  Learn RSI
                </button>
              </div>
              <h4 className="text-xs font-bold text-white">
                Track Global Timing: Don't Chase Overextended Rallies
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Whether trading in Taipei, Seoul, London, or New York, buying when RSI &gt; 70 carries high pullback risk. Let healthy pullbacks come to you.
              </p>
            </div>
          </div>
        </div>

        {/* Your Holdings Section */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-growth-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Personal Holdings</h3>
            </div>
            {positions.length > 0 && (
              <span className="text-xs font-mono text-slate-400">
                {positions.length} active
              </span>
            )}
          </div>

          {positions.length === 0 ? (
            <div className="bg-navy-900/60 border border-navy-850 rounded-2xl p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-navy-800 text-slate-400 flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6 text-growth-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Your portfolio tracker is ready</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Log the stocks you own across any global exchange to receive real-time updates and timing advice.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-5 py-2.5 bg-growth-600 hover:bg-growth-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Your Stocks</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {positions.map(pos => {
                const quote = quotes[pos.ticker.toUpperCase()];
                if (!quote) return null;
                return (
                  <StockCard
                    key={pos.id}
                    stock={quote}
                    position={pos}
                    onClick={() => handleStockClick(pos.ticker)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Stocks to Watch Section (User Monitored Watchlist) */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Stocks to Watch
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {searchExplorer.trim() 
                ? `${filteredLocalStocks.length + deduplicatedOnline.length} results`
                : watchFilter !== 'ALL'
                  ? `${filteredWatched.length} of ${watchedQuotes.length} (${filterPills.find(p => p.id === watchFilter)?.label})`
                  : `${watchedQuotes.length} monitored`}
            </span>
          </div>

          {/* Search to find & add any stock to watch */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchExplorer}
              onChange={(e) => setSearchExplorer(e.target.value)}
              placeholder="Search any stock to monitor (e.g. SOFI, TSLA, NVDA)..."
              className="w-full bg-navy-950 border border-navy-750 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-growth-500 transition"
            />
            {isSearchingOnline && (
              <Loader2 className="w-4 h-4 text-growth-400 absolute right-3 top-3 animate-spin" />
            )}
            {!isSearchingOnline && searchExplorer.trim() && (
              <button
                type="button"
                onClick={() => setSearchExplorer('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Timing Signal Filter Toggle Pills (Visible when not searching) */}
          {watchedQuotes.length > 0 && searchExplorer.trim().length === 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
              {filterPills.map(pill => {
                const isSelected = watchFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setWatchFilter(pill.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? `${pill.activeBg} ${pill.activeBorder} ${pill.activeColor} shadow-sm font-bold ring-1 ring-white/10`
                        : 'bg-navy-900/80 border-navy-800 text-slate-400 hover:text-slate-200 hover:border-navy-700'
                    }`}
                  >
                    {pill.icon}
                    <span>{pill.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isSelected
                          ? 'bg-white/15 text-white'
                          : 'bg-navy-950 text-slate-400'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading feedback banner */}
          {loadingTicker && (
            <div className="p-3 rounded-xl bg-growth-950/40 border border-growth-600/40 flex items-center gap-2.5 text-xs text-growth-300 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-growth-400 shrink-0" />
              <span>
                Syncing real-time market quote for <strong>{loadingTicker}</strong>...
              </span>
            </div>
          )}

          {/* Search Mode Active */}
          {searchExplorer.trim().length > 0 ? (
            <div className="space-y-3">
              {/* Live Market Results */}
              {deduplicatedOnline.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-growth-400">
                    <Zap className="w-3 h-3" />
                    <span>Live Market Matches ({deduplicatedOnline.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {deduplicatedOnline.slice(0, 8).map(item => {
                      const isWatched = watchlist.includes(item.ticker.toUpperCase());
                      return (
                        <div
                          key={item.ticker}
                          className="p-3 rounded-2xl bg-navy-900/90 border border-navy-800 hover:border-growth-500/50 flex items-center justify-between transition shadow-sm"
                        >
                          <div 
                            onClick={() => handleStockClick(item.ticker)}
                            className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
                          >
                            <div className="w-9 h-9 rounded-xl bg-growth-500/10 border border-growth-500/30 flex items-center justify-center font-bold text-growth-300 font-mono text-xs shrink-0">
                              {item.ticker.slice(0, 4)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white font-mono group-hover:text-growth-400">{item.ticker}</h4>
                                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-navy-800 text-slate-300 font-mono border border-navy-700">
                                  {item.exchange}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate max-w-[170px] group-hover:text-slate-200">
                                {item.name}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 pl-2">
                            {isWatched ? (
                              <button
                                type="button"
                                onClick={() => removeFromWatchlist(item.ticker)}
                                className="px-2.5 py-1.5 rounded-xl bg-navy-800 hover:bg-loss-500/20 text-gold-400 hover:text-loss-400 border border-navy-700 text-xs font-semibold transition flex items-center gap-1"
                              >
                                <Star className="w-3 h-3 fill-gold-400" />
                                <span>Watching (Remove)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddOnlineToWatch(item)}
                                className="px-3 py-1.5 rounded-xl bg-growth-600 hover:bg-growth-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add to Watch</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Indexed Equities Results */}
              {filteredLocalStocks.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                    Indexed Equities
                  </span>
                  <div className="space-y-1.5">
                    {filteredLocalStocks.map(stk => {
                      const isWatched = watchlist.includes(stk.ticker.toUpperCase());
                      return (
                        <div
                          key={stk.ticker}
                          className="p-3 rounded-2xl bg-navy-900/90 border border-navy-800 hover:border-growth-500/50 flex items-center justify-between transition shadow-sm"
                        >
                          <div 
                            onClick={() => handleStockClick(stk.ticker)}
                            className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
                          >
                            <div className="w-9 h-9 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center font-bold text-slate-200 font-mono text-xs shrink-0">
                              {stk.ticker.slice(0, 4)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white font-mono group-hover:text-growth-400">{stk.ticker}</h4>
                                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-navy-800 text-slate-300 font-mono border border-navy-700">
                                  {stk.exchange}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate max-w-[170px] group-hover:text-slate-200">
                                {stk.name}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 pl-2 flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white">
                              ${stk.price.toFixed(2)}
                            </span>
                            {isWatched ? (
                              <button
                                type="button"
                                onClick={() => removeFromWatchlist(stk.ticker)}
                                className="px-2.5 py-1.5 rounded-xl bg-navy-800 hover:bg-loss-500/20 text-gold-400 hover:text-loss-400 border border-navy-700 text-xs font-semibold transition flex items-center gap-1"
                              >
                                <Star className="w-3 h-3 fill-gold-400" />
                                <span>Watching (Remove)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  addToWatchlist(stk.ticker);
                                  setSearchExplorer('');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-growth-600 hover:bg-growth-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add to Watch</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Instant Direct Ticker Fetch Button */}
              <button
                type="button"
                onClick={() => handleDirectWatchLookup(searchExplorer)}
                disabled={loadingTicker !== null}
                className="w-full p-3 rounded-2xl bg-growth-600/20 hover:bg-growth-600/30 border border-growth-500/40 text-growth-300 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Zap className="w-4 h-4 text-growth-400" />
                <span>⚡ Instant Add: Watch "{searchExplorer.trim().toUpperCase()}" directly from NYSE / NASDAQ</span>
              </button>

              {filteredLocalStocks.length === 0 && deduplicatedOnline.length === 0 && !isSearchingOnline && (
                <div className="p-4 bg-navy-900/60 border border-navy-850 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-slate-400">
                    No results for <strong className="text-white">"{searchExplorer}"</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDirectWatchLookup(searchExplorer)}
                    className="px-4 py-2 bg-growth-600 text-white rounded-xl text-xs font-bold hover:bg-growth-500 transition"
                  >
                    Fetch & Watch "{searchExplorer.toUpperCase()}" from NYSE / NASDAQ
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Normal User-Monitored Watchlist Cards */
            <div className="space-y-2.5">
              {watchedQuotes.length === 0 ? (
                <div className="p-6 bg-navy-900/50 border border-navy-850 rounded-2xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-navy-800 text-gold-400/60 flex items-center justify-center mx-auto">
                    <Star className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Your watch list is empty</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Type any ticker in the search bar above (e.g. SOFI, NVDA, AAPL) and tap <strong>"+ Add to Watch"</strong> to monitor its live price and timing signals here.
                  </p>
                </div>
              ) : filteredWatched.length === 0 ? (
                <div className="p-5 bg-navy-900/50 border border-navy-850 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-slate-400">
                    No watched stocks currently have a <strong className="text-white">"{filterPills.find(p => p.id === watchFilter)?.label}"</strong> signal.
                  </p>
                  <button
                    type="button"
                    onClick={() => setWatchFilter('ALL')}
                    className="px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-growth-400 text-xs font-semibold border border-navy-700 transition"
                  >
                    Show All Watched Stocks ({watchedQuotes.length})
                  </button>
                </div>
              ) : (
                filteredWatched.map(stk => (
                  <StockCard
                    key={stk.ticker}
                    stock={stk}
                    onClick={() => handleStockClick(stk.ticker)}
                    onRemove={() => removeFromWatchlist(stk.ticker)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddStockModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {educationTerm && (
        <EducationModal termOrId={educationTerm} onClose={() => setEducationTerm(null)} />
      )}

      {isNotificationCenterOpen && (
        <NotificationCenterModal onClose={() => setIsNotificationCenterOpen(false)} />
      )}

      {isUpgradeModalOpen && (
        <UpgradeProModal onClose={() => setIsUpgradeModalOpen(false)} />
      )}
    </div>
  );
};
