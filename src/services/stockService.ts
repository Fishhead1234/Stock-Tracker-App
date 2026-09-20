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
   * Search live online stocks across NYSE, NASDAQ, and global exchanges
   */
  public async searchLiveOnline(query: string): Promise<Array<{ ticker: string; name: string; exchange: string; quoteType?: string }>> {
    const q = query.trim();
    if (!q || q.length < 1) return [];

    try {
      let res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=15&newsCount=0`)}`);
      }

      if (res.ok) {
        const data = await res.json();
        if (data && data.quotes && Array.isArray(data.quotes)) {
          return data.quotes
            .filter((item: any) => item.quoteType === 'EQUITY' || item.quoteType === 'ETF')
            .map((item: any) => {
              const rawExch = item.exchDisp || item.exchange || '';
              let cleanExch = rawExch;
              if (/nasdaq|nms|ngs|ncm/i.test(rawExch)) cleanExch = 'NASDAQ';
              else if (/nyse arca|pcx|ase|amex/i.test(rawExch)) cleanExch = 'NYSE Arca';
              else if (/nyse|nyq/i.test(rawExch)) cleanExch = 'NYSE';
              else if (/twse|taiwan|two/i.test(rawExch)) cleanExch = 'TWSE';
              else if (/krx|kospi|kosdaq|ksc|koe/i.test(rawExch)) cleanExch = 'KRX';
              else if (/lse|london/i.test(rawExch)) cleanExch = 'LSE';
              else if (/nzx|new zealand/i.test(rawExch)) cleanExch = 'NZX';
              else if (/asx|australia/i.test(rawExch)) cleanExch = 'ASX';
              else if (/tse|tokyo|jpx/i.test(rawExch)) cleanExch = 'TSE';
              else if (!cleanExch) cleanExch = 'NYSE / NASDAQ';

              return {
                ticker: item.symbol,
                name: item.shortname || item.longname || item.symbol,
                exchange: cleanExch,
                quoteType: item.quoteType
              };
            });
        }
      }
    } catch (e) {
      console.warn('Online stock search error', e);
    }
    return [];
  }

  /**
   * Fetches real live chart and quote data for ANY stock (from NYSE, NASDAQ, etc.) and indexes it
   */
  public async fetchAndIndexOnlineStock(symbol: string, fallbackName?: string, fallbackExchange?: string): Promise<StockQuote | null> {
    const cleanSymbol = symbol.trim().toUpperCase();
    
    if (this.stockDatabase[cleanSymbol]) {
      return this.stockDatabase[cleanSymbol];
    }

    try {
      let res = await fetch(`/api/quote?symbol=${encodeURIComponent(cleanSymbol)}`);
      if (!res.ok) {
        res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}?interval=1d&range=1mo`)}`);
      }

      if (res.ok) {
        const data = await res.json();
        const result = data?.chart?.result?.[0];
        if (result && result.meta) {
          const meta = result.meta;
          const currentPrice = Number((meta.regularMarketPrice || meta.fulldayPrice || 50).toFixed(2));
          const prevClose = Number((meta.chartPreviousClose || meta.previousClose || currentPrice).toFixed(2));
          const change = Number((currentPrice - prevClose).toFixed(2));
          const changePercent = Number(((change / prevClose) * 100).toFixed(2));
          
          const timestamps: number[] = result.timestamp || [];
          const closes: number[] = result.indicators?.quote?.[0]?.close || [];
          const volumes: number[] = result.indicators?.quote?.[0]?.volume || [];

          const m1History: HistoricalPoint[] = [];
          for (let i = 0; i < timestamps.length; i++) {
            if (closes[i] !== null && closes[i] !== undefined) {
              const d = new Date(timestamps[i] * 1000);
              m1History.push({
                date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                price: Number(closes[i].toFixed(2)),
                volume: volumes[i] || 500000
              });
            }
          }

          // Ensure minimum history for technical indicators
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

          const currency = meta.currency || 'USD';
          let currencySymbol = '$';
          if (currency === 'TWD') currencySymbol = 'NT$';
          else if (currency === 'KRW') currencySymbol = '₩';
          else if (currency === 'GBP') currencySymbol = '£';
          else if (currency === 'NZD') currencySymbol = 'NZ$';
          else if (currency === 'AUD') currencySymbol = 'A$';
          else if (currency === 'JPY') currencySymbol = '¥';

          // Exchange display parsing
          const rawExch = meta.fullExchangeName || meta.exchangeName || fallbackExchange || 'NYSE / NASDAQ';
          let exchangeName = rawExch;
          if (/nasdaq|nms|ngs|ncm/i.test(rawExch)) exchangeName = 'NASDAQ';
          else if (/nyse arca|pcx|ase|amex/i.test(rawExch)) exchangeName = 'NYSE Arca';
          else if (/nyse|nyq/i.test(rawExch)) exchangeName = 'NYSE';
          else if (/twse|taiwan|two/i.test(rawExch)) exchangeName = 'TWSE';
          else if (/krx|kospi|kosdaq|ksc|koe/i.test(rawExch)) exchangeName = 'KRX';
          else if (/lse|london/i.test(rawExch)) exchangeName = 'LSE';
          else if (/nzx|new zealand/i.test(rawExch)) exchangeName = 'NZX';
          else if (/asx|australia/i.test(rawExch)) exchangeName = 'ASX';
          else if (/tse|tokyo|jpx/i.test(rawExch)) exchangeName = 'TSE';

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

          const sector = meta.instrumentType === 'ETF' ? 'Broad Market ETF' : (meta.sector || 'US Equity');

          const newStock: StockQuote = {
            ticker: cleanSymbol,
            name: fallbackName || meta.shortName || meta.longName || cleanSymbol,
            exchange: exchangeName,
            country,
            countryCode,
            currency,
            currencySymbol,
            price: currentPrice,
            change,
            changePercent,
            high: Number((meta.regularMarketDayHigh || currentPrice * 1.01).toFixed(2)),
            low: Number((meta.regularMarketDayLow || currentPrice * 0.99).toFixed(2)),
            open: Number((meta.regularMarketOpen || prevClose).toFixed(2)),
            previousClose: prevClose,
            volume: meta.regularMarketVolume || 1500000,
            marketCap: meta.marketCap ? `$${(meta.marketCap / 1e9).toFixed(1)}B` : 'N/A',
            peRatio: 22.0,
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

          this.stockDatabase[cleanSymbol] = newStock;
          
          try {
            const raw = localStorage.getItem(CUSTOM_STOCKS_KEY);
            const list: StockQuote[] = raw ? JSON.parse(raw) : [];
            localStorage.setItem(CUSTOM_STOCKS_KEY, JSON.stringify([newStock, ...list.filter(s => s.ticker !== cleanSymbol)]));
          } catch (e) {}

          this.notify();
          return newStock;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch real chart online', e);
    }

    return this.addCustomStock({
      ticker: cleanSymbol,
      name: fallbackName || cleanSymbol,
      exchange: fallbackExchange || 'NYSE / NASDAQ',
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      currencySymbol: '$',
      price: 100
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
