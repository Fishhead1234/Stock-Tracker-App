import { create } from 'zustand';

export type SubscriptionPlan = 'FREE' | 'TRIAL' | 'MONTHLY' | 'ANNUAL' | 'LIFETIME';

interface SubscriptionState {
  isPro: boolean;
  plan: SubscriptionPlan;
  trialStartDate: string;
  lifetimeSeatsTotal: number;
  lifetimeSeatsClaimed: number;
  purchaseDate: string | null;
  transactionId: string | null;

  // Computed / getters
  getTrialDaysRemaining: () => number;
  isTrialExpired: () => boolean;

  // Actions
  subscribe: (plan: 'MONTHLY' | 'ANNUAL' | 'LIFETIME') => void;
  restorePurchases: () => boolean;
  setProStatus: (isPro: boolean, plan?: SubscriptionPlan) => void;
  resetSubscription: () => void;
}

const STORAGE_KEY = 'investlearn_subscription_v1';
const FIRST_INSTALL_KEY = 'investlearn_first_installed_at';
const TRIAL_DURATION_DAYS = 30;

const loadSavedSubscription = () => {
  try {
    // 1. Detect if user already installed / onboarded previously
    const hasExistingData = typeof localStorage !== 'undefined' && (
      localStorage.getItem('investlearn_settings_v4') !== null ||
      localStorage.getItem('investlearn_watchlist_v4') !== null ||
      localStorage.getItem('investlearn_portfolio_v4') !== null
    );

    // 2. Resolve permanent install anchor
    let installDateStr = typeof localStorage !== 'undefined' ? localStorage.getItem(FIRST_INSTALL_KEY) : null;
    
    if (!installDateStr) {
      if (hasExistingData) {
        // User has been using the app for 3 days, but had the persistence bug.
        // Anchor to 3 days ago so their counter accurately reflects their 3rd day of usage (27 days remaining).
        const threeDaysAgo = new Date(Date.now() - (3 * 24 * 60 * 60 * 1000)).toISOString();
        installDateStr = threeDaysAgo;
      } else {
        installDateStr = new Date().toISOString();
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(FIRST_INSTALL_KEY, installDateStr);
      }
    }

    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const data = JSON.parse(raw);
      
      // If plan is TRIAL, guarantee trialStartDate aligns with our permanent install anchor
      if (data.plan === 'TRIAL') {
        if (!data.trialStartDate || new Date(data.trialStartDate).getTime() > new Date(installDateStr).getTime()) {
          data.trialStartDate = installDateStr;
        }

        const start = new Date(data.trialStartDate).getTime();
        const elapsedDays = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
        if (elapsedDays >= TRIAL_DURATION_DAYS) {
          const expiredData = {
            ...data,
            isPro: false,
            plan: 'FREE' as SubscriptionPlan
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredData));
          return expiredData;
        }
      }

      // Ensure data is definitely persisted in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }

    // First launch or unpersisted trial initialization:
    const initialData = {
      isPro: true,
      plan: 'TRIAL' as SubscriptionPlan,
      trialStartDate: installDateStr,
      lifetimeSeatsTotal: 1000,
      lifetimeSeatsClaimed: 742,
      purchaseDate: null,
      transactionId: null
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
    return initialData;

  } catch (e) {
    console.error('Failed to load subscription store', e);
  }

  // Safe fallback
  return {
    isPro: true,
    plan: 'TRIAL' as SubscriptionPlan,
    trialStartDate: new Date().toISOString(),
    lifetimeSeatsTotal: 1000,
    lifetimeSeatsClaimed: 742,
    purchaseDate: null,
    transactionId: null
  };
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => {
  const initial = loadSavedSubscription();

  const persist = () => {
    try {
      const state = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isPro: state.isPro,
        plan: state.plan,
        trialStartDate: state.trialStartDate,
        lifetimeSeatsTotal: state.lifetimeSeatsTotal,
        lifetimeSeatsClaimed: state.lifetimeSeatsClaimed,
        purchaseDate: state.purchaseDate,
        transactionId: state.transactionId
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // Immediate save on mount to ensure storage is never empty
  persist();

  return {
    ...initial,

    getTrialDaysRemaining: () => {
      const { trialStartDate, plan, isPro } = get();
      if (plan !== 'TRIAL') return 0;
      if (!trialStartDate || isNaN(new Date(trialStartDate).getTime())) return TRIAL_DURATION_DAYS;

      const start = new Date(trialStartDate).getTime();
      const now = Date.now();
      const elapsedDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      const remaining = Math.max(0, TRIAL_DURATION_DAYS - elapsedDays);

      if (remaining <= 0) {
        if (isPro) {
          set({ isPro: false, plan: 'FREE' });
          persist();
        }
        return 0;
      }
      return remaining;
    },

    isTrialExpired: () => {
      const { plan, getTrialDaysRemaining } = get();
      if (plan !== 'TRIAL') return false;
      return getTrialDaysRemaining() <= 0;
    },

    subscribe: (plan) => {
      const isLifetime = plan === 'LIFETIME';
      set(state => ({
        isPro: true,
        plan,
        purchaseDate: new Date().toISOString(),
        transactionId: `gplay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        lifetimeSeatsClaimed: isLifetime ? Math.min(state.lifetimeSeatsTotal, state.lifetimeSeatsClaimed + 1) : state.lifetimeSeatsClaimed
      }));
      persist();
    },

    restorePurchases: () => {
      const state = get();
      if (state.purchaseDate && state.plan !== 'TRIAL' && state.plan !== 'FREE') {
        return true;
      }
      return false;
    },

    setProStatus: (isPro: boolean, plan?: SubscriptionPlan) => {
      set(state => ({
        isPro,
        plan: plan || (isPro ? (state.plan === 'TRIAL' ? 'LIFETIME' : state.plan) : 'FREE')
      }));
      persist();
    },

    resetSubscription: () => {
      const now = new Date().toISOString();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(FIRST_INSTALL_KEY, now);
      }
      set({
        isPro: true,
        plan: 'TRIAL',
        trialStartDate: now,
        purchaseDate: null,
        transactionId: null
      });
      persist();
    }
  };
});
