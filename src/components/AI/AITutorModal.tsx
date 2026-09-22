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
  MessageSquare
} from 'lucide-react';
import { StockQuote } from '../../types/stock';
import { aiTutorService, AIMessage, GroundedStockContext, QuickPrompt } from '../../services/aiTutorService';
import { useSettingsStore } from '../../store/settingsStore';

interface Props {
  stock?: StockQuote | null;
  initialPrompt?: string;
  onClose: () => void;
}

export const AITutorModal: React.FC<Props> = ({ stock, initialPrompt, onClose }) => {
  const { geminiModel, setActiveTab } = useSettingsStore();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stockContext: GroundedStockContext | undefined = stock 
    ? aiTutorService.buildStockContext(stock) 
    : undefined;

  const quickPrompts: QuickPrompt[] = stock 
    ? aiTutorService.getQuickPrompts(stock) 
    : [
        { id: 'rsi_explain', label: 'How does RSI work?', prompt: 'Explain how the Relative Strength Index (RSI) works for beginners, and how to spot oversold vs overbought conditions.' },
        { id: 'macd_explain', label: 'What is MACD?', prompt: 'What is the MACD indicator? How do moving average crossovers help traders understand momentum?' },
        { id: 'dca_explain', label: 'Dollar-Cost Averaging', prompt: 'What is Dollar-Cost Averaging (DCA), and why is it recommended for beginner investors?' },
        { id: 'pe_explain', label: 'Explain P/E Ratio', prompt: 'How does the Price-to-Earnings (P/E) ratio help investors evaluate whether a stock is cheap or expensive?' }
      ];

  // Initialize conversation
  useEffect(() => {
    let welcomeText = '';
    if (stock) {
      welcomeText = `Hello! I'm your **Gemini AI Market Tutor**.\n\nI'm looking at live market data for **${stock.name} (${stock.ticker})**, currently trading at **${stock.currencySymbol || '$'}${stock.price.toFixed(2)}**.\n\nYou can ask me about its **RSI (${stock.indicators.rsi.toFixed(1)})**, the **MACD momentum**, what moving averages suggest, or how recent news impacts the company. What would you like to explore?`;
    } else {
      welcomeText = `Hello! I'm your **Gemini AI Market Tutor**.\n\nI'm here to help you learn the fundamentals of stock market investing, understand technical charts, and master risk management.\n\nAsk me any question or choose a topic below to get started!`;
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
  }, [stock?.ticker]);

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
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-bold text-white mt-2 mb-1">{formatInline(line.slice(4))}</h3>;
      }
      // Header 2
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-base font-bold text-white mt-2.5 mb-1.5">{formatInline(line.slice(3))}</h2>;
      }
      // Blockquote / Caution callout
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-gold-500/60 bg-gold-500/10 px-3 py-1.5 rounded-r-xl my-2 text-[12px] text-gold-300">
            {formatInline(line.slice(2))}
          </blockquote>
        );
      }
      // Bullet list item
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 text-xs my-0.5 leading-relaxed">
            {formatInline(line.slice(2))}
          </li>
        );
      }
      // Numbered list item
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-200 my-1 leading-relaxed">
            <span className="font-mono text-purple-400 font-bold">{numMatch[1]}.</span>
            <span>{formatInline(numMatch[2])}</span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Normal paragraph
      return (
        <p key={idx} className="text-xs text-slate-300 my-0.5 leading-relaxed">
          {formatInline(line)}
        </p>
      );
    });
  };

  // Helper for inline markdown: bold, italic, code
  const formatInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-slate-300 italic">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-navy-950 px-1 py-0.5 rounded text-purple-300 font-mono text-[11px]">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-fade-in p-0 sm:p-4">
      <div className="w-full max-w-lg bg-navy-900 border border-navy-800 rounded-t-3xl sm:rounded-3xl flex flex-col h-[85vh] sm:h-[80vh] shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header Bar */}
        <div className="px-4 py-3 bg-navy-950/90 border-b border-navy-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">AI Market Tutor</h3>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded-full font-mono font-medium">
                  {geminiModel || 'gemini-2.5-flash'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {stock ? (
                  <span className="flex items-center gap-1 font-mono">
                    <strong className="text-slate-200">{stock.ticker}</strong>
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
              onClick={handleResetChat}
              title="Clear Conversation"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-navy-800 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

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
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs relative group ${
                    isUser
                      ? 'bg-gradient-to-r from-growth-600 to-emerald-700 text-white rounded-tr-none'
                      : msg.error
                      ? 'bg-danger-950/60 border border-danger-700/60 text-danger-200 rounded-tl-none'
                      : 'bg-navy-950/90 border border-navy-800/90 text-slate-200 rounded-tl-none'
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
                        className="mt-2 text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-growth-400" />
                            <span className="text-growth-400">Copied</span>
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
                  <div className="w-7 h-7 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-navy-950/90 border border-navy-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150" />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300" />
                <span className="text-[11px] text-slate-400 font-mono ml-2">Analyzing market context...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 1-Tap Quick Prompt Chips */}
        <div className="px-3 pt-2 pb-1 border-t border-navy-800/80 bg-navy-950/60 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((qp) => (
              <button
                key={qp.id}
                disabled={isLoading}
                onClick={() => handleSendMessage(qp.prompt)}
                className="shrink-0 text-[11px] bg-navy-900 hover:bg-purple-950/80 border border-navy-800 hover:border-purple-500/40 text-slate-300 hover:text-white px-2.5 py-1 rounded-xl transition flex items-center gap-1 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{qp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form Bar */}
        <div className="p-3 bg-navy-950 border-t border-navy-800 shrink-0">
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
              className="flex-1 bg-navy-900 border border-navy-700/80 focus:border-purple-500 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center transition disabled:opacity-40 disabled:pointer-events-none shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Educational Compliance Notice */}
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-navy-900 text-[10px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-gold-400 shrink-0" />
              Educational Tutor • Not financial advice
            </span>
            <button
              onClick={() => {
                onClose();
                setActiveTab('settings');
              }}
              className="text-purple-400 hover:text-purple-300 transition flex items-center gap-0.5"
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
