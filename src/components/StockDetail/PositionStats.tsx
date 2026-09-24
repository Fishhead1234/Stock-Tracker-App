import React, { useState } from 'react';
import { Briefcase, Calculator, Plus, Trash2, Edit3 } from 'lucide-react';
import { Position } from '../../types/portfolio';
import { StockQuote } from '../../types/stock';
import { usePortfolioStore } from '../../store/portfolioStore';
import { EditHoldingModal } from './EditHoldingModal';

interface Props {
  stock: StockQuote;
  position?: Position;
  onOpenAddModal: () => void;
}

export const PositionStats: React.FC<Props> = ({ stock, position, onOpenAddModal }) => {
  const { deletePosition } = usePortfolioStore();
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
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 space-y-4 shadow-sm">
      {/* Position Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-growth-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Your Personal Holding</h4>
        </div>
        {position ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-semibold text-growth-400 hover:text-growth-300 bg-growth-500/15 border border-growth-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition shadow-sm active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => deletePosition(position.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-loss-400 hover:bg-loss-500/10 transition"
              title="Remove Position"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAddModal}
            className="text-xs font-semibold text-growth-400 hover:text-growth-300 bg-growth-500/15 border border-growth-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Position</span>
          </button>
        )}
      </div>

      {position ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 bg-navy-950/70 p-3 rounded-xl border border-navy-800/80 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Shares Tracked</span>
              <strong className="text-white text-sm">{position.shares}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Avg Cost Basis</span>
              <strong className="text-white text-sm">{curr}{position.averageBuyPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className="pt-2 border-t border-navy-800/60">
              <span className="text-[10px] text-slate-400 block font-sans">Total Invested</span>
              <strong className="text-slate-300">{curr}{costBasis.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className="pt-2 border-t border-navy-800/60">
              <span className="text-[10px] text-slate-400 block font-sans">Current Return</span>
              <strong className={profit >= 0 ? 'text-growth-400' : 'text-loss-500'}>
                {profit >= 0 ? '+' : ''}{curr}{profit.toFixed(2)} ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%)
              </strong>
            </div>
          </div>

          {position.notes && (
            <div className="text-xs text-slate-400 bg-navy-950/40 p-2.5 rounded-lg border border-navy-800 italic">
              <span className="font-semibold text-slate-300 not-italic font-sans block text-[10px] uppercase">Your Notes:</span>
              "{position.notes}"
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-navy-950/50 rounded-xl border border-navy-800 text-center">
          <p className="text-xs text-slate-400 mb-2">You haven't logged any shares of {stock.ticker} yet.</p>
          <button
            onClick={onOpenAddModal}
            className="w-full py-2 bg-growth-600 hover:bg-growth-500 text-white font-semibold text-xs rounded-lg transition"
          >
            Log Your Current Holding
          </button>
        </div>
      )}

      {/* Dollar-Cost Average Simulator */}
      <div className="pt-3 border-t border-navy-800">
        <div className="flex items-center gap-1.5 mb-2 text-gold-400 font-semibold text-xs">
          <Calculator className="w-3.5 h-3.5" />
          <span>Dollar-Cost Averaging (DCA) Calculator</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-2.5">
          See how accumulating more shares at {curr}{stock.price.toFixed(2)} updates your cost basis.
        </p>

        <div className="bg-navy-950/80 p-3 rounded-xl border border-navy-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">Shares to add:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10000"
                value={whatIfShares}
                onChange={(e) => setWhatIfShares(Math.max(1, Number(e.target.value)))}
                className="w-20 bg-navy-900 border border-navy-700 rounded px-2 py-1 text-right font-mono text-white text-xs"
              />
              <span className="text-slate-400">shares</span>
            </div>
          </div>

          <div className="pt-2 border-t border-navy-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-sans">Projected Avg Cost:</span>
            <span className="text-growth-400 font-bold text-sm">{curr}{newAveragePrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
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
