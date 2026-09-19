import { create } from 'zustand';
import { Position, PortfolioSummary, Transaction } from '../types/portfolio';
import { StockQuote } from '../types/stock';

interface PortfolioState {
  positions: Position[];
  cashBalance: number;
  transactions: Transaction[];
  addPosition: (pos: Omit<Position, 'id'>) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  deletePosition: (id: string) => void;
  loadStarterPracticePortfolio: () => void;
  clearPortfolio: () => void;
  getSummary: (marketQuotes: Record<string, StockQuote>) => PortfolioSummary;
}

const STORAGE_KEY = 'investlearn_portfolio_v1';

const loadSavedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load portfolio from storage', e);
  }
  return {
    positions: [],
    cashBalance: 10000,
    transactions: []
  };
};

export const usePortfolioStore = create<PortfolioState>((set, get) => {
  const initial = loadSavedState();

  const save = (positions: Position[], cashBalance: number, transactions: Transaction[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ positions, cashBalance, transactions }));
    } catch (e) {
      console.error('Failed to persist portfolio', e);
    }
  };

  return {
    positions: initial.positions,
    cashBalance: initial.cashBalance,
    transactions: initial.transactions,

    addPosition: (posData) => {
      const id = 'pos_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const newPos: Position = { ...posData, id };
      const currentPositions = get().positions;

      // Check if position already exists for this ticker -> update average price & shares
      const existingIndex = currentPositions.findIndex(p => p.ticker.toUpperCase() === posData.ticker.toUpperCase());
      let updatedPositions: Position[];

      if (existingIndex >= 0) {
        const existing = currentPositions[existingIndex];
        const totalCost = (existing.shares * existing.averageBuyPrice) + (posData.shares * posData.averageBuyPrice);
        const totalShares = existing.shares + posData.shares;
        const newAvg = Number((totalCost / totalShares).toFixed(2));
        
        updatedPositions = [...currentPositions];
        updatedPositions[existingIndex] = {
          ...existing,
          shares: totalShares,
          averageBuyPrice: newAvg,
          notes: posData.notes || existing.notes
        };
      } else {
        updatedPositions = [newPos, ...currentPositions];
      }

      // Record transaction
      const txCost = posData.shares * posData.averageBuyPrice;
      const newCash = Math.max(0, get().cashBalance - txCost);
      const newTx: Transaction = {
        id: 'tx_' + Date.now(),
        type: 'BUY',
        ticker: posData.ticker,
        companyName: posData.companyName,
        shares: posData.shares,
        price: posData.averageBuyPrice,
        date: posData.purchaseDate || new Date().toISOString().split('T')[0],
        total: txCost
      };
      const updatedTxs = [newTx, ...get().transactions];

      set({ positions: updatedPositions, cashBalance: newCash, transactions: updatedTxs });
      save(updatedPositions, newCash, updatedTxs);
    },

    updatePosition: (id, updates) => {
      const updated = get().positions.map(p => p.id === id ? { ...p, ...updates } : p);
      set({ positions: updated });
      save(updated, get().cashBalance, get().transactions);
    },

    deletePosition: (id) => {
      const target = get().positions.find(p => p.id === id);
      if (!target) return;
      const updated = get().positions.filter(p => p.id !== id);
      // Refund cash equivalent of original basis or keep cash
      const newCash = get().cashBalance + (target.shares * target.averageBuyPrice);
      const newTx: Transaction = {
        id: 'tx_' + Date.now(),
        type: 'SELL',
        ticker: target.ticker,
        companyName: target.companyName,
        shares: target.shares,
        price: target.averageBuyPrice,
        date: new Date().toISOString().split('T')[0],
        total: target.shares * target.averageBuyPrice
      };
      const updatedTxs = [newTx, ...get().transactions];

      set({ positions: updated, cashBalance: newCash, transactions: updatedTxs });
      save(updated, newCash, updatedTxs);
    },

    loadStarterPracticePortfolio: () => {
      const starterPositions: Position[] = [
        {
          id: 'pos_starter_spy',
          ticker: 'SPY',
          companyName: 'SPDR S&P 500 ETF',
          shares: 5,
          averageBuyPrice: 545.20,
          purchaseDate: '2026-08-15',
          notes: 'Foundational diversified core index'
        },
        {
          id: 'pos_starter_aapl',
          ticker: 'AAPL',
          companyName: 'Apple Inc.',
          shares: 8,
          averageBuyPrice: 215.00,
          purchaseDate: '2026-08-20',
          notes: 'Strong cash flow tech leader'
        },
        {
          id: 'pos_starter_nvda',
          ticker: 'NVDA',
          companyName: 'NVIDIA Corporation',
          shares: 10,
          averageBuyPrice: 112.50,
          purchaseDate: '2026-08-28',
          notes: 'AI infrastructure growth'
        }
      ];

      const totalCost = starterPositions.reduce((sum, p) => sum + p.shares * p.averageBuyPrice, 0);
      const remainingCash = Math.max(1000, 10000 - totalCost);
      set({ positions: starterPositions, cashBalance: remainingCash });
      save(starterPositions, remainingCash, get().transactions);
    },

    clearPortfolio: () => {
      set({ positions: [], cashBalance: 10000, transactions: [] });
      save([], 10000, []);
    },

    getSummary: (quotes) => {
      const positions = get().positions;
      let totalInvested = 0;
      let currentValue = 0;
      let dayChange = 0;

      positions.forEach(pos => {
        const invested = pos.shares * pos.averageBuyPrice;
        totalInvested += invested;

        const quote = quotes[pos.ticker.toUpperCase()];
        const curPrice = quote ? quote.price : pos.averageBuyPrice;
        const curStockDayChange = quote ? quote.change : 0;

        const equity = pos.shares * curPrice;
        currentValue += equity;
        dayChange += (pos.shares * curStockDayChange);
      });

      const totalProfitLoss = currentValue - totalInvested;
      const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
      const dayChangePercent = currentValue > 0 ? (dayChange / (currentValue - dayChange)) * 100 : 0;

      return {
        totalInvested: Number(totalInvested.toFixed(2)),
        currentValue: Number(currentValue.toFixed(2)),
        totalProfitLoss: Number(totalProfitLoss.toFixed(2)),
        totalProfitLossPercent: Number(totalProfitLossPercent.toFixed(2)),
        dayChange: Number(dayChange.toFixed(2)),
        dayChangePercent: Number(dayChangePercent.toFixed(2)),
        cashBalance: Number(get().cashBalance.toFixed(2)),
        holdingsCount: positions.length
      };
    }
  };
});
