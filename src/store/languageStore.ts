import { create } from 'zustand';
import { SupportedLanguage, translations, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface LanguageState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const STORAGE_KEY = 'investlearn_language_v1';

const detectInitialLanguage = (): SupportedLanguage => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['en', 'ja', 'ko', 'zh-TW', 'zh-CN', 'es', 'de', 'fr'].includes(saved)) {
      return saved as SupportedLanguage;
    }

    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ja')) return 'ja';
      if (browserLang.startsWith('ko')) return 'ko';
      if (browserLang.includes('tw') || browserLang.includes('hk') || browserLang.includes('hant')) return 'zh-TW';
      if (browserLang.startsWith('zh')) return 'zh-CN';
      if (browserLang.startsWith('es')) return 'es';
      if (browserLang.startsWith('de')) return 'de';
      if (browserLang.startsWith('fr')) return 'fr';
    }
  } catch (e) {
    console.error('Error detecting language', e);
  }
  return 'en';
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: detectInitialLanguage(),

  setLanguage: (language: SupportedLanguage) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, language);
      }
    } catch (e) {
      console.error(e);
    }
    set({ language });
  },

  t: (key: string, fallback?: string) => {
    const lang = get().language;
    const dict = translations[lang] || translations.en;
    if (dict[key]) {
      return dict[key];
    }
    // Fallback to English if translation key is missing in active language
    if (translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  }
}));
