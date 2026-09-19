export interface HistoricalPoint {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number; // 0-100 (Relative Strength Index)
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
    crossover: 'bullish' | 'bearish' | 'neutral';
  };
  sma20: number;
  sma50: number;
  sma200: number;
  volumeAverage20: number;
  volumeSurgeRatio: number; // currentVolume / volumeAverage20
  high52Week: number;
  low52Week: number;
}

export interface StockQuote {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  marketCap: string;
  peRatio: number;
  sector: string;
  indicators: TechnicalIndicators;
  history: {
    '1D': HistoricalPoint[];
    '1W': HistoricalPoint[];
    '1M': HistoricalPoint[];
    '1Y': HistoricalPoint[];
    'ALL': HistoricalPoint[];
  };
  lastUpdated: string;
}

export type MarketStatus = 'open' | 'closed' | 'simulated';
