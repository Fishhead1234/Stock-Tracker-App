import React from 'react';
import { TrendingUp, TrendingDown, Plus, Wallet, Shield } from 'lucide-react';
import { PortfolioSummary } from '../../types/portfolio';

interface Props {
  summary: PortfolioSummary;
  onOpenAddStock: () => void;
}

export const PortfolioSummaryCard: React.FC<Props> = ({ summary, onOpenAddStock }) => {
  const isTotalGain = summary.totalProfitLoss >= 0;
  const isDayGain = summary.dayChange >= 0;
  const totalNetWorth = summary.currentValue + summary.cashBalance;

  return (
    <div className="bg-gradient-to-br from-navy-850 via-navy-900 to-navy-950 border border-navy-750 rounded-3xl p-5 shadow-xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-growth-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Wallet className="w-3.5 h-3.5 text-growth-400" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">Total Portfolio Value</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {summary.holdingsCount} {summary.holdingsCount === 1 ? 'Holding' : 'Holdings'}
        </span>
      </div>

      {/* Main Net Worth Value */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-mono tracking-tight">
            ${summary.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
              isTotalGain ? 'bg-growth-500/20 text-growth-400' : 'bg-loss-500/20 text-loss-400'
            }`}>
              {isTotalGain ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isTotalGain ? '+' : ''}${Math.abs(summary.totalProfitLoss).toFixed(2)} ({isTotalGain ? '+' : ''}{summary.totalProfitLossPercent.toFixed(1)}%)
            </span>
            <span className="text-[11px] text-slate-500">All-time</span>
          </div>
        </div>

        <button
          onClick={onOpenAddStock}
          className="bg-growth-600 hover:bg-growth-500 text-white font-bold p-3 rounded-2xl shadow-lg shadow-growth-600/30 active:scale-95 transition flex items-center gap-1.5"
          title="Add Stock Position"
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs pr-1">Add Stock</span>
        </button>
      </div>

      {/* Bottom Metrics Bar */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-navy-800/80 text-xs font-mono">
        <div className="bg-navy-950/50 p-2.5 rounded-xl border border-navy-800/60">
          <span className="text-[10px] text-slate-400 block font-sans">Today's Return</span>
          <span className={`font-bold ${isDayGain ? 'text-growth-400' : 'text-loss-500'}`}>
            {isDayGain ? '+' : ''}${summary.dayChange.toFixed(2)} ({isDayGain ? '+' : ''}{summary.dayChangePercent.toFixed(2)}%)
          </span>
        </div>

        <div className="bg-navy-950/50 p-2.5 rounded-xl border border-navy-800/60">
          <span className="text-[10px] text-slate-400 block font-sans">Total Cost Basis</span>
          <span className="font-bold text-slate-200">
            ${summary.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
