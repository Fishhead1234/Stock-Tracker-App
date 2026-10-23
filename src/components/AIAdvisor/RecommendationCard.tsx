import React, { useState } from 'react';
import { StockRecommendationCard } from '../../types/advisor';
import { useMarketStore } from '../../store/marketStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Plus, Check, ChevronRight, Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  card: StockRecommendationCard;
}

export const RecommendationCard: React.FC<Props> = ({ card }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist, selectTicker } = useMarketStore();
  const { setActiveTab, themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';
  const [justAdded, setJustAdded] = useState(false);

  const isInWatchlist = watchlist.includes(card.ticker.toUpperCase());

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(card.ticker);
      setJustAdded(false);
    } else {
      addToWatchlist(card.ticker);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleViewDetail = () => {
    selectTicker(card.ticker);
    setActiveTab('stockDetail');
  };

  const isFoundation = card.matchTier === 'FOUNDATION';
  const isGrowth = card.matchTier === 'GROWTH';

  return (
    <div className={`my-3 rounded-2xl border overflow-hidden transition-all ${
      isLight 
        ? 'bg-white border-[rgba(0,0,0,0.12)] shadow-sm hover:border-[#007AFF]/50' 
        : 'bg-[#0F1E46]/80 border-white/10 shadow-lg hover:border-emerald-500/40'
    }`}>
      {/* Card Header */}
      <div className={`p-3.5 border-b flex items-center justify-between ${
        isLight 
          ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' 
          : 'bg-gradient-to-r from-navy-900/90 to-blue-950/70 border-white/5'
      }`}>
        <div className="flex items-center gap-2">
          {isFoundation ? (
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          ) : isGrowth ? (
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-base tracking-wide font-mono ${isLight ? 'text-black' : 'text-white'}`}>{card.ticker}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${
                isLight 
                  ? 'bg-[#34C759]/15 text-[#248A3D] border-[#34C759]/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {card.matchScore}% Match
              </span>
            </div>
            <p className={`text-[11px] truncate max-w-[180px] ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>{card.name}</p>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-sm font-bold font-mono ${isLight ? 'text-black' : 'text-white'}`}>
            {card.currencySymbol}{card.currentPrice.toFixed(2)}
          </div>
          <div className={`text-[10px] font-bold ${
            card.changePercent >= 0 
              ? isLight ? 'text-[#248A3D]' : 'text-emerald-400' 
              : isLight ? 'text-[#D70015]' : 'text-red-400'
          }`}>
            {card.changePercent >= 0 ? '+' : ''}{card.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Why This Fits You Callout */}
      <div className="p-3.5 space-y-3">
        <div className={`p-2.5 rounded-xl border space-y-1 ${
          isLight 
            ? 'bg-blue-50/70 border-blue-200/80 text-blue-950' 
            : 'bg-blue-950/40 border-blue-500/20 text-slate-200'
        }`}>
          <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
            isLight ? 'text-amber-700' : 'text-amber-400'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why This Fits You</span>
          </div>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-[#1C1C1E]' : 'text-slate-200'}`}>
            {card.whyFitsYou}
          </p>
        </div>

        {/* Action Plan Checklist */}
        {card.actionPlan && card.actionPlan.length > 0 && (
          <div className="space-y-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              Your Recommended Next Step:
            </span>
            <ul className="space-y-1">
              {card.actionPlan.map((action, idx) => (
                <li key={idx} className={`flex items-start gap-1.5 text-xs ${isLight ? 'text-[#333333]' : 'text-slate-300'}`}>
                  <span className={`mt-0.5 font-bold ${isLight ? 'text-[#34C759]' : 'text-emerald-400'}`}>✓</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleWatchlist}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              isInWatchlist
                ? isLight
                  ? 'bg-[#34C759]/15 text-[#248A3D] border-[#34C759]/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : isLight
                  ? 'bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#000000] border-[rgba(0,0,0,0.1)]'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
            }`}
          >
            {isInWatchlist || justAdded ? (
              <>
                <Check className={`w-3.5 h-3.5 ${isLight ? 'text-[#248A3D]' : 'text-emerald-400'}`} />
                <span>In Watchlist</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>+ Watchlist</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleViewDetail}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-[#007AFF] hover:bg-[#0062CC] text-white flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
