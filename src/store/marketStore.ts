import { create } from 'zustand';
import { StockQuote } from '../types/stock';

interface MarketState {
  quotes: Record<string, StockQuote>;
  selectedTicker: string | null;
  searchQuery: string;
  selectedCategory: string;
  watchlist: string[];
  setQuotes: (quotes: Record<string, StockQuote>) => void;
  selectTicker: (ticker: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
  toggleWatchlist: (ticker: string) => void;
}

const WATCHLIST_STORAGE_KEY = 'investlearn_watchlist';

export const useMarketStore = create<MarketState>((set, get) => {
  let savedWatchlist: string[] = ['AAPL', 'NVDA', 'SPY', 'TSLA', 'AMZN'];
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (raw) savedWatchlist = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load watchlist', e);
  }

  return {
    quotes: {},
    selectedTicker: null,
    searchQuery: '',
    selectedCategory: 'All',
    watchlist: savedWatchlist,

    setQuotes: (quotes) => set({ quotes }),
    selectTicker: (ticker) => set({ selectedTicker: ticker }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

    toggleWatchlist: (ticker) => {
      const cur = get().watchlist;
      const upper = ticker.toUpperCase();
      const next = cur.includes(upper) ? cur.filter(t => t !== upper) : [...cur, upper];
      set({ watchlist: next });
      try {
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
    }
  };
});
