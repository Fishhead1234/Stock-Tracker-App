import { registerPlugin, Capacitor } from '@capacitor/core';
import { usePortfolioStore } from '../store/portfolioStore';
import { useMarketStore } from '../store/marketStore';
import { useLanguageStore } from '../store/languageStore';
import { generateTimingSignal } from './signalEngine';

export interface WidgetDataPayload {
  netWorth: string;
  pnlText: string;
  isPositive: boolean;
  radarTitle: string;
  actionBadge: string;
  headline: string;
  subtext: string;
  isTip: boolean;
  updatedTime: string;
}

export interface WidgetBridgePlugin {
  updateWidgetData(options: WidgetDataPayload): Promise<{ success: boolean }>;
  getInitialRoute(): Promise<{ targetTab: string }>;
}

export const WidgetBridge = registerPlugin<WidgetBridgePlugin>('WidgetBridge');

const DAILY_WISDOM_TIPS = [
  {
    title: 'Dollar-Cost Averaging',
    body: 'Investing fixed amounts regularly lowers your average purchase price over market swings.',
  },
  {
    title: 'RSI Oversold Rule',
    body: 'RSI below 30 signals an oversold bargain zone—like a rubber band stretched downward.',
  },
  {
    title: 'Rule of 72',
    body: 'Divide 72 by your expected return % to calculate the years needed to double your wealth.',
  },
  {
    title: 'Diversification Bedrock',
    body: 'Spreading investments across index ETFs and steady sectors shields your capital from shock.',
  },
  {
    title: 'MACD Momentum Shift',
    body: 'When the fast MACD line crosses above the signal line, institutional buyers are entering.',
  },
  {
    title: 'Time in the Market',
    body: 'Time in the market reliably beats timing the market. Reinvested dividends compound silently.',
  },
];

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Synchronizes the latest portfolio figures and top timing signal or educational tip
 * to the Android Native Home Screen Widget.
 */
export async function syncWidgetData(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  const { positions, cashBalance, getSummary } = usePortfolioStore.getState();
  const { quotes, watchlist } = useMarketStore.getState();
  const { language } = useLanguageStore.getState();

  const summary = getSummary(quotes);
  const totalNetWorth = summary.currentValue + cashBalance;

  // Format Net Worth
  const currencySymbol = positions[0]?.currencySymbol || '$';
  const formattedNetWorth = `${currencySymbol}${totalNetWorth.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Format Today's P&L
  const isPositive = summary.dayChange >= 0;
  const sign = isPositive ? '+' : '-';
  const absDayChange = Math.abs(summary.dayChange);
  const absDayPercent = Math.abs(summary.dayChangePercent);
  const formattedPnL = `${sign}${currencySymbol}${absDayChange.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} (${sign}${absDayPercent.toFixed(2)}%)`;

  // Look for urgent signals in user's portfolio and watchlist
  const portfolioTickers = new Set(positions.map((p) => p.ticker.toUpperCase()));
  const watchlistTickers = new Set(watchlist.map((t) => t.toUpperCase()));
  const trackedTickers = new Set([...portfolioTickers, ...watchlistTickers]);

  const trackedQuotes = Object.values(quotes).filter((q) =>
    trackedTickers.has(q.ticker.toUpperCase())
  );

  const activeSignals = trackedQuotes.map((q) => generateTimingSignal(q, language));

  // Prioritize STRONG_BUY / BUY / TRIM signals
  const urgentSignal = activeSignals.find(
    (s) =>
      s.action === 'STRONG_BUY' ||
      s.action === 'BUY' ||
      s.action === 'TRIM' ||
      s.action === 'STRONG_SELL'
  ) || activeSignals[0];

  let radarTitle = 'DAILY WISDOM';
  let actionBadge = 'TIP';
  let headline = '';
  let subtext = '';
  let isTip = true;

  if (urgentSignal && urgentSignal.action !== 'HOLD') {
    radarTitle = 'TIMING RADAR';
    actionBadge = urgentSignal.action.replace('_', ' ');
    const stockQuote = quotes[urgentSignal.ticker];
    const changeSign = (stockQuote?.change || 0) >= 0 ? '+' : '';
    headline = `${urgentSignal.ticker} ${currencySymbol}${stockQuote?.price?.toFixed(2) || '0.00'} (${changeSign}${stockQuote?.changePercent?.toFixed(2) || '0'}%)`;
    subtext = urgentSignal.reasons[0]?.plainEnglishAnalogy || urgentSignal.summary || urgentSignal.recommendedAction;
    isTip = false;
  } else {
    // Pick today's tip based on day of year
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const tip = DAILY_WISDOM_TIPS[dayOfYear % DAILY_WISDOM_TIPS.length];
    radarTitle = 'DAILY WISDOM';
    actionBadge = 'TIP';
    headline = tip.title;
    subtext = tip.body;
    isTip = true;
  }

  // Format updated time
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const updatedTime = `${hours}:${minutes}`;

  const payload: WidgetDataPayload = {
    netWorth: formattedNetWorth,
    pnlText: formattedPnL,
    isPositive,
    radarTitle,
    actionBadge,
    headline,
    subtext,
    isTip,
    updatedTime: `Updated ${updatedTime}`,
  };

  try {
    await WidgetBridge.updateWidgetData(payload);
  } catch (err) {
    console.debug('WidgetBridge update skipped (web or unavailable):', err);
  }
}

/**
 * Debounced sync helper to prevent excessive bridge calls during tick fluctuations
 */
export function queueWidgetSync(delayMs = 1200): void {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(() => {
    syncWidgetData();
  }, delayMs);
}
