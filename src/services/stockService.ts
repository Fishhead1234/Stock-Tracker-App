import { StockQuote, GlobalExchangeInfo, HistoricalPoint } from '../types/stock';
import { buildMockStockDatabase, GLOBAL_EXCHANGES } from './mockData';
import { calculateAllIndicators } from './technicalAnalysis';

const CUSTOM_STOCKS_KEY = 'investlearn_custom_stocks_v1';

class StockService {
  private stockDatabase: Record<string, StockQuote> = {};
  private listeners: Array<(db: Record<string, StockQuote>) => void> = [];
  private simulationInterval: number | null = null;
  private currentDataSource: string = 'Universal Global Exchange Engine';

  constructor() {
    this.stockDatabase = buildMockStockDatabase();
    this.loadCustomStocks();
    this.startSimulation();
  }

  private loadCustomStocks() {
    try {
      const raw = localStorage.getItem(CUSTOM_STOCKS_KEY);
      if (raw) {
        const customList: StockQuote[] = JSON.parse(raw);
        customList.forEach(stk => {
          this.stockDatabase[stk.ticker.toUpperCase()] = stk;
        });
      }
    } catch (e) {
      console.error('Failed to load custom stocks from storage', e);
    }
  }

  public getAllStocks(): StockQuote[] {
    return Object.values(this.stockDatabase);
  }

  public getStock(ticker: string): StockQuote | undefined {
    return this.stockDatabase[ticker.toUpperCase()];
  }

  public getGlobalExchanges(): GlobalExchangeInfo[] {
    return GLOBAL_EXCHANGES;
  }

  public getStocksByCountry(countryCode: string): StockQuote[] {
    if (countryCode === 'ALL') return this.getAllStocks();
    return this.getAllStocks().filter(s => s.countryCode === countryCode);
  }

  /**
   * Smart global search with alias resolution
   */
  public searchStocks(query: string): StockQuote[] {
    const q = query.trim().toUpperCase();
    if (!q) return this.getAllStocks().slice(0, 10);

    // Common aliases mapping
    const aliasMap: Record<string, string[]> = {
      'TSM': ['2330.TW'],
      'TSMC': ['2330.TW'],
      '2330': ['2330.TW'],
      'FOXCONN': ['2317.TW'],
      'HON HAI': ['2317.TW'],
      '2317': ['2317.TW'],
      'MEDIATEK': ['2454.TW'],
      '2454': ['2454.TW'],
      'SAMSUNG': ['005930.KS'],
      '005930': ['005930.KS'],
      '5930': ['005930.KS'],
      'SK HYNIX': ['000660.KS'],
      'HYNIX': ['000660.KS'],
      '000660': ['000660.KS'],
      'HYUNDAI': ['005380.KS'],
      '005380': ['005380.KS'],
      'NAVER': ['035420.KS'],
      '035420': ['035420.KS'],
      'TOYOTA': ['7203.T'],
      '7203': ['7203.T'],
      'SONY': ['6758.T'],
      '6758': ['6758.T'],
      'SOFTBANK': ['9984.T'],
      '9984': ['9984.T'],
      'AIR NZ': ['AIR.NZ'],
      'AIR NEW ZEALAND': ['AIR.NZ'],
      'FISHER': ['FPH.NZ'],
      'F&P': ['FPH.NZ'],
      'SPARK': ['SPK.NZ'],
      'BHP': ['BHP.AX'],
      'COMMONWEALTH': ['CBA.AX'],
      'ASTRAZENECA': ['AZN.L'],
      'AZN': ['AZN.L'],
      'SHELL': ['SHEL.L'],
      'HSBC': ['HSBA.L'],
      'UNILEVER': ['ULVR.L']
    };

    const directAliases = aliasMap[q] || [];

    return this.getAllStocks().filter(s => {
      const tickerUpper = s.ticker.toUpperCase();
      const nameUpper = s.name.toUpperCase();
      const rawTicker = tickerUpper.split('.')[0];

      return (
        directAliases.includes(tickerUpper) ||
        tickerUpper.includes(q) ||
        rawTicker === q ||
        nameUpper.includes(q) ||
        s.exchange.toUpperCase().includes(q) ||
        s.country.toUpperCase().includes(q) ||
        s.sector.toUpperCase().includes(q)
      );
    });
  }

