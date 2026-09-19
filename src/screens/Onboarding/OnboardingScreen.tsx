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
  Plus
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
    completeOnboarding
  } = useSettingsStore();

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
    <div className="min-h-full flex flex-col justify-between p-5 bg-gradient-to-b from-[#070D1E] via-navy-950 to-[#040814] text-white">
      {/* Top Step Progress Indicator */}
      <div className="w-full pt-2 pb-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>Step {step} of 4</span>
          <span>
            {step === 1 && 'Global Tracker'}
            {step === 2 && 'Trading Style'}
            {step === 3 && 'Global Markets'}
            {step === 4 && 'Compliance & Risk'}
          </span>
        </div>
        <div className="h-1.5 w-full bg-navy-900 rounded-full overflow-hidden flex gap-1">
          <div className={`h-full flex-1 rounded-full transition-all ${step >= 1 ? 'bg-growth-500' : 'bg-navy-800'}`} />
          <div className={`h-full flex-1 rounded-full transition-all ${step >= 2 ? 'bg-growth-500' : 'bg-navy-800'}`} />
          <div className={`h-full flex-1 rounded-full transition-all ${step >= 3 ? 'bg-growth-500' : 'bg-navy-800'}`} />
          <div className={`h-full flex-1 rounded-full transition-all ${step >= 4 ? 'bg-growth-500' : 'bg-navy-800'}`} />
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 flex flex-col justify-center py-4">
        {/* STEP 1: Universal Global Platform & Purpose */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-navy-600 via-growth-500 to-gold-500 flex items-center justify-center mx-auto sm:mx-0 shadow-lg shadow-growth-500/20">
              <Globe2 className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-xs text-gold-400 font-mono font-medium">
                <span>Universal Stock Exchange Tracker</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Global Market Timing & Portfolio Intelligence.
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Designed for new, part-time, and casual traders across <strong className="text-white">Taiwan, Korea, US, UK, NZ, Australia, and Japan</strong> to stay informed, track personal portfolios, and learn optimal market timing.
              </p>
            </div>

            {/* Informational Callout */}
            <div className="p-3.5 bg-gold-950/25 border border-gold-500/40 rounded-2xl flex items-start gap-3 text-left">
              <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Purely Informational & Tracking</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  This app does not execute trades or hold money. Use our technical indicators for guidance, then trade on your own broker.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-growth-600 hover:bg-growth-500 text-white font-bold rounded-2xl transition shadow-lg shadow-growth-600/30 flex items-center justify-center gap-2 text-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Experience & Profile */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-growth-400 uppercase tracking-wider">Your Trading Style</span>
              <h2 className="text-xl font-bold text-white mt-1">What best describes your journey?</h2>
              <p className="text-xs text-slate-400 mt-1">
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
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-navy-850 border-growth-500 ring-1 ring-growth-500/40 shadow-glow-navy'
                        : 'bg-navy-900/80 border-navy-800 hover:border-navy-750'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-growth-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-growth-600 hover:bg-growth-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-growth-600/30 flex items-center justify-center gap-1.5"
              >
                <span>Select Global Markets</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Global Stock Markets Questionnaire */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-growth-400 uppercase tracking-wider">Universal Exchanges</span>
              <h2 className="text-xl font-bold text-white mt-1">Which markets interest you?</h2>
              <p className="text-xs text-slate-400 mt-1">
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
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-navy-850 border-growth-500 shadow-sm'
                        : 'bg-navy-900/70 border-navy-800 hover:border-navy-750'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sec.flag}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{sec.label}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {sec.tickers.join(' • ')}
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                      isSelected ? 'bg-growth-500 border-growth-500 text-white' : 'border-navy-700 bg-navy-950'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-growth-600 hover:bg-growth-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-growth-600/30 flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Compliance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Compliance & Risk Gate with Zero Seeding */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Mandatory Compliance Disclosure</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Regulatory & Risk Notice</h2>
              <p className="text-xs text-slate-400">
                Please acknowledge that InvestLearn is strictly an informational tool.
              </p>
            </div>

            {/* Compliance Warning Container */}
            <div className="bg-navy-900/90 border border-navy-750 rounded-2xl p-4 space-y-3 max-h-[290px] overflow-y-auto text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-navy-950/80 rounded-xl border border-gold-500/30 text-slate-100 font-medium">
                {COMPLIANCE_NOTICES.PRIMARY_DISCLAIMER}
              </div>

              {/* Explicit No In-App Trading Warning */}
              <div className="p-3 bg-gold-950/30 rounded-xl border border-gold-500/50 space-y-1">
                <strong className="text-gold-400 flex items-center gap-1 uppercase font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  {COMPLIANCE_NOTICES.NO_IN_APP_TRADING.title}:
                </strong>
                <p className="text-[11px] text-slate-200 font-medium">
                  {COMPLIANCE_NOTICES.NO_IN_APP_TRADING.text}
                </p>
              </div>

              {/* Market Risk Warning */}
              <div className="p-3 bg-loss-950/20 rounded-xl border border-loss-600/30 space-y-1">
                <strong className="text-loss-400 flex items-center gap-1 uppercase font-mono">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {COMPLIANCE_NOTICES.MARKET_RISK_WARNING.title}:
                </strong>
                <p className="text-[11px] text-slate-300">{COMPLIANCE_NOTICES.MARKET_RISK_WARNING.text}</p>
              </div>

              {/* Data Delay Notice */}
              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 space-y-1">
                <strong className="text-slate-300 flex items-center gap-1 uppercase font-mono">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  {COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.title}:
                </strong>
                <p className="text-[11px] text-slate-300">{COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.text}</p>
              </div>

              {/* No Guaranteed Returns */}
              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 space-y-1">
                <strong className="text-slate-200 flex items-center gap-1 uppercase font-mono">
                  <Award className="w-3.5 h-3.5 text-gold-400" />
                  {COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.title}:
                </strong>
                <p className="text-[11px] text-slate-300">{COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.text}</p>
              </div>

              {/* Use At Your Own Risk */}
              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 space-y-1">
                <strong className="text-slate-200 flex items-center gap-1 uppercase font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-growth-400" />
                  {COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.title}:
                </strong>
                <p className="text-[11px] text-slate-300">{COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.text}</p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-3 p-3 bg-navy-950/80 rounded-xl border border-navy-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAge18}
                  onChange={(e) => setIsAge18(e.target.checked)}
                  className="mt-0.5 rounded text-growth-600 focus:ring-growth-500 bg-navy-900 border-navy-700 w-4 h-4"
                />
                <span className="text-xs text-slate-300">
                  I confirm that I am <strong>18 years of age or older</strong> and meet legal age requirements.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 bg-navy-950/80 rounded-xl border border-navy-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedAllCompliance}
                  onChange={(e) => setAcceptedAllCompliance(e.target.checked)}
                  className="mt-0.5 rounded text-growth-600 focus:ring-growth-500 bg-navy-900 border-navy-700 w-4 h-4"
                />
                <span className="text-xs text-slate-300">
                  I agree to all <strong>Disclaimers, Risk Notices, and No In-App Trading rules</strong>.
                </span>
              </label>
            </div>

            {/* Exactly two options: Start Empty OR Add Current Portfolio (Zero fake seeding!) */}
            <div className="space-y-2 pt-2">
              <button
                disabled={!isAge18 || !acceptedAllCompliance}
                onClick={handleStartEmpty}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                  isAge18 && acceptedAllCompliance
                    ? 'bg-growth-600 hover:bg-growth-500 text-white shadow-growth-600/30 active:scale-98'
                    : 'bg-navy-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Start with Empty Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                disabled={!isAge18 || !acceptedAllCompliance}
                onClick={handleAddCurrentPortfolio}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border ${
                  isAge18 && acceptedAllCompliance
                    ? 'bg-navy-800 hover:bg-navy-750 text-white border-navy-700'
                    : 'bg-navy-900 text-slate-600 border-navy-850 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4 text-growth-400" />
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
    </div>
  );
};
