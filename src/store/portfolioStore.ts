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
  clearPortfolio: () => void;
  getSummary: (marketQuotes: Record<string, StockQuote>) => PortfolioSummary;
}

const STORAGE_KEY = 'investlearn_portfolio_v4';

const defaultPositions: Position[] = [];

const loadSavedState = () => {
  try {
    localStorage.removeItem('investlearn_portfolio_v2');
    localStorage.removeItem('investlearn_portfolio_v3');
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.positions) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load portfolio from storage', e);
  }
  return {
    positions: defaultPositions,
    cashBalance: 0,
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

      const txCost = posData.shares * posData.averageBuyPrice;
      const newTx: Transaction = {
        id: 'tx_' + Date.now(),
        type: 'BUY',
        ticker: posData.ticker,
        companyName: posData.companyName,
        exchange: posData.exchange || 'TWSE',
        currencySymbol: posData.currencySymbol || '$',
        shares: posData.shares,
        price: posData.averageBuyPrice,
        date: posData.purchaseDate || new Date().toISOString().split('T')[0],
        total: txCost
      };
      const updatedTxs = [newTx, ...get().transactions];

      set({ positions: updatedPositions, transactions: updatedTxs });
      save(updatedPositions, get().cashBalance, updatedTxs);
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
      const newTx: Transaction = {
        id: 'tx_' + Date.now(),
        type: 'SELL',
        ticker: target.ticker,
        companyName: target.companyName,
        exchange: target.exchange,
        currencySymbol: target.currencySymbol,
        shares: target.shares,
        price: target.averageBuyPrice,
        date: new Date().toISOString().split('T')[0],
        total: target.shares * target.averageBuyPrice
      };
      const updatedTxs = [newTx, ...get().transactions];

      set({ positions: updated, transactions: updatedTxs });
      save(updated, get().cashBalance, updatedTxs);
    },

    clearPortfolio: () => {
      set({ positions: [], cashBalance: 0, transactions: [] });
      save([], 0, []);
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
