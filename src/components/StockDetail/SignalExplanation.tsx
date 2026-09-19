import React, { useState } from 'react';
import { Lightbulb, AlertTriangle, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { StockSignal } from '../../types/signal';
import { SignalBadge } from '../StockCard/SignalBadge';
import { EducationModal } from '../EducationModal/EducationModal';

interface Props {
  signal: StockSignal;
}

export const SignalExplanation: React.FC<Props> = ({ signal }) => {
  const [activeEducationTerm, setActiveEducationTerm] = useState<string | null>(null);

  const riskColors = {
    LOW: 'text-growth-400 bg-growth-500/15 border-growth-500/30',
    MODERATE: 'text-gold-400 bg-gold-500/15 border-gold-500/30',
    HIGH: 'text-loss-500 bg-loss-500/15 border-loss-500/30'
  };

  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-4 space-y-4 shadow-sm">
      {/* Top Banner: Action + Timing Score */}
      <div className="flex items-center justify-between pb-3 border-b border-navy-800">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Intelligent Timing Advice
          </span>
          <h3 className="text-base font-bold text-white">{signal.title}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <SignalBadge action={signal.action} size="md" />
          <span className="text-[11px] font-mono text-slate-400">
            Timing Score: <strong className="text-white">{signal.score}</strong>/100
          </span>
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-300 leading-relaxed bg-navy-950/60 p-3 rounded-xl border border-navy-800/80">
        {signal.summary}
      </p>

      {/* Recommended Beginner Action */}
      <div className="p-3 bg-growth-950/20 border border-growth-600/30 rounded-xl flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-growth-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-growth-300 block mb-0.5">Recommended Approach</span>
          <p className="text-xs text-slate-200 leading-relaxed">{signal.recommendedAction}</p>
        </div>
      </div>

      {/* Plain English "Why?" Breakdown */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Why This Recommendation?
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Jargon-Free Analysis</span>
        </div>

        <div className="space-y-2.5">
          {signal.reasons.map((r, i) => (
            <div key={i} className="p-3 bg-navy-950/70 border border-navy-800/90 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                    r.bullish ? 'bg-growth-500/20 text-growth-400' : 'bg-loss-500/20 text-loss-400'
                  }`}>
                    {r.indicator}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{r.summary}</span>
                </div>
                <button
                  onClick={() => setActiveEducationTerm(r.indicator)}
                  className="text-slate-500 hover:text-gold-400 transition"
                  title={`Learn more about ${r.indicator}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{r.detail}</p>

              {/* Beginner Analogy */}
              <div className="pt-1 flex items-start gap-1.5 text-[11px] text-gold-300/90 italic">
                <Lightbulb className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                <span>Analogy: "{r.plainEnglishAnalogy}"</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment Pill */}
      <div className="flex items-center justify-between pt-2 border-t border-navy-800 text-xs">
        <span className="text-slate-400">Calculated Trade Risk:</span>
        <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono border text-[11px] ${riskColors[signal.riskLevel]}`}>
          {signal.riskLevel} RISK
        </span>
      </div>

      {/* Educational Takeaway */}
      <div className="p-3 bg-navy-950/80 border border-gold-500/20 rounded-xl text-xs space-y-1">
        <span className="font-bold text-gold-400 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Beginner Investor Lesson:</span>
        </span>
        <p className="text-slate-300 leading-relaxed">{signal.educationalTip}</p>
      </div>

      {/* Legal Sub-footer */}
      <p className="text-[10px] text-slate-500 text-center italic">
        Signals are calculated for educational demonstration only. Not guaranteed returns or financial advice.
      </p>

      {activeEducationTerm && (
        <EducationModal termOrId={activeEducationTerm} onClose={() => setActiveEducationTerm(null)} />
      )}
    </div>
  );
};