  /**
   * Adds any unlisted/custom stock that a user cannot find
   */
  public addCustomStock(params: {
    ticker: string;
    name: string;
    exchange: string;
    country: string;
    countryCode: 'TW' | 'KR' | 'US' | 'UK' | 'NZ' | 'AU' | 'JP';
    currency: string;
    currencySymbol: string;
    price: number;
    sector?: string;
  }): StockQuote {
    const upperTicker = params.ticker.trim().toUpperCase();
    const basePrice = Math.max(0.01, params.price);

    // Generate historical candle series for this new stock
    const d1: HistoricalPoint[] = [];
    const times = ['09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:00'];
    let curPrice = basePrice * 0.99;
    times.forEach(t => {
      curPrice = curPrice + (Math.random() - 0.48) * (basePrice * 0.01);
      d1.push({ date: t, price: Number(curPrice.toFixed(2)), volume: 150000 });
    });

    const m1: HistoricalPoint[] = [];
    const now = new Date();
    let monthPrice = basePrice * 0.95;
    for (let i = 30; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      monthPrice = monthPrice + (Math.random() - 0.48) * (basePrice * 0.02);
      m1.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Number(monthPrice.toFixed(2)),
        volume: 2500000
      });
    }

    if (d1.length > 0) d1[d1.length - 1].price = basePrice;
    if (m1.length > 0) m1[m1.length - 1].price = basePrice;

    const indicators = calculateAllIndicators(m1);
    const prevClose = Number((basePrice * 0.99).toFixed(2));
    const change = Number((basePrice - prevClose).toFixed(2));
    const changePercent = Number(((change / prevClose) * 100).toFixed(2));

    const newStock: StockQuote = {
      ticker: upperTicker,
      name: params.name.trim() || upperTicker,
      exchange: params.exchange || 'GLOBAL',
      country: params.country || 'Global',
      countryCode: params.countryCode || 'US',
      currency: params.currency || 'USD',
      currencySymbol: params.currencySymbol || '$',
      price: basePrice,
      change,
      changePercent,
      high: Number((basePrice * 1.01).toFixed(2)),
      low: Number((basePrice * 0.99).toFixed(2)),
      open: prevClose,
      previousClose: prevClose,
      volume: 3500000,
      marketCap: 'N/A',
      peRatio: 20.0,
      sector: params.sector || 'Custom Holding',
      indicators,
      history: {
        '1D': d1,
        '1W': m1.slice(-7),
        '1M': m1,
        '1Y': m1,
        'ALL': m1
      },
      lastUpdated: new Date().toLocaleTimeString()
    };

    this.stockDatabase[upperTicker] = newStock;

    // Persist custom stocks
    try {
      const raw = localStorage.getItem(CUSTOM_STOCKS_KEY);
      const list: StockQuote[] = raw ? JSON.parse(raw) : [];
      const updated = [newStock, ...list.filter(s => s.ticker !== upperTicker)];
      localStorage.setItem(CUSTOM_STOCKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save custom stock', e);
    }

    this.notify();
    return newStock;
  }

  public updateStockPrice(ticker: string, newPrice: number) {
    const stock = this.stockDatabase[ticker.toUpperCase()];
    if (!stock) return;
    const price = Math.max(0.0001, Number(newPrice.toFixed(2)));
    const change = Number((price - stock.previousClose).toFixed(2));
    const changePercent = Number(((change / stock.previousClose) * 100).toFixed(2));
    const high = Math.max(stock.high, price);
    const low = Math.min(stock.low, price);

    const history1D = [...stock.history['1D']];
    if (history1D.length > 0) {
      history1D[history1D.length - 1] = {
        ...history1D[history1D.length - 1],
        price
      };
    }

    const updatedIndicators = calculateAllIndicators(stock.history['1M']);

    this.stockDatabase[ticker.toUpperCase()] = {
      ...stock,
      price,
      change,
      changePercent,
      high,
      low,
      indicators: updatedIndicators,
      history: {
        ...stock.history,
        '1D': history1D
      },
      lastUpdated: new Date().toLocaleTimeString()
    };

    try {
      const raw = localStorage.getItem(CUSTOM_STOCKS_KEY);
      if (raw) {
        const list: StockQuote[] = JSON.parse(raw);
        const idx = list.findIndex(s => s.ticker.toUpperCase() === ticker.toUpperCase());
        if (idx >= 0) {
          list[idx] = this.stockDatabase[ticker.toUpperCase()];
          localStorage.setItem(CUSTOM_STOCKS_KEY, JSON.stringify(list));
        }
      }
    } catch (e) {
      console.error(e);
    }

    this.notify();
  }

  public getDataSourceName(): string {
    return this.currentDataSource;
  }

  public subscribe(callback: (db: Record<string, StockQuote>) => void) {
    this.listeners.push(callback);
    callback(this.stockDatabase);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn({ ...this.stockDatabase }));
  }

  public startSimulation() {
    if (this.simulationInterval) return;

    this.simulationInterval = window.setInterval(() => {
      const tickers = Object.keys(this.stockDatabase);
      const count = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < count; i++) {
        const randomTicker = tickers[Math.floor(Math.random() * tickers.length)];
        const stock = this.stockDatabase[randomTicker];
        if (!stock) continue;

        const tickPercent = (Math.random() - 0.49) * 0.003;
        const newPrice = Number((stock.price * (1 + tickPercent)).toFixed(2));
        const newChange = Number((newPrice - stock.previousClose).toFixed(2));
        const newChangePercent = Number(((newChange / stock.previousClose) * 100).toFixed(2));
        const newHigh = Math.max(stock.high, newPrice);
        const newLow = Math.min(stock.low, newPrice);

        const history1D = [...stock.history['1D']];
        if (history1D.length > 0) {
          history1D[history1D.length - 1] = {
            ...history1D[history1D.length - 1],
            price: newPrice
          };
        }

        const updatedIndicators = calculateAllIndicators(stock.history['1M']);

        this.stockDatabase[randomTicker] = {
          ...stock,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          high: newHigh,
          low: newLow,
          indicators: updatedIndicators,
          history: {
            ...stock.history,
            '1D': history1D
          },
          lastUpdated: new Date().toLocaleTimeString()
        };
      }
      this.notify();
    }, 4000);
  }

  public stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  public async fetchLiveFinnhubQuote(ticker: string, apiKey: string): Promise<Partial<StockQuote> | null> {
    try {
      this.currentDataSource = `Finnhub Live API (Free Tier - 15m delay)`;
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`);
      if (!res.ok) throw new Error('API Network error');
      const data = await res.json();
      if (data.c && data.c > 0) {
        return {
          price: data.c,
          change: data.d,
          changePercent: data.dp,
          high: data.h,
          low: data.l,
          open: data.o,
          previousClose: data.pc,
          lastUpdated: new Date().toLocaleTimeString()
        };
      }
      return null;
    } catch (e) {
      console.warn('Failed to fetch live quote, falling back to simulated data', e);
      return null;
    }
  }
}

export const stockService = new StockService();
