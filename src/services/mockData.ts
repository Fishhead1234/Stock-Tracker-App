import { StockQuote, HistoricalPoint } from '../types/stock';
import { calculateAllIndicators } from './technicalAnalysis';

interface StockSeedConfig {
  ticker: string;
  name: string;
  basePrice: number;
  sector: string;
  marketCap: string;
  peRatio: number;
  trend: 'bull' | 'bear' | 'oversold' | 'overbought' | 'range';
}

const STOCK_SEEDS: StockSeedConfig[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', basePrice: 228.50, sector: 'Technology', marketCap: '$3.45T', peRatio: 33.8, trend: 'range' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', basePrice: 124.30, sector: 'Technology', marketCap: '$3.06T', peRatio: 48.2, trend: 'bull' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', basePrice: 428.10, sector: 'Technology', marketCap: '$3.18T', peRatio: 35.1, trend: 'bull' },
  { ticker: 'TSLA', name: 'Tesla, Inc.', basePrice: 218.40, sector: 'Automotive & Tech', marketCap: '$698B', peRatio: 64.5, trend: 'oversold' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', basePrice: 186.20, sector: 'Consumer Cyclical', marketCap: '$1.94T', peRatio: 42.0, trend: 'bull' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', basePrice: 162.80, sector: 'Communication', marketCap: '$2.02T', peRatio: 23.5, trend: 'range' },
  { ticker: 'META', name: 'Meta Platforms Inc.', basePrice: 512.60, sector: 'Communication', marketCap: '$1.30T', peRatio: 26.4, trend: 'overbought' },
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', basePrice: 561.40, sector: 'Index ETF', marketCap: '$570B', peRatio: 26.1, trend: 'bull' },
  { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', basePrice: 515.20, sector: 'Index ETF', marketCap: '$480B', peRatio: 26.0, trend: 'bull' },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust', basePrice: 480.90, sector: 'Index ETF', marketCap: '$290B', peRatio: 31.2, trend: 'bull' },
  { ticker: 'PLTR', name: 'Palantir Technologies', basePrice: 32.50, sector: 'Technology & AI', marketCap: '$72B', peRatio: 88.0, trend: 'bull' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', basePrice: 154.20, sector: 'Technology', marketCap: '$249B', peRatio: 110.4, trend: 'oversold' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', basePrice: 214.80, sector: 'Financials', marketCap: '$612B', peRatio: 12.3, trend: 'bull' },
  { ticker: 'V', name: 'Visa Inc.', basePrice: 284.60, sector: 'Financials', marketCap: '$578B', peRatio: 30.1, trend: 'range' },
  { ticker: 'LLY', name: 'Eli Lilly and Company', basePrice: 918.40, sector: 'Healthcare', marketCap: '$872B', peRatio: 112.0, trend: 'overbought' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', basePrice: 161.70, sector: 'Healthcare', marketCap: '$389B', peRatio: 18.2, trend: 'range' },
  { ticker: 'DIS', name: 'The Walt Disney Company', basePrice: 92.40, sector: 'Entertainment', marketCap: '$168B', peRatio: 38.4, trend: 'oversold' },
  { ticker: 'NFLX', name: 'Netflix, Inc.', basePrice: 698.50, sector: 'Entertainment', marketCap: '$301B', peRatio: 41.5, trend: 'bull' },
  { ticker: 'SBUX', name: 'Starbucks Corporation', basePrice: 95.80, sector: 'Consumer Defensive', marketCap: '$108B', peRatio: 26.5, trend: 'range' },
  { ticker: 'NKE', name: 'Nike, Inc.', basePrice: 83.10, sector: 'Consumer Cyclical', marketCap: '$125B', peRatio: 23.0, trend: 'oversold' },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway Inc.', basePrice: 452.30, sector: 'Financials', marketCap: '$990B', peRatio: 21.0, trend: 'bull' },
  { ticker: 'NEE', name: 'NextEra Energy (Clean Energy)', basePrice: 79.60, sector: 'Utilities & Clean Energy', marketCap: '$164B', peRatio: 24.1, trend: 'range' }
];

function generateHistoricalSeries(basePrice: number, trend: StockSeedConfig['trend']): {
  '1D': HistoricalPoint[];
  '1W': HistoricalPoint[];
  '1M': HistoricalPoint[];
  '1Y': HistoricalPoint[];
  'ALL': HistoricalPoint[];
} {
  // 1D: 24 intraday 15-min intervals
  const d1: HistoricalPoint[] = [];
  let cur1D = basePrice * (1 + (trend === 'oversold' ? -0.015 : trend === 'overbought' ? 0.015 : 0.002));
  const times = [
    '09:30', '09:45', '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:15', '15:30', '15:45', '16:00'
  ];

  times.forEach(t => {
    const delta = (Math.random() - 0.48) * (basePrice * 0.006);
    cur1D = Math.max(1, cur1D + delta);
    d1.push({
      date: t,
      price: Number(cur1D.toFixed(2)),
      volume: Math.floor(Math.random() * 250000 + 50000)
    });
  });

  // 1M: 30 days daily
  const m1: HistoricalPoint[] = [];
  let cur1M = basePrice * (trend === 'bull' ? 0.92 : trend === 'oversold' ? 1.12 : trend === 'overbought' ? 0.88 : 0.98);
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const drift = trend === 'bull' ? 0.004 : trend === 'oversold' ? -0.006 : trend === 'overbought' ? 0.005 : 0.0005;
    const delta = (Math.random() - 0.48 + drift) * (basePrice * 0.02);
    cur1M = Math.max(1, cur1M + delta);
    m1.push({
      date: dateStr,
      price: Number(cur1M.toFixed(2)),
      volume: Math.floor(Math.random() * 8000000 + 2000000)
    });
  }

  // 1W: 7 days
  const w1 = m1.slice(-7);

  // 1Y: 52 weekly points
  const y1: HistoricalPoint[] = [];
  let cur1Y = basePrice * (trend === 'bull' ? 0.75 : trend === 'oversold' ? 1.25 : 0.90);
  for (let i = 52; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const drift = trend === 'bull' ? 0.007 : trend === 'oversold' ? -0.005 : 0.002;
    const delta = (Math.random() - 0.47 + drift) * (basePrice * 0.035);
    cur1Y = Math.max(1, cur1Y + delta);
    y1.push({
      date: dateStr,
      price: Number(cur1Y.toFixed(2)),
      volume: Math.floor(Math.random() * 25000000 + 8000000)
    });
  }

  // Ensure latest points end near basePrice
  if (d1.length > 0) d1[d1.length - 1].price = basePrice;
  if (m1.length > 0) m1[m1.length - 1].price = basePrice;
  if (y1.length > 0) y1[y1.length - 1].price = basePrice;

  return {
    '1D': d1,
    '1W': w1,
    '1M': m1,
    '1Y': y1,
    'ALL': y1
  };
}

