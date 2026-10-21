/**
 * Speech Service: Web Speech API (TTS) for Nova AI Coach & Portfolio Roast.
 * Supports Male & Female voice profiles with Spicy/Sarcastic vs Encouraging delivery.
 */

export type VoiceGender = 'female' | 'male';
export type VoicePersona = 'spicy_sarcastic' | 'coach_encouraging';

export interface VoiceSettings {
  gender: VoiceGender;
  persona: VoicePersona;
  rate: number;
  pitch: number;
  volume: number;
}

const STORAGE_KEY = 'investlearn_voice_settings_v1';

const defaultSettings: VoiceSettings = {
  gender: 'female',
  persona: 'spicy_sarcastic',
  rate: 1.05,
  pitch: 1.2,
  volume: 1.0,
};

class SpeechService {
  private settings: VoiceSettings;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<(isSpeaking: boolean, currentMsgId?: string | null) => void> = new Set();
  private currentMsgId: string | null = null;

  constructor() {
    this.settings = this.loadSettings();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Chrome/Safari voice list initialization
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  private loadSettings(): VoiceSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
    } catch (e) {
      console.warn('Failed to load voice settings', e);
    }
    return defaultSettings;
  }

  public saveSettings(updates: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...updates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save voice settings', e);
    }
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public subscribe(fn: (isSpeaking: boolean, currentMsgId?: string | null) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify(isSpeaking: boolean, msgId: string | null = null) {
    this.listeners.forEach((fn) => fn(isSpeaking, msgId));
  }

  /**
   * Cleans markdown and formatting symbols from text for crisp, natural voice delivery
   */
  public cleanTextForSpeech(raw: string): string {
    return raw
      .replace(/RECOMMENDATION:[^\n]+/gi, '') // Remove internal recommendation tokens
      .replace(/\*\*([^*]+)\*\*/g, '$1')     // Bold text
      .replace(/\*([^*]+)\*/g, '$1')         // Italic text
      .replace(/#{1,6}\s+/g, '')             // Headers
      .replace(/[`_~>]/g, '')                // Code and quotes
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Emojis
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Finds the best matching voice on the current device
   */
  private pickVoice(gender: VoiceGender, lang: string = 'en'): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const langPrefix = lang.split('-')[0].toLowerCase();
    const matchingLangVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
    const pool = matchingLangVoices.length > 0 ? matchingLangVoices : voices;

    if (gender === 'female') {
      // Look for known female voice names or markers
      const femaleKeywords = ['female', 'samantha', 'victoria', 'karen', 'zira', 'serena', 'moira', 'tessa', 'fiona'];
      const found = pool.find(v => femaleKeywords.some(k => v.name.toLowerCase().includes(k)));
      if (found) return found;
      // Fallback to first voice in pool
      return pool[0] || null;
    } else {
      // Look for known male voice names or markers
      const maleKeywords = ['male', 'daniel', 'alex', 'fred', 'george', 'oliver', 'david', 'james', 'rishi'];
      const found = pool.find(v => maleKeywords.some(k => v.name.toLowerCase().includes(k)));
      if (found) return found;
      // Fallback: choose a voice different from the female one if available
      return pool.length > 1 ? pool[1] : pool[0] || null;
    }
  }

  /**
   * Speak a given message aloud
   */
  public speak(text: string, msgId: string = 'generic', lang: string = 'en'): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported on this device/browser');
      return;
    }

    this.stop();

    const cleaned = this.cleanTextForSpeech(text);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    const voice = this.pickVoice(this.settings.gender, lang);
    if (voice) {
      utterance.voice = voice;
    }

    // Calibrate pitch and rate to achieve spicy/sarcastic or encouraging tone
    if (this.settings.persona === 'spicy_sarcastic') {
      if (this.settings.gender === 'female') {
        // Sassy, energetic, crisp, sharp sarcastic bite
        utterance.pitch = 1.25;
        utterance.rate = 1.08;
      } else {
        // Deadpan, cynical, dry Wall Street trader sarcasm
        utterance.pitch = 0.88;
        utterance.rate = 1.02;
      }
    } else {
      // Friendly, encouraging coach
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }

    utterance.volume = this.settings.volume;

    utterance.onstart = () => {
      this.currentMsgId = msgId;
      this.notify(true, msgId);
    };

    utterance.onend = () => {
      this.currentMsgId = null;
      this.notify(false, null);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error', e);
      this.currentMsgId = null;
      this.notify(false, null);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stop any ongoing speech playback
   */
  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentMsgId = null;
    this.notify(false, null);
  }

  /**
   * Play a quick witty test quote
   */
  public testSample(gender?: VoiceGender, persona?: VoicePersona): void {
    const targetGender = gender || this.settings.gender;
    const targetPersona = persona || this.settings.persona;

    let sampleText = '';
    if (targetPersona === 'spicy_sarcastic') {
      if (targetGender === 'female') {
        sampleText = "Oh, look who decided to check their portfolio. Did you buy at the all-time high again? Don't worry darling, someone has to hold the bag!";
      } else {
        sampleText = "Brilliant move buying high and sweating the dip. Next time, try dollar-cost averaging before your portfolio looks like a crime scene.";
      }
    } else {
      if (targetGender === 'female') {
        sampleText = "Hey there! I'm Nova, your coach. Stay disciplined, trust the long-term compound growth, and let's win together!";
      } else {
        sampleText = "Welcome aboard. Keep your risk under control, ignore the daily market noise, and stick to the strategy.";
      }
    }

    const prevGender = this.settings.gender;
    const prevPersona = this.settings.persona;

    this.settings.gender = targetGender;
    this.settings.persona = targetPersona;
    this.speak(sampleText, 'test-preview');

    this.settings.gender = prevGender;
    this.settings.persona = prevPersona;
  }
}

export const speechService = new SpeechService();
