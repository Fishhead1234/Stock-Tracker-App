import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useNotificationStore } from '../store/notificationStore';
import { SignalAction } from '../types/signal';

class NotificationService {
  private isInitialized = false;

  /**
   * Initialize notification channels on native Android
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (Capacitor.isNativePlatform()) {
      try {
        // Create high-importance notification channel for Android 8.0+
        await LocalNotifications.createChannel({
          id: 'stock-signals',
          name: 'Stock Timing Signals',
          description: 'Real-time alerts for stock buy/sell timing signals and monitored watchlist changes',
          importance: 5, // IMPORTANCE_HIGH (shows as heads-up notification with sound/vibration)
          visibility: 1, // VISIBILITY_PUBLIC
          vibration: true,
          lights: true,
          lightColor: '#10B981'
        });
        this.isInitialized = true;
      } catch (err) {
        console.warn('Failed to create Android notification channel', err);
      }
    } else {
      this.isInitialized = true;
    }
  }

  /**
   * Check if system notifications are supported
   */
  public isSupported(): boolean {
    if (Capacitor.isNativePlatform()) return true;
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Get current notification permission status
   */
  public async getPermissionStatus(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      try {
        const check = await LocalNotifications.checkPermissions();
        return check.display === 'granted';
      } catch (e) {
        return false;
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted';
    }

    return false;
  }

  /**
   * Request system notification permission from user
   */
  public async requestPermission(): Promise<'granted' | 'denied' | 'unsupported'> {
    await this.initialize();

    if (Capacitor.isNativePlatform()) {
      try {
        const res = await LocalNotifications.requestPermissions();
        return res.display === 'granted' ? 'granted' : 'denied';
      } catch (e) {
        console.error('Error requesting native notification permission', e);
        return 'denied';
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission as 'granted' | 'denied';
      } catch (e) {
        console.error('Error requesting web notification permission', e);
        return 'denied';
      }
    }

    return 'unsupported';
  }

  /**
   * Dispatch a notification (shows native Android OS banner/vibration + logs to in-app bell)
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
  }): Promise<boolean> {
    await this.initialize();

    const store = useNotificationStore.getState();

    // Check master toggle
    if (!store.notificationsEnabled) return false;

    // Check category toggles
    if (category === 'HOLDING' && !store.notifyPersonalHoldings) return false;
    if (category === 'WATCHLIST' && !store.notifyWatchlist) return false;

    // Check sensitivity level
    if (store.sensitivity === 'HIGH_CONVICTION_ONLY') {
      if (signalAction !== 'STRONG_BUY' && signalAction !== 'STRONG_SELL') {
        return false;
      }
    }

    // Always record alert in in-app notification center
    store.addAlert({
      ticker,
      companyName,
      signalAction,
      title,
      message,
      price,
      category
    });

    // 1. Native Mobile Platform (Android / iOS)
    if (Capacitor.isNativePlatform()) {
      try {
        const perm = await LocalNotifications.checkPermissions();
        if (perm.display === 'granted') {
          const notifId = Math.floor(Math.random() * 900000) + 100000;
          await LocalNotifications.schedule({
            notifications: [
              {
                id: notifId,
                title: `InvestLearn: ${ticker} - ${title}`,
                body: `${message} (Price: $${price.toFixed(2)})`,
                channelId: 'stock-signals',
                schedule: { at: new Date(Date.now() + 100) }, // fire immediately
                actionTypeId: '',
                extra: {
                  ticker,
                  category
                }
              }
            ]
          });
          return true;
        }
      } catch (err) {
        console.warn('Native local notification dispatch error:', err);
      }
      return false;
    }

    // 2. Web Browser Fallback
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
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
        return true;
      } catch (err) {
        console.warn('Could not display browser notification banner:', err);
      }
    }

    return false;
  }

  /**
   * Send a test notification to verify OS permissions and visual rendering
   */
  public async sendTestNotification(type: 'HOLDING' | 'WATCHLIST' = 'HOLDING'): Promise<boolean> {
    const perm = await this.requestPermission();
    if (perm !== 'granted') {
      return false;
    }

    if (type === 'HOLDING') {
      return await this.notify({
        ticker: 'AAPL',
        companyName: 'Apple Inc',
        signalAction: 'BUY',
        title: 'Holding Alert: Buy Window Active',
        message: 'Personal portfolio holding AAPL entered favorable accumulation range near support.',
        price: 336.13,
        category: 'HOLDING'
      });
    } else {
      return await this.notify({
        ticker: 'NVDA',
        companyName: 'NVIDIA Corp',
        signalAction: 'STRONG_BUY',
        title: 'Watchlist Alert: Strong Buy Triggered',
        message: 'Monitored stock NVDA triggered a bullish MACD crossover with high volume surge.',
        price: 222.27,
        category: 'WATCHLIST'
      });
    }
  }
}

export const notificationService = new NotificationService();
