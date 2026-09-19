import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  Search, 
  TrendingUp, 
  Zap, 
  Plus, 
  Compass, 
  BookOpen,
  Briefcase
} from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useMarketStore } from '../../store/marketStore';
import { useSettingsStore } from '../../store/settingsStore';
import { PortfolioSummaryCard } from '../../components/Dashboard/PortfolioSummaryCard';
import { PortfolioChart } from '../../components/Dashboard/PortfolioChart';
import { StockCard } from '../../components/StockCard/StockCard';
import { DataStatusBadge } from '../../components/Common/DataStatusBadge';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';
import { AddStockModal } from '../AddStock/AddStockModal';
import { EducationModal } from '../../components/EducationModal/EducationModal';
import { generateTimingSignal } from '../../services/signalEngine';
import { SignalBadge } from '../../components/StockCard/SignalBadge';

export const DashboardScreen: React.FC = () => {
  const { positions, getSummary, loadStarterPracticePortfolio } = usePortfolioStore();
  const { quotes, selectTicker, selectedCategory, setSelectedCategory } = useMarketStore();
  const { setActiveTab } = useSettingsStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [educationTerm, setEducationTerm] = useState<string | null>(null);

  const summary = getSummary(quotes);
  const allQuotes = Object.values(quotes);

  // Filter stocks by category
  const categories = ['All', 'Technology', 'Index ETF', 'Financials', 'Healthcare', 'Watchlist'];
  const filteredQuotes = allQuotes.filter(q => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Watchlist') return true;
    return q.sector.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Calculate high-priority signals for owned stocks or market leaders
  const activeSignals = allQuotes
    .map(q => generateTimingSignal(q))
    .filter(s => s.action === 'STRONG_BUY' || s.action === 'BUY' || s.action === 'TRIM')
    .slice(0, 3);

  const handleStockClick = (ticker: string) => {
    selectTicker(ticker);
    setActiveTab('stockDetail');
  };

  return (
    <div className="flex-1 flex flex-col pb-24 space-y-4">
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Header with Live Badge */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] font-bold text-growth-400 uppercase tracking-wider font-mono">
              Investor Dashboard
            </span>
            <h2 className="text-xl font-extrabold text-white">Portfolio Overview</h2>
          </div>
          <DataStatusBadge />
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
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                  Today's Investor Lesson
                </span>
                <button
                  onClick={() => setEducationTerm('RSI')}
                  className="text-[10px] text-slate-400 hover:text-white underline"
                >
                  Read Guide
                </button>
              </div>
              <h4 className="text-xs font-bold text-white">
                Never Buy When RSI Exceeds 75 (The Rubber Band Rule)
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                When a stock goes vertical, emotional buyers chase the hype. Wait for a pullback to key moving average support before entering.
              </p>
            </div>
          </div>
        </div>

        {/* Urgent Timing Alerts Strip */}
        {activeSignals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-gold-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Timing Opportunities
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('signals')}
                className="text-xs text-growth-400 hover:text-growth-300 flex items-center gap-0.5 font-medium transition"
              >
                <span>View All ({activeSignals.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeSignals.map(sig => (
                <div
                  key={sig.ticker}
                  onClick={() => handleStockClick(sig.ticker)}
                  className="bg-navy-900/80 border border-navy-800 hover:border-navy-700 p-3 rounded-xl cursor-pointer transition flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center font-bold text-xs text-white font-mono">
                      {sig.ticker}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-mono">{sig.ticker}</span>
                        <span className="text-[10px] text-slate-400">${sig.currentPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{sig.title}</p>
                    </div>
                  </div>
                  <SignalBadge action={sig.action} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Holdings Section */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-growth-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Holdings</h3>
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
                <h4 className="text-sm font-bold text-white">Your portfolio is ready</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Log the shares you own or practice with sample positions to see intelligent timing alerts.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-growth-600 hover:bg-growth-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log First Stock</span>
                </button>
                <button
                  onClick={loadStarterPracticePortfolio}
                  className="px-4 py-2 bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>Load Sample $10k Portfolio</span>
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

        {/* Market Watchlist & Discovery Section */}
        <div className="space-y-2.5 pt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Market Discovery & Timing
            </h3>
            <span className="text-[11px] text-slate-400">Tap for technical analysis</span>
          </div>

          {/* Sector Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap transition font-medium ${
                  selectedCategory === cat
                    ? 'bg-navy-700 text-white border border-navy-600 shadow-sm'
                    : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-850'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stock Cards Grid */}
          <div className="space-y-2.5">
            {filteredQuotes.slice(0, 6).map(stk => (
              <StockCard
                key={stk.ticker}
                stock={stk}
                onClick={() => handleStockClick(stk.ticker)}
              />
            ))}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddStockModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {educationTerm && (
        <EducationModal termOrId={educationTerm} onClose={() => setEducationTerm(null)} />
      )}
    </div>
  );
};
