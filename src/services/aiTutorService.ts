import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { StockQuote } from '../types/stock';
import { generateTimingSignal } from './signalEngine';
import { StockSignal } from '../types/signal';
import { newsService } from './newsService';
import { NewsArticle } from '../types/news';
import { useSettingsStore } from '../store/settingsStore';
import { usePortfolioStore } from '../store/portfolioStore';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  error?: boolean;
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
}

export interface GroundedStockContext {
  ticker: string;
  name: string;
  exchange: string;
  country: string;
  currencySymbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  marketCap: string;
  peRatio: number;
  indicators: {
    rsi: number;
    macd: {
      macdLine: number;
      signalLine: number;
      histogram: number;
      crossover: 'bullish' | 'bearish' | 'neutral';
    };
    sma20: number;
    sma50: number;
    sma200: number;
    volumeSurgeRatio: number;
  };
  signal: {
    action: string;
    riskLevel: string;
    title: string;
    summary: string;
    beginnerAnalogy: string;
  };
  newsHeadlines: string[];
  userPosition?: {
    shares: number;
    avgPrice: number;
    totalInvested: number;
    unrealizedPL: number;
    unrealizedPLPercent: number;
  };
}

class AITutorService {
  /**
   * Build live structured market context for a stock
   */
  public buildStockContext(stock: StockQuote): GroundedStockContext {
    const signal: StockSignal = generateTimingSignal(stock);
    const articles: NewsArticle[] = newsService.getArticlesForStock(stock.ticker);
    const newsHeadlines = articles.slice(0, 3).map((a: NewsArticle) => `${a.headline} (${a.source})`);

    const positions = usePortfolioStore.getState().positions;
    const pos = positions.find(p => p.ticker.toUpperCase() === stock.ticker.toUpperCase());

    let userPosition: GroundedStockContext['userPosition'];
    if (pos) {
      const currentVal = pos.shares * stock.price;
      const invested = pos.shares * pos.averageBuyPrice;
      const diff = currentVal - invested;
      const pct = invested > 0 ? (diff / invested) * 100 : 0;
      userPosition = {
        shares: pos.shares,
        avgPrice: pos.averageBuyPrice,
        totalInvested: Number(invested.toFixed(2)),
        unrealizedPL: Number(diff.toFixed(2)),
        unrealizedPLPercent: Number(pct.toFixed(2))
      };
    }

    const firstReasonAnalogy = signal.reasons && signal.reasons.length > 0 
      ? signal.reasons[0].plainEnglishAnalogy 
      : '';

    return {
      ticker: stock.ticker,
      name: stock.name,
      exchange: stock.exchange,
      country: stock.country,
      currencySymbol: stock.currencySymbol || '$',
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      high: stock.high,
      low: stock.low,
      marketCap: stock.marketCap,
      peRatio: stock.peRatio,
      indicators: {
        rsi: stock.indicators.rsi,
        macd: {
          macdLine: stock.indicators.macd.macdLine,
          signalLine: stock.indicators.macd.signalLine,
          histogram: stock.indicators.macd.histogram,
          crossover: stock.indicators.macd.crossover
        },
        sma20: stock.indicators.sma20,
        sma50: stock.indicators.sma50,
        sma200: stock.indicators.sma200,
        volumeSurgeRatio: stock.indicators.volumeSurgeRatio
      },
      signal: {
        action: signal.action,
        riskLevel: signal.riskLevel,
        title: signal.title,
        summary: signal.summary,
        beginnerAnalogy: firstReasonAnalogy
      },
      newsHeadlines,
      userPosition
    };
  }

