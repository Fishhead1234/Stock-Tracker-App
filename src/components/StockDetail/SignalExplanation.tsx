import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, HelpCircle, Briefcase } from 'lucide-react';
import { StockSignal } from '../../types/signal';
import { SignalBadge } from '../StockCard/SignalBadge';
import { EducationModal } from '../EducationModal/EducationModal';
import { useSettingsStore } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  signal: StockSignal;
}

export const SignalExplanation: React.FC<Props> = ({ signal }) => {
  const [activeEducationTerm, setActiveEducationTerm] = useState<string | null>(null);
  const { themeMode } = useSettingsStore();
  const { language, t } = useLanguageStore();
  const isLight = themeMode === 'neutral-light';

  const riskColors = {
    LOW: isLight ? 'text-[#34C759] bg-[#34C759]/12 border-[#34C759]/30' : 'text-growth-400 bg-growth-500/15 border-growth-500/30',
    MODERATE: isLight ? 'text-[#FF9500] bg-[#FF9500]/12 border-[#FF9500]/30' : 'text-gold-400 bg-gold-500/15 border-gold-500/30',
    HIGH: isLight ? 'text-[#FF3B30] bg-[#FF3B30]/12 border-[#FF3B30]/30' : 'text-loss-500 bg-loss-500/15 border-loss-500/30'
  };

  return (
    <div className={`rounded-2xl p-4 space-y-4 border transition-all ${
      isLight 
        ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]' 
        : 'bg-navy-900/90 border-navy-800 shadow-sm'
    }`}>
      {/* Top Banner: Action + Timing Score */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isLight ? 'border-[rgba(0,0,0,0.06)]' : 'border-navy-800'
      }`}>
        <div>
          <span className={`text-[11px] uppercase font-bold tracking-wider block mb-1 ${
            isLight ? 'text-[#666666]' : 'text-slate-400'
          }`}>
            {signal.isHolding 
              ? (language === 'ko' ? '보유 주식 맞춤 분석' : 'Personal Holding Analysis') 
              : (language === 'ko' ? '지능형 타이밍 분석' : 'Intelligent Timing Advice')}
          </span>
          <h3 className={`text-base font-bold ${isLight ? 'text-[#000000]' : 'text-white'}`}>
            {signal.title}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <SignalBadge action={signal.action} size="md" />
          <span className={`text-[12px] font-mono ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
            {t('sig_timing_score', 'Timing Score:')} <strong className={isLight ? 'text-black' : 'text-white'}>{signal.score}</strong>/100
          </span>
        </div>
      </div>

      {/* Cost Basis Context Banner (for Holdings) */}
      {signal.isHolding && signal.averageBuyPrice !== undefined && (
        <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
          isLight ? 'bg-[#007AFF]/8 border-[#007AFF]/25' : 'bg-navy-950/80 border-[#007AFF]/30'
        }`}>
          <div className="p-2 rounded-xl bg-[#007AFF]/15 text-[#007AFF] shrink-0 mt-0.5">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-[#007AFF]' : 'text-blue-400'}`}>
                {language === 'ko' ? '보유 포지션 평단가 지수' : 'Holding Cost-Basis Index'}
              </span>
              <span className={`text-[12px] font-mono font-bold ${
                (signal.pnlPercent || 0) >= 0 
                  ? isLight ? 'text-[#34C759]' : 'text-growth-400'
                  : isLight ? 'text-[#FF3B30]' : 'text-loss-500'
              }`}>
                {(signal.pnlPercent || 0) >= 0 ? '+' : ''}{(signal.pnlPercent || 0).toFixed(1)}% vs Cost
              </span>
            </div>
            <p className={`text-[12px] font-mono ${isLight ? 'text-[#666666]' : 'text-slate-300'}`}>
              Avg Buy Price: <strong>${signal.averageBuyPrice.toFixed(2)}</strong> • Current: <strong>${signal.currentPrice.toFixed(2)}</strong>
            </p>
            {signal.costBasisFeedback && (
              <p className={`text-[12px] leading-relaxed mt-1 font-sans ${isLight ? 'text-black' : 'text-slate-200'}`}>
                💡 {signal.costBasisFeedback}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Asset-Class Strategy Indicator Banner */}
      {signal.assetStrategyBadge && (
        <div className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
          signal.assetClass === 'INDEX_ETF'
            ? isLight ? 'bg-emerald-50/80 border-emerald-300/60 text-emerald-950' : 'bg-emerald-950/40 border-emerald-700/50 text-emerald-200'
            : signal.assetClass === 'LEVERAGED_ETF'
              ? isLight ? 'bg-amber-50/80 border-amber-300/60 text-amber-950' : 'bg-amber-950/40 border-amber-700/50 text-amber-200'
              : signal.assetClass === 'SECTOR_ETF'
                ? isLight ? 'bg-purple-50/80 border-purple-300/60 text-purple-950' : 'bg-purple-950/40 border-purple-700/50 text-purple-200'
                : isLight ? 'bg-blue-50/70 border-blue-200/80 text-blue-950' : 'bg-navy-950/80 border-blue-500/30 text-blue-200'
        }`}>
          <div className="min-w-0 flex-1">
            <span className="text-[12px] font-bold tracking-tight block mb-0.5">
              {signal.assetStrategyBadge}
            </span>
            {signal.assetStrategySummary && (
              <p className={`text-[12px] leading-relaxed ${isLight ? 'text-[#333333]' : 'text-slate-300'}`}>
                {signal.assetStrategySummary}
              </p>
            )}
          </div>
          <button
            type="button"
            data-touch-target="true"
            onClick={() => setActiveEducationTerm('lesson-etf-vs-stock')}
            className={`p-1.5 rounded-lg transition shrink-0 cursor-pointer ${
              isLight ? 'hover:bg-black/5 text-[#666666]' : 'hover:bg-white/10 text-slate-300'
            }`}
            title="Read ETF vs. Stock Strategy Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary */}
      <p className={`text-[13px] leading-relaxed p-3 rounded-xl border ${
        isLight ? 'bg-[#F2F2F7] text-[#666666] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950/60 text-slate-300 border-navy-800/80'
      }`}>
        {signal.summary}
      </p>

      {/* Recommended Beginner Action */}
      <div className={`p-3 rounded-xl flex items-start gap-2.5 border ${
        isLight ? 'bg-[#34C759]/10 border-[#34C759]/30' : 'bg-growth-950/20 border-growth-600/30'
      }`}>
        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-[#34C759]' : 'text-growth-400'}`} />
        <div>
          <span className={`text-xs font-bold block mb-0.5 ${isLight ? 'text-[#34C759]' : 'text-growth-300'}`}>
            {language === 'ko' ? '추천 접근법' : 'Recommended Approach'}
          </span>
          <p className={`text-[13px] leading-relaxed ${isLight ? 'text-[#000000]' : 'text-slate-200'}`}>
            {signal.recommendedAction}
          </p>
        </div>
      </div>

      {/* Plain English "Why?" Breakdown */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#000000]' : 'text-white'}`}>
            {language === 'ko' ? '이 신호를 추천하는 이유' : 'Why This Recommendation?'}
          </span>
          <span className={`text-[12px] ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
            {language === 'ko' ? '전문 용어 없는 쉬운 분석' : 'Jargon-Free Analysis'}
          </span>
        </div>

        <div className="space-y-2.5">
          {signal.reasons.map((r, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border space-y-1.5 ${
                isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950/60 border-navy-800/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                    r.indicator === 'ASSET_STRATEGY'
                      ? isLight ? 'bg-purple-500/15 text-purple-700 border-purple-300' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : r.indicator === 'COST_BASIS'
                        ? isLight ? 'bg-blue-500/15 text-blue-700 border-blue-300' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : r.bullish
                          ? isLight ? 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/30' : 'bg-growth-500/20 text-growth-400 border-growth-500/30'
                          : isLight ? 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/30' : 'bg-loss-500/20 text-loss-400 border-loss-500/30'
                  }`}>
                    {r.indicator}
                  </span>
                  <span className={`text-[13px] font-semibold ${isLight ? 'text-black' : 'text-slate-200'}`}>
                    {r.summary}
                  </span>
                </div>
                <button
                  type="button"
                  data-touch-target="true"
                  onClick={() => setActiveEducationTerm(r.indicator === 'ASSET_STRATEGY' ? 'lesson-etf-vs-stock' : r.indicator)}
                  className={`transition cursor-pointer p-1 ${isLight ? 'text-[#8E8E93] hover:text-[#007AFF]' : 'text-slate-500 hover:text-gold-400'}`}
                  title={`Learn more about ${r.indicator}`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className={`text-[13px] leading-relaxed ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {r.detail}
              </p>

              {/* Beginner Analogy */}
              <div className={`pt-1 flex items-start gap-1.5 text-xs italic ${
                isLight ? 'text-[#FF9500]' : 'text-gold-300'
              }`}>
                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{language === 'ko' ? '일상 비유' : 'Analogy'}: "{r.plainEnglishAnalogy}"</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Level Badge & Learn More Trigger */}
      <div className={`pt-3 border-t flex items-center justify-between flex-wrap gap-2 ${
        isLight ? 'border-[rgba(0,0,0,0.06)]' : 'border-navy-800'
      }`}>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
            {language === 'ko' ? '예상 타이밍 리스크:' : 'Estimated Timing Risk:'}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${riskColors[signal.riskLevel]}`}>
            {signal.riskLevel === 'LOW' ? (language === 'ko' ? '낮음' : 'LOW') : signal.riskLevel === 'MODERATE' ? (language === 'ko' ? '보통' : 'MODERATE') : (language === 'ko' ? '높음' : 'HIGH')}
          </span>
        </div>

        <button
          type="button"
          data-touch-target="true"
          onClick={() => setActiveEducationTerm('TIMING_BASICS')}
          className={`text-xs font-semibold underline flex items-center gap-1 cursor-pointer ${
            isLight ? 'text-[#007AFF] hover:text-[#0062CC]' : 'text-gold-400 hover:text-gold-300'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{language === 'ko' ? '지표 산출 기준 보기' : 'How we calculate this'}</span>
        </button>
      </div>

      {activeEducationTerm && (
        <EducationModal
          termOrId={activeEducationTerm}
          onClose={() => setActiveEducationTerm(null)}
        />
      )}
    </div>
  );
};
