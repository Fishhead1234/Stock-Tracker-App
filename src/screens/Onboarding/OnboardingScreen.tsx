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
  Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPLIANCE_NOTICES } from '../../constants/compliance';
import { useSettingsStore } from '../../store/settingsStore';
import { useMarketStore } from '../../store/marketStore';
import { AddStockModal } from '../AddStock/AddStockModal';

const GLOBAL_SECTORS = [
  { id: 'tw', label: 'Taiwan (TWSE) Tech & Chips', country: 'Taiwan', flag: '🇹🇼', tickers: ['2330.TW', '2454.TW', '0050.TW'] },
  { id: 'kr', label: 'Korea (KRX) KOSPI Leaders', country: 'South Korea', flag: '🇰🇷', tickers: ['005930.KS', '000660.KS', '005380.KS'] },
  { id: 'us', label: 'US Mega-Cap & Index ETFs', country: 'United States', flag: '🇺🇸', tickers: ['NVDA', 'AAPL', 'SPY', 'MSFT'] },
  { id: 'uk', label: 'UK (LSE) & European Leaders', country: 'United Kingdom', flag: '🇬🇧', tickers: ['AZN.L', 'SHEL.L', 'HSBA.L'] },
  { id: 'nz', label: 'New Zealand (NZX) & ASX', country: 'New Zealand / AU', flag: '🇳🇿', tickers: ['FPH.NZ', 'AIR.NZ', 'BHP.AX'] },
  { id: 'jp', label: 'Japan (TSE) Global Giants', country: 'Japan', flag: '🇯🇵', tickers: ['7203.T', '6758.T', '9984.T'] }
];

