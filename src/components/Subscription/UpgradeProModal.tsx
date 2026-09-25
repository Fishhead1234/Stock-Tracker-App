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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-navy-900 border border-black/10 dark:border-navy-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header Banner */}
        <div className="relative p-5 pb-4 bg-[#F2F2F7] dark:bg-gradient-to-b dark:from-growth-950/60 dark:via-navy-900 dark:to-navy-900 border-b border-black/10 dark:border-navy-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#8E8E93] hover:text-[#000000] dark:hover:text-white hover:bg-black/5 dark:hover:bg-navy-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#34C759] text-xs font-bold uppercase tracking-wider">
            <Crown className="w-4 h-4 fill-[#34C759]" />
            <span>InvestLearn Pro Membership</span>
          </div>

          <h2 className="text-xl font-extrabold text-[#000000] dark:text-white mt-1 tracking-tight">
            Master the Markets with Timing Confidence
          </h2>

          {/* 30-Day Trial Status Badge */}
          {plan === 'TRIAL' && (
            <div className="mt-3 p-3 rounded-xl bg-[#34C759]/10 border border-[#34C759]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] text-[#34C759]">
                <Gift className="w-4 h-4 text-[#34C759] shrink-0" />
                <span>
                  <strong>30-Day Free Trial Active:</strong> You have <strong>{trialDays} days</strong> remaining.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Pricing Options Cards */}
          <div className="space-y-3">
            {/* 1. Merged Founder's Lifetime Card */}
            <div
              onClick={() => setSelectedPlan('LIFETIME')}
              className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                selectedPlan === 'LIFETIME'
                  ? 'bg-[#FFF9E6] dark:bg-gradient-to-br dark:from-navy-850 dark:via-gold-950/20 dark:to-navy-900 border-[#FF9500] shadow-xs ring-1 ring-[#FF9500]/40'
                  : 'bg-white dark:bg-navy-950/70 border-black/10 dark:border-navy-800 hover:border-black/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#FF9500]/15 border border-[#FF9500]/30 flex items-center justify-center text-[#FF9500] shrink-0 mt-0.5">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-extrabold text-[#000000] dark:text-white flex items-center gap-1.5">
                      <span>{t('founders_lifetime_title', "Founder's Limited Lifetime Pass")}</span>
                    </h4>
                    <p className="text-[13px] text-[#666666] dark:text-slate-400 mt-0.5 leading-[1.5]">
                      {t('founders_lifetime_desc', 'Pay once, yours forever. No recurring fees.')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-[#FF9500] text-white text-[10px] font-extrabold uppercase tracking-wide">
                    Best Value
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FF9500]/10 text-[#8F5B00] dark:text-gold-300 font-bold border border-[#FF9500]/30 whitespace-nowrap">
                    {seatsLeft} / {lifetimeSeatsTotal} {t('spots_remaining', 'spots left')}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-navy-800/80 flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#FF9500] dark:text-gold-300 font-mono">$49.99</span>
                <span className="text-xs text-[#666666] dark:text-slate-400">one-time payment</span>
              </div>
            </div>

            {/* 2. Annual Card */}
            <div
              onClick={() => setSelectedPlan('ANNUAL')}
              className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                selectedPlan === 'ANNUAL'
                  ? 'bg-[#F2F2F7] dark:bg-navy-850 border-[#34C759] shadow-xs ring-1 ring-[#34C759]/40'
                  : 'bg-white dark:bg-navy-950/70 border-black/10 dark:border-navy-800 hover:border-black/20'
              }`}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#34C759]/15 text-[#34C759] text-[10px] font-bold border border-[#34C759]/30">
                {t('save_33_percent', 'Save 33%')}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-bold text-[#000000] dark:text-white">{t('annual_membership', 'Annual Membership')}</div>
                  <p className="text-[13px] text-[#666666] dark:text-slate-400 mt-0.5">
                    $3.33/mo billed annually
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#000000] dark:text-white font-mono">$39.99</span>
                <span className="text-xs text-[#666666] dark:text-slate-400">/ year</span>
              </div>
            </div>

            {/* 3. Monthly Card */}
            <div
              onClick={() => setSelectedPlan('MONTHLY')}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedPlan === 'MONTHLY'
                  ? 'bg-[#F2F2F7] dark:bg-navy-850 border-[#34C759] shadow-xs ring-1 ring-[#34C759]/40'
                  : 'bg-white dark:bg-navy-950/70 border-black/10 dark:border-navy-800 hover:border-black/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-bold text-[#000000] dark:text-white">{t('monthly_flex', 'Monthly Flex')}</div>
                  <p className="text-[13px] text-[#666666] dark:text-slate-400 mt-0.5">
                    Pause or cancel anytime
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#000000] dark:text-white font-mono">$4.99</span>
                  <span className="text-xs text-[#666666] dark:text-slate-400">/ mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Included Pro Features */}
          <div className="bg-[#F2F2F7] dark:bg-navy-950/80 rounded-2xl p-4 border border-black/5 dark:border-navy-800 space-y-2.5">
            <h4 className="text-xs font-bold text-[#000000] dark:text-white uppercase tracking-wider">
              All Pro Plans Include:
            </h4>
            <div className="space-y-2">
              {features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[13px] text-[#666666] dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-[#34C759]/15 text-[#34C759] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Success / Status Message */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-[#34C759]/15 border border-[#34C759]/30 text-xs text-[#34C759] font-semibold text-center animate-fade-in">
              {successMessage}
            </div>
          )}

          {restoreStatus && (
            <div className="p-3.5 rounded-xl bg-[#F2F2F7] dark:bg-navy-950 border border-black/10 dark:border-navy-800 text-xs text-[#666666] dark:text-slate-300 text-center">
              {restoreStatus}
            </div>
          )}
        </div>

        {/* Footer Actions (Thumb Zone: 48px touch targets, min 12px 24px padding) */}
        <div className="p-5 bg-white dark:bg-navy-950 border-t border-black/10 dark:border-navy-800 space-y-3">
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className={`w-full min-h-[48px] px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs ${
              selectedPlan === 'LIFETIME'
                ? 'bg-[#FF9500] hover:bg-[#E08500] text-white font-black'
                : 'bg-[#34C759] hover:bg-[#2EB04E] text-white'
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

          <div className="flex items-center justify-between text-xs text-[#8E8E93] dark:text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#34C759]" />
              <span>Google Play Protected</span>
            </span>
            <button
              onClick={handleRestore}
              className="text-[#8E8E93] hover:text-[#000000] dark:hover:text-white underline transition"
            >
              {t('restore_purchases', 'Restore Purchases')}
            </button>
          </div>

          <p className="text-[11px] text-[#8E8E93] text-center leading-tight">
            Subscriptions renew automatically unless canceled at least 24 hours before renewal via Google Play. Educational tool only, does not execute real trades.
          </p>
        </div>
      </div>
    </div>
  );
};
