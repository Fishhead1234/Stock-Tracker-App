import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { StockSignal } from '../../types/signal';
import { SignalBadge } from '../StockCard/SignalBadge';
import { EducationModal } from '../EducationModal/EducationModal';

interface Props {
  signal: StockSignal;
  onSelectStock: (ticker: string) => void;
}

export const SignalCard: React.FC<Props> = ({ signal, onSelectStock }) => {
  const [expanded, setExpanded] = useState(false);
  const [educationTerm, setEducationTerm] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-navy-900/90 border border-black/10 dark:border-navy-800 rounded-2xl p-4 shadow-xs hover:border-[#007AFF]/30 transition-all space-y-3">
      {/* Top Header: Ticker, Price, Signal */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[#000000] dark:text-white text-base">{signal.ticker}</span>
            <span className="text-[13px] text-[#666666] dark:text-slate-400 truncate max-w-[140px]">{signal.companyName}</span>
          </div>
          <div className="text-[13px] font-mono text-[#666666] dark:text-slate-300 mt-0.5">
            Current Price: <strong className="text-[#000000] dark:text-white">${signal.currentPrice.toFixed(2)}</strong>
          </div>
        </div>

        <SignalBadge action={signal.action} size="sm" />
      </div>

      {/* Signal Title & Summary */}
      <div className="bg-[#F2F2F7] dark:bg-navy-950/60 p-3.5 rounded-xl border border-black/5 dark:border-navy-800/80">
        <h4 className="text-[14px] font-bold text-[#000000] dark:text-white mb-1">{signal.title}</h4>
        <p className="text-[13px] text-[#666666] dark:text-slate-300 leading-[1.6]">{signal.summary}</p>
      </div>

      {/* Timing Score Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1 font-mono">
          <span className="text-[#666666] dark:text-slate-400 font-sans">Timing Strength Score:</span>
          <span className="text-[#000000] dark:text-white font-bold">{signal.score}/100</span>
        </div>
        <div className="h-2 w-full bg-[#E8E8ED] dark:bg-navy-950 rounded-full overflow-hidden border border-black/5 dark:border-navy-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              signal.score >= 65 ? 'bg-[#34C759]' : signal.score <= 35 ? 'bg-[#FF3B30]' : 'bg-[#FF9500]'
            }`}
            style={{ width: `${signal.score}%` }}
          />
        </div>
      </div>

      {/* Educational Analogy Highlight */}
      {signal.reasons.length > 0 && (
        <div className="p-3 bg-[#FFF9E6] dark:bg-gold-950/20 border border-[#FF9500]/30 rounded-xl flex items-start gap-2 text-[13px] text-[#8F5B00] dark:text-gold-300/90 leading-[1.5]">
          <Lightbulb className="w-4 h-4 text-[#FF9500] shrink-0 mt-0.5" />
          <p className="italic">"{signal.reasons[0].plainEnglishAnalogy}"</p>
        </div>
      )}

      {/* Expandable Technical Details (Smooth transition, default text #666, keeping content visible) */}
      {expanded && (
        <div className="space-y-2 pt-2 border-t border-black/10 dark:border-navy-800 transition-all duration-300 ease-in-out">
          <span className="text-[11px] font-bold text-[#8E8E93] dark:text-slate-400 uppercase tracking-wider block">
            Technical Factors:
          </span>
          {signal.reasons.map((r, i) => (
            <div key={i} className="p-3 bg-[#F2F2F7] dark:bg-navy-950/90 rounded-xl border border-black/5 dark:border-navy-800 text-[13px] space-y-1">
              <div className="flex items-center justify-between">
                <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                  r.bullish ? 'bg-[#34C759]/15 text-[#34C759]' : 'bg-[#FF3B30]/15 text-[#FF3B30]'
                }`}>
                  {r.indicator}
                </span>
                <button
                  onClick={() => setEducationTerm(r.indicator)}
                  className="p-1 text-[#8E8E93] hover:text-[#FF9500] transition"
                  title="Explain term"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[#666666] dark:text-slate-300 text-xs leading-[1.5]">{r.detail}</p>
            </div>
          ))}

          <div className="p-3 bg-[#F2F2F7] dark:bg-navy-950/60 rounded-xl border border-black/5 dark:border-navy-800 text-xs text-[#666666] dark:text-slate-400 leading-[1.5]">
            <strong className="text-[#000000] dark:text-slate-200 block mb-0.5">Educational Context:</strong>
            {signal.recommendedAction}
          </div>
        </div>
      )}

      {/* Bottom Action Buttons (48px Touch Targets) */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="min-h-[48px] px-2 text-[13px] font-medium text-[#666666] hover:text-[#000000] dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition"
        >
          <span>{expanded ? 'Less Detail' : 'Why this signal?'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onSelectStock(signal.ticker)}
          className="min-h-[48px] px-4 py-2 bg-[#007AFF] hover:bg-[#0062CC] text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs"
        >
          <span>View Chart & Gauges</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {educationTerm && (
        <EducationModal termOrId={educationTerm} onClose={() => setEducationTerm(null)} />
      )}
    </div>
  );
};
