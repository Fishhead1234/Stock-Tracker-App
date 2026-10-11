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
  const { setActiveTab } = useSettingsStore();
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
    <div className="my-3 rounded-2xl bg-[#0F1E46]/80 border border-white/10 overflow-hidden shadow-lg hover:border-emerald-500/40 transition-all">
      {/* Card Header */}
      <div className="p-3.5 bg-gradient-to-r from-navy-900/90 to-blue-950/70 border-b border-white/5 flex items-center justify-between">
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
              <span className="font-bold text-white text-base tracking-wide font-mono">{card.ticker}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {card.matchScore}% Match
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[180px]">{card.name}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-white font-mono">
            {card.currencySymbol}{card.currentPrice.toFixed(2)}
          </div>
          <div className={`text-[10px] font-bold ${card.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {card.changePercent >= 0 ? '+' : ''}{card.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Why This Fits You Callout */}
      <div className="p-3.5 space-y-3">
        <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why This Fits You</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {card.whyFitsYou}
          </p>
        </div>

        {/* Action Plan Checklist */}
        {card.actionPlan && card.actionPlan.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Recommended Next Step:</span>
            <ul className="space-y-1">
              {card.actionPlan.map((action, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
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
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isInWatchlist
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
            }`}
          >
            {isInWatchlist || justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
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
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-1 shadow-md shadow-blue-900/30 transition-all cursor-pointer"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
