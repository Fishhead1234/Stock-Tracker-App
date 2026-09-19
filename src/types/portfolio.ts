export interface Position {
  id: string;
  ticker: string;
  companyName: string;
  exchange: string;
  currency: string;
  currencySymbol: string;
  shares: number;
  averageBuyPrice: number;
  purchaseDate: string;
  notes?: string;
  targetSellPrice?: number;
  stopLossPrice?: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  cashBalance: number;
  holdingsCount: number;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  ticker: string;
  companyName: string;
  exchange: string;
  currencySymbol: string;
  shares: number;
  price: number;
  date: string;
  total: number;
}
