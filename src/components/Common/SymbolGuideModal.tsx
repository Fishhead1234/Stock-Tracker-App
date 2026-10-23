import React from 'react';
import { X, HelpCircle, Lightbulb, FileText } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  onClose: () => void;
}

export const SymbolGuideModal: React.FC<Props> = ({ onClose }) => {
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  const examples = [
    {
      region: 'United States (NYSE & NASDAQ)',
      flag: '🇺🇸',
      format: 'Letters only (1-5 chars)',
      example: 'AAPL (Apple), NVDA (Nvidia), MSFT (Microsoft), VOO (Vanguard S&P 500 ETF)',
      tip: 'US stocks never have dot suffixes on major exchanges.'
    },
    {
      region: 'Taiwan (TWSE & TPEx)',
      flag: '🇹🇼',
      format: '4-digit number + optional ".TW"',
      example: 'TSMC is "2330.TW" (or just 2330 in Taiwan broker apps like 國泰/富邦/元大).',
      tip: 'In your Taiwanese broker, you simply type "2330". On global feeds, it is "2330.TW".'
    },
    {
      region: 'South Korea (KRX & KOSDAQ)',
      flag: '🇰🇷',
      format: '6-digit number + optional ".KS" or ".KQ"',
      example: 'Samsung Electronics is "005930.KS" (or 005930 on Kiwoom/Mirae).',
      tip: 'KOSPI stocks use ".KS", KOSDAQ tech stocks use ".KQ".'
    },
    {
      region: 'United Kingdom (London LSE)',
      flag: '🇬🇧',
      format: 'Ticker letters + ".L"',
      example: 'AstraZeneca is "AZN.L", Shell is "SHEL.L", Rolls-Royce is "RR.L".',
      tip: 'Prices are typically quoted in pence (GBX) or pounds (GBP).'
    },
    {
      region: 'New Zealand (NZX)',
      flag: '🇳🇿',
      format: 'Ticker letters + ".NZ"',
      example: 'Smartshares US 500 is "USF.NZ", Infratil is "IFT.NZ".',
      tip: 'Quoted in NZD, popular on local brokerages like Sharesies and Hatch.'
    },
    {
      region: 'Japan (Tokyo TSE)',
      flag: '🇯🇵',
      format: '4-digit number + optional ".T"',
      example: 'Toyota Motor is "7203.T", Sony is "6758.T", Nintendo is "7974.T".',
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
        className={`border rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors duration-200 ${
          isLight ? 'bg-white border-[rgba(0,0,0,0.12)] text-[#000000]' : 'bg-navy-900 border-navy-700/80 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/80 border-navy-800'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isLight ? 'bg-[#FF9500]/15 text-[#FF9500]' : 'bg-gold-500/20 text-gold-400'
            }`}>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                Stock Symbol &amp; Ticker Guide
              </h3>
              <p className={`text-xs ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                Why trading apps display stock symbols differently
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
              isLight ? 'bg-[#E5E5EA] text-[#666666] hover:text-black' : 'bg-navy-800 text-slate-300 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className={`p-5 overflow-y-auto space-y-4 text-xs leading-relaxed ${
          isLight ? 'text-[#333333]' : 'text-slate-300'
        }`}>
          {/* Quick Explanation */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${
            isLight ? 'bg-[#FFF9E6] border-[#FF9500]/30' : 'bg-navy-950/80 border-navy-800'
          }`}>
            <h4 className={`text-xs font-bold flex items-center gap-1.5 ${
              isLight ? 'text-[#B25E00]' : 'text-white'
            }`}>
              <Lightbulb className={`w-4 h-4 ${isLight ? 'text-[#B25E00]' : 'text-gold-400'}`} />
              <span>The 3 Main Reasons Tickers Differ:</span>
            </h4>
            <ol className={`list-decimal list-inside space-y-1 text-[11px] ${
              isLight ? 'text-[#5C3B00]' : 'text-slate-300'
            }`}>
              <li><strong>Exchange Suffixes:</strong> Global feeds add <code className={`font-mono px-1 rounded ${isLight ? 'bg-[#FFE8B3] text-[#7A4100]' : 'text-gold-300 bg-navy-900'}`}>.TW</code> (Taiwan), <code className={`font-mono px-1 rounded ${isLight ? 'bg-[#FFE8B3] text-[#7A4100]' : 'text-gold-300 bg-navy-900'}`}>.KS</code> (Korea), <code className={`font-mono px-1 rounded ${isLight ? 'bg-[#FFE8B3] text-[#7A4100]' : 'text-gold-300 bg-navy-900'}`}>.L</code> (London), or <code className={`font-mono px-1 rounded ${isLight ? 'bg-[#FFE8B3] text-[#7A4100]' : 'text-gold-300 bg-navy-900'}`}>.NZ</code> (New Zealand), while local brokers often drop the suffix.</li>
              <li><strong>Numeric vs Letter Codes:</strong> Asian markets (Taiwan, Korea, Japan, Hong Kong) use numeric stock codes instead of letters.</li>
              <li><strong>ADRs (Dual Listings):</strong> Foreign companies often have a separate US dollar ticker (e.g. Taiwan TSMC = <code className={`font-mono px-1 rounded ${isLight ? 'bg-[#D1F2D9] text-[#136C28]' : 'text-growth-300 bg-navy-900'}`}>2330.TW</code>, US ADR = <code className={`font-mono px-1 rounded ${isLight ? 'bg-[#D1F2D9] text-[#136C28]' : 'text-growth-300 bg-navy-900'}`}>TSM</code>).</li>
            </ol>
          </div>

          {/* Regional Cheat Sheet */}
          <div className="space-y-2.5">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-black' : 'text-white'}`}>
              Exchange Formats by Country
            </h4>
            {examples.map((ex, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border space-y-1.5 ${
                  isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/60 border-navy-800/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 font-bold text-xs ${isLight ? 'text-black' : 'text-white'}`}>
                    <span>{ex.flag}</span>
                    <span>{ex.region}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-semibold ${isLight ? 'text-[#B25E00]' : 'text-gold-400'}`}>{ex.format}</span>
                </div>
                <p className={`text-[11px] font-mono px-2 py-1 rounded ${
                  isLight ? 'bg-white text-black border border-[rgba(0,0,0,0.06)]' : 'text-slate-200 bg-navy-900/60'
                }`}>
                  {ex.example}
                </p>
                <p className={`text-[10px] italic ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                  💡 {ex.tip}
                </p>
              </div>
            ))}
          </div>

          {/* Practical Broker Tip */}
          <div className={`p-3 rounded-xl flex items-start gap-2.5 border ${
            isLight ? 'bg-[#F2FBF5] border-[#34C759]/30 text-[#1C1C1E]' : 'bg-growth-950/20 border-growth-600/30 text-slate-200'
          }`}>
            <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-[#248A3D]' : 'text-growth-400'}`} />
            <div>
              <strong className={`block text-xs mb-0.5 ${isLight ? 'text-[#248A3D]' : 'text-growth-300'}`}>How to check your brokerage:</strong>
              <p className={`text-[11px] leading-relaxed ${isLight ? 'text-[#333333]' : 'text-slate-300'}`}>
                Check your trade confirmation email or search your broker using the company's full name. If you still can't find it, click <strong>"Can't find? Add Custom Stock"</strong> to track ANY stock manually!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-3 border-t flex justify-end transition-colors ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/80 border-navy-800'
        }`}>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition ${
              isLight ? 'bg-[#E5E5EA] text-black hover:bg-[#D1D1D6]' : 'bg-navy-700 hover:bg-navy-600 text-white'
            }`}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
