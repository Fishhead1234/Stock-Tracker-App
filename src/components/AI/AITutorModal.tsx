import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  ShieldAlert, 
  Check, 
  Copy,
  ExternalLink,
  MessageSquare,
  Key
} from 'lucide-react';
import { StockQuote } from '../../types/stock';
import { aiTutorService, AIMessage, GroundedStockContext, QuickPrompt } from '../../services/aiTutorService';
import { useSettingsStore } from '../../store/settingsStore';
import { useLanguageStore } from '../../store/languageStore';

interface Props {
  stock?: StockQuote | null;
  initialPrompt?: string;
  onClose: () => void;
}

export const AITutorModal: React.FC<Props> = ({ stock, initialPrompt, onClose }) => {
  const { geminiApiKey, geminiModel, setGeminiApiKey, setActiveTab, themeMode } = useSettingsStore();
  const { language } = useLanguageStore();
  const isLight = themeMode === 'neutral-light';
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showKeyInput, setShowKeyInput] = useState(false);
  const [inlineKey, setInlineKey] = useState(geminiApiKey || '');
  const [keyStatus, setKeyStatus] = useState<string | null>(null);
  const [isTestingKey, setIsTestingKey] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stockContext: GroundedStockContext | undefined = stock 
    ? aiTutorService.buildStockContext(stock) 
    : undefined;

  const quickPrompts: QuickPrompt[] = stock 
    ? aiTutorService.getQuickPrompts(stock, language) 
    : [
        { id: 'rsi_explain', label: 'How does RSI work?', prompt: 'Explain how the Relative Strength Index (RSI) works for beginners, and how to spot oversold vs overbought conditions.' },
        { id: 'macd_explain', label: 'What is MACD?', prompt: 'What is the MACD indicator? How do moving average crossovers help traders understand momentum?' },
        { id: 'dca_explain', label: 'Dollar-Cost Averaging', prompt: 'What is Dollar-Cost Averaging (DCA), and why is it recommended for beginner investors?' },
        { id: 'pe_explain', label: 'Explain P/E Ratio', prompt: 'How does the Price-to-Earnings (P/E) ratio help investors evaluate whether a stock is cheap or expensive?' }
      ];

  const handleSaveInlineKey = async () => {
    const trimmed = inlineKey.trim();
    if (!trimmed) {
      setGeminiApiKey('');
      setKeyStatus('Key removed. Using built-in educational engine.');
      return;
    }

    setIsTestingKey(true);
    setKeyStatus(null);
    const result = await aiTutorService.testConnection(trimmed, geminiModel || 'gemini-2.5-flash');
    setIsTestingKey(false);
    if (result.success) {
      setGeminiApiKey(trimmed);
      setKeyStatus(result.message);
      setTimeout(() => setShowKeyInput(false), 1500);
    } else {
      setKeyStatus(result.message);
    }
  };

  // Initialize conversation
  useEffect(() => {
    let welcomeText = '';
    const isZhTW = language === 'zh-TW';
    const isZhCN = language === 'zh-CN';

    if (stock) {
      if (isZhTW) {
        welcomeText = `您好！我是您的 **AI 投資市場導師**。\n\n我正在為您查看 **${stock.name} (${stock.ticker})** 的即時盤勢，目前股價為 **${stock.currencySymbol || '$'}${stock.price.toFixed(2)}**。\n\n您可以向我詢問它的 **RSI 動能 (${stock.indicators.rsi.toFixed(1)})**、**MACD 交叉訊號**、跌破均線時能否加碼，或是如何設定停利停損。請問您想深入了解哪一部分？`;
      } else if (isZhCN) {
        welcomeText = `您好！我是您的 **AI 投资市场导师**。\n\n我正在为您查看 **${stock.name} (${stock.ticker})** 的实时盘势，目前股价为 **${stock.currencySymbol || '$'}${stock.price.toFixed(2)}**。\n\n您可以向我询问它的 **RSI 动能 (${stock.indicators.rsi.toFixed(1)})**、**MACD 交叉信号**、跌破均线时能否加仓，或是如何设定止盈止损。请问您想深入了解哪一部分？`;
      } else {
        welcomeText = `Hello! I'm your **AI Market Tutor**.\n\nI'm looking at live market data for **${stock.name} (${stock.ticker})**, currently trading at **${stock.currencySymbol || '$'}${stock.price.toFixed(2)}**.\n\nYou can ask me about its **RSI (${stock.indicators.rsi.toFixed(1)})**, the **MACD momentum**, whether to buy more on pullbacks, or how to set risk boundaries. What would you like to explore?`;
      }
    } else {
      if (isZhTW) {
        welcomeText = `您好！我是您的 **AI 投資市場導師**。\n\n我在此協助您學習股票投資基礎觀念、解讀技術指標圖表，以及建立嚴謹的風險管理原則。\n\n您可以隨時在下方輸入任何問題，或點擊精選主題開始！`;
      } else if (isZhCN) {
        welcomeText = `您好！我是您的 **AI 投资市场导师**。\n\n我在此协助您学习股票投资基础概念、解读技术指标图表，以及建立严谨的风险管理原则。\n\n您可以随时在下方输入任何问题，或点击精选主题开始！`;
      } else {
        welcomeText = `Hello! I'm your **AI Market Tutor**.\n\nI'm here to help you learn the fundamentals of stock market investing, understand technical charts, and master risk management.\n\nAsk me any question or choose a topic below to get started!`;
      }
    }

    const initialMsgs: AIMessage[] = [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: welcomeText,
        timestamp: Date.now()
      }
    ];

    setMessages(initialMsgs);

    // If an initial prompt was provided, auto-trigger it
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim(), initialMsgs);
    }
  }, [stock?.ticker, language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, currentMsgs: AIMessage[] = messages) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMessage: AIMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    const newMessages = [...currentMsgs, userMessage];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      const reply = await aiTutorService.sendChatMessage(newMessages, stockContext);

      const assistantMessage: AIMessage = {
        id: 'asst-' + Date.now(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: '⚠️ I encountered an error retrieving insights. Please check your network connection or API settings.',
          timestamp: Date.now(),
          error: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (stock) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: `Chat cleared. Ready to explore **${stock.name} (${stock.ticker})**! What questions do you have?`,
          timestamp: Date.now()
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'Chat cleared. Ask me anything about stock market concepts, charts, or indicators!',
          timestamp: Date.now()
        }
      ]);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Basic Markdown-to-HTML parser for formatted responses
  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className={`font-bold ${isLight ? 'text-black' : 'text-white'}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className={`italic ${isLight ? 'text-[#444444]' : 'text-slate-300'}`}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className={`px-1 py-0.5 rounded font-mono text-[11px] ${
          isLight ? 'bg-[#E5E5EA] text-[#6B21A8]' : 'bg-navy-950 text-purple-300'
        }`}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return <h3 key={idx} className={`text-sm font-bold mt-2 mb-1 ${isLight ? 'text-black' : 'text-white'}`}>{formatInline(line.slice(4))}</h3>;
      }
      // Header 2
      if (line.startsWith('## ')) {
        return <h2 key={idx} className={`text-base font-bold mt-2.5 mb-1.5 ${isLight ? 'text-black' : 'text-white'}`}>{formatInline(line.slice(3))}</h2>;
      }
      // Blockquote / Caution callout
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className={`border-l-2 px-3 py-1.5 rounded-r-xl my-2 text-[12px] ${
            isLight ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-gold-500/60 bg-gold-500/10 text-gold-300'
          }`}>
            {formatInline(line.slice(2))}
          </blockquote>
        );
      }
      // Bullet list item
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className={`ml-4 list-disc text-xs my-0.5 leading-relaxed ${isLight ? 'text-[#2C2C2E]' : 'text-slate-200'}`}>
            {formatInline(line.slice(2))}
          </li>
        );
      }
      // Numbered list item
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className={`flex gap-2 text-xs my-0.5 leading-relaxed ${isLight ? 'text-[#2C2C2E]' : 'text-slate-200'}`}>
            <span className={`font-bold shrink-0 ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>{numMatch[1]}.</span>
            <span>{formatInline(numMatch[2])}</span>
          </div>
        );
      }
      // Empty line spacer
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Normal paragraph
      return (
        <p key={idx} className={`text-xs leading-relaxed my-0.5 ${isLight ? 'text-[#1C1C1E]' : 'text-slate-200'}`}>
          {formatInline(line)}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in p-0 sm:p-4">
      <div className={`w-full max-w-lg border rounded-t-3xl sm:rounded-3xl flex flex-col h-[85vh] sm:h-[80vh] shadow-2xl overflow-hidden animate-slide-up transition-colors duration-200 ${
        isLight ? 'bg-white border-[rgba(0,0,0,0.12)] text-[#000000]' : 'bg-navy-900 border-navy-800 text-white'
      }`}>
        
        {/* Header Bar */}
        <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 transition-colors ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/90 border-navy-800/80'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>AI Market Tutor</h3>
                {geminiApiKey ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{geminiModel || 'gemini-2.5-flash'}</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-full font-mono font-medium">
                    Educational Engine
                  </span>
                )}
              </div>
              <p className={`text-[11px] ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                {stock ? (
                  <span className="flex items-center gap-1 font-mono">
                    <strong className={isLight ? 'text-black' : 'text-slate-200'}>{stock.ticker}</strong>
                    <span>•</span>
                    <span>{stock.currencySymbol || '$'}{stock.price.toFixed(2)}</span>
                    <span>({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                  </span>
                ) : (
                  'Investing & Technical Analysis Guide'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              title={geminiApiKey ? 'Gemini Key Connected' : 'Connect Gemini API Key'}
              className={`p-2 rounded-xl transition ${
                geminiApiKey 
                  ? 'text-emerald-500 hover:bg-black/5 dark:hover:bg-navy-800' 
                  : 'text-purple-500 hover:bg-black/5 dark:hover:bg-navy-800'
              }`}
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetChat}
              title="Clear Conversation"
              className={`p-2 rounded-xl transition ${
                isLight ? 'text-[#8E8E93] hover:text-black hover:bg-[#E5E5EA]' : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition ${
                isLight ? 'text-[#8E8E93] hover:text-black hover:bg-[#E5E5EA]' : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Key Banner / Connector */}
        {!geminiApiKey && !showKeyInput && (
          <div className={`px-4 py-1.5 border-b flex items-center justify-between text-[11px] shrink-0 ${
            isLight 
              ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)] text-[#666666]' 
              : 'bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border-purple-500/20 text-purple-200'
          }`}>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9500] shrink-0" />
              <span>Smart Market Tutor Active</span>
            </span>
            <button
              onClick={() => setShowKeyInput(true)}
              className="text-[10px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-600 dark:text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-lg font-medium cursor-pointer transition flex items-center gap-1"
            >
              <Key className="w-2.5 h-2.5" />
              <span>Connect Free Gemini Key</span>
            </button>
          </div>
        )}

        {showKeyInput && (
          <div className={`p-3 border-b text-xs space-y-2 shrink-0 animate-fade-in ${
            isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)] text-[#333333]' : 'bg-navy-950 border-purple-500/30 text-slate-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1.5 font-bold text-[11px] ${isLight ? 'text-black' : 'text-white'}`}>
                <Key className="w-3.5 h-3.5 text-purple-500" />
                <span>Connect Free Google Gemini Key</span>
              </div>
              <button 
                onClick={() => setShowKeyInput(false)} 
                className={`p-1 rounded-lg ${isLight ? 'text-[#8E8E93] hover:text-black' : 'text-slate-400 hover:text-white'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className={`text-[11px] leading-tight ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
              Connect your own free API key from Google AI Studio for live, unrestricted conversational AI.
            </p>
            <div className="flex gap-1.5">
              <input
                type="password"
                value={inlineKey}
                onChange={(e) => setInlineKey(e.target.value)}
                placeholder="Paste Gemini key (AIzaSy...)"
                className={`flex-1 rounded-xl px-2.5 py-1.5 text-xs font-mono focus:outline-none border ${
                  isLight 
                    ? 'bg-white border-[rgba(0,0,0,0.15)] text-black placeholder:text-slate-400 focus:border-purple-500' 
                    : 'bg-navy-900 border-navy-700 text-white placeholder:text-slate-600 focus:border-purple-500'
                }`}
              />
              <button
                type="button"
                onClick={handleSaveInlineKey}
                disabled={isTestingKey}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-[11px] disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {isTestingKey ? 'Testing...' : 'Save & Connect'}
              </button>
            </div>
            {keyStatus && (
              <div className={`text-[10px] ${keyStatus.startsWith('✓') ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                {keyStatus}
              </div>
            )}
            <div className="flex justify-between items-center text-[10px]">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Get free key at Google AI Studio</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              {geminiApiKey && (
                <button
                  onClick={() => {
                    setGeminiApiKey('');
                    setInlineKey('');
                    setKeyStatus('Key disconnected.');
                  }}
                  className={`transition ${isLight ? 'text-[#8E8E93] hover:text-[#FF3B30]' : 'text-slate-500 hover:text-danger-400'}`}
                >
                  Disconnect Key
                </button>
              )}
            </div>
          </div>
        )}

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                    isLight 
                      ? 'bg-purple-500/15 border-purple-500/25 text-purple-600' 
                      : 'bg-purple-500/20 border-purple-400/40 text-purple-300'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs relative group ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                      : msg.error
                      ? isLight ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-none' : 'bg-danger-950/60 border border-danger-700/60 text-danger-200 rounded-tl-none'
                      : isLight ? 'bg-[#F2F2F7] border border-[rgba(0,0,0,0.06)] text-[#1C1C1E] rounded-tl-none' : 'bg-navy-950/90 border border-navy-800/90 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <div>
                      {renderFormattedContent(msg.content)}
                      
                      {/* Copy button */}
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className={`mt-2 text-[10px] flex items-center gap-1 transition ${
                          isLight ? 'text-[#8E8E93] hover:text-black' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#34C759]" />
                            <span className="text-[#34C759]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy insight</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                    isLight ? 'bg-[#E5E5EA] border-[rgba(0,0,0,0.1)] text-[#666666]' : 'bg-navy-800 border-navy-700 text-slate-300'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 items-start">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                isLight ? 'bg-purple-500/15 border-purple-500/25 text-purple-600' : 'bg-purple-500/20 border-purple-400/40 text-purple-300'
              }`}>
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className={`border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm ${
                isLight ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.06)]' : 'bg-navy-950/90 border-navy-800'
              }`}>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150" />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-300" />
                <span className={`text-[11px] font-mono ml-2 ${isLight ? 'text-[#666666]' : 'text-slate-400'}`}>
                  Analyzing market context...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 1-Tap Quick Prompt Chips */}
        <div className={`px-3 pt-2 pb-1 border-t shrink-0 ${
          isLight ? 'bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]' : 'bg-navy-950/60 border-navy-800/80'
        }`}>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((qp) => (
              <button
                key={qp.id}
                disabled={isLoading}
                onClick={() => handleSendMessage(qp.prompt)}
                className={`shrink-0 text-[11px] px-2.5 py-1 rounded-xl transition flex items-center gap-1 active:scale-95 disabled:opacity-50 border cursor-pointer ${
                  isLight 
                    ? 'bg-white hover:bg-[#F2F2F7] border-[rgba(0,0,0,0.1)] text-[#000000] shadow-xs' 
                    : 'bg-navy-900 hover:bg-purple-950/80 border-navy-800 hover:border-purple-500/40 text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span>{qp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form Bar */}
        <div className={`p-3 border-t shrink-0 ${
          isLight ? 'bg-white border-[rgba(0,0,0,0.08)]' : 'bg-navy-950 border-navy-800'
        }`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={stock ? `Ask about ${stock.ticker} charts, RSI, risk...` : 'Ask anything about investing...'}
              disabled={isLoading}
              className={`flex-1 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none transition border ${
                isLight 
                  ? 'bg-[#F2F2F7] border-[rgba(0,0,0,0.12)] text-black placeholder:text-slate-400 focus:border-purple-500' 
                  : 'bg-navy-900 border-navy-700/80 text-white placeholder:text-slate-500 focus:border-purple-500'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center transition disabled:opacity-40 disabled:pointer-events-none shrink-0 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Educational Compliance Notice */}
          <div className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] px-1 ${
            isLight ? 'border-[rgba(0,0,0,0.06)] text-[#8E8E93]' : 'border-navy-900 text-slate-500'
          }`}>
            <span className="flex items-center gap-1">
              <ShieldAlert className={`w-3 h-3 shrink-0 ${isLight ? 'text-[#FF9500]' : 'text-gold-400'}`} />
              Educational Tutor • Not financial advice
            </span>
            <button
              onClick={() => {
                onClose();
                setActiveTab('settings');
              }}
              className="text-purple-600 dark:text-purple-400 hover:underline transition flex items-center gap-0.5"
            >
              <span>API Settings</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
