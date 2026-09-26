import { create } from 'zustand';

export type AppTab = 'dashboard' | 'signals' | 'news' | 'education' | 'settings' | 'stockDetail';
export type ThemeMode = 'neutral-light' | 'dark';
export type DevicePreset = 'iphone' | 'android' | 'responsive';

interface SettingsState {
  hasCompletedOnboarding: boolean;
  ageConfirmed: boolean;
  riskAcknowledged: boolean;
  experienceLevel: 'never_traded' | 'beginner' | 'intermediate';
  interestedSectors: string[];
  interestedCompanies: string[];
  currency: 'USD' | 'EUR' | 'GBP';
  finnhubApiKey: string;
  geminiApiKey: string;
  geminiModel: string;
  isPhoneFrameView: boolean;
  themeMode: ThemeMode;
  devicePreset: DevicePreset;
  activeTab: AppTab;
  setAgeConfirmed: (val: boolean) => void;
  setRiskAcknowledged: (val: boolean) => void;
  setExperienceLevel: (val: 'never_traded' | 'beginner' | 'intermediate') => void;
  userName: string;
  userEmail: string;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setInterestedSectors: (sectors: string[]) => void;
  setInterestedCompanies: (companies: string[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setCurrency: (c: 'USD' | 'EUR' | 'GBP') => void;
  setFinnhubApiKey: (key: string) => void;
  setGeminiApiKey: (key: string) => void;
  setGeminiModel: (model: string) => void;
  setPhoneFrameView: (val: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setDevicePreset: (preset: DevicePreset) => void;
  setActiveTab: (tab: AppTab) => void;
}

const SETTINGS_STORAGE_KEY = 'investlearn_settings_v4';

const loadSavedSettings = () => {
  try {
    // Clear legacy keys so that the app starts fresh at the welcome screen
    localStorage.removeItem('investlearn_settings_v2');
    localStorage.removeItem('investlearn_settings_v3');
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
    userName: '',
    userEmail: '',
    currency: 'USD',
    finnhubApiKey: '',
    geminiApiKey: '',
    geminiModel: 'gemini-2.5-flash',
    isPhoneFrameView: true,
    themeMode: 'neutral-light',
    devicePreset: 'iphone',
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
        userName: state.userName,
        userEmail: state.userEmail,
        interestedSectors: state.interestedSectors,
        interestedCompanies: state.interestedCompanies,
        currency: state.currency,
        finnhubApiKey: state.finnhubApiKey,
        geminiApiKey: state.geminiApiKey,
        geminiModel: state.geminiModel,
        isPhoneFrameView: state.isPhoneFrameView,
        themeMode: state.themeMode,
        devicePreset: state.devicePreset
      }));
    } catch (e) {
      console.error(e);
    }
  };

  return {
    ...initial,
    activeTab: 'dashboard',

    setUserName: (userName) => {
      set({ userName });
      persist();
    },

    setUserEmail: (userEmail) => {
      set({ userEmail });
      persist();
    },

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

    setGeminiApiKey: (geminiApiKey) => {
      set({ geminiApiKey });
      persist();
    },

    setGeminiModel: (geminiModel) => {
      set({ geminiModel });
      persist();
    },

    setPhoneFrameView: (isPhoneFrameView) => {
      set({ isPhoneFrameView });
      persist();
    },

    setThemeMode: (themeMode) => {
      set({ themeMode });
      persist();
    },

    setDevicePreset: (devicePreset) => {
      set({ devicePreset });
      persist();
    },

    setActiveTab: (activeTab) => set({ activeTab })
  };
});
