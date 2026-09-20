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
const TRIAL_DURATION_DAYS = 30;

const loadSavedSubscription = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load subscription store', e);
  }

  // First launch: initialize 30-day free trial
  const now = new Date().toISOString();
  return {
    isPro: true, // Pro features active during 30-day trial!
    plan: 'TRIAL' as SubscriptionPlan,
    trialStartDate: now,
    lifetimeSeatsTotal: 1000,
    lifetimeSeatsClaimed: 742, // Scarcity counter for initial 1,000 lifetime seats
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

  return {
    ...initial,

    getTrialDaysRemaining: () => {
      const { trialStartDate, plan } = get();
      if (plan !== 'TRIAL') return 0;
      const start = new Date(trialStartDate).getTime();
      const now = Date.now();
      const elapsedDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
      const remaining = TRIAL_DURATION_DAYS - elapsedDays;
      return Math.max(0, remaining);
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
      set({
        isPro: true,
        plan: 'TRIAL',
        trialStartDate: new Date().toISOString(),
        purchaseDate: null,
        transactionId: null
      });
      persist();
    }
  };
});
