export type NewsCategory = 'EARNINGS' | 'MACRO' | 'TECH' | 'MERGER' | 'REGULATION';
export type NewsSentiment = 'BULLISH' | 'NEUTRAL' | 'BEARISH';
export type NewsImpact = 'HIGH' | 'MEDIUM' | 'LOW';

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  educationalTakeaway: string; // "Why this matters to stock buyers"
  ticker?: string;             // e.g. "NVDA", "AAPL", "PLTR", "SPY"
  companyName?: string;
  category: NewsCategory;
  sentiment: NewsSentiment;
  impact: NewsImpact;
  timestamp: string;
  source: string;              // e.g. "SEC 10-Q Filing Analysis", "Fed Reserve Policy", "Earnings Webcast"
  url?: string;
}

export interface MarketPulse {
  sentiment: string;
  sentimentScore: number;      // 0 to 100
  keyThemes: string[];
  fedWatchStatus: string;
}
