import { HistoricalPoint, TechnicalIndicators } from '../types/stock';

/**
 * Calculates Simple Moving Average (SMA)
 */
export function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) {
    return prices.length > 0 ? prices[prices.length - 1] : 0;
  }
  const slice = prices.slice(-period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return Number((sum / period).toFixed(2));
}

/**
 * Calculates Exponential Moving Average (EMA) series
 */
export function calculateEMASeries(prices: number[], period: number): number[] {
  if (prices.length === 0) return [];
  const k = 2 / (period + 1);
  const emaArray: number[] = [prices[0]];

  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];
    const prevEMA = emaArray[i - 1];
    const ema = currentPrice * k + prevEMA * (1 - k);
    emaArray.push(ema);
  }
  return emaArray;
}

/**
 * Calculates Relative Strength Index (RSI - 14 period standard)
 */
export function calculateRSI(prices: number[], period = 14): number {
  if (prices.length <= period) {
    return 50; // Default neutral if not enough data
  }

  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  // Calculate initial average gain and loss
  let gains = 0;
  let losses = 0;

  for (let i = 0; i < period; i++) {
    const change = changes[i];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Wilder's smoothing method for remaining points
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const currentGain = change > 0 ? change : 0;
    const currentLoss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  return Number(rsi.toFixed(1));
}

/**
 * Calculates MACD (12-EMA, 26-EMA, 9-EMA Signal Line)
 */
export function calculateMACD(prices: number[]): {
  macdLine: number;
  signalLine: number;
  histogram: number;
  crossover: 'bullish' | 'bearish' | 'neutral';
} {
  if (prices.length < 26) {
    return {
      macdLine: 0,
      signalLine: 0,
      histogram: 0,
      crossover: 'neutral'
    };
  }

  const ema12 = calculateEMASeries(prices, 12);
  const ema26 = calculateEMASeries(prices, 26);

  // MACD line = EMA12 - EMA26
  const macdLineSeries: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    macdLineSeries.push(ema12[i] - ema26[i]);
  }

  // Signal line = 9 EMA of MACD Line
  const signalLineSeries = calculateEMASeries(macdLineSeries, 9);

  const lastIndex = prices.length - 1;
  const prevIndex = Math.max(0, lastIndex - 1);

  const currentMacd = Number(macdLineSeries[lastIndex].toFixed(2));
  const currentSignal = Number(signalLineSeries[lastIndex].toFixed(2));
  const prevMacd = macdLineSeries[prevIndex];
  const prevSignal = signalLineSeries[prevIndex];

  const currentHist = Number((currentMacd - currentSignal).toFixed(2));

  let crossover: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (prevMacd <= prevSignal && currentMacd > currentSignal) {
    crossover = 'bullish';
  } else if (prevMacd >= prevSignal && currentMacd < currentSignal) {
    crossover = 'bearish';
  } else if (currentMacd > currentSignal) {
    crossover = 'bullish';
  } else {
    crossover = 'bearish';
  }

  return {
    macdLine: currentMacd,
    signalLine: currentSignal,
    histogram: currentHist,
    crossover
  };
}

/**
 * Calculates comprehensive technical indicators from historical candle points
 */
export function calculateAllIndicators(historyPoints: HistoricalPoint[]): TechnicalIndicators {
  const prices = historyPoints.map(p => p.price);
  const volumes = historyPoints.map(p => p.volume);

  const rsi = calculateRSI(prices, 14);
  const macd = calculateMACD(prices);
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const sma200 = calculateSMA(prices, Math.min(200, prices.length));

  // Volume 20-day average
  const volumeSlice = volumes.slice(-20);
  const volumeAverage20 = Math.round(volumeSlice.reduce((a, b) => a + b, 0) / Math.max(1, volumeSlice.length));
  const currentVolume = volumes.length > 0 ? volumes[volumes.length - 1] : volumeAverage20;
  const volumeSurgeRatio = Number((currentVolume / Math.max(1, volumeAverage20)).toFixed(2));

  // 52-week High and Low
  const allPrices = prices.length > 0 ? prices : [100];
  const high52Week = Number(Math.max(...allPrices).toFixed(2));
  const low52Week = Number(Math.min(...allPrices).toFixed(2));

  return {
    rsi,
    macd,
    sma20,
    sma50,
    sma200,
    volumeAverage20,
    volumeSurgeRatio,
    high52Week,
    low52Week
  };
}
