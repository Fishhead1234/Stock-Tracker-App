import React, { useState } from 'react';
import { Briefcase, Calculator, Plus, Trash2, Edit3 } from 'lucide-react';
import { Position } from '../../types/portfolio';
import { StockQuote } from '../../types/stock';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useSettingsStore } from '../../store/settingsStore';
import { EditHoldingModal } from './EditHoldingModal';

interface Props {
  stock: StockQuote;
  position?: Position;
  onOpenAddModal: () => void;
}

export const PositionStats: React.FC<Props> = ({ stock, position, onOpenAddModal }) => {
  const { deletePosition } = usePortfolioStore();
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  const [whatIfShares, setWhatIfShares] = useState<number>(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const curr = stock.currencySymbol || '$';
  const costBasis = position ? position.shares * position.averageBuyPrice : 0;
  const currentVal = position ? position.shares * stock.price : 0;
  const profit = currentVal - costBasis;
  const profitPercent = costBasis > 0 ? (profit / costBasis) * 100 : 0;

  // What-if DCA calculation
  const totalExistingShares = position ? position.shares : 0;
  const totalExistingCost = position ? costBasis : 0;
  const additionalCost = whatIfShares * stock.price;
  const newTotalShares = totalExistingShares + whatIfShares;
  const newAveragePrice = (totalExistingCost + additionalCost) / Math.max(1, newTotalShares);

  return (
    <div className={`rounded-2xl p-4 space-y-4 transition-all duration-300 relative overflow-hidden border ${
      position
        ? isLight
          ? 'bg-gradient-to-b from-[#F2FBF5] via-white to-white border-[#34C759]/60 ring-2 ring-[#34C759]/40 shadow-[0_0_20px_rgba(52,199,89,0.22),0_6px_20px_rgba(52,199,89,0.1)]'
          : 'bg-gradient-to-b from-[#0B251E] via-navy-900 to-navy-900 border-emerald-500/60 ring-2 ring-emerald-500/50 shadow-[0_0_22px_rgba(16,185,129,0.35),0_0_45px_rgba(16,185,129,0.15)]'
        : isLight
          ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-xs'
          : 'bg-navy-900/90 border-navy-800 shadow-sm'
    }`}>
      {/* Top glowing accent bar for personal holdings */}
      {position && (
        <div 
          className={`absolute top-0 left-0 right-0 h-[3px] ${
            isLight
              ? 'bg-gradient-to-r from-[#34C759] via-emerald-400 to-[#30D158] shadow-[0_0_8px_rgba(52,199,89,0.5)]'
              : 'bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
          }`} 
        />
      )}

      {/* Position Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className={`w-4 h-4 ${isLight ? 'text-[#34C759]' : 'text-emerald-400'}`} />
          <div className="flex items-center gap-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-black' : 'text-white'}`}>
              Your Personal Holding
            </h4>
            {position && (
              <span className={`w-2 h-2 rounded-full animate-pulse ${isLight ? 'bg-[#34C759]' : 'bg-emerald-400'}`} />
            )}
          </div>
        </div>
        {position ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition shadow-xs active:scale-95 ${
                isLight 
                  ? 'text-[#248A3D] bg-[#34C759]/15 border border-[#34C759]/30 hover:bg-[#34C759]/25' 
                  : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => deletePosition(position.id)}
              className={`p-1 rounded-lg transition ${
                isLight ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-loss-400 hover:bg-loss-500/10'
              }`}
              title="Remove Position"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAddModal}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
              isLight 
                ? 'text-[#248A3D] bg-[#34C759]/15 border border-[#34C759]/30 hover:bg-[#34C759]/25' 
                : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Position</span>
          </button>
        )}
      </div>

      {position ? (
        <div className="space-y-3">
          <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl border font-mono text-xs ${
            isLight 
              ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]' 
              : 'bg-navy-950/70 border-navy-800/80'
          }`}>
            <div>
              <span className={`text-[10px] block font-sans ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>Shares Tracked</span>
              <strong className={`text-sm ${isLight ? 'text-black' : 'text-white'}`}>{position.shares}</strong>
            </div>
            <div>
              <span className={`text-[10px] block font-sans ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>Avg Cost Basis</span>
              <strong className={`text-sm ${isLight ? 'text-black' : 'text-white'}`}>{curr}{position.averageBuyPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className={`pt-2 border-t ${isLight ? 'border-[rgba(0,0,0,0.06)]' : 'border-navy-800/60'}`}>
              <span className={`text-[10px] block font-sans ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>Total Invested</span>
              <strong className={isLight ? 'text-[#333333]' : 'text-slate-300'}>{curr}{costBasis.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className={`pt-2 border-t ${isLight ? 'border-[rgba(0,0,0,0.06)]' : 'border-navy-800/60'}`}>
              <span className={`text-[10px] block font-sans ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>Current Return</span>
              <strong className={profit >= 0 ? isLight ? 'text-[#248A3D]' : 'text-emerald-400' : 'text-loss-500'}>
                {profit >= 0 ? '+' : ''}{curr}{profit.toFixed(2)} ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%)
              </strong>
            </div>
          </div>

          {position.notes && (
            <div className={`text-xs p-2.5 rounded-lg border italic ${
              isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)] text-[#666666]' : 'bg-navy-950/40 border-navy-800 text-slate-400'
            }`}>
              <span className={`font-semibold not-italic font-sans block text-[10px] uppercase ${isLight ? 'text-black' : 'text-slate-300'}`}>Your Notes:</span>
              "{position.notes}"
            </div>
          )}
        </div>
      ) : (
        <div className={`p-3 rounded-xl border text-center ${
          isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950/50 border-navy-800'
        }`}>
          <p className={`text-xs mb-2 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>You haven't logged any shares of {stock.ticker} yet.</p>
          <button
            onClick={onOpenAddModal}
            className={`w-full py-2 font-semibold text-xs rounded-lg transition text-white ${
              isLight ? 'bg-[#007AFF] hover:bg-[#0062CC]' : 'bg-growth-600 hover:bg-growth-500'
            }`}
          >
            Log Your Current Holding
          </button>
        </div>
      )}

      {/* Dollar-Cost Average Simulator */}
      <div className={`pt-3 border-t ${isLight ? 'border-[rgba(0,0,0,0.08)]' : 'border-navy-800'}`}>
        <div className={`flex items-center gap-1.5 mb-2 font-semibold text-xs ${
          isLight ? 'text-[#FF9500]' : 'text-gold-400'
        }`}>
          <Calculator className="w-3.5 h-3.5" />
          <span>Dollar-Cost Averaging (DCA) Calculator</span>
        </div>
        <p className={`text-[11px] mb-2.5 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
          See how accumulating more shares at {curr}{stock.price.toFixed(2)} updates your cost basis.
        </p>

        <div className={`p-3 rounded-xl border space-y-2 ${
          isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950/80 border-navy-800'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={isLight ? 'text-[#333333]' : 'text-slate-300'}>Shares to add:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10000"
                value={whatIfShares}
                onChange={(e) => setWhatIfShares(Math.max(1, Number(e.target.value)))}
                className={`w-20 border rounded px-2 py-1 text-right font-mono text-xs focus:outline-none ${
                  isLight 
                    ? 'bg-white border-[rgba(0,0,0,0.15)] text-black focus:border-[#007AFF]' 
                    : 'bg-navy-900 border-navy-700 text-white focus:border-growth-500'
                }`}
              />
              <span className={isLight ? 'text-[#8E8E93]' : 'text-slate-400'}>shares</span>
            </div>
          </div>

          <div className={`pt-2 border-t flex items-center justify-between text-xs font-mono ${
            isLight ? 'border-[rgba(0,0,0,0.06)]' : 'border-navy-800/80'
          }`}>
            <span className={`font-sans ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>Projected Avg Cost:</span>
            <span className={`font-bold text-sm ${isLight ? 'text-[#248A3D]' : 'text-emerald-400'}`}>{curr}{newAveragePrice.toFixed(2)}</span>
          </div>
          <div className={`flex items-center justify-between text-[11px] font-mono ${
            isLight ? 'text-[#8E8E93]' : 'text-slate-500'
          }`}>
            <span>Additional Capital:</span>
            <span>{curr}{additionalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {isEditModalOpen && position && (
        <EditHoldingModal
          stock={stock}
          position={position}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};
