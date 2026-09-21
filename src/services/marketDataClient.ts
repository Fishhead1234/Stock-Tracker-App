import { Capacitor, CapacitorHttp } from '@capacitor/core';

export interface MarketSearchResult {
  ticker: string;
  name: string;
  exchange: string;
  quoteType?: string;
}

export interface LiveMarketQuote {
  ticker: string;
  name?: string;
  exchange?: string;
  currency: string;
  currencySymbol: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  marketCap?: string;
  timestamps: number[];
  closes: number[];
  volumes: number[];
}

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://finance.yahoo.com/'
};

class MarketDataClient {
  /**
   * Search for ticker symbols across NYSE, NASDAQ, and global exchanges
   */
  public async search(query: string): Promise<MarketSearchResult[]> {
    const q = query.trim();
    if (!q) return [];

    // Strategy 1: Native Android CapacitorHttp (bypasses browser CORS & localhost limits)
    if (Capacitor.isNativePlatform()) {
      try {
        const res = await CapacitorHttp.get({
          url: `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=15&newsCount=0`,
          headers: BROWSER_HEADERS
        });
        if (res.status === 200 && res.data) {
          const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          const quotes = parsed?.quotes;
          if (Array.isArray(quotes)) {
            return this.formatQuotes(quotes);
          }
        }
      } catch (err) {
        console.warn('Native search query1 failed, trying query2', err);
        try {
          const res2 = await CapacitorHttp.get({
            url: `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=15&newsCount=0`,
            headers: BROWSER_HEADERS
          });
          if (res2.status === 200 && res2.data) {
            const parsed = typeof res2.data === 'string' ? JSON.parse(res2.data) : res2.data;
            const quotes = parsed?.quotes;
            if (Array.isArray(quotes)) {
              return this.formatQuotes(quotes);
            }
          }
        } catch (e2) {
          console.error('Native search query2 failed', e2);
        }
      }
      return [];
    }

    // Strategy 2: Web Serverless /api/search (runs on Vercel)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.quotes && Array.isArray(data.quotes)) {
          return this.formatQuotes(data.quotes);
        }
      }
    } catch (e) {
      console.warn('Web /api/search failed', e);
    }

    return [];
  }

  /**
   * Fetch live 1-month daily historical chart & real-time quote
   */
  public async fetchQuote(symbol: string): Promise<LiveMarketQuote | null> {
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!cleanSymbol) return null;

    // Strategy 1: Native Android CapacitorHttp
    if (Capacitor.isNativePlatform()) {
      try {
        const res = await CapacitorHttp.get({
          url: `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cleanSymbol)}?interval=1d&range=1mo`,
          headers: BROWSER_HEADERS
        });
        if (res.status === 200 && res.data) {
          const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          const formatted = this.formatChartResult(cleanSymbol, parsed);
          if (formatted) return formatted;
        }
      } catch (err) {
        console.warn(`Native chart fetch for ${cleanSymbol} on query1 failed, trying query2`, err);
        try {
          const res2 = await CapacitorHttp.get({
            url: `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cleanSymbol)}?interval=1d&range=1mo`,
            headers: BROWSER_HEADERS
          });
          if (res2.status === 200 && res2.data) {
            const parsed = typeof res2.data === 'string' ? JSON.parse(res2.data) : res2.data;
            const formatted = this.formatChartResult(cleanSymbol, parsed);
            if (formatted) return formatted;
          }
        } catch (e2) {
          console.error(`Native chart fetch for ${cleanSymbol} failed completely`, e2);
        }
      }
      return null;
    }

    // Strategy 2: Web Serverless /api/quote
    try {
      const res = await fetch(`/api/quote?symbol=${encodeURIComponent(cleanSymbol)}`);
      if (res.ok) {
        const data = await res.json();
        const formatted = this.formatChartResult(cleanSymbol, data);
        if (formatted) return formatted;
      }
    } catch (e) {
      console.warn(`Web /api/quote for ${cleanSymbol} failed`, e);
    }

    return null;
  }

  private formatQuotes(rawQuotes: any[]): MarketSearchResult[] {
    return rawQuotes
      .filter(item => item && (item.quoteType === 'EQUITY' || item.quoteType === 'ETF'))
      .map(item => {
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

  private formatChartResult(symbol: string, data: any): LiveMarketQuote | null {
    const result = data?.chart?.result?.[0];
    if (!result || !result.meta) return null;

    const meta = result.meta;
    const currentPrice = Number((meta.regularMarketPrice || meta.fulldayPrice || 0).toFixed(2));
    if (currentPrice <= 0) return null;

    const prevClose = Number((meta.chartPreviousClose || meta.previousClose || currentPrice).toFixed(2));
    const change = Number((currentPrice - prevClose).toFixed(2));
    const changePercent = prevClose > 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

    const rawTimestamps: number[] = result.timestamp || [];
    const rawCloses: number[] = result.indicators?.quote?.[0]?.close || [];
    const rawVolumes: number[] = result.indicators?.quote?.[0]?.volume || [];

    const timestamps: number[] = [];
    const closes: number[] = [];
    const volumes: number[] = [];

    for (let i = 0; i < rawTimestamps.length; i++) {
      if (rawCloses[i] !== null && rawCloses[i] !== undefined && !isNaN(rawCloses[i])) {
        timestamps.push(rawTimestamps[i]);
        closes.push(Number(rawCloses[i].toFixed(2)));
        volumes.push(rawVolumes[i] || 500000);
      }
    }

    const currency = meta.currency || 'USD';
    let currencySymbol = '$';
    if (currency === 'TWD') currencySymbol = 'NT$';
    else if (currency === 'KRW') currencySymbol = '₩';
    else if (currency === 'GBP') currencySymbol = '£';
    else if (currency === 'NZD') currencySymbol = 'NZ$';
    else if (currency === 'AUD') currencySymbol = 'A$';
    else if (currency === 'JPY') currencySymbol = '¥';

    const rawExch = meta.fullExchangeName || meta.exchangeName || '';
    let exchange = rawExch;
    if (/nasdaq|nms|ngs|ncm/i.test(rawExch)) exchange = 'NASDAQ';
    else if (/nyse arca|pcx|ase|amex/i.test(rawExch)) exchange = 'NYSE Arca';
    else if (/nyse|nyq/i.test(rawExch)) exchange = 'NYSE';
    else if (/twse|taiwan/i.test(rawExch)) exchange = 'TWSE';
    else if (/krx|kospi|kosdaq/i.test(rawExch)) exchange = 'KRX';
    else if (/lse|london/i.test(rawExch)) exchange = 'LSE';
    else if (/nzx|new zealand/i.test(rawExch)) exchange = 'NZX';
    else if (/asx|australia/i.test(rawExch)) exchange = 'ASX';
    else if (/tse|tokyo|jpx/i.test(rawExch)) exchange = 'TSE';

    return {
      ticker: symbol,
      name: meta.shortName || meta.longName || symbol,
      exchange,
      currency,
      currencySymbol,
      currentPrice,
      previousClose: prevClose,
      change,
      changePercent,
      high: Number((meta.regularMarketDayHigh || currentPrice * 1.01).toFixed(2)),
      low: Number((meta.regularMarketDayLow || currentPrice * 0.99).toFixed(2)),
      open: Number((meta.regularMarketOpen || prevClose).toFixed(2)),
      volume: meta.regularMarketVolume || 1500000,
      marketCap: meta.marketCap ? `$${(meta.marketCap / 1e9).toFixed(1)}B` : undefined,
      timestamps,
      closes,
      volumes
    };
  }
}

export const marketDataClient = new MarketDataClient();
