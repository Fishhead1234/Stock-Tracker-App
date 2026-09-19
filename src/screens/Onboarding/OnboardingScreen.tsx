import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  Award, 
  Check, 
  Compass,
  Zap,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPLIANCE_NOTICES } from '../../constants/compliance';
import { useSettingsStore } from '../../store/settingsStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useMarketStore } from '../../store/marketStore';

const SECTORS = [
  { id: 'tech', label: 'Tech & Artificial Intelligence', tickers: ['AAPL', 'NVDA', 'MSFT', 'PLTR'], icon: '💻' },
  { id: 'index', label: 'Broad Market Index ETFs', tickers: ['SPY', 'QQQ', 'VOO'], icon: '📈' },
  { id: 'ev', label: 'Clean Energy & Electric Vehicles', tickers: ['TSLA', 'NEE'], icon: '⚡' },
  { id: 'health', label: 'Healthcare & Biotech', tickers: ['LLY', 'JNJ'], icon: '🩺' },
  { id: 'consumer', label: 'Consumer Brands & Entertainment', tickers: ['AMZN', 'DIS', 'NFLX', 'NKE'], icon: '🛍️' },
  { id: 'finance', label: 'Banking & Financials', tickers: ['JPM', 'V', 'BRK.B'], icon: '🏦' }
];

