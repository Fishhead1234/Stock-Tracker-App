import { create } from 'zustand';

export type AppTab = 'dashboard' | 'signals' | 'news' | 'education' | 'settings' | 'stockDetail';

interface SettingsState {
  hasCompletedOnboarding: boolean;
  ageConfirmed: boolean;
  riskAcknowledged: boolean;
  experienceLevel: 'never_traded' | 'beginner' | 'intermediate';
  interestedSectors: string[];
  interestedCompanies: string[];
  currency: 'USD' | 'EUR' | 'GBP';
  finnhubApiKey: string;
  isPhoneFrameView: boolean;
  activeTab: AppTab;
  setAgeConfirmed: (val: boolean) => void;
  setRiskAcknowledged: (val: boolean) => void;
  setExperienceLevel: (val: 'never_traded' | 'beginner' | 'intermediate') => void;
  setInterestedSectors: (sectors: string[]) => void;
  setInterestedCompanies: (companies: string[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setCurrency: (c: 'USD' | 'EUR' | 'GBP') => void;
  setFinnhubApiKey: (key: string) => void;
  setPhoneFrameView: (val: boolean) => void;
  setActiveTab: (tab: AppTab) => void;
}

const SETTINGS_STORAGE_KEY = 'investlearn_settings_v1';

const loadSavedSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {
    hasCompletedOnboarding: false,
    ageConfirmed: false,
    riskAcknowledged: false,
    experienceLevel: 'never_traded',
    interestedSectors: [],
    interestedCompanies: [],
    currency: 'USD',
    finnhubApiKey: '',
    isPhoneFrameView: true,
    activeTab: 'dashboard'
  };
};

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = loadSavedSettings();

  const persist = () => {
    try {
      const state = get();
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        ageConfirmed: state.ageConfirmed,
        riskAcknowledged: state.riskAcknowledged,
        experienceLevel: state.experienceLevel,
        interestedSectors: state.interestedSectors,
        interestedCompanies: state.interestedCompanies,
        currency: state.currency,
        finnhubApiKey: state.finnhubApiKey,
        isPhoneFrameView: state.isPhoneFrameView
      }));
    } catch (e) {
      console.error(e);
    }
  };

  return {
    ...initial,
    activeTab: 'dashboard',

    setAgeConfirmed: (ageConfirmed) => {
      set({ ageConfirmed });
      persist();
    },

    setRiskAcknowledged: (riskAcknowledged) => {
      set({ riskAcknowledged });
      persist();
    },

    setExperienceLevel: (experienceLevel) => {
      set({ experienceLevel });
      persist();
    },

    setInterestedSectors: (interestedSectors) => {
      set({ interestedSectors });
      persist();
    },

    setInterestedCompanies: (interestedCompanies) => {
      set({ interestedCompanies });
      persist();
    },

    completeOnboarding: () => {
      set({ hasCompletedOnboarding: true, activeTab: 'dashboard' });
      persist();
    },

    resetOnboarding: () => {
      set({
        hasCompletedOnboarding: false,
        ageConfirmed: false,
        riskAcknowledged: false,
        interestedSectors: [],
        interestedCompanies: []
      });
      persist();
    },

    setCurrency: (currency) => {
      set({ currency });
      persist();
    },

    setFinnhubApiKey: (finnhubApiKey) => {
      set({ finnhubApiKey });
      persist();
    },

    setPhoneFrameView: (isPhoneFrameView) => {
      set({ isPhoneFrameView });
      persist();
    },

    setActiveTab: (activeTab) => set({ activeTab })
  };
});
