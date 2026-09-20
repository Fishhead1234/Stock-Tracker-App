import { create } from 'zustand';
import { StockQuote } from '../types/stock';

interface MarketState {
  quotes: Record<string, StockQuote>;
  selectedTicker: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedCountry: string; // 'ALL' | 'TW' | 'KR' | 'US' | 'UK' | 'NZ' | 'AU' | 'JP'
  watchlist: string[];
  setQuotes: (quotes: Record<string, StockQuote>) => void;
  selectTicker: (ticker: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedCountry: (country: string) => void;
  toggleWatchlist: (ticker: string) => void;
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;
}

const WATCHLIST_STORAGE_KEY = 'investlearn_watchlist_v3';

export const useMarketStore = create<MarketState>((set, get) => {
  let savedWatchlist: string[] = ['NVDA', 'AAPL'];
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (raw) {
      savedWatchlist = JSON.parse(raw);
    } else {
      // Check for v2 migration
      const legacy = localStorage.getItem('investlearn_watchlist_v2');
      if (legacy) {
        savedWatchlist = JSON.parse(legacy);
      }
    }
  } catch (e) {
    console.error('Failed to load watchlist', e);
  }

  const persist = (list: string[]) => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  return {
    quotes: {},
    selectedTicker: null,
    searchQuery: '',
    selectedCategory: 'All',
    selectedCountry: 'ALL',
    watchlist: savedWatchlist,

    setQuotes: (quotes) => set({ quotes }),
    selectTicker: (ticker) => set({ selectedTicker: ticker }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    setSelectedCountry: (selectedCountry) => set({ selectedCountry }),

    addToWatchlist: (ticker) => {
      const upper = ticker.trim().toUpperCase();
      if (!upper) return;
      const cur = get().watchlist;
      if (!cur.includes(upper)) {
        const next = [upper, ...cur];
        set({ watchlist: next });
        persist(next);
      }
    },

    removeFromWatchlist: (ticker) => {
      const upper = ticker.trim().toUpperCase();
      const next = get().watchlist.filter(t => t.toUpperCase() !== upper);
      set({ watchlist: next });
      persist(next);
    },

    toggleWatchlist: (ticker) => {
      const upper = ticker.trim().toUpperCase();
      if (!upper) return;
      const cur = get().watchlist;
      const next = cur.includes(upper) 
        ? cur.filter(t => t.toUpperCase() !== upper) 
        : [upper, ...cur];
      set({ watchlist: next });
      persist(next);
    }
  };
});

