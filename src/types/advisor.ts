export interface InvestorProfile {
  goal?: 'safe_growth' | 'tech_growth' | 'dividends' | 'learning';
  riskTolerance?: 'low' | 'moderate' | 'high';
  horizon?: 'short' | 'medium' | 'long';
  interests?: string[];
  monthlyBudget?: string;
}

export interface StockRecommendationCard {
  ticker: string;
  name: string;
  exchange: string;
  currentPrice: number;
  currencySymbol: string;
  changePercent: number;
  matchScore: number; // e.g. 96
  matchTier: 'FOUNDATION' | 'GROWTH' | 'DIVIDEND' | 'BALANCED';
  whyFitsYou: string;
  actionPlan: string[];
  timingTip?: string;
}

export interface AdvisorMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
  recommendations?: StockRecommendationCard[];
  quickReplies?: Array<{ id: string; label: string; prompt: string }>;
}
