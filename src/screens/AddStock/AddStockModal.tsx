import React, { useState } from 'react';
import { X, Search, PlusCircle, Lightbulb, Check } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { stockService } from '../../services/stockService';
import { StockQuote } from '../../types/stock';

interface Props {
  onClose: () => void;
  preselectedTicker?: string;
}

export const AddStockModal: React.FC<Props> = ({ onClose, preselectedTicker }) => {
  const { addPosition } = usePortfolioStore();

  const allStocks = stockService.getAllStocks();
  const initialStock = preselectedTicker 
    ? allStocks.find(s => s.ticker.toUpperCase() === preselectedTicker.toUpperCase()) || allStocks[0]
    : allStocks[0];

  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockQuote>(initialStock);
  const [shares, setShares] = useState<string>('10');
  const [buyPrice, setBuyPrice] = useState<string>(initialStock.price.toString());
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredStocks = search.trim()
    ? stockService.searchStocks(search)
    : allStocks.slice(0, 8);

  const handleSelectStock = (stk: StockQuote) => {
    setSelectedStock(stk);
    setBuyPrice(stk.price.toString());
    setSearch('');
  };

  const numShares = parseFloat(shares) || 0;
  const numPrice = parseFloat(buyPrice) || 0;
  const totalCost = numShares * numPrice;
  const curr = selectedStock.currencySymbol || '$';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numShares <= 0 || numPrice <= 0) return;

    addPosition({
      ticker: selectedStock.ticker,
      companyName: selectedStock.name,
      exchange: selectedStock.exchange,
      currency: selectedStock.currency,
      currencySymbol: selectedStock.currencySymbol,
      shares: numShares,
      averageBuyPrice: numPrice,
      purchaseDate,
      notes: notes.trim() || undefined
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-navy-900 border border-navy-700/80 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-growth-400 tracking-wider font-mono">
              Global Portfolio Tracker
            </span>
            <h3 className="text-base font-bold text-white">Log Your Current Position</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Ticker Search & Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Search Global Stock (US, Taiwan, Korea, UK, NZ, etc.)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symbol (e.g. 2330.TW, 005930.KS, NVDA, AZN.L)..."
                className="w-full bg-navy-950 border border-navy-750 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-growth-500 transition"
              />
            </div>

            {/* Quick stock chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {filteredStocks.map(stk => (
                <button
                  key={stk.ticker}
                  type="button"
                  onClick={() => handleSelectStock(stk)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1 ${
                    selectedStock.ticker === stk.ticker
                      ? 'bg-growth-600 text-white shadow-sm'
                      : 'bg-navy-800 text-slate-300 hover:bg-navy-750'
                  }`}
                >
                  <span>{stk.ticker}</span>
                  <span className="text-[10px] text-slate-400">({stk.currencySymbol}{stk.price.toFixed(0)})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Stock Banner */}
          <div className="p-3.5 bg-navy-950/80 rounded-xl border border-navy-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-navy-850 border border-navy-700/80 flex items-center justify-center font-bold text-white font-mono text-xs shadow-inner">
                {selectedStock.exchange}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white font-mono">{selectedStock.ticker}</h4>
                  <span className="text-[10px] text-slate-400">({selectedStock.country})</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate max-w-[180px]">{selectedStock.name}</p>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold text-white">{curr}{selectedStock.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="text-[10px] block text-slate-400">{selectedStock.currency}</span>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Number of Shares
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-growth-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Avg Buy Price ({curr})
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="e.g. 950.00"
                  className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-growth-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-growth-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Personal Trading Thesis / Notes <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Core semiconductor holding in my brokerage"
                className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-growth-500"
              />
            </div>

            {/* Total Cost Basis */}
            <div className="p-3 bg-navy-950/90 rounded-xl border border-navy-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-sans">Total Cost Basis:</span>
              <strong className="text-white text-sm">{curr}{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>

            {/* In-App Trading Reminder */}
            <div className="p-3 bg-navy-950/60 border border-navy-800 rounded-xl text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300 block mb-0.5">Tracking Reminder:</strong>
              This entry records your position for tracking and timing advice. All actual trades remain held in your registered brokerage.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSuccess || numShares <= 0 || numPrice <= 0}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                isSuccess
                  ? 'bg-growth-500 text-white'
                  : 'bg-growth-600 hover:bg-growth-500 text-white shadow-growth-600/30 active:scale-98'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Position Added to Tracker!</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Position to Tracker ({curr}{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
