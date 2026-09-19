import React, { useState } from 'react';
import { X, Search, PlusCircle, Lightbulb, ShieldCheck, Check } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { stockService } from '../../services/stockService';
import { StockQuote } from '../../types/stock';

interface Props {
  onClose: () => void;
  preselectedTicker?: string;
}

export const AddStockModal: React.FC<Props> = ({ onClose, preselectedTicker }) => {
  const { addPosition, cashBalance } = usePortfolioStore();

  const allStocks = stockService.getAllStocks();
  const initialStock = preselectedTicker 
    ? allStocks.find(s => s.ticker.toUpperCase() === preselectedTicker.toUpperCase()) || allStocks[0]
    : allStocks[0];

  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockQuote>(initialStock);
  const [shares, setShares] = useState<string>('5');
  const [buyPrice, setBuyPrice] = useState<string>(initialStock.price.toString());
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredStocks = search.trim()
    ? stockService.searchStocks(search)
    : allStocks.slice(0, 6);

  const handleSelectStock = (stk: StockQuote) => {
    setSelectedStock(stk);
    setBuyPrice(stk.price.toString());
    setSearch('');
  };

  const numShares = parseFloat(shares) || 0;
  const numPrice = parseFloat(buyPrice) || 0;
  const totalCost = numShares * numPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numShares <= 0 || numPrice <= 0) return;

    addPosition({
      ticker: selectedStock.ticker,
      companyName: selectedStock.name,
      shares: numShares,
      averageBuyPrice: numPrice,
      purchaseDate,
      notes: notes.trim() || undefined
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-navy-900 border border-navy-700/80 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/70">
          <div>
            <span className="text-[10px] uppercase font-bold text-growth-400 tracking-wider">Portfolio Position</span>
            <h3 className="text-base font-bold text-white">Log Stock Position</h3>
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
              Select or Search Stock
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symbol (e.g. AAPL, NVDA, SPY)..."
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition ${
                    selectedStock.ticker === stk.ticker
                      ? 'bg-growth-600 text-white shadow-sm'
                      : 'bg-navy-800 text-slate-300 hover:bg-navy-750'
                  }`}
                >
                  {stk.ticker} (${stk.price.toFixed(0)})
                </button>
              ))}
            </div>
          </div>

          {/* Selected Stock Banner */}
          <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center font-bold text-white font-mono text-xs">
                {selectedStock.ticker}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{selectedStock.name}</h4>
                <p className="text-[11px] text-slate-400">{selectedStock.sector}</p>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold text-white">${selectedStock.price.toFixed(2)}</span>
              <span className={`text-[10px] block ${selectedStock.change >= 0 ? 'text-growth-400' : 'text-loss-500'}`}>
                {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(1)}%
              </span>
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
                  placeholder="e.g. 10"
                  className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-growth-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Purchase Price ($)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="e.g. 125.50"
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
                Investment Thesis / Notes <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Long-term AI infrastructure conviction"
                className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-growth-500"
              />
            </div>

            {/* Total Cost Calculation */}
            <div className="p-3 bg-navy-950/90 rounded-xl border border-navy-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-sans">Total Position Basis:</span>
              <strong className="text-white text-sm">${totalCost.toFixed(2)}</strong>
            </div>

            {/* Beginner Risk Education Callout */}
            <div className="p-3 bg-gold-950/20 border border-gold-600/30 rounded-xl flex items-start gap-2 text-xs text-gold-300/90">
              <Lightbulb className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Beginner Sizing Rule:</strong> Try not to commit more than 5% to 10% of your total capital to a single position to protect against individual company risk.
              </p>
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
                  <span>Position Logged Successfully!</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Position to Portfolio (${totalCost.toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