  /**
   * Generates tailored 1-tap quick prompts based on stock indicators
   */
  public getQuickPrompts(stock: StockQuote, lang: string = 'en'): QuickPrompt[] {
    const signal: StockSignal = generateTimingSignal(stock, lang as any);
    const curr = stock.currencySymbol || '$';

    if (lang === 'ko') {
      return [
        {
          id: 'why_signal',
          label: `${stock.ticker} 신호 분석`,
          prompt: `${stock.ticker}의 현재 타이밍 신호가 ${signal.action} (${signal.title})인 이유를 초보자 눈높이에서 쉽게 설명해 주세요. 어떤 보조지표가 이 신호를 유발했는지와 주의해야 할 리스크를 짚어주세요.`
        },
        {
          id: 'explain_rsi_macd',
          label: 'RSI & MACD 보조지표 설명',
          prompt: `${stock.ticker}의 RSI (${stock.indicators.rsi.toFixed(1)})와 MACD (${stock.indicators.macd.crossover}) 지표를 초보자가 이해하기 쉬운 일상 비유로 설명해 주세요.`
        },
        {
          id: 'bull_bear',
          label: '상승 호재 vs 하락 리스크',
          prompt: `${stock.ticker}에 대한 객관적인 분석을 부탁합니다: 상승 기대 요인(Bull Case)과 주가 하락 위험 요인(Bear Case)은 각각 무엇인가요?`
        },
        {
          id: 'dca_strategy',
          label: '분할 매수(DCA) 전략',
          prompt: `초보 투자자가 현재가 ${curr}${stock.price}에서 ${stock.ticker}를 분할 매수(DCA)하고자 할 때 어떤 원칙, 타임라인, 손절 기준을 지켜야 하나요?`
        },
        {
          id: 'news_impact',
          label: '뉴스 및 호재/악재 영향',
          prompt: `최근 시장 동향과 기업 관련 이슈가 ${stock.ticker}의 단기 모멘텀과 장기 실적에 어떤 영향을 주나요?`
        }
      ];
    }

    return [
      {
        id: 'why_signal',
        label: `Why is ${stock.ticker} ${signal.action}?`,
        prompt: `Can you explain why the timing signal for ${stock.ticker} is currently rated ${signal.action} (${signal.title})? Break down what indicators triggered this and what risks a beginner should consider.`
      },
      {
        id: 'explain_rsi_macd',
        label: 'Explain RSI & MACD',
        prompt: `Look at ${stock.ticker}'s RSI (${stock.indicators.rsi}) and MACD (${stock.indicators.macd.crossover}). Explain in simple beginner terms what these two indicators mean right now using real-world analogies.`
      },
      {
        id: 'bull_bear',
        label: 'Bull vs Bear Cases',
        prompt: `Provide an objective breakdown of ${stock.ticker}: What is the Bull Case (reasons for potential upside) versus the Bear Case (risks or reasons for decline)?`
      },
      {
        id: 'dca_strategy',
        label: 'How to DCA this stock?',
        prompt: `If a beginner wanted to Dollar-Cost Average (DCA) into ${stock.ticker} at its current price of ${curr}${stock.price}, what strategy, timeline, and risk boundaries would you teach them?`
      },
      {
        id: 'news_impact',
        label: 'News & Catalyst Impact',
        prompt: `How do recent market developments and company catalysts impact ${stock.ticker}'s short-term momentum and long-term business outlook?`
      }
    ];
  }

