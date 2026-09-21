import { StockQuote, HistoricalPoint, GlobalExchangeInfo } from '../types/stock';
import { calculateAllIndicators } from './technicalAnalysis';
import { STOCK_DIRECTORY, DirectoryStockItem } from './stockDirectory';

export const GLOBAL_EXCHANGES: GlobalExchangeInfo[] = [
  { code: 'US', name: 'New York (NYSE / NASDAQ)', city: 'New York', country: 'United States', flag: '🇺🇸', timezone: 'EST', currency: 'USD', currencySymbol: '$', isOpen: true },
  { code: 'TW', name: 'Taiwan Stock Exchange (TWSE)', city: 'Taipei', country: 'Taiwan', flag: '🇹🇼', timezone: 'CST', currency: 'TWD', currencySymbol: 'NT$', isOpen: false },
  { code: 'KR', name: 'Korea Exchange (KRX)', city: 'Seoul', country: 'South Korea', flag: '🇰🇷', timezone: 'KST', currency: 'KRW', currencySymbol: '₩', isOpen: false },
  { code: 'UK', name: 'London Stock Exchange (LSE)', city: 'London', country: 'United Kingdom', flag: '🇬🇧', timezone: 'GMT', currency: 'GBP', currencySymbol: '£', isOpen: true },
  { code: 'NZ', name: 'New Zealand Exchange (NZX)', city: 'Auckland', country: 'New Zealand', flag: '🇳🇿', timezone: 'NZST', currency: 'NZD', currencySymbol: 'NZ$', isOpen: false },
  { code: 'AU', name: 'Australian Securities Exchange (ASX)', city: 'Sydney', country: 'Australia', flag: '🇦🇺', timezone: 'AEST', currency: 'AUD', currencySymbol: 'A$', isOpen: false },
  { code: 'JP', name: 'Tokyo Stock Exchange (TSE)', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', timezone: 'JST', currency: 'JPY', currencySymbol: '¥', isOpen: false }
];

export function generateHistoricalSeries(basePrice: number): {
  '1D': HistoricalPoint[];
  '1W': HistoricalPoint[];
  '1M': HistoricalPoint[];
  '1Y': HistoricalPoint[];
  'ALL': HistoricalPoint[];
} {
  const d1: HistoricalPoint[] = [];
  let cur1D = basePrice * 0.995;
  const times = [
    '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  times.forEach(t => {
    const delta = (Math.random() - 0.48) * (basePrice * 0.005);
    cur1D = Math.max(0.01, cur1D + delta);
    d1.push({
      date: t,
      price: Number(cur1D.toFixed(2)),
      volume: Math.floor(Math.random() * 250000 + 50000)
    });
  });

  const m1: HistoricalPoint[] = [];
  let cur1M = basePrice * 0.95;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const delta = (Math.random() - 0.47) * (basePrice * 0.018);
    cur1M = Math.max(0.01, cur1M + delta);
    m1.push({
      date: dateStr,
      price: Number(cur1M.toFixed(2)),
      volume: Math.floor(Math.random() * 8000000 + 2000000)
    });
  }

  const w1 = m1.slice(-7);

  const y1: HistoricalPoint[] = [];
  let cur1Y = basePrice * 0.82;
  for (let i = 52; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const delta = (Math.random() - 0.46) * (basePrice * 0.03);
    cur1Y = Math.max(0.01, cur1Y + delta);
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

  STOCK_DIRECTORY.forEach((item: DirectoryStockItem) => {
    const history = generateHistoricalSeries(item.basePrice);
    const indicators = calculateAllIndicators(history['1M']);
    
    const prevClose = Number((item.basePrice * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2));
    const change = Number((item.basePrice - prevClose).toFixed(2));
    const changePercent = prevClose > 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

    const high = Number((Math.max(item.basePrice, prevClose) * 1.012).toFixed(2));
    const low = Number((Math.min(item.basePrice, prevClose) * 0.988).toFixed(2));
    const open = Number((prevClose * (1 + (Math.random() * 0.008 - 0.004))).toFixed(2));

    db[item.ticker.toUpperCase()] = {
      ticker: item.ticker.toUpperCase(),
      name: item.name,
      exchange: item.exchange,
      country: item.country,
      countryCode: item.countryCode,
      currency: item.currency,
      currencySymbol: item.currencySymbol,
      price: item.basePrice,
      change,
      changePercent,
      high,
      low,
      open,
      previousClose: prevClose,
      volume: Math.floor(Math.random() * 15000000 + 5000000),
      marketCap: item.marketCap || 'N/A',
      peRatio: item.peRatio || 25.0,
      sector: item.sector,
      indicators,
      history,
      lastUpdated: new Date().toLocaleTimeString()
    };
  });

  return db;
}
