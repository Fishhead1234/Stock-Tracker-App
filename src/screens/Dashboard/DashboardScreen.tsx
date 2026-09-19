import React, { useState } from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  Zap, 
  Plus, 
  Globe, 
  Compass, 
  Briefcase,
  Layers
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
  const { positions, getSummary } = usePortfolioStore();
  const { quotes, selectTicker, selectedCountry, setSelectedCountry } = useMarketStore();
  const { setActiveTab } = useSettingsStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [educationTerm, setEducationTerm] = useState<string | null>(null);

  const summary = getSummary(quotes);
  const allQuotes = Object.values(quotes);

  // Region filters
  const regionFilters: { id: string; label: string; flag: string }[] = [
    { id: 'ALL', label: 'All Global', flag: '🌐' },
    { id: 'TW', label: 'Taiwan (TWSE)', flag: '🇹🇼' },
    { id: 'KR', label: 'Korea (KRX)', flag: '🇰🇷' },
    { id: 'US', label: 'United States', flag: '🇺🇸' },
    { id: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
    { id: 'NZ', label: 'New Zealand', flag: '🇳🇿' },
    { id: 'AU', label: 'Australia', flag: '🇦🇺' },
    { id: 'JP', label: 'Japan (TSE)', flag: '🇯🇵' }
  ];

  const filteredQuotes = allQuotes.filter(q => {
    if (selectedCountry === 'ALL') return true;
    return q.countryCode === selectedCountry;
  });

  const activeSignals = allQuotes
    .map(q => generateTimingSignal(q))
    .filter(s => s.action === 'STRONG_BUY' || s.action === 'BUY' || s.action === 'TRIM')
    .slice(0, 4);

  const handleStockClick = (ticker: string) => {
    selectTicker(ticker);
    setActiveTab('stockDetail');
  };

  return (
    <div className="flex-1 flex flex-col pb-24 space-y-4">
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Header with Universal Exchange Badge */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gold-400 uppercase tracking-wider font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span>Universal Exchange Tracker</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">Global Portfolio Hub</h2>
          </div>
          <DataStatusBadge />
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

        {/* Urgent Timing Alerts Strip */}
        {activeSignals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-gold-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Global Timing Signals
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
                      {sig.ticker.slice(0, 4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-mono">{sig.ticker}</span>
                        <span className="text-[10px] text-slate-400">${sig.currentPrice.toFixed(0)}</span>
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

        {/* Universal Market Discovery Section */}
        <div className="space-y-2.5 pt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Universal Market Explorer
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {filteredQuotes.length} equities
            </span>
          </div>

          {/* Country / Exchange Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {regionFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedCountry(filter.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition font-medium flex items-center gap-1.5 ${
                  selectedCountry === filter.id
                    ? 'bg-navy-700 text-white border border-navy-600 shadow-sm'
                    : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-850'
                }`}
              >
                <span>{filter.flag}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Stock Cards Grid */}
          <div className="space-y-2.5">
            {filteredQuotes.map(stk => (
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
