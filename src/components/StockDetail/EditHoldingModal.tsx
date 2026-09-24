import React, { useState } from 'react';
import { X, Check, Trash2, Edit3, DollarSign, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { Position } from '../../types/portfolio';
import { StockQuote } from '../../types/stock';
import { usePortfolioStore } from '../../store/portfolioStore';

interface Props {
  stock: StockQuote;
  position: Position;
  onClose: () => void;
}

export const EditHoldingModal: React.FC<Props> = ({ stock, position, onClose }) => {
  const { updatePosition, deletePosition } = usePortfolioStore();

  const [sharesInput, setSharesInput] = useState<string>(position.shares.toString());
  const [priceInput, setPriceInput] = useState<string>(position.averageBuyPrice.toString());
  const [purchaseDate, setPurchaseDate] = useState<string>(
    position.purchaseDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>(position.notes || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const curr = stock.currencySymbol || '$';
  const numShares = parseFloat(sharesInput) || 0;
  const numPrice = parseFloat(priceInput) || 0;
  const newCostBasis = numShares * numPrice;
  const newCurrentValue = numShares * stock.price;
  const newProfit = newCurrentValue - newCostBasis;
  const newProfitPercent = newCostBasis > 0 ? (newProfit / newCostBasis) * 100 : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (numShares <= 0 || numPrice <= 0) return;

    updatePosition(position.id, {
      shares: numShares,
      averageBuyPrice: Number(numPrice.toFixed(2)),
      purchaseDate,
      notes: notes.trim() || undefined
    });

    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    deletePosition(position.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-navy-900 border border-navy-700/80 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-growth-500/20 border border-growth-500/30 flex items-center justify-center text-growth-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-growth-400 tracking-wider font-mono">
                Modify Tracked Holding
              </span>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{stock.ticker}</span>
                <span className="text-xs text-slate-400 font-normal">({stock.name})</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
          {/* Current Live Market Reference */}
          <div className="p-3 rounded-2xl bg-navy-950/60 border border-navy-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Current Market Price:</span>
            <span className="font-bold text-white">
              {curr}{stock.price.toFixed(2)} {stock.currency}
            </span>
          </div>

          {/* Number of Shares Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Total Shares Owned</span>
              <span className="text-[10px] text-slate-500 font-mono">Current: {position.shares}</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.0001"
                required
                value={sharesInput}
                onChange={(e) => setSharesInput(e.target.value)}
                placeholder="e.g. 10"
                className="w-full bg-navy-950 border border-navy-750 focus:border-growth-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none transition"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">shares</span>
            </div>
          </div>

          {/* Average Purchase Price Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Average Purchase Price ({curr})</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Current: {curr}{position.averageBuyPrice.toFixed(2)}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">{curr}</span>
              <input
                type="number"
                step="any"
                min="0.0001"
                required
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder={stock.price.toString()}
                className="w-full bg-navy-950 border border-navy-750 focus:border-growth-500 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none transition"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Enter your actual average cost basis per share to ensure accurate profit/loss tracking.
            </p>
          </div>

          {/* Purchase Date Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Purchase Date</span>
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full bg-navy-950 border border-navy-750 focus:border-growth-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none transition"
            />
          </div>

          {/* Notes / Investment Thesis */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Personal Notes or Thesis (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Long-term holding for AI growth cycle..."
              className="w-full bg-navy-950 border border-navy-750 focus:border-growth-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition resize-none"
            />
          </div>

          {/* Real-time Recalculated Impact Summary Card */}
          <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Updated Holding Preview
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 font-sans block">Total Invested:</span>
                <span className="text-slate-200 font-bold">{curr}{newCostBasis.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-sans block">Current Equity:</span>
                <span className="text-slate-200 font-bold">{curr}{newCurrentValue.toFixed(2)}</span>
              </div>
              <div className="col-span-2 pt-1.5 border-t border-navy-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-sans">Projected Return:</span>
                <span className={`font-bold ${newProfit >= 0 ? 'text-growth-400' : 'text-loss-500'}`}>
                  {newProfit >= 0 ? '+' : ''}{curr}{newProfit.toFixed(2)} ({newProfitPercent >= 0 ? '+' : ''}{newProfitPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={numShares <= 0 || numPrice <= 0 || isSaved}
              className="w-full py-3 bg-gradient-to-r from-growth-600 to-emerald-600 hover:from-growth-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Holding Updated!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            {/* Delete Confirmation or Trigger */}
            {!showConfirmDelete ? (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="w-full py-2 bg-navy-950 hover:bg-loss-950/40 text-slate-400 hover:text-loss-400 text-xs font-semibold rounded-xl border border-navy-800 hover:border-loss-500/40 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete This Holding</span>
              </button>
            ) : (
              <div className="p-3 bg-loss-950/40 border border-loss-500/50 rounded-xl space-y-2 animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs text-loss-300 font-medium">
                  <AlertTriangle className="w-4 h-4 text-loss-400 shrink-0" />
                  <span>Are you sure you want to remove this position?</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-1.5 bg-loss-600 hover:bg-loss-500 text-white text-xs font-bold rounded-lg transition"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="flex-1 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
