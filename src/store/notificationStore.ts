import { create } from 'zustand';
import { SignalAction } from '../types/signal';

export interface AppNotification {
  id: string;
  ticker: string;
  companyName: string;
  signalAction: SignalAction;
  title: string;
  message: string;
  price: number;
  timestamp: string; // ISO string
  isRead: boolean;
  category: 'HOLDING' | 'WATCHLIST' | 'SYSTEM';
}

interface NotificationState {
  notificationsEnabled: boolean;
  notifyPersonalHoldings: boolean;
  notifyWatchlist: boolean;
  soundEnabled: boolean;
  sensitivity: 'ALL_TIMING_SIGNALS' | 'HIGH_CONVICTION_ONLY';
  alerts: AppNotification[];
  
  // Actions
  toggleNotificationsEnabled: () => void;
  toggleNotifyPersonalHoldings: () => void;
  toggleNotifyWatchlist: () => void;
  toggleSound: () => void;
  setSensitivity: (level: 'ALL_TIMING_SIGNALS' | 'HIGH_CONVICTION_ONLY') => void;
  addAlert: (alert: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAlertAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAlerts: () => void;
  getUnreadCount: () => number;
}

const STORAGE_KEY = 'investlearn_notifications_v1';

const loadSavedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notification settings', e);
  }
  return {
    notificationsEnabled: true,
    notifyPersonalHoldings: true,
    notifyWatchlist: true,
    soundEnabled: true,
    sensitivity: 'ALL_TIMING_SIGNALS' as const,
    alerts: [
      {
        id: 'initial-alert-1',
        ticker: 'NVDA',
        companyName: 'NVIDIA Corp',
        signalAction: 'STRONG_BUY' as SignalAction,
        title: 'Strong Buy Signal Triggered',
        message: 'RSI oversold rebound detected with positive MACD golden cross. Ideal accumulation zone.',
        price: 119.80,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        isRead: false,
        category: 'WATCHLIST' as const
      },
      {
        id: 'initial-alert-2',
        ticker: 'AAPL',
        companyName: 'Apple Inc',
        signalAction: 'BUY' as SignalAction,
        title: 'Buy Window Confirmed',
        message: 'Healthy pullback to 50-day EMA support with stabilizing volume.',
        price: 224.50,
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        isRead: true,
        category: 'HOLDING' as const
      }
    ]
  };
};

export const useNotificationStore = create<NotificationState>((set, get) => {
  const initial = loadSavedState();

  const persist = () => {
    try {
      const state = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        notificationsEnabled: state.notificationsEnabled,
        notifyPersonalHoldings: state.notifyPersonalHoldings,
        notifyWatchlist: state.notifyWatchlist,
        soundEnabled: state.soundEnabled,
        sensitivity: state.sensitivity,
        alerts: state.alerts.slice(0, 50) // Keep last 50 alerts
      }));
    } catch (e) {
      console.error(e);
    }
  };

  return {
    ...initial,

    toggleNotificationsEnabled: () => {
      set(state => ({ notificationsEnabled: !state.notificationsEnabled }));
      persist();
    },

    toggleNotifyPersonalHoldings: () => {
      set(state => ({ notifyPersonalHoldings: !state.notifyPersonalHoldings }));
      persist();
    },

    toggleNotifyWatchlist: () => {
      set(state => ({ notifyWatchlist: !state.notifyWatchlist }));
      persist();
    },

    toggleSound: () => {
      set(state => ({ soundEnabled: !state.soundEnabled }));
      persist();
    },

    setSensitivity: (sensitivity) => {
      set({ sensitivity });
      persist();
    },

    addAlert: (item) => {
      const newAlert: AppNotification = {
        ...item,
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      set(state => ({
        alerts: [newAlert, ...state.alerts].slice(0, 50)
      }));
      persist();
    },

    markAlertAsRead: (id) => {
      set(state => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, isRead: true } : a)
      }));
      persist();
    },

    markAllAsRead: () => {
      set(state => ({
        alerts: state.alerts.map(a => ({ ...a, isRead: true }))
      }));
      persist();
    },

    clearAlerts: () => {
      set({ alerts: [] });
      persist();
    },

    getUnreadCount: () => {
      return get().alerts.filter(a => !a.isRead).length;
    }
  };
});
