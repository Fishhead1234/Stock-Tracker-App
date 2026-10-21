import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { StockSignal } from '../../types/signal';
import { SignalBadge } from '../StockCard/SignalBadge';
import { EducationModal } from '../EducationModal/EducationModal';
import { useLanguageStore } from '../../store/languageStore';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  signal: StockSignal;
  onSelectStock: (ticker: string) => void;
}

export const SignalCard: React.FC<Props> = ({ signal, onSelectStock }) => {
  const { t } = useLanguageStore();
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  const [expanded, setExpanded] = useState(false);
  const [educationTerm, setEducationTerm] = useState<string | null>(null);

  return (
    <div className={`rounded-2xl p-4 transition-all duration-300 relative overflow-hidden border space-y-3 ${
      signal.isHolding
        ? isLight
          ? 'bg-gradient-to-b from-[#F2FBF5] via-white to-white border-[#34C759]/60 ring-2 ring-[#34C759]/40 shadow-[0_0_20px_rgba(52,199,89,0.22),0_6px_20px_rgba(52,199,89,0.1)]'
          : 'bg-gradient-to-b from-[#0B251E] via-navy-900 to-navy-900 border-emerald-500/60 ring-2 ring-emerald-500/50 shadow-[0_0_22px_rgba(16,185,129,0.35),0_0_45px_rgba(16,185,129,0.15)]'
        : isLight
          ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-xs hover:border-[#007AFF]/30'
          : 'bg-navy-900/90 border-navy-800 shadow-sm hover:border-navy-700'
    }`}>
      {/* Top glowing accent bar for personal holdings */}
      {signal.isHolding && (
        <div 
          className={`absolute top-0 left-0 right-0 h-[3px] ${
            isLight
              ? 'bg-gradient-to-r from-[#34C759] via-emerald-400 to-[#30D158] shadow-[0_0_8px_rgba(52,199,89,0.5)]'
              : 'bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
          }`} 
        />
      )}

      {/* Top Header: Ticker, Price, Signal */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-[#000000] dark:text-white text-base">{signal.ticker}</span>
            <span className="text-[13px] text-[#666666] dark:text-slate-400 truncate max-w-[140px]">{signal.companyName}</span>
            {signal.isHolding && (
              <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isLight 
                  ? 'bg-[#34C759]/15 text-[#248A3D] border-[#34C759]/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? 'bg-[#34C759]' : 'bg-emerald-400'}`} />
                <span>Holding</span>
              </span>
            )}
          </div>
          <div className="text-[13px] font-mono text-[#666666] dark:text-slate-300 mt-0.5">
            {t('sig_current_price', 'Current Price:')} <strong className="text-[#000000] dark:text-white">${signal.currentPrice.toFixed(2)}</strong>
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
          <span className="text-[#666666] dark:text-slate-400 font-sans">
            {t('sig_timing_score', 'Timing Strength Score:')}
          </span>
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
            {t('sig_tech_factors', 'Technical Factors:')}
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
            <strong className="text-[#000000] dark:text-slate-200 block mb-0.5">
              {t('sig_edu_context', 'Educational Context:')}
            </strong>
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
          <span>{expanded ? t('sig_hide_factors', 'Less Detail') : t('sig_why_signal', 'Why this signal?')}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onSelectStock(signal.ticker)}
          className="min-h-[48px] px-4 py-2 bg-[#007AFF] hover:bg-[#0062CC] text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs"
        >
          <span>{t('sig_view_chart', 'View Chart & Gauges')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {educationTerm && (
        <EducationModal termOrId={educationTerm} onClose={() => setEducationTerm(null)} />
      )}
    </div>
  );
};
