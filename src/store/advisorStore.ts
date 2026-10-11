import { create } from 'zustand';
import { AdvisorMessage, InvestorProfile } from '../types/advisor';
import { aiAdvisorService, INITIAL_GREETING_MESSAGE } from '../services/aiAdvisorService';
import { useMarketStore } from './marketStore';
import { useLanguageStore } from './languageStore';

interface AdvisorState {
  messages: AdvisorMessage[];
  profile: InvestorProfile;
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  updateProfile: (profile: Partial<InvestorProfile>) => void;
  resetChat: () => void;
}

const STORAGE_KEY = 'investlearn_advisor_chat_v2';

const loadSavedAdvisorState = (): { messages: AdvisorMessage[]; profile: InvestorProfile } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.messages && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        return {
          messages: parsed.messages,
          profile: parsed.profile || {}
        };
      }
    }
  } catch (e) {
    console.error('Failed to load advisor chat', e);
  }
  return {
    messages: [INITIAL_GREETING_MESSAGE],
    profile: {}
  };
};

export const useAdvisorStore = create<AdvisorState>((set, get) => {
  const initial = loadSavedAdvisorState();

  const persist = (messages: AdvisorMessage[], profile: InvestorProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, profile }));
    } catch (e) {
      console.error('Failed to persist advisor chat', e);
    }
  };

  return {
    messages: initial.messages,
    profile: initial.profile,
    isTyping: false,

    updateProfile: (partial) => {
      const updatedProfile = { ...get().profile, ...partial };
      set({ profile: updatedProfile });
      persist(get().messages, updatedProfile);
    },

    sendMessage: async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || get().isTyping) return;

      const userMsg: AdvisorMessage = {
        id: 'msg_' + Date.now() + '_user',
        role: 'user',
        content: trimmed,
        timestamp: Date.now()
      };

      const currentMessages = [...get().messages, userMsg];
      set({ messages: currentMessages, isTyping: true });
      persist(currentMessages, get().profile);

      // Infer profile updates from common keywords
      const lower = trimmed.toLowerCase();
      const currentProfile = { ...get().profile };
      if (lower.includes('safe') || lower.includes('steady')) currentProfile.riskTolerance = 'low';
      if (lower.includes('tech') || lower.includes('growth')) currentProfile.goal = 'tech_growth';
      if (lower.includes('div')) currentProfile.goal = 'dividends';
      if (lower.includes('5+')) currentProfile.horizon = 'long';
      set({ profile: currentProfile });

      try {
        const quotes = useMarketStore.getState().quotes;
        const lang = useLanguageStore.getState().language;

        const response = await aiAdvisorService.generateAdvisorResponse(
          currentMessages,
          currentProfile,
          quotes,
          lang
        );

        const aiMsg: AdvisorMessage = {
          id: 'msg_' + Date.now() + '_ai',
          role: 'assistant',
          content: response.content,
          timestamp: Date.now(),
          recommendations: response.recommendations,
          quickReplies: response.quickReplies
        };

        const finalMessages = [...currentMessages, aiMsg];
        set({ messages: finalMessages, isTyping: false });
        persist(finalMessages, currentProfile);
      } catch (err) {
        console.error('Failed to get advisor response', err);
        const errorMsg: AdvisorMessage = {
          id: 'msg_' + Date.now() + '_err',
          role: 'assistant',
          content: "I'm having a little trouble connecting to market data right now, but feel free to ask me about Dollar-Cost Averaging, Index ETFs, or any specific stock like Nvidia or Tesla!",
          timestamp: Date.now(),
          quickReplies: [
            { id: 'q_retry', label: '🔄 Ask about Index ETFs', prompt: 'Tell me about safe index ETFs like VOO or USF.' },
            { id: 'q_dca', label: '💡 What is Dollar-Cost Averaging?', prompt: 'What is Dollar-Cost Averaging?' }
          ]
        };
        const finalMessages = [...currentMessages, errorMsg];
        set({ messages: finalMessages, isTyping: false });
        persist(finalMessages, currentProfile);
      }
    },

    resetChat: () => {
      const resetMessages = [INITIAL_GREETING_MESSAGE];
      const resetProfile = {};
      set({ messages: resetMessages, profile: resetProfile, isTyping: false });
      persist(resetMessages, resetProfile);
    }
  };
});
