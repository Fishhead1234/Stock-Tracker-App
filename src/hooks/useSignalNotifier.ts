import { useEffect, useRef } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { useMarketStore } from '../store/marketStore';
import { useNotificationStore } from '../store/notificationStore';
import { generateTimingSignal } from '../services/signalEngine';
import { notificationService } from '../services/notificationService';
import { SignalAction } from '../types/signal';

export const useSignalNotifier = () => {
  const { positions } = usePortfolioStore();
  const { quotes, watchlist } = useMarketStore();
  const { notificationsEnabled, notifyPersonalHoldings, notifyWatchlist } = useNotificationStore();

  const previousSignals = useRef<Record<string, SignalAction>>({});
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (!notificationsEnabled) return;

    // Skip firing notifications immediately on first app load, just index initial states
    if (isFirstMount.current) {
      positions.forEach(pos => {
        const quote = quotes[pos.ticker.toUpperCase()];
        if (quote) {
          previousSignals.current[quote.ticker] = generateTimingSignal(quote).action;
        }
      });
      watchlist.forEach(t => {
        const quote = quotes[t.toUpperCase()];
        if (quote) {
          previousSignals.current[quote.ticker] = generateTimingSignal(quote).action;
        }
      });
      isFirstMount.current = false;
      return;
    }

    // 1. Check Personal Holdings for timing signal changes
    if (notifyPersonalHoldings) {
      positions.forEach(pos => {
        const quote = quotes[pos.ticker.toUpperCase()];
        if (!quote) return;

        const currentSignal = generateTimingSignal(quote);
        const lastAction = previousSignals.current[quote.ticker];

        if (lastAction && lastAction !== currentSignal.action) {
          notificationService.notify({
            ticker: quote.ticker,
            companyName: quote.name,
            signalAction: currentSignal.action,
            title: `Holding Alert: ${currentSignal.title}`,
            message: `${quote.ticker} (${quote.name}): ${currentSignal.summary}`,
            price: quote.price,
            category: 'HOLDING'
          });
        }
        previousSignals.current[quote.ticker] = currentSignal.action;
      });
    }

    // 2. Check Stocks to Watch for high conviction timing signals
    if (notifyWatchlist) {
      watchlist.forEach(ticker => {
        const quote = quotes[ticker.toUpperCase()];
        if (!quote) return;

        const currentSignal = generateTimingSignal(quote);
        const lastAction = previousSignals.current[quote.ticker];

        if (lastAction && lastAction !== currentSignal.action) {
          // Notify on Strong Buy, Buy Window, or High Risk/Sell
          if (
            currentSignal.action === 'STRONG_BUY' || 
            currentSignal.action === 'BUY' || 
            currentSignal.action === 'STRONG_SELL' ||
            currentSignal.action === 'TRIM'
          ) {
            notificationService.notify({
              ticker: quote.ticker,
              companyName: quote.name,
              signalAction: currentSignal.action,
              title: `Watchlist Alert: ${currentSignal.title}`,
              message: `${quote.ticker}: ${currentSignal.summary}`,
              price: quote.price,
              category: 'WATCHLIST'
            });
          }
        }
        previousSignals.current[quote.ticker] = currentSignal.action;
      });
    }
  }, [quotes, positions, watchlist, notificationsEnabled, notifyPersonalHoldings, notifyWatchlist]);
};
