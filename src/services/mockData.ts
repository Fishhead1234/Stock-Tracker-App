import { StockQuote, HistoricalPoint, GlobalExchangeInfo } from '../types/stock';
import { calculateAllIndicators } from './technicalAnalysis';

export const GLOBAL_EXCHANGES: GlobalExchangeInfo[] = [
  { code: 'US', name: 'New York (NYSE / NASDAQ)', city: 'New York', country: 'United States', flag: '🇺🇸', timezone: 'EST', currency: 'USD', currencySymbol: '$', isOpen: true },
  { code: 'TW', name: 'Taiwan Stock Exchange (TWSE)', city: 'Taipei', country: 'Taiwan', flag: '🇹🇼', timezone: 'CST', currency: 'TWD', currencySymbol: 'NT$', isOpen: false },
  { code: 'KR', name: 'Korea Exchange (KRX)', city: 'Seoul', country: 'South Korea', flag: '🇰🇷', timezone: 'KST', currency: 'KRW', currencySymbol: '₩', isOpen: false },
  { code: 'UK', name: 'London Stock Exchange (LSE)', city: 'London', country: 'United Kingdom', flag: '🇬🇧', timezone: 'GMT', currency: 'GBP', currencySymbol: '£', isOpen: true },
  { code: 'NZ', name: 'New Zealand Exchange (NZX)', city: 'Auckland', country: 'New Zealand', flag: '🇳🇿', timezone: 'NZST', currency: 'NZD', currencySymbol: 'NZ$', isOpen: false },
  { code: 'AU', name: 'Australian Securities Exchange (ASX)', city: 'Sydney', country: 'Australia', flag: '🇦🇺', timezone: 'AEST', currency: 'AUD', currencySymbol: 'A$', isOpen: false },
  { code: 'JP', name: 'Tokyo Stock Exchange (TSE)', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', timezone: 'JST', currency: 'JPY', currencySymbol: '¥', isOpen: false }
];

interface GlobalStockSeed {
  ticker: string;
  name: string;
  exchange: string;
  country: string;
  countryCode: 'TW' | 'KR' | 'US' | 'UK' | 'NZ' | 'AU' | 'JP';
  currency: string;
  currencySymbol: string;
  basePrice: number;
  sector: string;
  marketCap: string;
  peRatio: number;
  trend: 'bull' | 'bear' | 'oversold' | 'overbought' | 'range';
}

const GLOBAL_STOCK_SEEDS: GlobalStockSeed[] = [
  // 🇹🇼 TAIWAN (TWSE)
  { ticker: '2330.TW', name: 'Taiwan Semiconductor (TSMC)', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 980.00, sector: 'Semiconductors', marketCap: 'NT$25.4T', peRatio: 28.5, trend: 'bull' },
  { ticker: '2317.TW', name: 'Hon Hai Precision (Foxconn)', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 185.50, sector: 'Hardware & Electronics', marketCap: 'NT$2.57T', peRatio: 16.2, trend: 'range' },
  { ticker: '2454.TW', name: 'MediaTek Inc.', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 1210.00, sector: 'Semiconductors & AI', marketCap: 'NT$1.93T', peRatio: 21.0, trend: 'bull' },
  { ticker: '0050.TW', name: 'Yuanta Taiwan Top 50 ETF', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 182.40, sector: 'Broad Market ETF', marketCap: 'NT$410B', peRatio: 24.1, trend: 'bull' },
  { ticker: '2881.TW', name: 'Fubon Financial Holding', exchange: 'TWSE', country: 'Taiwan', countryCode: 'TW', currency: 'TWD', currencySymbol: 'NT$', basePrice: 88.50, sector: 'Financial Services', marketCap: 'NT$1.15T', peRatio: 10.5, trend: 'range' },

  // 🇰🇷 SOUTH KOREA (KRX / KOSPI)
  { ticker: '005930.KS', name: 'Samsung Electronics', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 65200, sector: 'Technology & Chips', marketCap: '₩440T', peRatio: 14.8, trend: 'oversold' },
  { ticker: '000660.KS', name: 'SK Hynix', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 161000, sector: 'HBM & Memory', marketCap: '₩117T', peRatio: 19.4, trend: 'bull' },
  { ticker: '373220.KS', name: 'LG Energy Solution', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 395000, sector: 'EV Battery Tech', marketCap: '₩92T', peRatio: 52.0, trend: 'oversold' },
  { ticker: '005380.KS', name: 'Hyundai Motor', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 238000, sector: 'Automotive & EVs', marketCap: '₩49T', peRatio: 5.6, trend: 'range' },
  { ticker: '035420.KS', name: 'NAVER Corporation', exchange: 'KRX', country: 'South Korea', countryCode: 'KR', currency: 'KRW', currencySymbol: '₩', basePrice: 168500, sector: 'Internet & Cloud', marketCap: '₩27T', peRatio: 22.0, trend: 'oversold' },

  // 🇺🇸 UNITED STATES (NYSE / NASDAQ)
  { ticker: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 124.30, sector: 'Technology & AI', marketCap: '$3.06T', peRatio: 48.2, trend: 'bull' },
  { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 228.50, sector: 'Consumer Tech', marketCap: '$3.45T', peRatio: 33.8, trend: 'range' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 428.10, sector: 'Software & Cloud', marketCap: '$3.18T', peRatio: 35.1, trend: 'bull' },
  { ticker: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 218.40, sector: 'Automotive & Clean Energy', marketCap: '$698B', peRatio: 64.5, trend: 'oversold' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 186.20, sector: 'E-Commerce & AWS', marketCap: '$1.94T', peRatio: 42.0, trend: 'bull' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 162.80, sector: 'Search & AI', marketCap: '$2.02T', peRatio: 23.5, trend: 'range' },
  { ticker: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 512.60, sector: 'Social Media & AI', marketCap: '$1.30T', peRatio: 26.4, trend: 'overbought' },
  { ticker: 'SOFI', name: 'SoFi Technologies, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 16.96, sector: 'Fintech & Digital Banking', marketCap: '$18.2B', peRatio: 42.1, trend: 'bull' },
  { ticker: 'PLUG', name: 'Plug Power Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 2.15, sector: 'Clean Energy & Hydrogen', marketCap: '$1.92B', peRatio: -3.5, trend: 'oversold' },
  { ticker: 'RIVN', name: 'Rivian Automotive', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 13.80, sector: 'EV & Clean Mobility', marketCap: '$14.1B', peRatio: -5.2, trend: 'oversold' },
  { ticker: 'COIN', name: 'Coinbase Global, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 220.50, sector: 'Fintech & Crypto', marketCap: '$54.0B', peRatio: 38.4, trend: 'bull' },
  { ticker: 'HOOD', name: 'Robinhood Markets', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 24.20, sector: 'Retail Trading & Fintech', marketCap: '$21.2B', peRatio: 45.0, trend: 'bull' },
  { ticker: 'ARM', name: 'Arm Holdings plc', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 142.30, sector: 'Semiconductors & IP', marketCap: '$148B', peRatio: 92.0, trend: 'bull' },
  { ticker: 'SMCI', name: 'Super Micro Computer', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 48.60, sector: 'AI Hardware & Servers', marketCap: '$28.5B', peRatio: 18.2, trend: 'oversold' },
  { ticker: 'PLTR', name: 'Palantir Technologies', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 34.80, sector: 'Enterprise AI & Defense', marketCap: '$78.0B', peRatio: 95.0, trend: 'bull' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 154.20, sector: 'Semiconductors', marketCap: '$249B', peRatio: 110.4, trend: 'range' },
  { ticker: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 21.40, sector: 'Semiconductors & Foundry', marketCap: '$92.0B', peRatio: 44.0, trend: 'oversold' },
  { ticker: 'CRWD', name: 'CrowdStrike Holdings', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 288.50, sector: 'Cybersecurity & Cloud', marketCap: '$71.2B', peRatio: 78.5, trend: 'bull' },
  { ticker: 'SNOW', name: 'Snowflake Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 122.40, sector: 'Cloud Data Platform', marketCap: '$41.5B', peRatio: -32.0, trend: 'oversold' },
  { ticker: 'DKNG', name: 'DraftKings Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 41.20, sector: 'Digital Entertainment', marketCap: '$20.1B', peRatio: 52.0, trend: 'bull' },
  { ticker: 'BABA', name: 'Alibaba Group (ADR)', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 88.60, sector: 'Global E-Commerce & Cloud', marketCap: '$215B', peRatio: 12.8, trend: 'oversold' },
  { ticker: 'TSM', name: 'Taiwan Semiconductor (ADR)', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 172.50, sector: 'Semiconductors (US ADR)', marketCap: '$890B', peRatio: 27.5, trend: 'bull' },
  { ticker: 'NIO', name: 'NIO Inc. (ADR)', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 5.60, sector: 'Automotive & EVs', marketCap: '$11.8B', peRatio: -4.5, trend: 'oversold' },
  { ticker: 'DIS', name: 'The Walt Disney Company', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 94.20, sector: 'Entertainment & Parks', marketCap: '$171B', peRatio: 38.4, trend: 'range' },
  { ticker: 'NFLX', name: 'Netflix, Inc.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 704.50, sector: 'Streaming & Entertainment', marketCap: '$304B', peRatio: 42.1, trend: 'bull' },
  { ticker: 'NKE', name: 'Nike, Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 82.50, sector: 'Apparel & Footwear', marketCap: '$124B', peRatio: 23.0, trend: 'oversold' },
  { ticker: 'COST', name: 'Costco Wholesale Corp.', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 912.00, sector: 'Consumer Retail', marketCap: '$404B', peRatio: 54.0, trend: 'bull' },
  { ticker: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 78.40, sector: 'Consumer Retail', marketCap: '$630B', peRatio: 32.5, trend: 'bull' },
  { ticker: 'UBER', name: 'Uber Technologies', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 74.80, sector: 'Mobility & Delivery', marketCap: '$156B', peRatio: 35.0, trend: 'bull' },
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 561.40, sector: 'Broad Market ETF', marketCap: '$570B', peRatio: 26.1, trend: 'bull' },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq 100)', exchange: 'NASDAQ', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 480.90, sector: 'Tech Benchmark ETF', marketCap: '$290B', peRatio: 31.2, trend: 'bull' },
  { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', exchange: 'NYSE', country: 'United States', countryCode: 'US', currency: 'USD', currencySymbol: '$', basePrice: 515.20, sector: 'Broad Market Index ETF', marketCap: '$480B', peRatio: 26.0, trend: 'bull' },

  // 🇬🇧 UNITED KINGDOM (LSE)
  { ticker: 'AZN.L', name: 'AstraZeneca plc', exchange: 'LSE', country: 'United Kingdom', countryCode: 'UK', currency: 'GBP', currencySymbol: '£', basePrice: 122.40, sector: 'Pharmaceuticals', marketCap: '£189B', peRatio: 36.2, trend: 'bull' },
  { ticker: 'SHEL.L', name: 'Shell plc', exchange: 'LSE', country: 'United Kingdom', countryCode: 'UK', currency: 'GBP', currencySymbol: '£', basePrice: 25.80, sector: 'Energy & Transition', marketCap: '£162B', peRatio: 11.4, trend: 'range' },
  { ticker: 'HSBA.L', name: 'HSBC Holdings plc', exchange: 'LSE', country: 'United Kingdom', countryCode: 'UK', currency: 'GBP', currencySymbol: '£', basePrice: 6.70, sector: 'Banking & Global Finance', marketCap: '£124B', peRatio: 7.2, trend: 'range' },
  { ticker: 'ULVR.L', name: 'Unilever plc', exchange: 'LSE', country: 'United Kingdom', countryCode: 'UK', currency: 'GBP', currencySymbol: '£', basePrice: 48.20, sector: 'Consumer Goods', marketCap: '£120B', peRatio: 20.8, trend: 'bull' },

  // 🇳🇿 NEW ZEALAND (NZX) & 🇦🇺 AUSTRALIA (ASX)
  { ticker: 'FPH.NZ', name: 'Fisher & Paykel Healthcare', exchange: 'NZX', country: 'New Zealand', countryCode: 'NZ', currency: 'NZD', currencySymbol: 'NZ$', basePrice: 35.80, sector: 'Medical Devices', marketCap: 'NZ$20.8B', peRatio: 44.1, trend: 'bull' },
  { ticker: 'AIR.NZ', name: 'Air New Zealand', exchange: 'NZX', country: 'New Zealand', countryCode: 'NZ', currency: 'NZD', currencySymbol: 'NZ$', basePrice: 0.54, sector: 'Aviation & Travel', marketCap: 'NZ$1.8B', peRatio: 12.0, trend: 'oversold' },
  { ticker: 'SPK.NZ', name: 'Spark New Zealand', exchange: 'NZX', country: 'New Zealand', countryCode: 'NZ', currency: 'NZD', currencySymbol: 'NZ$', basePrice: 3.25, sector: 'Telecommunications', marketCap: 'NZ$6.1B', peRatio: 18.0, trend: 'oversold' },
  { ticker: 'BHP.AX', name: 'BHP Group Limited', exchange: 'ASX', country: 'Australia', countryCode: 'AU', currency: 'AUD', currencySymbol: 'A$', basePrice: 41.50, sector: 'Mining & Resources', marketCap: 'A$210B', peRatio: 11.8, trend: 'range' },
  { ticker: 'CBA.AX', name: 'Commonwealth Bank', exchange: 'ASX', country: 'Australia', countryCode: 'AU', currency: 'AUD', currencySymbol: 'A$', basePrice: 142.80, sector: 'Financial Services', marketCap: 'A$238B', peRatio: 23.5, trend: 'overbought' },

  // 🇯🇵 JAPAN (TSE)
  { ticker: '7203.T', name: 'Toyota Motor Corp.', exchange: 'TSE', country: 'Japan', countryCode: 'JP', currency: 'JPY', currencySymbol: '¥', basePrice: 2680, sector: 'Automotive & Hybrid', marketCap: '¥41T', peRatio: 9.8, trend: 'range' },
  { ticker: '6758.T', name: 'Sony Group Corporation', exchange: 'TSE', country: 'Japan', countryCode: 'JP', currency: 'JPY', currencySymbol: '¥', basePrice: 13950, sector: 'Consumer Electronics & Gaming', marketCap: '¥17.2T', peRatio: 17.5, trend: 'bull' },
  { ticker: '9984.T', name: 'SoftBank Group Corp.', exchange: 'TSE', country: 'Japan', countryCode: 'JP', currency: 'JPY', currencySymbol: '¥', basePrice: 8750, sector: 'Tech & Vision Fund', marketCap: '¥12.8T', peRatio: 38.0, trend: 'bull' }
];

function generateHistoricalSeries(basePrice: number, trend: GlobalStockSeed['trend']): {
  '1D': HistoricalPoint[];
  '1W': HistoricalPoint[];
  '1M': HistoricalPoint[];
  '1Y': HistoricalPoint[];
  'ALL': HistoricalPoint[];
} {
  const d1: HistoricalPoint[] = [];
  let cur1D = basePrice * (1 + (trend === 'oversold' ? -0.015 : trend === 'overbought' ? 0.015 : 0.002));
  const times = [
    '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
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

  const w1 = m1.slice(-7);

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

  GLOBAL_STOCK_SEEDS.forEach(seed => {
    const history = generateHistoricalSeries(seed.basePrice, seed.trend);
    const indicators = calculateAllIndicators(history['1M']);
    
    const prevClose = Number((seed.basePrice * (1 + (Math.random() * 0.03 - 0.015))).toFixed(2));
    const change = Number((seed.basePrice - prevClose).toFixed(2));
    const changePercent = Number(((change / prevClose) * 100).toFixed(2));

    const high = Number((Math.max(seed.basePrice, prevClose) * 1.015).toFixed(2));
    const low = Number((Math.min(seed.basePrice, prevClose) * 0.985).toFixed(2));
    const open = Number((prevClose * (1 + (Math.random() * 0.01 - 0.005))).toFixed(2));

    db[seed.ticker] = {
      ticker: seed.ticker,
      name: seed.name,
      exchange: seed.exchange,
      country: seed.country,
      countryCode: seed.countryCode,
      currency: seed.currency,
      currencySymbol: seed.currencySymbol,
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
