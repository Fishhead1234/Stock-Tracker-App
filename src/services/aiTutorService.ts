import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { StockQuote } from '../types/stock';
import { generateTimingSignal } from './signalEngine';
import { StockSignal } from '../types/signal';
import { newsService } from './newsService';
import { NewsArticle } from '../types/news';
import { useSettingsStore } from '../store/settingsStore';
import { usePortfolioStore } from '../store/portfolioStore';
import { useLanguageStore } from '../store/languageStore';

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

    if (lang === 'zh-TW') {
      return [
        {
          id: 'why_signal',
          label: `${stock.ticker} 時機訊號解析`,
          prompt: `請問為什麼 ${stock.ticker} 目前的時機評定為 ${signal.action} (${signal.title})？請用初學者的角度說明哪些技術指標觸發了這個訊號，以及需要留意的下行風險。`
        },
        {
          id: 'explain_rsi_macd',
          label: 'RSI 與 MACD 指標解析',
          prompt: `請查看 ${stock.ticker} 目前的 RSI (${stock.indicators.rsi.toFixed(1)}) 與 MACD (${stock.indicators.macd.crossover})，請用通俗易懂的日常比喻為新手解釋這兩個指標當前代表的意義。`
        },
        {
          id: 'dip_buying',
          label: '下跌可以加碼買進嗎？',
          prompt: `如果 ${stock.ticker} 目前正在拉回或下跌，新手現在適合加碼買進 (向下攤平) 嗎？在什麼條件下加碼才安全？請教導分批進場與風險控管原則。`
        },
        {
          id: 'dca_strategy',
          label: '定期定額 (DCA) 策略',
          prompt: `初學者如果想以目前的股價 ${curr}${stock.price} 開始定期定額 (DCA) 投資 ${stock.ticker}，應該遵循什麼進場節奏與停損邊界？`
        },
        {
          id: 'bull_bear',
          label: '看多契機 vs 看空風險',
          prompt: `請客觀分析 ${stock.ticker}：潛在的上漲契機 (Bull Case) 與可能面臨的回檔風險 (Bear Case) 分別是什麼？`
        }
      ];
    }

    if (lang === 'zh-CN') {
      return [
        {
          id: 'why_signal',
          label: `${stock.ticker} 时机信号解析`,
          prompt: `请问为什么 ${stock.ticker} 目前的时机评定为 ${signal.action} (${signal.title})？请用初学者的角度说明哪些技术指标触发了这个信号，以及需要留意的下行风险。`
        },
        {
          id: 'explain_rsi_macd',
          label: 'RSI 与 MACD 指标解析',
          prompt: `请查看 ${stock.ticker} 目前的 RSI (${stock.indicators.rsi.toFixed(1)}) 与 MACD (${stock.indicators.macd.crossover})，请用通俗易懂的日常比喻为新手解释这两个指标当前代表的意义。`
        },
        {
          id: 'dip_buying',
          label: '下跌可以加仓买入吗？',
          prompt: `如果 ${stock.ticker} 目前正在回调或下跌，新手现在适合加仓买入 (补仓/摊平) 吗？在什么条件下加仓才安全？请教导分批建仓与风险控制原则。`
        },
        {
          id: 'dca_strategy',
          label: '定投 (DCA) 策略',
          prompt: `初学者如果想以目前的股价 ${curr}${stock.price} 开始定投 (DCA) 投资 ${stock.ticker}，应该遵循什么建仓节奏与止损边界？`
        },
        {
          id: 'bull_bear',
          label: '看多机会 vs 看空风险',
          prompt: `请客观分析 ${stock.ticker}：潜在的上涨机会 (Bull Case) 与可能面临的回调风险 (Bear Case) 分别是什么？`
        }
      ];
    }

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
          id: 'dip_buying',
          label: '하락 시 추가 매수(물타기) 해도 될까요?',
          prompt: `${stock.ticker} 주가가 하락할 때 초보자가 추가 매수(분할 매수/물타기)를 해도 괜찮은지, 안전한 분할 매수 타이밍과 리스크 관리 원칙을 설명해 주세요.`
        },
        {
          id: 'dca_strategy',
          label: '적립식 분할 매수(DCA) 전략',
          prompt: `초보 투자자가 현재가 ${curr}${stock.price}에서 ${stock.ticker}를 분할 매수(DCA)하고자 할 때 어떤 원칙, 타임라인, 손절 기준을 지켜야 하나요?`
        },
        {
          id: 'bull_bear',
          label: '상승 호재 vs 하락 리스크',
          prompt: `${stock.ticker}에 대한 객관적인 분석을 부탁합니다: 상승 기대 요인(Bull Case)과 주가 하락 위험 요인(Bear Case)은 각각 무엇인가요?`
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
        prompt: `Look at ${stock.ticker}'s RSI (${stock.indicators.rsi.toFixed(1)}) and MACD (${stock.indicators.macd.crossover}). Explain in simple beginner terms what these two indicators mean right now using real-world analogies.`
      },
      {
        id: 'dip_buying',
        label: 'Should I buy more on drops?',
        prompt: `Does that mean I should buy more since ${stock.ticker} is dropping or pulling back? What rules, moving averages, and risk boundaries should a beginner check before averaging down?`
      },
      {
        id: 'dca_strategy',
        label: 'How to DCA this stock?',
        prompt: `If a beginner wanted to Dollar-Cost Average (DCA) into ${stock.ticker} at its current price of ${curr}${stock.price}, what strategy, timeline, and risk boundaries would you teach them?`
      },
      {
        id: 'bull_bear',
        label: 'Bull vs Bear Cases',
        prompt: `Provide an objective breakdown of ${stock.ticker}: What is the Bull Case (reasons for potential upside) versus the Bear Case (risks or reasons for decline)?`
      }
    ];
  }

  /**
   * Send chat message to Gemini 2.5 Flash / Fallbacks
   */
  public async sendChatMessage(
    messages: AIMessage[],
    stockContext?: GroundedStockContext
  ): Promise<string> {
    const settings = useSettingsStore.getState();
    const customApiKey = settings.geminiApiKey?.trim();
    const targetModel = settings.geminiModel?.trim() || 'gemini-2.5-flash';

    // Strategy 1: Direct Google API call if user configured a key (Native Capacitor or Web)
    if (customApiKey) {
      try {
        const response = await this.callGoogleDirect(customApiKey, targetModel, messages, stockContext);
        if (response) return response;
      } catch (err: any) {
        console.warn('Direct Gemini call failed, attempting proxy/fallback', err);
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
        const res = await CapacitorHttp.post({
          url: 'https://stocktrackerapp-two.vercel.app/api/gemini',
          headers: { 'Content-Type': 'application/json' },
          data: payload
        });

        if (res.status === 200 && res.data) {
          const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          if (parsed.text) return parsed.text;
        }
      } else {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text) return data.text;
        }
      }
    } catch (netErr) {
      console.warn('Failed to reach Gemini proxy, using educational synthesis engine', netErr);
    }

    // Strategy 3: Graceful, Deep Educational Synthesis Engine
    return this.generateEducationalOfflineResponse(stockContext, messages);
  }

  /**
   * Direct call to Google Gemini REST endpoint (used on Android or Web with user key)
   */
  private async callGoogleDirect(
    apiKey: string,
    model: string,
    messages: AIMessage[],
    stockContext?: GroundedStockContext
  ): Promise<string | null> {
    const lang = useLanguageStore.getState().language || 'en';
    const langInstruction = lang.startsWith('zh') 
      ? 'CRITICAL LANGUAGE: The user interface is set to Chinese. You MUST reply in fluent Chinese (Traditional Chinese if zh-TW, Simplified Chinese if zh-CN).'
      : lang === 'ko'
      ? 'CRITICAL LANGUAGE: Reply in fluent Korean.'
      : lang === 'ja'
      ? 'CRITICAL LANGUAGE: Reply in fluent Japanese.'
      : 'Reply in clear, accessible plain English.';

    const systemPrompt = `You are the InvestLearn AI Market Tutor, a friendly, patient, and knowledgeable educational assistant for beginner stock market investors.
Your mission is to teach investing: explain charts, translate technical indicators (RSI, MACD, Moving Averages) into plain English with real-world analogies, explain news catalysts, and teach risk management.
${langInstruction}
CRITICAL COMPLIANCE:
1. STRICTLY EDUCATIONAL: You are NOT a licensed financial advisor. NEVER give direct buy or sell orders.
2. SCENARIO ANALYSIS: Always balance perspectives into Bullish Scenarios vs Bearish Risks.
3. TEACH CONCEPTS: Explain *why* indicators behave as they do.
4. EMPHASIZE PRUDENCE: Mention Dollar-Cost Averaging (DCA), diversification, position sizing, and risk management.
5. FORMATTING: Use clean markdown bullet points, bold highlights, and short paragraphs suitable for mobile reading.`;

    let contextPrefix = '';
    if (stockContext) {
      contextPrefix = `[LIVE STOCK CONTEXT: ${stockContext.name} (${stockContext.ticker}) on ${stockContext.exchange} | Price: ${stockContext.currencySymbol}${stockContext.price} (${stockContext.changePercent}%) | RSI: ${stockContext.indicators.rsi} | MACD: ${stockContext.indicators.macd.crossover} | 50-day SMA: ${stockContext.currencySymbol}${stockContext.indicators.sma50} | 200-day SMA: ${stockContext.currencySymbol}${stockContext.indicators.sma200} | Signal: ${stockContext.signal.action} (${stockContext.signal.title})]\n\n`;
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
        maxOutputTokens: 1400
      }
    };

    // Candidate models in priority order
    const candidateModels = [model, 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'].filter((m, i, arr) => arr.indexOf(m) === i && !!m);

    for (const candModel of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${candModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
        let data: any = null;

        if (Capacitor.isNativePlatform()) {
          const res = await CapacitorHttp.post({
            url,
            headers: { 'Content-Type': 'application/json' },
            data: body
          });
          if (res.status === 200 && res.data) {
            data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          } else if (res.status === 404) {
            continue; // try next candidate model
          }
        } else {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (res.ok) {
            data = await res.json();
          } else if (res.status === 404) {
            continue;
          }
        }

        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return candidateText;
        }
      } catch (e) {
        console.warn(`Error attempting direct call with model ${candModel}:`, e);
      }
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

    const candidateModels = [model, 'gemini-2.0-flash', 'gemini-1.5-flash'].filter((m, i, arr) => arr.indexOf(m) === i && !!m);

    for (const candModel of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${candModel}:generateContent?key=${encodeURIComponent(cleanKey)}`;
        const body = {
          contents: [{ role: 'user', parts: [{ text: 'Hello! Please introduce yourself in one short sentence as the InvestLearn AI Market Tutor.' }] }]
        };

        let status = 0;
        let data: any = null;

        if (Capacitor.isNativePlatform()) {
          const res = await CapacitorHttp.post({
            url,
            headers: { 'Content-Type': 'application/json' },
            data: body
          });
          status = res.status;
          data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        } else {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          status = res.status;
          if (res.ok) {
            data = await res.json();
          }
        }

        if (status === 200 && data) {
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          return {
            success: true,
            message: `✓ Connected to ${candModel}! AI says: "${text?.slice(0, 100)}..."`
          };
        } else if (status === 404) {
          continue; // try next model
        } else {
          const errMsg = data?.error?.message || `Google API status ${status}`;
          return { success: false, message: `Key error: ${errMsg}` };
        }
      } catch (err: any) {
        console.warn(`Connection test failed for ${candModel}`, err);
      }
    }

    return {
      success: false,
      message: 'Could not connect to Gemini models. Please check your API key.'
    };
  }

  /**
   * Intelligent offline educational generator that dynamically understands user intent
   */
  public generateEducationalOfflineResponse(
    ctx?: GroundedStockContext,
    messagesOrQuery?: AIMessage[] | string,
    isKeyPrompt?: boolean
  ): string {
    const lang = useLanguageStore.getState().language || 'en';
    const isZh = lang === 'zh-TW' || lang === 'zh-CN';
    const isZhTW = lang === 'zh-TW';

    if (!ctx) {
      if (isZh) {
        return `### 🎓 歡迎使用 AI 投資導師！

我是您的股票教育智慧助理。您可以向我詢問：
- **技術指標解讀**：RSI、MACD 與移動平均線如何衡量動能與趨勢。
- **基本面觀念**：本益比 (P/E)、市值與財報如何評估企業價值。
- **風險管理**：部位規模控制、停損設置與定期定額 (DCA) 如何保護您的本金。

*提示：您可在設定中輸入免費的 Google Gemini API Key，即可啟用無限制的即時對話！*`;
      }

      return `### 🎓 Welcome to the AI Market Tutor!

I am your educational investing assistant. You can ask me to explain:
- **Technical Indicators**: How RSI, MACD, and Moving Averages measure momentum and trends.
- **Fundamental Concepts**: What P/E ratio, market cap, and earnings reports reveal about a company.
- **Risk Management**: Why position sizing, stop losses, and Dollar-Cost Averaging protect your capital.

*Tip: Connect your free Gemini API key in Settings for unlimited live AI conversations!*`;
    }

    const { ticker, name, price, changePercent, currencySymbol, indicators, signal, peRatio, marketCap } = ctx;
    const curr = currencySymbol || '$';

    const userMessages = Array.isArray(messagesOrQuery) 
      ? messagesOrQuery.filter(m => m.role === 'user') 
      : [];
    const userQuery = (Array.isArray(messagesOrQuery) 
      ? (userMessages[userMessages.length - 1]?.content || '') 
      : (messagesOrQuery || '')).trim();

    const q = userQuery.toLowerCase();

    const isAboveSma50 = price >= indicators.sma50;
    const isAboveSma200 = price >= indicators.sma200;
    const isEtf = name.toLowerCase().includes('etf') || ['VOO', 'SPY', 'QQQ', 'IVV', 'VTI', 'VT', 'DIA', 'IWM'].includes(ticker);

    // Intent 1: Dip buying / "Should I buy more since it's dropping" / Averaging down
    const isDipBuying = 
      q.includes('buy more') || 
      q.includes('buying more') || 
      q.includes('average down') || 
      q.includes('averaging down') || 
      q.includes('falling knife') ||
      q.includes('catch the fall') ||
      (q.includes('drop') && q.includes('buy')) ||
      (q.includes('dropping') && q.includes('buy')) ||
      (q.includes('fall') && q.includes('buy')) ||
      (q.includes('falling') && q.includes('buy')) ||
      (q.includes('dip') && q.includes('buy')) ||
      (q.includes('cheap') && q.includes('buy')) ||
      (q.includes('discount') && q.includes('buy')) ||
      q.includes('加碼') || q.includes('攤平') || q.includes('抄底') || q.includes('越跌越買') || q.includes('逢低買進') ||
      (q.includes('buy') && q.includes('more')) ||
      (q.includes('買') && (q.includes('跌') || q.includes('更多') || q.includes('低')));

    if (isDipBuying) {
      if (isZh) {
        return `### 📉 初學者指南：拉回下跌時「加碼攤平」的正確策略 —— **${name} (${ticker})**

當 **${ticker}** 出現拉回或下跌時，許多投資人常問：「既然跌了，我是不是應該買更多？」在金融市場中，這被稱為**「向下攤平 (Averaging Down)」**或**「逢低買進 (Buying the Dip)」**。

以下是成熟投資者在面對下跌時的客觀決策框架：

---

#### 1. 檢視 ${ticker} 當前的技術面現狀
- **當前股價**：${curr}${price.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)
- **50 日均線 (${curr}${indicators.sma50.toFixed(2)})**：${isAboveSma50 ? `目前股價依然維持在 50 日均線之上，這表明中期**多頭趨勢並未被破壞**，近期的下跌屬於上升趨勢中的「健康回檔整理」。` : `股價已跌破 50 日均線，顯示短期空方力道增強。下一個關鍵機構支撐位在 200 日均線 (${curr}${indicators.sma200.toFixed(2)})。`}
- **RSI 震盪動能 (${indicators.rsi.toFixed(1)})**：${indicators.rsi < 35 ? `RSI 已接近超賣區 (<35)，顯示短期拋售壓力巨大，歷史統計上常在此區間出現反彈機會。` : `RSI 目前處於中性平衡區 (${indicators.rsi.toFixed(1)})，意味著市場尚未進入非理性的恐慌拋售狀態。`}

---

#### 2. 下跌加碼的 4 大黃金準則
1. ⚠️ **切忌盲目「接落下的刀子 (Catching a Falling Knife)」**：
   僅僅因為價格比昨天便宜，絕不代表它明天不會再跌 5% 或 10%。成熟交易者會等待「拋售量能萎縮」且股價出現止跌紅 K 棒或底部整理型態時，才考慮進場。
2. 🏛️ **指數 ETF 與個別公司的本質差異**：
   ${isEtf 
     ? `因為 **${ticker} 是追蹤大盤的指數 ETF**（如標普 500 或納斯達克），成分股涵蓋眾多龍頭企業，長期破產風險幾乎為零。歷史證明，美股大盤在歷次危機後皆能重返新高，因此採用嚴格紀律的定期定額 (DCA) 分批逢低承接是勝率極高的策略。` 
     : `因為 **${ticker} 是單一個股**，您必須先查明「下跌的原因」：是受大盤拖累，還是公司基本面、營收財報出現惡化？對於競爭力衰退的單一公司盲目攤平，可能導致不可挽回的虧損。`}
3. 🪜 **分批進場法 (Tranche Strategy，絕不一次 All-in)**：
   若您決定逢低加碼，應將預備資金拆成 **3 等份**：
   - **第一批 (30%)**：在當前跌幅滿足點試探性建立底倉。
   - **第二批 (30%)**：若股價回測關鍵均線支撐 (${curr}${indicators.sma50.toFixed(2)}) 且出現止跌跡象時加碼。
   - **第三批 (40%)**：等待股價重新帶量突破短期壓力確認反轉後再行加碼。
4. 🛡️ **單一標的風險上限**：
   任何單一個股佔整體投資組合的比例建議不超過 5%～10%，切勿為了攤平而讓資金過度集中於單一標的。

> ⚠️ **教育提醒**：本分析僅供學習參考，不構成投資建議。投資前請評估自身的風險承受度與資金規劃。
${isKeyPrompt ? '\n\n*💡 提示：若想與 Gemini 2.5 Flash 自由對話，可至設定頁面輸入免費的 Gemini API Key。*' : ''}`;
      }

      return `### 📉 Educational Guide: Buying on Dips & "Averaging Down" for **${name} (${ticker})**

When **${ticker}** is dropping or pulling back, deciding whether to "buy more" is one of the most critical dilemmas beginner investors face. In market terms, this is called **"Averaging Down"** or **"Buying the Dip"**.

Here is how disciplined investors evaluate this setup objectively:

---

#### 1. Current Technical Reality for ${ticker}
- **Current Price**: ${curr}${price.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}% today)
- **50-Day Moving Average (${curr}${indicators.sma50.toFixed(2)})**: ${isAboveSma50 ? `Price is holding above its 50-day SMA, confirming the medium-term primary trend remains **intact**. Short-term pullbacks in an ongoing uptrend are normal consolidations.` : `Price has slipped below its 50-day SMA, indicating short-term momentum has softened. The next major institutional floor is the 200-day SMA (${curr}${indicators.sma200.toFixed(2)}).`}
- **RSI Momentum (${indicators.rsi.toFixed(1)})**: ${indicators.rsi < 35 ? `RSI is approaching the oversold boundary (<35), indicating heavy selling that historically sets up statistical bounce windows.` : `RSI is currently in the neutral zone (${indicators.rsi.toFixed(1)}). The market is in balanced equilibrium, not extreme panic.`}

---

#### 2. The 4 Golden Rules Before Buying More on a Drop
1. ⚠️ **Never "Catch a Falling Knife" Blindly**:
   Just because a stock is cheaper today does NOT mean it cannot fall another 5% or 10%. Wait for selling volume to dry up and for price to print a green stabilization candle before committing fresh cash.
2. 🏛️ **Broad Index ETF vs. Single Stock Risk**:
   ${isEtf 
     ? `Because **${ticker} is a diversified index fund** tracking top US companies, individual company bankruptcy risk is eliminated. Historically, broad market indices recover from 100% of pullbacks over multi-year horizons, making disciplined Dollar-Cost Averaging (DCA) a proven mathematical strategy.`
     : `Because **${ticker} is an individual company stock**, you must verify *why* it is dropping. Is it normal broad-market weakness, or has the company's core business/earnings deteriorated? Averaging down on failing business fundamentals compounds losses.`}
3. 🪜 **The Staged Tranche Rule (Never Buy All at Once)**:
   Never deploy 100% of your remaining capital on one dip. Divide your dry powder into **3 tranches**:
   - **Tranche 1 (30%)**: Initial pilot entry at current levels.
   - **Tranche 2 (30%)**: If price tests major support (e.g., 50-day SMA at ${curr}${indicators.sma50.toFixed(2)}).
   - **Tranche 3 (40%)**: Only after price confirms a reversal with rising volume.
4. 🛡️ **Position Sizing Boundary**:
   Keep single holdings to a safe percentage of your total net worth (typically maximum 5–10% for individual stocks, or higher for broad index funds). Never invest money you might need within the next 3 to 5 years.

---

#### 💡 Educational Verdict
If you are a **long-term DCA investor**, routine buying on dips lowers your lifetime cost basis. But if you are a **short-term trader**, never add to a losing position without a predefined stop-loss plan!

> ⚠️ **Educational Reminder**: Technical indicators measure historical probabilities, never guaranteed outcomes. Always use proper position sizing and never invest funds you cannot afford to risk.
${isKeyPrompt ? '\n\n*💡 Note: To chat dynamically with Gemini 2.5 Flash, you can add your free Gemini API key in App Settings.*' : ''}`;
    }

    // Intent 2: RSI & System Timing Signals
    const isRsiTiming = 
      q.includes('rsi') || 
      q.includes('relative strength') || 
      (q.includes('timing') && (q.includes('signal') || q.includes('stance') || q.includes('indicator') || q.includes('setup') || q.includes('explain'))) ||
      q.includes('system stance') ||
      q.includes('buy signal') || 
      q.includes('sell signal') ||
      q.includes('時機訊號') || q.includes('時機信號') || q.includes('指標解析');

    if (isRsiTiming) {
      const rsiZone = indicators.rsi > 70 
        ? (isZh ? '超買區 (>70)' : 'Overbought (>70)') 
        : indicators.rsi < 30 
        ? (isZh ? '超賣區 (<30)' : 'Oversold (<30)') 
        : (isZh ? `中性平衡區 (${indicators.rsi.toFixed(1)})` : `Neutral Equilibrium (${indicators.rsi.toFixed(1)})`);

      const rsiMeaning = indicators.rsi > 70
        ? (isZh ? '買方力道迅速推升股價，如同拉至極限的橡皮筋，短期內可能面臨獲利了結回檔或動能耗竭。' : 'Buyers have rushed in rapidly. Like a rubber band stretched to its limit, the risk of a short-term pullback is elevated.')
        : indicators.rsi < 30
        ? (isZh ? '賣方拋售極端強烈，如同被壓到底部的彈簧，歷史統計上常在此區間觸發技術性反彈。' : 'Intense selling has pushed sentiment to an extreme. Like a compressed spring, statistical snap-back rallies often initiate here.')
        : (isZh ? `買賣雙方力道均衡，無極端超買或超賣現象，股價在正常波動通道內運行。` : `Buyers and sellers are evenly balanced without extreme exhaustion in either direction.`);

      if (isZh) {
        return `### 🎯 技術面與時機訊號深度解析：**${name} (${ticker})**

以下為您拆解今日的系統時機訊號與 RSI 動能指標的實際意涵：

---

#### 1. RSI 相對強弱指標 (**${indicators.rsi.toFixed(1)}**)
RSI 是一個介於 0 至 100 之間的動能擺盪指標，衡量近 14 個交易日內買賣力道的相對強度：
- **當前讀數判讀**：**${rsiZone}** —— ${rsiMeaning}
- **橡皮筋日常比喻**：目前 RSI 為 ${indicators.rsi.toFixed(1)}，橡皮筋鬆緊度適中，意味著後續不論向上突破或向下整理，技術指標上皆有充足的發揮空間，未處於極度緊繃狀態。

---

#### 2. 系統時機評定：**${signal.action}** (${signal.title})
- **為什麼系統給予此評定？**
  - **趨勢均線支撐**：當前股價 (${curr}${price.toFixed(2)}) ${isAboveSma50 ? `位於 50 日均線 (${curr}${indicators.sma50.toFixed(2)}) 之上，維持中期多方架構。` : `低於 50 日均線，顯示短期上檔存在均線反壓。`}
  - **MACD 動能排列**：MACD 目前呈現 **${indicators.macd.crossover.toUpperCase()}**，動能${indicators.macd.crossover === 'bullish' ? '正向上加速' : indicators.macd.crossover === 'bearish' ? '偏向回檔整理' : '維持中性'}。
- **初學者核心比喻**：*${signal.beginnerAnalogy}*

---

#### 3. 新手實戰應對建議
- **考慮建倉者**：**${signal.action}** 訊號代表當前處於可關注的窗口，但應採用「分批進場」而非單筆全買。
- **已經持有者**：只要股價未跌破關鍵停損點 (${curr}${indicators.sma50.toFixed(2)})，持續持有符合趨勢順勢交易原則。

> ⚠️ **教育提醒**：技術指標衡量的是歷史機率，絕非獲利保證。進場前請務必設定停損點與部位大小。
${isKeyPrompt ? '\n\n*💡 提示：若想與 Gemini 2.5 Flash 自由對話，可至設定頁面輸入免費的 Gemini API Key。*' : ''}`;
      }

      return `### 🎯 Technical Setup & Timing Signals: **${name} (${ticker})**

Here is a plain-English breakdown of today's timing signals, RSI momentum, and how to interpret them without financial jargon:

---

#### 1. RSI (Relative Strength Index: **${indicators.rsi.toFixed(1)}**)
RSI measures speed and magnitude of recent price moves on a 0 to 100 scale:
- **Current Reading**: **${rsiZone}** — ${rsiMeaning}
- **The Rubber Band Analogy**: At ${indicators.rsi.toFixed(1)}, the rubber band is comfortably loose—giving the stock room to expand in either direction without being technically overstretched.

---

#### 2. System Timing Stance: **${signal.action}** (${signal.title})
- **Why this stance?**
  - **Price vs 50-Day SMA (${curr}${indicators.sma50.toFixed(2)})**: ${isAboveSma50 ? 'Price is trading above key institutional support, confirming a healthy trend.' : 'Price is below intermediate support, advising patience.'}
  - **MACD Alignment**: Momentum is currently **${indicators.macd.crossover.toUpperCase()}** (${indicators.macd.crossover === 'bullish' ? 'accelerating upward' : indicators.macd.crossover === 'bearish' ? 'decelerating downward' : 'balanced'}).
- **Beginner Analogy**: *${signal.beginnerAnalogy}*

---

#### 3. How to Use This Information
- **For New Buyers**: A **${signal.action}** stance indicates favorable macro conditions, but always practice tranche entries rather than all-in lump sums.
- **For Existing Holders**: As long as ${ticker} maintains support above ${curr}${indicators.sma50.toFixed(2)}, holding your position aligns with the dominant market trend.

> ⚠️ **Educational Reminder**: Technical indicators measure historical probabilities, never guaranteed outcomes. Always use proper position sizing and risk management.
${isKeyPrompt ? '\n\n*💡 Note: To chat dynamically with Gemini 2.5 Flash, you can add your free Gemini API key in App Settings.*' : ''}`;
    }

    // Intent 3: MACD Momentum
    const isMacd = 
      q.includes('macd') || 
      q.includes('moving average convergence') || 
      (q.includes('crossover') && !q.includes('sma')) || 
      q.includes('histogram') || 
      q.includes('fast line') || 
      q.includes('slow line');

    if (isMacd) {
      if (isZh) {
        return `### 🌊 MACD 指標與動能原理：**${name} (${ticker})**

MACD（指數平滑異同移動平均線）是全球專業交易員最喜愛的動能指標之一，它由快線 (12 EMA)、慢線 (26 EMA) 及訊號線 (9 EMA) 組成。

---

#### 1. ${ticker} 當前 MACD 數值
- **交叉狀態 (Crossover)**：**${indicators.macd.crossover.toUpperCase()}**
- **MACD 快線**：${indicators.macd.macdLine.toFixed(2)}
- **訊號線 (Signal Line)**：${indicators.macd.signalLine.toFixed(2)}
- **柱狀圖 (Histogram)**：${indicators.macd.histogram.toFixed(2)}

---

#### 2. 初學者汽車比喻：油門 vs 車速
- **股價**就像汽車當前的速度。
- **MACD** 就像汽車的「油門踏板」。
- 當出現**黃金交叉 (Bullish Crossover)** 時，代表駕駛正大力踩下油門，推動車速加快；而**死亡交叉 (Bearish Crossover)** 則意味著駕駛鬆開油門踩下煞車，動能正在減弱。

---

#### 3. 實戰注意事項
單獨使用 MACD 容易產生假訊號。最佳實務是將 MACD 與 **50 日移動平均線 (${curr}${indicators.sma50.toFixed(2)})** 及 RSI 互相佐證，只有當趨勢與動能同向時，進場勝率最高。

> ⚠️ **教育提醒**：指標為歷史數據衍生，切勿以此作為單一交易依據。
${isKeyPrompt ? '\n\n*💡 提示：若想與 Gemini 2.5 Flash 自由對話，可至設定頁面輸入免費的 Gemini API Key。*' : ''}`;
      }

      return `### 🌊 MACD Momentum Analysis: **${name} (${ticker})**

The Moving Average Convergence Divergence (MACD) is one of the most widely respected momentum indicators in finance. It tracks the relationship between a fast 12-day exponential moving average and a slower 26-day EMA.

---

#### 1. Current MACD Setup for ${ticker}
- **Crossover Status**: **${indicators.macd.crossover.toUpperCase()}**
- **MACD Line**: ${indicators.macd.macdLine.toFixed(2)}
- **Signal Line**: ${indicators.macd.signalLine.toFixed(2)}
- **Histogram**: ${indicators.macd.histogram.toFixed(2)}

---

#### 2. The Car Analogy: Speedometer vs. Gas Pedal
- The **Stock Price** is the current speed of the car.
- The **MACD Line** is the gas pedal.
- A **Bullish Crossover** means the driver is stepping on the accelerator—momentum is building upwards. A **Bearish Crossover** means the driver lifted off the pedal and is braking.

---

#### 3. How Traders Use MACD
Never trade MACD in isolation. Always confirm with the broader trendline (such as the 50-day SMA at ${curr}${indicators.sma50.toFixed(2)}) and RSI. When momentum and trend align, confidence is highest.

> ⚠️ **Educational Reminder**: Technical indicators measure historical probabilities, never guaranteed outcomes. Always use proper position sizing and never invest funds you cannot afford to risk.
${isKeyPrompt ? '\n\n*💡 Note: To chat dynamically with Gemini 2.5 Flash, you can add your free Gemini API key in App Settings.*' : ''}`;
    }

    // Intent 4: Selling / Exit Strategy / Stop Loss / Taking Profit
    const isSellingProfit = 
      q.includes('sell') || 
      q.includes('take profit') || 
      q.includes('taking profit') || 
      q.includes('exit') || 
      q.includes('stop loss') || 
      q.includes('cut loss') || 
      q.includes('lock in') || 
      q.includes('trim') || 
      q.includes('賣出') || q.includes('停損') || q.includes('止盈') || q.includes('獲利了結');

    if (isSellingProfit) {
      if (isZh) {
        return `### 🛡️ 專業賣出與停利停損原則：**${name} (${ticker})**

「會買的是徒弟，會賣的才是師傅。」許多投資人在股票上漲時不知道何時該獲利了結，在下跌時又因恐慌而砍在最低點。

以下是專業投資人的 3 大理性賣出觸發條件：

---

#### 1. 理性退場的 3 個條件
1. **投資假設破滅 (Thesis Violation)**：當初買進 ${ticker} 的根本原因已經不存在（例如核心競爭力喪失、行業政策巨變）。
2. **資產配置再平衡 (Rebalancing)**：因為股價大漲，${ticker} 佔您總資產的比例過高，為了控制風險必須賣出部分持股以回歸平衡。
3. **觸及紀律停損線 (Stop-Loss Hit)**：價格跌破關鍵技術防線（例如 50 日均線 ${curr}${indicators.sma50.toFixed(2)} 或設定的 7%～8% 停損位）。

---

#### 2. 分批停利法 (Scale-Out Strategy)
避免「全買全賣」的二分法思維：
- **當獲利達 15%～20%**：可考慮賣出 1/3 持股鎖定利潤，將本金收回一部分。
- **保留剩餘 2/3 持股**：利用「移動停利 (Trailing Stop)」讓利潤繼續奔跑，直到股價跌破關鍵支撐。

> ⚠️ **教育提醒**：絕不要在市場恐慌大跌當天盲目衝動賣出，應遵循事先擬定的交易計畫。
${isKeyPrompt ? '\n\n*💡 提示：若想與 Gemini 2.5 Flash 自由對話，可至設定頁面輸入免費的 Gemini API Key。*' : ''}`;
      }

      return `### 🛡️ Disciplined Selling & Profit-Taking Strategies: **${name} (${ticker})**

"Buying is easy; knowing when to sell is where wealth is preserved." Many investors struggle between greed (holding too long) and fear (panic selling at the bottom).

Here are the 3 disciplined rules professional investors follow:

---

#### 1. The 3 Legitimate Exit Triggers
1. **Thesis Violation**: The fundamental reason you bought ${ticker} is no longer true (e.g., permanent loss of competitive moat).
2. **Portfolio Rebalancing**: A position has appreciated so much that it represents an outsized risk to your total net worth.
3. **Risk Boundary Violation**: Price breaks key technical floors (e.g., the 50-day SMA at ${curr}${indicators.sma50.toFixed(2)} or a predetermined 7–8% trailing stop).

---

#### 2. The Scale-Out (Partial Exit) Technique
Instead of an all-or-nothing mindset:
- **Lock In Increments**: Sell 1/3 of your position after a solid gain (e.g., +15–20%) to take your initial risk off the table.
- **Let the Winner Run**: Keep the remaining 2/3 with a trailing stop to capture multi-month trend expansions.

> ⚠️ **Educational Reminder**: Technical indicators measure historical probabilities, never guaranteed outcomes. Always use proper position sizing and never invest funds you cannot afford to risk.
${isKeyPrompt ? '\n\n*💡 Note: To chat dynamically with Gemini 2.5 Flash, you can add your free Gemini API key in App Settings.*' : ''}`;
    }

    // Intent 5: Dollar-Cost Averaging (DCA) Strategy
    const isDca = 
      q.includes('dca') || 
      q.includes('dollar cost') || 
      q.includes('dollar-cost') || 
      q.includes('定期定額') || 
      q.includes('定投') || 
      q.includes('how often should i buy');

    if (isDca) {
      if (isZh) {
        return `### ⏱️ 定期定額 (DCA) 投資教學：**${name} (${ticker})**

定期定額 (Dollar-Cost Averaging, DCA) 是一種不論股價高低，在固定時間投入固定金額的長線投資策略。

---

#### 1. 為什麼 DCA 能戰勝 90% 的短線交易者？
- **自動攤平成本**：當 ${ticker} 股價上漲時，您自動買進較少股數；當股價拉回時，相同的金額會買進更多股數，從而在數學上降低您的長期平均成本。
- **免除人性弱點**：克服追高殺跌與試圖猜測市場頭部與底部的心理壓力。

---

#### 2. ${ticker} 的 DCA 執行守則
- **適合度**：${isEtf ? `${ticker} 是全市場或大盤指數 ETF，極度適合做為 5～10 年以上的核心 DCA 標的。` : `${ticker} 為單一個股，建議將其作為核心指數 DCA 之外的衛星配置（不超過 5–10%）。`}
- **頻率選擇**：每月發薪日隔天投入固定金額，持續 3 年以上效果最為顯著。

> ⚠️ **教育提醒**：定期定額需要充足的現金流與長線耐性，切勿動用緊急備用金。
${isKeyPrompt ? '\n\n*💡 提示：若想與 Gemini 2.5 Flash 自由對話，可至設定頁面輸入免費的 Gemini API Key。*' : ''}`;
      }

      return `### ⏱️ Dollar-Cost Averaging (DCA) Strategy: **${name} (${ticker})**

Dollar-Cost Averaging (DCA) is the systematic process of investing a fixed dollar amount at regular intervals (e.g., monthly), regardless of whether the market is up or down.

---

#### 1. Why DCA Outperforms 90% of Market Timers
- **Mathematical Advantage**: You naturally acquire more shares when prices dip and fewer shares when prices peak, lowering your average cost per share over time.
- **Removes Emotion**: Eliminates the fear of buying at the top or the hesitation of buying during market dips.

---

#### 2. Executing DCA on ${ticker}
- **Fit for DCA**: ${isEtf ? `${ticker} is an index-based ETF, making it an ideal cornerstone for a multi-year DCA program.` : `${ticker} is an individual stock. Keep individual stock DCA allocations to a modest satellite portion of your overall portfolio.`}
- **Routine Execution**: Set an automated calendar schedule (e.g., 1st of every month) and review allocations annually rather than daily.

> ⚠️ **Educational Reminder**: DCA requires financial resilience. Only invest discretionary capital you do not need for short-term living expenses.
${isKeyPrompt ? '\n\n*💡 Note: To chat dynamically with Gemini 2.5 Flash, you can add your free Gemini API key in App Settings.*' : ''}`;
    }

    // Default Fallback: Comprehensive contextual multi-turn response
    const rsiDesc = indicators.rsi > 70 
      ? (isZh ? `處於超買狀態 (>70)，短期買氣強烈，但需留意追高風險。` : `overbought (>70), meaning buyer enthusiasm has pushed prices high rapidly and short-term exhaustion is possible.`)
      : indicators.rsi < 30 
      ? (isZh ? `處於超賣狀態 (<30)，強烈拋售壓力可能孕育技術性反彈契機。` : `oversold (<30), meaning intense selling pressure has created potential rubber-band rebound conditions.`)
      : (isZh ? `處於中性平衡區 (${indicators.rsi.toFixed(1)})，買賣雙方力道均衡。` : `in the neutral zone (${indicators.rsi.toFixed(1)}), reflecting balanced buying and selling forces.`);

    const macdDesc = indicators.macd.crossover === 'bullish'
      ? (isZh ? `呈現**多頭黃金交叉**，短期動能領先長期均線向上加速。` : `in a **bullish crossover**, where short-term momentum is rising faster than longer-term trends.`)
      : indicators.macd.crossover === 'bearish'
      ? (isZh ? `呈現**空頭死亡交叉**，股價短期動能趨緩或面臨拉回壓力。` : `in a **bearish crossover**, where downward price action is accelerating.`)
      : (isZh ? `維持中性排列。` : `moving in neutral alignment.`);

    if (isZh) {
      return `### 🎓 市場智慧導師解答：**${name} (${ticker})**

針對您的提問：「*${userQuery || '請分析當前市況'}*」，以下為您提供客觀的市場教學觀點：

---

#### 1. 當前即時行情與技術定位
- **現價**：${curr}${price.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)
- **系統時機信號**：**${signal.action}** (${signal.title})
- **RSI 動能 (14 日)**：${indicators.rsi.toFixed(1)} —— ${rsiDesc}
- **MACD 動能**：${macdDesc}
- **關鍵均線**：50 日均線在 ${curr}${indicators.sma50.toFixed(2)}（目前股價${isAboveSma50 ? '維持其上，中期多頭健全' : '跌破其下，建議提高警覺'}）。

---

#### 2. 初學者核心比喻
*${signal.beginnerAnalogy}*

---

#### 3. 多空情境沙盤推演
- **多方續強情境 (Bull Case)**：若買方持續守穩於 50 日均線 (${curr}${indicators.sma50.toFixed(2)}) 之上，整體多頭趨勢延續，拉回可視為分批觀察契機。
- **空方防守情境 (Bear Case)**：若跌破近期支撐平台，可能引發技術性停損賣壓，切勿單筆盲目重壓。

> ⚠️ **教育提醒**：技術指標衡量的是歷史機率，絕非獲利保證。請務必落實部位管理與資金控管。
${isKeyPrompt ? '\n\n*💡 提示：若想與 Gemini 2.5 Flash 自由對話，可至設定頁面輸入免費的 Gemini API Key。*' : ''}`;
    }

    return `### 🎓 Educational Market Analysis: **${name} (${ticker})**

Regarding your question: "*${userQuery || 'Analysis of current market setup'}*", here is an objective educational breakdown:

---

#### 1. Live Technical Stance & Data
- **Current Price**: ${curr}${price.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}% today)
- **System Timing Stance**: **${signal.action}** (${signal.title})
- **RSI (14-Day: ${indicators.rsi.toFixed(1)})**: ${ticker}'s RSI is currently ${rsiDesc}
- **MACD Alignment**: ${macdDesc}
- **Moving Average Anchor**: 50-day SMA is at ${curr}${indicators.sma50.toFixed(2)} (${isAboveSma50 ? 'price is above, confirming medium-term trend stability' : 'price is below, suggesting short-term caution'}).

---

#### 2. Key Beginner Analogy
*${signal.beginnerAnalogy}*

---

#### 3. Scenario Planning (Bull vs. Bear)
- **Bullish Outlook**: If buyers maintain volume above the 50-day moving average (${curr}${indicators.sma50.toFixed(2)}), upside continuation remains supported.
- **Bearish Caution**: A break below key support could trigger additional stop-loss cascades. Always maintain staged buying discipline rather than single lump sums.

> ⚠️ **Educational Reminder**: Technical indicators measure historical probabilities, never guaranteed outcomes. Always use proper position sizing and never invest funds you cannot afford to risk.
${isKeyPrompt ? '\n\n*💡 Note: To chat dynamically with Gemini 2.5 Flash, you can add your free Gemini API key in App Settings.*' : ''}`;
  }
}

export const aiTutorService = new AITutorService();
