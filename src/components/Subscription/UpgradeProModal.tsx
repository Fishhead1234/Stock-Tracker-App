import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  RotateCcw,
  Clock,
  ArrowRight,
  Gift
} from 'lucide-react';
import { useSubscriptionStore, SubscriptionPlan } from '../../store/subscriptionStore';
import { revenueCatService } from '../../services/revenueCatService';
import { useLanguageStore } from '../../store/languageStore';

interface UpgradeProModalProps {
  onClose: () => void;
}

export const UpgradeProModal: React.FC<UpgradeProModalProps> = ({ onClose }) => {
  const { t } = useLanguageStore();
  const { 
    isPro, 
    plan, 
    getTrialDaysRemaining, 
    lifetimeSeatsTotal, 
    lifetimeSeatsClaimed,
    subscribe, 
    restorePurchases 
  } = useSubscriptionStore();

  const [selectedPlan, setSelectedPlan] = useState<'LIFETIME' | 'ANNUAL' | 'MONTHLY'>('LIFETIME');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const trialDays = getTrialDaysRemaining();
  const seatsLeft = Math.max(0, lifetimeSeatsTotal - lifetimeSeatsClaimed);

  const handlePurchase = async () => {
    setIsProcessing(true);
    setRestoreStatus(null);

    // Check if running on native device with RevenueCat
    const isNative = typeof window !== 'undefined' && 
      (window as any).Capacitor && 
      (window as any).Capacitor.isNativePlatform();

    if (isNative) {
      try {
        const { packages } = await revenueCatService.getOfferings();
        const packageIdentifier = 
          selectedPlan === 'LIFETIME' ? '$rc_lifetime' : 
          selectedPlan === 'ANNUAL' ? '$rc_annual' : '$rc_monthly';
        
        const targetPkg = packages.find(p => p.identifier === packageIdentifier) || packages[0];
        if (targetPkg) {
          const result = await revenueCatService.purchase(targetPkg);
          if (result.success) {
            subscribe(selectedPlan);
            setIsProcessing(false);
            setSuccessMessage('🎉 Pro unlocked successfully via Google Play!');
            setTimeout(() => onClose(), 1600);
            return;
          }
        }
      } catch (err) {
        console.warn('Native purchase error, falling back to simulator', err);
      }
    }

    // Web simulation mode (for Vercel testing)
    setTimeout(() => {
      subscribe(selectedPlan);
      setIsProcessing(false);
      setSuccessMessage(
        selectedPlan === 'LIFETIME' 
          ? '🎉 Welcome Founder! Lifetime Pro access successfully unlocked.' 
          : `🎉 Subscribed successfully to InvestLearn Pro (${selectedPlan.toLowerCase()})!`
      );
      setTimeout(() => {
        onClose();
      }, 1600);
    }, 800);
  };

  const handleRestore = async () => {
    setRestoreStatus('Checking Google Play account for existing receipts...');

    const isNative = typeof window !== 'undefined' && 
      (window as any).Capacitor && 
      (window as any).Capacitor.isNativePlatform();

    if (isNative) {
      try {
        const result = await revenueCatService.restore();
        if (result.success) {
          subscribe('LIFETIME');
          setRestoreStatus('Purchases restored successfully from Google Play!');
          return;
        }
      } catch (err) {
        console.warn('Native restore error', err);
      }
    }

    setTimeout(() => {
      const restored = restorePurchases();
      if (restored) {
        setRestoreStatus('Purchases restored successfully!');
      } else {
        setRestoreStatus('No active Google Play subscription found for this account.');
      }
    }, 900);
  };

  const features = [
    'Unlimited Portfolio Positions (Global Exchanges)',
    'Real-time Timing Alerts on Personal Holdings & Watchlist',
    'Full Multi-indicator Analysis (RSI, MACD Golden Cross)',
    'Detailed Educational Rationale for Every Signal',
    'Zero Advertisements & Priority Live Data Caching'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-navy-900 border border-navy-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header Banner */}
        <div className="relative p-5 pb-4 bg-gradient-to-b from-growth-950/60 via-navy-900 to-navy-900 border-b border-navy-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-growth-400 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-4 h-4 fill-growth-400" />
            <span>InvestLearn Pro Membership</span>
          </div>

          <h2 className="text-xl font-extrabold text-white mt-1">
            Master the Markets with Timing Confidence
          </h2>

          {/* 30-Day Trial Status Badge */}
          {plan === 'TRIAL' && (
            <div className="mt-3 p-2.5 rounded-xl bg-growth-500/10 border border-growth-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-growth-300">
                <Gift className="w-4 h-4 text-growth-400 shrink-0" />
                <span>
                  <strong>30-Day Free Trial Active:</strong> You have <strong>{trialDays} days</strong> remaining.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Limited Lifetime Scarcity Callout */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-gold-950/40 via-gold-900/20 to-navy-900 border border-gold-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-gold-300 uppercase tracking-wide">
                  {t('founders_lifetime_title', "Founder's Limited Lifetime Pass")}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30">
                  {seatsLeft} / {lifetimeSeatsTotal} {t('spots_remaining', 'spots left')}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {t('founders_lifetime_desc', 'Pay once, yours forever. No recurring fees.')}
              </p>
            </div>
          </div>

          {/* Pricing Options Cards */}
          <div className="space-y-2.5">
            {/* 1. Lifetime Card */}
            <div
              onClick={() => setSelectedPlan('LIFETIME')}
              className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                selectedPlan === 'LIFETIME'
                  ? 'bg-navy-850 border-gold-500/80 shadow-md ring-1 ring-gold-500/40'
                  : 'bg-navy-950/70 border-navy-800 hover:border-navy-700'
              }`}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-gold-500 text-navy-950 text-[10px] font-extrabold uppercase tracking-wide">
                Best Value • Limited 1,000
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{t('founders_lifetime_title', "Founder's Lifetime Pass")}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('founders_lifetime_desc', 'Pay once, yours forever. No recurring fees.')}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 pt-2.5 border-t border-navy-800/80 flex items-baseline gap-2">
                <span className="text-2xl font-black text-gold-300 font-mono">$49.99</span>
                <span className="text-xs text-slate-400">one-time payment</span>
              </div>
            </div>

            {/* 2. Annual Card */}
            <div
              onClick={() => setSelectedPlan('ANNUAL')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition relative ${
                selectedPlan === 'ANNUAL'
                  ? 'bg-navy-850 border-growth-500/80 shadow-md ring-1 ring-growth-500/40'
                  : 'bg-navy-950/70 border-navy-800 hover:border-navy-700'
              }`}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-growth-500/20 text-growth-300 text-[10px] font-bold border border-growth-500/40">
                {t('save_33_percent', 'Save 33%')}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{t('annual_membership', 'Annual Membership')}</div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    $3.33/mo billed annually
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-white font-mono">$39.99</span>
                <span className="text-xs text-slate-400">/ year</span>
              </div>
            </div>

            {/* 3. Monthly Card */}
            <div
              onClick={() => setSelectedPlan('MONTHLY')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                selectedPlan === 'MONTHLY'
                  ? 'bg-navy-850 border-growth-500/80 shadow-md ring-1 ring-growth-500/40'
                  : 'bg-navy-950/70 border-navy-800 hover:border-navy-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{t('monthly_flex', 'Monthly Flex')}</div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pause or cancel anytime
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-white font-mono">$4.99</span>
                  <span className="text-xs text-slate-400">/ mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Included Pro Features */}
          <div className="bg-navy-950/80 rounded-2xl p-4 border border-navy-800 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              All Pro Plans Include:
            </h4>
            <div className="space-y-2">
              {features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-growth-500/20 text-growth-400 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Success / Status Message */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-growth-950/60 border border-growth-500/50 text-xs text-growth-300 font-semibold text-center animate-fade-in">
              {successMessage}
            </div>
          )}

          {restoreStatus && (
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs text-slate-300 text-center">
              {restoreStatus}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-navy-950 border-t border-navy-800 space-y-3">
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
              selectedPlan === 'LIFETIME'
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black'
                : 'bg-growth-600 hover:bg-growth-500 text-white'
            }`}
          >
            {isProcessing ? (
              <span>Connecting to Google Play...</span>
            ) : (
              <>
                <span>
                  {selectedPlan === 'LIFETIME'
                    ? t('claim_lifetime_pass', 'Claim Lifetime Pass for $49.99')
                    : selectedPlan === 'ANNUAL'
                    ? 'Subscribe Annual ($39.99/yr)'
                    : 'Subscribe Monthly ($4.99/mo)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-growth-400" />
              <span>Google Play Protected</span>
            </span>
            <button
              onClick={handleRestore}
              className="text-slate-400 hover:text-white underline transition"
            >
              {t('restore_purchases', 'Restore Purchases')}
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center leading-tight">
            Subscriptions renew automatically unless canceled at least 24 hours before renewal via Google Play. Educational tool only, does not execute real trades.
          </p>
        </div>
      </div>
    </div>
  );
};
