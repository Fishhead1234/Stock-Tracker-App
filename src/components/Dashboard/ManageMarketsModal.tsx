import React from 'react';
import { X, Globe2, Check, Plus, Trash2, TrendingUp } from 'lucide-react';
import { GLOBAL_MARKETS, GlobalMarket } from '../../constants/markets';
import { useMarketStore } from '../../store/marketStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  onClose: () => void;
}

export const ManageMarketsModal: React.FC<Props> = ({ onClose }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useMarketStore();
  const { themeMode, interestedSectors, setInterestedSectors } = useSettingsStore();
  const { t } = useLanguageStore();

  const isLight = themeMode === 'neutral-light';

  const isMarketActive = (market: GlobalMarket) => {
    // A market is considered active if all its key tickers are in watchlist or it is in interestedSectors
    const hasAnyTicker = market.tickers.some(t => watchlist.map(w => w.toUpperCase()).includes(t.toUpperCase()));
    return hasAnyTicker || interestedSectors.includes(market.id);
  };

  const handleToggleMarket = (market: GlobalMarket) => {
    const active = isMarketActive(market);
    if (active) {
      // Remove market tickers
      market.tickers.forEach(t => removeFromWatchlist(t));
      setInterestedSectors(interestedSectors.filter(id => id !== market.id));
    } else {
      // Add market tickers
      market.tickers.forEach(t => addToWatchlist(t));
      if (!interestedSectors.includes(market.id)) {
        setInterestedSectors([...interestedSectors, market.id]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border transition-all animate-slide-up ${
          isLight ? 'bg-white border-[rgba(0,0,0,0.1)]' : 'bg-navy-900 border-navy-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950 border-navy-850'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-[#007AFF]/15 text-[#007AFF]' : 'bg-growth-500/20 text-growth-400'
            }`}>
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                {t('markets_modal_title', 'Manage Monitored Global Markets')}
              </h3>
              <p className={`text-xs ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {t('markets_modal_desc', 'Select which international exchanges you want to actively monitor.')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isLight ? 'text-[#666666] hover:bg-black/5 hover:text-black' : 'text-slate-400 hover:bg-navy-800 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Markets List */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto max-h-[60vh]">
          {GLOBAL_MARKETS.map(market => {
            const active = isMarketActive(market);
            const trackedCount = market.tickers.filter(t => 
              watchlist.map(w => w.toUpperCase()).includes(t.toUpperCase())
            ).length;

            return (
              <div
                key={market.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  active
                    ? isLight
                      ? 'bg-[#007AFF]/5 border-[#007AFF]/30 shadow-xs'
                      : 'bg-growth-950/20 border-growth-500/40'
                    : isLight
                      ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]'
                      : 'bg-navy-950/60 border-navy-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{market.flag}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-sm font-bold truncate ${isLight ? 'text-black' : 'text-white'}`}>
                        {t(market.labelKey, market.defaultLabel)}
                      </h4>
                      {active && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isLight ? 'bg-[#34C759]/15 text-[#34C759]' : 'bg-growth-500/20 text-growth-400'
                        }`}>
                          {t('markets_active_badge', 'Active')} ({trackedCount}/{market.tickers.length})
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                      {t(market.descriptionKey, market.defaultDescription)}
                    </p>
                    <p className={`text-[11px] font-mono mt-1 ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                      {market.tickers.join(' • ')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleMarket(market)}
                  data-touch-target="true"
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 ${
                    active
                      ? isLight
                        ? 'bg-[#FF3B30]/15 text-[#FF3B30] hover:bg-[#FF3B30]/25'
                        : 'bg-loss-500/20 text-loss-400 hover:bg-loss-500/30'
                      : isLight
                        ? 'bg-[#007AFF] text-white hover:bg-[#0062CC] shadow-xs'
                        : 'bg-growth-600 text-white hover:bg-growth-500 shadow-sm'
                  }`}
                >
                  {active ? (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('markets_remove_btn', 'Remove')}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('markets_add_btn', 'Add to Watchlist')}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950 border-navy-850'
        }`}>
          <span className={`text-xs ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
            {watchlist.length} {t('monitored_stocks', 'stocks monitored')}
          </span>
          <button
            type="button"
            onClick={onClose}
            data-touch-target="true"
            className="min-h-[44px] px-5 py-2.5 bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-95"
          >
            {t('common_done', 'Done')}
          </button>
        </div>
      </div>
    </div>
  );
};
