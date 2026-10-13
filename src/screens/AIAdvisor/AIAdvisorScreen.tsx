import React, { useState, useRef, useEffect } from 'react';
import { useAdvisorStore } from '../../store/advisorStore';
import { RecommendationCard } from '../../components/AIAdvisor/RecommendationCard';
import { Send, RotateCcw, Bot, Sparkles, User, Shield, Info } from 'lucide-react';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';

export const AIAdvisorScreen: React.FC = () => {
  const {
    messages,
    isTyping,
    sendMessage,
    resetChat,
    profile,
    pendingPrompt,
    setPendingPrompt,
    shouldFocusInput,
    setShouldFocusInput,
  } = useAdvisorStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle incoming prompt from widget chips (e.g. "Ideas" or "ETFs")
  useEffect(() => {
    if (pendingPrompt && !isTyping) {
      const promptToRun = pendingPrompt;
      setPendingPrompt(null);
      sendMessage(promptToRun);
    }
  }, [pendingPrompt, isTyping, sendMessage, setPendingPrompt]);

  // Handle auto-focus from search bar widget click
  useEffect(() => {
    if (shouldFocusInput) {
      setShouldFocusInput(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [shouldFocusInput, setShouldFocusInput]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    const text = inputText;
    setInputText('');
    await sendMessage(text);
  };

  const handleQuickReply = async (prompt: string) => {
    if (isTyping) return;
    await sendMessage(prompt);
  };

  // Get current active quick replies from the latest assistant message
  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const quickReplies = lastAssistantMessage?.quickReplies || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070D1E] text-white pb-20">
      <DisclaimerBanner />

      {/* Header */}
      <div className="px-4 py-3 bg-[#0A1128] border-b border-white/10 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-0.5 shadow-md shadow-blue-900/40">
              <div className="w-full h-full bg-[#0A1128] rounded-[14px] flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0A1128] rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm tracking-wide text-white">Nova AI Coach</h1>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-semibold border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Smart Match
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Personalized stock &amp; ETF guidance</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Start a new coaching consultation?')) {
              resetChat();
            }
          }}
          title="Restart Conversation"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[92%] sm:max-w-[85%]">
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1 border border-emerald-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`rounded-2xl p-3.5 text-sm leading-relaxed shadow-md ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-[#0E1B38] text-slate-200 border border-white/10 rounded-tl-none'
                }`}
              >
                {/* Formatted Message Content */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.content.split('\n\n').map((paragraph, pIdx) => {
                    // Render bolding and markdown headers simply
                    const formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <p
                        key={pIdx}
                        dangerouslySetInnerHTML={{ __html: formatted }}
                      />
                    );
                  })}
                </div>

                {/* Embedded Stock Recommendation Cards */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.recommendations.map((rec) => (
                      <RecommendationCard key={rec.ticker} card={rec} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <span className="text-[10px] text-slate-500 mt-1 px-2">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {/* Typing Animation */}
        {isTyping && (
          <div className="flex items-start gap-2 max-w-[85%]">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#0E1B38] border border-white/10 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-400 ml-1">Analyzing your profile...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Smart Chips */}
      {!isTyping && quickReplies.length > 0 && (
        <div className="px-4 py-2 border-t border-white/5 bg-[#0A1128]/60 overflow-x-auto no-scrollbar flex items-center gap-2">
          {quickReplies.map((qr) => (
            <button
              key={qr.id}
              type="button"
              onClick={() => handleQuickReply(qr.prompt)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-blue-600/30 text-slate-200 hover:text-white border border-white/15 hover:border-blue-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <span>{qr.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSend} className="px-4 py-3 bg-[#0A1128] border-t border-white/10">
        <div className="flex items-center gap-2 bg-[#070D1E] rounded-2xl border border-white/15 px-3 py-1.5 focus-within:border-blue-500/70 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Nova (e.g. 'What stock should I start with?')"
            disabled={isTyping}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none py-1.5"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              inputText.trim() && !isTyping
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 cursor-pointer active:scale-95'
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
