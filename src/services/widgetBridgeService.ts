import { registerPlugin, Capacitor } from '@capacitor/core';
import { usePortfolioStore } from '../store/portfolioStore';
import { useMarketStore } from '../store/marketStore';
import { useLanguageStore } from '../store/languageStore';
import { generateTimingSignal } from './signalEngine';

export interface WidgetHoldingItem {
  ticker: string;
  action: 'BUY' | 'HOLD' | 'SELL';
  currentPrice: string;
  subtitle: string;
  value: string;
  pnl: string;
  isPositive: boolean;
}

export interface WidgetDataPayload {
  netWorth: string;
  pnlText: string;
  isPositive: boolean;
  investedHint: string;
  holdingsCount: number;
  holdingsJson: string;
  updatedTime: string;
}

export interface WidgetBridgePlugin {
  updateWidgetData(options: WidgetDataPayload): Promise<{ success: boolean }>;
  getInitialRoute(): Promise<{ targetTab: string; ticker?: string; prompt?: string; autoFocus?: boolean }>;
}

export const WidgetBridge = registerPlugin<WidgetBridgePlugin>('WidgetBridge');

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Synchronizes the full portfolio balance and scrollable holdings list
 * directly to the native Android 2x4 scrollable widget.
 */
export async function syncWidgetData(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  const { positions, cashBalance, getSummary } = usePortfolioStore.getState();
  const { quotes } = useMarketStore.getState();
  const { language } = useLanguageStore.getState();

  const summary = getSummary(quotes);
  const totalNetWorth = summary.currentValue + cashBalance;

  // Currency Symbol
  const currencySymbol = positions[0]?.currencySymbol || '$';

  // Format Total Balance
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
  })} (${sign}${absDayPercent.toFixed(2)}%) Today`;

  // Format All-Time Gain / Invested Hint
  const totalGainSign = summary.totalProfitLoss >= 0 ? '+' : '-';
  const investedHint = `Total Gain: ${totalGainSign}${currencySymbol}${Math.abs(summary.totalProfitLoss).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} (${totalGainSign}${Math.abs(summary.totalProfitLossPercent).toFixed(1)}%)`;

  // Format Individual Holdings for the Scrollable ListView
  const holdings: WidgetHoldingItem[] = positions.map((pos) => {
    const quote = quotes[pos.ticker];
    const currentPrice = quote?.price ?? pos.averageBuyPrice;
    const totalHoldingValue = pos.shares * currentPrice;
    const costBasis = pos.shares * pos.averageBuyPrice;
    const profitLoss = totalHoldingValue - costBasis;
    const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
    const isHoldingPositive = profitLoss >= 0;
    const holdingSign = isHoldingPositive ? '+' : '-';
    const cur = pos.currencySymbol || '$';

    // Format current market price per share
    const formattedPrice = `${cur}${currentPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    // Format clean shares count (e.g. 1.22 instead of 1.21720026)
    const formattedShares = pos.shares % 1 === 0
      ? pos.shares.toString()
      : Number(pos.shares.toFixed(2)).toString();

    // Determine Buy / Hold / Sell index from timing signal
    let action: 'BUY' | 'HOLD' | 'SELL' = 'HOLD';
    if (quote && quote.indicators) {
      try {
        const signal = generateTimingSignal(quote, language);
        if (signal.action === 'STRONG_BUY' || signal.action === 'BUY') {
          action = 'BUY';
        } else if (signal.action === 'STRONG_SELL' || signal.action === 'TRIM') {
          action = 'SELL';
        } else {
          action = 'HOLD';
        }
      } catch (e) {
        action = 'HOLD';
      }
    }

    return {
      ticker: pos.ticker,
      action,
      currentPrice: formattedPrice,
      subtitle: `${formattedPrice} • ${formattedShares} shs`,
      value: `${cur}${totalHoldingValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      pnl: `${holdingSign}${cur}${Math.abs(profitLoss).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} (${holdingSign}${Math.abs(profitLossPercent).toFixed(1)}%)`,
      isPositive: isHoldingPositive,
    };
  });

  // Updated Timestamp
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const updatedTime = `Updated ${hours}:${minutes}`;

  const payload: WidgetDataPayload = {
    netWorth: formattedNetWorth,
    pnlText: formattedPnL,
    isPositive,
    investedHint,
    holdingsCount: holdings.length,
    holdingsJson: JSON.stringify(holdings),
    updatedTime,
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
