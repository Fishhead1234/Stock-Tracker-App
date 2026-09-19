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
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 shadow-sm hover:border-navy-750 transition-all space-y-3">
      {/* Top Header: Ticker, Price, Signal */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white text-base">{signal.ticker}</span>
            <span className="text-xs text-slate-400 truncate max-w-[140px]">{signal.companyName}</span>
          </div>
          <div className="text-xs font-mono text-slate-300 mt-0.5">
            Current Price: <strong className="text-white">${signal.currentPrice.toFixed(2)}</strong>
          </div>
        </div>

        <SignalBadge action={signal.action} size="sm" />
      </div>

      {/* Signal Title & Summary */}
      <div className="bg-navy-950/60 p-3 rounded-xl border border-navy-800/80">
        <h4 className="text-xs font-bold text-white mb-1">{signal.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{signal.summary}</p>
      </div>

      {/* Timing Score Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
          <span className="text-slate-400 font-sans">Timing Strength Score:</span>
          <span className="text-white font-bold">{signal.score}/100</span>
        </div>
        <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden border border-navy-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              signal.score >= 65 ? 'bg-growth-500' : signal.score <= 35 ? 'bg-loss-500' : 'bg-gold-500'
            }`}
            style={{ width: `${signal.score}%` }}
          />
        </div>
      </div>

      {/* Educational Analogy Highlight */}
      {signal.reasons.length > 0 && (
        <div className="p-2.5 bg-gold-950/20 border border-gold-600/30 rounded-xl flex items-start gap-2 text-xs text-gold-300/90">
          <Lightbulb className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <p className="italic">"{signal.reasons[0].plainEnglishAnalogy}"</p>
        </div>
      )}

      {/* Expandable Technical Details */}
      {expanded && (
        <div className="space-y-2 pt-2 border-t border-navy-800 animate-fadeIn">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Technical Factors:
          </span>
          {signal.reasons.map((r, i) => (
            <div key={i} className="p-2.5 bg-navy-950/90 rounded-lg border border-navy-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className={`font-mono font-bold text-[10px] px-1.5 py-0.2 rounded ${
                  r.bullish ? 'bg-growth-500/20 text-growth-400' : 'bg-loss-500/20 text-loss-400'
                }`}>
                  {r.indicator}
                </span>
                <button
                  onClick={() => setEducationTerm(r.indicator)}
                  className="text-slate-500 hover:text-gold-400 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-300 text-[11px]">{r.detail}</p>
            </div>
          ))}

          <div className="p-2.5 bg-navy-950/60 rounded-lg border border-navy-800 text-[11px] text-slate-400">
            <strong className="text-slate-200 block mb-0.5">Recommended Action:</strong>
            {signal.recommendedAction}
          </div>
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <span>{expanded ? 'Less Detail' : 'Why this signal?'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => onSelectStock(signal.ticker)}
          className="px-3 py-1.5 bg-navy-800 hover:bg-navy-750 text-white text-xs font-semibold rounded-xl border border-navy-700 flex items-center gap-1.5 transition"
        >
          <span>View Chart & Gauges</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {educationTerm && (
        <EducationModal termOrId={educationTerm} onClose={() => setEducationTerm(null)} />
      )}
    </div>
  );
};
