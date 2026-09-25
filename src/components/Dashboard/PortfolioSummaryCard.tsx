import React from 'react';
import { TrendingUp, TrendingDown, Plus, Wallet } from 'lucide-react';
import { PortfolioSummary } from '../../types/portfolio';
import { useLanguageStore } from '../../store/languageStore';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  summary: PortfolioSummary;
  onOpenAddStock: () => void;
}

export const PortfolioSummaryCard: React.FC<Props> = ({ summary, onOpenAddStock }) => {
  const { t } = useLanguageStore();
  const { themeMode } = useSettingsStore();

  const isLight = themeMode === 'neutral-light';
  const isTotalGain = summary.totalProfitLoss >= 0;
  const isDayGain = summary.dayChange >= 0;

  return (
    <div className={`rounded-2xl p-4 shadow-card transition-all relative overflow-hidden border ${
      isLight 
        ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]' 
        : 'bg-gradient-to-br from-navy-850 via-navy-900 to-navy-950 border-navy-750'
    }`}>
      {/* Subtle background glow on dark */}
      {!isLight && (
        <div className="absolute top-0 right-0 w-44 h-44 bg-growth-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      )}

      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs">
          <Wallet className={`w-3.5 h-3.5 ${isLight ? 'text-[#007AFF]' : 'text-growth-400'}`} />
          <span className={`font-semibold uppercase tracking-wider text-[11px] ${
            isLight ? 'text-[#666666]' : 'text-slate-400'
          }`}>
            {t('portfolio_summary_title', 'Total Portfolio Value')}
          </span>
        </div>
        <span className={`text-[13px] font-mono ${isLight ? 'text-[#8E8E93]' : 'text-slate-400'}`}>
          {summary.holdingsCount} {t('holdings_count_label', 'Holdings')}
        </span>
      </div>

      {/* Main Net Worth Value */}
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className={`text-3xl font-extrabold font-mono tracking-tight ${
            isLight ? 'text-[#000000]' : 'text-white'
          }`}>
            ${summary.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-0.5 text-[13px] font-mono font-bold px-2 py-0.5 rounded-full ${
              isTotalGain 
                ? isLight ? 'bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/30' : 'bg-growth-500/20 text-growth-400'
                : isLight ? 'bg-[#FF3B30]/15 text-[#FF3B30] border border-[#FF3B30]/30' : 'bg-loss-500/20 text-loss-400'
            }`}>
              {isTotalGain ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isTotalGain ? '+' : ''}${Math.abs(summary.totalProfitLoss).toFixed(2)} ({isTotalGain ? '+' : ''}{summary.totalProfitLossPercent.toFixed(1)}%)
            </span>
            <span className={`text-[12px] ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
              {t('all_time', 'All-time')}
            </span>
          </div>
        </div>

        {/* Primary Action Button (min 48x48px, 12px 24px padding, 8px radius, #007AFF) */}
        <button
          onClick={onOpenAddStock}
          data-touch-target="true"
          className={`min-h-[48px] min-w-[48px] px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm ${
            isLight
              ? 'bg-[#007AFF] hover:bg-[#0062CC] text-white'
              : 'bg-growth-600 hover:bg-growth-500 text-white shadow-growth-600/30'
          }`}
          title={t('add_stock', 'Add Stock')}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('add_stock', 'Add Stock')}</span>
        </button>
      </div>

      {/* Bottom Metrics Bar */}
      <div className={`grid grid-cols-2 gap-2 pt-3 border-t text-xs font-mono ${
        isLight ? 'border-[rgba(0,0,0,0.08)]' : 'border-navy-800/80'
      }`}>
        <div className={`p-2.5 rounded-xl border ${
          isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950/50 border-navy-800/60'
        }`}>
          <span className={`text-[13px] block font-sans ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
            {t('todays_return', "Today's Return")}
          </span>
          <span className={`text-[14px] font-bold ${
            isDayGain 
              ? isLight ? 'text-[#34C759]' : 'text-growth-400' 
              : isLight ? 'text-[#FF3B30]' : 'text-loss-500'
          }`}>
            {isDayGain ? '+' : ''}${summary.dayChange.toFixed(2)} ({isDayGain ? '+' : ''}{summary.dayChangePercent.toFixed(2)}%)
          </span>
        </div>

        <div className={`p-2.5 rounded-xl border ${
          isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950/50 border-navy-800/60'
        }`}>
          <span className={`text-[13px] block font-sans ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
            {t('total_cost_basis', 'Total Cost Basis')}
          </span>
          <span className={`text-[14px] font-bold ${isLight ? 'text-[#000000]' : 'text-slate-200'}`}>
            ${summary.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
