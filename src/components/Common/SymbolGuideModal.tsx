import React from 'react';
import { X, HelpCircle, Globe, Search, ArrowRight, Lightbulb, FileText } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const SymbolGuideModal: React.FC<Props> = ({ onClose }) => {
  const examples = [
    {
      region: 'Taiwan (TWSE)',
      flag: '🇹🇼',
      format: '4-digit numbers + .TW or .TWO',
      example: 'TSMC is listed as 2330.TW (or just 2330 in local apps), Hon Hai is 2317.TW.',
      tip: 'In your local trading app you may only see numbers like "2330". On global feeds, it uses the ".TW" exchange suffix.'
    },
    {
      region: 'South Korea (KRX / KOSPI)',
      flag: '🇰🇷',
      format: '6-digit numbers + .KS or .KQ',
      example: 'Samsung Electronics is 005930.KS, SK Hynix is 000660.KS.',
      tip: 'Local apps like Kiwoom/Toss show "005930". International data providers append ".KS" (KOSPI) or ".KQ" (KOSDAQ).'
    },
    {
      region: 'United States (NYSE / NASDAQ)',
      flag: '🇺🇸',
      format: '1 to 5 letters (e.g. AAPL, NVDA, SPY)',
      example: 'NVIDIA is NVDA, Apple is AAPL, S&P 500 ETF is SPY.',
      tip: 'Share classes may differ: "BRK.B" on Yahoo/Google vs "BRK/B" or "BRKB" on some brokerages.'
    },
    {
      region: 'United Kingdom (LSE)',
      flag: '🇬🇧',
      format: 'Ticker letters + .L',
      example: 'AstraZeneca is AZN.L, Shell is SHEL.L.',
      tip: 'Notice currency: UK trading apps often quote in pence (GBp) e.g. 12,240p, which equals £122.40.'
    },
    {
      region: 'New Zealand (NZX) & Australia (ASX)',
      flag: '🇳🇿 🇦🇺',
      format: 'Letters + .NZ (NZX) or .AX (ASX)',
      example: 'Fisher & Paykel is FPH.NZ on NZX (or FPH.AX on ASX). BHP is BHP.AX.',
      tip: 'Many large Kiwi/Aussie companies are dual-listed on both NZX and ASX.'
    },
    {
      region: 'Japan (TSE)',
      flag: '🇯🇵',
      format: '4-digit numbers + .T',
      example: 'Toyota is 7203.T, Sony is 6758.T.',
      tip: 'Japanese exchanges use numeric stock codes with a ".T" suffix.'
    },
    {
      region: 'ADRs (American Depositary Receipts)',
      flag: '🌐',
      format: 'US ticker representing foreign stock',
      example: 'TSMC is listed as 2330.TW in Taiwan, but also as TSM (ADR) on the New York Stock Exchange.',
      tip: 'If you bought TSMC on a US brokerage app like Robinhood or Charles Schwab, your ticker is TSM (in USD).'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-navy-900 border border-navy-700/80 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Stock Symbol & Ticker Guide</h3>
              <p className="text-xs text-slate-400">Why trading apps display stock symbols differently</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* Quick Explanation */}
          <div className="p-3.5 bg-navy-950/80 rounded-2xl border border-navy-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-gold-400" />
              <span>The 3 Main Reasons Tickers Differ:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
              <li><strong>Exchange Suffixes:</strong> Global feeds add <code className="text-gold-300 font-mono">.TW</code> (Taiwan), <code className="text-gold-300 font-mono">.KS</code> (Korea), <code className="text-gold-300 font-mono">.L</code> (London), or <code className="text-gold-300 font-mono">.NZ</code> (New Zealand), while local brokers often drop the suffix.</li>
              <li><strong>Numeric vs Letter Codes:</strong> Asian markets (Taiwan, Korea, Japan, Hong Kong) use numeric stock codes instead of letters.</li>
              <li><strong>ADRs (Dual Listings):</strong> Foreign companies often have a separate US dollar ticker (e.g. Taiwan TSMC = <code className="text-growth-300 font-mono">2330.TW</code>, US ADR = <code className="text-growth-300 font-mono">TSM</code>).</li>
            </ol>
          </div>

          {/* Regional Cheat Sheet */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Exchange Formats by Country
            </h4>
            {examples.map((ex, idx) => (
              <div key={idx} className="p-3 bg-navy-950/60 rounded-xl border border-navy-800/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <span>{ex.flag}</span>
                    <span>{ex.region}</span>
                  </div>
                  <span className="text-[10px] text-gold-400 font-mono">{ex.format}</span>
                </div>
                <p className="text-[11px] text-slate-200 font-mono bg-navy-900/60 px-2 py-1 rounded">
                  {ex.example}
                </p>
                <p className="text-[10px] text-slate-400 italic">
                  💡 {ex.tip}
                </p>
              </div>
            ))}
          </div>

          {/* Practical Broker Tip */}
          <div className="p-3 bg-growth-950/20 border border-growth-600/30 rounded-xl flex items-start gap-2.5 text-slate-200">
            <FileText className="w-4 h-4 text-growth-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-growth-300 block text-xs mb-0.5">How to check your brokerage:</strong>
              <p className="text-[11px] text-slate-300">
                Check your trade confirmation email or search your broker using the company's full name. If you still can't find it, click <strong>"Can't find? Add Custom Stock"</strong> to track ANY stock manually!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-navy-800 bg-navy-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-xl text-xs font-semibold transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