  /**
   * Send chat message to Gemini 2.5 Flash
   */
  public async sendChatMessage(
    messages: AIMessage[],
    stockContext?: GroundedStockContext
  ): Promise<string> {
    const settings = useSettingsStore.getState();
    const customApiKey = settings.geminiApiKey?.trim();
    const targetModel = settings.geminiModel?.trim() || 'gemini-2.5-flash';

    // Strategy 1: Native Android CapacitorHttp with Direct API Key
    if (Capacitor.isNativePlatform() && customApiKey) {
      try {
        const response = await this.callGoogleDirect(customApiKey, targetModel, messages, stockContext);
        if (response) return response;
      } catch (err: any) {
        console.warn('Native direct call failed, attempting proxy', err);
      }
    }

    // Strategy 2: Web Serverless /api/gemini or Native Proxy via CapacitorHttp
    try {
      const payload = {
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stockContext,
        customApiKey: customApiKey || undefined,
        model: targetModel
      };

      if (Capacitor.isNativePlatform()) {
        // Native Android hitting deployed serverless backend
        const res = await CapacitorHttp.post({
          url: 'https://stock-tracker-app-tau-ten.vercel.app/api/gemini',
          headers: { 'Content-Type': 'application/json' },
          data: payload
        });

        if (res.status === 200 && res.data) {
          const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          if (parsed.text) return parsed.text;
        }
      } else {
        // Web browser environment
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text) return data.text;
        } else {
          const errData = await res.json().catch(() => null);
          if (errData?.error === 'NO_API_KEY') {
            return this.generateEducationalOfflineResponse(stockContext, messages[messages.length - 1]?.content, true);
          }
        }
      }
    } catch (netErr) {
      console.warn('Failed to reach Gemini proxy, using educational fallback', netErr);
    }

    // Strategy 3: Graceful Educational Synthesis Fallback
    return this.generateEducationalOfflineResponse(stockContext, messages[messages.length - 1]?.content);
  }

  /**
   * Direct call to Google Gemini REST endpoint (used on Android with user key or direct web)
   */
  private async callGoogleDirect(
    apiKey: string,
    model: string,
    messages: AIMessage[],
    stockContext?: GroundedStockContext
  ): Promise<string | null> {
    const systemPrompt = `You are the InvestLearn AI Market Tutor, a friendly, patient, and knowledgeable educational assistant for beginner stock market investors.
Your mission is to teach investing: explain charts, translate technical indicators (RSI, MACD, Moving Averages) into plain English with real-world analogies, explain news catalysts, and teach risk management.
CRITICAL COMPLIANCE:
1. STRICTLY EDUCATIONAL: You are NOT a licensed financial advisor. NEVER give direct buy or sell orders.
2. SCENARIO ANALYSIS: Always balance perspectives into Bullish Scenarios vs Bearish Risks.
3. TEACH CONCEPTS: Explain *why* indicators behave as they do.
4. EMPHASIZE PRUDENCE: Mention Dollar-Cost Averaging (DCA), diversification, and risk management.
5. FORMATTING: Use clean markdown bullet points, bold highlights, and short paragraphs suitable for mobile reading.`;

    let contextPrefix = '';
    if (stockContext) {
      contextPrefix = `[LIVE STOCK CONTEXT: ${stockContext.name} (${stockContext.ticker}) on ${stockContext.exchange} | Price: ${stockContext.currencySymbol}${stockContext.price} (${stockContext.changePercent}%) | RSI: ${stockContext.indicators.rsi} | MACD: ${stockContext.indicators.macd.crossover} | Signal: ${stockContext.signal.action} (${stockContext.signal.title})]\n\n`;
    }

    const formattedContents = messages.map((m, idx) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: idx === 0 && m.role === 'user' && contextPrefix ? contextPrefix + m.content : m.content }]
    }));

    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200
      }
    };

    const res = await CapacitorHttp.post({
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      headers: { 'Content-Type': 'application/json' },
      data: body
    });

    if (res.status === 200 && res.data) {
      const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      return parsed?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
    return null;
  }

  /**
   * Test API key connectivity
   */
  public async testConnection(apiKey: string, model: string = 'gemini-2.5-flash'): Promise<{ success: boolean; message: string }> {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      return { success: false, message: 'Please enter a valid Gemini API key.' };
    }

    try {
      const payload = {
        prompt: 'Hello! Please introduce yourself in one short sentence as the InvestLearn AI Market Tutor.',
        customApiKey: cleanKey,
        model
      };

      if (Capacitor.isNativePlatform()) {
        const res = await CapacitorHttp.post({
          url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`,
          headers: { 'Content-Type': 'application/json' },
          data: {
            contents: [{ role: 'user', parts: [{ text: 'Hello! Please introduce yourself in one short sentence as the InvestLearn AI Market Tutor.' }] }]
          }
        });

        if (res.status === 200) {
          const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          return {
            success: true,
            message: `✓ Connected to ${model}! AI Response: "${text?.slice(0, 100)}..."`
          };
        } else {
          return { success: false, message: `Google API returned status ${res.status}. Please check your key.` };
        }
      }

      // Web proxy test
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.text) {
        return {
          success: true,
          message: `✓ Connected to ${data.model || model}! AI Response: "${data.text.slice(0, 100)}..."`
        };
      } else {
        return {
          success: false,
          message: data.message || `Error connecting to Gemini (${res.status})`
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `Connection failed: ${err.message || 'Network error'}`
      };
    }
  }

  /**
   * Intelligent offline educational generator if cloud connection is unavailable
   */
  private generateEducationalOfflineResponse(
    ctx?: GroundedStockContext,
    userQuery?: string,
    isKeyPrompt?: boolean
  ): string {
    if (!ctx) {
      return `### 🎓 Welcome to the AI Market Tutor!

I am your educational investing assistant. You can ask me to explain:
- **Technical Indicators**: How RSI, MACD, and Moving Averages measure momentum and trends.
- **Fundamental Concepts**: What P/E ratio, market cap, and earnings reports reveal about a company.
- **Risk Management**: Why position sizing, stop losses, and Dollar-Cost Averaging protect your capital.

*Tip: Connect your free Gemini API key in Settings for unlimited live AI conversations!*`;
    }

    const { ticker, name, price, currencySymbol, indicators, signal } = ctx;
    const rsiDesc = indicators.rsi > 70 
      ? `overbought (>70), meaning buyer enthusiasm has pushed prices high rapidly and short-term exhaustion is possible.` 
      : indicators.rsi < 30 
      ? `oversold (<30), meaning intense selling pressure has created potential value or rubber-band rebound conditions.` 
      : `in the neutral zone (${indicators.rsi.toFixed(1)}), reflecting balanced buying and selling forces.`;

    const macdDesc = indicators.macd.crossover === 'bullish'
      ? `in a **bullish crossover**, where short-term momentum is rising faster than longer-term trends.`
      : indicators.macd.crossover === 'bearish'
      ? `in a **bearish crossover**, where downward price action is accelerating.`
      : `moving in neutral alignment.`;

    return `### 🎓 Educational Market Breakdown: **${name} (${ticker})**

**Current Price**: ${currencySymbol}${price.toFixed(2)} | **System Stance**: **${signal.action}** (${signal.title})

Here is how to interpret today's live technical setup:

1. **RSI (Relative Strength Index: ${indicators.rsi.toFixed(1)})**
   ${ticker}'s RSI is currently ${rsiDesc}

2. **MACD Momentum (${indicators.macd.crossover.toUpperCase()})**
   The MACD is currently ${macdDesc}

3. **Key Beginner Analogy**
   ${signal.beginnerAnalogy}

4. **Bull vs. Bear Scenarios**
   - **Bullish Outlook**: If buyers maintain volume above the 50-day moving average (${currencySymbol}${indicators.sma50.toFixed(2)}), upside continuation remains supported.
   - **Bearish Caution**: A break below the recent low could trigger additional stop-loss cascades.

> ⚠️ **Educational Reminder**: Technical indicators measure historical probabilities, never guaranteed outcomes. Always use proper position sizing and never invest funds you cannot afford to risk.
${isKeyPrompt ? '\n\n*💡 Note: To chat dynamically with Gemini 2.5 Flash, you can add your free Gemini API key in App Settings.*' : ''}`;
  }
}

export const aiTutorService = new AITutorService();
