import { useNotificationStore } from '../store/notificationStore';
import { SignalAction } from '../types/signal';

class NotificationService {
  /**
   * Check if web/system notifications are supported
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Get current browser notification permission
   */
  public getPermission(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  /**
   * Request system notification permission from user
   */
  public async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported()) {
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.error('Error requesting notification permission', e);
      return 'denied';
    }
  }

  /**
   * Dispatch a notification (shows system banner if allowed + records in in-app notification center)
   */
  public async notify({
    ticker,
    companyName,
    signalAction,
    title,
    message,
    price,
    category
  }: {
    ticker: string;
    companyName: string;
    signalAction: SignalAction;
    title: string;
    message: string;
    price: number;
    category: 'HOLDING' | 'WATCHLIST' | 'SYSTEM';
  }) {
    const store = useNotificationStore.getState();

    // Check master toggle
    if (!store.notificationsEnabled) return;

    // Check category toggles
    if (category === 'HOLDING' && !store.notifyPersonalHoldings) return;
    if (category === 'WATCHLIST' && !store.notifyWatchlist) return;

    // Check sensitivity level
    if (store.sensitivity === 'HIGH_CONVICTION_ONLY') {
      if (signalAction !== 'STRONG_BUY' && signalAction !== 'STRONG_SELL') {
        return;
      }
    }

    // Always add to in-app notification center
    store.addAlert({
      ticker,
      companyName,
      signalAction,
      title,
      message,
      price,
      category
    });

    // Fire system/browser notification if permission granted
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const icon = '/favicon.ico';
        const notification = new Notification(`InvestLearn: ${ticker} - ${title}`, {
          body: `${message} (Price: $${price.toFixed(2)})`,
          icon,
          tag: `investlearn-${ticker}-${Date.now()}`
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (err) {
        console.warn('Could not display system notification banner:', err);
      }
    }
  }

  /**
   * Send a test notification to verify OS permissions and visual rendering
   */
  public async sendTestNotification(type: 'HOLDING' | 'WATCHLIST' = 'HOLDING'): Promise<boolean> {
    const perm = await this.requestPermission();

    if (type === 'HOLDING') {
      await this.notify({
        ticker: 'AAPL',
        companyName: 'Apple Inc',
        signalAction: 'BUY',
        title: 'Holding Alert: Buy Window Active',
        message: 'Personal portfolio holding AAPL entered favorable accumulation range near support.',
        price: 224.50,
        category: 'HOLDING'
      });
    } else {
      await this.notify({
        ticker: 'NVDA',
        companyName: 'NVIDIA Corp',
        signalAction: 'STRONG_BUY',
        title: 'Watchlist Alert: Strong Buy Triggered',
        message: 'Monitored stock NVDA triggered a bullish MACD crossover with high volume surge.',
        price: 119.80,
        category: 'WATCHLIST'
      });
    }

    return perm === 'granted';
  }
}

export const notificationService = new NotificationService();
