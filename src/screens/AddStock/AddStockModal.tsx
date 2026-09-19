import React, { useState } from 'react';
import { X, Search, PlusCircle, HelpCircle, Check, Plus, Globe, Sparkles } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { stockService } from '../../services/stockService';
import { StockQuote } from '../../types/stock';
import { SymbolGuideModal } from '../../components/Common/SymbolGuideModal';

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
  const [showSymbolGuide, setShowSymbolGuide] = useState(false);

  // Custom stock creator mode
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customTicker, setCustomTicker] = useState('');
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('100.00');
  const [customCountryCode, setCustomCountryCode] = useState<'TW' | 'KR' | 'US' | 'UK' | 'NZ' | 'AU' | 'JP'>('US');

  const countryExchangeConfigs: Record<string, { exchange: string; country: string; currency: string; symbol: string; flag: string }> = {
    US: { exchange: 'NYSE / NASDAQ', country: 'United States', currency: 'USD', symbol: '$', flag: '🇺🇸' },
    TW: { exchange: 'TWSE', country: 'Taiwan', currency: 'TWD', symbol: 'NT$', flag: '🇹🇼' },
    KR: { exchange: 'KRX', country: 'South Korea', currency: 'KRW', symbol: '₩', flag: '🇰🇷' },
    UK: { exchange: 'LSE', country: 'United Kingdom', currency: 'GBP', symbol: '£', flag: '🇬🇧' },
    NZ: { exchange: 'NZX', country: 'New Zealand', currency: 'NZD', symbol: 'NZ$', flag: '🇳🇿' },
    AU: { exchange: 'ASX', country: 'Australia', currency: 'AUD', symbol: 'A$', flag: '🇦🇺' },
    JP: { exchange: 'TSE', country: 'Japan', currency: 'JPY', symbol: '¥', flag: '🇯🇵' }
  };

  const filteredStocks = search.trim()
    ? stockService.searchStocks(search)
    : allStocks.slice(0, 8);

  const handleSelectStock = (stk: StockQuote) => {
    setSelectedStock(stk);
    setBuyPrice(stk.price.toString());
    setSearch('');
    setIsCreatingCustom(false);
  };

  const handleCreateCustomStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTicker.trim()) return;

    const config = countryExchangeConfigs[customCountryCode];
    const newStock = stockService.addCustomStock({
      ticker: customTicker.trim().toUpperCase(),
      name: customName.trim() || customTicker.trim().toUpperCase(),
      exchange: config.exchange,
      country: config.country,
      countryCode: customCountryCode,
      currency: config.currency,
      currencySymbol: config.symbol,
      price: parseFloat(customPrice) || 100
    });

    setSelectedStock(newStock);
    setBuyPrice(newStock.price.toString());
    setIsCreatingCustom(false);
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div 
          className="bg-navy-900 border border-navy-700/80 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-growth-400 tracking-wider font-mono">
                Universal Stock Tracker
              </span>
              <h3 className="text-base font-bold text-white">Log Position or Unlisted Stock</h3>
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
            {/* Search Bar + Symbol Helper Button */}
            {!isCreatingCustom && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Search Any Global Stock
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSymbolGuide(true)}
                    className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center gap-1 font-medium transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>How tickers work?</span>
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search e.g. 2330, Samsung, NVDA, AZN, FPH..."
                    className="w-full bg-navy-950 border border-navy-750 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-growth-500 transition"
                  />
                </div>

                {/* Stock Chips or No Match Prompt */}
                {filteredStocks.length > 0 ? (
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
                ) : (
                  <div className="p-3 bg-navy-950/70 border border-navy-800 rounded-xl mt-2 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      Can't find <strong className="text-white font-mono">"{search}"</strong>?
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomTicker(search.toUpperCase());
                        setIsCreatingCustom(true);
                      }}
                      className="px-3 py-1.5 bg-growth-600 hover:bg-growth-500 text-white text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add "{search.toUpperCase()}" as Custom Stock</span>
                    </button>
                  </div>
                )}

                {/* Always-Visible Add Custom Stock Link */}
                <div className="pt-2 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Trading app ticker listed differently?</span>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCustom(true)}
                    className="text-growth-400 hover:text-growth-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Custom Stock</span>
                  </button>
                </div>
              </div>
            )}

            {/* Custom Stock Creator Mode */}
            {isCreatingCustom && (
              <div className="bg-navy-950/90 border border-navy-750 p-4 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-growth-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Add Any Custom or Unlisted Stock</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCustom(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Ticker Symbol (as shown in your broker)
                    </label>
                    <input
                      type="text"
                      required
                      value={customTicker}
                      onChange={(e) => setCustomTicker(e.target.value.toUpperCase())}
                      placeholder="e.g. 9988.HK, PLUG, 2330, SHOP.TO"
                      className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-growth-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Alibaba Group"
                      className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-growth-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Exchange / Region
                      </label>
                      <select
                        value={customCountryCode}
                        onChange={(e) => setCustomCountryCode(e.target.value as any)}
                        className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-growth-500"
                      >
                        {Object.entries(countryExchangeConfigs).map(([code, cfg]) => (
                          <option key={code} value={code}>
                            {cfg.flag} {cfg.country} ({cfg.exchange})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Current Price ({countryExchangeConfigs[customCountryCode].symbol})
                      </label>
                      <input
                        type="number"
                        step="any"
                        min="0.01"
                        required
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder="e.g. 85.50"
                        className="w-full bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-growth-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateCustomStock}
                    disabled={!customTicker.trim()}
                    className="w-full py-2.5 bg-growth-600 hover:bg-growth-500 text-white font-bold rounded-xl text-xs transition mt-1"
                  >
                    Index Stock & Continue
                  </button>
                </div>
              </div>
            )}

            {/* Selected Stock Banner */}
            <div className="p-3.5 bg-navy-950/80 rounded-xl border border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-navy-850 border border-navy-700/80 flex items-center justify-center font-bold text-white font-mono text-xs shadow-inner">
                  {selectedStock.exchange.slice(0, 5)}
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

            {/* Position Details Form */}
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
                  Personal Thesis / Notes <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Core long-term holding"
                  className="w-full bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-growth-500"
                />
              </div>

              {/* Total Cost Basis */}
              <div className="p-3 bg-navy-950/90 rounded-xl border border-navy-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-sans">Total Cost Basis:</span>
                <strong className="text-white text-sm">{curr}{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
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

      {showSymbolGuide && (
        <SymbolGuideModal onClose={() => setShowSymbolGuide(false)} />
      )}
    </>
  );
};
