import React from 'react';
import { Sparkles, Bot, ArrowRight, MessageSquareCode } from 'lucide-react';
import { StockQuote } from '../../types/stock';
import { aiTutorService, QuickPrompt } from '../../services/aiTutorService';

interface Props {
  stock: StockQuote;
  onOpenChat: (prompt?: string) => void;
}

export const AITutorCard: React.FC<Props> = ({ stock, onOpenChat }) => {
  const quickPrompts: QuickPrompt[] = aiTutorService.getQuickPrompts(stock);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/40 via-navy-900 to-navy-950 border border-purple-500/30 p-4 shadow-lg backdrop-blur-sm">
      {/* Subtle background glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner">
            <Bot className="w-5 h-5 text-purple-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1">
                Gemini AI Market Tutor
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              </h3>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded-full font-mono font-semibold">
                2.5 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
              Ask questions about {stock.ticker}'s chart, indicators & risks in plain English.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenChat()}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition transform active:scale-95"
        >
          <span>Chat</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 1-Tap Quick Prompt Chips */}
      <div className="mt-3 pt-3 border-t border-navy-800/80 relative z-10">
        <div className="flex items-center gap-1 mb-2">
          <MessageSquareCode className="w-3 h-3 text-purple-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
            1-Tap Quick Questions
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.slice(0, 4).map((qp) => (
            <button
              key={qp.id}
              onClick={() => onOpenChat(qp.prompt)}
              className="shrink-0 text-[11px] bg-navy-950/90 hover:bg-purple-950/60 border border-navy-800 hover:border-purple-500/50 text-slate-300 hover:text-white px-2.5 py-1 rounded-xl transition font-sans flex items-center gap-1 shadow-sm active:scale-95"
            >
              <span>{qp.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
