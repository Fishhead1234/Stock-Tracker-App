export type SignalAction = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'TRIM' | 'STRONG_SELL';

export type IndicatorCategory = 'RSI' | 'MACD' | 'SMA' | 'VOLUME' | 'SENTIMENT';

export interface SignalReason {
  indicator: IndicatorCategory;
  summary: string;
  detail: string;
  plainEnglishAnalogy: string;
  bullish: boolean;
}

export interface StockSignal {
  ticker: string;
  companyName: string;
  currentPrice: number;
  action: SignalAction;
  score: number; // 0 to 100
  title: string;
  summary: string;
  reasons: SignalReason[];
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  recommendedAction: string;
  educationalTip: string;
  timestamp: string;
}
