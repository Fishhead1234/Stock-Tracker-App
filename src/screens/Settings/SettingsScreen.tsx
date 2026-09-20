import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { notificationService } from '../../services/notificationService';
import { stockService } from '../../services/stockService';
import { ComplianceModal } from '../../components/Common/ComplianceModal';
import { UpgradeProModal } from '../../components/Subscription/UpgradeProModal';
import { COMPLIANCE_NOTICES } from '../../constants/compliance';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';

export const SettingsScreen: React.FC = () => {
  const { 
    finnhubApiKey, 
    setFinnhubApiKey, 
    resetOnboarding,
    isPhoneFrameView,
    setPhoneFrameView,
    currency,
    setCurrency
  } = useSettingsStore();

  const { clearPortfolio } = usePortfolioStore();

  const {
    notificationsEnabled,
    notifyPersonalHoldings,
    notifyWatchlist,
    soundEnabled,
    sensitivity,
    toggleNotificationsEnabled,
    toggleNotifyPersonalHoldings,
    toggleNotifyWatchlist,
    toggleSound,
    setSensitivity
  } = useNotificationStore();

  const { 
    isPro, 
    plan, 
    getTrialDaysRemaining, 
    lifetimeSeatsTotal, 
    lifetimeSeatsClaimed 
  } = useSubscriptionStore();

  const [inputKey, setInputKey] = useState(finnhubApiKey);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [testNotificationResult, setTestNotificationResult] = useState<string | null>(null);

  const trialDays = getTrialDaysRemaining();
  const seatsRemaining = Math.max(0, lifetimeSeatsTotal - lifetimeSeatsClaimed);

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

  const handleTriggerTestAlert = async (type: 'HOLDING' | 'WATCHLIST') => {
    setTestNotificationResult(null);
    const granted = await notificationService.sendTestNotification(type);
    if (granted) {
      setTestNotificationResult(
        type === 'HOLDING'
          ? '✓ Dispatched Personal Holding alert! Check your OS system notifications and in-app bell.'
          : '✓ Dispatched Watchlist alert! Check your OS system notifications and in-app bell.'
      );
    } else {
      setTestNotificationResult(
        '✓ In-app alert logged! (To see OS system banner popups, allow notifications in your browser/device permissions).'
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
    <div className="flex-1 flex flex-col pb-24 space-y-4">
      <DisclaimerBanner />

      <div className="px-4 space-y-4">
        {/* Header */}
        <div className="pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            System & Preferences
          </span>
          <h2 className="text-xl font-extrabold text-white">App Settings & Alerts</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure timing alert notifications, subscription status, and global market feeds.
          </p>
        </div>

        {/* 1. MEMBERSHIP & SUBSCRIPTION CARD (Google Play Billing / 30-Day Trial) */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/40 rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Crown className="w-4 h-4 fill-gold-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Membership Status
                </h3>
                <p className="text-[11px] text-slate-300 font-medium">
                  {plan === 'LIFETIME'
                    ? "Founder's Lifetime Pass (Active)"
                    : plan === 'ANNUAL'
                    ? 'Pro Annual Member'
                    : plan === 'MONTHLY'
                    ? 'Pro Monthly Member'
                    : `30-Day Free Trial (${trialDays} days remaining)`}
                </p>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full font-mono font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>{plan === 'LIFETIME' ? 'LIFETIME' : 'PRO ACTIVE'}</span>
            </span>
          </div>

          {plan === 'TRIAL' && (
            <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-gold-400" />
                  <span>Limited Lifetime Pass Available</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {seatsRemaining} of {lifetimeSeatsTotal} seats remaining for first 1,000 investors.
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 text-navy-950 font-black text-xs rounded-xl transition shadow"
              >
                Claim $49.99
              </button>
            </div>
          )}

          {plan !== 'TRIAL' && (
            <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
              <span>Google Play In-App Billing linked</span>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-gold-400 hover:underline text-[11px]"
              >
                View Plans
              </button>
            </div>
          )}
        </div>

        {/* 2. NOTIFICATION & TIMING ALERT PREFERENCES */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-growth-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Timing Alert Notifications
              </h3>
            </div>
            <button
              onClick={toggleNotificationsEnabled}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                notificationsEnabled
                  ? 'bg-growth-500/20 text-growth-300 border border-growth-500/40'
                  : 'bg-navy-950 text-slate-400 border border-navy-800'
              }`}
            >
              <span>{notificationsEnabled ? 'Active' : 'Disabled'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Choose exactly when and what type of timing signals you want to be alerted about:
          </p>

          <div className="space-y-2.5 pt-1">
            {/* Toggle 1: Personal Holdings */}
            <div 
              onClick={toggleNotifyPersonalHoldings}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                notifyPersonalHoldings && notificationsEnabled
                  ? 'bg-navy-950 border-growth-500/40'
                  : 'bg-navy-950/50 border-navy-850 opacity-70'
              }`}
            >
              <div className="space-y-0.5 max-w-[240px]">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Personal Holdings Alerts</span>
                  {notifyPersonalHoldings && (
                    <span className="w-1.5 h-1.5 rounded-full bg-growth-400 animate-ping" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Notify when stocks you own enter Buy Window, Strong Buy, Trim Profit, or High Risk/Sell.
                </p>
              </div>
              <div className={`w-10 h-6 rounded-full transition flex items-center px-1 ${
                notifyPersonalHoldings && notificationsEnabled ? 'bg-growth-600 justify-end' : 'bg-navy-800 justify-start'
              }`}>
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            {/* Toggle 2: Stocks to Watch */}
            <div 
              onClick={toggleNotifyWatchlist}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                notifyWatchlist && notificationsEnabled
                  ? 'bg-navy-950 border-growth-500/40'
                  : 'bg-navy-950/50 border-navy-850 opacity-70'
              }`}
            >
              <div className="space-y-0.5 max-w-[240px]">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>"Stocks to Watch" Alerts</span>
                  {notifyWatchlist && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Notify when any monitored watchlist stock triggers Strong Buy or High Risk/Sell.
                </p>
              </div>
              <div className={`w-10 h-6 rounded-full transition flex items-center px-1 ${
                notifyWatchlist && notificationsEnabled ? 'bg-growth-600 justify-end' : 'bg-navy-800 justify-start'
              }`}>
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            {/* Sensitivity Selection */}
            <div className="pt-1 space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">
                Signal Alert Filter Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSensitivity('ALL_TIMING_SIGNALS')}
                  className={`p-2 rounded-xl border text-xs font-semibold transition ${
                    sensitivity === 'ALL_TIMING_SIGNALS'
                      ? 'bg-growth-600/20 border-growth-500 text-white font-bold'
                      : 'bg-navy-950/70 border-navy-800 text-slate-400'
                  }`}
                >
                  All Timing Changes
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                    Buy, Trim, Sell, Wait
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSensitivity('HIGH_CONVICTION_ONLY')}
                  className={`p-2 rounded-xl border text-xs font-semibold transition ${
                    sensitivity === 'HIGH_CONVICTION_ONLY'
                      ? 'bg-growth-600/20 border-growth-500 text-white font-bold'
                      : 'bg-navy-950/70 border-navy-800 text-slate-400'
                  }`}
                >
                  High Urgency Only
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                    Strong Buy & High Risk
                  </span>
                </button>
              </div>
            </div>

            {/* Test Notification Triggers */}
            <div className="pt-2 border-t border-navy-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Test Live Notification Alerts:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => handleTriggerTestAlert('HOLDING')}
                  className="flex-1 py-2 px-3 bg-navy-800 hover:bg-navy-750 text-white text-xs font-semibold rounded-xl border border-navy-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5 text-growth-400" />
                  <span>Test Holding Alert (AAPL)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerTestAlert('WATCHLIST')}
                  className="flex-1 py-2 px-3 bg-navy-800 hover:bg-navy-750 text-white text-xs font-semibold rounded-xl border border-navy-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5 text-gold-400" />
                  <span>Test Watchlist Alert (NVDA)</span>
                </button>
              </div>

              {testNotificationResult && (
                <div className="p-2.5 rounded-xl bg-growth-950/50 border border-growth-600/40 text-xs text-growth-300 animate-fade-in flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-growth-400 shrink-0 mt-0.5" />
                  <span>{testNotificationResult}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. STRICT INFORMATIONAL DISCLOSURE */}
        <div className="bg-gold-950/20 border border-gold-500/40 rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-gold-400 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Strict Informational Disclosure</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {COMPLIANCE_NOTICES.NO_IN_APP_TRADING.text}
          </p>
        </div>

        {/* 4. Legal Compliance & Risk Disclosures Card */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gold-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Legal & Regulatory Disclosures
              </h3>
            </div>
            <span className="text-[10px] bg-growth-500/20 text-growth-400 px-2 py-0.5 rounded-full font-bold">
              18+ Verified
            </span>
          </div>

          <div className="p-3 bg-navy-950/80 rounded-xl border border-gold-500/30 text-xs text-slate-300 leading-relaxed space-y-2">
            <p className="font-medium text-slate-200">{COMPLIANCE_NOTICES.PRIMARY_DISCLAIMER}</p>
            <p className="text-[11px] text-slate-400 italic">{COMPLIANCE_NOTICES.MARKET_RISK_WARNING.text}</p>
          </div>

          <button
            onClick={() => setShowComplianceModal(true)}
            className="w-full py-2.5 bg-navy-800 hover:bg-navy-750 text-white rounded-xl text-xs font-semibold border border-navy-700 transition"
          >
            Review All Compliance & Risk Disclosures
          </button>
        </div>

        {/* 5. Preferred Base Currency */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-growth-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Preferred Currency
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {currencyOptions.map(opt => (
              <button
                key={opt.code}
                onClick={() => setCurrency(opt.code as any)}
                className={`p-2.5 rounded-xl border text-xs font-mono text-left transition ${
                  currency === opt.code
                    ? 'bg-growth-600/20 border-growth-500 text-white font-bold'
                    : 'bg-navy-950/60 border-navy-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-slate-200">{opt.code} ({opt.symbol})</div>
                <div className="text-[10px] text-slate-500 font-sans truncate">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Market Data Feed & API Setup */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-growth-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Market Data Engine
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            InvestLearn tracks global equities across <strong>Taiwan (TWSE), Korea (KRX), US (NYSE/NASDAQ), UK (LSE), NZ (NZX), and Australia (ASX)</strong>.
          </p>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 block">
              Finnhub API Key (Optional Pro Feed)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Paste free Finnhub token here..."
                className="flex-1 bg-navy-950 border border-navy-750 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-growth-500"
              />
              <button
                onClick={handleSaveKey}
                disabled={isTesting}
                className="px-4 py-2 bg-growth-600 hover:bg-growth-500 text-white text-xs font-bold rounded-xl transition"
              >
                {isTesting ? 'Testing...' : 'Save & Test'}
              </button>
            </div>
            {testResult && (
              <p className="text-xs text-gold-300/90 bg-navy-950/80 p-2.5 rounded-lg border border-navy-800">
                {testResult}
              </p>
            )}
          </div>
        </div>

        {/* 7. Display & Viewport Mode */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Preview Frame
              </h3>
            </div>
            <button
              onClick={() => setPhoneFrameView(!isPhoneFrameView)}
              className="text-xs bg-navy-800 hover:bg-navy-750 text-white font-semibold px-3 py-1.5 rounded-lg border border-navy-700 transition"
            >
              {isPhoneFrameView ? 'Switch to Full Screen' : 'Switch to Phone Frame'}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Easily toggle between testing on an iPhone chassis or using full desktop width.
          </p>
        </div>

        {/* 8. Portfolio Data Management */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 space-y-2.5 shadow-sm">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
            Data Management
          </h3>

          <div className="space-y-2">
            <button
              onClick={clearPortfolio}
              className="w-full py-2.5 bg-navy-800 hover:bg-navy-750 text-loss-400 rounded-xl text-xs font-semibold border border-navy-700 flex items-center justify-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Tracked Portfolio Positions</span>
            </button>

            <button
              onClick={resetOnboarding}
              className="w-full py-2.5 bg-navy-800 hover:bg-navy-750 text-slate-300 rounded-xl text-xs font-semibold border border-navy-700 flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Re-Take Onboarding</span>
            </button>
          </div>
        </div>

        {/* App Version & Packaging Info */}
        <div className="text-center pt-2 text-[11px] text-slate-500 space-y-1">
          <p>InvestLearn v1.2.0 • Android APK & Universal Stock Tracker</p>
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
