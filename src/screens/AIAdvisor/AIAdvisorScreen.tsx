import React, { useState, useRef, useEffect } from 'react';
import { useAdvisorStore } from '../../store/advisorStore';
import { RecommendationCard } from '../../components/AIAdvisor/RecommendationCard';
import { 
  Send, 
  RotateCcw, 
  Bot, 
  Sparkles, 
  Volume2, 
  Square, 
  Settings2, 
  Flame, 
  ShieldCheck, 
  User, 
  X,
  Play
} from 'lucide-react';
import { DisclaimerBanner } from '../../components/Common/DisclaimerBanner';
import { speechService, VoiceGender, VoicePersona } from '../../services/speechService';
import { useLanguageStore } from '../../store/languageStore';
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
    setShouldFocusInput,
    voiceGender,
    personaTone,
    setVoiceGender,
    setPersonaTone
  } = useAdvisorStore();

  const { language } = useLanguageStore();
  const { themeMode } = useSettingsStore();
  const isLight = themeMode === 'neutral-light';

  const [inputText, setInputText] = useState('');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to speechService updates (isSpeaking, currentMsgId)
  useEffect(() => {
    const unsubscribe = speechService.subscribe((isSpeaking, msgId) => {
      setActiveSpeakingId(isSpeaking ? msgId || 'playing' : null);
    });
    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

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

  const handleToggleSpeak = (msgId: string, content: string) => {
    if (activeSpeakingId === msgId) {
      speechService.stop();
    } else {
      speechService.speak(content, msgId, language);
    }
  };

  // Get current active quick replies from the latest assistant message
  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const quickReplies = lastAssistantMessage?.quickReplies || [
    { id: 'q_roast', label: '🔥 Roast My Portfolio', prompt: 'Roast my portfolio and tell me what mistakes I am making.' },
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
            <div className={`w-10 h-10 rounded-2xl p-0.5 shadow-md ${
              personaTone === 'spicy_sarcastic' 
                ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-red-500 shadow-rose-900/30' 
                : 'bg-gradient-to-tr from-blue-600 to-emerald-400 shadow-blue-900/30'
            }`}>
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                isLight ? 'bg-white' : 'bg-[#0A1128]'
              } ${personaTone === 'spicy_sarcastic' ? 'text-rose-500' : 'text-emerald-400'}`}>
                {personaTone === 'spicy_sarcastic' ? <Flame className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 rounded-full animate-pulse ${
              isLight ? 'border-white' : 'border-[#0A1128]'
            } ${personaTone === 'spicy_sarcastic' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className={`font-bold text-sm tracking-wide ${isLight ? 'text-black' : 'text-white'}`}>
                {voiceGender === 'female' ? 'Nova' : 'Max'} AI
              </h1>
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 transition cursor-pointer active:scale-95 ${
                  personaTone === 'spicy_sarcastic'
                    ? 'bg-rose-500/15 text-rose-500 border-rose-500/30 hover:bg-rose-500/25'
                    : 'bg-blue-500/15 text-blue-500 border-blue-500/30 hover:bg-blue-500/25'
                }`}
              >
                {personaTone === 'spicy_sarcastic' ? <Flame className="w-2.5 h-2.5" /> : <ShieldCheck className="w-2.5 h-2.5" />}
                <span>{personaTone === 'spicy_sarcastic' ? 'Spicy Roast Mode' : 'Coach Mode'}</span>
                <span className="opacity-60">• {voiceGender === 'female' ? '♀ Her Voice' : '♂ His Voice'}</span>
              </button>
            </div>
            <p className={`text-[11px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              {personaTone === 'spicy_sarcastic' ? 'Unfiltered sarcastic reality checks' : 'Personalized stock & ETF guidance'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            title="Voice & Roast Settings"
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isLight 
                ? 'bg-[#F2F2F7] hover:bg-[#E5E5EA] border-[rgba(0,0,0,0.08)] text-[#007AFF]' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-emerald-400 hover:text-white'
            }`}
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Start a new coaching consultation?')) {
                speechService.stop();
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
          const isMsgSpeaking = activeSpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[92%] sm:max-w-[85%]">
                {msg.role === 'assistant' && (
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 border ${
                    personaTone === 'spicy_sarcastic'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {personaTone === 'spicy_sarcastic' ? <Flame className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3.5 text-sm leading-relaxed shadow-md transition-all ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : isLight
                        ? 'bg-white text-[#1C1C1E] border border-[rgba(0,0,0,0.08)] rounded-tl-none shadow-xs'
                        : 'bg-[#0E1B38] text-slate-200 border border-white/10 rounded-tl-none'
                  } ${isMsgSpeaking ? 'ring-2 ring-rose-500/70 shadow-lg' : ''}`}
                >
                  {/* Assistant Speech Bar */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10">
                      <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                        personaTone === 'spicy_sarcastic' ? 'text-rose-500' : 'text-emerald-500'
                      }`}>
                        {personaTone === 'spicy_sarcastic' ? '🌶️ Sarcastic Roast' : '🛡️ Mentor Advice'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        title={isMsgSpeaking ? 'Stop reading' : 'Read aloud with voice'}
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 transition cursor-pointer active:scale-95 ${
                          isMsgSpeaking
                            ? 'bg-rose-500 text-white animate-pulse'
                            : isLight
                              ? 'bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#007AFF]'
                              : 'bg-white/10 hover:bg-white/20 text-slate-300'
                        }`}
                      >
                        {isMsgSpeaking ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Play Voice</span>
                          </>
                        )}
                      </button>
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
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
              personaTone === 'spicy_sarcastic' 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              {personaTone === 'spicy_sarcastic' ? <Flame className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`border rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 ${
              isLight ? 'bg-white border-[rgba(0,0,0,0.08)] text-black' : 'bg-[#0E1B38] border-white/10 text-white'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full animate-bounce ${personaTone === 'spicy_sarcastic' ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ animationDelay: '0ms' }} />
                <span className={`w-2 h-2 rounded-full animate-bounce ${personaTone === 'spicy_sarcastic' ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ animationDelay: '150ms' }} />
                <span className={`w-2 h-2 rounded-full animate-bounce ${personaTone === 'spicy_sarcastic' ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ animationDelay: '300ms' }} />
              </div>
              <span className={`text-xs ml-1 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {personaTone === 'spicy_sarcastic' ? 'Cooking up a spicy roast...' : 'Analyzing your portfolio & profile...'}
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
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                qr.id.includes('roast')
                  ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 border-rose-500/40 font-bold'
                  : isLight
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
            placeholder={
              personaTone === 'spicy_sarcastic'
                ? "Ask Nova or type 'Roast my portfolio'..."
                : "Ask Nova (e.g. 'What stock should I start with?')"
            }
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
                ? personaTone === 'spicy_sarcastic'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 cursor-pointer active:scale-95'
                  : 'bg-blue-600 text-white shadow-md shadow-blue-900/40 cursor-pointer active:scale-95'
                : isLight
                  ? 'bg-[#E5E5EA] text-slate-400 cursor-not-allowed'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Voice & Roast Settings Modal */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className={`rounded-2xl w-full max-w-sm p-5 shadow-2xl border transition-colors ${
              isLight ? 'bg-white border-[rgba(0,0,0,0.12)] text-black' : 'bg-navy-900 border-navy-700 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">Voice &amp; Roast Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isLight ? 'bg-[#F2F2F7] text-[#666666]' : 'bg-navy-800 text-slate-300'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Voice Gender Selection */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider block mb-2 ${
                  isLight ? 'text-[#666666]' : 'text-slate-400'
                }`}>
                  Select Voice
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVoiceGender('female')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                      voiceGender === 'female'
                        ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                        : isLight
                          ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)] text-[#666666]'
                          : 'bg-navy-850 border-navy-750 text-slate-300'
                    }`}
                  >
                    <span className="text-xl">👩</span>
                    <span className="text-xs">Female (Nova)</span>
                    <span className="text-[10px] opacity-70">Spicy, witty, snappy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVoiceGender('male')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                      voiceGender === 'male'
                        ? 'bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : isLight
                          ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)] text-[#666666]'
                          : 'bg-navy-850 border-navy-750 text-slate-300'
                    }`}
                  >
                    <span className="text-xl">👨</span>
                    <span className="text-xs">Male (Max)</span>
                    <span className="text-[10px] opacity-70">Dry, deadpan, cynical</span>
                  </button>
                </div>
              </div>

              {/* Personality / Roast Mode Selection */}
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider block mb-2 ${
                  isLight ? 'text-[#666666]' : 'text-slate-400'
                }`}>
                  Roast Speech Personality
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setPersonaTone('spicy_sarcastic')}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                      personaTone === 'spicy_sarcastic'
                        ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-bold'
                        : isLight
                          ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)] text-[#666666]'
                          : 'bg-navy-850 border-navy-750 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="text-lg">🔥</span>
                      <div>
                        <span className="text-xs block font-bold">Spicy &amp; Sarcastic Roast</span>
                        <span className="text-[11px] opacity-75 font-normal">Brutally honest, witty roasts on trading habits</span>
                      </div>
                    </div>
                    {personaTone === 'spicy_sarcastic' && <span className="text-xs">✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPersonaTone('coach_encouraging')}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                      personaTone === 'coach_encouraging'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                        : isLight
                          ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.08)] text-[#666666]'
                          : 'bg-navy-850 border-navy-750 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="text-lg">🛡️</span>
                      <div>
                        <span className="text-xs block font-bold">Gentle Coach Mode</span>
                        <span className="text-[11px] opacity-75 font-normal">Encouraging, step-by-step guidance</span>
                      </div>
                    </div>
                    {personaTone === 'coach_encouraging' && <span className="text-xs">✓</span>}
                  </button>
                </div>
              </div>

              {/* Test Voice Sample Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => speechService.testSample(voiceGender, personaTone)}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-sm ${
                    personaTone === 'spicy_sarcastic'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : isLight
                        ? 'bg-[#007AFF] hover:bg-[#0062CC] text-white'
                        : 'bg-growth-600 hover:bg-growth-500 text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>🔊 Test Voice &amp; Hear Sample Roast</span>
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                  isLight ? 'bg-[#E5E5EA] text-black' : 'bg-navy-800 text-white'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