export const OnboardingScreen: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const {
    experienceLevel,
    setAgeConfirmed,
    setRiskAcknowledged,
    setExperienceLevel,
    setInterestedSectors,
    completeOnboarding,
    themeMode,
    setThemeMode
  } = useSettingsStore();

  const isLight = themeMode === 'neutral-light';
  const { toggleWatchlist } = useMarketStore();

  const [acceptedAllCompliance, setAcceptedAllCompliance] = useState(false);
  const [isAge18, setIsAge18] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['tw', 'us']);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const handleToggleSector = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const finalizeOnboarding = () => {
    setAgeConfirmed(true);
    setRiskAcknowledged(true);
    setInterestedSectors(selectedInterests);

    const chosenTickers = GLOBAL_SECTORS
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

  return (
    <div 
      className={`min-h-full flex-1 flex flex-col justify-between p-5 transition-colors duration-200 ${
        isLight ? 'bg-[#F2F2F7] text-[#000000]' : 'bg-[#070D1E] text-white'
      }`}
    >
      {/* Top Step Progress Indicator & Theme Pill */}
      <div className="w-full pt-2 pb-3">
        <div className="flex items-center justify-between text-xs mb-2.5">
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold text-xs ${isLight ? 'text-[#007AFF]' : 'text-growth-400'}`}>
              Step {step} of 4
            </span>
            <span className={isLight ? 'text-[#8E8E93]' : 'text-slate-500'}>•</span>
            <span className={`font-medium ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>
              {step === 1 && 'Global Tracker'}
              {step === 2 && 'Trading Style'}
              {step === 3 && 'Global Markets'}
              {step === 4 && 'Compliance & Risk'}
            </span>
          </div>

          {/* Quick theme toggle */}
          <button
            type="button"
            onClick={() => setThemeMode(isLight ? 'dark' : 'neutral-light')}
            aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              isLight 
                ? 'bg-white border-black/10 text-[#666666] hover:text-black shadow-xs' 
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

        {/* 4-Segment Progress Bar */}
        <div className={`h-2 w-full rounded-full overflow-hidden flex gap-1.5 p-0.5 ${
          isLight ? 'bg-[#E8E8ED]' : 'bg-navy-900'
        }`}>
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
            step >= 1 ? (isLight ? 'bg-[#007AFF]' : 'bg-growth-500') : (isLight ? 'bg-transparent' : 'bg-navy-800')
          }`} />
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
            step >= 2 ? (isLight ? 'bg-[#007AFF]' : 'bg-growth-500') : (isLight ? 'bg-transparent' : 'bg-navy-800')
          }`} />
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
            step >= 3 ? (isLight ? 'bg-[#007AFF]' : 'bg-growth-500') : (isLight ? 'bg-transparent' : 'bg-navy-800')
          }`} />
          <div className={`h-full flex-1 rounded-full transition-all duration-300 ${
            step >= 4 ? (isLight ? 'bg-[#007AFF]' : 'bg-growth-500') : (isLight ? 'bg-transparent' : 'bg-navy-800')
          }`} />
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 flex flex-col justify-center py-3">
        {/* STEP 1: Universal Global Platform & Purpose */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#007AFF] via-[#34C759] to-[#FF9500] flex items-center justify-center shadow-md">
              <Globe2 className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${
                isLight 
                  ? 'bg-white border border-black/10 text-[#007AFF] shadow-xs' 
                  : 'bg-navy-800 border border-navy-700 text-gold-400'
              }`}>
                <span>Universal Stock Exchange Tracker</span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                Global Market Timing & Portfolio Intelligence.
              </h1>
              <p className={`text-[16px] leading-[1.6] ${
                isLight ? 'text-[#666666]' : 'text-slate-300'
              }`}>
                Designed for new, part-time, and casual traders across <strong className={isLight ? 'text-[#000000]' : 'text-white'}>Taiwan, Korea, US, UK, NZ, Australia, and Japan</strong> to stay informed, track personal portfolios, and learn optimal market timing.
              </p>
            </div>

            {/* Informational Callout Card */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 text-left shadow-xs ${
              isLight 
                ? 'bg-white border-[rgba(0,0,0,0.1)]' 
                : 'bg-gold-950/25 border-gold-500/40'
            }`}>
              <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                isLight ? 'bg-[#FF9500]/15 text-[#FF9500]' : 'bg-gold-500/20 text-gold-400'
              }`}>
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
                  Purely Informational & Tracking
                </h4>
                <p className={`text-[13px] leading-[1.6] mt-0.5 ${
                  isLight ? 'text-[#666666]' : 'text-slate-300'
                }`}>
                  This app does not execute trades or hold money. Use our technical indicators for guidance, then trade on your own broker.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="min-h-[48px] w-full py-3.5 bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2 text-base active:scale-98 cursor-pointer"
            >
              <span>Continue</span>
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
                Your Trading Style
              </span>
              <h2 className={`text-2xl font-extrabold mt-1 tracking-tight ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                What best describes your journey?
              </h2>
              <p className={`text-[13px] mt-1 leading-[1.6] ${
                isLight ? 'text-[#666666]' : 'text-slate-400'
              }`}>
                We'll tailor technical timing indicators and alerts to your schedule.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'never_traded',
                  title: 'New Trader (Learning the ropes)',
                  desc: 'I want to track stocks that interest me, understand timing indicators, and avoid costly mistakes.',
                  badge: 'Beginner guidance'
                },
                {
                  id: 'beginner',
                  title: 'Part-Time Trader / Portfolio Manager',
                  desc: 'I have an active portfolio and need an intelligent daily dashboard to track timing signals.',
                  badge: 'Portfolio management'
                },
                {
                  id: 'intermediate',
                  title: 'Casual Global Trader',
                  desc: 'I trade across multiple countries (US, Taiwan, Korea, UK, NZ) and want cross-market indicators.',
                  badge: 'Global markets'
                }
              ].map(opt => {
                const isSelected = experienceLevel === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setExperienceLevel(opt.id as any)}
                    className={`min-h-[72px] p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? isLight
                          ? 'bg-white border-[#007AFF] ring-2 ring-[#007AFF]/20 shadow-md'
                          : 'bg-navy-850 border-growth-500 ring-1 ring-growth-500/40 shadow-glow-navy'
                        : isLight
                          ? 'bg-white border-[rgba(0,0,0,0.1)] hover:border-black/20 shadow-xs'
                          : 'bg-navy-900/80 border-navy-800 hover:border-navy-750'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-[16px] font-bold ${
                        isSelected 
                          ? (isLight ? 'text-[#007AFF]' : 'text-white') 
                          : (isLight ? 'text-[#000000]' : 'text-white')
                      }`}>
                        {opt.title}
                      </h4>
                      {isSelected && (
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${
                          isLight ? 'text-[#007AFF]' : 'text-growth-400'
                        }`} />
                      )}
                    </div>
                    <p className={`text-[13px] leading-[1.6] ${
                      isLight ? 'text-[#666666]' : 'text-slate-400'
                    }`}>
                      {opt.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className={`min-h-[48px] py-3 px-5 rounded-2xl text-sm font-semibold transition cursor-pointer ${
                  isLight 
                    ? 'bg-white text-[#666666] border border-black/10 hover:bg-[#E8E8ED]' 
                    : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="min-h-[48px] flex-1 py-3 bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold rounded-2xl text-sm sm:text-base transition shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Select Global Markets</span>
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
                Universal Exchanges
              </span>
              <h2 className={`text-2xl font-extrabold mt-1 tracking-tight ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                Which markets interest you?
              </h2>
              <p className={`text-[13px] mt-1 leading-[1.6] ${
                isLight ? 'text-[#666666]' : 'text-slate-400'
              }`}>
                Select the international stock exchanges you would like to track.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {GLOBAL_SECTORS.map(sec => {
                const isSelected = selectedInterests.includes(sec.id);
                return (
                  <div
                    key={sec.id}
                    onClick={() => handleToggleSector(sec.id)}
                    className={`min-h-[64px] p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? isLight
                          ? 'bg-white border-[#007AFF] ring-2 ring-[#007AFF]/15 shadow-xs'
                          : 'bg-navy-850 border-growth-500 shadow-sm'
                        : isLight
                          ? 'bg-white border-[rgba(0,0,0,0.1)] hover:border-black/20 shadow-xs'
                          : 'bg-navy-900/70 border-navy-800 hover:border-navy-750'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sec.flag}</span>
                      <div>
                        <h4 className={`text-[14px] font-bold ${
                          isLight ? 'text-[#000000]' : 'text-white'
                        }`}>
                          {sec.label}
                        </h4>
                        <p className={`text-[12px] font-mono ${
                          isLight ? 'text-[#8E8E93]' : 'text-slate-400'
                        }`}>
                          {sec.tickers.join(' • ')}
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                      isSelected 
                        ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-xs' 
                        : isLight 
                          ? 'border-black/20 bg-[#F2F2F7]' 
                          : 'border-navy-700 bg-navy-950'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className={`min-h-[48px] py-3 px-5 rounded-2xl text-sm font-semibold transition cursor-pointer ${
                  isLight 
                    ? 'bg-white text-[#666666] border border-black/10 hover:bg-[#E8E8ED]' 
                    : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="min-h-[48px] flex-1 py-3 bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold rounded-2xl text-sm sm:text-base transition shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Proceed to Compliance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Compliance & Risk Gate */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#FF9500]' : 'text-gold-400'
              }`}>
                <ShieldAlert className="w-4 h-4" />
                <span>Mandatory Compliance Disclosure</span>
              </div>
              <h2 className={`text-2xl font-extrabold mt-1 tracking-tight ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                Regulatory & Risk Notice
              </h2>
              <p className={`text-[13px] mt-1 leading-[1.6] ${
                isLight ? 'text-[#666666]' : 'text-slate-400'
              }`}>
                Please acknowledge that InvestLearn is strictly an informational tool.
              </p>
            </div>

            {/* Compliance Warning Container */}
            <div className={`rounded-2xl border p-4 space-y-3 max-h-[280px] overflow-y-auto text-[13px] leading-[1.6] shadow-xs ${
              isLight 
                ? 'bg-white border-[rgba(0,0,0,0.1)] text-[#000000]' 
                : 'bg-navy-900/90 border-navy-750 text-slate-300'
            }`}>
              <div className={`p-3 rounded-xl font-medium border ${
                isLight 
                  ? 'bg-[#F2F2F7] border-black/10 text-[#000000]' 
                  : 'bg-navy-950/80 border-gold-500/30 text-slate-100'
              }`}>
                {COMPLIANCE_NOTICES.PRIMARY_DISCLAIMER}
              </div>

              {/* Explicit No In-App Trading Warning */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                isLight 
                  ? 'bg-[#FF9500]/10 border-[#FF9500]/30 text-[#000000]' 
                  : 'bg-gold-950/30 border-gold-500/50 text-slate-200'
              }`}>
                <strong className={`flex items-center gap-1 uppercase font-mono text-xs ${
                  isLight ? 'text-[#FF9500]' : 'text-gold-400'
                }`}>
                  <Lock className="w-3.5 h-3.5" />
                  {COMPLIANCE_NOTICES.NO_IN_APP_TRADING.title}:
                </strong>
                <p className="text-[12px] leading-relaxed">
                  {COMPLIANCE_NOTICES.NO_IN_APP_TRADING.text}
                </p>
              </div>

              {/* Market Risk Warning */}
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
                <p className="text-[12px] leading-relaxed">{COMPLIANCE_NOTICES.MARKET_RISK_WARNING.text}</p>
              </div>

              {/* Data Delay Notice */}
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
                <p className="text-[12px] leading-relaxed">{COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.text}</p>
              </div>

              {/* No Guaranteed Returns */}
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
                <p className="text-[12px] leading-relaxed">{COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.text}</p>
              </div>

              {/* Use At Your Own Risk */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                isLight 
                  ? 'bg-[#F2F2F7] border-black/10 text-[#000000]' 
                  : 'bg-navy-950/80 border-navy-800 text-slate-300'
              }`}>
                <strong className={`flex items-center gap-1 uppercase font-mono text-xs ${
                  isLight ? 'text-[#666666]' : 'text-slate-200'
                }`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-[#34C759]' : 'text-growth-400'}`} />
                  {COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.title}:
                </strong>
                <p className="text-[12px] leading-relaxed">{COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.text}</p>
              </div>
            </div>

            {/* Checkboxes with min 48px touch area */}
            <div className="space-y-2 pt-1">
              <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer min-h-[48px] shadow-xs ${
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
                <span className={`text-[13px] leading-[1.6] ${
                  isLight ? 'text-[#000000]' : 'text-slate-300'
                }`}>
                  I confirm that I am <strong className={isLight ? 'text-[#007AFF]' : 'text-white'}>18 years of age or older</strong> and meet legal age requirements.
                </span>
              </label>

              <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer min-h-[48px] shadow-xs ${
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
                <span className={`text-[13px] leading-[1.6] ${
                  isLight ? 'text-[#000000]' : 'text-slate-300'
                }`}>
                  I agree to all <strong className={isLight ? 'text-[#007AFF]' : 'text-white'}>Disclaimers, Risk Notices, and No In-App Trading rules</strong>.
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                disabled={!isAge18 || !acceptedAllCompliance}
                onClick={handleStartEmpty}
                className={`min-h-[48px] w-full py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-md ${
                  isAge18 && acceptedAllCompliance
                    ? 'bg-[#007AFF] hover:bg-[#0062CC] text-white active:scale-98 cursor-pointer'
                    : isLight
                      ? 'bg-[#E8E8ED] text-[#8E8E93] cursor-not-allowed'
                      : 'bg-navy-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Start with Empty Portfolio</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                disabled={!isAge18 || !acceptedAllCompliance}
                onClick={handleAddCurrentPortfolio}
                className={`min-h-[48px] w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition border ${
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
                <span>Add in Your Current Portfolio</span>
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
      {/* Bottom gesture indicator */}
      <div className="flex justify-center pt-2 pb-1 select-none">
        <div className={`w-32 h-1 rounded-full ${isLight ? 'bg-black/20' : 'bg-white/20'}`} />
      </div>
    </div>
  );
};
