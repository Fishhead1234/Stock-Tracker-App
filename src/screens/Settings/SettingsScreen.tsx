import React, { useState } from 'react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Trash2, 
  Lock, 
  Smartphone, 
  Globe, 
  Radio, 
  Coins 
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { stockService } from '../../services/stockService';
import { ComplianceModal } from '../../components/Common/ComplianceModal';
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

  const [inputKey, setInputKey] = useState(finnhubApiKey);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);

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
            System & Governance
          </span>
          <h2 className="text-xl font-extrabold text-white">App Settings & Compliance</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure global feeds, currency preferences, and review legal notices.
          </p>
        </div>

        {/* 1. NO IN-APP TRADING WARNING CARD */}
        <div className="bg-gold-950/20 border border-gold-500/40 rounded-2xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-gold-400 font-bold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Strict Informational Disclosure</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {COMPLIANCE_NOTICES.NO_IN_APP_TRADING.text}
          </p>
        </div>

        {/* 2. Legal Compliance & Risk Disclosures Card */}
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

        {/* 3. Preferred Base Currency */}
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

        {/* 4. Market Data Feed & API Setup */}
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

        {/* 5. Display & Viewport Mode */}
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

        {/* 6. Portfolio Data Management (Zero Sample Seeding) */}
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
          <p>InvestLearn v1.1.0 • Universal Global Stock Exchange Tracker</p>
          <p>Taiwan • Korea • United States • UK • New Zealand • Australia • Japan</p>
        </div>
      </div>

      {showComplianceModal && (
        <ComplianceModal onClose={() => setShowComplianceModal(false)} />
      )}
    </div>
  );
};
