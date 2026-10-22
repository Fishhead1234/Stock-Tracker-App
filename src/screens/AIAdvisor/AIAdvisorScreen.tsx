import React, { useState, useRef, useEffect } from 'react';
import { useAdvisorStore } from '../../store/advisorStore';
import { RecommendationCard } from '../../components/AIAdvisor/RecommendationCard';
import { 
  Send, 
  RotateCcw, 
  Bot, 
  ShieldCheck 
} from 'lucide-react';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';
import { useSettingsStore } from '../../store/settingsStore';

export const AIAdvisorScreen: React.FC = () => {
  const {
    messages,
    isTyping,
    sendMessage,
    resetChat,
    pendingPrompt,
    setPendingPrompt,
    shouldFocusInput,
    setShouldFocusInput
  } = useAdvisorStore();

  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

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
  const quickReplies = lastAssistantMessage?.quickReplies || [
    { id: 'q_review', label: '📊 Review My Portfolio', prompt: 'Review my portfolio and provide an objective analysis of my holdings.' },
    { id: 'q_safe', label: '🛡️ Safe Index ETFs', prompt: 'Tell me about safe index ETFs like VOO or USF.' },
    { id: 'q_dca', label: '💡 How to DCA', prompt: 'What is dollar-cost averaging and how does it protect me?' }
  ];

  return (
    <div className={`flex-1 flex flex-col h-full pb-20 ${
      isLight ? 'bg-[#F2F2F7] text-black' : 'bg-[#070D1E] text-white'
    }`}>
      <DisclaimerBanner />

      {/* Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-md transition-colors ${
        isLight ? 'bg-white/95 border-[rgba(0,0,0,0.08)]' : 'bg-[#0A1128]/95 border-white/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl p-0.5 shadow-md bg-gradient-to-tr from-blue-600 to-emerald-400 shadow-blue-900/30">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                isLight ? 'bg-white' : 'bg-[#0A1128]'
              } text-emerald-400`}>
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 rounded-full animate-pulse bg-emerald-500 ${
              isLight ? 'border-white' : 'border-[#0A1128]'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className={`font-bold text-sm tracking-wide ${isLight ? 'text-black' : 'text-white'}`}>
                Nova AI
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-blue-500/15 text-blue-500 border-blue-500/30 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>Investment Coach</span>
              </span>
            </div>
            <p className={`text-[11px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              Personalized stock, ETF &amp; portfolio guidance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (confirm('Start a new coaching consultation?')) {
                resetChat();
              }
            }}
            title="Restart Conversation"
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isLight 
                ? 'bg-[#F2F2F7] hover:bg-[#E5E5EA] border-[rgba(0,0,0,0.08)] text-[#666666] hover:text-black' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[92%] sm:max-w-[85%]">
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3.5 text-sm leading-relaxed shadow-md transition-all ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : isLight
                        ? 'bg-white text-[#1C1C1E] border border-[rgba(0,0,0,0.08)] rounded-tl-none shadow-xs'
                        : 'bg-[#0E1B38] text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {/* Assistant Header Tag */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10">
                      <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Coach Insight</span>
                      </span>
                    </div>
                  )}

                  {/* Formatted Message Content */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
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

              <span className={`text-[10px] mt-1 px-2 ${isLight ? 'text-[#8E8E93]' : 'text-slate-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {/* Typing Animation */}
        {isTyping && (
          <div className="flex items-start gap-2 max-w-[85%]">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div className={`border rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 ${
              isLight ? 'bg-white border-[rgba(0,0,0,0.08)] text-black' : 'bg-[#0E1B38] border-white/10 text-white'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-bounce bg-emerald-400" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce bg-emerald-400" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce bg-emerald-400" style={{ animationDelay: '300ms' }} />
              </div>
              <span className={`text-xs ml-1 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                Analyzing your portfolio &amp; profile...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Smart Chips */}
      {!isTyping && quickReplies.length > 0 && (
        <div className={`px-4 py-2 border-t overflow-x-auto no-scrollbar flex items-center gap-2 ${
          isLight ? 'bg-white/80 border-[rgba(0,0,0,0.06)]' : 'bg-[#0A1128]/60 border-white/5'
        }`}>
          {quickReplies.map((qr) => (
            <button
              key={qr.id}
              type="button"
              onClick={() => handleQuickReply(qr.prompt)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                isLight
                  ? 'bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] border-[rgba(0,0,0,0.08)]'
                  : 'bg-white/10 hover:bg-blue-600/30 text-slate-200 hover:text-white border-white/15'
              }`}
            >
              <span>{qr.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSend} className={`px-4 py-3 border-t ${
        isLight ? 'bg-white border-[rgba(0,0,0,0.08)]' : 'bg-[#0A1128] border-white/10'
      }`}>
        <div className={`flex items-center gap-2 rounded-2xl border px-3 py-1.5 transition-colors ${
          isLight 
            ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] focus-within:border-[#007AFF]' 
            : 'bg-[#070D1E] border-white/15 focus-within:border-blue-500/70'
        }`}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Nova about stocks, ETFs, or portfolio strategy..."
            disabled={isTyping}
            className={`flex-1 bg-transparent text-sm focus:outline-none py-1.5 ${
              isLight ? 'text-black placeholder-slate-400' : 'text-white placeholder-slate-500'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              inputText.trim() && !isTyping
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 cursor-pointer active:scale-95'
                : isLight
                  ? 'bg-[#E5E5EA] text-slate-400 cursor-not-allowed'
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
