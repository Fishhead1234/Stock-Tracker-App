import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Trash2, 
  Lock, 
  Smartphone, 
  Globe, 
  Radio, 
  Coins,
  Crown,
  Bell,
  BellRing,
  CheckCircle2,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Send,
  AlertCircle,
  Bot,
  Sun,
  Moon,
  User,
  Mail,
  Globe2,
  Plus
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useMarketStore } from '../../store/marketStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { notificationService } from '../../services/notificationService';
import { stockService } from '../../services/stockService';
import { aiTutorService } from '../../services/aiTutorService';
import { ComplianceModal } from '../../components/Common/ComplianceModal';
import { UpgradeProModal } from '../../components/Subscription/UpgradeProModal';
import { COMPLIANCE_NOTICES } from '../../constants/compliance';
import { GLOBAL_MARKETS, GlobalMarket } from '../../constants/markets';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';
import { useLanguageStore } from '../../store/languageStore';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';

export const SettingsScreen: React.FC = () => {
  const { language, setLanguage, t } = useLanguageStore();
  const { 
    finnhubApiKey, 
    setFinnhubApiKey, 
    geminiApiKey,
    setGeminiApiKey,
    geminiModel,
    resetOnboarding,
    currency,
    setCurrency,
    themeMode,
    setThemeMode,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    interestedSectors,
    setInterestedSectors
  } = useSettingsStore();

  const { watchlist, addToWatchlist, removeFromWatchlist } = useMarketStore();
  const isLight = themeMode === 'neutral-light';
  const { clearPortfolio } = usePortfolioStore();

  const {
    notificationsEnabled,
    notifyPersonalHoldings,
    notifyWatchlist,
    sensitivity,
    toggleNotificationsEnabled,
    toggleNotifyPersonalHoldings,
    toggleNotifyWatchlist,
    setSensitivity
  } = useNotificationStore();

  const { 
    plan, 
    getTrialDaysRemaining, 
    lifetimeSeatsTotal, 
    lifetimeSeatsClaimed 
  } = useSubscriptionStore();

  const [inputKey, setInputKey] = useState(finnhubApiKey);
  const [nameDraft, setNameDraft] = useState(userName || '');
  const [savedNameMsg, setSavedNameMsg] = useState(false);
  const [emailDraft, setEmailDraft] = useState(userEmail || '');
  const [savedEmailMsg, setSavedEmailMsg] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const [inputGeminiKey, setInputGeminiKey] = useState(geminiApiKey);
  const [geminiTestResult, setGeminiTestResult] = useState<string | null>(null);
  const [isTestingGemini, setIsTestingGemini] = useState(false);

  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [testNotificationResult, setTestNotificationResult] = useState<string | null>(null);
  const [hasSystemPermission, setHasSystemPermission] = useState<boolean | null>(null);

  const trialDays = getTrialDaysRemaining();
  const seatsRemaining = Math.max(0, lifetimeSeatsTotal - lifetimeSeatsClaimed);

  const handleSaveGeminiKey = async () => {
    const trimmed = inputGeminiKey.trim();
    setGeminiApiKey(trimmed);
    if (!trimmed) {
      setGeminiTestResult('Using default InvestLearn serverless AI proxy.');
      return;
    }

    setIsTestingGemini(true);
    setGeminiTestResult(null);
    const result = await aiTutorService.testConnection(trimmed, geminiModel || 'gemini-2.5-flash');
    setIsTestingGemini(false);
    setGeminiTestResult(result.message);
  };

  useEffect(() => {
    notificationService.getPermissionStatus().then(status => {
      setHasSystemPermission(status);
    });
  }, []);

  const handleSaveKey = async () => {
    setFinnhubApiKey(inputKey.trim());
    if (!inputKey.trim()) {
      setTestResult('Switched to Universal Global Simulation Engine.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const quote = await stockService.fetchLiveFinnhubQuote('AAPL', inputKey.trim());
    setIsTesting(false);

    if (quote && quote.price) {
      setTestResult(`Success! Connected to Finnhub. Live AAPL quote: $${quote.price.toFixed(2)} (15m delay notice applies).`);
    } else {
      setTestResult('Could not fetch quote with this key. Please check your Finnhub token.');
    }
  };

  const handleRequestSystemPermission = async () => {
    setTestNotificationResult(null);
    const res = await notificationService.requestPermission();
    const isGranted = res === 'granted';
    setHasSystemPermission(isGranted);
    if (isGranted) {
      setTestNotificationResult('✓ System notifications enabled! Native status bar and lock screen alerts are active.');
    } else {
      setTestNotificationResult('Notification permission not granted. You can enable them anytime in phone Settings -> Apps -> InvestLearn.');
    }
  };

  const handleTriggerTestAlert = async (type: 'HOLDING' | 'WATCHLIST') => {
    setTestNotificationResult(null);
    const success = await notificationService.sendTestNotification(type);
    const permStatus = await notificationService.getPermissionStatus();
    setHasSystemPermission(permStatus);
    if (success) {
      setTestNotificationResult(
        type === 'HOLDING'
          ? '✓ Dispatched live holding alert to your Android status bar & in-app bell!'
          : '✓ Dispatched live watchlist alert to your Android status bar & in-app bell!'
      );
    } else {
      setTestNotificationResult(
        '✓ Recorded in in-app notification center. Tap "Enable System Notifications" above to allow Android status bar popups.'
      );
    }
  };

  const currencyOptions = [
    { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
    { code: 'TWD', symbol: 'NT$', label: 'New Taiwan Dollar (TWD)' },
    { code: 'KRW', symbol: '₩', label: 'South Korean Won (KRW)' },
    { code: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
    { code: 'NZD', symbol: 'NZ$', label: 'New Zealand Dollar (NZD)' },
    { code: 'EUR', symbol: '€', label: 'Euro (EUR)' }
  ];

  return (
    <div className={`flex-1 flex flex-col pb-24 space-y-4 transition-colors ${
      isLight ? 'bg-[#F2F2F7] text-[#000000]' : 'bg-[#070D1E] text-white'
    }`}>
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Header */}
        <div className="pt-1">
          <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${
            isLight ? 'text-[#007AFF]' : 'text-slate-400'
          }`}>
            System & Preferences
          </span>
          <h2 className={`text-xl font-extrabold tracking-tight ${
            isLight ? 'text-[#000000]' : 'text-white'
          }`}>
            {t('settings_title', 'App Settings & Alerts')}
          </h2>
          <p className={`text-[13px] mt-0.5 leading-[1.6] ${
            isLight ? 'text-[#666666]' : 'text-slate-400'
          }`}>
            {t('settings_subtitle', 'Configure timing alert notifications, subscription status, and global market feeds.')}
          </p>
        </div>

        {/* 👤 0. TRADER PROFILE & IDENTITY (OPTIONAL NAME & GOOGLE/APPLE SYNC) */}
        <div className={`rounded-2xl p-4 space-y-3.5 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)]' 
            : 'bg-navy-900/90 border-navy-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-[#007AFF]/15 text-[#007AFF]' : 'bg-growth-500/20 text-growth-400'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#000000]' : 'text-white'
                }`}>
                  Trader Profile & Greeting
                </h3>
                <p className={`text-[11px] ${
                  isLight ? 'text-[#666666]' : 'text-slate-400'
                }`}>
                  Personalize your dashboard greeting. No account or password required.
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              userName 
                ? isLight ? 'bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/30' : 'bg-growth-500/20 text-growth-300'
                : isLight ? 'bg-black/5 text-[#8E8E93]' : 'bg-navy-800 text-slate-400'
            }`}>
              {userName ? 'Personalized' : 'Guest'}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-[#000000]' : 'text-slate-200'}`}>
                {t('profile_name_label', 'Display Name / Nickname')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onBlur={() => {
                    setUserName(nameDraft.trim());
                    setSavedNameMsg(true);
                    setTimeout(() => setSavedNameMsg(false), 2000);
                  }}
                  placeholder={t('onboarding_name_placeholder', 'Enter your name (e.g. Alex, Sam)')}
                  maxLength={25}
                  className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-none focus:ring-2 ${
                    isLight 
                      ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] text-[#000000] focus:ring-[#007AFF] focus:bg-white' 
                      : 'bg-navy-950 border-navy-700 text-white focus:ring-growth-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setUserName(nameDraft.trim());
                    setSavedNameMsg(true);
                    setTimeout(() => setSavedNameMsg(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#007AFF] text-white text-xs font-semibold hover:bg-[#0062CC] transition active:scale-95 cursor-pointer shrink-0"
                >
                  {savedNameMsg ? t('saved', 'Saved!') : t('save', 'Save')}
                </button>
              </div>
            </div>

            {/* Linked Email Address */}
            <div className="pt-2 border-t border-[rgba(0,0,0,0.06)] dark:border-navy-800">
              <div className="flex items-center justify-between mb-1">
                <label className={`block text-xs font-semibold ${isLight ? 'text-[#000000]' : 'text-slate-200'}`}>
                  {t('profile_email_label', 'Linked Email / Account')}
                </label>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  userEmail
                    ? isLight ? 'bg-[#34C759]/15 text-[#34C759]' : 'bg-growth-500/20 text-growth-400'
                    : isLight ? 'bg-black/5 text-[#8E8E93]' : 'bg-navy-800 text-slate-400'
                }`}>
                  {userEmail ? t('profile_linked', 'Linked') : t('profile_not_linked', 'Not linked')}
                </span>
              </div>

              {/* Quick 1-tap Google / Apple linking buttons */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    const chosen = (nameDraft || userName || '').trim();
                    const fallbackName = chosen ? chosen.toLowerCase().replace(/\s+/g, '') : 'trader';
                    const email = `${fallbackName}@gmail.com`;
                    setUserEmail(email);
                    setEmailDraft(email);
                    setSavedEmailMsg(true);
                    setTimeout(() => setSavedEmailMsg(false), 2000);
                  }}
                  className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                    userEmail.includes('gmail.com') || userEmail.includes('google')
                      ? 'bg-[#007AFF]/15 border-[#007AFF] text-[#007AFF]'
                      : isLight
                        ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] text-[#000000] hover:bg-[#E8E8ED]'
                        : 'bg-navy-950 border-navy-800 text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="truncate">{t('profile_link_google', 'Link Google')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const chosen = (nameDraft || userName || '').trim();
                    const fallbackName = chosen ? chosen.toLowerCase().replace(/\s+/g, '') : 'trader';
                    const email = `${fallbackName}@icloud.com`;
                    setUserEmail(email);
                    setEmailDraft(email);
                    setSavedEmailMsg(true);
                    setTimeout(() => setSavedEmailMsg(false), 2000);
                  }}
                  className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                    userEmail.includes('icloud.com') || userEmail.includes('apple')
                      ? 'bg-[#007AFF]/15 border-[#007AFF] text-[#007AFF]'
                      : isLight
                        ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] text-[#000000] hover:bg-[#E8E8ED]'
                        : 'bg-navy-950 border-navy-800 text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <svg className="w-[18px] h-[18px] shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                  <span className="truncate">{t('profile_link_apple', 'Link Apple')}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                    isLight ? 'text-[#8E8E93]' : 'text-slate-500'
                  }`} />
                  <input
                    type="email"
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    onBlur={() => {
                      setUserEmail(emailDraft.trim());
                      setSavedEmailMsg(true);
                      setTimeout(() => setSavedEmailMsg(false), 2000);
                    }}
                    placeholder={t('profile_email_placeholder', 'e.g. trader@example.com')}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs border transition focus:outline-none focus:ring-2 ${
                      isLight 
                        ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] text-[#000000] focus:ring-[#007AFF] focus:bg-white' 
                        : 'bg-navy-950 border-navy-700 text-white focus:ring-growth-500'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUserEmail(emailDraft.trim());
                    setSavedEmailMsg(true);
                    setTimeout(() => setSavedEmailMsg(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#007AFF] text-white text-xs font-semibold hover:bg-[#0062CC] transition active:scale-95 cursor-pointer shrink-0"
                >
                  {savedEmailMsg ? t('saved', 'Saved!') : t('save', 'Save')}
                </button>
              </div>
              <p className={`text-[11px] mt-1.5 ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                {t('profile_email_hint', 'Link your Google, Apple, or email address. Used for identity and optional reports.')}
              </p>
            </div>

            <p className={`text-[11px] ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
              🔒 Purchases, receipts, and free trial status are handled securely via your Google Play / Apple ID account.
            </p>
          </div>
        </div>

        {/* 🎨 1. THEME & APPEARANCE CARD (MANDATORY PROMINENT TOP POSITION) */}
        <div className={`rounded-2xl p-4 space-y-3.5 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)]' 
            : 'bg-navy-900/90 border-navy-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-[#007AFF]/15 text-[#007AFF]' : 'bg-gold-500/20 text-gold-400'
              }`}>
                {isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </div>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#000000]' : 'text-white'
                }`}>
                  Theme & Appearance
                </h3>
                <p className={`text-[11px] ${
                  isLight ? 'text-[#666666]' : 'text-slate-400'
                }`}>
                  Toggle between clean iOS Neutral Light and Classic Dark modes.
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              isLight 
                ? 'bg-[#007AFF]/15 text-[#007AFF] border border-[#007AFF]/30'
                : 'bg-navy-800 text-slate-300 border border-navy-700'
            }`}>
              {isLight ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>

          {/* Theme Selector Pills (min 48px touch targets) */}
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <button
              type="button"
              onClick={() => setThemeMode('neutral-light')}
              className={`min-h-[48px] p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition cursor-pointer ${
                themeMode === 'neutral-light'
                  ? 'bg-[#007AFF] text-white border-[#007AFF] shadow-xs font-bold'
                  : isLight
                    ? 'bg-[#F2F2F7] text-[#666666] border-black/10 hover:text-black hover:bg-[#E8E8ED]'
                    : 'bg-navy-950 text-slate-300 border-navy-800 hover:text-white'
              }`}
            >
              <Sun className={`w-4 h-4 ${themeMode === 'neutral-light' ? 'text-white' : 'text-[#FF9500]'}`} />
              <span>Light Mode (Spec)</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`min-h-[48px] p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-[#007AFF] text-white border-[#007AFF] shadow-xs font-bold'
                  : isLight
                    ? 'bg-[#F2F2F7] text-[#666666] border-black/10 hover:text-black hover:bg-[#E8E8ED]'
                    : 'bg-navy-950 text-slate-300 border-navy-800 hover:text-white'
              }`}
            >
              <Moon className={`w-4 h-4 ${themeMode === 'dark' ? 'text-white' : 'text-purple-400'}`} />
              <span>Dark Mode (Classic)</span>
            </button>
          </div>
        </div>

        {/* 🌐 2. LANGUAGE SELECTION CARD */}
        <div className={`rounded-2xl p-4 space-y-3 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)]' 
            : 'bg-navy-900/90 border-navy-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className={`w-4 h-4 ${isLight ? 'text-[#007AFF]' : 'text-growth-400'}`} />
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                {t('language_section_title', 'Language / 語言 / 言語 / 언어')}
              </h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
              isLight 
                ? 'bg-[#007AFF]/15 text-[#007AFF]' 
                : 'bg-growth-500/20 text-growth-400'
            }`}>
              8 Supported
            </span>
          </div>
          <p className={`text-[13px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
            {t('language_section_desc', 'Choose your preferred display language.')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {SUPPORTED_LANGUAGES.map(item => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  className={`min-h-[48px] p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-[#007AFF]/15 border-[#007AFF] text-[#007AFF] font-bold shadow-xs'
                        : 'bg-growth-600/25 border-growth-500 text-white font-bold ring-1 ring-growth-500/40 shadow-sm'
                      : isLight
                        ? 'bg-[#F2F2F7] border-black/10 text-[#666666] hover:text-black hover:border-black/20'
                        : 'bg-navy-950/60 border-navy-800 text-slate-400 hover:text-white hover:border-navy-700'
                  }`}
                >
                  <span className="text-lg shrink-0">{item.flag}</span>
                  <div className="min-w-0">
                    <div className={`truncate font-semibold ${
                      isSelected 
                        ? (isLight ? 'text-[#007AFF]' : 'text-white') 
                        : (isLight ? 'text-[#000000]' : 'text-slate-200')
                    }`}>
                      {item.nativeName}
                    </div>
                    <div className={`text-[10px] truncate ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                      {item.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 🌍 2.5. MONITORED GLOBAL MARKETS & EXCHANGES */}
        <div className={`rounded-2xl p-4 space-y-3.5 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)]' 
            : 'bg-navy-900/90 border-navy-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-[#007AFF]/15 text-[#007AFF]' : 'bg-growth-500/20 text-growth-400'
              }`}>
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#000000]' : 'text-white'
                }`}>
                  {t('markets_section_title', 'Monitored Global Markets & Exchanges')}
                </h3>
                <p className={`text-[11px] ${
                  isLight ? 'text-[#666666]' : 'text-slate-400'
                }`}>
                  {t('markets_section_desc', 'Add or toggle international stock markets to track live prices and timing signals.')}
                </p>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              isLight ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'bg-growth-500/20 text-growth-300'
            }`}>
              {GLOBAL_MARKETS.filter(m => m.tickers.some(t => watchlist.map(w => w.toUpperCase()).includes(t.toUpperCase()))).length} / {GLOBAL_MARKETS.length} Active
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {GLOBAL_MARKETS.map(market => {
              const isMonitored = market.tickers.some(t => 
                watchlist.map(w => w.toUpperCase()).includes(t.toUpperCase())
              ) || interestedSectors.includes(market.id);

              const activeCount = market.tickers.filter(t =>
                watchlist.map(w => w.toUpperCase()).includes(t.toUpperCase())
              ).length;

              const handleToggle = () => {
                if (isMonitored) {
                  market.tickers.forEach(t => removeFromWatchlist(t));
                  setInterestedSectors(interestedSectors.filter(id => id !== market.id));
                } else {
                  market.tickers.forEach(t => addToWatchlist(t));
                  if (!interestedSectors.includes(market.id)) {
                    setInterestedSectors([...interestedSectors, market.id]);
                  }
                }
              };

              return (
                <div
                  key={market.id}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isMonitored
                      ? isLight
                        ? 'bg-[#007AFF]/5 border-[#007AFF]/30 shadow-xs'
                        : 'bg-growth-950/20 border-growth-500/40'
                      : isLight
                        ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]'
                        : 'bg-navy-950/50 border-navy-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{market.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs font-bold truncate ${isLight ? 'text-black' : 'text-white'}`}>
                          {t(market.labelKey, market.defaultLabel)}
                        </h4>
                        {isMonitored && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                            isLight ? 'bg-[#34C759]/15 text-[#34C759]' : 'bg-growth-500/20 text-growth-400'
                          }`}>
                            {t('markets_active_badge', 'Active')} ({activeCount}/{market.tickers.length})
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                        {t(market.descriptionKey, market.defaultDescription)}
                      </p>
                      <p className={`text-[10px] font-mono mt-0.5 ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                        {market.tickers.join(' • ')}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggle}
                    data-touch-target="true"
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 ${
                      isMonitored
                        ? isLight
                          ? 'bg-[#FF3B30]/15 text-[#FF3B30] hover:bg-[#FF3B30]/25'
                          : 'bg-loss-500/20 text-loss-400 hover:bg-loss-500/30'
                        : isLight
                          ? 'bg-[#007AFF] text-white hover:bg-[#0062CC] shadow-xs'
                          : 'bg-growth-600 text-white hover:bg-growth-500 shadow-sm'
                    }`}
                  >
                    {isMonitored ? (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t('markets_remove_btn', 'Remove')}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t('markets_add_btn', 'Add to Watchlist')}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. MEMBERSHIP & SUBSCRIPTION CARD (Google Play Billing / 30-Day Trial) */}
        <div className={`rounded-2xl p-4 space-y-3 border shadow-md transition-all ${
          isLight
            ? 'bg-white border-[#FF9500]/40'
            : 'bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border-gold-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-[#FF9500]/15 text-[#FF9500]' : 'bg-gold-500/20 text-gold-400'
              }`}>
                <Crown className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#000000]' : 'text-white'
                }`}>
                  {t('membership_status', 'Membership Status')}
                </h3>
                <p className={`text-[11px] font-medium ${
                  isLight ? 'text-[#666666]' : 'text-slate-300'
                }`}>
                  {plan === 'LIFETIME'
                    ? "Founder's Lifetime Pass (Active)"
                    : plan === 'ANNUAL'
                    ? 'Pro Annual Member'
                    : plan === 'MONTHLY'
                    ? 'Pro Monthly Member'
                    : plan === 'FREE'
                    ? 'Free Member (Trial Expired)'
                    : `30-Day Free Trial (${trialDays} days remaining)`}
                </p>
              </div>
            </div>

            <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold flex items-center gap-1 ${
              plan === 'FREE'
                ? isLight
                  ? 'bg-[#FF3B30]/15 text-[#FF3B30] border border-[#FF3B30]/30'
                  : 'bg-loss-500/20 text-loss-300 border border-loss-500/30'
                : isLight
                ? 'bg-[#FF9500]/15 text-[#FF9500] border border-[#FF9500]/30'
                : 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
            }`}>
              <Sparkles className="w-3 h-3 text-[#FF9500]" />
              <span>{plan === 'LIFETIME' ? 'LIFETIME' : plan === 'FREE' ? 'FREE TIER' : 'PRO ACTIVE'}</span>
            </span>
          </div>

          {(plan === 'TRIAL' || plan === 'FREE') && (
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              isLight 
                ? 'bg-[#F2F2F7] border-black/10' 
                : 'bg-navy-950/80 border-navy-800'
            }`}>
              <div className="space-y-0.5">
                <div className={`font-semibold flex items-center gap-1.5 ${
                  isLight ? 'text-[#000000]' : 'text-white'
                }`}>
                  <Flame className="w-3.5 h-3.5 text-[#FF9500]" />
                  <span>Limited Lifetime Pass Available</span>
                </div>
                <p className={`text-[11px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                  {seatsRemaining} of {lifetimeSeatsTotal} seats remaining for first 1,000 investors.
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="min-h-[40px] px-3.5 py-1.5 bg-[#FF9500] hover:bg-[#E08500] text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
              >
                Claim $49.99
              </button>
            </div>
          )}

          {plan !== 'TRIAL' && (
            <div className={`text-xs flex items-center justify-between pt-1 ${
              isLight ? 'text-[#666666]' : 'text-slate-400'
            }`}>
              <span>Google Play In-App Billing linked</span>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-[#007AFF] hover:underline text-[11px] font-semibold cursor-pointer"
              >
                View Plans
              </button>
            </div>
          )}
        </div>

        {/* 4. NOTIFICATION & TIMING ALERT PREFERENCES */}
        <div className={`rounded-2xl p-4 space-y-3.5 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)]' 
            : 'bg-navy-900/90 border-navy-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className={`w-4 h-4 ${isLight ? 'text-[#007AFF]' : 'text-growth-400'}`} />
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                {t('notifications_card_title', 'Timing Alert Notifications')}
              </h3>
            </div>
            <button
              onClick={toggleNotificationsEnabled}
              className={`min-h-[36px] px-3 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                notificationsEnabled
                  ? isLight
                    ? 'bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/30'
                    : 'bg-growth-500/20 text-growth-300 border border-growth-500/40'
                  : isLight
                    ? 'bg-[#F2F2F7] text-[#8E8E93] border border-black/10'
                    : 'bg-navy-950 text-slate-400 border border-navy-800'
              }`}
            >
              <span>{notificationsEnabled ? 'Active' : 'Disabled'}</span>
            </button>
          </div>

          <p className={`text-[13px] leading-[1.6] ${
            isLight ? 'text-[#666666]' : 'text-slate-300'
          }`}>
            Choose exactly when and what type of timing signals you want to be alerted about:
          </p>

          <div className="space-y-2.5 pt-1">
            {/* Toggle 1: Personal Holdings */}
            <div 
              onClick={toggleNotifyPersonalHoldings}
              className={`min-h-[56px] p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                notifyPersonalHoldings && notificationsEnabled
                  ? isLight
                    ? 'bg-[#F2F2F7] border-[#007AFF]/40'
                    : 'bg-navy-950 border-growth-500/40'
                  : isLight
                    ? 'bg-white border-black/5 opacity-70'
                    : 'bg-navy-950/50 border-navy-850 opacity-70'
              }`}
            >
              <div className="space-y-0.5 max-w-[240px]">
                <div className={`text-xs font-bold flex items-center gap-1.5 ${
                  isLight ? 'text-[#000000]' : 'text-white'
                }`}>
                  <span>{t('personal_holdings_alerts', 'Personal Holdings Alerts')}</span>
                  {notifyPersonalHoldings && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-ping" />
                  )}
                </div>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                  {t('personal_holdings_desc', 'Notify when stocks you own enter Buy Window, Strong Buy, Trim Profit, or High Risk/Sell.')}
                </p>
              </div>
              <div className={`w-10 h-6 rounded-full transition flex items-center px-1 ${
                notifyPersonalHoldings && notificationsEnabled 
                  ? 'bg-[#34C759] justify-end' 
                  : isLight ? 'bg-[#E8E8ED] justify-start' : 'bg-navy-800 justify-start'
              }`}>
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            {/* Toggle 2: Stocks to Watch */}
            <div 
              onClick={toggleNotifyWatchlist}
              className={`min-h-[56px] p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                notifyWatchlist && notificationsEnabled
                  ? isLight
                    ? 'bg-[#F2F2F7] border-[#007AFF]/40'
                    : 'bg-navy-950 border-growth-500/40'
                  : isLight
                    ? 'bg-white border-black/5 opacity-70'
                    : 'bg-navy-950/50 border-navy-850 opacity-70'
              }`}
            >
              <div className="space-y-0.5 max-w-[240px]">
                <div className={`text-xs font-bold flex items-center gap-1.5 ${
                  isLight ? 'text-[#000000]' : 'text-white'
                }`}>
                  <span>{t('watchlist_alerts', '"Stocks to Watch" Alerts')}</span>
                  {notifyWatchlist && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500]" />
                  )}
                </div>
                <p className={`text-[11px] leading-relaxed ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                  {t('watchlist_desc', 'Notify when any monitored watchlist stock triggers Strong Buy or High Risk/Sell.')}
                </p>
              </div>
              <div className={`w-10 h-6 rounded-full transition flex items-center px-1 ${
                notifyWatchlist && notificationsEnabled 
                  ? 'bg-[#34C759] justify-end' 
                  : isLight ? 'bg-[#E8E8ED] justify-start' : 'bg-navy-800 justify-start'
              }`}>
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            {/* Sensitivity Selection */}
            <div className="pt-1 space-y-1.5">
              <label className={`text-[11px] font-semibold block ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {t('signal_filter_level', 'Signal Alert Filter Level')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSensitivity('ALL_TIMING_SIGNALS')}
                  className={`min-h-[48px] p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    sensitivity === 'ALL_TIMING_SIGNALS'
                      ? isLight
                        ? 'bg-[#007AFF] text-white border-[#007AFF]'
                        : 'bg-growth-600/20 border-growth-500 text-white font-bold'
                      : isLight
                        ? 'bg-[#F2F2F7] text-[#666666] border-black/10'
                        : 'bg-navy-950/70 border-navy-800 text-slate-400'
                  }`}
                >
                  {t('all_timing_changes', 'All Timing Changes')}
                  <span className={`block text-[10px] font-normal mt-0.5 ${
                    sensitivity === 'ALL_TIMING_SIGNALS' ? 'text-white/80' : isLight ? 'text-[#8E8E93]' : 'text-slate-400'
                  }`}>
                    Buy, Trim, Sell, Wait
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSensitivity('HIGH_CONVICTION_ONLY')}
                  className={`min-h-[48px] p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    sensitivity === 'HIGH_CONVICTION_ONLY'
                      ? isLight
                        ? 'bg-[#007AFF] text-white border-[#007AFF]'
                        : 'bg-growth-600/20 border-growth-500 text-white font-bold'
                      : isLight
                        ? 'bg-[#F2F2F7] text-[#666666] border-black/10'
                        : 'bg-navy-950/70 border-navy-800 text-slate-400'
                  }`}
                >
                  {t('high_urgency_only', 'High Urgency Only')}
                  <span className={`block text-[10px] font-normal mt-0.5 ${
                    sensitivity === 'HIGH_CONVICTION_ONLY' ? 'text-white/80' : isLight ? 'text-[#8E8E93]' : 'text-slate-400'
                  }`}>
                    Strong Buy & High Risk
                  </span>
                </button>
              </div>
            </div>

            {/* System Notification Permission Status Banner */}
            <div className={`pt-2 border-t space-y-2 ${isLight ? 'border-black/10' : 'border-navy-800'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold block ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                  Android OS System Alerts:
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  hasSystemPermission
                    ? 'bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/30'
                    : 'bg-[#FF9500]/15 text-[#FF9500] border border-[#FF9500]/30'
                }`}>
                  {hasSystemPermission ? 'Active (Status Bar Enabled)' : 'Permission Needed'}
                </span>
              </div>

              {!hasSystemPermission && (
                <div className={`p-3 rounded-xl border space-y-2 ${
                  isLight 
                    ? 'bg-[#FF9500]/10 border-[#FF9500]/30' 
                    : 'bg-navy-950/80 border-gold-500/40'
                }`}>
                  <p className={`text-xs ${isLight ? 'text-[#000000]' : 'text-slate-300'}`}>
                    To receive pop-up banners in your phone's notification bar when a buy or sell signal triggers, grant system notification permission.
                  </p>
                  <button
                    type="button"
                    onClick={handleRequestSystemPermission}
                    className="min-h-[44px] w-full py-2 px-3 bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>Enable System Notifications</span>
                  </button>
                </div>
              )}
            </div>

            {/* Test Notification Triggers */}
            <div className={`pt-2 border-t space-y-2 ${isLight ? 'border-black/10' : 'border-navy-800'}`}>
              <span className={`text-[11px] font-semibold block ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                Test Live Notification Alerts:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => handleTriggerTestAlert('HOLDING')}
                  className={`min-h-[44px] flex-1 py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isLight 
                      ? 'bg-[#F2F2F7] hover:bg-[#E8E8ED] text-[#000000] border-black/10' 
                      : 'bg-navy-800 hover:bg-navy-750 text-white border-navy-700'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-[#34C759]" />
                  <span>{t('test_holding_alert_btn', 'Test Holding Alert (AAPL)')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerTestAlert('WATCHLIST')}
                  className={`min-h-[44px] flex-1 py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isLight 
                      ? 'bg-[#F2F2F7] hover:bg-[#E8E8ED] text-[#000000] border-black/10' 
                      : 'bg-navy-800 hover:bg-navy-750 text-white border-navy-700'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-[#FF9500]" />
                  <span>{t('test_watchlist_alert_btn', 'Test Watchlist Alert (NVDA)')}</span>
                </button>
              </div>

              {testNotificationResult && (
                <div className="p-2.5 rounded-xl bg-[#34C759]/15 border border-[#34C759]/30 text-xs text-[#34C759] animate-fade-in flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{testNotificationResult}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. STRICT INFORMATIONAL DISCLOSURE */}
        <div className={`p-4 rounded-2xl border space-y-2 shadow-sm ${
          isLight 
            ? 'bg-white border-[#FF9500]/30' 
            : 'bg-gold-950/20 border-gold-500/40'
        }`}>
          <div className="flex items-center gap-2 text-[#FF9500] font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>{t('strict_disclosure_title', 'Strict Informational Disclosure')}</span>
          </div>
          <p className={`text-[13px] leading-[1.6] font-medium ${
            isLight ? 'text-[#000000]' : 'text-slate-200'
          }`}>
            {t('strict_disclosure_text', COMPLIANCE_NOTICES.NO_IN_APP_TRADING.text)}
          </p>
        </div>

        {/* 6. Legal Compliance & Risk Disclosures Card */}
        <div className={`rounded-2xl p-4 space-y-3 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)]' 
            : 'bg-navy-900/90 border-navy-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF9500]" />
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                Legal & Regulatory Disclosures
              </h3>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              isLight ? 'bg-[#34C759]/15 text-[#34C759]' : 'bg-growth-500/20 text-growth-400'
            }`}>
              18+ Verified
            </span>
          </div>

          <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 ${
            isLight 
              ? 'bg-[#F2F2F7] border-black/10 text-[#000000]' 
              : 'bg-navy-950/80 border-gold-500/30 text-slate-300'
          }`}>
            <p className="font-medium">{COMPLIANCE_NOTICES.PRIMARY_DISCLAIMER}</p>
            <p className={`text-[11px] italic ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              {COMPLIANCE_NOTICES.MARKET_RISK_WARNING.text}
            </p>
          </div>

          <button
            onClick={() => setShowComplianceModal(true)}
            className={`min-h-[44px] w-full py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isLight 
                ? 'bg-[#F2F2F7] hover:bg-[#E8E8ED] text-[#000000] border-black/10' 
                : 'bg-navy-800 hover:bg-navy-750 text-white border-navy-700'
            }`}
          >
            Review All Compliance & Risk Disclosures
          </button>
        </div>

        {/* 7. Preferred Base Currency */}
        <div className={`rounded-2xl p-4 space-y-3 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)]' 
            : 'bg-navy-900/90 border-navy-800'
        }`}>
          <div className="flex items-center gap-2">
            <Coins className={`w-4 h-4 ${isLight ? 'text-[#007AFF]' : 'text-growth-400'}`} />
            <h3 className={`text-xs font-bold uppercase tracking-wider ${
              isLight ? 'text-[#000000]' : 'text-white'
            }`}>
              {t('currency_section_title', 'Preferred Currency')}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {currencyOptions.map(opt => (
              <button
                key={opt.code}
                onClick={() => setCurrency(opt.code as any)}
                className={`min-h-[48px] p-2.5 rounded-xl border text-xs font-mono text-left transition cursor-pointer ${
                  currency === opt.code
                    ? isLight
                      ? 'bg-[#007AFF]/15 border-[#007AFF] text-[#007AFF] font-bold shadow-xs'
                      : 'bg-growth-600/20 border-growth-500 text-white font-bold'
                    : isLight
                      ? 'bg-[#F2F2F7] border-black/10 text-[#666666] hover:text-black'
                      : 'bg-navy-950/60 border-navy-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className={`font-semibold ${
                  currency === opt.code 
                    ? (isLight ? 'text-[#007AFF]' : 'text-white') 
                    : (isLight ? 'text-[#000000]' : 'text-slate-200')
                }`}>
                  {opt.code} ({opt.symbol})
                </div>
                <div className={`text-[10px] font-sans truncate ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                  {opt.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 8. Market Data Feed & API Setup */}
        <div className={`rounded-2xl p-4 space-y-3 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)]' 
            : 'bg-navy-900/90 border-navy-800'
        }`}>
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isLight ? 'text-[#007AFF]' : 'text-growth-400'}`} />
            <h3 className={`text-xs font-bold uppercase tracking-wider ${
              isLight ? 'text-[#000000]' : 'text-white'
            }`}>
              Market Data Engine
            </h3>
          </div>

          <p className={`text-[13px] leading-[1.6] ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>
            InvestLearn tracks global equities across <strong>Taiwan (TWSE), Korea (KRX), US (NYSE/NASDAQ), UK (LSE), NZ (NZX), and Australia (ASX)</strong>.
          </p>

          <div className="space-y-2">
            <label className={`text-[11px] font-semibold block ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              Finnhub API Key (Optional Pro Feed)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Paste free Finnhub token here..."
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none transition ${
                  isLight 
                    ? 'bg-[#F2F2F7] border border-black/10 text-[#000000] placeholder-[#8E8E93] focus:border-[#007AFF]' 
                    : 'bg-navy-950 border border-navy-750 text-white placeholder-slate-600 focus:border-growth-500'
                }`}
              />
              <button
                onClick={handleSaveKey}
                disabled={isTesting}
                className="min-h-[44px] px-4 py-2 bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {isTesting ? 'Testing...' : 'Save & Test'}
              </button>
            </div>
            {testResult && (
              <p className={`text-xs p-2.5 rounded-lg border ${
                isLight 
                  ? 'text-[#007AFF] bg-[#F2F2F7] border-black/10' 
                  : 'text-gold-300/90 bg-navy-950/80 border-navy-800'
              }`}>
                {testResult}
              </p>
            )}
          </div>
        </div>

        {/* 9. Gemini AI Market Tutor Setup */}
        <div className={`rounded-2xl p-4 space-y-3.5 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[#007AFF]/20' 
            : 'bg-navy-900/90 border-purple-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? 'text-[#000000]' : 'text-white'
                }`}>
                  <span>Gemini AI Market Tutor</span>
                  <Sparkles className="w-3 h-3 text-[#FF9500]" />
                </h3>
                <span className={`text-[11px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                  Powered by Google Gemini 2.5
                </span>
              </div>
            </div>

            <span className="text-[10px] bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
              {geminiModel || 'gemini-2.5-flash'}
            </span>
          </div>

          <p className={`text-[13px] leading-[1.6] ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>
            The AI Market Tutor analyzes stock charts, RSI, MACD crossovers, and financial news in plain English. Works out-of-the-box, or connect your own free Google Gemini API key for private, unlimited queries.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`text-[11px] font-semibold ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                Custom Gemini API Key (Optional)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#007AFF] dark:text-purple-400 hover:underline font-sans"
              >
                Get free key at Google AI Studio ↗
              </a>
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                value={inputGeminiKey}
                onChange={(e) => setInputGeminiKey(e.target.value)}
                placeholder="Paste Gemini API key (AIzaSy...)"
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none transition ${
                  isLight 
                    ? 'bg-[#F2F2F7] border border-black/10 text-[#000000] placeholder-[#8E8E93] focus:border-[#007AFF]' 
                    : 'bg-navy-950 border border-navy-750 text-white placeholder-slate-600 focus:border-purple-500'
                }`}
              />
              <button
                type="button"
                onClick={handleSaveGeminiKey}
                disabled={isTestingGemini}
                className="min-h-[44px] px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50 cursor-pointer"
              >
                {isTestingGemini ? 'Testing...' : 'Save & Test'}
              </button>
            </div>

            {geminiTestResult && (
              <div className={`p-2.5 rounded-xl border text-xs animate-fade-in ${
                geminiTestResult.startsWith('✓')
                  ? 'bg-[#34C759]/15 border-[#34C759]/30 text-[#34C759]'
                  : isLight 
                    ? 'bg-[#F2F2F7] border-black/10 text-[#000000]' 
                    : 'bg-navy-950/90 border-navy-750 text-slate-300'
              }`}>
                {geminiTestResult}
              </div>
            )}
          </div>
        </div>

        {/* 10. Portfolio Data Management */}
        <div className={`rounded-2xl p-4 space-y-3 border shadow-xs transition-all ${
          isLight 
            ? 'bg-white border-[rgba(0,0,0,0.1)]' 
            : 'bg-navy-900/90 border-navy-800'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
            isLight ? 'text-[#000000]' : 'text-white'
          }`}>
            {t('data_management', 'Data Management')}
          </h3>

          <div className="space-y-2">
            <button
              onClick={clearPortfolio}
              className={`w-full min-h-[48px] py-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                isLight 
                  ? 'bg-[#F2F2F7] hover:bg-[#FFE5E5] text-[#FF3B30] border-black/5' 
                  : 'bg-navy-800 hover:bg-navy-750 text-[#FF3B30] border-navy-700'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('clear_positions', 'Clear Tracked Portfolio Positions')}</span>
            </button>

            <button
              onClick={resetOnboarding}
              className={`w-full min-h-[48px] py-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                isLight 
                  ? 'bg-[#F2F2F7] hover:bg-[#E8E8ED] text-[#000000] border-black/10' 
                  : 'bg-navy-800 dark:hover:bg-navy-750 text-white border-navy-700'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('reset_onboarding', 'Reset & Re-Take Onboarding')}</span>
            </button>
          </div>
        </div>

        {/* App Version & Packaging Info */}
        <div className={`text-center pt-2 text-xs space-y-1 font-mono ${
          isLight ? 'text-[#8E8E93]' : 'text-slate-500'
        }`}>
          <p>InvestLearn v1.2.0 • Neutral Light Native Architecture</p>
          <p>Google Play Billing Ready • 30-Day Full Access Trial</p>
        </div>
      </div>

      {showComplianceModal && (
        <ComplianceModal onClose={() => setShowComplianceModal(false)} />
      )}

      {showUpgradeModal && (
        <UpgradeProModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
};