export const OnboardingScreen: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const {
    ageConfirmed,
    riskAcknowledged,
    experienceLevel,
    interestedSectors,
    setAgeConfirmed,
    setRiskAcknowledged,
    setExperienceLevel,
    setInterestedSectors,
    completeOnboarding
  } = useSettingsStore();

  const { loadStarterPracticePortfolio } = usePortfolioStore();
  const { toggleWatchlist } = useMarketStore();

  const [acceptedAllCompliance, setAcceptedAllCompliance] = useState(false);
  const [isAge18, setIsAge18] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleToggleSector = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleFinish = (loadStarterPractice: boolean) => {
    if (!isAge18 || !acceptedAllCompliance) return;

    setAgeConfirmed(true);
    setRiskAcknowledged(true);
    setInterestedSectors(selectedInterests);

    // If user selected sectors, ensure their favorite tickers are in watchlist
    const chosenTickers = SECTORS
      .filter(s => selectedInterests.includes(s.id))
      .flatMap(s => s.tickers);
    
    chosenTickers.forEach(t => toggleWatchlist(t));

    if (loadStarterPractice) {
      loadStarterPracticePortfolio();
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    completeOnboarding();
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-5 bg-gradient-to-b from-[#070D1E] via-navy-950 to-[#040814] text-white">
      {/* Top Step Progress Indicator */}
      <div className="w-full pt-2 pb-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>Step {step} of 4</span>
          <span>
            {step === 1 && 'Welcome'}
            {step === 2 && 'Experience'}
            {step === 3 && 'Your Interests'}
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
        {/* STEP 1: Welcome & Mission */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-navy-600 via-growth-500 to-gold-500 flex items-center justify-center mx-auto sm:mx-0 shadow-lg shadow-growth-500/20">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Learn to Invest with Intelligent Timing.
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Most beginners lose money by buying at the peak out of FOMO. InvestLearn gives you technical timing indicators translated into plain English, so you understand <strong className="text-white">when</strong> and <strong className="text-white">why</strong> to make each move.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-left">
              <div className="p-3.5 bg-navy-900/80 rounded-2xl border border-navy-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-growth-500/20 text-growth-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Actionable Timing Signals</h4>
                  <p className="text-xs text-slate-400">RSI, MACD, and Moving Averages simplified into plain guidance.</p>
                </div>
              </div>

              <div className="p-3.5 bg-navy-900/80 rounded-2xl border border-navy-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Zero Jargon Guarantee</h4>
                  <p className="text-xs text-slate-400">Every technical indicator includes real-world analogies you can grasp instantly.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-growth-600 hover:bg-growth-500 text-white font-bold rounded-2xl transition shadow-lg shadow-growth-600/30 flex items-center justify-center gap-2 text-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Experience Assessment */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-growth-400 uppercase tracking-wider">Investor Level</span>
              <h2 className="text-xl font-bold text-white mt-1">Have you traded stocks before?</h2>
              <p className="text-xs text-slate-400 mt-1">
                We'll personalize the educational tips to match your current experience.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'never_traded',
                  title: 'Never traded before (Complete Beginner)',
                  desc: 'I want to learn the fundamentals, avoid mistakes, and understand what stocks are.',
                  badge: 'Recommended for you'
                },
                {
                  id: 'beginner',
                  title: 'A little bit of experience',
                  desc: 'I have bought a few shares but often feel unsure about timing when to buy or sell.',
                  badge: 'Learn timing'
                },
                {
                  id: 'intermediate',
                  title: 'Intermediate / Active trader',
                  desc: 'I know basic terms and want fast technical timing indicators and signal validation.',
                  badge: 'Signal focused'
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
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Industry & Stock Interests */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-growth-400 uppercase tracking-wider">Curated Feed</span>
              <h2 className="text-xl font-bold text-white mt-1">Which industries interest you?</h2>
              <p className="text-xs text-slate-400 mt-1">
                We'll watch these sectors and guide you with tailored timing alerts.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {SECTORS.map(sec => {
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
                      <span className="text-xl">{sec.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{sec.label}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Examples: {sec.tickers.join(', ')}
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

        {/* STEP 4: Exact Compliance List & Risk Disclosure Gate */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Mandatory Compliance Disclosure</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Regulatory & Risk Notice</h2>
              <p className="text-xs text-slate-400">
                Please acknowledge that InvestLearn is an educational learning tool.
              </p>
            </div>

            {/* Compliance Warning Container */}
            <div className="bg-navy-900/90 border border-navy-750 rounded-2xl p-4 space-y-3 max-h-[300px] overflow-y-auto text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-navy-950/80 rounded-xl border border-gold-500/30 text-slate-100 font-medium">
                {COMPLIANCE_NOTICES.PRIMARY_DISCLAIMER}
              </div>

              <div className="p-3 bg-loss-950/20 rounded-xl border border-loss-600/30 space-y-1">
                <strong className="text-loss-400 flex items-center gap-1 uppercase font-mono">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {COMPLIANCE_NOTICES.MARKET_RISK_WARNING.title}:
                </strong>
                <p className="text-[11px] text-slate-300">{COMPLIANCE_NOTICES.MARKET_RISK_WARNING.text}</p>
              </div>

              <div className="p-3 bg-gold-950/20 rounded-xl border border-gold-600/30 space-y-1">
                <strong className="text-gold-400 flex items-center gap-1 uppercase font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.title}:
                </strong>
                <p className="text-[11px] text-slate-300">{COMPLIANCE_NOTICES.DATA_DELAY_NOTICE.text}</p>
              </div>

              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 space-y-1">
                <strong className="text-slate-200 flex items-center gap-1 uppercase font-mono">
                  <Award className="w-3.5 h-3.5 text-gold-400" />
                  {COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.title}:
                </strong>
                <p className="text-[11px] text-slate-300">{COMPLIANCE_NOTICES.NO_GUARANTEED_RETURNS.text}</p>
              </div>

              <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 space-y-1">
                <strong className="text-slate-200 flex items-center gap-1 uppercase font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-growth-400" />
                  {COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.title}:
                </strong>
                <p className="text-[11px] text-slate-300">{COMPLIANCE_NOTICES.USE_AT_YOUR_OWN_RISK.text}</p>
              </div>
            </div>

            {/* Mandatory Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-3 p-3 bg-navy-950/80 rounded-xl border border-navy-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAge18}
                  onChange={(e) => setIsAge18(e.target.checked)}
                  className="mt-0.5 rounded text-growth-600 focus:ring-growth-500 bg-navy-900 border-navy-700 w-4 h-4"
                />
                <span className="text-xs text-slate-300">
                  I confirm that I am <strong>18 years of age or older</strong> and meet the legal age requirement to trade securities.
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
                  I have read and agree to all <strong>Market Risk Warnings, Data Delay Notices, and Disclaimers</strong> above.
                </span>
              </label>
            </div>

            {/* Two Entry Options: Empty Portfolio (as requested) vs Optional Practice Starter */}
            <div className="space-y-2 pt-2">
              <button
                disabled={!isAge18 || !acceptedAllCompliance}
                onClick={() => handleFinish(false)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                  isAge18 && acceptedAllCompliance
                    ? 'bg-growth-600 hover:bg-growth-500 text-white shadow-growth-600/30 active:scale-98'
                    : 'bg-navy-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Enter with Fresh Empty Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                disabled={!isAge18 || !acceptedAllCompliance}
                onClick={() => handleFinish(true)}
                className={`w-full py-2.5 rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 transition ${
                  isAge18 && acceptedAllCompliance
                    ? 'bg-navy-800 hover:bg-navy-750 text-gold-300 border border-gold-500/30'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Or Seed Sample $10,000 Beginner Practice Portfolio</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
