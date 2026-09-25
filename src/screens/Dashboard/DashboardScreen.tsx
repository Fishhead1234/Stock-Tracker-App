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
  Crown,
  BookOpen,
  MessageSquare
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
import { LanguageSelectorModal } from '../../components/Common/LanguageSelectorModal';
import { useLanguageStore } from '../../store/languageStore';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';

type WatchFilterType = 'ALL' | 'TRIM' | 'STRONG_BUY' | 'BUY' | 'HOLD' | 'STRONG_SELL';

export const DashboardScreen: React.FC = () => {
  const { positions, getSummary } = usePortfolioStore();
  const { quotes, selectTicker, watchlist, addToWatchlist, removeFromWatchlist } = useMarketStore();
  const { setActiveTab, themeMode } = useSettingsStore();
  const { getUnreadCount } = useNotificationStore();
  const { plan, getTrialDaysRemaining } = useSubscriptionStore();
  const { language, t } = useLanguageStore();

  const isLight = themeMode === 'neutral-light';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [educationTerm, setEducationTerm] = useState<string | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
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
      label: t('filter_all', 'All'),
      count: counts.ALL,
      activeColor: isLight ? 'text-white' : 'text-white',
      activeBg: isLight ? 'bg-[#007AFF]' : 'bg-navy-800',
      activeBorder: isLight ? 'border-[#007AFF]' : 'border-slate-500',
      icon: <Layers className="w-3.5 h-3.5" />
    },
    {
      id: 'TRIM',
      label: t('filter_trim', 'Trim Profit'),
      count: counts.TRIM,
      activeColor: isLight ? 'text-[#FF9500]' : 'text-gold-300',
      activeBg: isLight ? 'bg-[#FF9500]/15' : 'bg-gold-500/15',
      activeBorder: isLight ? 'border-[#FF9500]/40' : 'border-gold-500/50',
      icon: <ArrowDownCircle className={`w-3.5 h-3.5 ${isLight ? 'text-[#FF9500]' : 'text-gold-400'}`} />
    },
    {
      id: 'STRONG_BUY',
      label: t('filter_strong_buy', 'Strong Buy'),
      count: counts.STRONG_BUY,
      activeColor: isLight ? 'text-[#34C759]' : 'text-growth-300',
      activeBg: isLight ? 'bg-[#34C759]/15' : 'bg-growth-500/15',
      activeBorder: isLight ? 'border-[#34C759]/40' : 'border-growth-500/50',
      icon: <ChevronsUp className={`w-3.5 h-3.5 ${isLight ? 'text-[#34C759]' : 'text-growth-400'}`} />
    },
    {
      id: 'BUY',
      label: t('filter_buy', 'Buy Window'),
      count: counts.BUY,
      activeColor: isLight ? 'text-[#34C759]' : 'text-growth-300',
      activeBg: isLight ? 'bg-[#34C759]/15' : 'bg-growth-500/15',
      activeBorder: isLight ? 'border-[#34C759]/40' : 'border-growth-500/50',
      icon: <ArrowUpCircle className={`w-3.5 h-3.5 ${isLight ? 'text-[#34C759]' : 'text-growth-400'}`} />
    },
    {
      id: 'HOLD',
      label: t('filter_hold', 'Hold / Wait'),
      count: counts.HOLD,
      activeColor: isLight ? 'text-[#666666]' : 'text-slate-300',
      activeBg: isLight ? 'bg-[#E5E5EA]' : 'bg-slate-700/30',
      activeBorder: isLight ? 'border-[rgba(0,0,0,0.12)]' : 'border-slate-600/40',
      icon: <MinusCircle className={`w-3.5 h-3.5 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`} />
    },
    {
      id: 'STRONG_SELL',
      label: t('filter_strong_sell', 'High Risk / Sell'),
      count: counts.STRONG_SELL,
      activeColor: isLight ? 'text-[#FF3B30]' : 'text-loss-400',
      activeBg: isLight ? 'bg-[#FF3B30]/15' : 'bg-loss-600/15',
      activeBorder: isLight ? 'border-[#FF3B30]/40' : 'border-loss-600/40',
      icon: <AlertTriangle className={`w-3.5 h-3.5 ${isLight ? 'text-[#FF3B30]' : 'text-loss-400'}`} />
    }
  ];

  // Real-time online stock search debouncer
  useEffect(() => {
    const q = searchExplorer.trim();
    if (!q || q.length < 1) {
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
        console.warn('Online search error', err);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchExplorer]);

  const handleStockClick = (ticker: string) => {
    selectTicker(ticker);
    setActiveTab('stockDetail');
  };

  const handleAddOnlineToWatch = async (item: { ticker: string; name: string; exchange: string }) => {
    setLoadingTicker(item.ticker);
    try {
      await stockService.fetchAndIndexOnlineStock(item.ticker, item.name, item.exchange);
      addToWatchlist(item.ticker);
      setSearchExplorer('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTicker(null);
    }
  };

  const handleDirectWatchLookup = async (ticker: string) => {
    const clean = ticker.trim().toUpperCase();
    if (!clean) return;
    setLoadingTicker(clean);
    try {
      await stockService.fetchAndIndexOnlineStock(clean, clean, 'NYSE / NASDAQ');
      addToWatchlist(clean);
      setSearchExplorer('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTicker(null);
    }
  };

  // Local matching stocks
  const allKnownStocks = stockService.getAllStocks();
  const filteredLocalStocks = searchExplorer.trim()
    ? allKnownStocks.filter(s => 
        s.ticker.toUpperCase().includes(searchExplorer.trim().toUpperCase()) ||
        s.name.toUpperCase().includes(searchExplorer.trim().toUpperCase())
      ).slice(0, 6)
    : [];

  const deduplicatedOnline = onlineResults.filter(
    o => !filteredLocalStocks.some(l => l.ticker.toUpperCase() === o.ticker.toUpperCase())
  );

  const filteredWatched = watchedQuotes.filter(stock => {
    if (watchFilter === 'ALL') return true;
    const s = generateTimingSignal(stock);
    return s.action === watchFilter;
  });

  return (
    <div className={`flex-1 flex flex-col pb-28 space-y-4 transition-colors ${
      isLight ? 'bg-[#F2F2F7] text-[#000000]' : 'bg-[#070D1E] text-slate-100'
    }`}>
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Header with Universal Exchange Badge & Notifications / Pro Actions */}
        <div className="flex items-center justify-between pt-1 gap-2">
          <div className="min-w-0">
            <div className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider font-mono ${
              isLight ? 'text-[#FF9500]' : 'text-gold-400'
            }`}>
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t('header_universal_tracker', 'Universal Exchange Tracker')}</span>
            </div>
            <h2 className={`text-xl font-extrabold tracking-tight truncate ${isLight ? 'text-[#000000]' : 'text-white'}`}>
              {t('header_hub', 'Global Portfolio Hub')}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Language Switcher Button */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              data-touch-target="true"
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 cursor-pointer shadow-xs ${
                isLight 
                  ? 'bg-white border-[rgba(0,0,0,0.1)] text-[#000000] hover:bg-[#F2F2F7]' 
                  : 'bg-navy-900 border-navy-800 text-slate-200 hover:border-growth-500/50'
              }`}
              title={t('language_section_title', 'Select Language')}
            >
              <span className="text-sm">{currentLang.flag}</span>
              <span className="font-mono text-[10px] uppercase font-bold">{currentLang.code.split('-')[0]}</span>
            </button>

            {/* Pro / Trial Badge Button */}
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              data-touch-target="true"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-bold hover:scale-105 active:scale-95 transition cursor-pointer shadow-xs ${
                isLight
                  ? 'bg-[#FF9500]/15 text-[#FF9500] border-[#FF9500]/30'
                  : 'bg-gradient-to-r from-gold-500/20 to-gold-600/20 text-gold-300 border-gold-500/40'
              }`}
              title={t('membership_status', 'Membership Status')}
            >
              <Crown className={`w-3 h-3 fill-current ${isLight ? 'text-[#FF9500]' : 'text-gold-400'}`} />
              <span className="text-[11px]">{plan === 'LIFETIME' ? t('pro_member', 'PRO') : `${trialDays}${t('trial_days_remaining', 'd Trial')}`}</span>
            </button>

            {/* Notification Bell Button */}
            <button
              type="button"
              onClick={() => setIsNotificationCenterOpen(true)}
              data-touch-target="true"
              className={`relative flex items-center justify-center p-2 rounded-xl border transition active:scale-95 cursor-pointer shadow-xs ${
                isLight 
                  ? 'bg-white border-[rgba(0,0,0,0.1)] text-[#000000] hover:bg-[#F2F2F7]' 
                  : 'bg-navy-900 border-navy-800 text-slate-300 hover:text-white'
              }`}
              title={t('alerts_title', 'Alert Notifications')}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full font-mono font-black text-[9px] flex items-center justify-center shadow ${
                  isLight ? 'bg-[#34C759] text-white' : 'bg-growth-500 text-navy-950'
                }`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Global Market Status Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none w-full">
          <DataStatusBadge />
          <span className={`shrink-0 font-sans text-[11px] uppercase font-bold ml-1 ${isLight ? 'text-[#666666]' : 'text-slate-500'}`}>
            {t('badge_markets', 'Markets:')}
          </span>
          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 shrink-0 ${
            isLight ? 'bg-white border-[rgba(0,0,0,0.08)] text-[#000000]' : 'bg-navy-900 border-navy-800 text-slate-300'
          }`}>
            <span>🇹🇼 TWSE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          </span>
          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 shrink-0 ${
            isLight ? 'bg-white border-[rgba(0,0,0,0.08)] text-[#000000]' : 'bg-navy-900 border-navy-800 text-slate-300'
          }`}>
            <span>🇰🇷 KRX</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          </span>
          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 shrink-0 ${
            isLight ? 'bg-white border-[rgba(0,0,0,0.08)] text-[#34C759]' : 'bg-navy-900 border-navy-800 text-growth-400'
          }`}>
            <span>🇺🇸 US</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
          </span>
          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 shrink-0 ${
            isLight ? 'bg-white border-[rgba(0,0,0,0.08)] text-[#34C759]' : 'bg-navy-900 border-navy-800 text-growth-400'
          }`}>
            <span>🇬🇧 LSE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
          </span>
          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 shrink-0 ${
            isLight ? 'bg-white border-[rgba(0,0,0,0.08)] text-[#000000]' : 'bg-navy-900 border-navy-800 text-slate-300'
          }`}>
            <span>🇳🇿 NZX</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          </span>
          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 shrink-0 ${
            isLight ? 'bg-white border-[rgba(0,0,0,0.08)] text-[#000000]' : 'bg-navy-900 border-navy-800 text-slate-300'
          }`}>
            <span>🇯🇵 TSE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          </span>
        </div>

        {/* Wireframe 1: Segmented Control [📊 Portfolio] [📚 Learn] [💡 Tips] */}
        <div className={`p-1 rounded-xl flex items-center gap-1 border ${
          isLight ? 'bg-[#E5E5EA] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950 border-navy-800'
        }`}>
          <button
            type="button"
            data-touch-target="true"
            className={`flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              isLight ? 'bg-white text-[#007AFF] shadow-xs' : 'bg-navy-700 text-white shadow-xs'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </button>
          <button
            type="button"
            data-touch-target="true"
            onClick={() => setActiveTab('education')}
            className={`flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isLight ? 'text-[#666666] hover:text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learn</span>
          </button>
          <button
            type="button"
            data-touch-target="true"
            onClick={() => setEducationTerm('RSI')}
            className={`flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isLight ? 'text-[#666666] hover:text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Tips</span>
          </button>
        </div>

        {/* Portfolio Summary Card */}
        <PortfolioSummaryCard
          summary={summary}
          onOpenAddStock={() => setIsAddModalOpen(true)}
        />

        {/* 7-Day Performance & Sector Allocation Chart */}
        {summary.currentValue > 0 && (
          <PortfolioChart currentValue={summary.currentValue} />
        )}

        {/* Daily Bite-Sized Learning Tip Card */}
        <div className={`rounded-2xl p-4 relative overflow-hidden border transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]' 
            : 'bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border-gold-500/30 shadow-sm'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isLight ? 'bg-[#FF9500]/15 text-[#FF9500]' : 'bg-gold-500/20 text-gold-400'
            }`}>
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] uppercase font-bold tracking-wider font-mono ${
                  isLight ? 'text-[#FF9500]' : 'text-gold-400'
                }`}>
                  Trading Insight
                </span>
                <button
                  type="button"
                  data-touch-target="true"
                  onClick={() => setEducationTerm('RSI')}
                  className={`text-xs font-semibold underline cursor-pointer ${
                    isLight ? 'text-[#007AFF] hover:text-[#0062CC]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Learn RSI
                </button>
              </div>
              <h4 className={`text-sm font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                Track Global Timing: Don't Chase Overextended Rallies
              </h4>
              <p className={`text-[13px] leading-relaxed ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>
                Whether trading in Taipei, Seoul, London, or New York, buying when RSI &gt; 70 carries high pullback risk. Let healthy pullbacks come to you.
              </p>
            </div>
          </div>
        </div>

        {/* Your Holdings Section */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Briefcase className={`w-4 h-4 ${isLight ? 'text-[#34C759]' : 'text-growth-400'}`} />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                {t('personal_holdings_alerts', 'Your Personal Holdings')}
              </h3>
            </div>
            {positions.length > 0 && (
              <span className={`text-xs font-mono ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {positions.length} active
              </span>
            )}
          </div>

          {positions.length === 0 ? (
            <div className={`rounded-2xl p-6 text-center space-y-3 border ${
              isLight ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-card' : 'bg-navy-900/60 border-navy-850'
            }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                isLight ? 'bg-[#F2F2F7] text-[#007AFF]' : 'bg-navy-800 text-slate-400'
              }`}>
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                  {t('portfolio_ready', 'Your portfolio tracker is ready')}
                </h4>
                <p className={`text-[13px] mt-1 max-w-xs mx-auto ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                  {t('portfolio_ready_desc', 'Log the stocks you own across any global exchange to receive real-time updates and timing advice.')}
                </p>
              </div>
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  data-touch-target="true"
                  onClick={() => setIsAddModalOpen(true)}
                  className={`min-h-[48px] px-6 py-3 font-semibold text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    isLight 
                      ? 'bg-[#007AFF] hover:bg-[#0062CC] text-white' 
                      : 'bg-growth-600 hover:bg-growth-500 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('log_your_stocks', 'Log Your Stocks')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
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
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className={`w-4 h-4 fill-current ${isLight ? 'text-[#FF9500]' : 'text-gold-400'}`} />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                {t('stocks_to_watch_title', 'Stocks to Watch')}
              </h3>
            </div>
            <span className={`text-[13px] font-mono ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              {searchExplorer.trim() 
                ? `${filteredLocalStocks.length + deduplicatedOnline.length} results`
                : watchFilter !== 'ALL'
                  ? `${filteredWatched.length} of ${watchedQuotes.length}`
                  : `${watchedQuotes.length} ${t('monitored_stocks', 'monitored')}`}
            </span>
          </div>

          {/* Search to find & add any stock to watch */}
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
              isLight ? 'text-[#8E8E93]' : 'text-slate-500'
            }`} />
            <input
              type="text"
              value={searchExplorer}
              onChange={(e) => setSearchExplorer(e.target.value)}
              placeholder={t('search_placeholder', 'Search over 5,000+ global stocks (e.g. AAPL, 2330.TW, 005930.KS)...')}
              className={`w-full h-[48px] rounded-xl pl-10 pr-10 text-xs transition border focus:outline-none ${
                isLight 
                  ? 'bg-white border-[rgba(0,0,0,0.12)] text-[#000000] placeholder-[#8E8E93] focus:border-[#007AFF] shadow-xs' 
                  : 'bg-navy-950 border-navy-750 text-white placeholder-slate-500 focus:border-growth-500'
              }`}
            />
            {isSearchingOnline && (
              <Loader2 className={`w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin ${
                isLight ? 'text-[#007AFF]' : 'text-growth-400'
              }`} />
            )}
            {!isSearchingOnline && searchExplorer.trim() && (
              <button
                type="button"
                data-touch-target="true"
                onClick={() => setSearchExplorer('')}
                className={`w-10 h-10 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-xs cursor-pointer ${
                  isLight ? 'text-[#8E8E93] hover:text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                ✕
              </button>
            )}
          </div>

          {/* Timing Signal Filter Toggle Pills (Visible when not searching) */}
          {watchedQuotes.length > 0 && searchExplorer.trim().length === 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
              {filterPills.map(pill => {
                const isSelected = watchFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setWatchFilter(pill.id)}
                    data-touch-target="true"
                    className={`shrink-0 min-h-[48px] flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? `${pill.activeBg} ${pill.activeBorder} ${pill.activeColor} shadow-sm font-bold ring-1 ring-black/5`
                        : isLight 
                          ? 'bg-white border-[rgba(0,0,0,0.1)] text-[#666666] hover:bg-[#F2F2F7]' 
                          : 'bg-navy-900/80 border-navy-800 text-slate-400 hover:text-slate-200 hover:border-navy-700'
                    }`}
                  >
                    {pill.icon}
                    <span>{pill.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isSelected
                          ? isLight ? 'bg-black/10 text-current' : 'bg-white/15 text-white'
                          : isLight ? 'bg-[#F2F2F7] text-[#666666]' : 'bg-navy-950 text-slate-400'
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
            <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs animate-pulse border ${
              isLight 
                ? 'bg-[#007AFF]/10 border-[#007AFF]/30 text-[#007AFF]' 
                : 'bg-growth-950/40 border-growth-600/40 text-growth-300'
            }`}>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
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
                  <div className={`flex items-center gap-1 text-[11px] font-mono uppercase font-bold ${
                    isLight ? 'text-[#007AFF]' : 'text-growth-400'
                  }`}>
                    <Zap className="w-3.5 h-3.5" />
                    <span>{t('live_matches', 'Live Market Matches')} ({deduplicatedOnline.length})</span>
                  </div>
                  <div className="space-y-2">
                    {deduplicatedOnline.slice(0, 8).map(item => {
                      const isWatched = watchlist.includes(item.ticker.toUpperCase());
                      return (
                        <div
                          key={item.ticker}
                          className={`p-3.5 rounded-2xl flex items-center justify-between transition border shadow-xs ${
                            isLight 
                              ? 'bg-white border-[rgba(0,0,0,0.1)] hover:border-[#007AFF]/40' 
                              : 'bg-navy-900/90 border-navy-800 hover:border-growth-500/50'
                          }`}
                        >
                          <div 
                            onClick={() => handleStockClick(item.ticker)}
                            className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-xs shrink-0 border ${
                              isLight 
                                ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)] text-[#007AFF]' 
                                : 'bg-growth-500/10 border-growth-500/30 text-growth-300'
                            }`}>
                              {item.ticker.slice(0, 4)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className={`text-sm font-bold font-mono ${
                                  isLight ? 'text-[#000000] group-hover:text-[#007AFF]' : 'text-white group-hover:text-growth-400'
                                }`}>
                                  {item.ticker}
                                </h4>
                                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono border ${
                                  isLight ? 'bg-[#F2F2F7] text-[#666666] border-[rgba(0,0,0,0.08)]' : 'bg-navy-800 text-slate-300 border-navy-700'
                                }`}>
                                  {item.exchange}
                                </span>
                              </div>
                              <p className={`text-[13px] truncate max-w-[170px] ${
                                isLight ? 'text-[#666666]' : 'text-slate-400'
                              }`}>
                                {item.name}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 pl-2">
                            {isWatched ? (
                              <button
                                type="button"
                                data-touch-target="true"
                                onClick={() => removeFromWatchlist(item.ticker)}
                                className={`min-h-[44px] px-3 py-2 rounded-lg border text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                                  isLight 
                                    ? 'bg-[#F2F2F7] hover:bg-[#FF3B30]/10 text-[#FF9500] hover:text-[#FF3B30] border-[rgba(0,0,0,0.08)]' 
                                    : 'bg-navy-800 hover:bg-loss-500/20 text-gold-400 hover:text-loss-400 border-navy-700'
                                }`}
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>Watching</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                data-touch-target="true"
                                onClick={() => handleAddOnlineToWatch(item)}
                                className={`min-h-[48px] px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
                                  isLight 
                                    ? 'bg-[#007AFF] hover:bg-[#0062CC] text-white' 
                                    : 'bg-growth-600 hover:bg-growth-500 text-white'
                                }`}
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>{t('add_to_watch', 'Add to Watch')}</span>
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
                  <span className={`text-[11px] font-mono uppercase font-bold ${
                    isLight ? 'text-[#666666]' : 'text-slate-400'
                  }`}>
                    {t('indexed_equities', 'Indexed Equities')}
                  </span>
                  <div className="space-y-2">
                    {filteredLocalStocks.map(stk => {
                      const isWatched = watchlist.includes(stk.ticker.toUpperCase());
                      return (
                        <div
                          key={stk.ticker}
                          className={`p-3.5 rounded-2xl flex items-center justify-between transition border shadow-xs ${
                            isLight 
                              ? 'bg-white border-[rgba(0,0,0,0.1)] hover:border-[#007AFF]/40' 
                              : 'bg-navy-900/90 border-navy-800 hover:border-growth-500/50'
                          }`}
                        >
                          <div 
                            onClick={() => handleStockClick(stk.ticker)}
                            className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-xs shrink-0 border ${
                              isLight 
                                ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)] text-black' 
                                : 'bg-navy-800 border-navy-700 text-slate-200'
                            }`}>
                              {stk.ticker.slice(0, 4)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className={`text-sm font-bold font-mono ${
                                  isLight ? 'text-[#000000] group-hover:text-[#007AFF]' : 'text-white group-hover:text-growth-400'
                                }`}>
                                  {stk.ticker}
                                </h4>
                                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-mono border ${
                                  isLight ? 'bg-[#F2F2F7] text-[#666666] border-[rgba(0,0,0,0.08)]' : 'bg-navy-800 text-slate-300 border-navy-700'
                                }`}>
                                  {stk.exchange}
                                </span>
                              </div>
                              <p className={`text-[13px] truncate max-w-[170px] ${
                                isLight ? 'text-[#666666]' : 'text-slate-400'
                              }`}>
                                {stk.name}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 pl-2 flex items-center gap-2">
                            <span className={`text-sm font-mono font-bold ${
                              isLight ? 'text-[#000000]' : 'text-white'
                            }`}>
                              ${stk.price.toFixed(2)}
                            </span>
                            {isWatched ? (
                              <button
                                type="button"
                                data-touch-target="true"
                                onClick={() => removeFromWatchlist(stk.ticker)}
                                className={`min-h-[44px] px-3 py-2 rounded-lg border text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                                  isLight 
                                    ? 'bg-[#F2F2F7] hover:bg-[#FF3B30]/10 text-[#FF9500] hover:text-[#FF3B30] border-[rgba(0,0,0,0.08)]' 
                                    : 'bg-navy-800 hover:bg-loss-500/20 text-gold-400 hover:text-loss-400 border-navy-700'
                                }`}
                              >
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>Watching</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                data-touch-target="true"
                                onClick={() => {
                                  addToWatchlist(stk.ticker);
                                  setSearchExplorer('');
                                }}
                                className={`min-h-[48px] px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
                                  isLight 
                                    ? 'bg-[#007AFF] hover:bg-[#0062CC] text-white' 
                                    : 'bg-growth-600 hover:bg-growth-500 text-white'
                                }`}
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>{t('add_to_watch', 'Add to Watch')}</span>
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
                data-touch-target="true"
                className={`w-full min-h-[48px] p-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer ${
                  isLight 
                    ? 'bg-[#007AFF]/10 hover:bg-[#007AFF]/15 border-[#007AFF]/30 text-[#007AFF]' 
                    : 'bg-growth-600/20 hover:bg-growth-600/30 border-growth-500/40 text-growth-300'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>⚡ Instant Add: Watch "{searchExplorer.trim().toUpperCase()}" directly from Global Markets</span>
              </button>
            </div>
          ) : (
            /* Normal User-Monitored Watchlist Cards */
            <div className="space-y-3">
              {watchedQuotes.length === 0 ? (
                <div className={`p-6 rounded-2xl text-center space-y-2 border ${
                  isLight ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-card' : 'bg-navy-900/50 border-navy-850'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto ${
                    isLight ? 'bg-[#FF9500]/15 text-[#FF9500]' : 'bg-navy-800 text-gold-400/60'
                  }`}>
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <h4 className={`text-sm font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                    {t('watch_empty_title', 'Your watch list is empty')}
                  </h4>
                  <p className={`text-[13px] max-w-xs mx-auto ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                    {t('watch_empty_desc', 'Type any ticker in the search bar above and tap "+ Add to Watch" to monitor its live price and timing signals.')}
                  </p>
                </div>
              ) : filteredWatched.length === 0 ? (
                <div className={`p-5 rounded-2xl text-center space-y-2 border ${
                  isLight ? 'bg-white border-[rgba(0,0,0,0.1)]' : 'bg-navy-900/50 border-navy-850'
                }`}>
                  <p className={`text-[13px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                    {t('no_filter_match', 'No watched stocks currently have a')} <strong className={isLight ? 'text-black' : 'text-white'}>"{filterPills.find(p => p.id === watchFilter)?.label}"</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setWatchFilter('ALL')}
                    data-touch-target="true"
                    className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      isLight 
                        ? 'bg-[#F2F2F7] text-[#007AFF] border-[rgba(0,0,0,0.1)]' 
                        : 'bg-navy-800 hover:bg-navy-700 text-growth-400 border-navy-700'
                    }`}
                  >
                    {t('show_all_watched', 'Show All Watched Stocks')} ({watchedQuotes.length})
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

      {/* Wireframe 1: Thumb Reach Actions (Bottom 40% of Screen) */}
      <div className={`sticky bottom-14 left-0 right-0 p-3 mx-4 rounded-2xl border backdrop-blur-md z-30 shadow-lg flex items-center justify-between gap-2.5 transition-colors ${
        isLight 
          ? 'bg-white/95 border-[rgba(0,0,0,0.12)]' 
          : 'bg-navy-950/95 border-navy-800'
      }`}>
        <button
          type="button"
          data-touch-target="true"
          onClick={() => {
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className={`flex-1 min-h-[48px] px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
            isLight 
              ? 'bg-[#F2F2F7] hover:bg-[#E8E8ED] text-[#000000] border-[rgba(0,0,0,0.08)]' 
              : 'bg-navy-900 hover:bg-navy-800 text-slate-200 border-navy-750'
          }`}
        >
          <Search className="w-4 h-4 text-[#007AFF]" />
          <span>Search 5k+</span>
        </button>

        <button
          type="button"
          data-touch-target="true"
          onClick={() => setIsAddModalOpen(true)}
          className={`flex-1 min-h-[48px] px-4 py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm ${
            isLight 
              ? 'bg-[#007AFF] hover:bg-[#0062CC]' 
              : 'bg-growth-600 hover:bg-growth-500'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Log Stock</span>
        </button>

        <button
          type="button"
          data-touch-target="true"
          onClick={() => setEducationTerm('TIMING_BASICS')}
          className={`flex-1 min-h-[48px] px-3 py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm ${
            isLight 
              ? 'bg-[#34C759] hover:bg-[#2EB84E]' 
              : 'bg-gold-600 hover:bg-gold-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask Tutor</span>
        </button>
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

      {isLanguageModalOpen && (
        <LanguageSelectorModal onClose={() => setIsLanguageModalOpen(false)} />
      )}
    </div>
  );
};