export function buildMockStockDatabase(): Record<string, StockQuote> {
  const db: Record<string, StockQuote> = {};

  STOCK_SEEDS.forEach(seed => {
    const history = generateHistoricalSeries(seed.basePrice, seed.trend);
    const indicators = calculateAllIndicators(history['1M']);
    
    const prevClose = Number((seed.basePrice * (1 + (Math.random() * 0.04 - 0.02))).toFixed(2));
    const change = Number((seed.basePrice - prevClose).toFixed(2));
    const changePercent = Number(((change / prevClose) * 100).toFixed(2));

    const high = Number((Math.max(seed.basePrice, prevClose) * 1.015).toFixed(2));
    const low = Number((Math.min(seed.basePrice, prevClose) * 0.985).toFixed(2));
    const open = Number((prevClose * (1 + (Math.random() * 0.01 - 0.005))).toFixed(2));

    db[seed.ticker] = {
      ticker: seed.ticker,
      name: seed.name,
      price: seed.basePrice,
      change,
      changePercent,
      high,
      low,
      open,
      previousClose: prevClose,
      volume: Math.floor(Math.random() * 15000000 + 5000000),
      marketCap: seed.marketCap,
      peRatio: seed.peRatio,
      sector: seed.sector,
      indicators,
      history,
      lastUpdated: new Date().toLocaleTimeString()
    };
  });

  return db;
}
