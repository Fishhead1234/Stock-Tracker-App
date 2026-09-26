import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  Award, 
  Check, 
  Zap, 
  BookOpen, 
  Lock, 
  Globe2, 
  Plus, 
  Sun, 
  Moon,
  Globe,
  Mail,
  User,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPLIANCE_NOTICES } from '../../constants/compliance';
import { useSettingsStore } from '../../store/settingsStore';
import { useMarketStore } from '../../store/marketStore';
import { useLanguageStore } from '../../store/languageStore';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { GLOBAL_MARKETS } from '../../constants/markets';
import { AddStockModal } from '../AddStock/AddStockModal';
import { LanguageSelectorModal } from '../../components/Common/LanguageSelectorModal';

export const OnboardingScreen: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const {
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    experienceLevel,
    setAgeConfirmed,
    setRiskAcknowledged,
    setExperienceLevel,
    setInterestedSectors,
    completeOnboarding,
    themeMode,
    setThemeMode
  } = useSettingsStore();

  const { language, t } = useLanguageStore();
  const isLight = themeMode === 'neutral-light';
  const { toggleWatchlist } = useMarketStore();

  const [acceptedAllCompliance, setAcceptedAllCompliance] = useState(false);
  const [isAge18, setIsAge18] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['tw', 'us', 'kr']);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState(userName || '');
  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [linkedProvider, setLinkedProvider] = useState<'Google' | 'Apple' | null>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleToggleSector = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const finalizeOnboarding = () => {
    setAgeConfirmed(true);
    setRiskAcknowledged(true);
    setInterestedSectors(selectedInterests);
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
    if (emailInput.trim()) {
      setUserEmail(emailInput.trim());
    }

    const chosenTickers = GLOBAL_MARKETS
      .filter(s => selectedInterests.includes(s.id))
      .flatMap(s => s.tickers);
    
    chosenTickers.forEach(t => toggleWatchlist(t));

    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    completeOnboarding();
  };

  const handleStartEmpty = () => {
    if (!isAge18 || !acceptedAllCompliance) return;
    finalizeOnboarding();
  };

  const handleAddCurrentPortfolio = () => {
    if (!isAge18 || !acceptedAllCompliance) return;
    setIsQuickAddOpen(true);
  };

  const handleQuickLink = (provider: 'Google' | 'Apple') => {
    setLinkedProvider(provider);
    if (!emailInput.trim()) {
      const generated = nameInput.trim() 
        ? `${nameInput.trim().toLowerCase().replace(/\s+/g, '')}@${provider === 'Google' ? 'gmail.com' : 'icloud.com'}`
        : `trader@${provider === 'Google' ? 'gmail.com' : 'icloud.com'}`;
      setEmailInput(generated);
    }
  };

  return (
    <div 
      className={`min-h-full flex-1 flex flex-col justify-between p-4 sm:p-5 transition-colors duration-200 safe-top ${
        isLight ? 'bg-[#F2F2F7] text-[#000000]' : 'bg-[#070D1E] text-white'
      }`}
    >
      {/* Top Header: Step Indicator, Language Picker & Theme Toggle */}
      <div className="w-full pt-1 pb-3">
        <div className="flex items-center justify-between text-xs mb-2.5 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`font-mono font-bold text-xs shrink-0 ${isLight ? 'text-[#007AFF]' : 'text-growth-400'}`}>
              Step {step} / 4
            </span>
            <span className={isLight ? 'text-[#8E8E93]' : 'text-slate-500'}>•</span>
            <span className={`font-medium truncate ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>
              {step === 1 && t('onboarding_step_tracker', 'Global Tracker')}
              {step === 2 && t('onboarding_step_style', 'Trading Style')}
              {step === 3 && t('onboarding_step_markets', 'Global Markets')}
              {step === 4 && t('onboarding_step_compliance', 'Compliance & Risk')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Language Selector Button */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              data-touch-target="true"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 cursor-pointer shadow-xs ${
                isLight 
                  ? 'bg-white border-black/10 text-[#000000] hover:bg-[#E8E8ED]' 
                  : 'bg-navy-900 border-navy-800 text-slate-200 hover:border-growth-500/50'
              }`}
              title="Select Language"
            >
              <span className="text-sm">{currentLang.flag}</span>
              <span className="font-mono text-[10px] uppercase font-bold">{currentLang.code.split('-')[0]}</span>
            </button>

            {/* Quick Theme Toggle */}
            <button
              type="button"
              onClick={() => setThemeMode(isLight ? 'dark' : 'neutral-light')}
              aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              data-touch-target="true"
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-xs ${
                isLight 
                  ? 'bg-white border-black/10 text-[#666666] hover:text-black hover:bg-[#E8E8ED]' 
                  : 'bg-navy-900 border-navy-800 text-slate-300 hover:text-white'
              }`}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span className="text-[11px]">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-gold-400" />
                  <span className="text-[11px]">Light</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4-Segment Progress Bar */}
        <div className={`h-2 w-full rounded-full overflow-hidden flex gap-1.5 p-0.5 ${
          isLight ? 'bg-[#E8E8ED]' : 'bg-navy-900'
        }`}>
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s}
              className={`h-full flex-1 rounded-full transition-all duration-300 ${
                step >= s 
                  ? isLight ? 'bg-[#007AFF]' : 'bg-growth-500' 
                  : isLight ? 'bg-transparent' : 'bg-navy-800'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 flex flex-col justify-center py-2 overflow-y-auto">
        {/* STEP 1: Universal Global Platform & Purpose */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#007AFF] via-[#34C759] to-[#FF9500] flex items-center justify-center shadow-md">
              <Globe2 className="w-7 h-7 text-white" />
            </div>

            <div className="space-y-1.5">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${
                isLight 
                  ? 'bg-white border border-black/10 text-[#007AFF] shadow-xs' 
                  : 'bg-navy-800 border border-navy-700 text-gold-400'
              }`}>
                <span>{t('onboarding_badge_tracker', 'Universal Stock Exchange Tracker')}</span>
              </div>
              <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                {t('onboarding_hero_title', 'Global Market Timing & Portfolio Intelligence.')}
              </h1>
              <p className={`text-[14px] leading-[1.6] ${
                isLight ? 'text-[#666666]' : 'text-slate-300'
              }`}>
                {t('onboarding_hero_desc', 'Designed for new, part-time, and casual traders across Taiwan, Korea, US, UK, NZ, Australia, and Japan to stay informed, track personal portfolios, and learn optimal market timing.')}
              </p>
            </div>

            {/* Informational Callout Card */}
            <div className={`p-3.5 rounded-2xl border flex items-start gap-3 text-left shadow-xs ${
              isLight 
                ? 'bg-white border-[rgba(0,0,0,0.1)]' 
                : 'bg-gold-950/25 border-gold-500/40'
            }`}>
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                isLight ? 'bg-[#FF9500]/15 text-[#FF9500]' : 'bg-gold-500/20 text-gold-400'
              }`}>
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs sm:text-sm font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                  {t('onboarding_info_title', 'Purely Informational & Tracking')}
                </h4>
                <p className={`text-[12px] leading-[1.5] mt-0.5 ${
                  isLight ? 'text-[#666666]' : 'text-slate-300'
                }`}>
                  {t('onboarding_info_desc', 'This app does not execute trades or hold money. Use our technical indicators for guidance, then trade on your own broker.')}
                </p>
              </div>
            </div>

            {/* Profile Greeting: Name Input */}
            <div className={`p-3.5 rounded-2xl border transition-colors shadow-xs space-y-3 ${
              isLight ? 'bg-white border-[rgba(0,0,0,0.1)]' : 'bg-navy-900 border-navy-850'
            }`}>
              <div>
                <label className={`block text-xs font-semibold mb-1 ${
                  isLight ? 'text-[#000000]' : 'text-slate-200'
                }`}>
                  {t('onboarding_name_label', 'What should we call you? (Optional)')}
                </label>
                <div className="relative">
                  <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                    isLight ? 'text-[#8E8E93]' : 'text-slate-500'
                  }`} />
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t('onboarding_name_placeholder', 'e.g. Alex, Sam, or Trader')}
                    maxLength={25}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 ${
                      isLight 
                        ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] text-[#000000] focus:ring-[#007AFF] focus:bg-white' 
                        : 'bg-navy-950 border-navy-750 text-white focus:ring-growth-500'
                    }`}
                  />
                </div>
              </div>

              {/* Optional Email & Account Linking */}
              <div className="pt-1 border-t border-[rgba(0,0,0,0.06)] dark:border-navy-800">
                <div className="flex items-center justify-between mb-1">
                  <label className={`block text-xs font-semibold ${
                    isLight ? 'text-[#000000]' : 'text-slate-200'
                  }`}>
                    {t('onboarding_email_label', 'Link Email or Account (Optional)')}
                  </label>
                  {linkedProvider && (
                    <span className="text-[10px] font-mono text-[#34C759] font-bold">
                      ✓ {linkedProvider} Linked
                    </span>
                  )}
                </div>

                {/* Quick 1-tap Google / Apple Provider Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLink('Google')}
                    className={`min-h-[42px] px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                      linkedProvider === 'Google'
                        ? 'bg-[#007AFF]/15 border-[#007AFF] text-[#007AFF]'
                        : isLight
                          ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] text-[#000000] hover:bg-[#E8E8ED]'
                          : 'bg-navy-950 border-navy-800 text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    {/* Official Google "G" 4-color Vector Logo */}
                    <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="truncate">{t('onboarding_google_link', 'Continue with Google')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLink('Apple')}
                    className={`min-h-[42px] px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                      linkedProvider === 'Apple'
                        ? 'bg-[#007AFF]/15 border-[#007AFF] text-[#007AFF]'
                        : isLight
                          ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] text-[#000000] hover:bg-[#E8E8ED]'
                          : 'bg-navy-950 border-navy-800 text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    {/* High-visibility prominent Apple Vector Logo */}
                    <svg
                      className="w-[19px] h-[19px] shrink-0 fill-current"
                      viewBox="0 0 170 170"
                      aria-hidden="true"
                    >
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.85-11.7-14.43-6.19-9.87-11.11-20.98-14.75-33.32-3.64-12.34-5.46-24.03-5.46-35.08 0-14.12 3.65-25.75 10.96-34.89 7.31-9.14 16.39-13.78 27.24-13.91 4.9 0 10.23 1.25 16 3.76 5.76 2.5 9.77 3.82 12.02 3.94 1.83-.12 5.95-1.48 12.37-4.07 6.41-2.6 11.83-3.8 16.27-3.62 12.23.6 22.06 5.48 29.5 14.65-10.74 6.53-16 15.54-15.79 27.02.21 9.03 3.69 16.63 10.45 22.79 6.75 6.16 14.72 9.68 23.9 10.57-2.07 6.31-4.79 12.83-8.15 19.55zM119.22 31.84c0-7.39 2.66-14.28 7.97-20.67 5.32-6.39 11.96-10.45 19.92-12.17.65 1.52.98 3.15.98 4.9 0 7.39-2.82 14.51-8.47 21.36-5.65 6.85-12.44 10.76-20.37 11.74-.03-1.63-.03-3.35-.03-5.16z" />
                    </svg>
                    <span className="truncate">{t('onboarding_apple_link', 'Continue with Apple')}</span>
                  </button>
                </div>

                <div className="relative">
                  <Mail className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                    isLight ? 'text-[#8E8E93]' : 'text-slate-500'
                  }`} />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setLinkedProvider(null);
                    }}
                    placeholder={t('onboarding_email_placeholder', 'e.g. trader@example.com')}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition focus:outline-none focus:ring-2 ${
                      isLight 
                        ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] text-[#000000] focus:ring-[#007AFF] focus:bg-white' 
                        : 'bg-navy-950 border-navy-750 text-white focus:ring-growth-500'
                    }`}
                  />
                </div>
                <p className={`text-[10px] mt-1 ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                  {t('onboarding_email_hint', 'Optional. Link your email or Google/Apple account for profile sync and optional updates.')}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (nameInput.trim()) setUserName(nameInput.trim());
                if (emailInput.trim()) setUserEmail(emailInput.trim());
                setStep(2);
              }}
              className="min-h-[48px] w-full py-3.5 bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2 text-sm sm:text-base active:scale-98 cursor-pointer"
            >
              <span>{t('onboarding_btn_continue', 'Continue')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: Experience & Profile */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#007AFF]' : 'text-growth-400'
              }`}>
                {t('onboarding_style_tag', 'Your Trading Style')}
              </span>
              <h2 className={`text-xl sm:text-2xl font-extrabold mt-1 tracking-tight ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                {t('onboarding_style_title', 'What best describes your journey?')}
              </h2>
              <p className={`text-[13px] mt-1 leading-[1.6] ${
                isLight ? 'text-[#666666]' : 'text-slate-400'
              }`}>
                {t('onboarding_style_desc', "We'll tailor technical timing indicators and alerts to your schedule.")}
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'casual',
                  val: 'beginner',
                  title: t('onboarding_style_casual_title', 'Part-Time & Casual Trader'),
                  desc: t('onboarding_style_casual_desc', 'Checking markets after work or on weekends. Prefer clear swing timing alerts.'),
                  icon: <Clock className="w-5 h-5" />
                },
                {
                  id: 'new',
                  val: 'never_traded',
                  title: t('onboarding_style_beginner_title', 'New to Investing (Complete Beginner)'),
                  desc: t('onboarding_style_beginner_desc', 'Learning the basics of RSI, moving averages, and building wealth safely.'),
                  icon: <BookOpen className="w-5 h-5" />
                },
                {
                  id: 'active',
                  val: 'intermediate',
                  title: t('onboarding_style_active_title', 'Active Day / Swing Trader'),
                  desc: t('onboarding_style_active_desc', 'Monitoring intraday momentum, MACD crossovers, and volume spikes.'),
                  icon: <Zap className="w-5 h-5" />
                }
              ].map(opt => {
                const isSelected = experienceLevel === opt.val;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setExperienceLevel(opt.val as any)}
                    className={`min-h-[58px] p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? isLight
                          ? 'bg-white border-[#007AFF] ring-2 ring-[#007AFF]/15 shadow-xs'
                          : 'bg-navy-850 border-growth-500 shadow-sm'
                        : isLight
                          ? 'bg-white border-[rgba(0,0,0,0.1)] hover:border-black/20 shadow-xs'
                          : 'bg-navy-900/70 border-navy-800 hover:border-navy-750'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isSelected 
                          ? isLight ? 'bg-[#007AFF]/15 text-[#007AFF]' : 'bg-growth-500/20 text-growth-400'
                          : isLight ? 'bg-[#F2F2F7] text-[#666666]' : 'bg-navy-800 text-slate-400'
                      }`}>
                        {opt.icon}
                      </div>
                      <div>
                        <h4 className={`text-[13px] sm:text-[14px] font-bold ${
                          isLight ? 'text-[#000000]' : 'text-white'
                        }`}>
                          {opt.title}
                        </h4>
                        <p className={`text-[11px] sm:text-[12px] leading-snug mt-0.5 ${
                          isLight ? 'text-[#666666]' : 'text-slate-400'
                        }`}>
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition ${
                      isSelected 
                        ? 'bg-[#007AFF] border-[#007AFF] text-white' 
                        : isLight 
                          ? 'border-black/20 bg-[#F2F2F7]' 
                          : 'border-navy-700 bg-navy-950'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setStep(1)}
                className={`min-h-[48px] py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isLight 
                    ? 'bg-white text-[#666666] border border-black/10 hover:bg-[#E8E8ED]' 
                    : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
                }`}
              >
                {t('onboarding_btn_back', 'Back')}
              </button>
              <button
                onClick={() => setStep(3)}
                className="min-h-[48px] flex-1 py-3 bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold rounded-2xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>{t('onboarding_btn_select_markets', 'Select Global Markets')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Global Stock Markets Questionnaire */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#007AFF]' : 'text-growth-400'
              }`}>
                {t('onboarding_markets_tag', 'Universal Exchanges')}
              </span>
              <h2 className={`text-xl sm:text-2xl font-extrabold mt-1 tracking-tight ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                {t('onboarding_markets_title', 'Which markets interest you?')}
              </h2>
              <p className={`text-[13px] mt-1 leading-[1.6] ${
                isLight ? 'text-[#666666]' : 'text-slate-400'
              }`}>
                {t('onboarding_markets_desc', 'Select the international stock exchanges you would like to track.')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {GLOBAL_MARKETS.map(sec => {
                const isSelected = selectedInterests.includes(sec.id);
                return (
                  <div
                    key={sec.id}
                    onClick={() => handleToggleSector(sec.id)}
                    className={`min-h-[58px] p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? isLight
                          ? 'bg-white border-[#007AFF] ring-2 ring-[#007AFF]/15 shadow-xs'
                          : 'bg-navy-850 border-growth-500 shadow-sm'
                        : isLight
                          ? 'bg-white border-[rgba(0,0,0,0.1)] hover:border-black/20 shadow-xs'
                          : 'bg-navy-900/70 border-navy-800 hover:border-navy-750'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{sec.flag}</span>
                      <div className="min-w-0">
                        <h4 className={`text-[13px] sm:text-[14px] font-bold truncate ${
                          isLight ? 'text-[#000000]' : 'text-white'
                        }`}>
                          {t(sec.labelKey, sec.defaultLabel)}
                        </h4>
                        <p className={`text-[11px] font-mono ${
                          isLight ? 'text-[#8E8E93]' : 'text-slate-400'
                        }`}>
                          {sec.tickers.join(' • ')}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition ${
                      isSelected 
                        ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-xs' 
                        : isLight 
                          ? 'border-black/20 bg-[#F2F2F7]' 
                          : 'border-navy-700 bg-navy-950'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setStep(2)}
                className={`min-h-[48px] py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isLight 
                    ? 'bg-white text-[#666666] border border-black/10 hover:bg-[#E8E8ED]' 
                    : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
                }`}
              >
                {t('onboarding_btn_back', 'Back')}
              </button>
              <button
                onClick={() => setStep(4)}
                className="min-h-[48px] flex-1 py-3 bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold rounded-2xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>{t('onboarding_btn_proceed_compliance', 'Proceed to Compliance')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Compliance & Risk Gate */}
        {step === 4 && (
          <div className="space-y-3.5 animate-fadeIn">
            <div>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#FF9500]' : 'text-gold-400'
              }`}>
                <ShieldAlert className="w-4 h-4" />
                <span>{t('onboarding_compliance_tag', 'Mandatory Compliance Disclosure')}</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-extrabold mt-1 tracking-tight ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                {t('onboarding_compliance_title', 'Legal Notice & Financial Disclaimer')}
              </h2>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              <div className={`p-3 rounded-xl border space-y-1 ${
                isLight 
                  ? 'bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#000000]' 
                  : 'bg-loss-950/20 border-loss-600/30 text-slate-300'
              }`}>
                <strong className={`flex items-center gap-1 uppercase font-mono text-xs ${
                  isLight ? 'text-[#FF3B30]' : 'text-loss-400'
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {COMPLIANCE_NOTICES.MARKET_RISK_WARNING.title}:
                </strong>
                <p className="text-[11px] sm:text-[12px] leading-relaxed">{COMPLIANCE_NOTICES.MARKET_RISK_WARNING.text}</p>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${
                isLight 
                  ? 'bg-[#F2F2F7] border-black/10 text-[#000000]' 
                  : 'bg-navy-950/80 border-navy-800 text-slate-300'
              }`}>
                <strong className={`flex items-center gap-1 uppercase font-mono text-xs ${
                  isLight ? 'text-[#666666]' : 'text-slate-300'
                }`}>
                  <Clock className={`w-3.5 h-3.5 ${isLight ? 'text-[#007AFF]' : 'text-gold-400'}`} />
                  {COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.title}:
                </strong>
                <p className="text-[11px] sm:text-[12px] leading-relaxed">{COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.text}</p>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${
                isLight 
                  ? 'bg-[#F2F2F7] border-black/10 text-[#000000]' 
                  : 'bg-navy-950/80 border-navy-800 text-slate-300'
              }`}>
                <strong className={`flex items-center gap-1 uppercase font-mono text-xs ${
                  isLight ? 'text-[#666666]' : 'text-slate-200'
                }`}>
                  <Award className={`w-3.5 h-3.5 ${isLight ? 'text-[#007AFF]' : 'text-gold-400'}`} />
                  {COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.title}:
                </strong>
                <p className="text-[11px] sm:text-[12px] leading-relaxed">{COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.text}</p>
              </div>
            </div>

            {/* Checkboxes with min 48px touch area */}
            <div className="space-y-2 pt-1">
              <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer min-h-[48px] shadow-xs ${
                isLight 
                  ? 'bg-white border-[rgba(0,0,0,0.1)]' 
                  : 'bg-navy-950/80 border-navy-800'
              }`}>
                <input
                  type="checkbox"
                  checked={isAge18}
                  onChange={(e) => setIsAge18(e.target.checked)}
                  className="mt-1 rounded text-[#007AFF] focus:ring-[#007AFF] w-5 h-5 cursor-pointer"
                />
                <span className={`text-[12px] sm:text-[13px] leading-[1.5] ${
                  isLight ? 'text-[#000000]' : 'text-slate-300'
                }`}>
                  {t('onboarding_age_checkbox', 'I am 18 years of age or older')}
                </span>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer min-h-[48px] shadow-xs ${
                isLight 
                  ? 'bg-white border-[rgba(0,0,0,0.1)]' 
                  : 'bg-navy-950/80 border-navy-800'
              }`}>
                <input
                  type="checkbox"
                  checked={acceptedAllCompliance}
                  onChange={(e) => setAcceptedAllCompliance(e.target.checked)}
                  className="mt-1 rounded text-[#007AFF] focus:ring-[#007AFF] w-5 h-5 cursor-pointer"
                />
                <span className={`text-[12px] sm:text-[13px] leading-[1.5] ${
                  isLight ? 'text-[#000000]' : 'text-slate-300'
                }`}>
                  {t('onboarding_terms_checkbox', 'I understand InvestLearn is an educational tracking tool, not a financial broker')}
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                disabled={!isAge18 || !acceptedAllCompliance}
                onClick={handleStartEmpty}
                className={`min-h-[48px] w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md ${
                  isAge18 && acceptedAllCompliance
                    ? 'bg-[#007AFF] hover:bg-[#0062CC] text-white active:scale-98 cursor-pointer'
                    : isLight
                      ? 'bg-[#E8E8ED] text-[#8E8E93] cursor-not-allowed'
                      : 'bg-navy-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{t('onboarding_btn_start_empty', 'Start with Empty Portfolio')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                disabled={!isAge18 || !acceptedAllCompliance}
                onClick={handleAddCurrentPortfolio}
                className={`min-h-[48px] w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition border ${
                  isAge18 && acceptedAllCompliance
                    ? isLight
                      ? 'bg-white hover:bg-[#F2F2F7] text-[#007AFF] border-[#007AFF]/30 cursor-pointer shadow-xs'
                      : 'bg-navy-800 hover:bg-navy-750 text-white border-navy-700 cursor-pointer'
                    : isLight
                      ? 'bg-[#F2F2F7] text-[#8E8E93] border-black/10 cursor-not-allowed'
                      : 'bg-navy-900 text-slate-600 border-navy-850 cursor-not-allowed'
                }`}
              >
                <Plus className={`w-4 h-4 ${isLight ? 'text-[#007AFF]' : 'text-growth-400'}`} />
                <span>{t('onboarding_btn_add_portfolio', 'Log Current Holdings')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {isQuickAddOpen && (
        <AddStockModal
          onClose={() => {
            setIsQuickAddOpen(false);
            finalizeOnboarding();
          }}
        />
      )}

      {isLanguageModalOpen && (
        <LanguageSelectorModal
          onClose={() => setIsLanguageModalOpen(false)}
        />
      )}
    </div>
  );
};
