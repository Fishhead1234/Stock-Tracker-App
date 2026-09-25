import React, { useState } from 'react';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Building2, 
  Clock, 
  ShieldAlert, 
  Compass, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { newsService } from '../../services/newsService';
import { NewsArticle, NewsCategory } from '../../types/news';
import { useMarketStore } from '../../store/marketStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useSettingsStore } from '../../store/settingsStore';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';
import { AITutorModal } from '../../components/AI/AITutorModal';

export const NewsScreen: React.FC = () => {
  const { quotes, selectTicker, watchlist } = useMarketStore();
  const { positions } = usePortfolioStore();
  const { setActiveTab } = useSettingsStore();

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'MY_STOCKS' | 'EARNINGS' | 'MACRO' | 'TECH' | 'REGULATION'>('ALL');
  const [showPrimarySourcesGuide, setShowPrimarySourcesGuide] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

  const portfolioTickers = positions.map(p => p.ticker.toUpperCase());
  const userTrackedTickers = Array.from(new Set([...portfolioTickers, ...watchlist.map(t => t.toUpperCase())]));

  const pulse = newsService.getMarketPulse();
  const articles = newsService.getArticlesByFilter(activeCategory, userTrackedTickers);

  const handleSelectTicker = (ticker: string) => {
    selectTicker(ticker);
    setActiveTab('stockDetail');
  };

  const getSentimentBadge = (sentiment: NewsArticle['sentiment']) => {
    if (sentiment === 'BULLISH') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-growth-500/15 text-growth-400 border border-growth-500/30">
          <TrendingUp className="w-3 h-3" /> Bullish Catalyst
        </span>
      );
    }
    if (sentiment === 'BEARISH') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger-500/15 text-danger-400 border border-danger-500/30">
          <TrendingDown className="w-3 h-3" /> Bearish Headwind
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
        Neutral / Developing
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col pb-24 space-y-4">
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Top Header */}
        <div className="pt-1">
          <span className="text-[11px] font-bold text-[#34C759] uppercase tracking-wider font-mono">
            Market Intelligence
          </span>
          <h2 className="text-xl font-extrabold text-[#000000] dark:text-white tracking-tight">
            Market News & Info Hub
          </h2>
          <p className="text-[13px] text-[#666666] dark:text-slate-400 mt-0.5 leading-[1.6]">
            Executive summaries with educational takeaways on how headlines move stock prices.
          </p>
        </div>

        {/* Daily Market Pulse Briefing */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-navy-900 dark:via-navy-900 dark:to-navy-850 border border-black/10 dark:border-navy-800 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#34C759]/15 border border-[#34C759]/30 flex items-center justify-center text-[#34C759]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#8E8E93] dark:text-slate-400 uppercase tracking-wider block">
                  Today's Market Pulse
                </span>
                <span className="text-sm font-bold text-[#000000] dark:text-white">{pulse.sentiment}</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#34C759] bg-[#F2F2F7] dark:bg-navy-950 px-2.5 py-1 rounded-lg border border-black/5 dark:border-navy-800">
              {pulse.sentimentScore} / 100
            </span>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-black/10 dark:border-navy-800/80 text-[13px] text-[#666666] dark:text-slate-300">
            <div className="flex items-center gap-1.5 text-[#666666] dark:text-slate-400">
              <span className="font-semibold text-[#000000] dark:text-slate-300">🏛️ Fed Watch:</span>
              <span>{pulse.fedWatchStatus}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {pulse.keyThemes.map((theme, i) => (
                <span key={i} className="bg-[#F2F2F7] dark:bg-navy-950/80 text-[#666666] dark:text-slate-300 border border-black/5 dark:border-navy-800 px-2 py-0.5 rounded-lg text-xs font-medium">
                  • {theme}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gemini AI Market Tutor Banner */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-purple-950/50 dark:via-navy-900 dark:to-navy-950 border border-[#007AFF]/20 dark:border-purple-500/30 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 border border-[#007AFF]/30 flex items-center justify-center text-[#007AFF] shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-[14px] font-bold text-[#000000] dark:text-white">Ask Gemini Market Tutor</h4>
                <span className="text-[10px] bg-[#007AFF]/10 text-[#007AFF] px-1.5 py-0.2 rounded font-mono font-bold">2.5 Flash</span>
              </div>
              <p className="text-xs text-[#666666] dark:text-slate-400 leading-[1.5]">Ask about inflation, Fed rate moves, or why stocks are reacting</p>
            </div>
          </div>
          <button
            onClick={() => {
              setAiInitialPrompt('Can you explain what today\'s macro headlines and Fed monetary policy signals mean for beginner stock investors?');
              setIsAiModalOpen(true);
            }}
            className="shrink-0 min-h-[44px] px-4 py-2 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            Ask AI
          </button>
        </div>

        {/* Educational Mini-Guide: Where Smart Money Gets Info */}
        <div className="bg-white dark:bg-navy-900/70 border border-black/10 dark:border-navy-800/90 rounded-2xl overflow-hidden transition-all shadow-xs">
          <button
            onClick={() => setShowPrimarySourcesGuide(!showPrimarySourcesGuide)}
            className="w-full min-h-[48px] p-4 flex items-center justify-between text-left hover:bg-black/5 dark:hover:bg-navy-800/40 transition"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-[#FF9500] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#000000] dark:text-white">Where Does Real Market Info Come From?</h4>
                <p className="text-[11px] text-[#666666] dark:text-slate-400">Learn why news outlets are secondary to primary sources</p>
              </div>
            </div>
            {showPrimarySourcesGuide ? (
              <ChevronUp className="w-4 h-4 text-[#8E8E93]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8E8E93]" />
            )}
          </button>

          {showPrimarySourcesGuide && (
            <div className="p-4 pt-1 border-t border-black/10 dark:border-navy-800/60 space-y-3 text-xs text-[#666666] dark:text-slate-300 bg-[#F2F2F7]/50 dark:bg-navy-950/40">
              <div className="space-y-2">
                <div className="bg-white dark:bg-navy-900/80 p-3 rounded-xl border border-black/5 dark:border-navy-800">
                  <span className="font-bold text-[#FF9500] text-xs block mb-0.5">1. SEC EDGAR (Official Legal Filings)</span>
                  <p className="text-xs text-[#666666] dark:text-slate-400 leading-relaxed">
                    U.S. public companies are legally required to report to the SEC. Form <span className="font-mono font-semibold text-[#000000] dark:text-slate-200">10-Q</span> (quarterly earnings), <span className="font-mono font-semibold text-[#000000] dark:text-slate-200">10-K</span> (annual reports), and <span className="font-mono font-semibold text-[#000000] dark:text-slate-200">8-K</span> (breaking material events) are free, public, and released at the exact same second to everyone.
                  </p>
                </div>

                <div className="bg-white dark:bg-navy-900/80 p-3 rounded-xl border border-black/5 dark:border-navy-800">
                  <span className="font-bold text-[#007AFF] text-xs block mb-0.5">2. Central Banks & Government Agencies</span>
                  <p className="text-xs text-[#666666] dark:text-slate-400 leading-relaxed">
                    Inflation (CPI) and employment data come directly from the Bureau of Labor Statistics (BLS). Interest rates and policy statements are published on the Federal Reserve’s official portal (<span className="font-mono font-semibold text-[#000000] dark:text-slate-200">federalreserve.gov</span>).
                  </p>
                </div>

                <div className="bg-white dark:bg-navy-900/80 p-3 rounded-xl border border-black/5 dark:border-navy-800">
                  <span className="font-bold text-[#34C759] text-xs block mb-0.5">3. News Outlets vs Primary Sources</span>
                  <p className="text-xs text-[#666666] dark:text-slate-400 leading-relaxed">
                    By the time an article appears on financial news websites, algorithms have already traded on the SEC filing. Successful investors focus on fundamental numbers (revenue growth, margins, cash flow) rather than emotional headlines.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'ALL', label: `All News (${newsService.getAllArticles().length})` },
            { id: 'MY_STOCKS', label: `My Stocks (${userTrackedTickers.length})` },
            { id: 'EARNINGS', label: 'Earnings & Revenue' },
            { id: 'MACRO', label: 'Fed & Economy' },
            { id: 'TECH', label: 'Tech & AI' },
            { id: 'REGULATION', label: 'Legal & Policy' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveCategory(f.id as any)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeCategory === f.id
                  ? 'bg-[#007AFF] text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-navy-950 text-[#666666] dark:text-slate-400 hover:text-black dark:hover:text-white border border-black/10 dark:border-navy-850'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Articles Feed */}
        {articles.length === 0 ? (
          <div className="bg-white dark:bg-navy-900/50 border border-black/10 dark:border-navy-850 rounded-2xl p-6 text-center text-[#666666] dark:text-slate-400 space-y-2 shadow-xs">
            <Compass className="w-8 h-8 mx-auto text-[#8E8E93]" />
            <h4 className="text-base font-bold text-[#000000] dark:text-white">No News For Tracked Stocks</h4>
            <p className="text-[13px] text-[#666666] dark:text-slate-400 max-w-xs mx-auto leading-[1.6]">
              {activeCategory === 'MY_STOCKS'
                ? "None of the stocks currently in your Portfolio or Watchlist have active breaking news today. Check 'All News' to see broader market stories!"
                : "No articles found in this category."}
            </p>
            {activeCategory === 'MY_STOCKS' && (
              <button
                onClick={() => setActiveCategory('ALL')}
                className="mt-2 min-h-[44px] px-4 py-2 bg-[#007AFF] text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                View All Market News
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {articles.map(article => {
              const liveStock = article.ticker ? quotes[article.ticker.toUpperCase()] : null;
              const isPositive = liveStock ? liveStock.change >= 0 : true;

              return (
                <div
                  key={article.id}
                  className="bg-white dark:bg-navy-900/90 border border-black/10 dark:border-navy-800/90 rounded-2xl p-4 shadow-xs space-y-3 hover:border-[#007AFF]/30 transition"
                >
                  {/* Card Header: Ticker chip + Badges */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    {article.ticker ? (
                      <button
                        onClick={() => handleSelectTicker(article.ticker!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F2F2F7] dark:bg-navy-950 hover:bg-[#E8E8ED] dark:hover:bg-navy-800 border border-black/5 dark:border-navy-800 text-left transition group min-h-[36px]"
                      >
                        <span className="font-mono font-bold text-xs text-[#000000] dark:text-white group-hover:text-[#007AFF] transition">
                          ${article.ticker}
                        </span>
                        {liveStock && (
                          <span className={`text-[11px] font-mono font-medium ${isPositive ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                            ${liveStock.price.toFixed(2)} ({isPositive ? '+' : ''}{liveStock.changePercent.toFixed(1)}%)
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-[#8E8E93] group-hover:translate-x-0.5 transition" />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-[#666666] dark:text-slate-300 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#8E8E93]" />
                        {article.companyName || 'Market Wide'}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      {article.impact === 'HIGH' && (
                        <span className="text-[10px] font-bold text-[#FF9500] flex items-center gap-0.5 bg-[#FF9500]/10 px-2 py-0.5 rounded border border-[#FF9500]/20">
                          <Flame className="w-2.5 h-2.5" /> High Impact
                        </span>
                      )}
                      {getSentimentBadge(article.sentiment)}
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className="text-base font-bold text-[#000000] dark:text-white leading-snug tracking-tight">
                    {article.headline}
                  </h3>

                  {/* Concise Summary */}
                  <p className="text-[13px] text-[#666666] dark:text-slate-300 leading-[1.6]">
                    {article.summary}
                  </p>

                  {/* Educational Takeaway Card: Why this moves the stock */}
                  <div className="bg-[#F2F2F7] dark:bg-navy-950/90 border border-black/5 dark:border-navy-800 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF9500] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Buyer's Educational Takeaway</span>
                    </div>
                    <p className="text-xs text-[#666666] dark:text-slate-300 leading-relaxed">
                      {article.educationalTakeaway}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between text-xs text-[#8E8E93] dark:text-slate-400 pt-1 border-t border-black/10 dark:border-navy-800/60 font-mono">
                    <span className="truncate max-w-[200px]">{article.source}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {article.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isAiModalOpen && (
        <AITutorModal
          stock={null}
          initialPrompt={aiInitialPrompt}
          onClose={() => {
            setIsAiModalOpen(false);
            setAiInitialPrompt(undefined);
          }}
        />
      )}
    </div>
  );
};
