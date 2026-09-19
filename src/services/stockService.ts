import { StockQuote, GlobalExchangeInfo } from '../types/stock';
import { buildMockStockDatabase, GLOBAL_EXCHANGES } from './mockData';
import { calculateAllIndicators } from './technicalAnalysis';

class StockService {
  private stockDatabase: Record<string, StockQuote> = {};
  private listeners: Array<(db: Record<string, StockQuote>) => void> = [];
  private simulationInterval: number | null = null;
  private currentDataSource: string = 'Universal Global Exchange Engine';

  constructor() {
    this.stockDatabase = buildMockStockDatabase();
    this.startSimulation();
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

  public searchStocks(query: string): StockQuote[] {
    const q = query.trim().toUpperCase();
    if (!q) return this.getAllStocks().slice(0, 10);
    return this.getAllStocks().filter(
      s => s.ticker.toUpperCase().includes(q) || 
           s.name.toUpperCase().includes(q) || 
           s.exchange.toUpperCase().includes(q) ||
           s.country.toUpperCase().includes(q) ||
           s.sector.toUpperCase().includes(q)
    );
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
   * Simulates real-time price tick fluctuations across global markets
   */
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
