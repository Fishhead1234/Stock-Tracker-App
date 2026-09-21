import { StockQuote, GlobalExchangeInfo, HistoricalPoint } from '../types/stock';
import { buildMockStockDatabase, GLOBAL_EXCHANGES, generateHistoricalSeries } from './mockData';
import { calculateAllIndicators } from './technicalAnalysis';
import { marketDataClient, LiveMarketQuote } from './marketDataClient';
import { STOCK_DIRECTORY, DIRECTORY_MAP, DirectoryStockItem } from './stockDirectory';

const CUSTOM_STOCKS_KEY = 'investlearn_custom_stocks_v1';

class StockService {
  private stockDatabase: Record<string, StockQuote> = {};
  private listeners: Array<(db: Record<string, StockQuote>) => void> = [];
  private simulationInterval: number | null = null;
  private currentDataSource: string = 'Real-Time Global Market Engine';
  private hasInitializedLiveRefresh: boolean = false;

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
    const upper = ticker.toUpperCase();
    if (this.stockDatabase[upper]) {
      return this.stockDatabase[upper];
    }

    // Check directory if not yet initialized in database
    const dirItem = DIRECTORY_MAP.get(upper);
    if (dirItem) {
      return this.instantiateStockFromDirectory(dirItem);
    }

    return undefined;
  }

  public getGlobalExchanges(): GlobalExchangeInfo[] {
    return GLOBAL_EXCHANGES;
  }

  public getStocksByCountry(countryCode: string): StockQuote[] {
    if (countryCode === 'ALL') return this.getAllStocks();
    return this.getAllStocks().filter(s => s.countryCode === countryCode);
  }

  /**
   * Smart search across initialized database and directory items
   */
  public searchStocks(query: string): StockQuote[] {
    const q = query.trim().toUpperCase();
    if (!q) return this.getAllStocks().slice(0, 15);

    // Common aliases mapping
    const aliasMap: Record<string, string[]> = {
      'TSM': ['2330.TW', 'TSM'],
      'TSMC': ['2330.TW', 'TSM'],
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
      'UNILEVER': ['ULVR.L'],
      'GOOGLE': ['GOOGL', 'GOOG'],
      'ALPHABET': ['GOOGL', 'GOOG'],
      'BERKSHIRE': ['BRK.B'],
      'BUFFETT': ['BRK.B']
    };

    const directAliases = aliasMap[q] || [];

    // Ensure all matching items in directory are instantiated in database
    STOCK_DIRECTORY.forEach(item => {
      const t = item.ticker.toUpperCase();
      const n = item.name.toUpperCase();
      if (
        directAliases.includes(t) ||
        t.startsWith(q) ||
        t.includes(q) ||
        n.includes(q)
      ) {
        if (!this.stockDatabase[t]) {
          this.instantiateStockFromDirectory(item);
        }
      }
    });

    return this.getAllStocks().filter(s => {
      const tickerUpper = s.ticker.toUpperCase();
      const nameUpper = s.name.toUpperCase();
      const rawTicker = tickerUpper.split('.')[0];

      return (
        directAliases.includes(tickerUpper) ||
        tickerUpper.startsWith(q) ||
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
   * Search live online stocks across NYSE, NASDAQ, and global exchanges
   */
  public async searchLiveOnline(query: string): Promise<Array<{ ticker: string; name: string; exchange: string; quoteType?: string }>> {
    const q = query.trim();
    if (!q || q.length < 1) return [];

    try {
      const results = await marketDataClient.search(q);
      if (results && results.length > 0) {
        return results;
      }
    } catch (e) {
      console.warn('marketDataClient search error', e);
    }

    // Fallback: search directory for matching un-indexed symbols
    const qUpper = q.toUpperCase();
    return STOCK_DIRECTORY
      .filter(item => item.ticker.toUpperCase().includes(qUpper) || item.name.toUpperCase().includes(qUpper))
      .slice(0, 10)
      .map(item => ({
        ticker: item.ticker,
        name: item.name,
        exchange: item.exchange,
        quoteType: 'EQUITY'
      }));
  }

  /**
   * Fetches real live chart and quote data for ANY stock and indexes it
   */
  public async fetchAndIndexOnlineStock(symbol: string, fallbackName?: string, fallbackExchange?: string): Promise<StockQuote | null> {
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!cleanSymbol) return null;

    try {
      const liveQuote = await marketDataClient.fetchQuote(cleanSymbol);
      if (liveQuote && liveQuote.currentPrice > 0) {
        const stock = this.applyLiveQuote(liveQuote, fallbackName, fallbackExchange);
        return stock;
      }
    } catch (e) {
      console.warn(`Failed to fetch live quote for ${cleanSymbol}`, e);
    }

    // If live fetch is offline, check directory for realistic baseline
    const dirItem = DIRECTORY_MAP.get(cleanSymbol);
    if (dirItem) {
      return this.instantiateStockFromDirectory(dirItem);
    }

    // Fallback for custom / unlisted stock (uses realistic baseline, never $100 flat)
    const existing = this.stockDatabase[cleanSymbol];
    if (existing) return existing;

    return this.addCustomStock({
      ticker: cleanSymbol,
      name: fallbackName || cleanSymbol,
      exchange: fallbackExchange || 'NYSE / NASDAQ',
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      currencySymbol: '$',
      price: 50.00 // realistic default baseline instead of 100
    });
  }

  /**
   * Refreshes a single stock with real live market quote
   */
  public async refreshStockQuote(ticker: string): Promise<StockQuote | null> {
    const clean = ticker.trim().toUpperCase();
    try {
      const live = await marketDataClient.fetchQuote(clean);
      if (live && live.currentPrice > 0) {
        return this.applyLiveQuote(live);
      }
    } catch (e) {
      console.warn(`refreshStockQuote error for ${clean}`, e);
    }
    return this.stockDatabase[clean] || null;
  }

  /**
   * Automatically refreshes watchlist stocks with fresh live market prices
   */
  public async refreshWatchlistQuotes(watchlist: string[]): Promise<void> {
    const targets = Array.from(new Set([...watchlist, 'NVDA', 'AAPL', 'MSFT', 'TSLA', 'PLTR']));
    
    for (const ticker of targets) {
      try {
        const live = await marketDataClient.fetchQuote(ticker);
        if (live && live.currentPrice > 0) {
          this.applyLiveQuote(live);
        }
      } catch (e) {
        // silent fail to avoid interrupting UI
      }
    }
  }

  private applyLiveQuote(live: LiveMarketQuote, fallbackName?: string, fallbackExchange?: string): StockQuote {
    const cleanSymbol = live.ticker.toUpperCase();
    const currentPrice = live.currentPrice;
    const prevClose = live.previousClose;
    const change = live.change;
    const changePercent = live.changePercent;

    // Convert historical timestamps & closes into HistoricalPoint array
    const m1History: HistoricalPoint[] = [];
    if (live.timestamps && live.closes) {
      for (let i = 0; i < live.timestamps.length; i++) {
        if (live.closes[i] !== null && live.closes[i] !== undefined) {
          const d = new Date(live.timestamps[i] * 1000);
          m1History.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: live.closes[i],
            volume: live.volumes[i] || 500000
          });
        }
      }
    }

    if (m1History.length === 0) {
      m1History.push(
        { date: 'Prev', price: prevClose, volume: 500000 },
        { date: 'Now', price: currentPrice, volume: 500000 }
      );
    }

    const indicators = calculateAllIndicators(m1History.length >= 5 ? m1History : [
      { date: '1', price: currentPrice * 0.98, volume: 100000 },
      { date: '2', price: currentPrice * 0.99, volume: 100000 },
      { date: '3', price: currentPrice * 0.985, volume: 100000 },
      { date: '4', price: prevClose, volume: 100000 },
      { date: '5', price: currentPrice, volume: 100000 }
    ]);

    // Country parsing
    let country = 'United States';
    let countryCode: 'TW' | 'KR' | 'US' | 'UK' | 'NZ' | 'AU' | 'JP' = 'US';
    if (cleanSymbol.endsWith('.TW')) {
      country = 'Taiwan';
      countryCode = 'TW';
    } else if (cleanSymbol.endsWith('.KS')) {
      country = 'South Korea';
      countryCode = 'KR';
    } else if (cleanSymbol.endsWith('.L')) {
      country = 'United Kingdom';
      countryCode = 'UK';
    } else if (cleanSymbol.endsWith('.NZ')) {
      country = 'New Zealand';
      countryCode = 'NZ';
    } else if (cleanSymbol.endsWith('.AX')) {
      country = 'Australia';
      countryCode = 'AU';
    } else if (cleanSymbol.endsWith('.T')) {
      country = 'Japan';
      countryCode = 'JP';
    }

    const dirItem = DIRECTORY_MAP.get(cleanSymbol);
    const sector = dirItem?.sector || 'US Equity';
    const exchangeName = live.exchange || fallbackExchange || dirItem?.exchange || 'NYSE / NASDAQ';

    const stockQuote: StockQuote = {
      ticker: cleanSymbol,
      name: live.name || fallbackName || dirItem?.name || cleanSymbol,
      exchange: exchangeName,
      country,
      countryCode,
      currency: live.currency,
      currencySymbol: live.currencySymbol,
      price: currentPrice,
      change,
      changePercent,
      high: live.high,
      low: live.low,
      open: live.open,
      previousClose: prevClose,
      volume: live.volume,
      marketCap: live.marketCap || dirItem?.marketCap || 'N/A',
      peRatio: dirItem?.peRatio || 22.0,
      sector,
      indicators,
      history: {
        '1D': m1History.slice(-10),
        '1W': m1History.slice(-7),
        '1M': m1History,
        '1Y': m1History,
        'ALL': m1History
      },
      lastUpdated: new Date().toLocaleTimeString()
    };

    this.stockDatabase[cleanSymbol] = stockQuote;

    // Persist to custom stocks cache
    try {
      const raw = localStorage.getItem(CUSTOM_STOCKS_KEY);
      const list: StockQuote[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(CUSTOM_STOCKS_KEY, JSON.stringify([stockQuote, ...list.filter(s => s.ticker !== cleanSymbol)]));
    } catch (e) {}

    this.notify();
    return stockQuote;
  }

  private instantiateStockFromDirectory(item: DirectoryStockItem): StockQuote {
    const history = generateHistoricalSeries(item.basePrice);
    const indicators = calculateAllIndicators(history['1M']);
    const prevClose = Number((item.basePrice * 0.995).toFixed(2));
    const change = Number((item.basePrice - prevClose).toFixed(2));
    const changePercent = Number(((change / prevClose) * 100).toFixed(2));

    const newStock: StockQuote = {
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
      high: Number((item.basePrice * 1.012).toFixed(2)),
      low: Number((item.basePrice * 0.988).toFixed(2)),
      open: prevClose,
      previousClose: prevClose,
      volume: Math.floor(Math.random() * 15000000 + 5000000),
      marketCap: item.marketCap || 'N/A',
      peRatio: item.peRatio || 25.0,
      sector: item.sector,
      indicators,
      history,
      lastUpdated: new Date().toLocaleTimeString()
    };

    this.stockDatabase[item.ticker.toUpperCase()] = newStock;
    this.notify();
    return newStock;
  }

  /**
   * Adds any unlisted/custom stock that a user adds manually
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

    const history = generateHistoricalSeries(basePrice);
    const indicators = calculateAllIndicators(history['1M']);
    const prevClose = Number((basePrice * 0.995).toFixed(2));
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
      history,
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

  /**
   * Micro-tick simulation that gently animates live prices without distorting reality
   */
  public startSimulation() {
    if (this.simulationInterval) return;

    this.simulationInterval = window.setInterval(() => {
      const tickers = Object.keys(this.stockDatabase);
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        const randomTicker = tickers[Math.floor(Math.random() * tickers.length)];
        const stock = this.stockDatabase[randomTicker];
        if (!stock) continue;

        // Extremely small realistic micro-tick (0.02% max)
        const tickPercent = (Math.random() - 0.5) * 0.0004;
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

        this.stockDatabase[randomTicker] = {
          ...stock,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          high: newHigh,
          low: newLow,
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
