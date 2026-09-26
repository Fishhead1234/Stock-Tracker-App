import React from 'react';
import { Sparkles, Bot, ArrowRight, MessageSquareCode } from 'lucide-react';
import { StockQuote } from '../../types/stock';
import { aiTutorService, QuickPrompt } from '../../services/aiTutorService';
import { useSettingsStore } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  stock: StockQuote;
  onOpenChat: (prompt?: string) => void;
}

export const AITutorCard: React.FC<Props> = ({ stock, onOpenChat }) => {
  const { themeMode } = useSettingsStore();
  const { language } = useLanguageStore();
  const isLight = themeMode === 'neutral-light';
  const quickPrompts: QuickPrompt[] = aiTutorService.getQuickPrompts(stock, language);

  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 border transition-all ${
      isLight 
        ? 'bg-white border-[rgba(0,0,0,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]' 
        : 'bg-gradient-to-br from-purple-950/40 via-navy-900 to-navy-950 border-purple-500/30 shadow-lg'
    }`}>
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${
            isLight 
              ? 'bg-[#007AFF]/10 border-[#007AFF]/25 text-[#007AFF]' 
              : 'bg-purple-500/20 border-purple-400/40 text-purple-300'
          }`}>
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className={`text-sm font-bold tracking-tight flex items-center gap-1 ${
                isLight ? 'text-[#000000]' : 'text-white'
              }`}>
                Gemini AI Market Tutor
                <Sparkles className="w-3.5 h-3.5 text-[#FF9500]" />
              </h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold border ${
                isLight 
                  ? 'bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/20' 
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              }`}>
                2.5 Flash
              </span>
            </div>
            <p className={`text-[13px] leading-snug mt-0.5 ${
              isLight ? 'text-[#666666]' : 'text-slate-400'
            }`}>
              {language === 'ko'
                ? `${stock.ticker}의 차트, 보조지표 및 투자 리스크에 대해 쉽게 질문하세요.`
                : `Ask questions about ${stock.ticker}'s chart, indicators & risks in plain English.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-touch-target="true"
          onClick={() => onOpenChat()}
          className={`shrink-0 min-h-[48px] px-4 py-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm ${
            isLight 
              ? 'bg-[#007AFF] hover:bg-[#0062CC]' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600'
          }`}
        >
          <span>{language === 'ko' ? '대화 시작' : 'Chat'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1-Tap Quick Prompt Chips */}
      <div className={`mt-3 pt-3 border-t relative z-10 ${
        isLight ? 'border-[rgba(0,0,0,0.06)]' : 'border-navy-800/80'
      }`}>
        <div className="flex items-center gap-1 mb-2">
          <MessageSquareCode className={`w-3.5 h-3.5 ${isLight ? 'text-[#007AFF]' : 'text-purple-400'}`} />
          <span className={`text-[11px] font-semibold uppercase tracking-wider font-mono ${
            isLight ? 'text-[#666666]' : 'text-slate-400'
          }`}>
            1-Tap Quick Questions
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.slice(0, 4).map((qp) => (
            <button
              key={qp.id}
              type="button"
              data-touch-target="true"
              onClick={() => onOpenChat(qp.prompt)}
              className={`shrink-0 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-medium border transition cursor-pointer active:scale-95 text-left ${
                isLight 
                  ? 'bg-[#F2F2F7] hover:bg-[#E8E8ED] border-[rgba(0,0,0,0.08)] text-[#000000]' 
                  : 'bg-navy-950/80 hover:bg-navy-850 border-navy-800 text-slate-300 hover:text-white'
              }`}
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
